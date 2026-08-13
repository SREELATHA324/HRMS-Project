import { Menu, X } from "lucide-react";
import { useState } from "react";

function Navbar({ onLogin }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    closeMenu();
  };

  return (
    <header className="landing-navbar">
      <div className="navbar-container">

        {/* Brand */}
        <a
          href="#home"
          className="navbar-brand"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("home");
          }}
        >
          <div className="navbar-logo">H</div>

          <div className="navbar-brand-text">
            <strong>HRMS</strong>
            <span>Human Resource Management</span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="navbar-links">

          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("home");
            }}
          >
            Home
          </a>

          <a
            href="#features"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("features");
            }}
          >
            Features
          </a>

          <a
            href="#solutions"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("solutions");
            }}
          >
            Solutions
          </a>

          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("contact");
            }}
          >
            Contact
          </a>

        </nav>

        {/* Desktop Actions */}
        <div className="navbar-actions">

          <button
            type="button"
            className="navbar-login"
            onClick={onLogin}
          >
            Login
          </button>
          
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="navbar-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={
            menuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="navbar-mobile-menu">

          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("home");
            }}
          >
            Home
          </a>

          <a
            href="#features"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("features");
            }}
          >
            Features
          </a>

          <a
            href="#solutions"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("solutions");
            }}
          >
            Solutions
          </a>

          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("contact");
            }}
          >
            Contact
          </a>

          <div className="navbar-mobile-actions">

            <button
              type="button"
              className="navbar-mobile-login"
              onClick={() => {
                closeMenu();
                onLogin();
              }}
            >
              Login
            </button>

            
          </div>

        </div>
      )}
    </header>
  );
}

export default Navbar;