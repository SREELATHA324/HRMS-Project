import { useEffect, useState } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Building2,
  Briefcase,
  UserCheck,
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
            response.message || "Failed to load employee"
          );
        }
      } catch (err) {
        setError(err.message || "Failed to load employee");
      } finally {
        setLoading(false);
      }
    };

    if (employeeId) {
      fetchEmployee();
    }
  }, [employeeId]);

  if (loading) {
    return (
      <div className="admin-page">
        <p>Loading employee details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="admin-form-error">
          {error}
        </div>

        <button
          className="admin-secondary-button"
          onClick={() => onNavigate("employees")}
        >
          <ArrowLeft size={17} />
          Back to Employees
        </button>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="admin-page">
        <p>Employee not found.</p>
      </div>
    );
  }

  return (
    <div className="admin-page">

      {/* Header */}
      <div className="admin-page-header">
        <div>
          <button
            type="button"
            className="admin-back-button"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={17} />
            Back to Employees
          </button>

          <h1>Employee Details</h1>
          <p>
            View complete employee information.
          </p>
        </div>
      </div>

      {/* Profile */}
      <div className="employee-details-card">

        <div className="employee-details-profile">
          <div className="employee-details-avatar">
            {employee.firstName?.charAt(0)}
          </div>

          <div>
            <h2>
              {employee.firstName} {employee.lastName}
            </h2>

            <p>{employee.email}</p>

            <span
              className={`employee-status ${
                employee.status?.toLowerCase()
              }`}
            >
              {employee.status}
            </span>
          </div>
        </div>

        {/* Personal Information */}
        <section className="employee-details-section">
          <h3>
            <User size={18} />
            Personal Information
          </h3>

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
        </section>

        {/* Address */}
        <section className="employee-details-section">
          <h3>
            <MapPin size={18} />
            Address Information
          </h3>

          <div className="employee-details-grid">

            <DetailItem
              label="Address"
              value={employee.address}
            />

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
        </section>

        {/* Employment */}
        <section className="employee-details-section">
          <h3>
            <Briefcase size={18} />
            Employment Information
          </h3>

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
              value={employee.reporting_manager_name || "Not assigned"}
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
        </section>

      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="employee-detail-item">
      <span>{label}</span>
      <strong>{value || "—"}</strong>
    </div>
  );
}

function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default EmployeeDetails;