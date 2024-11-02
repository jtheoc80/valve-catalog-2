import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Loader } from 'lucide-react';

const ValveScanner = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleImage = async (file) => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target.result;
      setCapturedImage(imageData);

      try {
        const response = await fetch('/api/analyze-valve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: imageData }),
        });

        if (!response.ok) throw new Error('Analysis failed');

        const results = await response.json();
        setAnalysisResults(results);
      } catch (analysisError) {
        console.error('Analysis error:', analysisError);
        setError('Failed to analyze valve. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => setError('Error reading image file. Please try again.');
    reader.readAsDataURL(file);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (file) await handleImage(file);
    if (event.target) event.target.value = '';
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
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
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
            <span>{error}</span>
            <button 
              onClick={() => setError(null)} 
              className="text-red-700 hover:text-red-800 p-1 rounded-full hover:bg-red-100"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8">
            <Loader className="mx-auto animate-spin" size={32} /> Analyzing valve...
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
            <button
              onClick={resetScanner}
              className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Camera size={18} />
              Scan Another
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
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
            <li>Ensure good lighting for accurate measurements</li>
            <li>Keep part numbers visible in frame</li>
            <li>Capture brand markings clearly</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ValveScanner;
