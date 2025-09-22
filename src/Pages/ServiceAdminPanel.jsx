import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Eye, EyeOff, Search } from 'lucide-react';

const ServicesAdminPanel = () => {
  const [activeSection, setActiveSection] = useState('service-cards');
  const [serviceCards, setServiceCards] = useState([]);
  const [serviceFeatures, setServiceFeatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // API Base URL - adjust this to match your backend
  const API_BASE = 'https://ruwa-backend.onrender.com/api';

  // Mock data for demonstration
  useEffect(() => {
   fetchData(activeSection)
  }, [activeSection]);

  const sections = {
    'service-cards': {
      title: 'Service Cards',
      data: serviceCards,
      setter: setServiceCards,
      endpoint: 'service-card',
      fields: [
        { name: 'icon', label: 'Icon', type: 'text', required: true },
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea', required: true },
        { name: 'buttonText', label: 'Button Text', type: 'text', required: true },
        { name: 'buttonLink', label: 'Button Link', type: 'url', required: true },
        { name: 'btnClass', label: 'Button Class', type: 'select', options: ['btn-info', 'btn-danger', 'btn-success', 'btn-warning', 'btn-primary', 'btn-secondary'], required: true }
      ]
    },
    'service-features': {
      title: 'Service Features',
      data: serviceFeatures,
      setter: setServiceFeatures,
      endpoint: 'service-Features',
      fields: [
        { name: 'icon', label: 'Icon (HTML)', type: 'textarea', required: true },
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea', required: true }
      ]
    }
  };

  const currentSection = sections[activeSection];

  // API Functions
  const fetchData = async (sectionKey) => {
    setLoading(true);
    try {
      const endpoint = sections[sectionKey].endpoint;
      const response = await fetch(`${API_BASE}/${endpoint}`);
      const result = await response.json();
      if (result.success) {
        const data = result.services || result.data || [];
        sections[sectionKey].setter(data);
        setLoading(false);
        return data;
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
    setLoading(false);
    return [];
  };

  const saveItem = async (endpoint, data, isEdit = false, id = null) => {
    try {
      let url, method;
      
      if (isEdit) {
        url = `${API_BASE}/${endpoint}/${id}`;
        method = 'PUT';
      } else {
        // Handle different POST endpoints
        if (endpoint === 'service-Features') {
          url = `${API_BASE}/${endpoint}/p`;
        } else {
          url = `${API_BASE}/${endpoint}`;
        }
        method = 'POST';
      }
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Save error:', error);
      return { success: false };
    }
  };

  const deleteItem = async (endpoint, id) => {
    try {
      const response = await fetch(`${API_BASE}/${endpoint}/${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Delete error:', error);
      return { success: false };
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({});
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({ ...item });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const result = await deleteItem(currentSection.endpoint, id);
      if (result.success) {
        const updatedData = currentSection.data.filter(item => item._id !== id);
        currentSection.setter(updatedData);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const isEdit = editingItem !== null;
    const result = await saveItem(
      currentSection.endpoint, 
      formData, 
      isEdit, 
      editingItem?._id
    );
    
    if (result.success) {
      if (isEdit) {
        const updatedData = currentSection.data.map(item => 
          item._id === editingItem._id ? { ...item, ...formData } : item
        );
        currentSection.setter(updatedData);
      } else {
        // Use the actual returned service data
        const newItem = result.service || { ...formData, _id: Date.now().toString() };
        currentSection.setter([...currentSection.data, newItem]);
      }
      setShowModal(false);
      setFormData({});
    } else {
      alert('Error saving item. Please try again.');
    }
    setLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const filteredData = currentSection.data.filter(item => {
    const searchableText = Object.values(item).join(' ').toLowerCase();
    return searchableText.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Services Admin Panel</h1>
            <p className="text-gray-600 mt-2">Manage your service cards and features</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {Object.keys(sections).map((sectionKey) => (
                <button
                  key={sectionKey}
                  onClick={() => setActiveSection(sectionKey)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeSection === sectionKey
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {sections[sectionKey].title}
                  <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                    {sections[sectionKey].data.length}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Section Content */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {currentSection.title}
              </h2>
              <button
                onClick={handleAdd}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New
              </button>
            </div>
            
            {/* Search Bar */}
            <div className="mt-4 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${currentSection.title.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {currentSection.fields.map((field) => (
                    <th
                      key={field.name}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {field.label}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    {currentSection.fields.map((field) => (
                      <td key={field.name} className="px-6 py-4 whitespace-nowrap">
                        {field.name === 'btnClass' ? (
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                            item[field.name] === 'btn-info' ? 'bg-blue-100 text-blue-800' :
                            item[field.name] === 'btn-danger' ? 'bg-red-100 text-red-800' :
                            item[field.name] === 'btn-success' ? 'bg-green-100 text-green-800' :
                            item[field.name] === 'btn-warning' ? 'bg-yellow-100 text-yellow-800' :
                            item[field.name] === 'btn-primary' ? 'bg-indigo-100 text-indigo-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {item[field.name]}
                          </span>
                        ) : field.name === 'icon' && field.type === 'textarea' ? (
                          <div className="max-w-xs truncate text-sm text-gray-900 font-mono">
                            {item[field.name]?.substring(0, 30)}...
                          </div>
                        ) : field.name === 'buttonLink' ? (
                          <a 
                            href={item[field.name]} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline max-w-xs truncate block"
                          >
                            {item[field.name]}
                          </a>
                        ) : field.type === 'textarea' ? (
                          <div className="max-w-xs truncate text-sm text-gray-900">
                            {item[field.name]}
                          </div>
                        ) : field.type === 'url' ? (
                    <input
                      type="url"
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      required={field.required}
                      placeholder="https://example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                          <div className="text-sm text-gray-900">
                            {item[field.name] || '-'}
                          </div>
                        )}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No items found</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingItem ? 'Edit' : 'Add New'} {currentSection.title.slice(0, -1)}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
              {currentSection.fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      required={field.required}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      required={field.required}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      required={field.required}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                </div>
              ))}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Save className="w-4 h-4 mr-1" />
                  {editingItem ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-40">
          <div className="bg-white p-4 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesAdminPanel;