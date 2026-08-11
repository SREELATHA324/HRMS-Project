const steps = [
  {
    number: "01",
    title: "Manage",
    description:
      "Centralize employee information and manage the complete employee lifecycle.",
  },
  {
    number: "02",
    title: "Automate",
    description:
      "Simplify attendance, leave, payroll, expenses and everyday HR processes.",
  },
  {
    number: "03",
    title: "Analyze",
    description:
      "Use reports and workforce insights to make informed business decisions.",
  },
];

function HowItWorks() {
  return (
    <section className="how-section" id="how-it-works">
      <div className="section-container">

        <div className="section-heading">
          <span>HOW HRMS WORKS</span>

          <h2>
            HR operations,
            <br />
            simplified.
          </h2>

          <p>
            Connect your HR processes from employee management
            to workforce analytics through one centralized platform.
          </p>
        </div>

        <div className="steps-grid">

          {steps.map((step) => (
            <article
              className="step-card"
              key={step.number}
            >
              <div className="step-top">
                <span className="step-number">
                  {step.number}
                </span>

                <span className="step-line"></span>
              </div>

              <div className="step-content">
                <span className="step-label">
                  STEP {step.number}
                </span>

                <h3>{step.title}</h3>

                <p>{step.description}</p>
              </div>
            </article>
          ))}

        </div>

      </div>
    </section>
  );
}

export default HowItWorks;