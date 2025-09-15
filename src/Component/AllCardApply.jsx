import React, { useEffect, useState } from 'react';

const AllCardApply = () => {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const leadsPerPage = 5;
  const token = localStorage.getItem('token');

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://ruwa-backend.onrender.com/api/services/janarogya/admin/all", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      console.log("Fetched applications from backend:", data);

      const formatted = data.map((item) => ({
        id: item._id,
        name: item.name || '',
        aadhar: item.aadhar || '',
        mobile: item.mobile || '',
        state: item.state || '',
        district: item.district || '',
        status: item.status || 'PENDING',
        appliedBy: item.appliedBy || '',
        forUser: item.forUser || '',
        // Document URLs
        income_certificate: item.income_certificate || '',
        caste_certificate: item.caste_certificate || '',
        ration_id: item.ration_id || '',
        datetime: new Date(item.createdAt || Date.now()).toLocaleString(),
      }));

      setLeads(formatted);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      alert("Failed to fetch applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        // Add delete API call here if available
        setLeads((prev) => prev.filter((lead) => lead.id !== id));
        alert("Application deleted successfully!");
      } catch (error) {
        console.error("Error deleting application:", error);
        alert("Failed to delete application.");
      }
    }
  };

  const handleApproveReject = async (id, status) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://ruwa-backend.onrender.com/api/services/janarogya/admin/status/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (response.ok) {
        setLeads((prev) =>
          prev.map((lead) =>
            lead.id === id ? { ...lead, status } : lead
          )
        );
        setShowModal(false);
        alert(`Application ${status.toLowerCase()} successfully!`);
      } else {
        const errorData = await response.json();
        alert(`Failed to update status: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openImageInNewTab = (imageUrl) => {
    if (imageUrl) {
      window.open(imageUrl, '_blank');
    }
  };

  const filteredLeads = leads.filter((lead) =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.mobile.includes(searchTerm) ||
    lead.aadhar.includes(searchTerm) ||
    lead.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * leadsPerPage;
  const indexOfFirst = indexOfLast - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

  // Modal Component
  const Modal = ({ show, onHide, children }) => {
    if (!show) return null;

    return (
      <div 
        className="modal fade show" 
        style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
        onClick={onHide}
      >
        <div 
          className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
            {children}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid mt-4">
      <div className="card shadow-sm p-4">
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <h5 className="mb-0">
            <i className="fas fa-users me-2"></i>
            Applications Management
          </h5>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={fetchLeads}
            disabled={loading}
          >
            <i className="fas fa-sync me-1"></i>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="🔍 Search by name, aadhar, phone, state, or district"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="table-responsive" style={{ overflowX: 'auto' }}>
          <table className="table table-bordered table-striped table-hover" style={{ minWidth: '900px' }}>
            <thead className="table-dark">
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Aadhar</th>
                <th>Phone</th>
                <th>State</th>
                <th>District</th>
                <th>Status</th>
                <th>Applied Date</th>
                <th>Documents</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentLeads.length > 0 ? (
                currentLeads.map((lead, index) => (
                  <tr key={lead.id}>
                    <td className="text-center fw-bold">
                      {indexOfFirst + index + 1}
                    </td>
                    <td style={{ maxWidth: '150px', wordBreak: 'break-word' }}>{lead.name}</td>
                    <td className="font-monospace" style={{ maxWidth: '120px' }}>{lead.aadhar}</td>
                    <td className="font-monospace">{lead.mobile}</td>
                    <td style={{ maxWidth: '100px', wordBreak: 'break-word' }}>{lead.state}</td>
                    <td style={{ maxWidth: '100px', wordBreak: 'break-word' }}>{lead.district}</td>
                    <td>
                      <span
                        className={`badge ${
                          lead.status === "APPROVED"
                            ? "bg-success"
                            : lead.status === "REJECTED"
                            ? "bg-danger"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="text-nowrap small">{lead.datetime}</td>
                    <td className="text-center">
                      <div className="d-flex gap-1 justify-content-center">
                        {lead.income_certificate && (
                          <span className="badge bg-info" title="Income Certificate">📄</span>
                        )}
                        {lead.caste_certificate && (
                          <span className="badge bg-secondary" title="Caste Certificate">📋</span>
                        )}
                        {lead.ration_id && (
                          <span className="badge bg-success" title="Ration Card">🆔</span>
                        )}
                      </div>
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-info me-1 mb-1"
                        onClick={() => {
                          setSelectedLead(lead);
                          setShowModal(true);
                        }}
                      >
                        <i className="fas fa-eye me-1"></i>Review
                      </button>
                      <button
                        className="btn btn-sm btn-danger mb-1"
                        onClick={() => handleDelete(lead.id)}
                      >
                        <i className="fas fa-trash me-1"></i>Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center py-4">
                    {loading ? (
                      <div>
                        <div className="spinner-border text-primary me-2" role="status"></div>
                        Loading applications...
                      </div>
                    ) : (
                      <div className="text-muted">
                        <i className="fas fa-inbox fa-2x mb-2 d-block"></i>
                        No applications found.
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3 gap-2">
          <small className="text-muted">
            Showing {indexOfFirst + 1}–{Math.min(indexOfLast, filteredLeads.length)} of {filteredLeads.length} applications
          </small>
          <div>
            <button
              className="btn btn-sm btn-outline-secondary me-2"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <i className="fas fa-chevron-left me-1"></i>Previous
            </button>
            <span className="me-2 text-muted">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next<i className="fas fa-chevron-right ms-1"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Modal for Document Review */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        {selectedLead && (
          <>
            <div className="modal-header bg-light">
              <h5 className="modal-title">
                <i className="fas fa-file-alt me-2"></i>
                Application Review - {selectedLead.name}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body p-4">
              {/* Applicant Information */}
              <div className="bg-light p-3 rounded mb-4">
                <h6 className="mb-3 text-primary">
                  <i className="fas fa-user me-2"></i>Applicant Information
                </h6>
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Name:</strong> {selectedLead.name}</p>
                    <p><strong>Aadhar:</strong> {selectedLead.aadhar}</p>
                    <p><strong>Phone:</strong> {selectedLead.mobile}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>State:</strong> {selectedLead.state}</p>
                    <p><strong>District:</strong> {selectedLead.district}</p>
                    <p><strong>Applied Date:</strong> {selectedLead.datetime}</p>
                  </div>
                </div>
                <p>
                  <strong>Current Status:</strong> 
                  <span className={`badge ms-2 ${
                    selectedLead.status === "APPROVED"
                      ? "bg-success"
                      : selectedLead.status === "REJECTED"
                      ? "bg-danger"
                      : "bg-warning text-dark"
                  }`}>
                    {selectedLead.status}
                  </span>
                </p>
              </div>

              {/* Documents Section */}
              <div className="mb-4">
                <h6 className="mb-3 text-primary">
                  <i className="fas fa-folder-open me-2"></i>Uploaded Documents
                </h6>
                <div className="row g-3">
                  {/* Income Certificate */}
                  <div className="col-md-4">
                    <div className="card h-100 shadow-sm">
                      <div className="card-header bg-light py-2">
                        <small className="fw-bold text-muted">
                          💰 Income Certificate
                        </small>
                      </div>
                      <div className="card-body p-2">
                        {selectedLead.income_certificate ? (
                          <div className="text-center">
                            <img
                              src={selectedLead.income_certificate}
                              alt="Income Certificate"
                              style={{
                                width: "100%",
                                height: "150px",
                                objectFit: "cover",
                                cursor: "pointer",
                                borderRadius: "4px",
                                border: "1px solid #dee2e6"
                              }}
                              onClick={() => openImageInNewTab(selectedLead.income_certificate)}
                              onError={(e) => {
                                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f8f9fa'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%236c757d'%3ENo Image%3C/text%3E%3C/svg%3E";
                              }}
                            />
                            <button
                              className="btn btn-outline-primary btn-sm mt-2 w-100"
                              onClick={() => openImageInNewTab(selectedLead.income_certificate)}
                            >
                              View Full Size
                            </button>
                          </div>
                        ) : (
                          <div className="text-center text-muted py-4">
                            <p className="mb-0">No document uploaded</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Caste Certificate */}
                  <div className="col-md-4">
                    <div className="card h-100 shadow-sm">
                      <div className="card-header bg-light py-2">
                        <small className="fw-bold text-muted">
                          📜 Caste Certificate
                        </small>
                      </div>
                      <div className="card-body p-2">
                        {selectedLead.caste_certificate ? (
                          <div className="text-center">
                            <img
                              src={selectedLead.caste_certificate}
                              alt="Caste Certificate"
                              style={{
                                width: "100%",
                                height: "150px",
                                objectFit: "cover",
                                cursor: "pointer",
                                borderRadius: "4px",
                                border: "1px solid #dee2e6"
                              }}
                              onClick={() => openImageInNewTab(selectedLead.caste_certificate)}
                              onError={(e) => {
                                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f8f9fa'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%236c757d'%3ENo Image%3C/text%3E%3C/svg%3E";
                              }}
                            />
                            <button
                              className="btn btn-outline-primary btn-sm mt-2 w-100"
                              onClick={() => openImageInNewTab(selectedLead.caste_certificate)}
                            >
                              View Full Size
                            </button>
                          </div>
                        ) : (
                          <div className="text-center text-muted py-4">
                            <p className="mb-0">No document uploaded</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Ration Card */}
                  <div className="col-md-4">
                    <div className="card h-100 shadow-sm">
                      <div className="card-header bg-light py-2">
                        <small className="fw-bold text-muted">
                          🆔 Ration Card
                        </small>
                      </div>
                      <div className="card-body p-2">
                        {selectedLead.ration_id ? (
                          <div className="text-center">
                            <img
                              src={selectedLead.ration_id}
                              alt="Ration Card"
                              style={{
                                width: "100%",
                                height: "150px",
                                objectFit: "cover",
                                cursor: "pointer",
                                borderRadius: "4px",
                                border: "1px solid #dee2e6"
                              }}
                              onClick={() => openImageInNewTab(selectedLead.ration_id)}
                              onError={(e) => {
                                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f8f9fa'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%236c757d'%3ENo Image%3C/text%3E%3C/svg%3E";
                              }}
                            />
                            <button
                              className="btn btn-outline-primary btn-sm mt-2 w-100"
                              onClick={() => openImageInNewTab(selectedLead.ration_id)}
                            >
                              View Full Size
                            </button>
                          </div>
                        ) : (
                          <div className="text-center text-muted py-4">
                            <p className="mb-0">No document uploaded</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Instructions */}
              <div className="alert alert-info">
                <i className="fas fa-info-circle me-2"></i>
                <strong>Review Instructions:</strong> Please verify all uploaded documents carefully before approving or rejecting the application. Click on any document image to view it in full size.
              </div>
            </div>
            <div className="modal-footer bg-light">
              <div className="d-flex w-100 justify-content-between align-items-center">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                >
                  <i className="fas fa-times me-1"></i>Close
                </button>
                <div>
                  <button
                    className="btn btn-success me-2"
                    onClick={() => handleApproveReject(selectedLead.id, "APPROVED")}
                    disabled={loading || selectedLead.status === "APPROVED"}
                  >
                    <i className="fas fa-check me-1"></i>
                    {loading ? "Processing..." : "Approve"}
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleApproveReject(selectedLead.id, "REJECTED")}
                    disabled={loading || selectedLead.status === "REJECTED"}
                  >
                    <i className="fas fa-times me-1"></i>
                    {loading ? "Processing..." : "Reject"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default AllCardApply;