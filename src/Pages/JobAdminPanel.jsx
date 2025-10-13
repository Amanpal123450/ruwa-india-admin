import React, { useState, useEffect } from "react";

const API_BASE_URL = "https://ruwa-backend.onrender.com/api";

const JobAdminPanel = () => {
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const initialFormData = {
    jobTitle: "",
    advertisementNumber: "",
    postingDate: new Date().toISOString().split("T")[0],
    totalVacancies: "",
    jobCategory: "",
    postName: "",
    payScale: "",
    numberOfPosts: "",
    minAge: "",
    maxAge: "",
    ageRelaxation: "",
    educationalQualifications: "",
    experienceRequired: "",
    applicationStartDate: "",
    applicationEndDate: "",
    applicationFee: "",
    applicationMode: "online",
    applicationLink: "",
    contactEmail: "",
    contactDepartment: "",
    officialWebsite: "",
    jobResponsibilities: "",
    importantNotes: "",
    jobStatus: "draft",
    featured: false,
    jobLocation: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const token=localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/jobs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await response.json();
      setJobs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const url = editingJob
        ? `${API_BASE_URL}/jobs/${editingJob._id}`
        : `${API_BASE_URL}/jobs`;

      const method = editingJob ? "PUT" : "POST";
const token=localStorage.getItem('token')
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save job");
      }

      const savedJob = await response.json();

      if (editingJob) {
        setJobs((prev) =>
          prev.map((job) => (job._id === editingJob._id ? savedJob : job))
        );
        alert("Job updated successfully!");
      } else {
        setJobs((prev) => [...prev, savedJob]);
        alert("Job created successfully!");
      }

      resetForm();
    } catch (err) {
      setError(err.message);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingJob(null);
    setShowForm(false);
  };

  const editJob = (job) => {
    const formattedJob = {
      ...job,
      postingDate: job.postingDate
        ? new Date(job.postingDate).toISOString().split("T")[0]
        : "",
      applicationStartDate: job.applicationStartDate
        ? new Date(job.applicationStartDate).toISOString().split("T")[0]
        : "",
      applicationEndDate: job.applicationEndDate
        ? new Date(job.applicationEndDate).toISOString().split("T")[0]
        : "",
    };

    setFormData(formattedJob);
    setEditingJob(job);
    setShowForm(true);
  };

  const deleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token=localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete job");
      }

      setJobs((prev) => prev.filter((job) => job._id !== id));
      alert("Job deleted successfully!");
    } catch (err) {
      setError(err.message);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
  
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Job Posting Management</h1>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            style={styles.btnPrimary}
            onClick={() => setShowForm(true)}
            disabled={loading}
          >
            Add New Job
          </button>
          
        </div>
      </div>

      {error && (
        <div style={styles.errorBanner}>
          <strong>Error:</strong> {error}
          <button onClick={() => setError(null)} style={styles.closeError}>
            ×
          </button>
        </div>
      )}

      {loading && <div style={styles.loader}>Loading...</div>}

      {showForm && (
        <JobForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          editingJob={editingJob}
          resetForm={resetForm}
          loading={loading}
        />
      )}

      <JobList
        jobs={jobs}
        editJob={editJob}
        deleteJob={deleteJob}
        loading={loading}
      />
    </div>
  );
};

