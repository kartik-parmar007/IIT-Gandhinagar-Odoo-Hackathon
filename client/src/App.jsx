import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import router from "./router";
import { initializeAPI } from "./services/api";

export default function App() {
  const { getToken } = useAuth();

  // Initialize API with Clerk's getToken function
  useEffect(() => {
    if (getToken) {
      initializeAPI(getToken);
      console.log("✅ API initialized with Clerk authentication");
    }
  }, [getToken]);

  return <RouterProvider router={router} />;
}
