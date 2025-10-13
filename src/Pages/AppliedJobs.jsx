import React, { useState, useEffect } from 'react';

const AdminApplicationsPanel = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    page: 1
  });
  const [selectedApp, setSelectedApp] = useState(null);
  const [stats, setStats] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/job-application';

  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, [filters]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        ...(filters.status && { status: filters.status }),
        ...(filters.search && { search: filters.search }),
        page: filters.page,
        limit: 20
      });

      const response = await fetch(`${API_BASE_URL}/all?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`);
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const updateStatus = async (id, status, adminNotes = '') => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Status updated successfully!');
        fetchApplications();
        fetchStats();
        setSelectedApp(null);
      } else {
        alert(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-warning text-dark',
      under_review: 'bg-info text-white',
      shortlisted: 'bg-primary text-white',
      rejected: 'bg-danger text-white',
      selected: 'bg-success text-white'
    };
    return badges[status] || 'bg-secondary';
  };

  return (
    <div className="container-fluid py-4">
      <h2 className="mb-4">Job Applications Management</h2>

      {/* Statistics */}
      {stats && (
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <h5>Total Applications</h5>
                <h2>{stats.totalApplications}</h2>
              </div>
            </div>
          </div>
          {stats.statusBreakdown.map(item => (
            <div key={item._id} className="col-md-2">
              <div className="card">
                <div className="card-body">
                  <h6 className="text-muted text-uppercase">{item._id.replace('_', ' ')}</h6>
                  <h3>{item.count}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Status Filter</label>
              <select 
                className="form-select"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value, page: 1})}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
                <option value="selected">Selected</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Search</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, email, or phone..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value, page: 1})}
              />
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button 
                className="btn btn-secondary w-100"
                onClick={() => setFilters({ status: '', search: '', page: 1 })}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="card">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-5 text-muted">
              No applications found
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Job Position</th>
                    <th>Contact</th>
                    <th>Qualification</th>
                    <th>Applied Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app._id}>
                      <td>
                        <strong>{app.fullName}</strong>
                        <br />
                        <small className="text-muted">{app.gender}</small>
                      </td>
                      <td>
                        {app.jobId?.postName || 'N/A'}
                        <br />
                        <small className="text-muted">
                          {app.jobId?.advertisementNumber}
                        </small>
                      </td>
                      <td>
                        <small>
                          {app.email}<br />
                          {app.phoneNumber}
                        </small>
                      </td>
                      <td>{app.educationalQualification}</td>
                      <td>
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadge(app.status)}`}>
                          {app.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => setSelectedApp(app)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Application Detail Modal */}
      {selectedApp && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Application Details</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setSelectedApp(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <strong>Full Name:</strong> {selectedApp.fullName}
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Email:</strong> {selectedApp.email}
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Phone:</strong> {selectedApp.phoneNumber}
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Gender:</strong> {selectedApp.gender}
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Date of Birth:</strong> {new Date(selectedApp.dateOfBirth).toLocaleDateString()}
                  </div>
                  <div className="col-12 mb-3">
                    <strong>Address:</strong> {selectedApp.address}, {selectedApp.city}, {selectedApp.state} - {selectedApp.pincode}
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Education:</strong> {selectedApp.educationalQualification}
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Institution:</strong> {selectedApp.institution || 'N/A'}
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Experience:</strong> {selectedApp.experienceYears || 0} years
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Expected Salary:</strong> {selectedApp.expectedSalary || 'N/A'}
                  </div>
                  {selectedApp.coverLetter && (
                    <div className="col-12 mb-3">
                      <strong>Cover Letter:</strong>
                      <p className="mt-2">{selectedApp.coverLetter}</p>
                    </div>
                  )}
                  
                  <div className="col-12 mb-3">
                    <strong>Documents:</strong>
                    <div className="mt-2">
                      {selectedApp.documents.resume && (
                        <a href={selectedApp.documents.resume} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary me-2 mb-2">
                          📄 Resume
                        </a>
                      )}
                      {selectedApp.documents.photo && (
                        <a href={selectedApp.documents.photo} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary me-2 mb-2">
                          📷 Photo
                        </a>
                      )}
                      {selectedApp.documents.idProof && (
                        <a href={selectedApp.documents.idProof} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary me-2 mb-2">
                          🆔 ID Proof
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="col-12 mb-3">
                    <label className="form-label"><strong>Update Status:</strong></label>
                    <select 
                      className="form-select mb-2"
                      defaultValue={selectedApp.status}
                      id="statusSelect"
                    >
                      <option value="pending">Pending</option>
                      <option value="under_review">Under Review</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="rejected">Rejected</option>
                      <option value="selected">Selected</option>
                    </select>
                    
                    <textarea
                      className="form-control mb-2"
                      placeholder="Admin notes (optional)"
                      rows="3"
                      id="adminNotes"
                      defaultValue={selectedApp.adminNotes || ''}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setSelectedApp(null)}
                >
                  Close
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => {
                    const status = document.getElementById('statusSelect').value;
                    const notes = document.getElementById('adminNotes').value;
                    updateStatus(selectedApp._id, status, notes);
                  }}
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApplicationsPanel;