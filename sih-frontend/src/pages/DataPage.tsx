import React, { useState, useRef } from 'react';
import { Upload, FileText, Database, AlertCircle, CheckCircle, BarChart3, Waves, MapPin, Calendar, User, Shield } from 'lucide-react';

const OceanDataUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    officialName: '',
    department: '',
    region: '',
    dataType: '',
    collectionDate: '',
    description: '',
    coordinates: { lat: '', lng: '' }
  });
  const [validationErrors, setValidationErrors] = useState({});
  const fileInputRef = useRef(null);

  const dataTypes = [
    'Temperature Measurements',
    'Salinity Levels',
    'pH Levels',
    'Dissolved Oxygen',
    'Current Speed & Direction',
    'Wave Height Data',
    'Marine Biodiversity',
    'Pollution Indicators',
    'Depth Soundings',
    'Tidal Data'
  ];

  const departments = [
    'National Institute of Oceanography',
    'Indian Coast Guard',
    'Ministry of Earth Sciences',
    'National Centre for Ocean Information Services',
    'Marine Products Export Development Authority',
    'Fisheries Department',
    'Port Authority',
    'Environmental Monitoring Agency'
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const validFiles = Array.from(files).filter(file => {
      const validTypes = ['text/csv', 'application/json', 'text/plain', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      return validTypes.includes(file.type) || file.name.endsWith('.csv') || file.name.endsWith('.json') || file.name.endsWith('.txt') || file.name.endsWith('.xlsx');
    });

    if (validFiles.length > 0) {
      simulateUpload(validFiles);
    }
  };

  const simulateUpload = (files) => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadedFiles(prev => [...prev, ...files.map(file => ({
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
            type: file.type,
            uploadTime: new Date().toLocaleString(),
            status: 'completed'
          }))]);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.officialName) errors.officialName = 'Official name is required';
    if (!formData.department) errors.department = 'Department is required';
    if (!formData.region) errors.region = 'Region is required';
    if (!formData.dataType) errors.dataType = 'Data type is required';
    if (!formData.collectionDate) errors.collectionDate = 'Collection date is required';
    if (!formData.coordinates.lat || !formData.coordinates.lng) {
      errors.coordinates = 'Coordinates are required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm() && uploadedFiles.length > 0) {
      // Simulate successful submission
      alert('Data submitted successfully! Your submission ID is: OCN-' + Math.random().toString(36).substr(2, 9).toUpperCase());
      // Reset form
      setFormData({
        officialName: '',
        department: '',
        region: '',
        dataType: '',
        collectionDate: '',
        description: '',
        coordinates: { lat: '', lng: '' }
      });
      setUploadedFiles([]);
      setValidationErrors({});
    }
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-3 rounded-lg">
                <Waves className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Ocean Data Upload Portal</h1>
                <p className="text-gray-600">Government Officials Data Submission Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-lg">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">Secured Portal</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Upload Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Official Information */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <User className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Official Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Official Name *
                  </label>
                  <input
                    type="text"
                    value={formData.officialName}
                    onChange={(e) => setFormData(prev => ({ ...prev, officialName: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      validationErrors.officialName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {validationErrors.officialName && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.officialName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      validationErrors.department ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  {validationErrors.department && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.department}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Region *
                  </label>
                  <input
                    type="text"
                    value={formData.region}
                    onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      validationErrors.region ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Arabian Sea, Bay of Bengal"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data Collection Date *
                  </label>
                  <input
                    type="date"
                    value={formData.collectionDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, collectionDate: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      validationErrors.collectionDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
              </div>

              {/* Coordinates */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Collection Coordinates *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    step="any"
                    value={formData.coordinates.lat}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      coordinates: { ...prev.coordinates, lat: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Latitude"
                  />
                  <input
                    type="number"
                    step="any"
                    value={formData.coordinates.lng}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      coordinates: { ...prev.coordinates, lng: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Longitude"
                  />
                </div>
                {validationErrors.coordinates && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.coordinates}</p>
                )}
              </div>
            </div>

            {/* Data Information */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <Database className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Data Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data Type *
                  </label>
                  <select
                    value={formData.dataType}
                    onChange={(e) => setFormData(prev => ({ ...prev, dataType: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      validationErrors.dataType ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Data Type</option>
                    {dataTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Describe the data collection method, equipment used, and any relevant notes..."
                  />
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <Upload className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Upload Data Files</h2>
              </div>

              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drop your files here or click to upload
                </p>
                <p className="text-gray-500 mb-4">
                  Supported formats: CSV, JSON, TXT, XLSX, NC (Max 100MB per file)
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Choose Files
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                  accept=".csv,.json,.txt,.xlsx,.xls"
                />
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Uploaded Files</h3>
                  <div className="space-y-3">
                    {uploadedFiles.map((file: UploadedFile, index: number) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-8 w-8 text-blue-600" />
                          <div>
                            <p className="font-medium text-gray-900">{file.name}</p>
                            <p className="text-sm text-gray-500">{file.size} • {file.uploadTime}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <button
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:text-red-800 font-medium text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <button
                onClick={handleSubmit}
                disabled={uploadedFiles.length === 0}
                className={`w-full py-4 px-6 rounded-lg font-medium text-lg transition-colors ${
                  uploadedFiles.length > 0
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Submit Ocean Data for Model Training
              </button>
              {uploadedFiles.length === 0 && (
                <p className="text-center text-gray-500 text-sm mt-2">
                  Please upload at least one file to submit
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Upload Statistics</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">1,247</div>
                  <div className="text-sm text-blue-800">Total Submissions</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">45.2TB</div>
                  <div className="text-sm text-green-800">Data Processed</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">89%</div>
                  <div className="text-sm text-purple-800">Model Accuracy</div>
                </div>
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <AlertCircle className="h-6 w-6 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900">Upload Guidelines</h3>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Ensure data is collected using calibrated instruments</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Include metadata with timestamp and location information</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Remove any personally identifiable information</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Use standard units and formats for measurements</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Quality check data before submission</p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
              <p className="text-blue-100 text-sm mb-4">
                Contact our technical support team for assistance with data submission.
              </p>
              <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OceanDataUpload;