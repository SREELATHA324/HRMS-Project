import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Pencil,
  UserX,
  Trash2,
} from "lucide-react";
import "../../App.css";
import { api } from "../../services/api";

function Employees({ onNavigate }) {
  const [employees, setEmployees] = useState([]);

  // Search
  const [search, setSearch] = useState("");

  // Filters
  const [filters, setFilters] = useState({
    department: "All",
    role: "All",
    jobLocation: "All",
    lengthOfService: "All",
    status: "All",
  });
  const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(5);
const [totalEmployees, setTotalEmployees] = useState(0);
const [totalPages, setTotalPages] = useState(1);
const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadEmployees();
    loadDepartments();
  }, []);

  const loadEmployees = async (customSearch = search, customFilters = filters,page = currentPage,limit = pageSize) => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      // Search
      if (customSearch.trim()) {
        params.append("search", customSearch.trim());
      }

      // Department
      if (customFilters.department !== "All") {
        params.append("department", customFilters.department);
      }

      // Role
      if (customFilters.role !== "All") {
        params.append("role", customFilters.role);
      }

      // Job Location
      if (customFilters.jobLocation !== "All") {
        params.append("jobLocation", customFilters.jobLocation);
      }

      // Length of Service
      if (customFilters.lengthOfService !== "All") {
        params.append(
          "lengthOfService",
          customFilters.lengthOfService
        );
      }

      // Status
      if (customFilters.status !== "All") {
        params.append("status", customFilters.status);
      }

      // Pagination
      params.append("page", page);
      params.append("limit", limit);

      const queryString = params.toString();

      const response = await api.get(
        `/employees?${queryString}`
      );

      if (response.success) {
        setEmployees(response.data || []);

        setCurrentPage(
          response.pagination?.currentPage || page
        );

        setTotalPages(
          response.pagination?.totalPages || 1
        );

        setTotalEmployees(
          response.pagination?.totalItems || 0
        );
        }else {
        setError(
          response.message ||
            "Failed to load employees"
        );
      }
    } catch (error) {
      console.error(
        "Load employees error:",
        error
      );
``
      setError(
        error.message ||
          "Failed to load employees"
      );
    } finally {
      setLoading(false);
    }
  };
  const loadDepartments = async () => {
  try {
    const response = await api.get("/employees/departments");

    if (response.success) {
      setDepartments(response.data || []);
    }
  } catch (error) {
    console.error("Load departments error:", error);
  }
};

  // Search when Enter is pressed
  const handleSearchKeyDown = (e) => {
  if (e.key === "Enter") {
    setCurrentPage(1);
    loadEmployees(search, filters, 1, pageSize);
  }
};

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    const updatedFilters = {
      ...filters,
      [filterName]: value,
    };

    setFilters(updatedFilters);

    // Immediately request filtered data
    loadEmployees(search, updatedFilters, 1, pageSize);
  };

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
    if (
      !window.confirm(
        "Are you sure you want to deactivate this employee?"
      )
    ) {
      return;
    }

    try {
      const response = await api.put(
        `/employees/${id}`,
        {
          status: "Inactive",
        }
      );

      if (response.success) {
        await loadEmployees(search, filters);
      } else {
        const errorMsg =
          response.message ||
          "Failed to deactivate employee";

        if (response.errors) {
          alert(
            errorMsg +
              "\n" +
              response.errors.join("\n")
          );
        } else {
          alert(errorMsg);
        }
      }
    } catch (error) {
      console.error(
        "Deactivate error:",
        error
      );

      alert(
        error.message ||
          "Failed to deactivate employee"
      );
    }
  };

  const handleDeleteEmployee = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this employee? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await api.delete(
        `/employees/${id}?type=permanent`
      );

      if (response.success) {
        await loadEmployees(search, filters);
      } else {
        alert(
          response.message ||
            "Failed to delete employee"
        );
      }
    } catch (error) {
      console.error(
        "Delete employee error:",
        error
      );

      alert(
        error.message ||
          "Failed to delete employee"
      );
    }
  };

  function formatDate(date) {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  }

  return (
    <div className="admin-page">

      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1>Employees</h1>

          <p>
            Manage employees and their
            organization information.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={() =>
            onNavigate("addEmployee")
          }
        >
          <Plus size={17} />
          Add Employee
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="admin-form-error">
          {error}
        </div>
      )}

      {/* Search + Filters */}
      <div className="admin-table-toolbar">

        {/* Search */}
        <div className="admin-page-search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search by name, email or employee ID..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            onKeyDown={handleSearchKeyDown}
          />
        </div>

        {/* Filters */}
        <div className="admin-filter">
          <Filter size={16} />

          <select
            value={filters.role}
            onChange={(e) =>
              handleFilterChange(
                "role",
                e.target.value
              )
            }
          >
            <option value="All">
              All Roles
            </option>
            <option value="employee">
              Employee
            </option>
            <option value="manager">
              Manager
            </option>
            <option value="admin">
              Admin
            </option>
          </select>
        </div>

        <div className="admin-filter">
          <select
            value={filters.department}
            onChange={(e) =>
              handleFilterChange(
                "department",
                e.target.value
              )
            }
          >
            <option value="All">
              All Departments
            </option>

            {departments.map((department) => (
            <option
              key={department.id}
              value={department.id}
            >
              {department.name}
            </option>
          ))}
          </select>
        </div>

        <div className="admin-filter">
          <select
            value={filters.jobLocation}
            onChange={(e) =>
              handleFilterChange(
                "jobLocation",
                e.target.value
              )
            }
          >
            <option value="All">
              All Locations
            </option>
            <option value="remote">
              Remote
            </option>
            <option value="hybrid">
              Hybrid
            </option>
            <option value="onsite">
              Onsite
            </option>
          </select>
        </div>

        <div className="admin-filter">
          <select
            value={filters.lengthOfService}
            onChange={(e) =>
              handleFilterChange(
                "lengthOfService",
                e.target.value
              )
            }
          >
            <option value="All">
              All Service Lengths
            </option>
            <option value="less_than_1_year">
              Less than 1 year
            </option>
            <option value="1_to_3_years">
              1–3 years
            </option>
            <option value="3_to_5_years">
              3–5 years
            </option>
            <option value="more_than_5_years">
              More than 5 years
            </option>
          </select>
        </div>

        <div className="admin-filter">
          <select
            value={filters.status}
            onChange={(e) =>
              handleFilterChange(
                "status",
                e.target.value
              )
            }
          >
            <option value="All">
              All Status
            </option>
            <option value="Active">
              Active
            </option>
            <option value="Inactive">
              Inactive
            </option>
          </select>
        </div>

      </div>
      {/* Pagination / Entries */}
