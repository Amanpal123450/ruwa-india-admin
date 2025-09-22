import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const EmployeeServicesPage = () => {
  const { state: employee } = useLocation();
  const navigate = useNavigate();
  
  // Services state
  const [servicesData, setServicesData] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesError, setServicesError] = useState("");
  const [selectedService, setSelectedService] = useState("all");

  const token = localStorage.getItem("token");

  // Check if employee data exists, if not redirect back
  useEffect(() => {
    if (!employee) {
      console.log('No employee data found, redirecting back...');
      navigate(-1);
      return;
    }
  }, [employee, navigate]);

  // Fetch services data for the employee
  const fetchServicesData = async () => {
    if (!employee?._id) return;
    
    setServicesLoading(true);
    setServicesError("");
    
    try {
      const response = await fetch(
        `https://ruwa-backend.onrender.com/api/admin/applied-by/${employee._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch services data");
      }
      
      const data = await response.json();
      setServicesData(data.appliedUsers || []);
    } catch (err) {
      setServicesError("Unable to load services data");
      console.error("Services fetch error:", err);
    } finally {
      setServicesLoading(false);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    if (employee?._id) {
      fetchServicesData();
    }
  }, [employee?._id]);

  // Calculate services statistics
  const calculateServicesStats = () => {
    if (!servicesData.length) return { total: 0, ambulance: 0, insurance: 0, janArogya: 0, janArogyaApply: 0 };
    
    const total = servicesData.length;
    const ambulance = servicesData.filter(service => service.service === 'AmbulanceBooking').length;
    const insurance = servicesData.filter(service => service.service === 'ApplyInsurance').length;
    const janArogya = servicesData.filter(service => service.service === 'JanArogyaApplication').length;
    const janArogyaApply = servicesData.filter(service => service.service === 'JanArogyaApply').length;
    
    return { total, ambulance, insurance, janArogya, janArogyaApply };
  };

  // Filter services based on selected service type
  const getFilteredServices = () => {
    if (selectedService === 'all') return servicesData;
    return servicesData.filter(service => service.service === selectedService);
  };

  // Get service display name and icon
  const getServiceInfo = (serviceName) => {
    const serviceMap = {
      'AmbulanceBooking': { name: 'Ambulance Booking', icon: '🚑', color: '#dc3545' },
      'ApplyInsurance': { name: 'Insurance Application', icon: '🛡️', color: '#28a745' },
      'JanArogyaApplication': { name: 'Jan Arogya Application', icon: '🏥', color: '#007bff' },
      'JanArogyaApply': { name: 'Jan Arogya Apply', icon: '📋', color: '#ffc107' }
    };
    return serviceMap[serviceName] || { name: serviceName, icon: '📄', color: '#6c757d' };
  };

  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
    
    // Handle timestamp
    if (!isNaN(dateString)) {
      return new Date(parseInt(dateString)).toLocaleDateString();
    }
    
    // Handle ISO date string
    return new Date(dateString).toLocaleDateString();
  };

  // If no employee data, show loading or redirect message
  if (!employee) {
    return (
      <div className="services-page">
        <div className="loading-section">
          <div className="spinner"></div>
          <p>Redirecting...</p>
        </div>
      </div>
    );
  }

  const servicesStats = calculateServicesStats();
  const filteredServices = getFilteredServices();

  return (
    <div className="services-page">
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back to Employee Details
        </button>
        <div className="header-info">
          <h1>Services Applied by {employee.name}</h1>
          <p>Employee ID: {employee.employeeId} | Department: {employee.department}</p>
        </div>
      </div>

      <div className="services-container">
        {/* Services Statistics */}
        <div className="services-stats">
          <div className="stat-card total">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-number">{servicesStats.total}</div>
              <div className="stat-label">Total Services</div>
            </div>
          </div>
          
          <div className="stat-card ambulance">
            <div className="stat-icon">🚑</div>
            <div className="stat-content">
              <div className="stat-number">{servicesStats.ambulance}</div>
              <div className="stat-label">Ambulance Booking</div>
            </div>
          </div>
          
          <div className="stat-card insurance">
            <div className="stat-icon">🛡️</div>
            <div className="stat-content">
              <div className="stat-number">{servicesStats.insurance}</div>
              <div className="stat-label">Insurance Applications</div>
            </div>
          </div>
          
          <div className="stat-card jan-arogya">
            <div className="stat-icon">🏥</div>
            <div className="stat-content">
              <div className="stat-number">{servicesStats.janArogya}</div>
              <div className="stat-label">Jan Arogya Applications</div>
            </div>
          </div>
          
          <div className="stat-card jan-arogya-apply">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <div className="stat-number">{servicesStats.janArogyaApply}</div>
              <div className="stat-label">Arogya Apply</div>
            </div>
          </div>
        </div>

        {/* Service Filter */}
        <div className="filter-section">
          <label htmlFor="serviceFilter" className="filter-label">Filter by Service Type:</label>
          <select 
            id="serviceFilter"
            value={selectedService} 
            onChange={(e) => setSelectedService(e.target.value)}
            className="service-select"
          >
            <option value="all">All Services ({servicesStats.total})</option>
            <option value="AmbulanceBooking">🚑 Ambulance Booking ({servicesStats.ambulance})</option>
            <option value="ApplyInsurance">🛡️ Insurance Application ({servicesStats.insurance})</option>
            <option value="JanArogyaApplication">🏥 Jan Arogya Application ({servicesStats.janArogya})</option>
            <option value="JanArogyaApply">📋 Jan Arogya Apply ({servicesStats.janArogyaApply})</option>
          </select>
        </div>

        {/* Services Content */}
        <div className="services-content">
          {servicesLoading ? (
            <div className="loading-section">
              <div className="spinner"></div>
              <p>Loading services data...</p>
            </div>
          ) : servicesError ? (
            <div className="error-section">
              <div className="error-icon">⚠️</div>
              <h3>Error Loading Services</h3>
              <p>{servicesError}</p>
              <button onClick={fetchServicesData} className="retry-btn">
                🔄 Retry
              </button>
            </div>
          ) : filteredServices.length > 0 ? (
            <div className="services-grid">
              {filteredServices.map((service, index) => {
                const serviceInfo = getServiceInfo(service.service);
                return (
                  <div key={index} className="service-card">
                    <div className="service-header">
                      <div className="service-type" style={{ borderColor: serviceInfo.color }}>
                        <span className="service-icon">{serviceInfo.icon}</span>
                        <span className="service-name">{serviceInfo.name}</span>
                      </div>
                      <span className={`service-status ${service.status?.toLowerCase()}`}>
                        {service.status || 'Pending'}
                      </span>
                    </div>
                    
                    <div className="service-details">
                      <div className="service-row primary">
                        <span className="service-key">👤 Name:</span>
                        <span className="service-value">{service.name}</span>
                      </div>
                      
                      {service.email && service.email !== "Not Provided" && (
                        <div className="service-row">
                          <span className="service-key">📧 Email:</span>
                          <span className="service-value">{service.email}</span>
                        </div>
                      )}
                      
                      {service.phone && service.phone !== "Not Provided" && (
                        <div className="service-row">
                          <span className="service-key">📱 Phone:</span>
                          <span className="service-value">{service.phone}</span>
                        </div>
                      )}

                      {/* Service-specific fields */}
                      {service.service === 'AmbulanceBooking' && (
                        <>
                          {service.hospitalPreference && (
                            <div className="service-row">
                              <span className="service-key">🏥 Hospital:</span>
                              <span className="service-value">{service.hospitalPreference}</span>
                            </div>
                          )}
                          {service.appointmentDate && (
                            <div className="service-row">
                              <span className="service-key">📅 Date:</span>
                              <span className="service-value">{formatDate(service.appointmentDate)}</span>
                            </div>
                          )}
                          {service.preferredTime && (
                            <div className="service-row">
                              <span className="service-key">⏰ Time:</span>
                              <span className="service-value">{service.preferredTime}</span>
                            </div>
                          )}
                        </>
                      )}

                      {service.service === 'ApplyInsurance' && (
                        <>
                          {service.aadhaarNumber && (
                            <div className="service-row">
                              <span className="service-key">🆔 Aadhaar:</span>
                              <span className="service-value">{service.aadhaarNumber}</span>
                            </div>
                          )}
                          {service.district && (
                            <div className="service-row">
                              <span className="service-key">🏘️ District:</span>
                              <span className="service-value">{service.district}</span>
                            </div>
                          )}
                          {service.insuranceType && (
                            <div className="service-row">
                              <span className="service-key">📋 Type:</span>
                              <span className="service-value">{service.insuranceType}</span>
                            </div>
                          )}
                          {service.dob && (
                            <div className="service-row">
                              <span className="service-key">🎂 DOB:</span>
                              <span className="service-value">{formatDate(service.dob)}</span>
                            </div>
                          )}
                        </>
                      )}

                      {service.service === 'JanArogyaApplication' && (
                        <>
                          {service.state && (
                            <div className="service-row">
                              <span className="service-key">🗺️ State:</span>
                              <span className="service-value">{service.state}</span>
                            </div>
                          )}
                          {service.district && (
                            <div className="service-row">
                              <span className="service-key">🏘️ District:</span>
                              <span className="service-value">{service.district}</span>
                            </div>
                          )}
                        </>
                      )}

                      {service.service === 'JanArogyaApply' && (
                        <>
                          {service.businessType && (
                            <div className="service-row">
                              <span className="service-key">🏢 Business:</span>
                              <span className="service-value">{service.businessType}</span>
                            </div>
                          )}
                          {service.investmentCapacity && (
                            <div className="service-row">
                              <span className="service-key">💰 Investment:</span>
                              <span className="service-value">{service.investmentCapacity}</span>
                            </div>
                          )}
                          {service.proposedLocation && (
                            <div className="service-row">
                              <span className="service-key">📍 Location:</span>
                              <span className="service-value">{service.proposedLocation}</span>
                            </div>
                          )}
                          {service.franchiseCategory && (
                            <div className="service-row">
                              <span className="service-key">📂 Category:</span>
                              <span className="service-value">{service.franchiseCategory}</span>
                            </div>
                          )}
                          {service.category && (
                            <div className="service-row">
                              <span className="service-key">🏷️ Type:</span>
                              <span className="service-value">{service.category}</span>
                            </div>
                          )}
                        </>
                      )}

                      {service.submittedAt && (
                        <div className="service-row submitted">
                          <span className="service-key">📤 Submitted:</span>
                          <span className="service-value">{formatDate(service.submittedAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-records">
              <div className="no-records-icon">📝</div>
              <h3>No Service Applications Found</h3>
              <p>This employee hasn't applied for any services yet.</p>
              {selectedService !== 'all' && (
                <button 
                  onClick={() => setSelectedService('all')} 
                  className="view-all-btn"
                >
                  View All Services
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .services-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 20px;
        }

        .page-header {
          margin-bottom: 30px;
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
          transition: all 0.3s ease;
        }

        .back-btn:hover {
          background: #5a6fd8;
          transform: translateX(-2px);
        }

        .header-info h1 {
          color: #333;
          font-size: 2.2rem;
          margin-bottom: 8px;
        }

        .header-info p {
          color: #666;
          font-size: 1.1rem;
        }

        .services-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .services-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          padding: 25px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 15px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        }

        .stat-card.total {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .stat-card.ambulance {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
          color: white;
        }

        .stat-card.insurance {
          background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
          color: white;
        }

        .stat-card.jan-arogya {
          background: linear-gradient(135deg, #45b7d1 0%, #2980b9 100%);
          color: white;
        }

        .stat-card.jan-arogya-apply {
          background: linear-gradient(135deg, #f9ca24 0%, #f0932b 100%);
          color: white;
        }

        .stat-icon {
          font-size: 2.5rem;
        }

        .stat-content {
          flex: 1;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: bold;
          line-height: 1;
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 1rem;
          opacity: 0.9;
          font-weight: 500;
        }

        .filter-section {
          background: white;
          padding: 25px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          margin-bottom: 30px;
        }

        .filter-label {
          display: block;
          font-weight: 600;
          color: #333;
          margin-bottom: 10px;
        }

        .service-select {
          width: 100%;
          max-width: 400px;
          padding: 12px 16px;
          border: 2px solid #e1e5e9;
          border-radius: 10px;
          font-size: 16px;
          background: white;
          cursor: pointer;
          transition: border-color 0.3s ease;
        }

        .service-select:focus {
          outline: none;
          border-color: #667eea;
        }

        .services-content {
          min-height: 400px;
        }

        .loading-section {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-section {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border: 2px solid #f8d7da;
        }

        .error-icon {
          font-size: 4rem;
          margin-bottom: 15px;
        }

        .error-section h3 {
          color: #721c24;
          margin-bottom: 10px;
        }

        .error-section p {
          color: #721c24;
          margin-bottom: 20px;
        }

        .retry-btn {
          padding: 12px 24px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.3s ease;
        }

        .retry-btn:hover {
          background: #c82333;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 25px;
        }

        .service-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .service-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        }

        .service-header {
          background: #f8f9fa;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #e9ecef;
        }

        .service-type {
          display: flex;
          align-items: center;
          gap: 12px;
          border-left: 4px solid;
          padding-left: 12px;
        }

        .service-icon {
          font-size: 1.5rem;
        }

        .service-name {
          font-weight: 600;
          font-size: 1.1rem;
          color: #333;
        }

        .service-status {
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .service-status.pending {
          background: #fff3cd;
          color: #856404;
        }

        .service-status.approved {
          background: #d4edda;
          color: #155724;
        }

        .service-status.rejected {
          background: #f8d7da;
          color: #721c24;
        }

        .service-status.completed {
          background: #cce5ff;
          color: #004085;
        }

        .service-details {
          padding: 20px;
        }

        .service-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;
          gap: 15px;
        }

        .service-row:last-child {
          border-bottom: none;
        }

        .service-row.primary {
          background: #f8f9fa;
          margin: -5px -10px 10px -10px;
          padding: 12px 10px;
          border-radius: 8px;
          border-bottom: none;
        }

        .service-row.submitted {
          background: #e3f2fd;
          margin: 10px -10px -5px -10px;
          padding: 12px 10px;
          border-radius: 8px;
          border-bottom: none;
        }

        .service-key {
          font-weight: 600;
          color: #555;
          flex-shrink: 0;
          min-width: 100px;
        }

        .service-value {
          color: #333;
          word-wrap: break-word;
          text-align: right;
        }

        .no-records {
          text-align: center;
          padding: 80px 20px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .no-records-icon {
          font-size: 5rem;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .no-records h3 {
          color: #333;
          margin-bottom: 10px;
        }

        .no-records p {
          color: #666;
          margin-bottom: 25px;
        }

        .view-all-btn {
          padding: 12px 24px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.3s ease;
        }

        .view-all-btn:hover {
          background: #5a6fd8;
        }

        @media (max-width: 768px) {
          .services-page {
            padding: 15px;
          }

          .header-info h1 {
            font-size: 1.8rem;
          }

          .services-stats {
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
          }

          .stat-card {
            padding: 20px;
          }

          .stat-number {
            font-size: 2rem;
          }

          .services-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .service-card {
            margin: 0;
          }

          .service-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
          }

          .service-value {
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
};

export default EmployeeServicesPage;