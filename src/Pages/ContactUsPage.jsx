import React, { useState, useEffect } from 'react';
import { Save, Edit3, Phone, Mail, MapPin, AlertCircle, CheckCircle } from 'lucide-react';

const ContactAdminPanel = () => {
  const [contactData, setContactData] = useState({
    phone: '',
    email: '',
    address: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [hasExistingContact, setHasExistingContact] = useState(false);

  // Fetch existing contact data on component mount
  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://ruwa-backend.onrender.com/api/contact-content');
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setContactData(data);
          setHasExistingContact(true);
        }
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch contact data' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const { phone, email, address } = contactData;
    
    if (!phone.trim() || !email.trim() || !address.trim()) {
      setMessage({ type: 'error', text: 'All fields are required' });
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      const url = 'https://ruwa-backend.onrender.com/api/contact-content';
      const method = hasExistingContact ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if you have auth token
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(contactData)
      });

      if (response.ok) {
        const updatedData = await response.json();
        setContactData(updatedData);
        setHasExistingContact(true);
        setIsEditing(false);
        setMessage({ 
          type: 'success', 
          text: hasExistingContact ? 'Contact updated successfully!' : 'Contact created successfully!'
        });
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.message || 'Failed to save contact' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage({ type: '', text: '' });
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchContactData(); // Reset form to original data
    setMessage({ type: '', text: '' });
  };

  if (loading && !isEditing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Contact Settings</h1>
              <p className="text-gray-600 mt-1">Manage your website's contact information</p>
            </div>
            {hasExistingContact && !isEditing && (
              <button
                onClick={handleEdit}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Contact
              </button>
            )}
          </div>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2" />
            )}
            {message.text}
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="space-y-6">
              {/* Phone Field */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={contactData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing && hasExistingContact}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                  placeholder="Enter phone number"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={contactData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing && hasExistingContact}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                  placeholder="Enter email address"
                  required
                />
              </div>

              {/* Address Field */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  Address
                </label>
                <textarea
                  name="address"
                  value={contactData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing && hasExistingContact}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors resize-none"
                  placeholder="Enter full address"
                  required
                />
              </div>

              {/* Action Buttons */}
              {(isEditing || !hasExistingContact) && (
                <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {loading ? 'Saving...' : hasExistingContact ? 'Update Contact' : 'Create Contact'}
                  </button>

                  {isEditing && (
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-3 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Current Contact Info Preview */}
        {hasExistingContact && !isEditing && (
          <div className="mt-6 bg-blue-50 rounded-lg border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Current Contact Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center text-blue-800">
                <Phone className="w-5 h-5 mr-3 text-blue-600" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-sm">{contactData.phone}</p>
                </div>
              </div>
              <div className="flex items-center text-blue-800">
                <Mail className="w-5 h-5 mr-3 text-blue-600" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm">{contactData.email}</p>
                </div>
              </div>
              <div className="flex items-start text-blue-800 md:col-span-2">
                <MapPin className="w-5 h-5 mr-3 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-sm">{contactData.address}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactAdminPanel;