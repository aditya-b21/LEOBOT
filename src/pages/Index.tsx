
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Search, Sparkles, Zap, Target, Activity } from 'lucide-react';
import StockCard from '@/components/StockCard';
import StockSearch from '@/components/StockSearch';
import { Card, CardContent } from '@/components/ui/card';

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string;
  sector: string;
  logo: string;
  volume: number;
  pe: number;
  high: number;
  low: number;
}

const Index = () => {
  const [trendingStocks, setTrendingStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchAdvancedMarketData = async () => {
    try {
      setLoading(true);
      console.log('Fetching advanced market data...');
      
      const trendingSymbols = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'HINDUNILVR', 'ICICIBANK', 'SBIN', 'BHARTIARTL'];
      
      const stocksResponse = await fetch(`https://izirckivyriecdrmfgsk.supabase.co/functions/v1/enhanced-analysis`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6aXJja2l2eXJpZWNkcm1mZ3NrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMTY0OTIsImV4cCI6MjA3MTc5MjQ5Mn0.z7LEFsuorfD0wxUHXKV_hQB_tLAlSXL8bAYShdGa0nY`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'fetchMultipleStocks',
          symbols: trendingSymbols
        }),
      });

      if (stocksResponse.ok) {
        const stocksData = await stocksResponse.json();
        console.log('Advanced stocks data:', stocksData);
        if (stocksData.stocks && Array.isArray(stocksData.stocks)) {
          setTrendingStocks(stocksData.stocks);
        }
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch advanced market data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvancedMarketData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchAdvancedMarketData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Enhanced Header */}
      <motion.div 
        className="relative overflow-hidden border-b border-white/10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20" />
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
        </div>
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="flex flex-col items-center gap-16">
            {/* Title Section */}
            <div className="text-center max-w-6xl">
              <motion.h1 
                className="text-7xl lg:text-8xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-10"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                LEO THE AI BOT BY SWING-LEOFY
              </motion.h1>
              <motion.p 
                className="text-2xl text-gray-300 max-w-5xl mx-auto mb-12 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Advanced AI-powered stock analysis platform with real-time NSE/BSE data and intelligent market insights
              </motion.p>
              
              {/* Live Status */}
              <motion.div
                className="flex items-center justify-center gap-4 mb-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
                  <span className="text-lg text-gray-300 font-medium">
                    Live Market Data • Updated: {lastUpdated.toLocaleTimeString()}
                  </span>
                </div>
              </motion.div>
            </div>
            
            {/* Enhanced Search Section with increased spacing */}
            <motion.div 
              className="w-full max-w-4xl relative z-50 mb-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-slate-800/60 backdrop-blur-2xl rounded-3xl p-10 shadow-2xl border border-slate-700/50">
                <div className="flex items-center gap-6 mb-8">
                  <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-lg">
                    <Search className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">Intelligent Stock Search</h3>
                    <p className="text-gray-400 text-lg">Search and analyze stocks with AI-powered insights</p>
                  </div>
                </div>
                <div className="relative z-50">
                  <StockSearch />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Features Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="container mx-auto px-4 py-16"
      >
        <Card className="bg-gradient-to-r from-slate-800/60 via-purple-900/40 to-slate-800/60 border-purple-500/30 overflow-hidden backdrop-blur-sm">
          <CardContent className="p-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="flex items-center gap-8">
                <motion.div 
                  className="p-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl shadow-lg"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-20 w-20 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-4xl font-bold text-white mb-4">Advanced Intelligence Platform</h3>
                  <p className="text-gray-300 text-xl leading-relaxed max-w-2xl">
                    Real-time NSE/BSE data integration with AI-powered market analysis and intelligent trading insights
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-8">
                <motion.div 
                  className="flex items-center gap-4 bg-slate-700/50 backdrop-blur-sm px-8 py-4 rounded-full border border-slate-600/50 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <Target className="h-6 w-6 text-green-400" />
                  <span className="font-semibold text-white text-lg">Live NSE/BSE</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-4 bg-slate-700/50 backdrop-blur-sm px-8 py-4 rounded-full border border-slate-600/50 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <Zap className="h-6 w-6 text-blue-400" />
                  <span className="font-semibold text-white text-lg">AI Analytics</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-4 bg-slate-700/50 backdrop-blur-sm px-8 py-4 rounded-full border border-slate-600/50 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <Activity className="h-6 w-6 text-orange-400" />
                  <span className="font-semibold text-white text-lg">Real-time Insights</span>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Market Movers Section */}
      <div className="container mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-8">
              <div className="p-6 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl shadow-lg">
                <TrendingUp className="h-12 w-12 text-white" />
              </div>
              <div>
                <h2 className="text-5xl font-bold text-white mb-2">Live Market Movers</h2>
                <p className="text-gray-400 text-xl">Real-time stock prices with comprehensive market data</p>
              </div>
            </div>
            {loading && (
              <div className="flex items-center gap-4 bg-slate-700/50 backdrop-blur-sm px-8 py-4 rounded-full border border-slate-600/50 shadow-lg">
                <motion.div 
                  className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span className="text-white font-medium text-lg">Loading market data...</span>
              </div>
            )}
          </div>

          <AnimatePresence mode="popLayout">
            {trendingStocks.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                layout
              >
                {trendingStocks.map((stock, index) => (
                  <motion.div
                    key={stock.symbol}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    layout
                  >
                    <StockCard stock={stock} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24"
              >
                <motion.div
                  className="w-24 h-24 border-4 border-white/20 border-t-white rounded-full mx-auto mb-10"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <h3 className="text-3xl font-semibold text-white mb-4">Loading Market Intelligence</h3>
                <p className="text-gray-400 text-xl">Fetching real-time stock data and comprehensive market analytics...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
