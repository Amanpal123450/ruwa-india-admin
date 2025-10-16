import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  AlertCircle, 
  Search,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Building2,
  UserCheck,
  RefreshCw
} from 'lucide-react';

export default function AdminEmployeeApproval() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: '', message: '' });
    }, 5000);
  };

  const fetchPendingEmployees = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://ruwa-backend.onrender.com/api/admin/admin-aproove-employee', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        setEmployees(data.employees || []);
        setFilteredEmployees(data.employees || []);
      } else {
        showAlert('error', data.message || 'Failed to fetch employees');
      }
    } catch (error) {
      showAlert('error', 'Network error. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingEmployees();
  }, []);

  useEffect(() => {
    const filtered = employees.filter(emp => 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [searchTerm, employees]);

  const updateEmployeeStatus = async (employeeId, status) => {
    setActionLoading(employeeId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://ruwa-backend.onrender.com/api/admin/employee-status/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      const data = await response.json();

      if (response.ok) {
        showAlert('success', data.message || `Employee ${status.toLowerCase()} successfully`);
        setEmployees(employees.filter(emp => emp._id !== employeeId));
        setFilteredEmployees(filteredEmployees.filter(emp => emp._id !== employeeId));
      } else {
        showAlert('error', data.message || 'Failed to update status');
      }
    } catch (error) {
      showAlert('error', 'Network error. Please try again.');
      console.error('Error:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading pending employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm p-8 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-4 rounded-2xl shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Employee Approvals
                </h1>
                <p className="text-gray-500 text-sm mt-1">Review and approve vendor-created employees</p>
              </div>
            </div>
            <button
              onClick={fetchPendingEmployees}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 text-indigo-600 rounded-xl transition-all shadow-sm font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Alert */}
        {alert.show && (
          <div className={`mb-6 p-4 rounded-2xl flex items-start gap-3 shadow-sm ${
            alert.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-100' 
              : 'bg-red-50 text-red-700 border border-red-100'
          }`}>
            {alert.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            )}
            <span className="text-sm font-medium">{alert.message}</span>
          </div>
        )}

        {/* Search and Stats */}
        <div className="bg-white rounded-3xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, ID, email, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 transition-all"
              />
            </div>
            <div className="flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
              <Users className="w-5 h-5 text-indigo-500" />
              <span className="text-indigo-700 font-semibold">{filteredEmployees.length} Pending</span>
            </div>
          </div>
        </div>

        {/* Employee Cards */}
        {filteredEmployees.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm p-16 text-center border border-gray-100">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Pending Employees</h3>
            <p className="text-gray-500">All employee requests have been processed</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredEmployees.map((employee) => (
              <div 
                key={employee._id}
                className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Employee Info */}
                  <div className="md:col-span-2 space-y-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-1.5">{employee.name}</h3>
                        <p className="text-indigo-600 text-sm font-semibold font-mono bg-indigo-50 px-3 py-1 rounded-lg inline-block">
                          {employee.employeeId}
                        </p>
                      </div>
                      <span className="px-4 py-1.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-200">
                        PENDING
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                          <Mail className="w-4 h-4 text-indigo-500" />
                        </div>
                        <span className="text-sm font-medium">{employee.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                          <Phone className="w-4 h-4 text-indigo-500" />
                        </div>
                        <span className="text-sm font-medium">{employee.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                          <Building2 className="w-4 h-4 text-indigo-500" />
                        </div>
                        <span className="text-sm font-medium">{employee.department}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                          <Briefcase className="w-4 h-4 text-indigo-500" />
                        </div>
                        <span className="text-sm font-medium">{employee.position}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                          <Calendar className="w-4 h-4 text-indigo-500" />
                        </div>
                        <span className="text-sm font-medium">Applied: {formatDate(employee.joinDate)}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                          <MapPin className="w-4 h-4 text-indigo-500" />
                        </div>
                        <span className="text-sm font-medium truncate">{employee.address}</span>
                      </div>
                    </div>

                    {/* Vendor Info */}
                    {employee.createdBy && (
                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-5 border border-purple-100">
                        <div className="flex items-center gap-2.5 mb-3">
                          <div className="bg-white p-2 rounded-lg shadow-sm">
                            <UserCheck className="w-4 h-4 text-purple-500" />
                          </div>
                          <span className="text-sm font-bold text-purple-700">Created by Vendor</span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-3 text-sm">
                          <div className="text-gray-700">
                            <span className="text-gray-500 font-medium">Name:</span> <span className="font-semibold">{employee.createdBy.name}</span>
                          </div>
                          <div className="text-gray-700">
                            <span className="text-gray-500 font-medium">ID:</span> <span className="font-semibold">{employee.createdBy.vendorId}</span>
                          </div>
                          <div className="text-gray-700">
                            <span className="text-gray-500 font-medium">Email:</span> <span className="font-semibold">{employee.createdBy.email}</span>
                          </div>
                          <div className="text-gray-700">
                            <span className="text-gray-500 font-medium">Phone:</span> <span className="font-semibold">{employee.createdBy.phone}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => updateEmployeeStatus(employee._id, 'APPROVED')}
                      disabled={actionLoading === employee._id}
                      className="flex items-center justify-center gap-2.5 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-green-200 hover:shadow-xl"
                    >
                      {actionLoading === employee._id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <CheckCircle className="w-5 h-5" />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => updateEmployeeStatus(employee._id, 'REJECTED')}
                      disabled={actionLoading === employee._id}
                      className="flex items-center justify-center gap-2.5 px-6 py-4 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded-2xl font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-red-200 hover:shadow-xl"
                    >
                      {actionLoading === employee._id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <XCircle className="w-5 h-5" />
                      )}
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}