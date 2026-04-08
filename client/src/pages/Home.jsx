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
    <div style={styles.pageWrapper}>
      {/* Decorative Background Elements */}
      <div style={styles.blurCircle1}></div>
      <div style={styles.blurCircle2}></div>

      <Navbar />

      <div style={styles.container}>
        {/* Hero Section */}
        <div style={styles.hero}>
          <div style={styles.heroContent}>
            <div style={styles.badge}>✨ Welcome to the future of workflow</div>
            <h1 style={styles.title}>
              Unleash your team's{" "}
              <span style={styles.titleGradient}>Potential</span>
            </h1>
            <p style={styles.description}>
              Streamline your workflow with comprehensive project management, 
              task tracking, financial operations, and robust collaboration—all unified in OneFlow.
            </p>

            <SignedOut>
              <div style={styles.ctaContainer}>
                <SignInButton mode="modal">
                  <button style={styles.primaryButton}>
                    Get Started Free
                  </button>
                </SignInButton>
                <button 
                  onClick={() => {
                    const el = document.getElementById('features');
                    if(el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={styles.secondaryButton}
                >
                  Explore Features
                </button>
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
        <div id="features" style={styles.featuresSection}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Everything you need to <span style={styles.highlightText}>scale</span></h3>
            <p style={styles.sectionSubtitle}>Powerful tools designed to simplify complex operations effortlessly.</p>
          </div>
          
          <div style={styles.featuresGrid}>
            <div style={{...styles.featureCard, ...styles.glassmorphism}} className="card-hover">
              <div style={styles.iconWrapper} className="icon-hover">
                <span style={styles.featureIcon}>📋</span>
              </div>
              <h4 style={styles.featureTitle}>Project Management</h4>
              <p style={styles.featureDesc}>
                Create and manage projects seamlessly with end-to-end tracking capabilities and unified data.
              </p>
            </div>

            <div style={{...styles.featureCard, ...styles.glassmorphism}} className="card-hover">
              <div style={styles.iconWrapper} className="icon-hover">
                <span style={styles.featureIcon}>⚡</span>
              </div>
              <h4 style={styles.featureTitle}>Task Tracking</h4>
              <p style={styles.featureDesc}>
                Organize tasks with interactive Kanban boards, assign members, and monitor progress in real-time.
              </p>
            </div>

            <div style={{...styles.featureCard, ...styles.glassmorphism}} className="card-hover">
              <div style={styles.iconWrapper} className="icon-hover">
                <span style={styles.featureIcon}>💳</span>
              </div>
              <h4 style={styles.featureTitle}>Financial Operations</h4>
              <p style={styles.featureDesc}>
                Manage invoices, purchase orders, sales forms, and deep expense analytics at a glance.
              </p>
            </div>

            <div style={{...styles.featureCard, ...styles.glassmorphism}} className="card-hover">
              <div style={styles.iconWrapper} className="icon-hover">
                <span style={styles.featureIcon}>👥</span>
              </div>
              <h4 style={styles.featureTitle}>Team Collaboration</h4>
              <p style={styles.featureDesc}>
                Deploy granular role-based access for Team Members, Project Managers, and Finance roles.
              </p>
            </div>

            <div style={{...styles.featureCard, ...styles.glassmorphism}} className="card-hover">
              <div style={styles.iconWrapper} className="icon-hover">
                <span style={styles.featureIcon}>📈</span>
              </div>
              <h4 style={styles.featureTitle}>Data Analytics</h4>
              <p style={styles.featureDesc}>
                Gain actionable insights instantly via comprehensive dashboards mirroring real-time metrics.
              </p>
            </div>

            <div style={{...styles.featureCard, ...styles.glassmorphism}} className="card-hover">
              <div style={styles.iconWrapper} className="icon-hover">
                <span style={styles.featureIcon}>🛡️</span>
              </div>
              <h4 style={styles.featureTitle}>Bank-grade Security</h4>
              <p style={styles.featureDesc}>
                Fully encrypted, enterprise-grade architecture supported by robust Clerk authentication.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <div style={styles.footerContent}>
            <h2 style={styles.footerLogo}>OneFlow</h2>
            <p style={styles.footerText}>
              © 2025 OneFlow. Built for IIT Gandhinagar Odoo Hackathon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    position: "relative",
    background: "var(--bg-primary)",
    minHeight: "100vh",
    overflow: "hidden",
  },
  blurCircle1: {
    position: "absolute",
    top: "-15%",
    left: "-10%",
    width: "500px",
    height: "500px",
    background: "radial-gradient(circle, rgba(124, 58, 237, 0.4) 0%, transparent 70%)",
    filter: "blur(80px)",
    zIndex: 0,
    pointerEvents: "none",
  },
  blurCircle2: {
    position: "absolute",
    bottom: "20%",
    right: "-10%",
    width: "600px",
    height: "600px",
    background: "radial-gradient(circle, rgba(255, 68, 68, 0.25) 0%, transparent 70%)",
    filter: "blur(100px)",
    zIndex: 0,
    pointerEvents: "none",
  },
  container: {
    position: "relative",
    zIndex: 1,
    paddingTop: "70px",
    color: "var(--text-primary)",
  },
  hero: {
    padding: "120px 20px 80px",
    textAlign: "center",
  },
  heroContent: {
    maxWidth: "900px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  badge: {
    padding: "8px 16px",
    background: "rgba(124, 58, 237, 0.1)",
    border: "1px solid rgba(124, 58, 237, 0.3)",
    borderRadius: "20px",
    color: "#a78bfa",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "30px",
    backdropFilter: "blur(10px)",
    boxShadow: "0 4px 10px rgba(124, 58, 237, 0.1)",
  },
  title: {
    fontSize: "clamp(40px, 6vw, 72px)",
    fontWeight: "800",
    marginBottom: "24px",
    lineHeight: "1.1",
    letterSpacing: "-0.02em",
  },
  titleGradient: {
    background: "linear-gradient(135deg, #a78bfa 0%, #ff4444 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  description: {
    fontSize: "18px",
    lineHeight: "1.7",
    marginBottom: "48px",
    color: "var(--text-secondary)",
    maxWidth: "650px",
  },
  ctaContainer: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  primaryButton: {
    padding: "16px 36px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#fff",
    background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(124, 58, 237, 0.3)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  secondaryButton: {
    padding: "16px 36px",
    fontSize: "16px",
    fontWeight: "600",
    color: "var(--text-primary)",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid var(--border-color)",
    backdropFilter: "blur(10px)",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  featuresSection: {
    padding: "100px 20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  sectionHeader: {
    textAlign: "center",
    marginBottom: "80px",
  },
  sectionTitle: {
    fontSize: "clamp(32px, 4vw, 48px)",
    fontWeight: "700",
    marginBottom: "16px",
    color: "var(--text-primary)",
  },
  highlightText: {
    color: "#7c3aed",
  },
  sectionSubtitle: {
    fontSize: "18px",
    color: "var(--text-secondary)",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "32px",
  },
  glassmorphism: {
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.07)",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.1)",
  },
  featureCard: {
    borderRadius: "20px",
    padding: "40px 30px",
    textAlign: "left",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
  },
  iconWrapper: {
    width: "60px",
    height: "60px",
    borderRadius: "16px",
    background: "rgba(124, 58, 237, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "24px",
    border: "1px solid rgba(124, 58, 237, 0.2)",
  },
  featureIcon: {
    fontSize: "28px",
  },
  featureTitle: {
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "12px",
    color: "var(--text-primary)",
  },
  featureDesc: {
    fontSize: "15px",
    lineHeight: "1.7",
    color: "var(--text-secondary)",
  },
  footer: {
    padding: "60px 20px 40px",
    borderTop: "1px solid var(--border-color)",
    background: "rgba(0, 0, 0, 0.2)",
  },
  footerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
  },
  footerLogo: {
    fontSize: "24px",
    fontWeight: "800",
    background: "linear-gradient(135deg, #a78bfa 0%, #ff4444 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: 0,
  },
  footerText: {
    fontSize: "14px",
    color: "var(--text-secondary)",
  },
};

