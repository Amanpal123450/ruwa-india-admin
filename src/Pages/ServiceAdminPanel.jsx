import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Eye, EyeOff, Search, Settings, Layers, Sparkles, ArrowRight } from 'lucide-react';

const ServicesAdminPanel = () => {
  const [activeSection, setActiveSection] = useState('service-cards');
  const [serviceCards, setServiceCards] = useState([]);
  const [serviceFeatures, setServiceFeatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showPreview, setShowPreview] = useState(true);

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
      icon: <Layers className="w-5 h-5" />,
      color: 'blue',
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
      icon: <Sparkles className="w-5 h-5" />,
      color: 'purple',
      fields: [
        { name: 'icon', label: 'Icon (HTML)', type: 'textarea', required: true },
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea', required: true }
      ]
    }
  };

  const currentSection = sections[activeSection];
 const token=localStorage.getItem("token")
  // API Functions
  const fetchData = async (sectionKey) => {
    setLoading(true);
    try {
      const endpoint = sections[sectionKey].endpoint;
      const response = await fetch(`${API_BASE}/${endpoint}`,{
        headers: { Authorization: `Bearer ${token}` }
          
        
      });
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
         headers: { Authorization: `Bearer ${token}` ,
         "Content-Type": "application/json",},
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
        method: 'DELETE',
         headers: { Authorization: `Bearer ${token}` }
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

  const getBtnClassStyle = (btnClass) => {
    const styles = {
      'btn-info': 'bg-cyan-500 text-white',
      'btn-danger': 'bg-red-500 text-white',
      'btn-success': 'bg-green-500 text-white',
      'btn-warning': 'bg-yellow-500 text-black',
      'btn-primary': 'bg-blue-500 text-white',
      'btn-secondary': 'bg-gray-500 text-white'
    };
    return styles[btnClass] || 'bg-gray-500 text-white';
  };

  const ServiceCardPreview = ({ card }) => (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl mb-4 mx-auto">
        <span className="text-2xl">{card.icon}</span>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{card.title}</h3>
      <p className="text-gray-600 text-center mb-6 leading-relaxed">{card.description}</p>
      <div className="text-center">
        <button className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 ${getBtnClassStyle(card.btnClass)}`}>
          {card.buttonText}
        </button>
      </div>
    </div>
  );

  const ServiceFeaturePreview = ({ feature }) => (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
          <div dangerouslySetInnerHTML={{ __html: feature.icon }} className="text-purple-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
          <p className="text-gray-600 leading-relaxed">{feature.description}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Services Admin Panel
                  </h1>
                </div>
                <p className="text-gray-600 text-lg">Manage your service cards and features with style</p>
              </div>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Section Tabs */}
        <div className="mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-2 border border-white/20 shadow-lg">
            <nav className="flex space-x-2">
              {Object.keys(sections).map((sectionKey) => {
                const section = sections[sectionKey];
                const isActive = activeSection === sectionKey;
                return (
                  <button
                    key={sectionKey}
                    onClick={() => setActiveSection(sectionKey)}
                    className={`flex items-center space-x-3 px-6 py-4 rounded-xl font-medium text-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                    }`}
                  >
                    <div className={isActive ? 'text-white' : 'text-gray-400'}>
                      {section.icon}
                    </div>
                    <span>{section.title}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {section.data.length}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className={`${showPreview ? 'xl:col-span-2' : 'xl:col-span-3'}`}>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20">
              <div className="px-8 py-6 border-b border-gray-100">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent flex items-center space-x-3">
                      {currentSection.icon}
                      <span>{currentSection.title}</span>
                    </h2>
                    <p className="text-gray-600 mt-1">Manage your {currentSection.title.toLowerCase()}</p>
                  </div>
                  <button
                    onClick={handleAdd}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add New
                  </button>
                </div>
                
                {/* Enhanced Search Bar */}
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={`Search ${currentSection.title.toLowerCase()}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-3 w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors duration-200"
                  />
                </div>
              </div>

              {/* Enhanced Data Table */}
              <div className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        {currentSection.fields.map((field) => (
                          <th
                            key={field.name}
                            className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                          >
                            {field.label}
                          </th>
                        ))}
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredData.map((item, index) => (
                        <tr key={item._id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200">
                          {currentSection.fields.map((field) => (
                            <td key={field.name} className="px-6 py-4">
                              {field.name === 'btnClass' ? (
                                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                  item[field.name] === 'btn-info' ? 'bg-cyan-100 text-cyan-800' :
                                  item[field.name] === 'btn-danger' ? 'bg-red-100 text-red-800' :
                                  item[field.name] === 'btn-success' ? 'bg-green-100 text-green-800' :
                                  item[field.name] === 'btn-warning' ? 'bg-yellow-100 text-yellow-800' :
                                  item[field.name] === 'btn-primary' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {item[field.name]}
                                </span>
                              ) : field.name === 'icon' && field.type === 'textarea' ? (
                                <div className="max-w-xs truncate text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
                                  {item[field.name]?.substring(0, 30)}...
                                </div>
                              ) : field.name === 'buttonLink' ? (
                                <a 
                                  href={item[field.name]} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 underline max-w-xs truncate block flex items-center space-x-1"
                                >
                                  <span>{item[field.name]}</span>
                                  <ArrowRight className="w-3 h-3" />
                                </a>
                              ) : field.type === 'textarea' ? (
                                <div className="max-w-xs truncate text-sm text-gray-900">
                                  {item[field.name]}
                                </div>
                              ) : (
                                <div className="text-sm text-gray-900 font-medium">
                                  {item[field.name] || '-'}
                                </div>
                              )}
                            </td>
                          ))}
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleEdit(item)}
                                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(item._id)}
                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
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
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg">No items found</p>
                    <p className="text-gray-400 text-sm mt-1">Try adjusting your search terms</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview Section */}
          {showPreview && (
            <div className="xl:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 sticky top-8">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                    <Eye className="w-5 h-5 text-blue-600" />
                    <span>Live Preview</span>
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">See how your content looks</p>
                </div>
                
                <div className="p-6 max-h-96 overflow-y-auto">
                  <div className="space-y-4">
                    {activeSection === 'service-cards' ? (
                      filteredData.slice(0, 2).map((card, index) => (
                        <div key={card._id} className="transform scale-90 origin-top">
                          <ServiceCardPreview card={card} />
                        </div>
                      ))
                    ) : (
                      filteredData.slice(0, 3).map((feature, index) => (
                        <div key={feature._id}>
                          <ServiceFeaturePreview feature={feature} />
                        </div>
                      ))
                    )}
                    
                    {filteredData.length === 0 && (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Eye className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-gray-500">No preview available</p>
                        <p className="text-gray-400 text-xs mt-1">Add items to see preview</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-white/20 transform transition-all duration-300">
            <div className="px-8 py-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {editingItem ? 'Edit' : 'Add New'} {currentSection.title.slice(0, -1)}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {editingItem ? 'Update the details below' : 'Fill in the information to create a new item'}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-all duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="px-8 py-6 space-y-6">
              {currentSection.fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      required={field.required}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors duration-200 resize-none"
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      required={field.required}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors duration-200"
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'url' ? (
                    <input
                      type="url"
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      required={field.required}
                      placeholder="https://example.com"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors duration-200"
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      required={field.required}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors duration-200"
                    />
                  )}
                </div>
              ))}

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  onClick={handleSubmit}
                  className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl transition-all duration-200 flex items-center shadow-lg hover:shadow-xl disabled:opacity-50"
                >50"
                
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : (editingItem ? 'Update' : 'Save')}
                </button>
              </div>
             
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="bg-white p-8 rounded-3xl shadow-2xl">
            <div className="flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-200 border-t-blue-600"></div>
              <span className="text-gray-700 font-medium">Processing...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesAdminPanel;