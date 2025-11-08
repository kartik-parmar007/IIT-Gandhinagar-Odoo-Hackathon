import Navbar from "../components/Navbar";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";

export default function Home() {
  return (
    <>
      <Navbar />

      <div style={{ marginTop: "70px", padding: "20px", minHeight: "calc(100vh - 70px)" }}>
        <h1>Welcome to My Website</h1>
        <p>This is the public homepage.</p>

        <SignedOut>
          <SignInButton mode="modal">
            <button style={{ padding: "10px 20px" }}>Login</button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <a href="/dashboard">
            <button style={{ padding: "10px 20px", marginTop: "10px" }}>
              Go to Dashboard
            </button>
          </a>
        </SignedIn>
      </div>
    </>
  );
}
