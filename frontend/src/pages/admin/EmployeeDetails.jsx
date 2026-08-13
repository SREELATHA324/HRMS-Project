import { useEffect, useState } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  CalendarDays,
  MapPin,
  Briefcase,
} from "lucide-react";
import { api } from "../../services/api";

function EmployeeDetails({ employeeId, onNavigate }) {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/employees/${employeeId}`);

        if (response.success) {
          setEmployee(response.data);
        } else {
          setError(
            response.message || "Failed to load employee details."
          );
        }
      } catch (err) {
        setError(
          err.message || "Failed to load employee details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (employeeId) {
      fetchEmployee();
    } else {
      setError("Employee ID is missing.");
      setLoading(false);
    }
  }, [employeeId]);

  /* Loading */
  if (loading) {
    return (
      <div className="admin-page employee-details-page">
        <div className="employee-details-loading">
          <div className="employee-loading-spinner"></div>
          <p>Loading employee details...</p>
        </div>
      </div>
    );
  }

  /* Error */
  if (error) {
    return (
      <div className="admin-page employee-details-page">
        <div className="employee-details-error">
          <div className="employee-error-icon">!</div>

          <h2>Unable to load employee</h2>

          <p>{error}</p>

          <button
            type="button"
            className="admin-secondary-button"
            onClick={() =>
              onNavigate("employees", null, true)
            }
          >
            <ArrowLeft size={17} />
            Back to Employees
          </button>
        </div>
      </div>
    );
  }

  /* Employee not found */
  if (!employee) {
    return (
      <div className="admin-page employee-details-page">
        <div className="employee-details-error">
          <div className="employee-error-icon">!</div>

          <h2>Employee not found</h2>

          <p>
            The employee you're looking for could not be
            found.
          </p>

          <button
            type="button"
            className="admin-secondary-button"
            onClick={() =>
              onNavigate("employees", null, true)
            }
          >
            <ArrowLeft size={17} />
            Back to Employees
          </button>
        </div>
      </div>
    );
  }

  const fullName =
    `${employee.firstName || ""} ${
      employee.lastName || ""
    }`.trim() || "Employee";

  const avatarLetter =
    employee.firstName?.charAt(0)?.toUpperCase() ||
    employee.lastName?.charAt(0)?.toUpperCase() ||
    "E";

  return (
    <div className="admin-page employee-details-page">

      {/* Page Header */}
      <div className="employee-details-page-header">

        <div>
          <button
            type="button"
            className="employee-details-back"
            onClick={() =>
              onNavigate("employees", null, true)
            }
          >
            <ArrowLeft size={17} />
            Back to Employees
          </button>

          <h1>Employee Details</h1>

          <p>
            View complete employee information and
            organization details.
          </p>
        </div>

      </div>

      {/* Employee Profile Card */}
      <div className="employee-profile-card">

        <div className="employee-profile-main">

          <div className="employee-profile-avatar">
            {avatarLetter}
          </div>

          <div className="employee-profile-info">

            <div className="employee-profile-title-row">

              <div>
                <h2>{fullName}</h2>

                <p className="employee-profile-role">
                  {employee.designation_name ||
                    "Employee"}

                  {employee.department_name && (
                    <>
                      <span>•</span>
                      {employee.department_name}
                    </>
                  )}
                </p>
              </div>

              <span
                className={`employee-status employee-profile-status ${
                  employee.status?.toLowerCase() || ""
                }`}
              >
                {employee.status || "Unknown"}
              </span>

            </div>

            <div className="employee-profile-meta">

              <span>
                <Mail size={15} />
                {employee.email || "—"}
              </span>

              {employee.phone && (
                <span>
                  <Phone size={15} />
                  {employee.phone}
                </span>
              )}

              <span>
                Employee ID:{" "}
                <strong>
                  {employee.employeeCode || "—"}
                </strong>
              </span>

            </div>

          </div>
        </div>

      </div>

      {/* Personal Information */}
      <div className="employee-information-card">

        <SectionHeader
          icon={<User size={17} />}
          title="Personal Information"
          description="Basic personal information of the employee"
        />

        <div className="employee-details-grid">

          <DetailItem
            label="Employee Code"
            value={employee.employeeCode}
          />

          <DetailItem
            label="First Name"
            value={employee.firstName}
          />

          <DetailItem
            label="Last Name"
            value={employee.lastName}
          />

          <DetailItem
            label="Email"
            value={employee.email}
          />

          <DetailItem
            label="Phone"
            value={employee.phone}
          />

          <DetailItem
            label="Date of Birth"
            value={formatDate(employee.dateOfBirth)}
          />

          <DetailItem
            label="Gender"
            value={employee.gender}
          />

        </div>

      </div>

      {/* Employment Information */}
      <div className="employee-information-card">

        <SectionHeader
          icon={<Briefcase size={17} />}
          title="Employment Information"
          description="Organization and employment details"
        />

        <div className="employee-details-grid">

          <DetailItem
            label="Department"
            value={employee.department_name}
          />

          <DetailItem
            label="Designation"
            value={employee.designation_name}
          />

          <DetailItem
            label="Reporting Manager"
            value={
              employee.reporting_manager_name ||
              "Not assigned"
            }
          />

          <DetailItem
            label="Joining Date"
            value={formatDate(employee.joiningDate)}
          />

          <DetailItem
            label="Employment Type"
            value={employee.employmentType}
          />

          <DetailItem
            label="Status"
            value={employee.status}
          />

        </div>

      </div>

      {/* Address Information */}
      <div className="employee-information-card">

        <SectionHeader
          icon={<MapPin size={17} />}
          title="Address Information"
          description="Residential information of the employee"
        />

        <div className="employee-details-grid">

          <div className="employee-detail-item employee-detail-full">
            <span>Address</span>
            <strong>
              {employee.address || "—"}
            </strong>
          </div>

          <DetailItem
            label="City"
            value={employee.city}
          />

          <DetailItem
            label="State"
            value={employee.state}
          />

          <DetailItem
            label="Country"
            value={employee.country}
          />

          <DetailItem
            label="Pincode"
            value={employee.pincode}
          />

        </div>

      </div>

    </div>
  );
}

/* Section Header */
function SectionHeader({
  icon,
  title,
  description,
}) {
  return (
    <div className="employee-section-header">

      <div className="employee-section-icon">
        {icon}
      </div>

      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

    </div>
  );
}

/* Detail Item */
function DetailItem({ label, value }) {
  return (
    <div className="employee-detail-item">

      <span>{label}</span>

      <strong>
        {value || "—"}
      </strong>

    </div>
  );
}

/* Date Formatter */
function formatDate(date) {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default EmployeeDetails;