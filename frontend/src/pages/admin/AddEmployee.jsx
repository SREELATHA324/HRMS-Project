import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { api } from "../../services/api";
function AddEmployee({ onNavigate }) {
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBackToEmployees = () => {
    window.history.back();
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");
  setLoading(true);

  try {
    const employeeData = {
      ...formData,

      departmentId: Number(formData.departmentId),
      designationId: Number(formData.designationId),

      reportingManagerId:
        formData.reportingManagerId === ""
          ? null
          : Number(formData.reportingManagerId),
    };

    const response = await api.post(
      "/employees",
      employeeData
    );

    if (response.success) {
  window.history.back();
}
    else {
      setError(
        response.message || "Failed to add employee"
      );
    }
  } catch (error) {
    console.error("Add employee error:", error);

    setError(
      error.message || "Failed to add employee"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="admin-page">

      {/* Page Header */}
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

          <h1>Add Employee</h1>

          <p>
            Add a new employee to your organization.
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

        {/* =====================================================
            PERSONAL DETAILS
        ====================================================== */}

        <section className="admin-form-section">

          <div className="admin-form-section-header">
            <h2>Personal Details</h2>
            <p>Enter the employee's personal information.</p>
          </div>

          <div className="admin-form-grid">

            {/* First Name */}
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
                placeholder="Enter first name"
                required
              />
            </div>

            {/* Last Name */}
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
                placeholder="Enter last name"
              />
            </div>

            {/* Email */}
            <div className="admin-form-group">
              <label htmlFor="email">
                Email <span>*</span>
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="employee@company.com"
                required
              />
            </div>

            {/* Phone */}
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
                placeholder="Enter phone number"
              />
            </div>

            {/* Date of Birth */}
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

            {/* Gender */}
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
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Address */}
            <div className="admin-form-group full-width">
              <label htmlFor="address">
                Address
              </label>

              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                rows="3"
              />
            </div>

            {/* City */}
            <div className="admin-form-group">
              <label htmlFor="city">
                City
              </label>

              <input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
              />
            </div>

            {/* State */}
            <div className="admin-form-group">
              <label htmlFor="state">
                State
              </label>

              <input
                id="state"
                name="state"
                type="text"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter state"
              />
            </div>

            {/* Country */}
            <div className="admin-form-group">
              <label htmlFor="country">
                Country
              </label>

              <input
                id="country"
                name="country"
                type="text"
                value={formData.country}
                onChange={handleChange}
                placeholder="Enter country"
              />
            </div>

            {/* Pincode */}
            <div className="admin-form-group">
              <label htmlFor="pincode">
                Pincode
              </label>

              <input
                id="pincode"
                name="pincode"
                type="text"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Enter pincode"
              />
            </div>

          </div>
        </section>


        {/* =====================================================
            EMPLOYMENT DETAILS
        ====================================================== */}

        <section className="admin-form-section">

          <div className="admin-form-section-header">
            <h2>Employment Details</h2>
            <p>Enter the employee's organization information.</p>
          </div>

          <div className="admin-form-grid">

            {/* Employee Code */}
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
                placeholder="EMP004"
                required
              />
            </div>

            {/* Department */}
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

                <option value="1">
                  Engineering
                </option>

                <option value="2">
                  Human Resources
                </option>

                <option value="3">
                  Sales
                </option>

                <option value="4">
                  Finance
                </option>

                <option value="5">
                  Marketing
                </option>
              </select>
            </div>

            {/* Designation */}
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

                <option value="1">
                  Software Engineer
                </option>

                <option value="2">
                  Junior Developer
                </option>

                <option value="3">
                  HR Manager
                </option>

                <option value="4">
                  Sales Executive
                </option>

                <option value="5">
                  Finance Manager
                </option>
              </select>
            </div>

            {/* Reporting Manager */}
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

                <option value="1">
                  Administrator
                </option>

                <option value="2">
                  HR Manager
                </option>

                <option value="3">
                  Finance Manager
                </option>
              </select>
            </div>

            {/* Joining Date */}
            <div className="admin-form-group">
              <label htmlFor="joiningDate">
                Joining Date <span>*</span>
              </label>

              <input
                id="joiningDate"
                name="joiningDate"
                type="date"
                value={formData.joiningDate}
                onChange={handleChange}
                required
              />
            </div>

            {/* Employment Type */}
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

            {/* Status */}
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


        {/* =====================================================
            FORM ACTIONS
        ====================================================== */}

        <div className="admin-form-actions">

          <button
            type="button"
            className="admin-secondary-button"
            onClick={handleBackToEmployees}

          >
            Cancel
          </button>

          <button
            type="submit"
            className="admin-primary-button"
            disabled={loading}
            >
            {loading ? "Adding Employee..." : "Add Employee"}
            </button>
        </div>

      </form>
    </div>
  );
}

export default AddEmployee;