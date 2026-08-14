import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "../../services/api";

function AddEmployee({ onNavigate }) {
  const [formData, setFormData] = useState({
    employeeID: "",
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
    employmentType: "",
    role: "",
    jobLocation: "",
    status: "Active",
  });

  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDropdownData();
  }, []);

  const loadDropdownData = async () => {
    try {
      const [deptRes, desigRes] = await Promise.all([
        api.get("/employees/departments"),
        api.get("/employees/designations"),
      ]);
      if (deptRes.success) setDepartments(deptRes.data);
      if (desigRes.success) setDesignations(desigRes.data);
    } catch (error) {
      console.error("Load dropdown error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBackToEmployees = () => {
  if (onNavigate) {
    onNavigate("employees", null, true);
  }
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

      const response = await api.post("/employees", employeeData);

        if (response.success) {
        if (onNavigate) {
            onNavigate("employees", null, true);
        }
        }
      else {
        setError(response.message || "Failed to add employee");
      }
    } catch (error) {
      console.error("Add employee error:", error);
      setError(error.message || "Failed to add employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
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

      <form className="admin-form-card" onSubmit={handleSubmit}>
        <section className="admin-form-section">
          <div className="admin-form-section-header">
            <h2>Personal Details</h2>
            <p>Enter the employee's personal information.</p>
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
                placeholder="Enter first name"
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
                placeholder="Enter last name"
              />
            </div>

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
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
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
                placeholder="Enter address"
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
                type="text"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
              />
            </div>

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

        <section className="admin-form-section">
          <div className="admin-form-section-header">
            <h2>Employment Details</h2>
            <p>Enter the employee's organization information.</p>
          </div>

          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label htmlFor="employeeID">
                Employee ID <span>*</span>
              </label>
              <input
                id="employeeID"
                name="employeeID"
                type="text"
                value={formData.employeeID}
                onChange={handleChange}
                placeholder="EMP004"
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
                <option value="">Select department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
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
                <option value="">Select designation</option>
                {designations.map((desig) => (
                  <option key={desig.id} value={desig.id}>
                    {desig.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-form-group">
              <label htmlFor="reportingManagerId">
                Reporting Manager
              </label>
                <input
                  id="reportingManagerId"
                  name="reportingManagerId"
                  type="number"
                  placeholder="Enter reporting manager ID"
                  value={formData.reportingManagerId}
                  onChange={handleChange}
                />

                </div>

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
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Intern">Intern</option>
              </select>
            </div>
            <div className="admin-form-group">
                <label htmlFor="role">
                  Role <span>*</span>
                </label>

                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

             <div className="admin-form-group">
              <label htmlFor="jobLocation">
                Job Location <span>*</span>
              </label>

              <select
                id="jobLocation"
                name="jobLocation"
                value={formData.jobLocation}
                onChange={handleChange}
                required
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">Onsite</option>
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
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </section>

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