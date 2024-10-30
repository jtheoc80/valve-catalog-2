import React, { useState, useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';

const ValveScanner = ({ onClose }) => {
  const [scanMode, setScanMode] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  return (
    <div className="relative bg-white rounded-lg p-6">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <X size={24} />
      </button>

      <h2 className="text-xl font-bold mb-6">Scan Valve</h2>

      <div className="flex gap-4 justify-center mb-6">
        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Camera size={20} />
          Take Photo
        </button>
        <button
          className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
        >
          <Upload size={20} />
          Upload Image
        </button>
      </div>
    </div>
  );
};

export default ValveScanner;
