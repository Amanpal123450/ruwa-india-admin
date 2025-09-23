import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Upload, Eye, EyeOff } from 'lucide-react';

const AboutPageAdmin = () => {
  const [activeTab, setActiveTab] = useState('about');
  const [aboutData, setAboutData] = useState(null);
  const [featuresData, setFeaturesData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState({ about: false, features: false });
  const [previewMode, setPreviewMode] = useState(false);

  // Initialize data
  useEffect(() => {
    fetchAboutData();
    fetchFeaturesData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/aboutWelcome');
      const data = await response.json();
      setAboutData(data || {
        subtitle: '',
        heading: '',
        shortText: '',
        paragraphs: [''],
        image: '',
        missionItems: []
      });
    } catch (error) {
      console.error('Error fetching about data:', error);
      setAboutData({
        subtitle: '',
        heading: '',
        shortText: '',
        paragraphs: [''],
        image: '',
        missionItems: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFeaturesData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/aboutFeature');
      const data = await response.json();
      setFeaturesData(data || {
        heading: '',
        description: '',
        features: []
      });
    } catch (error) {
      console.error('Error fetching features data:', error);
      setFeaturesData({
        heading: '',
        description: '',
        features: []
      });
    }
  };

  const saveAboutData = async () => {
    try {
      const method = aboutData._id ? 'PUT' : 'POST';
      const response = await fetch('http://localhost:8000/api/aboutWelcome', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aboutData)
      });
      
      if (response.ok) {
        const updated = await response.json();
        setAboutData(updated);
        setEditMode(prev => ({ ...prev, about: false }));
        alert('About section saved successfully!');
      }
    } catch (error) {
      console.error('Error saving about data:', error);
      alert('Error saving about data');
    }
  };

  const saveFeaturesData = async () => {
    try {
      const method = featuresData._id ? 'PUT' : 'POST';
      const response = await fetch('http://localhost:8000/api/aboutFeature', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(featuresData)
      });
      
      if (response.ok) {
        const updated = await response.json();
        setFeaturesData(updated);
        setEditMode(prev => ({ ...prev, features: false }));
        alert('Features section saved successfully!');
      }
    } catch (error) {
      console.error('Error saving features data:', error);
      alert('Error saving features data');
    }
  };

  const addMissionItem = () => {
    setAboutData(prev => ({
      ...prev,
      missionItems: [...prev.missionItems, { title: '', icon: '', text: '' }]
    }));
  };

  const removeMissionItem = (index) => {
    setAboutData(prev => ({
      ...prev,
      missionItems: prev.missionItems.filter((_, i) => i !== index)
    }));
  };

  const updateMissionItem = (index, field, value) => {
    setAboutData(prev => ({
      ...prev,
      missionItems: prev.missionItems.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addFeature = () => {
    setFeaturesData(prev => ({
      ...prev,
      features: [...prev.features, { icon: '', title: '', text: '' }]
    }));
  };

  const removeFeature = (index) => {
    setFeaturesData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const updateFeature = (index, field, value) => {
    setFeaturesData(prev => ({
      ...prev,
      features: prev.features.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addParagraph = () => {
    setAboutData(prev => ({
      ...prev,
      paragraphs: [...prev.paragraphs, '']
    }));
  };

  const removeParagraph = (index) => {
    setAboutData(prev => ({
      ...prev,
      paragraphs: prev.paragraphs.filter((_, i) => i !== index)
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">About Page Management</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  previewMode 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {previewMode ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {previewMode ? 'Edit Mode' : 'Preview'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('about')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'about'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              About Section
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'features'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Features Section
            </button>
          </nav>
        </div>

        {/* About Section */}
        {activeTab === 'about' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">About Section</h2>
              <div className="flex space-x-2">
                {editMode.about ? (
                  <>
                    <button
                      onClick={saveAboutData}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setEditMode(prev => ({ ...prev, about: false }));
                        fetchAboutData();
                      }}
                      className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditMode(prev => ({ ...prev, about: true }))}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                )}
              </div>
            </div>

            <div className="p-6">
              {previewMode ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-blue-600 font-medium mb-2">{aboutData.subtitle}</p>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">{aboutData.heading}</h2>
                    <p className="text-lg text-gray-600 mb-8">{aboutData.shortText}</p>
                    {aboutData.image && (
                      <img src={aboutData.image} alt="About" className="mx-auto rounded-lg mb-8 max-w-md" />
                    )}
                    {aboutData.paragraphs.map((paragraph, index) => (
                      <p key={index} className="text-gray-700 mb-4">{paragraph}</p>
                    ))}
                  </div>
                  {aboutData.missionItems.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                      {aboutData.missionItems.map((item, index) => (
                        <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
                          <div className="text-4xl mb-4">{item.icon}</div>
                          <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                          <p className="text-gray-600">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                      <input
                        type="text"
                        value={aboutData.subtitle}
                        onChange={(e) => setAboutData(prev => ({ ...prev, subtitle: e.target.value }))}
                        disabled={!editMode.about}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        placeholder="Enter subtitle"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Main Heading</label>
                      <input
                        type="text"
                        value={aboutData.heading}
                        onChange={(e) => setAboutData(prev => ({ ...prev, heading: e.target.value }))}
                        disabled={!editMode.about}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        placeholder="Enter main heading"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
                    <textarea
                      value={aboutData.shortText}
                      onChange={(e) => setAboutData(prev => ({ ...prev, shortText: e.target.value }))}
                      disabled={!editMode.about}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="Enter short description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                    <input
                      type="url"
                      value={aboutData.image}
                      onChange={(e) => setAboutData(prev => ({ ...prev, image: e.target.value }))}
                      disabled={!editMode.about}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="Enter image URL"
                    />
                  </div>

                  {/* Paragraphs */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-sm font-medium text-gray-700">Content Paragraphs</label>
                      {editMode.about && (
                        <button
                          onClick={addParagraph}
                          className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Paragraph
                        </button>
                      )}
                    </div>
                    <div className="space-y-4">
                      {aboutData.paragraphs.map((paragraph, index) => (
                        <div key={index} className="flex gap-2">
                          <textarea
                            value={paragraph}
                            onChange={(e) => {
                              const newParagraphs = [...aboutData.paragraphs];
                              newParagraphs[index] = e.target.value;
                              setAboutData(prev => ({ ...prev, paragraphs: newParagraphs }));
                            }}
                            disabled={!editMode.about}
                            rows="3"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                            placeholder={`Paragraph ${index + 1}`}
                          />
                          {editMode.about && aboutData.paragraphs.length > 1 && (
                            <button
                              onClick={() => removeParagraph(index)}
                              className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mission Items */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-sm font-medium text-gray-700">Mission Items</label>
                      {editMode.about && (
                        <button
                          onClick={addMissionItem}
                          className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Mission Item
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {aboutData.missionItems.map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
                          {editMode.about && (
                            <button
                              onClick={() => removeMissionItem(index)}
                              className="absolute top-2 right-2 text-red-600 hover:bg-red-50 p-1 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={item.icon}
                              onChange={(e) => updateMissionItem(index, 'icon', e.target.value)}
                              disabled={!editMode.about}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-center text-2xl"
                              placeholder="📊 Icon"
                            />
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => updateMissionItem(index, 'title', e.target.value)}
                              disabled={!editMode.about}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                              placeholder="Mission Title"
                            />
                            <textarea
                              value={item.text}
                              onChange={(e) => updateMissionItem(index, 'text', e.target.value)}
                              disabled={!editMode.about}
                              rows="3"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                              placeholder="Mission description"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Features Section */}
        {activeTab === 'features' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Features Section</h2>
              <div className="flex space-x-2">
                {editMode.features ? (
                  <>
                    <button
                      onClick={saveFeaturesData}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setEditMode(prev => ({ ...prev, features: false }));
                        fetchFeaturesData();
                      }}
                      className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditMode(prev => ({ ...prev, features: true }))}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                )}
              </div>
            </div>

            <div className="p-6">
              {previewMode ? (
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">{featuresData.heading}</h2>
                    <p className="text-lg text-gray-600 mb-12">{featuresData.description}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuresData.features.map((feature, index) => (
                      <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
                        <div className="text-4xl mb-4">{feature.icon}</div>
                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                        <p className="text-gray-600">{feature.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Section Heading</label>
                      <input
                        type="text"
                        value={featuresData.heading}
                        onChange={(e) => setFeaturesData(prev => ({ ...prev, heading: e.target.value }))}
                        disabled={!editMode.features}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        placeholder="Enter section heading"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={featuresData.description}
                        onChange={(e) => setFeaturesData(prev => ({ ...prev, description: e.target.value }))}
                        disabled={!editMode.features}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        placeholder="Enter section description"
                      />
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-sm font-medium text-gray-700">Feature Cards</label>
                      {editMode.features && (
                        <button
                          onClick={addFeature}
                          className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Feature
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {featuresData.features.map((feature, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
                          {editMode.features && (
                            <button
                              onClick={() => removeFeature(index)}
                              className="absolute top-2 right-2 text-red-600 hover:bg-red-50 p-1 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={feature.icon}
                              onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                              disabled={!editMode.features}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-center text-2xl"
                              placeholder="🚀 Icon"
                            />
                            <input
                              type="text"
                              value={feature.title}
                              onChange={(e) => updateFeature(index, 'title', e.target.value)}
                              disabled={!editMode.features}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                              placeholder="Feature Title"
                            />
                            <textarea
                              value={feature.text}
                              onChange={(e) => updateFeature(index, 'text', e.target.value)}
                              disabled={!editMode.features}
                              rows="3"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                              placeholder="Feature description"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutPageAdmin;