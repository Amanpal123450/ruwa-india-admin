import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const EmployeeDetails = () => {
  const { state: employee } = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceError, setAttendanceError] = useState("");

  const token = localStorage.getItem("token");

  // Navigate to services page
  // In EmployeeDetails.js
// Navigate to services page
const navigateToServices = () => {
  navigate('/employee-services', { state: employee });
};
  // Fetch attendance data for the employee
  const fetchAttendanceData = async () => {
    if (!employee?._id) return;
    
    setAttendanceLoading(true);
    setAttendanceError("");
    
    try {
      const response = await fetch(
        `https://ruwa-backend.onrender.com/api/admin/employee/${employee._id}/attendance`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch attendance data");
      }
      
      const data = await response.json();
      setAttendanceData(data.history || []);
    } catch (err) {
      setAttendanceError("Unable to load attendance data");
      console.error("Attendance fetch error:", err);
    } finally {
      setAttendanceLoading(false);
    }
  };

  // Fetch attendance when component mounts or when attendance tab is selected
  useEffect(() => {
    if (activeTab === 'attendance') {
      fetchAttendanceData();
    }
  }, [activeTab, employee?._id]);

  // Calculate attendance statistics
  const calculateAttendanceStats = () => {
    if (!attendanceData.length) return { totalDays: 0, presentDays: 0, lateDays: 0, leaveDays: 0, attendanceRate: 0 };
    
    const totalDays = attendanceData.length;
    const presentDays = attendanceData.filter(record => 
      record.status === 'present' || record.status === 'late'
    ).length;
    const lateDays = attendanceData.filter(record => record.status === 'late').length;
    const leaveDays = attendanceData.filter(record => 
      record.status === 'paid-leave' || record.status === 'unpaid-leave'
    ).length;
    const attendanceRate = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 0;
    
    return { totalDays, presentDays, lateDays, leaveDays, attendanceRate };
  };

  const attendanceStats = calculateAttendanceStats();

  if (!employee) {
    return (
      <div className="employee-details-page">
        <div className="no-data">
          <h2>No employee data available</h2>
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Go Back
          </button>
        </div>
        <style jsx>{`
          .no-data {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 50vh;
            text-align: center;
          }
          .back-btn {
            margin-top: 20px;
            padding: 10px 20px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }

  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
    
    // Handle timestamp (joinDate)
    if (!isNaN(dateString)) {
      return new Date(parseInt(dateString)).toLocaleDateString();
    }
    
    // Handle ISO date string (DOB)
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="employee-details-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="employee-profile">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-image">
            {employee.profile_pic ? (
              <img 
                src={employee.profile_pic} 
                alt={employee.name || "Employee"} 
                className="profile-img"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="profile-placeholder" style={{ display: employee.profile_pic ? 'none' : 'flex' }}>
              {employee.name ? employee.name.charAt(0).toUpperCase() : "E"}
            </div>
          </div>
          <div className="profile-info">
            <h1>{employee.name || "Unknown Employee"}</h1>
            <p className="position">{employee.position || "No Position"}</p>
            <p className="department">{employee.department || "No Department"} Department</p>
            <div className="status-section">
              {employee.isVerified && (
                <span className="badge verified">✓ Verified</span>
              )}
              <span className={`badge ${employee.isOnline ? 'online' : 'offline'}`}>
                {employee.isOnline ? '🟢 Online' : '🔴 Offline'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="tabs-nav">
          <button 
            className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            Personal Info
          </button>
          <button 
            className={`tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            Contact Details
          </button>
          <button 
            className={`tab-btn ${activeTab === 'employment' ? 'active' : ''}`}
            onClick={() => setActiveTab('employment')}
          >
            Employment Info
          </button>
          <button 
            className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            Attendance
          </button>
          <button 
            className="tab-btn services-btn"
            onClick={navigateToServices}
          >
            Services Applied
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'personal' && (
            <div className="content-section">
              <h3>Personal Information</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-key">Full Name:</span>
                  <span className="detail-value">{employee.name || "Not provided"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-key">Employee ID:</span>
                  <span className="detail-value employee-id">{employee.employeeId || "Not provided"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-key">Date of Birth:</span>
                  <span className="detail-value">{formatDate(employee.DOB)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-key">Join Date:</span>
                  <span className="detail-value">{formatDate(employee.joinDate)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-key">Role:</span>
                  <span className="detail-value">{employee.role || "Not provided"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-key">Verification Status:</span>
                  <span className={`detail-value ${employee.isVerified ? 'verified-text' : 'unverified-text'}`}>
                    {employee.isVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="content-section">
              <h3>Contact Information</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-key">Email:</span>
                  <span className="detail-value">
                    <a href={`mailto:${employee.email}`} className="email-link">
                      {employee.email || "Not provided"}
                    </a>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-key">Phone:</span>
                  <span className="detail-value">
                    <a href={`tel:${employee.phone}`} className="phone-link">
                      {employee.phone || "Not provided"}
                    </a>
                  </span>
                </div>
                <div className="detail-item full-width">
                  <span className="detail-key">Address:</span>
                  <span className="detail-value address">
                    {employee.address || "Not provided"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'employment' && (
            <div className="content-section">
              <h3>Employment Details</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-key">Position:</span>
                  <span className="detail-value">{employee.position || "Not provided"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-key">Department:</span>
                  <span className="detail-value">{employee.department || "Not provided"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-key">Employee ID:</span>
                  <span className="detail-value employee-id">{employee.employeeId || "Not provided"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-key">Join Date:</span>
                  <span className="detail-value">{formatDate(employee.joinDate)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-key">Current Status:</span>
                  <span className={`detail-value ${employee.isOnline ? 'online-text' : 'offline-text'}`}>
                    {employee.isOnline ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-key">Account Status:</span>
                  <span className={`detail-value ${employee.verified ? 'verified-text' : 'unverified-text'}`}>
                    {employee.verified ? 'Active Account' : 'Pending Verification'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="content-section">
              <h3>Attendance Records</h3>
              
              {/* Attendance Statistics */}
              <div className="attendance-stats">
                <div className="stat-card">
                  <div className="stat-number">{attendanceStats.totalDays}</div>
                  <div className="stat-label">Total Days</div>
                </div>
                <div className="stat-card present">
                  <div className="stat-number">{attendanceStats.presentDays}</div>
                  <div className="stat-label">Present Days</div>
                </div>
                <div className="stat-card late">
                  <div className="stat-number">{attendanceStats.lateDays}</div>
                  <div className="stat-label">Late Days</div>
                </div>
                <div className="stat-card leave">
                  <div className="stat-number">{attendanceStats.leaveDays}</div>
                  <div className="stat-label">Leave Days</div>
                </div>
                <div className="stat-card rate">
                  <div className="stat-number">{attendanceStats.attendanceRate}%</div>
                  <div className="stat-label">Attendance Rate</div>
                </div>
              </div>

              {/* Attendance Records */}
              {attendanceLoading ? (
                <div className="loading-section">
                  <div className="spinner"></div>
                  <p>Loading attendance records...</p>
                </div>
              ) : attendanceError ? (
                <div className="error-section">
                  <p>{attendanceError}</p>
                  <button onClick={fetchAttendanceData} className="retry-btn">
                    Retry
                  </button>
                </div>
              ) : attendanceData.length > 0 ? (
                <div className="attendance-table-container">
                  <table className="attendance-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Check In</th>
                        <th>Check Out</th>
                        <th>Working Hours</th>
                        <th>Status</th>
                        <th>Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceData.map((record, index) => (
                        <tr key={record._id || index}>
                          <td>{new Date(record.date).toLocaleDateString()}</td>
                          <td>
                            {record.checkIn 
                              ? new Date(record.checkIn).toLocaleTimeString()
                              : '-'
                            }
                          </td>
                          <td>
                            {record.checkOut 
                              ? new Date(record.checkOut).toLocaleTimeString()
                              : record.checkIn ? 'Not checked out' : '-'
                            }
                          </td>
                          <td>
                            {record.workingHours 
                              ? `${record.workingHours} hrs`
                              : '-'
                            }
                          </td>
                          <td>
                            <span className={`status-badge ${record.status}`}>
                              {record.status.replace('-', ' ').toUpperCase()}
                            </span>
                          </td>
                          <td>{record.leaveReason || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="no-records">
                  <p>No attendance records found for this employee.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .employee-details-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 20px;
        }

        .back-btn {
          background: #667eea;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          margin-bottom: 20px;
          transition: background 0.3s ease;
        }

        .back-btn:hover {
          background: #5a6fd8;
        }

        .employee-profile {
          max-width: 1000px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .profile-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px;
          display: flex;
          align-items: center;
          gap: 30px;
        }

        .profile-image {
          position: relative;
        }

        .profile-img {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 4px solid white;
          object-fit: cover;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .profile-placeholder {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: white;
          color: #667eea;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          font-weight: bold;
          border: 4px solid white;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .profile-info h1 {
          margin: 0 0 8px 0;
          font-size: 2.5rem;
          font-weight: 600;
        }

        .profile-info .position {
          font-size: 1.2rem;
          margin: 4px 0;
          opacity: 0.9;
        }

        .profile-info .department {
          font-size: 1rem;
          margin: 4px 0;
          opacity: 0.8;
        }

        .status-section {
          margin-top: 15px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .badge.verified {
          background: rgba(255, 255, 255, 0.2);
          color: #d4edda;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .badge.online {
          background: rgba(255, 255, 255, 0.2);
          color: #d1ecf1;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .badge.offline {
          background: rgba(255, 255, 255, 0.2);
          color: #f8d7da;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .tabs-nav {
          display: flex;
          border-bottom: 1px solid #e1e5e9;
          background: #f8f9fa;
        }

        .tab-btn {
          flex: 1;
          padding: 16px 20px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          color: #666;
          transition: all 0.3s ease;
          border-bottom: 3px solid transparent;
        }

        .tab-btn.active {
          color: #667eea;
          border-bottom-color: #667eea;
          background: white;
        }

        .tab-btn:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

        .tab-btn.services-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 8px 8px 0 0;
          font-weight: 600;
          position: relative;
        }

        .tab-btn.services-btn:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
          color: white;
          transform: translateY(-2px);
        }

        .tab-btn.services-btn::after {
          content: "🔗";
          margin-left: 8px;
          font-size: 0.9rem;
        }

        .tab-content {
          padding: 40px;
        }

        .content-section h3 {
          color: #333;
          font-size: 1.8rem;
          margin-bottom: 30px;
          padding-bottom: 10px;
          border-bottom: 2px solid #667eea;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .detail-item {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }

        .detail-item.full-width {
          grid-column: 1 / -1;
        }

        .detail-key {
          font-weight: 600;
          color: #333;
          display: block;
          margin-bottom: 8px;
        }

        .detail-value {
          color: #666;
          font-size: 1rem;
          word-wrap: break-word;
        }

        .detail-value.employee-id {
          font-family: monospace;
          background: #e9ecef;
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: 500;
        }

        .detail-value.address {
          line-height: 1.5;
        }

        .email-link, .phone-link {
          color: #667eea;
          text-decoration: none;
        }

        .email-link:hover, .phone-link:hover {
          text-decoration: underline;
        }

        .verified-text {
          color: #28a745;
          font-weight: 500;
        }

        .unverified-text {
          color: #dc3545;
          font-weight: 500;
        }

        .online-text {
          color: #28a745;
          font-weight: 500;
        }

        .offline-text {
          color: #6c757d;
          font-weight: 500;
        }

        .attendance-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          border: 2px solid #e9ecef;
          transition: transform 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
        }

        .stat-card.present {
          background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
          border-color: #28a745;
        }

        .stat-card.late {
          background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
          border-color: #ffc107;
        }

        .stat-card.leave {
          background: linear-gradient(135deg, #f8d7da 0%, #f1c2c7 100%);
          border-color: #dc3545;
        }

        .stat-card.rate {
          background: linear-gradient(135deg, #cce5ff 0%, #b3d9ff 100%);
          border-color: #007bff;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: bold;
          color: #333;
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #666;
          font-weight: 500;
        }

        .attendance-table-container {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .attendance-table {
          width: 100%;
          border-collapse: collapse;
        }

        .attendance-table th {
          background: #f8f9fa;
          padding: 15px 12px;
          text-align: left;
          font-weight: 600;
          color: #333;
          border-bottom: 2px solid #e9ecef;
        }

        .attendance-table td {
          padding: 15px 12px;
          border-bottom: 1px solid #e9ecef;
          color: #666;
        }

        .attendance-table tbody tr:hover {
          background: #f8f9fa;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-badge.present {
          background: #d4edda;
          color: #155724;
        }

        .status-badge.late {
          background: #fff3cd;
          color: #856404;
        }

        .status-badge.paid-leave,
        .status-badge.unpaid-leave {
          background: #f8d7da;
          color: #721c24;
        }

        .status-badge.early-departure {
          background: #e2e3e5;
          color: #383d41;
        }

        .loading-section,
        .error-section,
        .no-records {
          text-align: center;
          padding: 40px 20px;
          color: #666;
        }

        .loading-section .spinner {
          border: 3px solid #f3f3f3;
          border-top: 3px solid #667eea;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
          margin: 0 auto 15px auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-section {
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 8px;
          color: #721c24;
        }

        .retry-btn {
          margin-top: 15px;
          padding: 10px 20px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
        }

        .retry-btn:hover {
          background: #c82333;
        }

        @media (max-width: 768px) {
          .profile-header {
            flex-direction: column;
            text-align: center;
            padding: 30px 20px;
          }

          .profile-info h1 {
            font-size: 2rem;
          }

          .tabs-nav {
            flex-direction: column;
          }

          .tab-content {
            padding: 20px;
          }

          .details-grid {
            grid-template-columns: 1fr;
          }

          .attendance-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .attendance-table-container {
            overflow-x: auto;
          }

          .attendance-table {
            min-width: 600px;
          }
        }
      `}</style>
    </div>
  );
};

export default EmployeeDetails;