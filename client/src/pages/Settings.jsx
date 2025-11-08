import Navbar from "../components/Navbar";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

export default function Settings() {
  return (
    <>
      <SignedIn>
        <Navbar />
        <div style={{ padding: "20px" }}>
          <h1>Settings</h1>
          <p>Your settings content goes here...</p>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

