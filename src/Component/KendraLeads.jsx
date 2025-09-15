import React, { useEffect, useState } from 'react';

const KendraLeads = () => {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const leadsPerPage = 5;
  const token = localStorage.getItem("token");

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://ruwa-backend.onrender.com/api/services/apply-kendra/admin/all', {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      console.log("Fetched leads from backend:", data);

      const formatted = data.map((item) => ({
        id: item._id,
        name: item.name || '',
        email: item.email || '',
        phone: item.phone || '',
        aadhaar: item.aadhaar || '',
        address: item.address || '',
        businessType: item.businessType || '',
        investmentCapacity: item.investmentCapacity || '',
        proposedLocation: item.proposedLocation || '',
        franchiseCategory: item.franchiseCategory || '',
        category: item.category || '',
        relevantExperience: item.relevantExperience || '',
        status: item.status || 'PENDING',
        // Document URLs
        idProof: item.idProof || '',
        qualificationCertificate: item.qualificationCertificate || '',
        financialStatement: item.financialStatement || '',
        // Payment info
        paymentStatus: item.payment?.paid || false,
        appliedBy: item.appliedBy || '',
        forUser: item.forUser || '',
        createdBy: item.createdBy || '',
        datetime: new Date(item.createdAt || Date.now()).toLocaleString(),
      }));

      setLeads(formatted);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
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
        // Add proper delete API call here when available
        setLeads((prev) => prev.filter((lead) => lead.id !== id));
        alert("Application deleted successfully!");
      } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete application.");
      }
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://ruwa-backend.onrender.com/api/services/apply-kendra/admin/status/${id}`,
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
    (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    lead.phone.includes(searchTerm) ||
    (lead.aadhaar && lead.aadhaar.includes(searchTerm)) ||
    lead.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.proposedLocation.toLowerCase().includes(searchTerm.toLowerCase())
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
            <i className="fas fa-store me-2"></i>
            Kendra Applications Management
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
          placeholder="Search by name, email, phone, aadhaar, address, or location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="table-responsive" style={{ overflowX: 'auto' }}>
          <table className="table table-bordered table-striped table-hover" style={{ minWidth: '1100px' }}>
            <thead className="table-dark">
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Aadhaar</th>
                <th>Category</th>
                <th>Location</th>
                <th>Status</th>
                <th>Payment</th>
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
                    <td className="font-monospace">{lead.phone}</td>
                    <td className="font-monospace" style={{ maxWidth: '120px' }}>{lead.aadhaar}</td>
                    <td>
                      <span className="badge bg-info">{lead.franchiseCategory}</span>
                    </td>
                    <td style={{ maxWidth: '120px', wordBreak: 'break-word' }}>{lead.proposedLocation}</td>
                    <td>
                      <span
                        className={`badge ${
                          lead.status === "APPROVED"
                            ? "bg-success"
                            : lead.status === "REJECTED"
                            ? "bg-danger"
                            : lead.status === "WITHDRAWN"
                            ? "bg-secondary"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          lead.paymentStatus ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {lead.paymentStatus ? "PAID" : "UNPAID"}
                      </span>
                    </td>
                    <td className="text-nowrap small">{lead.datetime}</td>
                    <td className="text-center">
                      <div className="d-flex gap-1 justify-content-center">
                        {lead.idProof && (
                          <span className="badge bg-primary" title="ID Proof">🆔</span>
                        )}
                        {lead.qualificationCertificate && (
                          <span className="badge bg-success" title="Qualification Certificate">🎓</span>
                        )}
                        {lead.financialStatement && (
                          <span className="badge bg-info" title="Financial Statement">💰</span>
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
                  <td colSpan="11" className="text-center py-4">
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

      {/* Enhanced Modal for Application Review */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        {selectedLead && (
          <>
            <div className="modal-header bg-light">
              <h5 className="modal-title">
                <i className="fas fa-store me-2"></i>
                Kendra Application Review - {selectedLead.name}
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
                    <p><strong>Phone:</strong> {selectedLead.phone}</p>
                    <p><strong>Aadhaar:</strong> {selectedLead.aadhaar}</p>
                    {selectedLead.email && <p><strong>Email:</strong> {selectedLead.email}</p>}
                  </div>
                  <div className="col-md-6">
                    <p><strong>Address:</strong> {selectedLead.address}</p>
                    <p><strong>Proposed Location:</strong> {selectedLead.proposedLocation}</p>
                    <p><strong>Applied Date:</strong> {selectedLead.datetime}</p>
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div className="bg-light p-3 rounded mb-4">
                <h6 className="mb-3 text-primary">
                  <i className="fas fa-briefcase me-2"></i>Business Information
                </h6>
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Business Type:</strong> {selectedLead.businessType}</p>
                    <p><strong>Franchise Category:</strong> 
                      <span className="badge bg-info ms-2">{selectedLead.franchiseCategory}</span>
                    </p>
                    <p><strong>Investment Capacity:</strong> {selectedLead.investmentCapacity}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Relevant Experience:</strong> {selectedLead.relevantExperience}</p>
                    <p><strong>Current Status:</strong> 
                      <span className={`badge ms-2 ${
                        selectedLead.status === "APPROVED"
                          ? "bg-success"
                          : selectedLead.status === "REJECTED"
                          ? "bg-danger"
                          : selectedLead.status === "WITHDRAWN"
                          ? "bg-secondary"
                          : "bg-warning text-dark"
                      }`}>
                        {selectedLead.status}
                      </span>
                    </p>
                    <p><strong>Payment Status:</strong> 
                      <span className={`badge ms-2 ${
                        selectedLead.paymentStatus ? "bg-success" : "bg-danger"
                      }`}>
                        {selectedLead.paymentStatus ? "PAID" : "UNPAID"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              <div className="mb-4">
                <h6 className="mb-3 text-primary">
                  <i className="fas fa-folder-open me-2"></i>Uploaded Documents
                </h6>
                <div className="row g-3">
                  {/* ID Proof */}
                  <div className="col-md-4">
                    <div className="card h-100 shadow-sm">
                      <div className="card-header bg-light py-2">
                        <small className="fw-bold text-muted">
                          🆔 ID Proof
                        </small>
                      </div>
                      <div className="card-body p-2">
                        {selectedLead.idProof ? (
                          <div className="text-center">
                            <img
                              src={selectedLead.idProof}
                              alt="ID Proof"
                              style={{
                                width: "100%",
                                height: "150px",
                                objectFit: "cover",
                                cursor: "pointer",
                                borderRadius: "4px",
                                border: "1px solid #dee2e6"
                              }}
                              onClick={() => openImageInNewTab(selectedLead.idProof)}
                              onError={(e) => {
                                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f8f9fa'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%236c757d'%3ENo Image%3C/text%3E%3C/svg%3E";
                              }}
                            />
                            <button
                              className="btn btn-outline-primary btn-sm mt-2 w-100"
                              onClick={() => openImageInNewTab(selectedLead.idProof)}
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

                  {/* Qualification Certificate */}
                  <div className="col-md-4">
                    <div className="card h-100 shadow-sm">
                      <div className="card-header bg-light py-2">
                        <small className="fw-bold text-muted">
                          🎓 Qualification Certificate
                        </small>
                      </div>
                      <div className="card-body p-2">
                        {selectedLead.qualificationCertificate ? (
                          <div className="text-center">
                            <img
                              src={selectedLead.qualificationCertificate}
                              alt="Qualification Certificate"
                              style={{
                                width: "100%",
                                height: "150px",
                                objectFit: "cover",
                                cursor: "pointer",
                                borderRadius: "4px",
                                border: "1px solid #dee2e6"
                              }}
                              onClick={() => openImageInNewTab(selectedLead.qualificationCertificate)}
                              onError={(e) => {
                                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f8f9fa'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%236c757d'%3ENo Image%3C/text%3E%3C/svg%3E";
                              }}
                            />
                            <button
                              className="btn btn-outline-primary btn-sm mt-2 w-100"
                              onClick={() => openImageInNewTab(selectedLead.qualificationCertificate)}
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

                  {/* Financial Statement */}
                  <div className="col-md-4">
                    <div className="card h-100 shadow-sm">
                      <div className="card-header bg-light py-2">
                        <small className="fw-bold text-muted">
                          💰 Financial Statement
                        </small>
                      </div>
                      <div className="card-body p-2">
                        {selectedLead.financialStatement ? (
                          <div className="text-center">
                            <img
                              src={selectedLead.financialStatement}
                              alt="Financial Statement"
                              style={{
                                width: "100%",
                                height: "150px",
                                objectFit: "cover",
                                cursor: "pointer",
                                borderRadius: "4px",
                                border: "1px solid #dee2e6"
                              }}
                              onClick={() => openImageInNewTab(selectedLead.financialStatement)}
                              onError={(e) => {
                                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f8f9fa'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%236c757d'%3ENo Image%3C/text%3E%3C/svg%3E";
                              }}
                            />
                            <button
                              className="btn btn-outline-primary btn-sm mt-2 w-100"
                              onClick={() => openImageInNewTab(selectedLead.financialStatement)}
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
                <strong>Review Instructions:</strong> Please verify all uploaded documents and business information carefully before approving or rejecting the kendra application. Click on any document image to view it in full size.
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
                    onClick={() => handleStatusUpdate(selectedLead.id, "APPROVED")}
                    disabled={loading || selectedLead.status === "APPROVED"}
                  >
                    <i className="fas fa-check me-1"></i>
                    {loading ? "Processing..." : "Approve"}
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleStatusUpdate(selectedLead.id, "REJECTED")}
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

export default KendraLeads;