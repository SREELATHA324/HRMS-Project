import { Menu, X } from "lucide-react";
import { useState } from "react";

function Navbar({ onLogin }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="landing-navbar">
      <div className="navbar-container">

        {/* Brand */}
        <a
          href="#home"
          className="navbar-brand"
          onClick={closeMenu}
        >
          <div className="navbar-logo">H</div>

          <div className="navbar-brand-text">
            <strong>HRMS</strong>
            <span>Human Resource Management</span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="navbar-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#solutions">Solutions</a>
          <a href="#contact">Contact</a>
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

          <button
            type="button"
            className="navbar-start"
            onClick={onLogin}
          >
            Register
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="navbar-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="navbar-mobile-menu">

          <a href="#home" onClick={closeMenu}>
            Home
          </a>

          <a href="#features" onClick={closeMenu}>
            Features
          </a>

          <a href="#solutions" onClick={closeMenu}>
            Solutions
          </a>

          <a href="#contact" onClick={closeMenu}>
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

            <button
              type="button"
              className="navbar-mobile-start"
              onClick={() => {
                closeMenu();
                onLogin();
              }}
            >
              Register
            </button>
          </div>

        </div>
      )}
    </header>
  );
}

export default Navbar;