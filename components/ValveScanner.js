// components/ValveScanner.js

import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Check, Loader, Ruler, Box, BookOpen, Hash } from 'lucide-react';

// Analysis Results Component
const AnalysisResults = ({ results }) => (
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
 </div>
);

// Main ValveScanner Component
const ValveScanner = ({ onClose }) => {
 const [isLoading, setIsLoading] = useState(false);
 const [capturedImage, setCapturedImage] = useState(null);
 const [analysisResults, setAnalysisResults] = useState(null);
 const [error, setError] = useState(null);
 const [testStatus, setTestStatus] = useState('');
 const fileInputRef = useRef(null);

 const testOpenAI = async () => {
   setTestStatus('Testing connection...');
   try {
     const response = await fetch('/api/test-openai');
     const data = await response.json();
     if (data.success) {
       setTestStatus('OpenAI connected successfully!');
     } else {
       setTestStatus('Connection failed: ' + data.error);
     }
   } catch (err) {
     setTestStatus('Error testing connection: ' + err.message);
   }
 };

 const testImageAnalysis = async (imageData) => {
   console.log('Starting analysis test...');
   try {
     const response = await fetch('/api/analyze-valve', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({ image: imageData }),
     });

     if (!response.ok) {
       throw new Error(`HTTP error! status: ${response.status}`);
     }
     
     const data = await response.json();
     console.log('Analysis result:', data);
     return data;
   } catch (error) {
     console.error('Analysis test error:', error);
     throw error;
   }
 };

 const handleImage = async (file) => {
   if (!file) return;

   setIsLoading(true);
   setError(null);
   
   try {
     const reader = new FileReader();
     reader.onload = async (e) => {
       const imageData = e.target.result;
       setCapturedImage(imageData);
       
       try {
         const results = await testImageAnalysis(imageData);
         setAnalysisResults(results);
       } catch (analysisError) {
         console.error('Analysis error:', analysisError);
         setError('Failed to analyze valve. Please try again.');
       }
     };

     reader.onerror = (error) => {
       console.error('File reading error:', error);
       setError('Error reading image file');
     };

     reader.readAsDataURL(file);
   } catch (err) {
     console.error('Image processing error:', err);
     setError('Error processing image');
   } finally {
     setIsLoading(false);
   }
 };

 const handleFileUpload = (event) => {
   const file = event.target.files?.[0];
   if (file) {
     handleImage(file);
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
   setAnalysisResults(null);
   setError(null);
   setTestStatus('');
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

       {testStatus && (
         <div className={`mb-4 p-3 rounded-lg text-sm ${
           testStatus.includes('successfully') 
             ? 'bg-green-50 text-green-700' 
             : 'bg-yellow-50 text-yellow-700'
         }`}>
           {testStatus}
         </div>
       )}

       {isLoading ? (
         <div className="text-center py-8">
           <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg">
             <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
             Analyzing valve...
           </div>
           <p className="mt-2 text-sm text-gray-600">This may take a few moments</p>
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
         <div className="flex flex-col gap-4 p-4">
           <input
             ref={fileInputRef}
             type="file"
             accept="image/*"
             className="hidden"
             onChange={handleFileUpload}
           />
           
           <button
             onClick={takePhoto}
             className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors w-full"
           >
             <Camera size={20} />
             <span>Take Photo</span>
           </button>
           
           <button
             onClick={chooseFromGallery}
             className="flex items-center justify-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors w-full"
           >
             <Upload size={20} />
             <span>Choose from Gallery</span>
           </button>

           <button
             onClick={testOpenAI}
             className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors w-full"
           >
             <span>Test OpenAI Connection</span>
           </button>

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
       )}
     </div>
   </div>
 );
};

export default ValveScanner;
