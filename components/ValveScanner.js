import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Check, Loader } from 'lucide-react';

const ValveScanner = ({ onClose }) => {
  // ... other states and refs ...
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  // Separate handlers for camera and gallery
  const handleCameraClick = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleGalleryClick = () => {
    if (galleryInputRef.current) {
      galleryInputRef.current.click();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-lg mx-auto">
      {/* ... header section ... */}

      <div className="p-4">
        {/* ... error handling ... */}

        {isLoading ? (
          <LoadingSpinner message={analysisStatus} />
        ) : capturedImage ? (
          // ... image preview section ...
        ) : (
          <div className="space-y-4">
            {/* Camera input - with capture attribute */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileUpload}
            />
            
            {/* Gallery input - without capture attribute */}
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            
            <button
              onClick={handleCameraClick}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Camera size={20} />
              Take Photo
            </button>
            
            <button
              onClick={handleGalleryClick}
              className="w-full flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Upload size={20} />
              Choose from Gallery
            </button>
          </div>
        )}

        {/* ... instructions section ... */}
      </div>
    </div>
  );
};

export default ValveScanner;
