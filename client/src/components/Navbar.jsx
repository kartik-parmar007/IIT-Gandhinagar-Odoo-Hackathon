import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { useIsAdmin } from "../utils/adminCheck";

export default function Navbar() {
  const isAdmin = useIsAdmin();

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>My App</h2>

      <div style={styles.menu}>
        <SignedOut>
          <SignInButton mode="modal">
            <button style={styles.btn}>Login</button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <Link to="/projects" style={styles.link}>
            Projects
          </Link>
          <Link to="/tasks" style={styles.link}>
            Tasks
          </Link>
          <Link to="/settings" style={styles.link}>
            Settings
          </Link>
          {isAdmin && (
            <Link to="/admin" style={styles.link}>
              Admin
            </Link>
          )}
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
