import Navbar from "../components/Navbar";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

export default function Tasks() {
  return (
    <>
      <SignedIn>
        <Navbar />
        <div style={{ padding: "20px" }}>
          <h1>Tasks</h1>
          <p>Your tasks content goes here...</p>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

