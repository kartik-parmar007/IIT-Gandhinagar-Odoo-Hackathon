// Simple admin check utility
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

