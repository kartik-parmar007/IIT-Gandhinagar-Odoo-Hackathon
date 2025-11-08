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
      <Link to="/projects" style={styles.logoLink} className="icon-hover">
        <img src="/logo.jpg" alt="One Flow" style={styles.logoImage} />
        <span style={styles.logoText}>One Flow</span>
      </Link>

      <div style={styles.menu}>
        <SignedOut>
          <SignInButton mode="modal">
            <button style={styles.btn}>Login</button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <Link to="/projects" style={styles.link} className="nav-link-hover">
            Projects
          </Link>
          <Link to="/tasks" style={styles.link} className="nav-link-hover">
            Tasks
          </Link>
          <Link to="/settings" style={styles.link} className="nav-link-hover">
            Settings
          </Link>
          {isAdmin && (
            <Link to="/admin" style={styles.link} className="nav-link-hover">
              Admin
            </Link>
          )}
          <div className="icon-hover">
            <UserButton />
          </div>
        </SignedIn>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    padding: "15px 25px",
    background: "#1a1a1a",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #333",
  },
  logoLink: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    textDecoration: "none",
    cursor: "pointer",
  },
  logoImage: {
    height: "40px",
    width: "auto",
    borderRadius: "4px",
  },
  logoText: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "600",
    color: "#fff",
    background: "linear-gradient(135deg, #a78bfa 0%, #ec4899 50%, #ef4444 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  menu: { display: "flex", gap: "15px", alignItems: "center" },
  link: { 
    color: "#fff", 
    textDecoration: "none", 
    fontSize: "16px",
    fontWeight: "500",
    transition: "all 0.3s ease",
  },
  btn: {
    padding: "8px 15px",
    cursor: "pointer",
    background: "#fff",
    border: 0,
    borderRadius: "4px",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },
};
