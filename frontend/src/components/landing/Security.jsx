function Security() {
  const securityItems = [
    {
      title: "Secure Access",
      description:
        "Control who can access employee and HR information across the platform.",
    },
    {
      title: "Role-Based Permissions",
      description:
        "Give users access based on their responsibilities and organizational roles.",
    },
    {
      title: "Protected Information",
      description:
        "Keep employee records and HR data within a centralized and controlled environment.",
    },
    {
      title: "Centralized Control",
      description:
        "Manage HR operations and access from one centralized platform.",
    },
  ];

  return (
    <section className="security-section" id="security">
      <div className="security-container">

        {/* Left Content */}

        <div className="security-content">

          <span className="security-eyebrow">
            SECURITY & CONTROL
          </span>

          <h2>
            Your workforce data
            <br />
            deserves protection.
          </h2>

          <p>
            Keep important HR information protected with controlled
            access, centralized management and role-based permissions.
          </p>

          <div className="security-badge">
            <span className="security-badge-icon">✓</span>

            <div>
              <strong>Built with security in mind</strong>

              <span>
                Designed for controlled HR operations
              </span>
            </div>
          </div>

        </div>


        {/* Right Content */}

        <div className="security-panel">

          {securityItems.map((item) => (
            <div
              className="security-item"
              key={item.title}
            >
              <div className="security-item-icon">
                ✓
              </div>

              <div className="security-item-content">
                <h3>{item.title}</h3>

                <p>{item.description}</p>
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Security;