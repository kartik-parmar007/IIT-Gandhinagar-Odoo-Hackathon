// Simple admin check utility
import User from "../models/User.js";

export const isAdminEmail = (email) => {
  return email === "kartikparmar9773@gmail.com";
};

// Get user email from Clerk token or request
export const getUserEmail = async (req) => {
  try {
    // Try to get from Clerk token if available
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const { verifyToken, createClerkClient } = await import("@clerk/backend");
      const token = authHeader.replace("Bearer ", "");
      
      if (!process.env.CLERK_SECRET_KEY) {
        console.error("CLERK_SECRET_KEY is not set");
        return "";
      }
      
      try {
        const payload = await verifyToken(token, {
          secretKey: process.env.CLERK_SECRET_KEY,
        });
        
        // Try multiple ways to get email from payload
        let email = payload.email || 
                   payload.primary_email_address || 
                   payload.primaryEmailAddress || 
                   payload.email_addresses?.[0]?.email_address ||
                   payload.email_addresses?.[0]?.emailAddress ||
                   "";
        
        // If email not in payload, fetch user from Clerk API
        if (!email && payload.sub) {
          try {
            const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
            const user = await clerk.users.getUser(payload.sub);
            email = user.emailAddresses?.[0]?.emailAddress || 
                   user.primaryEmailAddress?.emailAddress || "";
          } catch (e) {
            console.error("Error fetching user from Clerk:", e.message);
          }
        }
        
        if (email) {
          console.log("Extracted email:", email);
          return email;
        }
      } catch (e) {
        console.error("Token verification failed:", e.message);
      }
    }
    
    // Fallback to other sources
    return req.auth?.sessionClaims?.email || req.user?.email || "";
  } catch (error) {
    console.error("Error getting user email:", error);
    return "";
  }
};

// Middleware to check if user is admin
export const requireAdmin = async (req, res, next) => {
  try {
    const email = await getUserEmail(req);
    
    console.log("Admin check - Email extracted:", email);
    console.log("Admin check - Is admin:", isAdminEmail(email));
    
    if (!email) {
      console.log("No email found in request");
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Could not verify user identity.",
      });
    }
    
    if (!isAdminEmail(email)) {
      console.log(`Access denied for email: ${email}`);
      return res.status(403).json({
        success: false,
        message: `Access denied. Admin privileges required. Your email: ${email}`,
      });
    }
    
    req.isAdmin = true;
    req.userEmail = email;
    next();
  } catch (error) {
    console.error("Admin check error:", error);
    return res.status(500).json({
      success: false,
      message: "Error checking admin status",
    });
  }
};

// Middleware to get user email (no restriction)
export const getUserEmailMiddleware = async (req, res, next) => {
  try {
    const email = await getUserEmail(req);
    req.userEmail = email;
    req.isAdmin = isAdminEmail(email);
    next();
  } catch (error) {
    req.userEmail = "";
    req.isAdmin = false;
    next();
  }
};

// Middleware to check specific permissions
export const requirePermission = (permissionKey) => {
  return async (req, res, next) => {
    try {
      const email = await getUserEmail(req);
      
      if (!email) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: Could not verify user identity.",
        });
      }
      
      // Admin has all permissions
      if (isAdminEmail(email)) {
        req.isAdmin = true;
        req.userEmail = email;
        return next();
      }

      // Check database for user permissions
      const user = await User.findOne({ email }).catch(err => {
        console.error("Error finding user by email:", err);
        return null;
      });
      
      if (!user) {
        console.log(`No user found in database for email: ${email}`);
        return res.status(403).json({
          success: false,
          message: "Access denied. User not found in system. Please contact administrator.",
        });
      }

      // Check if user has the required permission
      if (!user.permissions || !user.permissions[permissionKey]) {
        console.log(`User ${email} lacks permission: ${permissionKey}`);
        return res.status(403).json({
          success: false,
          message: `Access denied. ${permissionKey} permission required.`,
        });
      }

      req.userEmail = email;
      req.userRole = user.role;
      req.userPermissions = user.permissions;
      next();
    } catch (error) {
      console.error("Permission check error:", error);
      return res.status(500).json({
        success: false,
        message: "Error checking permissions",
      });
    }
  };
};

// Middleware to check if user is Project Manager or Admin
export const requireProjectManager = async (req, res, next) => {
  try {
    const email = await getUserEmail(req);
    
    if (!email) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Could not verify user identity.",
      });
    }
    
    // Admin has all permissions
    if (isAdminEmail(email)) {
      req.isAdmin = true;
      req.userEmail = email;
      return next();
    }

    // Check if user is Project Manager
    const user = await User.findOne({ email }).catch(err => {
      console.error("Error finding user by email:", err);
      return null;
    });
    
    if (!user || (user.role !== "project_manager" && user.role !== "admin")) {
      console.log(`User ${email} role check failed. Role: ${user?.role || 'not found'}`);
      return res.status(403).json({
        success: false,
        message: "Access denied. Project Manager role or higher required.",
      });
    }

    req.userEmail = email;
    req.userRole = user.role;
    req.userPermissions = user.permissions;
    next();
  } catch (error) {
    console.error("Project Manager check error:", error);
    return res.status(500).json({
      success: false,
      message: "Error checking role",
    });
  }
};

// Middleware to check if user is Team Member or higher
export const requireTeamMember = async (req, res, next) => {
  try {
    const email = await getUserEmail(req);
    
    if (!email) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Could not verify user identity.",
      });
    }
    
    // Admin has all permissions
    if (isAdminEmail(email)) {
      req.isAdmin = true;
      req.userEmail = email;
      return next();
    }

    // Check if user is Team Member or higher
    const user = await User.findOne({ email }).catch(err => {
      console.error("Error finding user by email:", err);
      return null;
    });
    
    if (!user || !['team_member', 'sales_finance', 'project_manager', 'admin'].includes(user.role)) {
      console.log(`User ${email} Team Member check failed. Role: ${user?.role || 'not found'}`);
      return res.status(403).json({
        success: false,
        message: "Access denied. Team Member role or higher required.",
      });
    }

    req.userEmail = email;
    req.userRole = user.role;
    req.userPermissions = user.permissions;
    next();
  } catch (error) {
    console.error("Team Member check error:", error);
    return res.status(500).json({
      success: false,
      message: "Error checking role",
    });
  }
};

// Middleware to check if user is Sales/Finance or Admin
export const requireSalesFinance = async (req, res, next) => {
  try {
    const email = await getUserEmail(req);
    
    if (!email) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Could not verify user identity.",
      });
    }
    
    // Admin has all permissions
    if (isAdminEmail(email)) {
      req.isAdmin = true;
      req.userEmail = email;
      return next();
    }

    // Check if user is Sales/Finance
    const user = await User.findOne({ email }).catch(err => {
      console.error("Error finding user by email:", err);
      return null;
    });
    
    if (!user || (user.role !== "sales_finance" && user.role !== "admin")) {
      console.log(`User ${email} Sales/Finance check failed. Role: ${user?.role || 'not found'}`);
      return res.status(403).json({
        success: false,
        message: "Access denied. Sales/Finance role or higher required.",
      });
    }

    req.userEmail = email;
    req.userRole = user.role;
    req.userPermissions = user.permissions;
    next();
  } catch (error) {
    console.error("Sales/Finance check error:", error);
    return res.status(500).json({
      success: false,
      message: "Error checking role",
    });
  }
};

