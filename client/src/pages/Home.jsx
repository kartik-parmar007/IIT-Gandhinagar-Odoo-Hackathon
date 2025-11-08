import Navbar from "../components/Navbar";
import { SignedIn, SignedOut, SignInButton, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Home() {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();

  // Redirect logged-in users to Projects page
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate("/projects");
    }
  }, [isLoaded, isSignedIn, navigate]);

  return (
    <>
      <Navbar />

      <div style={styles.container}>
        {/* Hero Section */}
        <div style={styles.hero}>
          <div style={styles.heroContent}>
            <h1 style={styles.title}>
              <span style={styles.titleGradient}>OneFlow</span>
            </h1>
            <h2 style={styles.subtitle}>Project Management Made Simple</h2>
            <p style={styles.description}>
              Streamline your workflow with comprehensive project management, 
              task tracking, financial operations, and team collaboration - all in one place.
            </p>

            <SignedOut>
              <div style={styles.ctaContainer}>
                <SignInButton mode="modal">
                  <button style={styles.primaryButton}>
                    Get Started
                  </button>
                </SignInButton>
              </div>
            </SignedOut>

            <SignedIn>
              <div style={styles.ctaContainer}>
                <button 
                  onClick={() => navigate("/projects")} 
                  style={styles.primaryButton}
                >
                  Go to Projects
                </button>
                <button 
                  onClick={() => navigate("/dashboard")} 
                  style={styles.secondaryButton}
                >
                  View Dashboard
                </button>
              </div>
            </SignedIn>
          </div>
        </div>

        {/* Features Section */}
        <div style={styles.featuresSection}>
          <h3 style={styles.sectionTitle}>Key Features</h3>
          <div style={styles.featuresGrid}>
            <div style={styles.featureCard} className="card-hover">
              <div style={styles.featureIcon} className="icon-hover">📊</div>
              <h4 style={styles.featureTitle}>Project Management</h4>
              <p style={styles.featureDesc}>
                Create and manage projects with comprehensive tracking and team collaboration tools.
              </p>
            </div>

            <div style={styles.featureCard} className="card-hover">
              <div style={styles.featureIcon} className="icon-hover">✅</div>
              <h4 style={styles.featureTitle}>Task Tracking</h4>
              <p style={styles.featureDesc}>
                Organize tasks with Kanban boards, assign team members, and track progress in real-time.
              </p>
            </div>

            <div style={styles.featureCard} className="card-hover">
              <div style={styles.featureIcon} className="icon-hover">💰</div>
              <h4 style={styles.featureTitle}>Financial Operations</h4>
              <p style={styles.featureDesc}>
                Manage invoices, purchase orders, sales orders, and expenses with ease.
              </p>
            </div>

            <div style={styles.featureCard} className="card-hover">
              <div style={styles.featureIcon} className="icon-hover">👥</div>
              <h4 style={styles.featureTitle}>Team Collaboration</h4>
              <p style={styles.featureDesc}>
                Role-based access control with Team Members, Project Managers, and Sales/Finance roles.
              </p>
            </div>

            <div style={styles.featureCard} className="card-hover">
              <div style={styles.featureIcon} className="icon-hover">📈</div>
              <h4 style={styles.featureTitle}>Analytics Dashboard</h4>
              <p style={styles.featureDesc}>
                Get insights with comprehensive dashboards showing project stats and financial metrics.
              </p>
            </div>

            <div style={styles.featureCard} className="card-hover">
              <div style={styles.featureIcon} className="icon-hover">🔒</div>
              <h4 style={styles.featureTitle}>Secure & Reliable</h4>
              <p style={styles.featureDesc}>
                Enterprise-grade security with Clerk authentication and granular permission management.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            © 2025 OneFlow. Built for IIT Gandhinagar Odoo Hackathon.
          </p>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    minHeight: "calc(100vh - 70px)",
    marginTop: "70px",
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
    transition: "all 0.3s ease",
  },
  hero: {
    padding: "80px 20px",
    textAlign: "center",
    background: "linear-gradient(135deg, #7c3aed 0%, #ff4444 100%)",
    position: "relative",
    overflow: "hidden",
  },
  heroContent: {
    maxWidth: "800px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  title: {
    fontSize: "56px",
    fontWeight: "700",
    marginBottom: "20px",
    lineHeight: "1.2",
  },
  titleGradient: {
    background: "linear-gradient(135deg, #fff 0%, #f0f0f0 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  subtitle: {
    fontSize: "28px",
    fontWeight: "500",
    marginBottom: "20px",
    color: "#f0f0f0",
  },
  description: {
    fontSize: "18px",
    lineHeight: "1.6",
    marginBottom: "40px",
    color: "#e0e0e0",
    maxWidth: "600px",
    margin: "0 auto 40px",
  },
  ctaContainer: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  primaryButton: {
    padding: "16px 40px",
    fontSize: "18px",
    fontWeight: "600",
    color: "#fff",
    background: "#1a1a1a",
    border: "2px solid #1a1a1a",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
  },
  secondaryButton: {
    padding: "16px 40px",
    fontSize: "18px",
    fontWeight: "600",
    color: "#fff",
    background: "transparent",
    border: "2px solid #fff",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  featuresSection: {
    padding: "80px 20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  sectionTitle: {
    fontSize: "36px",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: "60px",
    color: "var(--text-primary)",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "30px",
  },
  featureCard: {
    background: "var(--card-bg)",
    border: "1px solid var(--border-color)",
    borderRadius: "12px",
    padding: "30px",
    textAlign: "center",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },
  featureIcon: {
    fontSize: "48px",
    marginBottom: "20px",
    transition: "all 0.3s ease",
  },
  featureTitle: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "15px",
    color: "var(--text-primary)",
  },
  featureDesc: {
    fontSize: "15px",
    lineHeight: "1.6",
    color: "var(--text-secondary)",
  },
  footer: {
    padding: "30px 20px",
    textAlign: "center",
    borderTop: "1px solid var(--border-color)",
    background: "var(--bg-secondary)",
  },
  footerText: {
    fontSize: "14px",
    color: "var(--text-secondary)",
    margin: 0,
  },
};
