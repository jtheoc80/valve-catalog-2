// components/ValveSearch.js

import React, { useState, useEffect } from 'react';
import { Search, ExternalLink } from 'lucide-react';

const ValveSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const performSearch = async (query) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/valve-search?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError('Failed to perform search. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce search to avoid too many requests
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        performSearch(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Search Input */}
      <div className="relative mb-6">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for industrial valves..."
          className="w-full p-4 pl-12 pr-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Search Results */}
      <div className="space-y-6">
        {results.map((result, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              {result.image && (
                <img 
                  src={result.image} 
                  alt={result.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <a 
                  href={result.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-2"
                >
                  {result.title}
                  <ExternalLink size={16} />
                </a>
                <p className="text-sm text-gray-600 mt-1">{result.source}</p>
                <p className="text-gray-700 mt-2">{result.snippet}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {!isLoading && results.length === 0 && searchQuery && (
        <div className="text-center py-8 text-gray-600">
          No results found for "{searchQuery}"
        </div>
      )}
    </div>
  );
};

export default ValveSearch;
