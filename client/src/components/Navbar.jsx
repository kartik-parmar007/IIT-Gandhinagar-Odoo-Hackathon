import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { useIsAdmin } from "../utils/adminCheck";
import { useTheme } from "../contexts/ThemeContext";

export default function Navbar() {
  const isAdmin = useIsAdmin();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (  
    <nav style={styles.nav}>
      <Link to="/projects" style={styles.logoLink} className="icon-hover">
        <img src="/logo.jpg" alt="One Flow" style={styles.logoImage} />
        <span style={styles.logoText}>One Flow</span>
      </Link>

      {/* Desktop Menu */}
      <div style={styles.menu} className="desktop-menu">
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
          <button
            onClick={toggleTheme}
            style={styles.themeToggle}
            className="theme-toggle-btn"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
          <div className="icon-hover">
            <UserButton />
          </div>
        </SignedIn>
      </div>

      {/* Mobile Menu Button */}
      <button
        style={styles.mobileMenuButton}
        onClick={toggleMobileMenu}
        className="mobile-menu-button"
        aria-label="Toggle menu"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="5" r="1" />
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="19" r="1" />
        </svg>
      </button>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div style={styles.mobileMenu} ref={menuRef} className="mobile-menu">
          <SignedOut>
            <SignInButton mode="modal">
              <button style={styles.mobileBtn} onClick={() => setIsMobileMenuOpen(false)}>
                Login
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Link
              to="/projects"
              style={styles.mobileLink}
              className="nav-link-hover"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Projects
            </Link>
            <Link
              to="/tasks"
              style={styles.mobileLink}
              className="nav-link-hover"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tasks
            </Link>
            <Link
              to="/settings"
              style={styles.mobileLink}
              className="nav-link-hover"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Settings
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                style={styles.mobileLink}
                className="nav-link-hover"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            <button
              onClick={toggleTheme}
              style={styles.mobileThemeToggle}
              className="theme-toggle-btn"
            >
              {theme === "dark" ? (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                  <span>Dark Mode</span>
                </>
              )}
            </button>
            <div style={styles.mobileUserButton} className="icon-hover">
              <UserButton />
            </div>
          </SignedIn>
        </div>
      )}
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
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid var(--border-color)",
    transition: "all 0.3s ease",
  },
  logoLink: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    textDecoration: "none",
    cursor: "pointer",
    zIndex: 1001,
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
  menu: { 
    display: "flex", 
    gap: "15px", 
    alignItems: "center" 
  },
  link: { 
    color: "var(--text-primary)", 
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
  mobileMenuButton: {
    display: "none",
    background: "transparent",
    border: "none",
    color: "var(--text-primary)",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "4px",
    transition: "all 0.3s ease",
    zIndex: 1001,
  },
  mobileMenu: {
    position: "fixed",
    top: "70px",
    right: "15px",
    background: "var(--bg-primary)",
    border: "1px solid var(--border-color)",
    borderRadius: "8px",
    padding: "20px",
    minWidth: "180px",
    maxWidth: "calc(100vw - 30px)",
    boxShadow: "0 8px 24px var(--shadow)",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    animation: "slideDown 0.3s ease",
  },
  mobileLink: {
    color: "var(--text-primary)",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "500",
    padding: "10px 0",
    transition: "all 0.3s ease",
    borderBottom: "1px solid var(--border-color)",
  },
  mobileBtn: {
    padding: "10px 15px",
    cursor: "pointer",
    background: "#fff",
    border: 0,
    borderRadius: "4px",
    fontWeight: "600",
    transition: "all 0.3s ease",
    width: "100%",
  },
  mobileUserButton: {
    padding: "10px 0",
    borderTop: "1px solid var(--border-color)",
    marginTop: "5px",
  },
  themeToggle: {
    background: "transparent",
    border: "1px solid var(--border-color)",
    color: "var(--text-primary)",
    cursor: "pointer",
    padding: "8px 12px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
  },
  mobileThemeToggle: {
    background: "transparent",
    border: "1px solid var(--border-color)",
    color: "var(--text-primary)",
    cursor: "pointer",
    padding: "10px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    transition: "all 0.3s ease",
    fontSize: "16px",
    fontWeight: "500",
    justifyContent: "center",
  },
};
