
import { useState, useRef, useEffect } from 'react';
import { Search, TrendingUp, Building2, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
  symbol: string;
  name: string;
  type: string;
  region: string;
  exchange: string;
  sector?: string;
  logo?: string;
}

const StockSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchStocks = async (searchQuery: string) => {
    if (searchQuery.length < 1) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://izirckivyriecdrmfgsk.supabase.co/functions/v1/search-stocks?q=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6aXJja2l2eXJpZWNkcm1mZ3NrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMTY0OTIsImV4cCI6MjA3MTc5MjQ5Mn0.z7LEFsuorfD0wxUHXKV_hQB_tLAlSXL8bAYShdGa0nY`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setResults(data.quotes || []);
        setShowResults(true);
        setSelectedIndex(-1);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      searchStocks(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleResultClick(results[selectedIndex]);
      } else if (results.length > 0) {
        handleResultClick(results[0]);
      }
    } else if (e.key === 'Escape') {
      setShowResults(false);
      setSelectedIndex(-1);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    navigate(`/stock/${result.symbol}`, { 
      state: { 
        stockInfo: {
          symbol: result.symbol,
          name: result.name,
          sector: result.sector,
          exchange: result.exchange,
          region: result.region,
          logo: result.logo
        }
      }
    });
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 h-6 w-6" />
        <Input
          type="text"
          placeholder="Search stocks, companies, or symbols..."
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setShowResults(true)}
          className="w-full pl-12 pr-4 py-4 text-lg bg-slate-800/80 border-slate-600/50 text-white placeholder:text-white/60 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm shadow-xl"
        />
        {isLoading && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <motion.div
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        )}
      </div>

      <AnimatePresence>
        {showResults && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-xl border border-slate-600/50 rounded-2xl shadow-2xl z-50 max-h-96 overflow-y-auto"
          >
            <div className="p-2">
              {results.map((result, index) => (
                <motion.div
                  key={`${result.symbol}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleResultClick(result)}
                  className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                    index === selectedIndex
                      ? 'bg-purple-600/30 border border-purple-500/50'
                      : 'hover:bg-slate-700/50'
                  }`}
                >
                  <div className="relative">
                    {result.logo ? (
                      <img
                        src={result.logo}
                        alt={result.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-600/50"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(result.name.charAt(0))}&background=6366f1&color=fff&size=48&bold=true`;
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {result.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-slate-800 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-3 h-3 text-green-400" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-white text-lg truncate">
                        {result.symbol}
                      </h3>
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-lg">
                        {result.exchange}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm truncate font-medium">
                      {result.name}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      {result.sector && (
                        <div className="flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          <span>{result.sector}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{result.region}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showResults && results.length === 0 && !isLoading && query && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-xl border border-slate-600/50 rounded-2xl shadow-2xl z-50 p-6"
        >
          <div className="text-center">
            <Search className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 text-lg font-medium">No stocks found</p>
            <p className="text-gray-500 text-sm mt-1">Try searching with different keywords</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StockSearch;