<div className="employee-pagination-top">
  <div className="employee-page-size">
    <span>Show</span>

    <select
      value={pageSize}
      onChange={(e) => {
        const newSize = Number(e.target.value);

        setPageSize(newSize);
        setCurrentPage(1);

        loadEmployees(
          search,
          filters,
          1,
          newSize
        );
      }}
    >
      <option value={5}>5</option>
      <option value={10}>10</option>
      <option value={20}>20</option>
      <option value={50}>50</option>
    </select>

    <span>entries</span>
  </div>
</div>

      {/* Employee Table */}
      <div className="admin-table-card">

        <div className="admin-table-wrapper">

          <table className="admin-table">

            <thead>
              <tr>
                <th>Employee</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th>Role</th>
                <th>Job Location</th>
                <th>Length of Service</th>
                <th>Joining Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td
                    colSpan="9"
                    className="admin-empty-state"
                  >
                    Loading employees...
                  </td>
                </tr>

              ) : employees.length > 0 ? (

                employees.map((employee) => {

                  const employeeName =
                    `${employee.firstName || ""} ${
                      employee.lastName || ""
                    }`.trim();

                  return (
                    <tr key={employee.id}>

                      {/* Employee */}
                      <td>
                        <div className="employee-table-user">

                          <div className="employee-avatar">
                            {employeeName
                              ? employeeName
                                  .charAt(0)
                                  .toUpperCase()
                              : "E"}
                          </div>

                          <div>
                            <strong>
                              {employeeName ||
                                "N/A"}
                            </strong>

                            <span>
                              {employee.email ||
                                "N/A"}
                            </span>
                          </div>

                        </div>
                      </td>

                      {/* Employee ID */}
                      <td>
                        {employee.employeeCode ||
                          "N/A"}
                      </td>

                      {/* Department */}
                      <td>
                        {employee.department_name ||
                          "N/A"}
                      </td>

                      {/* Role */}
                      <td>
                        {employee.role ||
                          "—"}
                      </td>

                      {/* Job Location */}
                      <td>
                        {employee.jobLocation ||
                          "—"}
                      </td>

                      {/* Length of Service */}
                      <td>
                        {employee.lengthOfService ||
                          "—"}
                      </td>

                      {/* Joining Date */}
                      <td>
                        {formatDate(
                          employee.joiningDate
                        )}
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className={`employee-status ${
                            employee.status
                              ?.toLowerCase() ||
                            ""
                          }`}
                        >
                          {employee.status ||
                            "N/A"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="employee-actions">

                          <button
                            type="button"
                            title="View Employee"
                            onClick={() =>
                              handleViewEmployee(
                                employee.id
                              )
                            }
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            type="button"
                            title="Edit Employee"
                            onClick={() =>
                              handleEditEmployee(
                                employee.id
                              )
                            }
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            title="Deactivate Employee"
                            onClick={() =>
                              handleDeactivateEmployee(
                                employee.id
                              )
                            }
                          >
                            <UserX size={16} />
                          </button>

                          <button
                            type="button"
                            title="Delete Employee"
                            onClick={() =>
                              handleDeleteEmployee(
                                employee.id
                              )
                            }
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })

              ) : (

                <tr>
                  <td
                    colSpan="9"
                    className="admin-empty-state"
                  >
                    No employees found.
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

        <div className="admin-table-footer">
  <span>
    Showing{" "}
    {employees.length === 0
      ? 0
      : (currentPage - 1) * pageSize + 1}
    -
    {Math.min(
      currentPage * pageSize,
      totalEmployees
    )}{" "}
    of {totalEmployees} employees
  </span>

  <div className="employee-pagination">
    <button
      type="button"
      disabled={currentPage === 1}
      onClick={() => {
        const newPage = currentPage - 1;

        setCurrentPage(newPage);

        loadEmployees(
          search,
          filters,
          newPage,
          pageSize
        );
      }}
    >
      Previous
    </button>

    <span>
      Page {currentPage} of {totalPages}
    </span>

    <button
      type="button"
      disabled={currentPage >= totalPages}
      onClick={() => {
        const newPage = currentPage + 1;

        setCurrentPage(newPage);

        loadEmployees(
          search,
          filters,
          newPage,
          pageSize
        );
      }}
    >
      Next
    </button>
  </div>
</div>

      </div>

    </div>
  );
}

export default Employees;