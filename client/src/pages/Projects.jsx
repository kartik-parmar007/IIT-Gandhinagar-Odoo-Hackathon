import Navbar from "../components/Navbar";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

export default function Projects() {
  return (
    <>
      <SignedIn>
        <Navbar />
        <div style={{ padding: "20px" }}>
          <h1>Projects</h1>
          <p>Your projects content goes here...</p>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

