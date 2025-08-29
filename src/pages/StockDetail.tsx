import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3, Building, DollarSign, Users, PieChart, Calculator, FileText, Target, Sparkles, Activity, Globe, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import EnhancedChatAnalysis from '@/components/EnhancedChatAnalysis';

interface StockInfo {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string;
  pe: number;
  logo: string;
  sector?: string;
  exchange?: string;
  volume?: number;
  high?: number;
  low?: number;
  open?: number;
  previousClose?: number;
}

const StockDetail = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const [stockInfo, setStockInfo] = useState<StockInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeAnalysis, setActiveAnalysis] = useState<string | null>(null);

  const analysisButtons = [
    { id: 'overview', label: 'Business Overview', icon: Building, color: 'from-blue-500 to-blue-600', description: 'Complete business model analysis' },
    { id: 'fundamentals', label: 'Fundamental Analysis', icon: BarChart3, color: 'from-green-500 to-green-600', description: 'Key ratios & valuation metrics' },
    { id: 'financials', label: 'Financial Health', icon: DollarSign, color: 'from-yellow-500 to-yellow-600', description: 'Revenue, profits & cash flow' },
    { id: 'balance-sheet', label: 'Balance Sheet', icon: Calculator, color: 'from-purple-500 to-purple-600', description: 'Assets, liabilities & equity' },
    { id: 'cashflow', label: 'Cash Flow Analysis', icon: TrendingUp, color: 'from-emerald-500 to-emerald-600', description: 'Operating & free cash flows' },
    { id: 'pnl', label: 'Profit & Loss', icon: FileText, color: 'from-red-500 to-red-600', description: 'Income statement deep dive' },
    { id: 'management', label: 'Management Quality', icon: Users, color: 'from-indigo-500 to-indigo-600', description: 'Leadership & governance' },
    { id: 'shareholding', label: 'Shareholding Pattern', icon: PieChart, color: 'from-pink-500 to-pink-600', description: 'Ownership structure analysis' },
    { id: 'quarterly', label: 'Quarterly Results', icon: Activity, color: 'from-orange-500 to-orange-600', description: 'Latest quarterly performance' },
    { id: 'competitors', label: 'Competitive Analysis', icon: Target, color: 'from-cyan-500 to-cyan-600', description: 'Peer comparison & positioning' }
  ];

  useEffect(() => {
    const fetchStockInfo = async () => {
      if (!symbol) return;
      
      try {
        setLoading(true);
        console.log('Fetching real stock data for:', symbol);
        
        // Fetch real stock data from our enhanced analysis endpoint
        const response = await fetch(`https://izirckivyriecdrmfgsk.supabase.co/functions/v1/enhanced-analysis`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6aXJja2l2eXJpZWNkcm1mZ3NrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMTY0OTIsImV4cCI6MjA3MTc5MjQ5Mn0.z7LEFsuorfD0wxUHXKV_hQB_tLAlSXL8bAYShdGa0nY`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'fetchSingleStock',
            symbol: symbol.replace('.NS', '').replace('.BO', '')
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Real stock data received:', data);
          
          if (data.stock) {
            const stock = data.stock;
            const stockData: StockInfo = {
              symbol: stock.symbol || symbol,
              name: stock.name || stock.longName || 'Unknown Company',
              price: stock.price || stock.regularMarketPrice || 0,
              change: stock.change || (stock.regularMarketChange || 0),
              changePercent: stock.changePercent || (stock.regularMarketChangePercent || 0),
              marketCap: stock.marketCap || 'N/A',
              pe: stock.pe || stock.trailingPE || 0,
              logo: stock.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent((stock.name || 'Company').split(' ')[0])}&background=6366f1&color=fff&size=80`,
              sector: stock.sector || stock.sectorDisp || 'Unknown',
              exchange: symbol?.includes('.NS') ? 'NSE' : symbol?.includes('.BO') ? 'BSE' : (stock.exchange || 'Unknown'),
              volume: stock.volume || stock.regularMarketVolume || 0,
              high: stock.high || stock.dayHigh || stock.regularMarketDayHigh || 0,
              low: stock.low || stock.dayLow || stock.regularMarketDayLow || 0,
              open: stock.open || stock.regularMarketOpen || 0,
              previousClose: stock.previousClose || stock.regularMarketPreviousClose || 0
            };
            
            setStockInfo(stockData);
          } else {
            // Fallback if no stock data
            setStockInfo(null);
          }
        } else {
          console.error('Failed to fetch stock data:', response.status);
          setStockInfo(null);
        }
      } catch (error) {
        console.error('Failed to fetch stock info:', error);
        setStockInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStockInfo();
  }, [symbol]);

  const handleAnalysisClick = (analysisId: string) => {
    setActiveAnalysis(analysisId);
    // Smooth scroll to chat analysis
    setTimeout(() => {
      const chatElement = document.getElementById('chat-analysis');
      if (chatElement) {
        chatElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="flex space-x-2 justify-center mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-4 h-4 bg-primary rounded-full"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </motion.div>
          <motion.p 
            className="text-muted-foreground text-lg"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading real-time stock data...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (!stockInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold mb-4">Stock Not Found</h2>
          <p className="text-muted-foreground mb-6">The requested stock symbol could not be found or data is currently unavailable.</p>
          <Button onClick={() => navigate('/')} className="btn-financial">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  const isPositive = stockInfo.change >= 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Animated Background */}
      <div className="hero-pattern fixed inset-0 z-0 opacity-5" />
      <motion.div
        className="fixed inset-0 z-0"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.03) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(99, 102, 241, 0.03) 0%, transparent 50%)',
            'radial-gradient(circle at 40% 80%, rgba(99, 102, 241, 0.03) 0%, transparent 50%)'
          ]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
      
      <div className="relative z-10 p-4 max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-6 hover:bg-secondary/50 transition-all duration-300 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Stock Explorer
          </Button>
        </motion.div>

        {/* Enhanced Stock Info Card with Real Data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="financial-card mb-8 overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center space-x-6">
                  <motion.div 
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <img 
                      src={stockInfo.logo} 
                      alt={stockInfo.name}
                      className="w-20 h-20 rounded-2xl object-cover bg-secondary border-2 border-border/50 shadow-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(stockInfo.name.split(' ')[0])}&background=6366f1&color=fff&size=80`;
                      }}
                    />
                    <motion.div
                      className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Globe className="h-3 w-3 text-white" />
                    </motion.div>
                  </motion.div>
                  <div>
                    <motion.h1 
                      className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {stockInfo.name}
                    </motion.h1>
                    <div className="flex items-center space-x-4 text-lg text-muted-foreground">
                      <span className="font-mono">{stockInfo.symbol}</span>
                      <span>•</span>
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        {stockInfo.exchange}
                      </span>
                      {stockInfo.sector && stockInfo.sector !== 'Unknown' && (
                        <>
                          <span>•</span>
                          <span className="text-secondary-foreground">{stockInfo.sector}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-8 w-8 text-primary/30" />
                </motion.div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="space-y-2"
                >
                  <p className="text-sm text-muted-foreground font-medium">Current Price</p>
                  <p className="text-4xl font-bold font-mono">₹{stockInfo.price.toFixed(2)}</p>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="space-y-2"
                >
                  <p className="text-sm text-muted-foreground font-medium">Change</p>
                  <div className={`flex items-center space-x-2 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    <motion.div
                      animate={{ y: isPositive ? [-2, 0, -2] : [2, 0, 2] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {isPositive ? (
                        <TrendingUp className="h-6 w-6" />
                      ) : (
                        <TrendingDown className="h-6 w-6" />
                      )}
                    </motion.div>
                    <div className="text-2xl font-bold font-mono">
                      {isPositive ? '+' : ''}₹{stockInfo.change.toFixed(2)}
                      <span className="text-lg ml-2">
                        ({isPositive ? '+' : ''}{stockInfo.changePercent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="space-y-2"
                >
                  <p className="text-sm text-muted-foreground font-medium">Market Cap</p>
                  <p className="text-2xl font-bold">{stockInfo.marketCap}</p>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="space-y-2"
                >
                  <p className="text-sm text-muted-foreground font-medium">P/E Ratio</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold">{stockInfo.pe > 0 ? stockInfo.pe.toFixed(2) : 'N/A'}</p>
                    {stockInfo.pe > 0 && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        stockInfo.pe < 18 ? 'bg-green-100 text-green-700' :
                        stockInfo.pe < 25 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {stockInfo.pe < 18 ? 'Undervalued' : stockInfo.pe < 25 ? 'Fair' : 'Overvalued'}
                      </span>
                    )}
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Analysis Buttons */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="financial-card">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Bot className="h-8 w-8 text-primary" />
                </motion.div>
                <div>
                  <CardTitle className="text-3xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    SWING-LEO AI Analysis Options
                  </CardTitle>
                  <p className="text-muted-foreground text-lg">
                    Choose an analysis type to get comprehensive AI-powered insights about {stockInfo.name}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {analysisButtons.map((analysis, index) => (
                  <motion.div
                    key={analysis.id}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="group relative overflow-hidden"
                    >
                      <Button
                        variant="outline"
                        onClick={() => handleAnalysisClick(analysis.id)}
                        className={`w-full h-auto p-6 text-left justify-start border-2 transition-all duration-300 ${
                          activeAnalysis === analysis.id
                            ? 'border-primary bg-primary/5 shadow-lg'
                            : 'border-border/50 hover:border-primary/50 hover:bg-secondary/50'
                        }`}
                        disabled={activeAnalysis === analysis.id}
                      >
                        <div className="flex items-start space-x-4 w-full">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${analysis.color} text-white shadow-lg group-hover:shadow-xl transition-shadow`}>
                            <analysis.icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors">
                              {analysis.label}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {analysis.description}
                            </p>
                          </div>
                        </div>
                        
                        {/* Animated border */}
                        <motion.div
                          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-secondary"
                          initial={{ width: 0 }}
                          whileHover={{ width: "100%" }}
                          transition={{ duration: 0.3 }}
                        />
                      </Button>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Chat Analysis */}
        <AnimatePresence mode="wait">
          {activeAnalysis && (
            <motion.div
              id="chat-analysis"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            >
              <EnhancedChatAnalysis 
                stockInfo={stockInfo}
                analysisType={activeAnalysis}
                onClose={() => setActiveAnalysis(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StockDetail;
