import React, { useState, useRef } from 'react';
import { Camera, Upload, Search, X } from 'lucide-react';

const ValveScanner = ({ onClose }) => {
  const [scanMode, setScanMode] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      setScanMode(true);
    } catch (err) {
      setError('Unable to access camera. Please try uploading an image instead.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setScanMode(false);
  };

  const captureImage = async () => {
    try {
      setLoading(true);
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');
      await processImage(imageData);
    } catch (err) {
      setError('Failed to capture image. Please try again.');
    } finally {
      setLoading(false);
      stopCamera();
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        setLoading(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
          await processImage(reader.result);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setError('Failed to process image. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const processImage = async (imageData) => {
    try {
      // Here we would integrate with your AI model API
      console.log('Processing image...');
      // Simulated API call - replace with actual API endpoint
      /*
      const response = await fetch('/api/analyze-valve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      });

      const data = await response.json();
      setResults(data.matches);
      */
      
      // Simulated results for testing
      setResults([
        {
          name: "1\" B2 Series, 2-Way Control Valve",
          spec: "ASTM A126-04 | Bluefin",
          image: "/api/placeholder/400/400",
          matchScore: 95
        },
        {
          name: "1\" B3 Series, Similar Control Valve",
          spec: "ASTM A126-04 | Bluefin",
          image: "/api/placeholder/400/400",
          matchScore: 85
        }
      ]);
    } catch (err) {
      setError('Failed to analyze valve. Please try again.');
    }
  };

  return (
    <div className="relative bg-white rounded-lg p-6">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <X size={24} />
      </button>

      <h2 className="text-xl font-bold mb-6">Scan Valve</h2>

      {!scanMode && !results && (
        <div className="flex gap-4 justify-center mb-6">
          <button
            onClick={startCamera}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Camera size={20} />
            Take Photo
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            <Upload size={20} />
            Upload Image
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
          />
        </div>
      )}

      {scanMode && (
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg"
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
            <button
              onClick={captureImage}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Capture
            </button>
            <button
              onClick={stopCamera}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4">Analyzing valve...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <p>{error}</p>
          <button
            onClick={() => setError(null)}
            className="absolute top-2 right-2"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {results && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Similar Valves Found</h3>
          <div className="grid grid-cols-2 gap-4">
            {results.map((valve, index) => (
              <div key={index} className="border rounded-lg p-4">
                <img src={valve.image} alt={valve.name} className="w-full h-48 object-contain mb-4" />
                <h4 className="font-medium">{valve.name}</h4>
                <p className="text-sm text-gray-600">{valve.spec}</p>
                <div className="mt-2 text-sm">
                  <span className="font-medium">Match Score: </span>
                  {valve.matchScore}%
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              setResults(null);
              setError(null);
            }}
            className="mt-4 w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            Scan Another Valve
          </button>
        </div>
      )}
    </div>
  );
};

export default ValveScanner;
