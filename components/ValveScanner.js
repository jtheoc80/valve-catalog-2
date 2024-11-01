import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Check, Loader } from 'lucide-react';

const LoadingSpinner = ({ message }) => (
  <div className="text-center py-8">
    <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg">
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
      {message || 'Processing...'}
    </div>
  </div>
);

const ValveScanner = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [analysisStatus, setAnalysisStatus] = useState('');
  const [error, setError] = useState(null);
  
  // Separate refs for camera and gallery
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const simulateAnalysis = async () => {
    setAnalysisStatus('Analyzing valve characteristics...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    setAnalysisStatus('Matching with database...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    setAnalysisStatus('Found potential matches!');
  };

  const handleImage = async (file) => {
    if (file) {
      setIsLoading(true);
      setError(null);
      
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          setCapturedImage(e.target?.result);
          await simulateAnalysis();
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
  };

  const resetScanner = () => {
    setCapturedImage(null);
    setAnalysisStatus('');
    setError(null);
    setIsLoading(false);
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-lg mx-auto">
      <div className="p-4 border-b flex justify-between items-center bg-gray-50">
        <h2 className="text-xl font-bold text-gray-800">Scan Valve</h2>
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
          <LoadingSpinner message={analysisStatus} />
        ) : capturedImage ? (
          <div className="space-y-4">
            <div className="relative">
              <img 
                src={capturedImage} 
                alt="Captured valve" 
                className="w-full h-64 object-contain rounded-lg border border-gray-200"
              />
              {analysisStatus && (
                <div className="mt-2 p-3 bg-green-50 text-green-700 rounded-lg flex items-center">
                  <Check size={16} className="mr-2 flex-shrink-0" />
                  <span className="text-sm">{analysisStatus}</span>
                </div>
              )}
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
            {/* Camera Input - Mobile Camera */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileUpload}
            />
            
            {/* Gallery Input - Photo Library */}
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Camera size={20} />
              Take Photo
            </button>
            
            <button
              onClick={() => galleryInputRef.current?.click()}
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
              Ensure good lighting
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
              Keep the valve centered in frame
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
              Capture all identifying marks
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ValveScanner;
