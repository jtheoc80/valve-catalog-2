// components/SearchResults.js

import React from 'react';
import { Search, ExternalLink, Filter } from 'lucide-react';

const SearchResults = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    manufacturer: 'all',
    type: 'all',
    size: 'all'
  });

  const valveTypes = [
    'All Types',
    'Ball Valves',
    'Gate Valves',
    'Globe Valves',
    'Butterfly Valves',
    'Check Valves',
    'Control Valves'
  ];

  const manufacturers = [
    'All Manufacturers',
    'Crane',
    'Nibco',
    'Watts',
    'Apollo',
    'Milwaukee',
    'Kitz'
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/valve-search?query=${encodeURIComponent(searchQuery)}&manufacturer=${filters.manufacturer}&type=${filters.type}&size=${filters.size}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) handleSearch();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, filters]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search industrial valves..."
                className="w-full p-3 pl-10 pr-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <button
              onClick={() => document.getElementById('filterPanel').classList.toggle('hidden')}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              <Filter size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Filters Panel */}
          <div id="filterPanel" className="w-64 bg-white rounded-lg shadow p-4 hidden sm:block">
            <h3 className="font-semibold mb-4">Filters</h3>
            
            {/* Valve Type Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valve Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {valveTypes.map(type => (
                  <option key={type} value={type.toLowerCase()}>{type}</option>
                ))}
              </select>
            </div>

            {/* Manufacturer Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Manufacturer
              </label>
              <select
                value={filters.manufacturer}
                onChange={(e) => setFilters(prev => ({ ...prev, manufacturer: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {manufacturers.map(mfg => (
                  <option key={mfg} value={mfg.toLowerCase()}>{mfg}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Section */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                {error}
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div key={index} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
                    <div className="flex gap-4">
                      {result.image && (
                        <img
                          src={result.image}
                          alt={result.title}
                          className="w-32 h-32 object-contain rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        
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
                        
                        {/* Product Details */}
                        {result.details && (
                          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                            {result.details.size && (
                              <div className="text-gray-600">
                                Size: <span className="font-medium">{result.details.size}</span>
                              </div>
                            )}
                            {result.details.type && (
                              <div className="text-gray-600">
                                Type: <span className="font-medium">{result.details.type}</span>
                              </div>
                            )}
                            {result.details.material && (
                              <div className="text-gray-600">
                                Material: <span className="font-medium">{result.details.material}</span>
                              </div>
                            )}
                            {result.details.pressure && (
                              <div className="text-gray-600">
                                Pressure Rating: <span className="font-medium">{result.details.pressure}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {results.length === 0 && searchQuery && (
                  <div className="text-center py-12 text-gray-600">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
