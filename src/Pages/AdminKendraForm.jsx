import React, { useState } from 'react';
import { FileText, Save, User, Building, Briefcase, GraduationCap, RefreshCw } from 'lucide-react';

export default function AdminOfflineKendraForm() {
  const [formData, setFormData] = useState({
    title: "",
    name: "",
    address: "",
    phone: "",
    email: "",
    dob: "",
    gender: "",
    married: "",
    educationalQualifications: [{ qualification: "", year: "", institution: "" }],
    currentOccupation: "",
    currentEmployer: "",
    designation: "",
    previousWorkExperience: [{ period: "", organization: "", designation: "", responsibilities: "" }],
    businessDetails: [{ 
      companyName: "", businessType: "", nature: "", products: "", 
      years: "", employees: "", turnover: "" 
    }],
    professionalBackground: [],
    professionalAssociations: "",
    businessStructure: "",
    existingEntity: "",
    existingEntityName: "",
    proposedCity: "",
    proposedState: "",
    setupTimeline: "",
    sitePossession: "",
    siteDetails: {
      agreementType: "",
      leaseFrom: "",
      leaseTo: "",
      area: "",
      locationType: "",
      address: ""
    },
    siteInMind: "",
    planToRent: "",
    withinMonths: "",
    investmentRange: "",
    effortsInitiatives: "",
    reasonsForPartnership: "",
    aadhaar: "",
    category: "",
    relevantExperience: "",
    idProof: null,
    qualificationCertificate: null,
    financialStatement: null,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const professionalBackgroundOptions = [
    "Marketing/Sales",
    "Health Care",
    "Education/Training",
    "Profit Center Management",
    "Small Business Mgmt.",
    "Other"
  ];

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Full Name is required";
    if (!formData.aadhaar) newErrors.aadhaar = "Aadhaar Number is required";
    if (!formData.phone || !/^\d{10}$/.test(formData.phone))
      newErrors.phone = "10-digit phone number required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.businessStructure)
      newErrors.businessStructure = "Business structure is required";
    if (!formData.investmentRange)
      newErrors.investmentRange = "Investment range is required";
    if (!formData.proposedCity)
      newErrors.proposedCity = "City is required";
    if (!formData.proposedState)
      newErrors.proposedState = "State is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.relevantExperience)
      newErrors.relevantExperience = "Relevant Experience is required";
    if (!formData.idProof) newErrors.idProof = "ID Proof is required";
    if (!formData.qualificationCertificate)
      newErrors.qualificationCertificate = "Qualification Certificate is required";
    if (!formData.financialStatement)
      newErrors.financialStatement = "Financial Statement is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === "checkbox") {
      if (name === "professionalBackground") {
        setFormData(prev => {
          const updatedBackground = checked
            ? [...prev.professionalBackground, value]
            : prev.professionalBackground.filter(item => item !== value);
          return { ...prev, professionalBackground: updatedBackground };
        });
      }
    } else if (type === "file") {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleTableChange = (index, field, value, tableName) => {
    setFormData(prev => {
      const updatedTable = [...prev[tableName]];
      updatedTable[index] = {
        ...updatedTable[index],
        [field]: value
      };
      return { ...prev, [tableName]: updatedTable };
    });
  };

  const addTableRow = (tableName, defaultRow) => {
    setFormData(prev => ({
      ...prev,
      [tableName]: [...prev[tableName], { ...defaultRow }]
    }));
  };

  const removeTableRow = (index, tableName) => {
    if (formData[tableName].length > 1) {
      setFormData(prev => ({
        ...prev,
        [tableName]: prev[tableName].filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const formDataToSend = new FormData();
        
        Object.keys(formData).forEach(key => {
          if (key === 'educationalQualifications' || 
              key === 'previousWorkExperience' || 
              key === 'businessDetails' ||
              key === 'professionalBackground') {
            formDataToSend.append(key, JSON.stringify(formData[key]));
          } else if (key === 'siteDetails') {
            formDataToSend.append(key, JSON.stringify(formData[key]));
          } else if (formData[key] !== null) {
            formDataToSend.append(key, formData[key]);
          }
        });

        const res = await fetch(
          "https://ruwa-backend.onrender.com/api/services/apply-kendra/admin/offline-apply",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formDataToSend,
          }
        );

        const data = await res.json();
        
        if (res.ok) {
          setSubmitSuccess(true);
          alert("Offline application submitted successfully!");
          
          // Reset form
          setFormData({
            title: "",
            name: "",
            address: "",
            phone: "",
            email: "",
            dob: "",
            gender: "",
            married: "",
            educationalQualifications: [{ qualification: "", year: "", institution: "" }],
            currentOccupation: "",
            currentEmployer: "",
            designation: "",
            previousWorkExperience: [{ period: "", organization: "", designation: "", responsibilities: "" }],
            businessDetails: [{ 
              companyName: "", businessType: "", nature: "", products: "", 
              years: "", employees: "", turnover: "" 
            }],
            professionalBackground: [],
            professionalAssociations: "",
            businessStructure: "",
            existingEntity: "",
            existingEntityName: "",
            proposedCity: "",
            proposedState: "",
            setupTimeline: "",
            sitePossession: "",
            siteDetails: {
              agreementType: "",
              leaseFrom: "",
              leaseTo: "",
              area: "",
              locationType: "",
              address: ""
            },
            siteInMind: "",
            planToRent: "",
            withinMonths: "",
            investmentRange: "",
            effortsInitiatives: "",
            reasonsForPartnership: "",
            aadhaar: "",
            category: "",
            relevantExperience: "",
            idProof: null,
            qualificationCertificate: null,
            financialStatement: null,
          });
          
          setErrors({});
          setTimeout(() => setSubmitSuccess(false), 5000);
        } else {
          alert(data.message || "Something went wrong");
        }
      } catch (error) {
        console.error("Network error:", error);
        alert("Network error. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      name: "",
      address: "",
      phone: "",
      email: "",
      dob: "",
      gender: "",
      married: "",
      educationalQualifications: [{ qualification: "", year: "", institution: "" }],
      currentOccupation: "",
      currentEmployer: "",
      designation: "",
      previousWorkExperience: [{ period: "", organization: "", designation: "", responsibilities: "" }],
      businessDetails: [{ 
        companyName: "", businessType: "", nature: "", products: "", 
        years: "", employees: "", turnover: "" 
      }],
      professionalBackground: [],
      professionalAssociations: "",
      businessStructure: "",
      existingEntity: "",
      existingEntityName: "",
      proposedCity: "",
      proposedState: "",
      setupTimeline: "",
      sitePossession: "",
      siteDetails: {
        agreementType: "",
        leaseFrom: "",
        leaseTo: "",
        area: "",
        locationType: "",
        address: ""
      },
      siteInMind: "",
      planToRent: "",
      withinMonths: "",
      investmentRange: "",
      effortsInitiatives: "",
      reasonsForPartnership: "",
      aadhaar: "",
      category: "",
      relevantExperience: "",
      idProof: null,
      qualificationCertificate: null,
      financialStatement: null,
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Admin - Offline Application Entry</h1>
                <p className="text-gray-600 mt-1">Enter details from paper applications submitted by users</p>
              </div>
            </div>
            <button
              onClick={resetForm}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reset Form
            </button>
          </div>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700 font-medium">
                  Application submitted successfully! You can now enter another application.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <form onSubmit={handleSubmit}>
            {/* Personal Details */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                <User className="w-5 h-5 text-blue-600" />
                Personal Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <select
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select</option>
                    <option value="Dr">Dr</option>
                    <option value="Mr">Mr</option>
                    <option value="Miss">Miss</option>
                    <option value="Ms">Ms</option>
                  </select>
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter full name"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number *</label>
                  <input
                    type="text"
                    name="aadhaar"
                    value={formData.aadhaar}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.aadhaar ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter 12-digit Aadhaar"
                    maxLength="12"
                  />
                  {errors.aadhaar && <p className="text-red-500 text-xs mt-1">{errors.aadhaar}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="10-digit mobile number"
                    maxLength="10"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div className="md:col-span-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Complete address"
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="M"
                        checked={formData.gender === "M"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Male
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="F"
                        checked={formData.gender === "F"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Female
                    </label>
                  </div>
                </div>

                <div className="md:col-span-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="married"
                        value="Y"
                        checked={formData.married === "Y"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Married
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="married"
                        value="N"
                        checked={formData.married === "N"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Unmarried
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Educational Qualifications */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                Educational Qualifications
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left">Qualification</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Year</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Institution</th>
                      <th className="border border-gray-300 px-4 py-2 w-24">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.educationalQualifications.map((qual, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 p-2">
                          <input
                            type="text"
                            value={qual.qualification}
                            onChange={(e) => handleTableChange(index, 'qualification', e.target.value, 'educationalQualifications')}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                            placeholder="Degree/Diploma"
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <input
                            type="text"
                            value={qual.year}
                            onChange={(e) => handleTableChange(index, 'year', e.target.value, 'educationalQualifications')}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                            placeholder="Year"
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <input
                            type="text"
                            value={qual.institution}
                            onChange={(e) => handleTableChange(index, 'institution', e.target.value, 'educationalQualifications')}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                            placeholder="Institution"
                          />
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                          <button
                            type="button"
                            onClick={() => removeTableRow(index, 'educationalQualifications')}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                type="button"
                onClick={() => addTableRow('educationalQualifications', { qualification: "", year: "", institution: "" })}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
              >
                + Add Qualification
              </button>
            </div>

            {/* Current Occupation */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Current Occupation
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Occupation *</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="currentOccupation"
                        value="Service"
                        checked={formData.currentOccupation === "Service"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Service
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="currentOccupation"
                        value="Business"
                        checked={formData.currentOccupation === "Business"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Business
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="currentOccupation"
                        value="Both"
                        checked={formData.currentOccupation === "Both"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Both
                    </label>
                  </div>
                </div>

                {(formData.currentOccupation === "Service" || formData.currentOccupation === "Both") && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Employer</label>
                      <input
                        type="text"
                        name="currentEmployer"
                        value={formData.currentEmployer}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Employer name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                      <input
                        type="text"
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Current designation"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Professional Background */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Professional Background</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {professionalBackgroundOptions.map((option, index) => (
                  <label key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      name="professionalBackground"
                      value={option}
                      checked={formData.professionalBackground.includes(option)}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Professional Associations</label>
                <textarea
                  name="professionalAssociations"
                  value={formData.professionalAssociations}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Details of professional associations"
                />
              </div>
            </div>

            {/* Proposed Centre Details */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                <Building className="w-5 h-5 text-blue-600" />
                Proposed Centre Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Structure *</label>
                  <select
                    name="businessStructure"
                    value={formData.businessStructure}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg ${errors.businessStructure ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select</option>
                    <option value="Proprietorship">Proprietorship</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Private Ltd.">Private Ltd.</option>
                    <option value="Public Ltd.">Public Ltd.</option>
                    <option value="Society">Society</option>
                    <option value="Trust">Trust</option>
                  </select>
                  {errors.businessStructure && <p className="text-red-500 text-xs mt-1">{errors.businessStructure}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Proposed City *</label>
                  <input
                    type="text"
                    name="proposedCity"
                    value={formData.proposedCity}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg ${errors.proposedCity ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="City/Town"
                  />
                  {errors.proposedCity && <p className="text-red-500 text-xs mt-1">{errors.proposedCity}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                  <input
                    type="text"
                    name="proposedState"
                    value={formData.proposedState}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg ${errors.proposedState ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="State"
                  />
                  {errors.proposedState && <p className="text-red-500 text-xs mt-1">{errors.proposedState}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Investment Range *</label>
                  <select
                    name="investmentRange"
                    value={formData.investmentRange}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg ${errors.investmentRange ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select</option>
                    <option value="10-15 Lacs">10-15 Lacs</option>
                    <option value="15-30 Lacs">15-30 Lacs</option>
                    <option value="More than 30 Lacs">More than 30 Lacs</option>
                  </select>
                  {errors.investmentRange && <p className="text-red-500 text-xs mt-1">{errors.investmentRange}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Setup Timeline</label>
                  <select
                    name="setupTimeline"
                    value={formData.setupTimeline}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select</option>
                    <option value="Immediately">Immediately</option>
                    <option value="Within next 3 months">Within next 3 months</option>
                    <option value="Next 3 to 6 months">Next 3 to 6 months</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Efforts/Initiatives</label>
                  <textarea
                    name="effortsInitiatives"
                    value={formData.effortsInitiatives}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Describe plans and initiatives"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reasons for Partnership</label>
                  <textarea
                    name="reasonsForPartnership"
                    value={formData.reasonsForPartnership}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Why should Ruwaindia consider this as a business partner"
                  />
                </div>
              </div>
            </div>

            {/* Franchise Details */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Franchise Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Franchise Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select Category</option>
                    <option value="S1">S1 (200 sq. ft)</option>
                    <option value="S2">S2 (400 sq. ft)</option>
                    <option value="S3">S3 (600 sq. ft)</option>
                  </select>
                  {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Relevant Experience *</label>
                  <textarea
                    name="relevantExperience"
                    value={formData.relevantExperience}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg ${errors.relevantExperience ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Describe relevant experience"
                  />
                  {errors.relevantExperience && <p className="text-red-500 text-xs mt-1">{errors.relevantExperience}</p>}
                </div>
              </div>
            </div>

            {/* Required Documents */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Required Documents</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ID Proof *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      name="idProof"
                      onChange={handleChange}
                      className="hidden"
                      id="idProof"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <label htmlFor="idProof" className="cursor-pointer flex flex-col items-center">
                      <FileText className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        {formData.idProof ? formData.idProof.name : "Click to upload"}
                      </span>
                    </label>
                  </div>
                  {errors.idProof && <p className="text-red-500 text-xs mt-1">{errors.idProof}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qualification Certificate *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      name="qualificationCertificate"
                      onChange={handleChange}
                      className="hidden"
                      id="qualificationCertificate"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <label htmlFor="qualificationCertificate" className="cursor-pointer flex flex-col items-center">
                      <GraduationCap className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        {formData.qualificationCertificate ? formData.qualificationCertificate.name : "Click to upload"}
                      </span>
                    </label>
                  </div>
                  {errors.qualificationCertificate && <p className="text-red-500 text-xs mt-1">{errors.qualificationCertificate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Financial Statement *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      name="financialStatement"
                      onChange={handleChange}
                      className="hidden"
                      id="financialStatement"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <label htmlFor="financialStatement" className="cursor-pointer flex flex-col items-center">
                      <FileText className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        {formData.financialStatement ? formData.financialStatement.name : "Click to upload"}
                      </span>
                    </label>
                  </div>
                  {errors.financialStatement && <p className="text-red-500 text-xs mt-1">{errors.financialStatement}</p>}
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-center gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Reset Form
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Submit Application
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}