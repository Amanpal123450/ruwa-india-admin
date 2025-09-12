import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Detailspage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No token found. Redirecting to login.');
        navigate('/login');
        return;
      }

      try {
        const res = await axios.get('http://localhost:8000/api/admin/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Better handling of different response structures
        const data = res.data.profile || res.data || res.data.data;
        setProfile(data);
        console.log('✅ Profile:', data);
      } catch (error) {
        console.error('❌ Error fetching profile:', error);
        setError('Failed to fetch profile data');
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, location]);

  const handleEditProfile = () => {
    navigate('/profile', { state: { profile } });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="d-flex vh-100 bg-light align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex vh-100 bg-light align-items-center justify-content-center">
        <div className="card p-4 text-center">
          <div className="text-danger mb-3">
            <i className="bi bi-exclamation-circle" style={{ fontSize: '3rem' }}></i>
          </div>
          <h5 className="text-danger">Error Loading Profile</h5>
          <p className="text-muted">{error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="d-flex vh-100 bg-light align-items-center justify-content-center">
        <div className="card p-4 text-center">
          <h5 className="text-warning">No Profile Data</h5>
          <p className="text-muted">Profile information not available</p>
          <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      <div className="container-fluid p-0">
        {/* Header */}
        <div className="bg-white shadow-sm border-bottom">
          <div className="container-xl px-4 py-3">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-3">
                <button 
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => navigate(-1)}
                >
                  <i className="bi bi-arrow-left"></i> Back
                </button>
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={profile.profile_pic || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || profile.full_name || 'User')}&background=007bff&color=fff&size=40`}
                    alt="Profile"
                    className="rounded-circle border"
                    width="40"
                    height="40"
                    style={{ objectFit: 'cover' }}
                  />
                  <div>
                    <h5 className="mb-0 fw-bold">{profile.name || profile.full_name || 'N/A'}</h5>
                    <small className="text-muted">
                      {profile.role || 'ADMIN'} 
                      {profile.verified !== undefined && (
                        <span className={`badge ms-2 ${profile.verified ? 'bg-success' : 'bg-warning'}`}>
                          {profile.verified ? 'Verified' : 'Unverified'}
                        </span>
                      )}
                    </small>
                  </div>
                </div>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={handleEditProfile}
                >
                  <i className="bi bi-pencil"></i> Edit Profile
                </button>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right"></i> Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container-xl px-4 py-4">
          <div className="row g-4">
            {/* Profile Summary Card */}
            <div className="col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <img
                    src={profile.profile_pic || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || profile.full_name || 'User')}&background=007bff&color=fff&size=120`}
                    alt="Profile"
                    className="rounded-circle border mb-3"
                    width="120"
                    height="120"
                    style={{ objectFit: 'cover' }}
                  />
                  <h4 className="fw-bold mb-2">{profile.name || profile.full_name || 'N/A'}</h4>
                  <div className="mb-3">
                    <span className={`badge ${profile.verified ? 'bg-success' : 'bg-warning'}`}>
                      {profile.verified ? 'Verified Account' : 'Unverified Account'}
                    </span>
                  </div>
                  <div className="row text-center border-top pt-3">
                    <div className="col-6">
                      <h6 className="text-muted mb-1">Role</h6>
                      <span className="badge bg-primary">{profile.role || 'ADMIN'}</span>
                    </div>
                    <div className="col-6">
                      <h6 className="text-muted mb-1">ID</h6>
                      <small className="text-muted">{profile._id || profile.adminId || 'N/A'}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Cards */}
            <div className="col-lg-8">
              <div className="row g-4">
                {/* Contact Information */}
                <div className="col-md-6">
                  <div className="card h-100 shadow-sm">
                    <div className="card-header bg-white">
                      <h6 className="fw-bold mb-0">
                        <i className="bi bi-telephone text-primary me-2"></i>
                        Contact Information
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <label className="form-label text-muted small">Phone Number</label>
                        <div className="d-flex align-items-center">
                          <span className="badge bg-secondary me-2">Primary</span>
                          <span>{profile.phone || 'N/A'}</span>
                        </div>
                      </div>
                      <div>
                        <label className="form-label text-muted small">Email Address</label>
                        <div className="d-flex align-items-center">
                          <span className="badge bg-secondary me-2">Primary</span>
                          <span>{profile.email || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="col-md-6">
                  <div className="card h-100 shadow-sm">
                    <div className="card-header bg-white">
                      <h6 className="fw-bold mb-0">
                        <i className="bi bi-geo-alt text-primary me-2"></i>
                        Address Information
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <label className="form-label text-muted small">Primary Address</label>
                        <p className="mb-0">{profile.address || 'No address provided'}</p>
                      </div>
                      {profile.secondary_address && (
                        <div>
                          <label className="form-label text-muted small">Secondary Address</label>
                          <p className="mb-0">{profile.secondary_address}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Account Settings */}
                <div className="col-12">
                  <div className="card shadow-sm">
                    <div className="card-header bg-white">
                      <h6 className="fw-bold mb-0">
                        <i className="bi bi-gear text-primary me-2"></i>
                        Account Settings
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="row g-4">
                        <div className="col-md-3">
                          <label className="form-label text-muted small">Language</label>
                          <p className="mb-0 fw-medium">{profile.language || 'English'}</p>
                        </div>
                        <div className="col-md-3">
                          <label className="form-label text-muted small">Time Zone</label>
                          <p className="mb-0 fw-medium">{profile.time_zone || 'UTC'}</p>
                        </div>
                        <div className="col-md-3">
                          <label className="form-label text-muted small">Nationality</label>
                          <p className="mb-0 fw-medium">{profile.nationality || 'N/A'}</p>
                        </div>
                        <div className="col-md-3">
                          <label className="form-label text-muted small">Merchant ID</label>
                          <p className="mb-0 fw-medium">{profile.merchant_id || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Actions */}
                <div className="col-12">
                  <div className="card shadow-sm border-danger">
                    <div className="card-header bg-light border-danger">
                      <h6 className="fw-bold mb-0 text-danger">
                        <i className="bi bi-exclamation-triangle text-danger me-2"></i>
                        Danger Zone
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="fw-bold text-danger mb-1">Delete Account</h6>
                          <small className="text-muted">
                            Permanently delete your account and all associated data. This action cannot be undone.
                          </small>
                        </div>
                        <button className="btn btn-outline-danger btn-sm">
                          <i className="bi bi-trash"></i> Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detailspage;