const JobForm = ({
  formData,
  handleInputChange,
  handleSubmit,
  editingJob,
  resetForm,
  loading,
}) => {
  return (
    <>
   
    <div style={styles.overlay}>
      <div style={styles.formContainer}>
        <div style={styles.formHeader}>
          <h2>{editingJob ? "Edit Job" : "Add New Job"}</h2>
          <button
            style={styles.closeBtn}
            onClick={resetForm}
            disabled={loading}
          >
            ×
          </button>
        </div>

        <div style={styles.formContent}>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Basic Information</h3>
            <div style={styles.grid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Job Title *</label>
                <input
                  style={styles.input}
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) =>
                    handleInputChange("jobTitle", e.target.value)
                  }
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Advertisement Number *</label>
                <input
                  style={styles.input}
                  type="text"
                  value={formData.advertisementNumber}
                  onChange={(e) =>
                    handleInputChange("advertisementNumber", e.target.value)
                  }
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Job Category *</label>
                <select
                  style={styles.input}
                  value={formData.jobCategory}
                  onChange={(e) =>
                    handleInputChange("jobCategory", e.target.value)
                  }
                >
                  <option value="">Select Category</option>
                  <option value="medical">Medical/Paramedical</option>
                  <option value="driver">Driver</option>
                  <option value="support">Support Staff</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Total Vacancies *</label>
                <input
                  style={styles.input}
                  type="number"
                  value={formData.totalVacancies}
                  onChange={(e) =>
                    handleInputChange("totalVacancies", e.target.value)
                  }
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Post Name *</label>
                <input
                  style={styles.input}
                  type="text"
                  value={formData.postName}
                  onChange={(e) =>
                    handleInputChange("postName", e.target.value)
                  }
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Pay Scale *</label>
                <input
                  style={styles.input}
                  type="text"
                  value={formData.payScale}
                  onChange={(e) =>
                    handleInputChange("payScale", e.target.value)
                  }
                  placeholder="e.g., Level-6 (₹35,400 - 1,12,400)"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Number of Posts *</label>
                <input
                  style={styles.input}
                  type="number"
                  value={formData.numberOfPosts}
                  onChange={(e) =>
                    handleInputChange("numberOfPosts", e.target.value)
                  }
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Job Location *</label>
                <input
                  style={styles.input}
                  type="text"
                  value={formData.jobLocation}
                  onChange={(e) =>
                    handleInputChange("jobLocation", e.target.value)
                  }
                  placeholder="e.g., Uttar Pradesh"
                />
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Eligibility Criteria</h3>
            <div style={styles.grid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Minimum Age *</label>
                <input
                  style={styles.input}
                  type="number"
                  value={formData.minAge}
                  onChange={(e) => handleInputChange("minAge", e.target.value)}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Maximum Age *</label>
                <input
                  style={styles.input}
                  type="number"
                  value={formData.maxAge}
                  onChange={(e) => handleInputChange("maxAge", e.target.value)}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Educational Qualifications *</label>
              <textarea
                style={{ ...styles.input, resize: "vertical" }}
                value={formData.educationalQualifications}
                onChange={(e) =>
                  handleInputChange("educationalQualifications", e.target.value)
                }
                rows={3}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Experience Required</label>
              <textarea
                style={{ ...styles.input, resize: "vertical" }}
                value={formData.experienceRequired}
                onChange={(e) =>
                  handleInputChange("experienceRequired", e.target.value)
                }
                rows={2}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Age Relaxation Details</label>
              <textarea
                style={{ ...styles.input, resize: "vertical" }}
                value={formData.ageRelaxation}
                onChange={(e) =>
                  handleInputChange("ageRelaxation", e.target.value)
                }
                rows={2}
              />
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Application Details</h3>
            <div style={styles.grid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Application Start Date *</label>
                <input
                  style={styles.input}
                  type="date"
                  value={formData.applicationStartDate}
                  onChange={(e) =>
                    handleInputChange("applicationStartDate", e.target.value)
                  }
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Application End Date *</label>
                <input
                  style={styles.input}
                  type="date"
                  value={formData.applicationEndDate}
                  onChange={(e) =>
                    handleInputChange("applicationEndDate", e.target.value)
                  }
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Application Mode *</label>
                <select
                  style={styles.input}
                  value={formData.applicationMode}
                  onChange={(e) =>
                    handleInputChange("applicationMode", e.target.value)
                  }
                >
                  <option value="online">Online</option>
                  <option value="email">Email</option>
                  <option value="both">Both</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Application Link</label>
                <input
                  style={styles.input}
                  type="url"
                  value={formData.applicationLink}
                  onChange={(e) =>
                    handleInputChange("applicationLink", e.target.value)
                  }
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Contact Email *</label>
                <input
                  style={styles.input}
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) =>
                    handleInputChange("contactEmail", e.target.value)
                  }
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Contact Department</label>
                <input
                  style={styles.input}
                  type="text"
                  value={formData.contactDepartment}
                  onChange={(e) =>
                    handleInputChange("contactDepartment", e.target.value)
                  }
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Official Website</label>
                <input
                  style={styles.input}
                  type="url"
                  value={formData.officialWebsite}
                  onChange={(e) =>
                    handleInputChange("officialWebsite", e.target.value)
                  }
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Application Fee Details</label>
              <textarea
                style={{ ...styles.input, resize: "vertical" }}
                value={formData.applicationFee}
                onChange={(e) =>
                  handleInputChange("applicationFee", e.target.value)
                }
                rows={2}
              />
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Job Description</h3>
            <div style={styles.formGroup}>
              <label style={styles.label}>Job Responsibilities *</label>
              <textarea
                style={{ ...styles.input, resize: "vertical" }}
                value={formData.jobResponsibilities}
                onChange={(e) =>
                  handleInputChange("jobResponsibilities", e.target.value)
                }
                rows={4}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Important Notes</label>
              <textarea
                style={{ ...styles.input, resize: "vertical" }}
                value={formData.importantNotes}
                onChange={(e) =>
                  handleInputChange("importantNotes", e.target.value)
                }
                rows={3}
              />
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Status & Visibility</h3>
            <div style={styles.grid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Job Status *</label>
                <select
                  style={styles.input}
                  value={formData.jobStatus}
                  onChange={(e) =>
                    handleInputChange("jobStatus", e.target.value)
                  }
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      handleInputChange("featured", e.target.checked)
                    }
                    style={styles.checkbox}
                  />
                  Featured Job
                </label>
              </div>
            </div>
          </div>

          <div style={styles.formActions}>
            <button
              style={styles.btnSecondary}
              onClick={resetForm}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              style={styles.btnPrimary}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Saving..." : editingJob ? "Update Job" : "Create Job"}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

const JobList = ({ jobs, editJob, deleteJob, loading }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: "#10b981", text: "Active" },
      draft: { bg: "#6b7280", text: "Draft" },
      closed: { bg: "#ef4444", text: "Closed" },
    };

    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span style={{ ...styles.badge, backgroundColor: config.bg }}>
        {config.text}
      </span>
    );
  };

  return (
    <div style={styles.listSection}>
      <h3 style={styles.listTitle}>Posted Jobs ({jobs.length})</h3>

      {jobs.length === 0 ? (
        <div style={styles.noJobs}>
          <p>
            No jobs posted yet. Click "Add New Job" to create your first job
            posting.
          </p>
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Post Name</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Vacancies</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Application Period</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id} style={styles.tr}>
                  <td style={styles.td}>
                    <div>
                      <strong>{job.postName}</strong>
                      {job.featured && (
                        <span
                          style={{
                            ...styles.badge,
                            backgroundColor: "#f59e0b",
                            marginLeft: "8px",
                          }}
                        >
                          Featured
                        </span>
                      )}
                    </div>
                    <small style={{ color: "#6b7280" }}>
                      {job.advertisementNumber}
                    </small>
                  </td>
                  <td style={styles.td}>
                    <span
                      style={{ ...styles.badge, backgroundColor: "#3b82f6" }}
                    >
                      {job.jobCategory}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {job.numberOfPosts || job.totalVacancies}
                  </td>
                  <td style={styles.td}>{getStatusBadge(job.jobStatus)}</td>
                  <td style={styles.td}>
                    <div style={{ fontSize: "13px" }}>
                      <div>
                        {job.applicationStartDate
                          ? new Date(
                              job.applicationStartDate
                            ).toLocaleDateString()
                          : "-"}
                      </div>
                      <div style={{ color: "#6b7280" }}>to</div>
                      <div>
                        {job.applicationEndDate
                          ? new Date(
                              job.applicationEndDate
                            ).toLocaleDateString()
                          : "-"}
                      </div>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actionButtons}>
                      <button
                        style={styles.btnEdit}
                        onClick={() => editJob(job)}
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button
                        style={styles.btnDelete}
                        onClick={() => deleteJob(job._id)}
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1400px",
    margin: "50px",
    padding: "20px",
    fontFamily: "system-ui, -apple-system, sans-serif",
    backgroundColor: "#f3f4f6",
    minHeight: "100vh",
            },
  header:   {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  title: {
    margin: 0,
    fontSize: "24px",
    color: "#1f2937",
  },
  loginContainer: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
    padding: "20px",
  },
  loginBox: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  errorBanner: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  errorMsg: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "15px",
    fontSize: "14px",
  },
  closeError: {
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#991b1b",
    padding: "0 8px",
  },
  loader: {
    textAlign: "center",
    padding: "20px",
    fontSize: "18px",
    color: "#6b7280",
  },
  btnPrimary: {
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  btnSecondary: {
    backgroundColor: "#6b7280",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    overflowY: "auto",
    zIndex: 1000,
    padding: "20px",
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "1000px",
    margin: "20px auto",
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
  },
  formHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 30px",
    borderBottom: "1px solid #e5e7eb",
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "32px",
    cursor: "pointer",
    color: "#6b7280",
    lineHeight: "1",
    padding: 0,
  },
  formContent: {
    padding: "30px",
    maxHeight: "calc(100vh - 200px)",
    overflowY: "auto",
  },
  section: {
    marginBottom: "30px",
    padding: "20px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
  },
  sectionTitle: {
    marginTop: 0,
    marginBottom: "20px",
    fontSize: "18px",
    color: "#1f2937",
    fontWeight: "600",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "15px",
  },
  label: {
    marginBottom: "6px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
  },
  input: {
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
    fontFamily: "inherit",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
    color: "#374151",
    cursor: "pointer",
  },
  checkbox: {
    marginRight: "8px",
    cursor: "pointer",
    width: "16px",
    height: "16px",
  },
  formActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "30px",
    paddingTop: "20px",
    borderTop: "1px solid #e5e7eb",
  },
  listSection: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  listTitle: {
    marginTop: 0,
    marginBottom: "20px",
    fontSize: "20px",
    color: "#1f2937",
  },
  noJobs: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#6b7280",
  },
  tableContainer: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },
  th: {
    padding: "12px",
    textAlign: "left",
    borderBottom: "2px solid #e5e7eb",
    fontWeight: "600",
    color: "#374151",
    backgroundColor: "#f9fafb",
  },
  tr: {
    borderBottom: "1px solid #e5e7eb",
  },
  td: {
    padding: "12px",
    color: "#4b5563",
  },
  badge: {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "500",
    color: "white",
  },
  actionButtons: {
    display: "flex",
    gap: "8px",
  },
  btnEdit: {
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    fontSize: "13px",
    cursor: "pointer",
    fontWeight: "500",
  },
  btnDelete: {
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    fontSize: "13px",
    cursor: "pointer",
    fontWeight: "500",
  },
};

export default JobAdminPanel;
