import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, Check, Loader, Ruler, Box, BookOpen, Hash } from 'lucide-react';

// Error Boundary Component
const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error) => {
      console.error('Error caught by boundary:', error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        Something went wrong. Please try again.
      </div>
    );
  }

  return children;
};

// Analysis Results Component
const AnalysisResults = ({ results }) => {
  useEffect(() => {
    console.log('AnalysisResults rendered with:', results);
  }, [results]);

  if (!results) {
    console.log('No results provided to AnalysisResults');
    return null;
  }

  return (
    <div className="space-y-6 mt-4 p-4 bg-white rounded-lg border border-gray-200">
      {/* Confidence Score */}
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-gray-800">Analysis Results</span>
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            results.confidence >= 90 ? 'bg-green-100 text-green-800' :
            results.confidence >= 70 ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {results.confidence}% Match
          </div>
        </div>
      </div>

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

      {/* Detailed Specifications */}
      {results.specifications && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Technical Specifications</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {Object.entries(results.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-600">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Features */}
      {results.features && results.features.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Additional Features</h3>
          <div className="flex flex-wrap gap-2">
            {results.features.map((feature, index) => (
              <span key={index} className="px-3 py-1 bg-white rounded-full text-sm text-gray-600 border">
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
          <span>Download Specifications</span>
        </button>
        <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

const ValveScanner = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [analysisStatus, setAnalysisStatus] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Simplified analysis function
  const performAnalysis = async () => {
    const results = {
      size: '3/4" (DN20)',
      material: 'Brass with Chrome Plating',
      brand: 'Bluefin Industrial',
      partNumber: 'BF-7520-C34',
      confidence: 92,
      specifications: {
        pressureRating: '600 WOG',
        temperature: '-20°F to 400°F',
        connection: 'Threaded NPT',
        stemType: 'Blowout Proof'
      },
      features: [
        'Lead-Free',
        'Full Port',
        'Bi-Directional',
        'Anti-Static',
        'Fire Safe Design'
      ]
    };

    return results;
  };

  const handleImage = async (file) => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        setCapturedImage(e.target?.result);
        setAnalysisStatus('Analyzing...');
        
        try {
          // Short delay to ensure UI updates
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const results = await performAnalysis();
          setAnalysisResults(results);
        } catch (analysisError) {
          setError('Failed to analyze valve. Please try again.');
          setAnalysisResults(null);
        } finally {
          setIsLoading(false);
          setAnalysisStatus('');
        }
      };

      reader.readAsDataURL(file);
    } catch (err) {
      setError('Error processing image. Please try again.');
      setCapturedImage(null);
      setAnalysisResults(null);
      setIsLoading(false);
    }
  };

  // Rest of your component code ...

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-lg mx-auto">
      {/* ... header ... */}
      
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
              Analyzing valve...
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

        {/* ... tips section ... */}
      </div>
    </div>
  );
};
