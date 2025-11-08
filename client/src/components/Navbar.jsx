import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>My App</h2>

      <div style={styles.menu}>
        <Link to="/" style={styles.link}>
          Home
        </Link>

        <SignedOut>
          <SignInButton mode="modal">
            <button style={styles.btn}>Login</button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <Link to="/dashboard" style={styles.link}>
            Dashboard
          </Link>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    padding: "15px 25px",
    background: "#1a1a1a",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: { margin: 0 },
  menu: { display: "flex", gap: "15px", alignItems: "center" },
  link: { color: "#fff", textDecoration: "none", fontSize: "16px" },
  btn: {
    padding: "8px 15px",
    cursor: "pointer",
    background: "#fff",
    border: 0,
  },
};
