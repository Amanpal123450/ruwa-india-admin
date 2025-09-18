import React, { useEffect, useState } from "react";
import {
  Users,
  Edit3,
  Trash2,
  Mail,
  Phone,
  Building,
  MapPin,
  User,
  Save,
  X,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  FaTimes,
  FaSave,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaBuilding,
  FaBriefcase,
  FaHome,
} from "react-icons/fa";

export default function AllEmployee() {
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    department: "",
    position: "",
    address: "",
    employeeId: "", // ✅ ab defined hai
    password: "", // ✅ password bhi rakho agar edit karna hai
  });

  // pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 5;

  const token = localStorage.getItem("token");

  // Fetch employees
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://ruwa-backend.onrender.com/api/admin/employees",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch employees");
      const data = await response.json();
      setEmployees(data.employees);
      setLoading(false);
    } catch (err) {
      setMessage("Error fetching employees: " + err.message);
      setMessageType("error");
      setLoading(false);
    }
  };

  // Delete employee
  const deleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;
    try {
      const res = await fetch(
        `https://ruwa-backend.onrender.com/api/admin/employee/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to delete employee");
      setMessage("Employee deleted successfully!");
      setMessageType("success");
      setEmployees(employees.filter((emp) => emp._id !== id));
    } catch (err) {
      setMessage("Error deleting employee: " + err.message);
      setMessageType("error");
    }
  };

  // Open modal with selected employee data
  const editEmployee = (emp) => {
    setSelectedEmployee(emp);
    setFormData({
      name: emp.name || "",
      phone: emp.phone || "",
      email: emp.email || "",
      department: emp.department || "",
      position: emp.position || "",
      address: emp.address || "",
      employeeId: emp.employeeId || "",
    });
    setShowModal(true);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Update employee API
  const updateEmployee = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `https://ruwa-backend.onrender.com/api/admin/employee/${selectedEmployee._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (!res.ok) throw new Error("Failed to update employee");
      setMessage("Employee updated successfully!");
      setMessageType("success");
      setShowModal(false);
      fetchEmployees(); // refresh list
    } catch (err) {
      setMessage("Error updating employee: " + err.message);
      setMessageType("error");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // pagination logic
  const indexOfLast = currentPage * employeesPerPage;
  const indexOfFirst = indexOfLast - employeesPerPage;
  const currentEmployees = employees.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(employees.length / employeesPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Employee Management
              </h1>
              <p className="text-gray-600">
                Manage your team members efficiently
              </p>
            </div>
          </div>
          {message && (
            <div
              className={`flex items-center gap-2 p-4 rounded-lg mb-4 ${
                messageType === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {messageType === "success" ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>{message}</span>
              <button
                onClick={() => setMessage("")}
                className="ml-auto text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Employee Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading employees...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Employee
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Department
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentEmployees.length > 0 ? (
                    currentEmployees.map((emp, index) => (
                      <tr
                        key={emp._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {(currentPage - 1) * employeesPerPage + index + 1}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {emp.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {emp.position}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                          {emp.employeeId}
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="w-4 h-4" /> {emp.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="w-4 h-4" /> {emp.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {emp.department}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                          <button
                            onClick={() => editEmployee(emp)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteEmployee(emp._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <div className="text-lg font-semibold mb-1">
                          No employees found
                        </div>
                        <div className="text-sm">
                          Start by adding your first employee
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination controls */}
        {employees.length > employeesPerPage && (
          <div className="flex justify-center items-center gap-3 mt-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* Edit Modal */}
        {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
      {/* Close Button */}
      <button
        onClick={() => setShowModal(false)}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
      >
        <FaTimes className="w-5 h-5" />
      </button>

      <h2 className="text-xl font-bold mb-4">Edit Employee</h2>

      {/* 🔥 Scrollable Form */}
      <div className="max-h-[70vh] overflow-y-auto pr-2">
        <form onSubmit={updateEmployee} className="space-y-4">
          {/* Name */}
          <div className="flex items-center border rounded px-3 py-2">
            <FaUser className="text-gray-500 mr-2" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full outline-none"
            />
          </div>

          {/* empID */}
          <div className="flex items-center border rounded px-3 py-2">
            <input
              type="text"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              placeholder="Employee ID"
              className="w-full outline-none"
            />
          </div>

          {/* password */}
          <div className="flex items-center border rounded px-3 py-2">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full outline-none"
            />
          </div>

          {/* Phone */}
          <div className="flex items-center border rounded px-3 py-2">
            <FaPhone className="text-gray-500 mr-2" />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="w-full outline-none"
            />
          </div>

          {/* Email */}
          <div className="flex items-center border rounded px-3 py-2">
            <FaEnvelope className="text-gray-500 mr-2" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full outline-none"
            />
          </div>

          {/* Department */}
          <div className="flex items-center border rounded px-3 py-2">
            <FaBuilding className="text-gray-500 mr-2" />
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Department"
              className="w-full outline-none"
            />
          </div>

          {/* Position */}
          <div className="flex items-center border rounded px-3 py-2">
            <FaBriefcase className="text-gray-500 mr-2" />
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="Position"
              className="w-full outline-none"
            />
          </div>

          {/* Address */}
          <div className="flex items-start border rounded px-3 py-2">
            <FaHome className="text-gray-500 mr-2 mt-1" />
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 sticky bottom-0 bg-white py-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-gray-400 text-white rounded flex items-center gap-2"
            >
              <FaTimes className="w-4 h-4" /> Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded flex items-center gap-2"
            >
              <FaSave className="w-4 h-4" /> Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
}
