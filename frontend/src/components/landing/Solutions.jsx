const solutions = [
  {
    number: "01",
    title: "Admin",
    description:
      "Manage users, roles, permissions, organization settings and system configuration.",
  },
  {
    number: "02",
    title: "HR",
    description:
      "Manage employees, attendance, leave, documents, onboarding and HR operations.",
  },
  {
    number: "03",
    title: "Manager",
    description:
      "Manage team attendance, leave requests, expenses and performance activities.",
  },
  {
    number: "04",
    title: "Employee",
    description:
      "Access your profile, attendance, leave, payslips, expenses and documents.",
  },
];

function Solutions() {
  return (
    <section className="solutions-section" id="solutions">
      <div className="section-container">

        <div className="section-heading">
          <span>BUILT FOR EVERY ROLE</span>

          <h2>
            One platform.
            <br />
            Every role.
          </h2>

          <p>
            Role-based access gives every user the information
            and tools relevant to their responsibilities.
          </p>
        </div>

        <div className="solutions-grid">

          {solutions.map((solution) => (
            <article
              className="solution-card"
              key={solution.number}
            >
              <span className="solution-number">
                {solution.number}
              </span>

              <h3>{solution.title}</h3>

              <p>{solution.description}</p>

              <span className="solution-arrow">
                →
              </span>
            </article>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Solutions;