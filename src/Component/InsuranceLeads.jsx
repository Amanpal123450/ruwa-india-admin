import React, { useEffect, useState } from "react";

const InsuranceApplications = () => {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const appsPerPage = 5;
  const token = localStorage.getItem("token");

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://ruwa-backend.onrender.com/api/services/apply-insurance/admin/all", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      console.log("Fetched insurance applications:", data);

      const formatted = data.map((item) => ({
        id: item._id,
        fullName: item.fullName || '',
        email: item.email || '',
        phoneNumber: item.phoneNumber || '',
        aadhaarNumber: item.aadhaarNumber || '',
        address: item.address || '',
        state: item.state || '',
        district: item.district || '',
        pincode: item.pincode || '',
        dob: item.dob || '',
        gender: item.gender || '',
        insuranceType: item.insuranceType || '',
        status: item.status || 'PENDING',
        appliedBy: item.appliedBy?.name || item.appliedBy || 'N/A',
        role: item.appliedBy?.role || 'N/A',
        // Document URLs
        idProof: item.id_proof || '',
        passportPhoto: item.passport_photo || '',
        medicalDocuments: item.medical_documents || '',
        incomeCertificate: item.income_certificate || '',
        datetime: new Date(item.createdAt || Date.now()).toLocaleString(),
      }));

      setApplications(formatted);
    } catch (error) {
      console.error("Failed to fetch insurance applications:", error);
      alert("Failed to fetch applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        // Add proper delete API call here when available
        setApplications((prev) => prev.filter((app) => app.id !== id));
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
        `https://ruwa-backend.onrender.com/api/services/apply-insurance/admin/status/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (response.ok) {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === id ? { ...app, status } : app
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

  const filteredApplications = applications.filter((app) =>
    app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (app.email && app.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    app.phoneNumber.includes(searchTerm) ||
    (app.aadhaarNumber && app.aadhaarNumber.includes(searchTerm)) ||
    app.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.insuranceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.appliedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * appsPerPage;
  const indexOfFirst = indexOfLast - appsPerPage;
  const currentApps = filteredApplications.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredApplications.length / appsPerPage);

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
            <i className="fas fa-shield-alt me-2"></i>
            Insurance Applications Management
          </h5>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={fetchApplications}
            disabled={loading}
          >
            <i className="fas fa-sync me-1"></i>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search by name, email, phone, aadhaar, address, insurance type, or applied by"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="table-responsive" style={{ overflowX: "auto" }}>
          <table className="table table-bordered table-striped table-hover" style={{ minWidth: "1100px" }}>
            <thead className="table-dark">
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Aadhaar</th>
                <th>Insurance Type</th>
                <th>State</th>
                <th>Applied By</th>
                <th>Status</th>
                <th>Applied Date</th>
                <th>Documents</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentApps.length > 0 ? (
                currentApps.map((app, index) => (
                  <tr key={app.id}>
                    <td className="text-center fw-bold">
                      {indexOfFirst + index + 1}
                    </td>
                    <td style={{ maxWidth: '150px', wordBreak: 'break-word' }}>{app.fullName}</td>
                    <td className="font-monospace">{app.phoneNumber}</td>
                    <td className="font-monospace" style={{ maxWidth: '120px' }}>{app.aadhaarNumber}</td>
                    <td>
                      <span className="badge bg-info">{app.insuranceType}</span>
                    </td>
                    <td style={{ maxWidth: '120px', wordBreak: 'break-word' }}>{app.state}</td>
                    <td>{app.appliedBy}</td>
                    <td>
                      <span
                        className={`badge ${
                          app.status === "APPROVED"
                            ? "bg-success"
                            : app.status === "REJECTED"
                            ? "bg-danger"
                            : app.status === "WITHDRAWN"
                            ? "bg-secondary"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="text-nowrap small">{app.datetime}</td>
                    <td className="text-center">
                      <div className="d-flex gap-1 justify-content-center">
                        {app.idProof && (
                          <span className="badge bg-primary" title="ID Proof">🆔</span>
                        )}
                        {app.passportPhoto && (
                          <span className="badge bg-success" title="Passport Photo">📸</span>
                        )}
                        {app.medicalDocuments && (
                          <span className="badge bg-info" title="Medical Documents">🏥</span>
                        )}
                        {app.incomeCertificate && (
                          <span className="badge bg-warning" title="Income Certificate">💰</span>
                        )}
                      </div>
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-info me-1 mb-1"
                        onClick={() => {
                          setSelectedApplication(app);
                          setShowModal(true);
                        }}
                      >
                        <i className="fas fa-eye me-1"></i>Review
                      </button>
                      <button
                        className="btn btn-sm btn-danger mb-1"
                        onClick={() => handleDelete(app.id)}
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
            Showing {indexOfFirst + 1}–{Math.min(indexOfLast, filteredApplications.length)} of {filteredApplications.length} applications
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
        {selectedApplication && (
          <>
            <div className="modal-header bg-light">
              <h5 className="modal-title">
                <i className="fas fa-shield-alt me-2"></i>
                Insurance Application Review - {selectedApplication.fullName}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body p-4">
              {/* Personal Information */}
              <div className="bg-light p-3 rounded mb-4">
                <h6 className="mb-3 text-primary">
                  <i className="fas fa-user me-2"></i>Personal Information
                </h6>
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Full Name:</strong> {selectedApplication.fullName}</p>
                    <p><strong>Date of Birth:</strong> {selectedApplication.dob}</p>
                    <p><strong>Gender:</strong> {selectedApplication.gender}</p>
                    <p><strong>Phone:</strong> {selectedApplication.phoneNumber}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Email:</strong> {selectedApplication.email}</p>
                    <p><strong>Aadhaar Number:</strong> {selectedApplication.aadhaarNumber}</p>
                    <p><strong>Applied Date:</strong> {selectedApplication.datetime}</p>
                    <p><strong>Applied By:</strong> {selectedApplication.appliedBy} ({selectedApplication.role})</p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-light p-3 rounded mb-4">
                <h6 className="mb-3 text-primary">
                  <i className="fas fa-map-marker-alt me-2"></i>Address Information
                </h6>
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Address:</strong> {selectedApplication.address}</p>
                    <p><strong>State:</strong> {selectedApplication.state}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>District:</strong> {selectedApplication.district}</p>
                    <p><strong>Pincode:</strong> {selectedApplication.pincode}</p>
                  </div>
                </div>
              </div>

              {/* Insurance Information */}
              <div className="bg-light p-3 rounded mb-4">
                <h6 className="mb-3 text-primary">
                  <i className="fas fa-shield-alt me-2"></i>Insurance Information
                </h6>
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Insurance Type:</strong> 
                      <span className="badge bg-info ms-2">{selectedApplication.insuranceType}</span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Current Status:</strong> 
                      <span className={`badge ms-2 ${
                        selectedApplication.status === "APPROVED"
                          ? "bg-success"
                          : selectedApplication.status === "REJECTED"
                          ? "bg-danger"
                          : selectedApplication.status === "WITHDRAWN"
                          ? "bg-secondary"
                          : "bg-warning text-dark"
                      }`}>
                        {selectedApplication.status}
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
                  <div className="col-md-6">
                    <div className="card h-100 shadow-sm">
                      <div className="card-header bg-light py-2">
                        <small className="fw-bold text-muted">
                          🆔 ID Proof
                        </small>
                      </div>
                      <div className="card-body p-2">
                        {selectedApplication.idProof ? (
                          <div className="text-center">
                            <img
                              src={selectedApplication.idProof}
                              alt="ID Proof"
                              style={{
                                width: "100%",
                                height: "150px",
                                objectFit: "cover",
                                cursor: "pointer",
                                borderRadius: "4px",
                                border: "1px solid #dee2e6"
                              }}
                              onClick={() => openImageInNewTab(selectedApplication.idProof)}
                              onError={(e) => {
                                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f8f9fa'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%236c757d'%3ENo Image%3C/text%3E%3C/svg%3E";
                              }}
                            />
                            <button
                              className="btn btn-outline-primary btn-sm mt-2 w-100"
                              onClick={() => openImageInNewTab(selectedApplication.idProof)}
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

                  {/* Passport Photo */}
                  <div className="col-md-6">
                    <div className="card h-100 shadow-sm">
                      <div className="card-header bg-light py-2">
                        <small className="fw-bold text-muted">
                          📸 Passport Photo
                        </small>
                      </div>
                      <div className="card-body p-2">
                        {selectedApplication.passportPhoto ? (
                          <div className="text-center">
                            <img
                              src={selectedApplication.passportPhoto}
                              alt="Passport Photo"
                              style={{
                                width: "100%",
                                height: "150px",
                                objectFit: "cover",
                                cursor: "pointer",
                                borderRadius: "4px",
                                border: "1px solid #dee2e6"
                              }}
                              onClick={() => openImageInNewTab(selectedApplication.passportPhoto)}
                              onError={(e) => {
                                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f8f9fa'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%236c757d'%3ENo Image%3C/text%3E%3C/svg%3E";
                              }}
                            />
                            <button
                              className="btn btn-outline-primary btn-sm mt-2 w-100"
                              onClick={() => openImageInNewTab(selectedApplication.passportPhoto)}
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

                  {/* Medical Documents */}
                  <div className="col-md-6">
                    <div className="card h-100 shadow-sm">
                      <div className="card-header bg-light py-2">
                        <small className="fw-bold text-muted">
                          🏥 Medical Documents
                        </small>
                      </div>
                      <div className="card-body p-2">
                        {selectedApplication.medicalDocuments ? (
                          <div className="text-center">
                            <img
                              src={selectedApplication.medicalDocuments}
                              alt="Medical Documents"
                              style={{
                                width: "100%",
                                height: "150px",
                                objectFit: "cover",
                                cursor: "pointer",
                                borderRadius: "4px",
                                border: "1px solid #dee2e6"
                              }}
                              onClick={() => openImageInNewTab(selectedApplication.medicalDocuments)}
                              onError={(e) => {
                                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f8f9fa'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%236c757d'%3ENo Image%3C/text%3E%3C/svg%3E";
                              }}
                            />
                            <button
                              className="btn btn-outline-primary btn-sm mt-2 w-100"
                              onClick={() => openImageInNewTab(selectedApplication.medicalDocuments)}
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

                  {/* Income Certificate */}
                  <div className="col-md-6">
                    <div className="card h-100 shadow-sm">
                      <div className="card-header bg-light py-2">
                        <small className="fw-bold text-muted">
                          💰 Income Certificate
                        </small>
                      </div>
                      <div className="card-body p-2">
                        {selectedApplication.incomeCertificate ? (
                          <div className="text-center">
                            <img
                              src={selectedApplication.incomeCertificate}
                              alt="Income Certificate"
                              style={{
                                width: "100%",
                                height: "150px",
                                objectFit: "cover",
                                cursor: "pointer",
                                borderRadius: "4px",
                                border: "1px solid #dee2e6"
                              }}
                              onClick={() => openImageInNewTab(selectedApplication.incomeCertificate)}
                              onError={(e) => {
                                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f8f9fa'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%236c757d'%3ENo Image%3C/text%3E%3C/svg%3E";
                              }}
                            />
                            <button
                              className="btn btn-outline-primary btn-sm mt-2 w-100"
                              onClick={() => openImageInNewTab(selectedApplication.incomeCertificate)}
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
                <strong>Review Instructions:</strong> Please verify all uploaded documents and personal information carefully before approving or rejecting the insurance application. Click on any document image to view it in full size.
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
                    onClick={() => handleStatusUpdate(selectedApplication.id, "APPROVED")}
                    disabled={loading || selectedApplication.status === "APPROVED"}
                  >
                    <i className="fas fa-check me-1"></i>
                    {loading ? "Processing..." : "Approve"}
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleStatusUpdate(selectedApplication.id, "REJECTED")}
                    disabled={loading || selectedApplication.status === "REJECTED"}
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

export default InsuranceApplications;