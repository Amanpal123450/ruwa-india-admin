// components/EKYCDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const EKYCDetailPage = () => {
  const { applicationId } = useParams();


  const navigate = useNavigate();
  const [ekycData, setEkycData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    fetchEKYCDetails();
  }, [applicationId]);

  const fetchEKYCDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      const response = await fetch(`https://ruwa-backend.onrender.com/api/ekyc/admin/${applicationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch E-KYC details');
      }

      const result = await response.json();
      if (result.success) {
        setEkycData(result.data);
      } else {
        throw new Error(result.message || 'Failed to load E-KYC data');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching E-KYC:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://ruwa-backend.onrender.com/api/ekyc/admin/status/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
  ekycStatus: newStatus,
  remarks: `Status updated to ${newStatus} by admin`
})

      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setEkycData(prev => ({ ...prev, status: newStatus }));
          alert(`E-KYC ${newStatus} successfully`);
        }
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <p className="mt-6 text-lg font-medium text-gray-700">Loading E-KYC details...</p>
            <p className="mt-2 text-sm text-gray-500">Please wait while we fetch the information</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-8">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-2xl font-bold text-gray-900 text-center mb-3">Error Loading E-KYC</h4>
            <p className="text-gray-600 text-center mb-6">{error}</p>
            <Link 
              to="/" 
              className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!ekycData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
            <div className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">E-KYC Not Found</h2>
            <p className="text-gray-600 mb-6">No E-KYC data found for application ID: <span className="font-mono font-semibold">{applicationId}</span></p>
            <Link 
              to="/" 
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-8 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      verified: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      submitted: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                E-KYC Application Details
              </h1>
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                <span className="font-mono text-sm">Application ID: {ekycData.applicationId}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-lg font-semibold text-sm border ${getStatusColor(ekycData.status)}`}>
                {ekycData.status.toUpperCase()}
              </span>
              <button 
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition-colors duration-200 flex items-center gap-2"
                onClick={() => navigate('/')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Quick Actions
          </h3>
          <div className="flex flex-wrap gap-2">
            <button 
              className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-medium text-sm transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              onClick={() => handleStatusUpdate('APPROVED')}
              disabled={ekycData.status === 'APPROVED'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Verify
            </button>
            <button 
              className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-medium text-sm transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              onClick={() => handleStatusUpdate('rejected')}
              disabled={ekycData.status === 'rejected'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reject
            </button>
            <button 
              className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-lg font-medium text-sm transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              onClick={() => handleStatusUpdate('pending')}
              disabled={ekycData.status === 'pending'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Mark Pending
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2 mb-6">
          <nav className="flex flex-wrap gap-2">
            <button 
              className={`flex-1 min-w-fit px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                activeTab === 'personal'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('personal')}
            >
              Personal Info
            </button>
            <button 
              className={`flex-1 min-w-fit px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                activeTab === 'address'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('address')}
            >
              Address & Location
            </button>
            <button 
              className={`flex-1 min-w-fit px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                activeTab === 'infrastructure'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('infrastructure')}
            >
              Infrastructure
            </button>
            <button 
              className={`flex-1 min-w-fit px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                activeTab === 'documents'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('documents')}
            >
              Documents
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          {activeTab === 'personal' && <PersonalInfoTab data={ekycData} />}
          {activeTab === 'address' && <AddressLocationTab data={ekycData} />}
          {activeTab === 'infrastructure' && <InfrastructureTab data={ekycData} />}
          {activeTab === 'documents' && <DocumentsTab data={ekycData} />}
        </div>
      </div>
    </div>
  );
};

// Tab Components
const PersonalInfoTab = ({ data }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
        <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Basic Information
        </h4>
        <div className="space-y-3">
          <InfoField label="Full Name" value={data.name} />
          <InfoField label="Father's Name" value={data.fatherName} />
          <InfoField label="Mother's Name" value={data.motherName} />
          <InfoField label="Spouse's Name" value={data.spouseName} />
          <InfoField label="Blood Group" value={data.bloodGroup} />
        </div>
      </div>
      <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 border border-green-100">
        <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Contact & Financial
        </h4>
        <div className="space-y-3">
          <InfoField label="Aadhaar Number" value={data.aadhaar} />
          <InfoField label="PAN Number" value={data.pan} />
          <InfoField label="Email" value={data.email} />
          <InfoField label="Primary Mobile" value={data.mobile1} />
          <InfoField label="Secondary Mobile" value={data.mobile2} />
          <InfoField label="Emergency Contact" value={data.emergencyContact} />
          <InfoField label="Annual Income" value={data.annualIncome} />
        </div>
      </div>
    </div>
  </div>
);

const AddressLocationTab = ({ data }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
        <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Address Details
        </h4>
        <div className="space-y-3">
          <InfoField label="Full Address" value={data.address} />
          <InfoField label="State" value={data.state} />
          <InfoField label="District" value={data.district} />
          <InfoField label="Block" value={data.block} />
          <InfoField label="Gram Panchayat" value={data.gramPanchayat} />
          <InfoField label="Village" value={data.village} />
          <InfoField label="Ward" value={data.ward} />
        </div>
      </div>
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
        <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Kendra Location
        </h4>
        <div className="space-y-3">
          <InfoField label="Kendra Location" value={data.kendraLocation} />
          <InfoField label="Boundary East" value={data.boundaryEast} />
          <InfoField label="Boundary West" value={data.boundaryWest} />
          <InfoField label="Boundary North" value={data.boundaryNorth} />
          <InfoField label="Boundary South" value={data.boundarySouth} />
          <InfoField label="Length" value={data.length} />
          <InfoField label="Width" value={data.width} />
          <InfoField label="Height" value={data.height} />
        </div>
      </div>
    </div>
  </div>
);

const InfrastructureTab = ({ data }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
        <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Environment & Connectivity
        </h4>
        <div className="space-y-3">
          <InfoField label="Radiation Effect" value={data.radiationEffect} />
          <InfoField label="Cellular Tower" value={data.cellularTower} />
          <InfoField label="Electricity Hours" value={data.electricityHours} />
          <InfoField label="Power Backup" value={data.powerBackup} />
          <InfoField label="Nearest Metro (km)" value={data.nearestMetro} />
          <InfoField label="Nearest Railway (km)" value={data.nearestRailway} />
          <InfoField label="Nearest Airport (km)" value={data.nearestAirport} />
        </div>
      </div>
      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-100">
        <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Transport & Weather
        </h4>
        <div className="space-y-3">
          <InfoField label="Road Condition" value={data.roadCondition} />
          <InfoField label="Road Type" value={data.roadType} />
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Transport Available:</label>
            <div className="flex flex-wrap gap-2">
              {data.transportRoad && <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium border border-blue-200">Road</span>}
              {data.transportRailway && <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-medium border border-green-200">Railway</span>}
              {data.transportAirways && <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium border border-purple-200">Airways</span>}
              {data.transportWaterways && <span className="px-3 py-1.5 bg-teal-100 text-teal-700 rounded-lg text-xs font-medium border border-teal-200">Waterways</span>}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Weather Conditions:</label>
            <div className="flex flex-wrap gap-2">
              {data.weatherHot && <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-medium border border-red-200">Hot</span>}
              {data.weatherRainy && <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium border border-blue-200">Rainy</span>}
              {data.weatherCold && <span className="px-3 py-1.5 bg-cyan-100 text-cyan-700 rounded-lg text-xs font-medium border border-cyan-200">Cold</span>}
              {data.weatherMild && <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-medium border border-green-200">Mild</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const DocumentsTab = ({ data }) => (
  <div className="space-y-6">
    <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Uploaded Documents & Media
    </h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <DocumentPreview label="Kendra Map" url={data.kendraMap} />
        <DocumentPreview label="Front Profile" url={data.frontProfile} />
        <DocumentPreview label="Right Profile" url={data.rightProfile} />
        <DocumentPreview label="Left Profile" url={data.leftProfile} />
      </div>
      <div className="space-y-4">
        <DocumentPreview label="Bank Passbook" url={data.bankPassbook} />
        <DocumentPreview label="Domicile Certificate" url={data.domicile} />
        <DocumentPreview label="NOC Property" url={data.nocProperty} />
        <DocumentPreview label="Property Deed" url={data.propertyDeed} />
      </div>
    </div>
  </div>
);

// Reusable Components
const InfoField = ({ label, value }) => (
  <div className="bg-white rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition-colors duration-200">
    <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
    <span className="block text-sm font-medium text-gray-800">{value || 'Not provided'}</span>
  </div>
);

const DocumentPreview = ({ label, url }) => (
  <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200 hover:border-blue-300 transition-all duration-200 hover:shadow-md">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
        {url ? (
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium text-sm hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Document
          </a>
        ) : (
          <div className="flex items-center gap-2 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-sm">Not uploaded</span>
          </div>
        )}
      </div>
      <div className="ml-4">
        {url ? (
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        ) : (
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
    </div>
  </div>)


export default EKYCDetailPage;