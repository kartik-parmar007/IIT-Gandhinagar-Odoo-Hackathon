import { useUser } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const { user } = useUser();

  return (
    <>
      <Navbar />

      <div style={{ padding: "20px" }}>
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
