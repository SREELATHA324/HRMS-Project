function CTA({ onLogin }) {
  return (
    <section className="cta-section">
      <div className="cta-container">

        <div className="cta-decoration cta-decoration-one"></div>
        <div className="cta-decoration cta-decoration-two"></div>

        <div className="cta-content">

          <span className="cta-eyebrow">
            TAKE THE NEXT STEP
          </span>

          <h2>
            Ready to simplify your HR operations?
          </h2>

          <p>
            Bring your workforce processes together with one
            centralized platform designed for modern HR teams.
          </p>

          <div className="cta-actions">

            <button
              type="button"
              className="cta-primary"
              onClick={onLogin}
            >
              Sign In
            </button>

            <a
              href="#contact"
              className="cta-secondary"
              onClick={(e) => {
                e.preventDefault();

                document.getElementById("contact")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
            >
              Talk to Our Team
            </a>

          </div>

        </div>
      </div>
    </section>
  );
}

export default CTA;