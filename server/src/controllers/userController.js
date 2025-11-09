import User from "../models/User.js";
import { createClerkClient } from "@clerk/backend";

// @desc    Get all users for task assignment (simplified)
// @route   GET /api/users
// @access  Authenticated users
export const getUsers = async (req, res) => {
  try {
    const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
    
    // Get all users from Clerk
    const users = await clerk.users.getUserList({
      limit: 500,
    });

    // Get user roles from database
    const dbUsers = await User.find();
    const userRolesMapById = new Map(dbUsers.map(u => [u.clerkUserId, u]));
    const userRolesMapByEmail = new Map(dbUsers.map(u => [u.email, u]));

    // Format users data for task assignment (simplified)
    const formattedUsers = users.data.map((user) => {
      const email = user.emailAddresses?.[0]?.emailAddress || user.primaryEmailAddress?.emailAddress || "";
      const dbUser = userRolesMapById.get(user.id) || userRolesMapByEmail.get(email);
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || email.split("@")[0];
      
      return {
        id: user.id,
        email: email,
        fullName: fullName,
        name: fullName, // For backward compatibility
        imageUrl: user.imageUrl || "",
      };
    });

    res.status(200).json({
      success: true,
      data: formattedUsers,
      total: users.totalCount || formattedUsers.length,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch users",
    });
  }
};
