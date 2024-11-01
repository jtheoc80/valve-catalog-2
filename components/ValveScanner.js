import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Check, Loader } from 'lucide-react';

const ValveScanner = ({ onClose }) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [analysisStatus, setAnalysisStatus] = useState('');
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // For iOS, we'll use the file input with camera capture
  const handleTakePhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      setAnalysisStatus('Processing image...');
      
      try {
        // Show preview of captured/uploaded image
        const reader = new FileReader();
        reader.onload = (e) => {
          setCapturedImage(e.target?.result);
        };
        reader.readAsDataURL(file);

        // Simulate API call for analysis
        await new Promise(resolve => setTimeout(resolve, 2000));
        setAnalysisStatus('Analysis complete! Found 3 matching valves.');

      } catch (err) {
        setError('Error processing image. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resetScanner = () => {
    setCapturedImage(null);
    setAnalysisStatus('');
    setError(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold">Scan Valve</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <div className="p-4">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
            <button 
              onClick={() => setError(null)} 
              className="ml-2 text-red-700 hover:text-red-800"
            >
              Try Again
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">{analysisStatus}</p>
          </div>
        ) : capturedImage ? (
          <div className="space-y-4">
            <div className="relative">
              <img 
                src={capturedImage} 
                alt="Captured valve" 
                className="w-full h-64 object-contain rounded-lg"
              />
              {analysisStatus && (
                <div className="mt-2 p-2 bg-green-50 text-green-700 rounded-lg flex items-center">
                  <Check size={16} className="mr-2" />
                  {analysisStatus}
                </div>
              )}
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={resetScanner}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Scan Another
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Hidden file input for both camera and upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileUpload}
            />
            
            {/* Take Photo button - now uses file input on iOS */}
            <button
              onClick={handleTakePhoto}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Camera size={20} />
              Take Photo
            </button>
            
            {/* Upload Image button - also uses same file input */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Upload size={20} />
              Upload from Gallery
            </button>
          </div>
        )}

        <div className="mt-4 text-sm text-gray-500">
          <p>For best results:</p>
          <ul className="list-disc ml-5 mt-1">
            <li>Ensure good lighting</li>
            <li>Keep the valve centered</li>
            <li>Capture the entire valve</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ValveScanner;
