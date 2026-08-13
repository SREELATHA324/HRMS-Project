import { useMemo, useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Pencil,
  UserX,
} from "lucide-react";
import "../../App.css";
import { api } from "../../services/api";

function Employees({ onNavigate }) {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/employees");
      if (response.success) {
        setEmployees(response.data || []);
      } else {
        setError(response.message || "Failed to load employees");
      }
    } catch (error) {
      console.error("Load employees error:", error);
      setError(error.message || "Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const searchValue = search.toLowerCase();
      const fullName =
        `${employee.firstName || ""} ${employee.lastName || ""}`
          .trim()
          .toLowerCase();
      const matchesSearch =
        fullName.includes(searchValue) ||
        (employee.email || "")
          .toLowerCase()
          .includes(searchValue) ||
        (employee.employeeCode || "")
          .toLowerCase()
          .includes(searchValue) ||
        (employee.department_name || "")
          .toLowerCase()
          .includes(searchValue);
      const matchesStatus =
        statusFilter === "All" ||
        employee.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [employees, search, statusFilter]);

  const handleViewEmployee = (id) => {
    if (onNavigate) {
      onNavigate("employeeDetails", id);
    } else {
      console.log("View employee:", id);
    }
  };

  const handleEditEmployee = (id) => {
    if (onNavigate) {
      onNavigate("editEmployee", id);
    } else {
      console.log("Edit employee:", id);
    }
  };

  const handleDeactivateEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this employee?")) {
      return;
    }
    try {
      const response = await api.put(`/employees/${id}`, {
        status: "Inactive",
      });
      if (response.success) {
        await loadEmployees();
      } else {
        const errorMsg = response.message || "Failed to deactivate employee";
        if (response.errors) {
          alert(errorMsg + "\n" + response.errors.join("\n"));
        } else {
          alert(errorMsg);
        }
      }
    } catch (error) {
      console.error("Deactivate error:", error);
      alert(error.message || "Failed to deactivate employee");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Employees</h1>
          <p>
            Manage employees and their organization information.
          </p>
        </div>
        <button
          type="button"
          className="admin-primary-button"
          onClick={() => onNavigate("addEmployee")}
        >
          <Plus size={17} />
          Add Employee
        </button>
      </div>

      {error && (
        <div className="admin-form-error">
          {error}
        </div>
      )}

      <div className="admin-table-toolbar">
        <div className="admin-page-search">
          <Search size={17} />
          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="admin-filter">
          <Filter size={16} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Employee Code</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Joining Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="admin-empty-state">
                    Loading employees...
                  </td>
                </tr>
              ) : filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => {
                  const employeeName =
                    `${employee.firstName || ""} ${
                      employee.lastName || ""
                    }`.trim();
                  return (
                    <tr key={employee.id}>
                      <td>
                        <div className="employee-table-user">
                          <div className="employee-avatar">
                            {employeeName
                              ? employeeName.charAt(0).toUpperCase()
                              : "E"}
                          </div>
                          <div>
                            <strong>
                              {employeeName || "N/A"}
                            </strong>
                            <span>
                              {employee.email || "N/A"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        {employee.employeeCode || "N/A"}
                      </td>
                      <td>
                        {employee.department_name || "N/A"}
                      </td>
                      <td>
                        {employee.designation_name || "N/A"}
                      </td>
                      <td>
                        {employee.joiningDate || "N/A"}
                      </td>
                      <td>
                        <span
                          className={`employee-status ${
                            employee.status
                              ?.toLowerCase() || ""
                          }`}
                        >
                          {employee.status || "N/A"}
                        </span>
                      </td>
                      <td>
                        <div className="employee-actions">
                          <button
                            type="button"
                            title="View Employee"
                            onClick={() => handleViewEmployee(employee.id)}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            type="button"
                            title="Edit Employee"
                            onClick={() => handleEditEmployee(employee.id)}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            title="Deactivate Employee"
                            onClick={() => handleDeactivateEmployee(employee.id)}
                          >
                            <UserX size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="admin-empty-state">
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="admin-table-footer">
          Showing {filteredEmployees.length} of{" "}
          {employees.length} employees
        </div>
      </div>
    </div>
  );
}

export default Employees;