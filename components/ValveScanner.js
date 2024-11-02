import React, { useState, useRef, useCallback } from 'react';
import { Camera, Upload, X, Ruler, Box, BookOpen, Hash, Loader } from 'lucide-react';

const FeatureTag = ({ feature }) => (
  <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-600 border">{feature}</span>
);

const InfoBlock = ({ icon: Icon, title, value, subtext, color }) => (
  <div className={`p-4 bg-${color}-50 rounded-lg border border-${color}-100`}>
    <div className="flex items-center gap-2 mb-3">
      <Icon className={`text-${color}-600`} size={20} />
      <span className={`font-semibold text-${color}-900`}>{title}</span>
    </div>
    <div className="space-y-2">
      <p className={`text-${color}-800 text-lg font-medium`}>{value}</p>
      <p className={`text-sm text-${color}-600`}>{subtext}</p>
    </div>
  </div>
);

const AnalysisResults = ({ results, loading }) => (
  <div className="space-y-6 mt-4 p-4 bg-white rounded-lg border border-gray-200">
    {loading ? (
      <Loader className="mx-auto text-blue-600 animate-spin" size={24} />
    ) : results ? (
      <>
        <div className="grid grid-cols-2 gap-4">
          <InfoBlock icon={Ruler} title="Size" value={results.size} subtext="Nominal Diameter" color="blue" />
          <InfoBlock icon={Box} title="Material" value={results.material} subtext="Body Material" color="green" />
          <InfoBlock icon={BookOpen} title="Brand" value={results.brand} subtext="Manufacturer" color="purple" />
          <InfoBlock icon={Hash} title="Part Number" value={results.partNumber} subtext="Model ID" color="orange" />
        </div>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Additional Features</h3>
          <div className="flex flex-wrap gap-2">
            {results.features?.map((feature, index) => (
              <FeatureTag key={index} feature={feature} />
            ))}
          </div>
        </div>
      </>
    ) : (
      <p className="text-center text-gray-500">No analysis results available.</p>
    )}
  </div>
);

const Button = ({ onClick, children, color }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-center gap-2 bg-${color}-600 text-white px-4 py-3 rounded-lg hover:bg-${color}-700 transition-colors`}
  >
    {children}
  </button>
);

const ValveScanner = ({ onClose }) => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result);
        setTimeout(() => {
          setAnalysisResults({
            size: '3/4" (DN20)',
            material: 'Brass with Chrome Plating',
            brand: 'Bluefin Industrial',
            partNumber: 'BF-7520-C34',
            features: ['Lead-Free', 'Full Port', 'Bi-Directional', 'Anti-Static'],
          });
          setLoading(false);
        }, 1000); // Mock delay for processing
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  }, []);

  const takePhoto = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
  }, []);

  const chooseFromGallery = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute('capture');
      fileInputRef.current.click();
    }
  }, []);

  const resetScanner = useCallback(() => {
    setCapturedImage(null);
    setAnalysisResults(null);
  }, []);

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
                className="w-full h-64 object-cover rounded-lg border border-gray-200"
              />
              {analysisResults && <AnalysisResults results={analysisResults} loading={loading} />}
            </div>
            <Button onClick={resetScanner} color="blue">
              <Camera size={18} /> Scan Another
            </Button>
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

            <Button onClick={takePhoto} color="blue">
              <Camera size={20} /> Take Photo
            </Button>

            <Button onClick={chooseFromGallery} color="gray">
              <Upload size={20} /> Choose from Gallery
            </Button>
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
