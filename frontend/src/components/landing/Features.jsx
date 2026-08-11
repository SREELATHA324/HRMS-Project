const features = [
  {
    number: "01",
    title: "Employee Management",
    description:
      "Centralize employee profiles, departments, designations and employment information.",
  },
  {
    number: "02",
    title: "Attendance Management",
    description:
      "Track check-in, check-out, working hours, shifts and attendance history.",
  },
  {
    number: "03",
    title: "Leave Management",
    description:
      "Manage leave balances, applications, policies and approval workflows.",
  },
  {
    number: "04",
    title: "Payroll Management",
    description:
      "Manage salary structures, allowances, deductions and employee payslips.",
  },
  {
    number: "05",
    title: "Expense Management",
    description:
      "Submit, review, approve and track employee expenses and reimbursements.",
  },
  {
    number: "06",
    title: "Document Management",
    description:
      "Securely manage employee documents, certificates, contracts and payslips.",
  },
];

function Features() {
  return (
    <section className="features-section" id="features">
      <div className="section-container">

        <div className="section-heading">
          <span>CORE HR CAPABILITIES</span>

          <h2>
            Everything HR needs.
            <br />
            One platform.
          </h2>

          <p>
            Manage the most important HR operations through a
            centralized and structured platform.
          </p>
        </div>

        <div className="features-grid">

          {features.map((feature) => (
            <article
              className="feature-card"
              key={feature.number}
            >
              <span className="feature-number">
                {feature.number}
              </span>

              <h3>{feature.title}</h3>

              <p>{feature.description}</p>

              <span className="feature-arrow">
                →
              </span>
            </article>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Features;