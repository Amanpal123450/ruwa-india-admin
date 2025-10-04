import React, { useEffect, useState } from "react";
import { Search, X, Users, Mail, Phone, Shield, UserCheck, ArrowLeft, CreditCard, CheckCircle, XCircle, Clock, Eye, FileText, Loader } from "lucide-react";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(8);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userServices, setUserServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [showServices, setShowServices] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("https://ruwa-backend.onrender.com/api/admin/admin/users", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUsers(data.alluser);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setLoading(false);
      });
  }, []);

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.phone?.toLowerCase().includes(query) ||
      user.aadhar?.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getVisiblePages = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleBackToList = () => {
    setSelectedUser(null);
    setShowServices(false);
    setUserServices([]);
  };

  const fetchUserServices = async (phone) => {
    setLoadingServices(true);
    try {
      const response = await fetch(`https://ruwa-backend.onrender.com/api/admin/applied-phone/${phone}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setUserServices(data.appliedUsers);
        setShowServices(true);
      }
    } catch (err) {
      console.error("Error fetching user services:", err);
    } finally {
      setLoadingServices(false);
    }
  };

  const getServiceBadgeColor = (service) => {
    const colors = {
      AmbulanceBooking: "bg-gradient-to-r from-red-500 to-red-600",
      ApplyInsurance: "bg-gradient-to-r from-blue-500 to-blue-600",
      JanArogyaApplication: "bg-gradient-to-r from-green-500 to-green-600",
      JanArogyaApply: "bg-gradient-to-r from-purple-500 to-purple-600"
    };
    return colors[service] || "bg-gradient-to-r from-gray-500 to-gray-600";
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800"
    };
    return colors[status?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 absolute top-0"></div>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">Loading users...</p>
              <p className="text-sm text-gray-500 mt-1">Please wait while we fetch the data</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={handleBackToList}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Users</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-6">
                <div className="h-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
                
                <div className="px-6 pb-6">
                  <div className="flex flex-col items-center -mt-12 mb-4">
                    {selectedUser.profile_pic ? (
                      <img
                        className="h-24 w-24 rounded-2xl object-cover ring-4 ring-white shadow-xl"
                        src={selectedUser.profile_pic}
                        alt={selectedUser.name}
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 flex items-center justify-center ring-4 ring-white shadow-xl">
                        <span className="text-white font-bold text-4xl">
                          {selectedUser.name?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      </div>
                    )}
                    
                    <h1 className="text-2xl font-bold text-gray-900 mt-4 text-center">{selectedUser.name}</h1>
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm ${
                          selectedUser.role === "admin" || selectedUser.role === "ADMIN"
                            ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                            : "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                        }`}
                      >
                        {selectedUser.role === "admin" || selectedUser.role === "ADMIN" ? (
                          <Shield className="w-3 h-3" />
                        ) : (
                          <UserCheck className="w-3 h-3" />
                        )}
                        {selectedUser.role}
                      </span>
                      
                      {selectedUser.isVerified && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                      
                      {selectedUser.isOnline ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-green-100 text-green-700">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          Online
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 text-gray-600">
                          <Clock className="w-3 h-3" />
                          Offline
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 mt-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="w-4 h-4 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-gray-600 uppercase">Email</p>
                          <p className="text-sm font-bold text-gray-900 truncate">{selectedUser.email || "Not provided"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Phone className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-600 uppercase">Phone</p>
                          <p className="text-sm font-bold text-gray-900">{selectedUser.phone || "Not provided"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <CreditCard className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-600 uppercase">Aadhar</p>
                          <p className="text-sm font-bold text-gray-900">{selectedUser.aadhar || "Not provided"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-gray-600 uppercase">User ID</p>
                          <p className="text-xs font-bold text-gray-900 font-mono truncate">{selectedUser._id}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <h3 className="text-xs font-bold text-gray-900 uppercase mb-3">Account Status</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {selectedUser.isVerified ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-xs font-medium text-gray-700">
                          {selectedUser.isVerified ? "Verified Account" : "Not Verified"}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {selectedUser.verified ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-xs font-medium text-gray-700">
                          {selectedUser.verified ? "Email Verified" : "Email Not Verified"}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {selectedUser.isOnline ? (
                          <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                        ) : (
                          <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                        )}
                        <span className="text-xs font-medium text-gray-700">
                          {selectedUser.isOnline ? "Currently Online" : "Offline"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-5">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <FileText className="w-6 h-6" />
                    Applied Services
                  </h2>
                </div>

                <div className="p-6">
                  {!showServices ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-10 h-10 text-blue-600" />
                      </div>
                      <p className="text-gray-600 mb-6">View all services applied by this user</p>
                      <button
                        onClick={() => fetchUserServices(selectedUser.phone)}
                        disabled={loadingServices}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                      >
                        {loadingServices ? (
                          <>
                            <Loader className="w-5 h-5 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          <>
                            <FileText className="w-5 h-5" />
                            Load Services
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div>
                      {loadingServices ? (
                        <div className="flex items-center justify-center py-12">
                          <Loader className="w-8 h-8 animate-spin text-blue-600" />
                        </div>
                      ) : userServices.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-10 h-10 text-gray-400" />
                          </div>
                          <p className="text-xl font-bold text-gray-900 mb-2">No services found</p>
                          <p className="text-gray-500">This user hasn't applied for any services yet</p>
                        </div>
                      ) : (
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                          {userServices.map((service, index) => (
                            <div
                              key={index}
                              className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-all duration-200"
                            >
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm ${getServiceBadgeColor(service.service)}`}>
                                    <FileText className="w-3 h-3" />
                                    {service.service}
                                  </span>
                                </div>
                                <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${getStatusBadgeColor(service.status)}`}>
                                  {service.status || "Pending"}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <p className="text-xs text-gray-500 font-medium">Name</p>
                                  <p className="text-sm font-bold text-gray-900">{service.name}</p>
                                </div>
                                {service.email && service.email !== "Not Provided" && (
                                  <div>
                                    <p className="text-xs text-gray-500 font-medium">Email</p>
                                    <p className="text-sm font-bold text-gray-900 truncate">{service.email}</p>
                                  </div>
                                )}
                                {service.phone && service.phone !== "Not Provided" && (
                                  <div>
                                    <p className="text-xs text-gray-500 font-medium">Phone</p>
                                    <p className="text-sm font-bold text-gray-900">{service.phone}</p>
                                  </div>
                                )}
                                {service.aadhaarNumber && (
                                  <div>
                                    <p className="text-xs text-gray-500 font-medium">Aadhaar</p>
                                    <p className="text-sm font-bold text-gray-900">{service.aadhaarNumber}</p>
                                  </div>
                                )}
                                {service.district && (
                                  <div>
                                    <p className="text-xs text-gray-500 font-medium">District</p>
                                    <p className="text-sm font-bold text-gray-900">{service.district}</p>
                                  </div>
                                )}
                                {service.hospitalPreference && (
                                  <div>
                                    <p className="text-xs text-gray-500 font-medium">Hospital</p>
                                    <p className="text-sm font-bold text-gray-900">{service.hospitalPreference}</p>
                                  </div>
                                )}
                                {service.appointmentDate && (
                                  <div>
                                    <p className="text-xs text-gray-500 font-medium">Appointment</p>
                                    <p className="text-sm font-bold text-gray-900">{new Date(service.appointmentDate).toLocaleDateString()}</p>
                                  </div>
                                )}
                                {service.insuranceType && (
                                  <div>
                                    <p className="text-xs text-gray-500 font-medium">Insurance Type</p>
                                    <p className="text-sm font-bold text-gray-900">{service.insuranceType}</p>
                                  </div>
                                )}
                                {service.businessType && (
                                  <div>
                                    <p className="text-xs text-gray-500 font-medium">Business Type</p>
                                    <p className="text-sm font-bold text-gray-900">{service.businessType}</p>
                                  </div>
                                )}
                                {service.franchiseCategory && (
                                  <div>
                                    <p className="text-xs text-gray-500 font-medium">Franchise Category</p>
                                    <p className="text-sm font-bold text-gray-900">{service.franchiseCategory}</p>
                                  </div>
                                )}
                              </div>

                              {service.submittedAt && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                  <p className="text-xs text-gray-500">
                                    Submitted: {new Date(service.submittedAt).toLocaleString()}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                Users Management
              </h1>
              <p className="text-gray-600 mt-2">
                Total {filteredUsers.length} users {searchQuery && `(filtered from ${users.length})`}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, phone, or aadhar..."
                className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all duration-200 text-sm font-medium"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    User Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {currentUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        {searchQuery ? (
                          <>
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
                              <Search className="w-10 h-10 text-blue-500" />
                            </div>
                            <p className="text-xl font-bold text-gray-900 mb-2">No users found</p>
                            <p className="text-gray-500 mb-6">Try adjusting your search criteria</p>
                            <button
                              onClick={clearSearch}
                              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg font-medium"
                            >
                              Clear search
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                              <Users className="w-10 h-10 text-gray-400" />
                            </div>
                            <p className="text-xl font-bold text-gray-900 mb-2">No users yet</p>
                            <p className="text-gray-500">There are no users to display at the moment</p>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentUsers.map((user, index) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group cursor-pointer"
                      onClick={() => handleUserClick(user)}
                    >
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-500">
                        {(currentPage - 1) * usersPerPage + index + 1}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="relative flex-shrink-0 h-14 w-14">
                            {user.profile_pic ? (
                              <img
                                className="h-14 w-14 rounded-xl object-cover ring-2 ring-white shadow-lg group-hover:ring-blue-200 transition-all duration-200"
                                src={user.profile_pic}
                                alt={user.name}
                              />
                            ) : (
                              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 flex items-center justify-center ring-2 ring-white shadow-lg group-hover:ring-blue-200 transition-all duration-200">
                                <span className="text-white font-bold text-xl">
                                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                                </span>
                              </div>
                            )}
                            {user.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {user.email || "No email"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-900 font-medium">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {user.phone}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm ${
                            user.role === "admin" || user.role === "ADMIN"
                              ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                              : "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                          }`}
                        >
                          {user.role === "admin" || user.role === "ADMIN" ? (
                            <Shield className="w-3 h-3" />
                          ) : (
                            <UserCheck className="w-3 h-3" />
                          )}
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          {user.isVerified && (
                            <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded-lg font-medium w-fit">
                              <CheckCircle className="w-3 h-3" />
                              Verified
                            </span>
                          )}
                          {user.isOnline ? (
                            <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded-lg font-medium w-fit">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              Online
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg font-medium w-fit">
                              Offline
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUserClick(user);
                          }}
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors px-3 py-1.5 hover:bg-blue-50 rounded-lg font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-5 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center text-sm text-gray-600 font-medium">
                  Showing{" "}
                  <span className="font-bold text-gray-900 mx-1.5 px-2 py-0.5 bg-white rounded-md">
                    {indexOfFirstUser + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-bold text-gray-900 mx-1.5 px-2 py-0.5 bg-white rounded-md">
                    {Math.min(indexOfLastUser, filteredUsers.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-gray-900 mx-1.5 px-2 py-0.5 bg-white rounded-md">
                    {filteredUsers.length}
                  </span>{" "}
                  results
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-bold text-gray-700 bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-blue-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Previous
                  </button>

                  <div className="hidden sm:flex space-x-1">
                    {getVisiblePages().map((pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                          currentPage === pageNumber
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                            : "text-gray-700 bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-blue-300 shadow-sm hover:shadow-md"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-bold text-gray-700 bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-blue-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersTable;