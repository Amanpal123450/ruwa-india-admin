import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EmployeeCards = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Fetch employees from API
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
      
      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }
      
      const data = await response.json();
      setEmployees(data.employees);
      setError("");
    } catch (err) {
      setError("Error fetching employees: " + err.message);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchEmployees();
    } else {
      setError("No authentication token found");
      setLoading(false);
    }
  }, [token]);

  // Loading state
  if (loading) {
    return (
      <div className="employee-cards-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading employees...</p>
        </div>
        <style jsx>{`
          .loading-spinner {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 200px;
          }
          .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 2s linear infinite;
            margin-bottom: 10px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="employee-cards-container">
        <h1>Employee Directory</h1>
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchEmployees} className="retry-btn">
            Retry
          </button>
        </div>
        <style jsx>{`
          .error-message {
            text-align: center;
            padding: 20px;
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
            border-radius: 8px;
            margin: 20px 0;
          }
          .retry-btn {
            background-color: #dc3545;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 10px;
          }
          .retry-btn:hover {
            background-color: #c82333;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="employee-cards-container">
      <h1>Employee Directory</h1>
      <div className="cards-grid">
        {employees.length > 0 ? (
          employees.map((employee) => (
            <div key={employee._id} className="employee-card">
              <div className="card-image">
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
              <div className="card-content">
                <h3>{employee.name || "Unknown"}</h3>
                <p>{employee.position || "No Position"}</p>
                <p className="department">{employee.department || "No Department"}</p>
                <p className="employee-id">ID: {employee.employeeId || "No ID"}</p>
                <div className="additional-info">
                  {employee.DOB && (
                    <p className="dob">DOB: {new Date(employee.DOB).toLocaleDateString()}</p>
                  )}
                  {employee.joinDate && (
                    <p className="join-date">
                      Joined: {new Date(parseInt(employee.joinDate)).toLocaleDateString()}
                    </p>
                  )}
                  <div className="status-badges">
                    {employee.isVerified && (
                      <span className="badge verified">✓ Verified</span>
                    )}
                    <span className={`badge ${employee.isOnline ? 'online' : 'offline'}`}>
                      {employee.isOnline ? '🟢 Online' : '🔴 Offline'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="card-actions">
                <button
                  className="view-btn"
                  onClick={() => navigate(`/employee/${employee._id}`, { state: employee })}
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-employees">
            <p>No employees found</p>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .employee-cards-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        h1 {
          text-align: center;
          color: #333;
          margin-bottom: 30px;
          font-size: 2.5rem;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          padding: 20px 0;
        }

        .employee-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          border: 1px solid #e1e5e9;
        }

        .employee-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
        }

        .card-image {
          height: 200px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 15px;
        }

        .profile-img {
          width: 120px;
          height: 120px;
          object-fit: cover;
          border-radius: 50%;
          border: 4px solid white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .profile-placeholder {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: bold;
          color: #667eea;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .card-content {
          padding: 20px;
        }

        .card-content h3 {
          margin: 0 0 8px 0;
          font-size: 1.25rem;
          color: #333;
          font-weight: 600;
        }

        .card-content p {
          margin: 4px 0;
          color: #666;
          font-size: 0.9rem;
        }

        .department {
          font-weight: 500;
          color: #4a90e2;
        }

        .employee-id {
          font-family: monospace;
          background: #f8f9fa;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          display: inline-block;
          margin: 8px 0;
        }

        .contact-info {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #eee;
        }

        .contact-info .email,
        .contact-info .phone {
          font-size: 0.8rem;
          color: #777;
          margin: 2px 0;
          word-break: break-all;
        }

        .additional-info {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #eee;
        }

        .dob,
        .join-date {
          font-size: 0.8rem;
          color: #777;
          margin: 4px 0;
        }

        .status-badges {
          display: flex;
          gap: 6px;
          margin-top: 8px;
          flex-wrap: wrap;
        }

        .badge {
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 0.7rem;
          font-weight: 500;
        }

        .badge.verified {
          background: #d4edda;
          color: #155724;
        }

        .badge.online {
          background: #d1ecf1;
          color: #0c5460;
        }

        .badge.offline {
          background: #f8d7da;
          color: #721c24;
        }

        .card-actions {
          padding: 0 20px 20px 20px;
        }

        .view-btn {
          width: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .view-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
        }

        .no-employees {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
          color: #666;
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          .cards-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }
          
          h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default EmployeeCards;