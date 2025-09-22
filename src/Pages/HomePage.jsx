import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Upload, Eye, EyeOff } from 'lucide-react';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // State for all sections
  const [heroData, setHeroData] = useState(null);
  const [slides, setSlides] = useState([]);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [editingItem, setEditingItem] = useState(null);

  // Form states
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const API_BASE = 'https://ruwa-backend.onrender.com/api';

  // API functions
  const api = {
    // Hero API
    getHero: () => fetch(`${API_BASE}/hero-routes`).then(res => res.json()),
    createHero: (data) => fetch(`${API_BASE}/hero-routes`, { method: 'POST', body: data }),
    updateHero: (data) => fetch(`${API_BASE}/hero-routes`, { method: 'PUT', body: data }),
    deleteHero: () => fetch(`${API_BASE}/hero-routes`, { method: 'DELETE' }),

    // Slides API
    getSlides: () => fetch(`${API_BASE}/slide-routes`).then(res => res.json()),
    createSlide: (data) => fetch(`${API_BASE}/slide-routes`, { method: 'POST', body: data }),
    updateSlide: (id, data) => fetch(`${API_BASE}/slide-routes/${id}`, { method: 'PUT', body: data }),
    deleteSlide: (id) => fetch(`${API_BASE}/slide-routes/${id}`, { method: 'DELETE' }),

    // Services API
    getServices: () => fetch(`${API_BASE}/service-routes`).then(res => res.json()),
    createService: (data) => fetch(`${API_BASE}/service-routes`, { method: 'POST', body: data }),
    updateService: (id, data) => fetch(`${API_BASE}/service-routes/${id}`, { method: 'PUT', body: data }),
    deleteService: (id) => fetch(`${API_BASE}/service-routes/${id}`, { method: 'DELETE' }),

    // Testimonials API
    getTestimonials: () => fetch(`${API_BASE}/testimonials-routes`).then(res => res.json()),
    createTestimonial: (data) => fetch(`${API_BASE}/testimonials-routes`, { method: 'POST', body: data }),
    updateTestimonial: (id, data) => fetch(`${API_BASE}/testimonials-routes/${id}`, { method: 'PUT', body: data }),
    deleteTestimonial: (id) => fetch(`${API_BASE}/testimonials-routes/${id}`, { method: 'DELETE' }),
  };

  // Load data on mount and tab change
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'hero':
          const heroResponse = await api.getHero();
          setHeroData(heroResponse);
          break;
        case 'slides':
          const slidesResponse = await api.getSlides();
          setSlides(slidesResponse);
          break;
        case 'services':
          const servicesResponse = await api.getServices();
          setServices(servicesResponse);
          break;
        case 'testimonials':
          const testimonialsResponse = await api.getTestimonials();
          setTestimonials(testimonialsResponse);
          break;
      }
    } catch (error) {
      showMessage('Error loading data: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(''), 3000);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setShowModal(true);
    setImageFile(null);
    setImagePreview('');
    
    if (type === 'edit' && item) {
      setFormData({ ...item });
      setImagePreview(item.src || item.heroImage || item.icon || item.image || '');
    } else if (type === 'create' || (type === 'edit' && activeTab === 'hero')) {
      // Reset form for create or hero edit
      const defaultData = {
        hero: { subtitle: '', title: '', paragraph1: '', paragraph2: '' },
        slides: { title: '', text: '', icon: '' },
        services: { title: '', description: '' },
        testimonials: { name: '', message: '' }
      };
      setFormData(activeTab === 'hero' && heroData ? { ...heroData } : defaultData[activeTab] || {});
      if (activeTab === 'hero' && heroData) {
        setImagePreview(heroData.heroImage || '');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({});
    setImageFile(null);
    setImagePreview('');
    setEditingItem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataObj = new FormData();
      
      // Add text fields
      Object.keys(formData).forEach(key => {
        if (formData[key]) formDataObj.append(key, formData[key]);
      });

      // Add image if selected
      if (imageFile) {
        const imageFieldName = {
          hero: 'heroImage',
          slides: 'src',
          services: 'icon',
          testimonials: 'image'
        }[activeTab];
        formDataObj.append(imageFieldName, imageFile);
      }

      let response;
      
      if (activeTab === 'hero') {
        response = heroData ? 
          await api.updateHero(formDataObj) : 
          await api.createHero(formDataObj);
      } else {
        if (modalType === 'create') {
          response = await api[`create${activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(1, -1)}`](formDataObj);
        } else {
          response = await api[`update${activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(1, -1)}`](editingItem._id, formDataObj);
        }
      }

      if (response.ok) {
        showMessage(`${activeTab.slice(0, -1)} ${modalType === 'create' ? 'created' : 'updated'} successfully!`);
        closeModal();
        loadData();
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      showMessage('Error saving: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    // if (!confirm('Are you sure you want to delete this item?')) return;
    
    setLoading(true);
    try {
      let response;
      if (activeTab === 'hero') {
        response = await api.deleteHero();
      } else {
        response = await api[`delete${activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(1, -1)}`](id);
      }

      if (response.ok) {
        showMessage('Item deleted successfully!');
        loadData();
      }
    } catch (error) {
      showMessage('Error deleting: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const renderHeroForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.subtitle || ''}
          onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.title || ''}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Paragraph 1</label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
          value={formData.paragraph1 || ''}
          onChange={(e) => setFormData({...formData, paragraph1: e.target.value})}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Paragraph 2</label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
          value={formData.paragraph2 || ''}
          onChange={(e) => setFormData({...formData, paragraph2: e.target.value})}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="mt-2 h-32 w-auto object-cover rounded" />
        )}
      </div>
    </div>
  );

  const renderSlideForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.title || ''}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
          value={formData.text || ''}
          onChange={(e) => setFormData({...formData, text: e.target.value})}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Icon (optional)</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.icon || ''}
          onChange={(e) => setFormData({...formData, icon: e.target.value})}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="mt-2 h-32 w-auto object-cover rounded" />
        )}
      </div>
    </div>
  );

  const renderServiceForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.title || ''}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
          value={formData.description || ''}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Icon (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="mt-2 h-32 w-auto object-cover rounded" />
        )}
      </div>
    </div>
  );

  const renderTestimonialForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.name || ''}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
          value={formData.message || ''}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="mt-2 h-32 w-32 object-cover rounded-full" />
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>;
    }

    switch (activeTab) {
      case 'hero':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Hero Section</h2>
              <button
                onClick={() => openModal('edit')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                {heroData ? 'Edit Hero' : 'Create Hero'}
              </button>
            </div>
            
            {heroData ? (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{heroData.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{heroData.subtitle}</p>
                    <p className="text-gray-700 mb-4">{heroData.paragraph1}</p>
                    {heroData.paragraph2 && <p className="text-gray-700">{heroData.paragraph2}</p>}
                  </div>
                  {heroData.heroImage && (
                    <div>
                      <img src={heroData.heroImage} alt="Hero" className="w-full h-48 object-cover rounded" />
                    </div>
                  )}
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleDelete()}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-600">No hero section found. Create one to get started.</p>
              </div>
            )}
          </div>
        );

      case 'slides':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Slides</h2>
              <button
                onClick={() => openModal('create')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Slide
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {slides.map((slide) => (
                <div key={slide._id} className="bg-white rounded-lg shadow p-6">
                  {slide.src && (
                    <img src={slide.src} alt={slide.title} className="w-full h-32 object-cover rounded mb-4" />
                  )}
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{slide.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{slide.text}</p>
                  {slide.icon && <p className="text-xs text-gray-500">Icon: {slide.icon}</p>}
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => openModal('edit', slide)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(slide._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {slides.length === 0 && (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-600">No slides found. Add your first slide to get started.</p>
              </div>
            )}
          </div>
        );

      case 'services':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Services</h2>
              <button
                onClick={() => openModal('create')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Service
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div key={service._id} className="bg-white rounded-lg shadow p-6">
                  {service.icon && (
                    <img src={service.icon} alt={service.title} className="w-16 h-16 object-cover rounded mb-4" />
                  )}
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => openModal('edit', service)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(service._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {services.length === 0 && (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-600">No services found. Add your first service to get started.</p>
              </div>
            )}
          </div>
        );

      case 'testimonials':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Testimonials</h2>
              <button
                onClick={() => openModal('create')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Testimonial
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <div key={testimonial._id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center gap-4 mb-4">
                    {testimonial.image && (
                      <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 object-cover rounded-full" />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{testimonial.name}</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">"{testimonial.message}"</p>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => openModal('edit', testimonial)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {testimonials.length === 0 && (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-600">No testimonials found. Add your first testimonial to get started.</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Website Admin Panel</h1>
            <p className="text-gray-600">Manage your website content dynamically</p>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4`}>
          <div className={`p-4 rounded-md ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message.text}
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow mt-6">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { key: 'hero', label: 'Hero Section' },
              { key: 'slides', label: 'Slides' },
              { key: 'services', label: 'Services' },
              { key: 'testimonials', label: 'Testimonials' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {modalType === 'create' ? `Add ${activeTab.slice(0, -1)}` : `Edit ${activeTab.slice(0, -1)}`}
                </h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {activeTab === 'hero' && renderHeroForm()}
                {activeTab === 'slides' && renderSlideForm()}
                {activeTab === 'services' && renderServiceForm()}
                {activeTab === 'testimonials' && renderTestimonialForm()}

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;