// pages/index.js

import React, { useState } from 'react';
import { Camera, Upload, X, Search, Clock } from 'lucide-react';
import Link from 'next/link';
import ValveScanner from '../components/ValveScanner';

export default function Home() {
  const [isScanning, setIsScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const categories = [
    {
      title: "Control Valves",
      titleColor: "text-blue-700",
      items: [
        {
          name: "1\" B2 Series, 2-Way Characterized Control",
          spec: "ASTM A126-04 | Bluefin",
          image: "/api/placeholder/400/400"
        },
        {
          name: "1/2\" B3 Series, 3-Way Characterized Control",
          spec: "ASTM A126-04 | Bluefin",
          image: "/api/placeholder/400/400"
        }
      ],
      total: 12
    },
    {
      title: "Isolation Valves",
      titleColor: "text-blue-700",
      items: [
        {
          name: "3/4\" Press Full Port Brass Ball Valve",
          spec: "ASTM A126-04 | Bluefin",
          image: "/api/placeholder/400/400"
        },
        {
          name: "3/4\" Expansion PEX Isolator Ball Valve",
          spec: "ASTM A126-04 | Bluefin",
          image: "/api/placeholder/400/400"
        }
      ],
      total: 12
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#1e3a5c] p-6 pb-12 rounded-b-3xl shadow-lg">
        <div className="max-w-4xl mx-auto">
          {/* Navigation Bar */}
          <nav className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white">GLANCE</h1>
            <div className="flex items-center gap-4">
              <Link 
                href="/search"
                className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
              >
                <Search size={20} />
                <span className="hidden sm:inline">Search Valves</span>
              </Link>
              <button
                onClick={() => setIsScanning(true)}
                className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
              >
                <Camera size={20} />
                <span className="hidden sm:inline">Scan Valve</span>
              </button>
              <Clock className="text-white" size={24} />
            </div>
          </nav>
          
          {/* Search Bar */}
          <div className="relative">
            <Link href="/search" className="w-full block">
              <input
                type="search"
                placeholder="Search valves..."
                className="w-full p-4 pl-12 pr-12 rounded-full bg-white shadow-md text-lg cursor-pointer"
                readOnly
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
              <Camera className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
            </Link>
          </div>
        </div>
      </div>

      {/* Scanner Modal */}
      {isScanning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <ValveScanner onClose={() => setIsScanning(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-6">
        {categories.map((category, index) => (
          <div key={index} className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-bold ${category.titleColor}`}>
                {category.title}
              </h2>
              <a href="#" className="text-black underline font-medium">
                See all({category.total})
              </a>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {category.items.map((item, itemIndex) => (
                <div 
                  key={itemIndex} 
                  className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-w-16 aspect-h-9 mb-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-contain rounded-lg"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="font-medium text-lg mb-2 leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {item.spec}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-12 py-6 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center text-gray-600">
          <p>© 2024 GLANCE - AI Valve Identification System</p>
        </div>
      </footer>
    </div>
  );
}
