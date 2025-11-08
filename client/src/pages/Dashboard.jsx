import { useUser } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const { user } = useUser();

  return (
    <>
      <Navbar />

      <div style={{ marginTop: "70px", padding: "20px", minHeight: "calc(100vh - 70px)" }}>
        <h1>Dashboard</h1>
        <p>
          Welcome,{" "}
          <strong>
            {user?.fullName || user?.primaryEmailAddress.emailAddress}
          </strong>
        </p>

        <p>Your Dashboard content goes here...</p>
      </div>
    </>
  );
}
