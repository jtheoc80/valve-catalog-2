import React, { useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';

const ValveScanner = ({ onClose }) => {
  const [error, setError] = useState(null);

  const handleScan = async () => {
    try {
      // Check if the browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Camera not supported on this device or browser');
        return;
      }

      const constraints = {
        video: {
          facingMode: 'environment' // Use back camera if available
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      // Handle stream
      console.log('Camera access granted:', stream);
      
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Unable to access camera. Please check permissions.');
    }
  };

  const handleUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle file upload
      console.log('File selected:', file);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      {/* Close Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Scan Valve</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-4">
        <button
          onClick={handleScan}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Camera size={20} />
          Take Photo
        </button>
        
        <label className="w-full flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
          <Upload size={20} />
          <span>Upload Image</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
        </label>
      </div>

      {/* Instructions */}
      <div className="mt-6 text-sm text-gray-600">
        <p>Take a photo or upload an image of a valve to find similar matches.</p>
        <p className="mt-2">Supported formats: JPG, PNG</p>
      </div>
    </div>
  );
};

export default ValveScanner;
