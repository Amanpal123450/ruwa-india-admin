import React, { useState, useEffect } from 'react';
import { FileText, Download, User, Calendar, MapPin, Briefcase, GraduationCap, Building, Eye, X, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ApprovedApplicationsViewer() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authorization token found. Please login again.');
      }

      const response = await fetch('https://ruwa-backend.onrender.com/api/services/apply-kendra/admin/aprooved', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized. Please login again.');
        }
        throw new Error('Failed to fetch applications');
      }

      const data = await response.json();
      setApplications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const printReceipt = () => {
    window.print();
  };

  const Receipt = ({ application }) => (
    <div className="bg-white p-8 max-w-4xl mx-auto" id="receipt">
      <div className="border-4 border-blue-600 p-8">
        {/* Header */}
        <div className="text-center border-b-2 border-gray-300 pb-6 mb-6">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">APPLICATION RECEIPT</h1>
          <p className="text-gray-600">Kendra Partnership Application</p>
          <p className="text-sm text-gray-500 mt-2">Application ID: {application.applicationId}</p>
        </div>

        {/* Applicant Details */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Applicant Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="font-semibold">{application.title} {application.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Aadhaar Number</p>
              <p className="font-semibold">{application.aadhaar}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold">{application.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-semibold">{application.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date of Birth</p>
              <p className="font-semibold">{formatDate(application.dob)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Gender</p>
              <p className="font-semibold">{application.gender === 'M' ? 'Male' : 'Female'}</p>
            </div>
          </div>
        </div>

        {/* Site Details */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Site Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Agreement Type</p>
              <p className="font-semibold">{application.siteDetails.agreementType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Location Type</p>
              <p className="font-semibold">{application.siteDetails.locationType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Area</p>
              <p className="font-semibold">{application.siteDetails.area}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Lease Period</p>
              <p className="font-semibold">
                {formatDate(application.siteDetails.leaseFrom)} - {formatDate(application.siteDetails.leaseTo)}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-semibold">{application.siteDetails.address}</p>
            </div>
          </div>
        </div>

        {/* Professional Details */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Professional Background</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Current Occupation</p>
              <p className="font-semibold">{application.currentOccupation}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Investment Range</p>
              <p className="font-semibold">{application.investmentRange}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Proposed Location</p>
              <p className="font-semibold">{application.proposedCity}, {application.proposedState}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Setup Timeline</p>
              <p className="font-semibold">{application.setupTimeline}</p>
            </div>
          </div>
        </div>

        {/* Status & Dates */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Application Status</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-semibold text-green-600 text-lg">{application.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Payment Status</p>
              <p className="font-semibold">{application.payment.paid ? 'Paid' : 'Pending'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Applied On</p>
              <p className="font-semibold">{formatDate(application.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="font-semibold">{formatDate(application.updatedAt)}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t-2 border-gray-300 text-center">
          <p className="text-sm text-gray-600">This is a computer-generated receipt and does not require a signature.</p>
          <p className="text-xs text-gray-500 mt-2">Generated on {new Date().toLocaleString('en-IN')}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading approved applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Applications</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchApplications}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #receipt, #receipt * {
            visibility: visible;
          }
          #receipt {
            position: absolute;
            left: 0;
            top: 0;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6 no-print">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            Approved Applications
          </h1>

          {/* Statistics */}
          {applications.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                <p className="text-sm opacity-90">Total Applications</p>
                <p className="text-3xl font-bold">{applications.length}</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                <p className="text-sm opacity-90">Paid Applications</p>
                <p className="text-3xl font-bold">
                  {applications.filter(app => app.payment.paid).length}
                </p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                <p className="text-sm opacity-90">Pending Payment</p>
                <p className="text-3xl font-bold">
                  {applications.filter(app => !app.payment.paid).length}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Applications Grid */}
        {applications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 no-print">
            {applications.map((app) => (
              <div key={app._id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <User className="w-5 h-5" />
                    <h3 className="font-bold text-lg">{app.title} {app.name}</h3>
                  </div>
                  <p className="text-sm opacity-90">ID: {app._id.slice(-8)}</p>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-gray-700">{app.proposedCity}, {app.proposedState}</p>
                      <p className="text-gray-500">{app.siteDetails?.locationType}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Briefcase className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="text-gray-700">{app.currentOccupation}</p>
                      <p className="text-gray-500">{app.investmentRange}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="text-gray-700">Applied: {formatDate(app.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      app.payment.paid 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {app.payment.paid ? 'Paid' : 'Payment Pending'}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {app.status}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-3">
                    <button
                      onClick={() => {
                        setSelectedApp(app);
                        setShowReceipt(false);
                      }}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    <Link to={`/ekyc/${app.applicationId}`}
                      
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Link>
                    <button
                      onClick={() => {
                        setSelectedApp(app);
                        setShowReceipt(true);
                      }}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <FileText className="w-4 h-4" />
                      Receipt
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-lg no-print">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">No approved applications found</p>
          </div>
        )}
      </div>

      {/* Modal for Receipt */}
      {selectedApp && showReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 no-print">
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Application Receipt</h2>
              <div className="flex gap-2">
                <button
                  onClick={printReceipt}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
                <button
                  onClick={() => setShowReceipt(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <Receipt application={selectedApp} />
          </div>
        </div>
      )}

      {/* Modal for Details View */}
      {selectedApp && !showReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 no-print">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Application Details</h2>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium">{selectedApp.title} {selectedApp.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedApp.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{selectedApp.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Aadhaar</p>
                    <p className="font-medium">{selectedApp.aadhaar}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date of Birth</p>
                    <p className="font-medium">{formatDate(selectedApp.dob)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Marital Status</p>
                    <p className="font-medium">{selectedApp.married === 'Y' ? 'Married' : 'Unmarried'}</p>
                  </div>
                </div>
              </div>

              {/* Education */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  Educational Qualifications
                </h3>
                <div className="space-y-2">
                  {selectedApp.educationalQualifications.map((edu, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium">{edu.qualification}</p>
                      <p className="text-sm text-gray-600">{edu.institution} • {edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Professional Background */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  Professional Details
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Current Occupation</p>
                    <p className="font-medium">{selectedApp.currentOccupation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Skills</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedApp.professionalBackground.map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Site Details */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Building className="w-5 h-5 text-blue-600" />
                  Site Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Agreement Type</p>
                    <p className="font-medium">{selectedApp.siteDetails.agreementType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location Type</p>
                    <p className="font-medium">{selectedApp.siteDetails.locationType}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-medium">{selectedApp.siteDetails.address}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowReceipt(true);
                }}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <FileText className="w-5 h-5" />
                Generate Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}