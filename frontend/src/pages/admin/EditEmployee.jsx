import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../../services/api";

function EditEmployee({ employeeId, onNavigate }) {
  const [formData, setFormData] = useState({
    employeeCode: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    departmentId: "",
    designationId: "",
    reportingManagerId: "",
    joiningDate: "",
    employmentType: "Full-time",
    status: "Active",
  });

  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* --------------------------------
     Load employee + dropdown data
  -------------------------------- */

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [employeeRes, deptRes, desigRes] =
          await Promise.all([
            api.get(`/employees/${employeeId}`),
            api.get("/employees/departments"),
            api.get("/employees/designations"),
          ]);

        if (!employeeRes.success) {
          throw new Error(
            employeeRes.message ||
              "Failed to load employee"
          );
        }

        if (deptRes.success) {
          setDepartments(deptRes.data);
        }

        if (desigRes.success) {
          setDesignations(desigRes.data);
        }

        const employee = employeeRes.data;

        setFormData({
          employeeCode: employee.employeeCode || "",
          firstName: employee.firstName || "",
          lastName: employee.lastName || "",
          email: employee.email || "",
          phone: employee.phone || "",
          dateOfBirth: formatDateForInput(
            employee.dateOfBirth
          ),
          gender: employee.gender || "",
          address: employee.address || "",
          city: employee.city || "",
          state: employee.state || "",
          country: employee.country || "",
          pincode: employee.pincode || "",

          departmentId:
            employee.departmentId ??
            employee.department_id ??
            "",

          designationId:
            employee.designationId ??
            employee.designation_id ??
            "",

          reportingManagerId:
            employee.reportingManagerId ??
            employee.reporting_manager_id ??
            "",

          joiningDate: formatDateForInput(
            employee.joiningDate
          ),

          employmentType:
            employee.employmentType || "Full-time",

          status: employee.status || "Active",
        });
      } catch (err) {
        console.error(
          "Load edit employee error:",
          err
        );

        setError(
          err.message ||
            "Failed to load employee details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (employeeId) {
      loadData();
    } else {
      setError("Employee ID is missing.");
      setLoading(false);
    }
  }, [employeeId]);

  /* --------------------------------
     Input change
  -------------------------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* --------------------------------
     Back
  -------------------------------- */

  const handleBackToEmployees = () => {
    if (onNavigate) {
      onNavigate("employees", null, true);
    }
  };

  /* --------------------------------
     Submit
  -------------------------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSaving(true);

    try {
      const employeeData = {
        employeeCode: formData.employeeCode,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth || null,
        gender: formData.gender || null,

        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pincode: formData.pincode,

        departmentId:
          formData.departmentId === ""
            ? null
            : Number(formData.departmentId),

        designationId:
          formData.designationId === ""
            ? null
            : Number(formData.designationId),

        reportingManagerId:
          formData.reportingManagerId === ""
            ? null
            : Number(formData.reportingManagerId),

        employmentType:
          formData.employmentType,

        status: formData.status,
      };

      const response = await api.put(
        `/employees/${employeeId}`,
        employeeData
      );

      if (!response.success) {
        setError(
          response.message ||
            "Failed to update employee"
        );
        return;
      }

      // Replace the edit page in history.
      if (onNavigate) {
        onNavigate("employees", null, true);
      }
    } catch (err) {
      console.error(
        "Update employee error:",
        err
      );

      setError(
        err.message ||
          "Failed to update employee"
      );
    } finally {
      setSaving(false);
    }
  };

  /* --------------------------------
     Loading
  -------------------------------- */

  if (loading) {
    return (
      <div className="admin-page">
        <div className="employee-details-loading">
          <div className="employee-loading-spinner"></div>
          <p>Loading employee details...</p>
        </div>
      </div>
    );
  }

  /* --------------------------------
     Error
  -------------------------------- */

  if (error && !formData.firstName) {
    return (
      <div className="admin-page">
        <div className="employee-details-error">
          <div className="employee-error-icon">
            !
          </div>

          <h2>Unable to load employee</h2>

          <p>{error}</p>

          <button
            type="button"
            className="admin-secondary-button"
            onClick={handleBackToEmployees}
          >
            <ArrowLeft size={17} />
            Back to Employees
          </button>
        </div>
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
            onClick={handleBackToEmployees}
          >
            <ArrowLeft size={17} />
            Back to Employees
          </button>

          <h1>Edit Employee</h1>

          <p>
            Update the employee's organization
            information.
          </p>
        </div>
      </div>

      {error && (
        <div className="admin-form-error">
          {error}
        </div>
      )}

      <form
        className="admin-form-card"
        onSubmit={handleSubmit}
      >

        {/* Personal Details */}

        <section className="admin-form-section">
          <div className="admin-form-section-header">
            <h2>Personal Details</h2>

            <p>
              Update the employee's personal
              information.
            </p>
          </div>

          <div className="admin-form-grid">

            <div className="admin-form-group">
              <label htmlFor="firstName">
                First Name <span>*</span>
              </label>

              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="lastName">
                Last Name
              </label>

              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                disabled
                readOnly
              />

              <small className="admin-field-note">
                Email cannot be changed from this
                form.
              </small>
            </div>

            <div className="admin-form-group">
              <label htmlFor="phone">
                Phone
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="dateOfBirth">
                Date of Birth
              </label>

              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="gender">
                Gender
              </label>

              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">
                  Select gender
                </option>

                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            <div className="admin-form-group full-width">
              <label htmlFor="address">
                Address
              </label>

              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="city">
                City
              </label>

              <input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="state">
                State
              </label>

              <input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="country">
                Country
              </label>

              <input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="pincode">
                Pincode
              </label>

              <input
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
              />
            </div>

          </div>
        </section>

        {/* Employment Details */}

        <section className="admin-form-section">

          <div className="admin-form-section-header">
            <h2>Employment Details</h2>

            <p>
              Update the employee's organization
              information.
            </p>
          </div>

          <div className="admin-form-grid">

            <div className="admin-form-group">
              <label htmlFor="employeeCode">
                Employee Code <span>*</span>
              </label>

              <input
                id="employeeCode"
                name="employeeCode"
                type="text"
                value={formData.employeeCode}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="departmentId">
                Department <span>*</span>
              </label>

              <select
                id="departmentId"
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select department
                </option>

                {departments.map((dept) => (
                  <option
                    key={dept.id}
                    value={dept.id}
                  >
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-form-group">
              <label htmlFor="designationId">
                Designation <span>*</span>
              </label>

              <select
                id="designationId"
                name="designationId"
                value={formData.designationId}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select designation
                </option>

                {designations.map((desig) => (
                  <option
                    key={desig.id}
                    value={desig.id}
                  >
                    {desig.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-form-group">
              <label htmlFor="reportingManagerId">
                Reporting Manager
              </label>

              <select
                id="reportingManagerId"
                name="reportingManagerId"
                value={formData.reportingManagerId}
                onChange={handleChange}
              >
                <option value="">
                  Select reporting manager
                </option>
              </select>
            </div>

            <div className="admin-form-group">
              <label htmlFor="joiningDate">
                Joining Date
              </label>

              <input
                id="joiningDate"
                name="joiningDate"
                type="date"
                value={formData.joiningDate}
                disabled
                readOnly
              />

              <small className="admin-field-note">
                Joining date cannot be changed from
                this form.
              </small>
            </div>

            <div className="admin-form-group">
              <label htmlFor="employmentType">
                Employment Type <span>*</span>
              </label>

              <select
                id="employmentType"
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                required
              >
                <option value="Full-time">
                  Full-time
                </option>

                <option value="Part-time">
                  Part-time
                </option>

                <option value="Contract">
                  Contract
                </option>

                <option value="Intern">
                  Intern
                </option>
              </select>
            </div>

            <div className="admin-form-group">
              <label htmlFor="status">
                Status
              </label>

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>
              </select>
            </div>

          </div>
        </section>

        {/* Actions */}

        <div className="admin-form-actions">

          <button
            type="button"
            className="admin-secondary-button"
            onClick={handleBackToEmployees}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="admin-primary-button"
            disabled={saving}
          >
            {saving
              ? "Saving Changes..."
              : "Save Changes"}
          </button>

        </div>

      </form>
    </div>
  );
}

/* --------------------------------
   Date helper
-------------------------------- */

function formatDateForInput(date) {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  const year = parsedDate.getFullYear();
  const month = String(
    parsedDate.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    parsedDate.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default EditEmployee;