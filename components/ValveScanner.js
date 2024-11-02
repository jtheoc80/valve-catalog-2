import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Check, Loader, Ruler, Box, BookOpen, Hash } from 'lucide-react';

// Analysis Results Component
const AnalysisResults = ({ results }) => (
  <div className="space-y-4 mt-4 p-4 bg-white rounded-lg border border-gray-200">
    <div className="grid grid-cols-2 gap-4">
      <div className="p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Ruler className="text-blue-600" size={18} />
          <span className="font-medium">Size</span>
        </div>
        <p className="text-sm">{results.size}</p>
      </div>
      <div className="p-3 bg-green-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Box className="text-green-600" size={18} />
          <span className="font-medium">Material</span>
        </div>
        <p className="text-sm">{results.material}</p>
      </div>
      <div className="p-3 bg-purple-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="text-purple-600" size={18} />
          <span className="font-medium">Brand</span>
        </div>
        <p className="text-sm">{results.brand}</p>
      </div>
      <div className="p-3 bg-orange-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Hash className="text-orange-600" size={18} />
          <span className="font-medium">Part Number</span>
        </div>
        <p className="text-sm">{results.partNumber}</p>
      </div>
    </div>
  </div>
);

const ValveScanner = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [analysisStatus, setAnalysisStatus] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const performAnalysis = async () => {
    setAnalysisStatus('Analyzing valve characteristics...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    setAnalysisStatus('Detecting features...');
    await new Promise(resolve => setTimeout(resolve, 800));
    setAnalysisStatus('Identifying specifications...');
    await new Promise(resolve => setTimeout(resolve, 800));

    // Simulated analysis results
    return {
      size: '3/4" (DN20)',
      material: 'Brass with Chrome Plating',
      brand: 'Bluefin Industrial',
      partNumber: 'BF-7520-C34',
      confidence: 92
    };
  };

  const handleImage = async (file) => {
    if (file) {
      setIsLoading(true);
      setError(null);
      
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          setCapturedImage(e.target?.result);
          
          // Perform analysis after image is loaded
          const results = await performAnalysis();
          setAnalysisResults(results);
          setAnalysisStatus('Analysis complete!');
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setError('Error processing image. Please try again.');
        setCapturedImage(null);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      await handleImage(file);
    }
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
    setAnalysisStatus('');
    setAnalysisResults(null);
    setError(null);
    setIsLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center justify-between">
            <span className="flex-1">{error}</span>
            <button 
              onClick={() => setError(null)} 
              className="ml-2 text-red-700 hover:text-red-800 p-1 rounded-full hover:bg-red-100"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              {analysisStatus}
            </div>
          </div>
        ) : capturedImage ? (
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
