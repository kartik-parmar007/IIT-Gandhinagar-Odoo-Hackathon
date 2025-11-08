import { useUser } from "@clerk/clerk-react";

// Check if current user is admin
export const useIsAdmin = () => {
  const { user, isLoaded } = useUser();
  const adminEmail = "kartikparmar9773@gmail.com";
  
  if (!isLoaded || !user) return false;
  
  const userEmail = user.emailAddresses?.[0]?.emailAddress || user.primaryEmailAddress?.emailAddress || "";
  return userEmail === adminEmail;
};

// Get user email from Clerk
export const getUserEmail = (user) => {
  if (!user) return "";
  return user.emailAddresses?.[0]?.emailAddress || user.primaryEmailAddress?.emailAddress || "";
};

