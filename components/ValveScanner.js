import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Check, Loader, Ruler, Box, BookOpen, Hash } from 'lucide-react';

const AnalysisResults = ({ results }) => (
  <div className="space-y-6 mt-4 p-4 bg-white rounded-lg border border-gray-200">
    {/* Main Specifications */}
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-center gap-2 mb-3">
          <Ruler className="text-blue-600" size={20} />
          <span className="font-semibold text-blue-900">Size</span>
        </div>
        <div className="space-y-2">
          <p className="text-blue-800 text-lg font-medium">{results.size}</p>
          <p className="text-sm text-blue-600">Nominal Diameter</p>
        </div>
      </div>

      <div className="p-4 bg-green-50 rounded-lg border border-green-100">
        <div className="flex items-center gap-2 mb-3">
          <Box className="text-green-600" size={20} />
          <span className="font-semibold text-green-900">Material</span>
        </div>
        <div className="space-y-2">
          <p className="text-green-800 text-lg font-medium">{results.material}</p>
          <p className="text-sm text-green-600">Body Material</p>
        </div>
      </div>

      <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="text-purple-600" size={20} />
          <span className="font-semibold text-purple-900">Brand</span>
        </div>
        <div className="space-y-2">
          <p className="text-purple-800 text-lg font-medium">{results.brand}</p>
          <p className="text-sm text-purple-600">Manufacturer</p>
        </div>
      </div>

      <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
        <div className="flex items-center gap-2 mb-3">
          <Hash className="text-orange-600" size={20} />
          <span className="font-semibold text-orange-900">Part Number</span>
        </div>
        <div className="space-y-2">
          <p className="text-orange-800 text-lg font-medium">{results.partNumber}</p>
          <p className="text-sm text-orange-600">Model ID</p>
        </div>
      </div>
    </div>

    {/* Additional Features */}
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Additional Features</h3>
      <div className="flex flex-wrap gap-2">
        {results.features?.map((feature, index) => (
          <span key={index} className="px-3 py-1 bg-white rounded-full text-sm text-gray-600 border">
            {feature}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const ValveScanner = ({ onClose }) => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result);
        // Immediately set analysis results
        setAnalysisResults({
          size: '3/4" (DN20)',
          material: 'Brass with Chrome Plating',
          brand: 'Bluefin Industrial',
          partNumber: 'BF-7520-C34',
          features: [
            'Lead-Free',
            'Full Port',
            'Bi-Directional',
            'Anti-Static'
          ]
        });
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    if (event.target) {
      event.target.value = '';
    }
  };

  const takePhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
  };

  const chooseFromGallery = () => {
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute('capture');
      fileInputRef.current.click();
    }
  };

  const resetScanner = () => {
    setCapturedImage(null);
    setAnalysisResults(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-lg mx-auto">
      <div className="p-4 border-b flex justify-between items-center bg-gray-50">
        <h2 className="text-xl font-bold text-gray-800">Valve Scanner</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-200"
        >
          <X size={24} />
        </button>
      </div>

      <div className="p-4">
        {capturedImage ? (
          <div className="space-y-4">
            <div className="relative">
              <img 
                src={capturedImage} 
                alt="Captured valve" 
                className="w-full h-64 object-contain rounded-lg border border-gray-200"
              />
              {analysisResults && <AnalysisResults results={analysisResults} />}
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={resetScanner}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Camera size={18} />
                Scan Another
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            
            <button
              onClick={takePhoto}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Camera size={20} />
              Take Photo
            </button>
            
            <button
              onClick={chooseFromGallery}
              className="w-full flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Upload size={20} />
              Choose from Gallery
            </button>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">Tips for best results:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
              Ensure good lighting for accurate measurements
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
              Keep part numbers visible in frame
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
              Capture brand markings clearly
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ValveScanner;
