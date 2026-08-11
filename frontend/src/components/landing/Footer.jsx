function Footer() {
  return (
    <footer className="landing-footer">
      <div className="footer-container">

        <div className="footer-main">

          {/* Brand */}

          <div className="footer-brand">

            <a href="#home" className="footer-logo">
              <div className="footer-logo-box">
                H
              </div>

              <div className="footer-brand-text">
                <strong>HRMS</strong>
                <span>Human Resource Management</span>
              </div>
            </a>

            <p>
              Manage your workforce through one centralized
              platform designed for modern HR operations.
            </p>

          </div>


          {/* Quick Links */}

          <div className="footer-links">

            <h3>Quick Links</h3>

            <nav>

              <a href="#home">
                Home
              </a>

              <a href="#features">
                Features
              </a>

              <a href="#solutions">
                Solutions
              </a>

              <a href="#how-it-works">
                How It Works
              </a>

              <a href="#security">
                Security
              </a>

              <a href="#contact">
                Contact
              </a>

            </nav>

          </div>

        </div>


        {/* Bottom */}

        <div className="footer-bottom">

          <p>
            © 2026 HRMS. All rights reserved.
          </p>

          <div className="footer-bottom-links">

            <a href="#">
              Privacy Policy
            </a>

            <a href="#">
              Terms of Service
            </a>

          </div>

        </div>

      </div>
    </footer>
  );
}

export default Footer;