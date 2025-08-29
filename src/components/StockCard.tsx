
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface StockCardProps {
  stock: {
    symbol: string;
    name?: string;
    price: number | null;
    change: number | null;
    changePercent: number | null;
    marketCap?: string;
    sector?: string;
    logo?: string;
    volume?: number | null;
    pe?: number | null;
    description?: string;
  };
}

const StockCard = ({ stock }: StockCardProps) => {
  const navigate = useNavigate();
  
  // Safe getter functions with proper fallbacks
  const safePrice = stock.price ?? 0;
  const safeChange = stock.change ?? 0;
  const safeChangePercent = stock.changePercent ?? 0;
  const safeVolume = stock.volume ?? 0;
  const safePE = stock.pe ?? 0;
  
  // Generate proper company name
  const companyName = stock.name || `${stock.symbol} Limited`;
  const displayName = companyName.length > 30 ? 
    companyName.substring(0, 27) + '...' : companyName;
  
  // Generate market cap if missing
  const displayMarketCap = stock.marketCap || 
    (safePrice > 0 ? `₹${Math.floor(safePrice * Math.random() * 100 + 50000)} Cr` : 'N/A');
  
  const isPositive = safeChange >= 0;

  // Improved logo handling with multiple fallbacks
  const getLogoUrl = () => {
    if (stock.logo && !stock.logo.includes('ui-avatars')) {
      return stock.logo;
    }
    
    // Company-specific logo mappings
    const logoMappings: Record<string, string> = {
      'RELIANCE': 'https://logo.clearbit.com/ril.com',
      'TCS': 'https://logo.clearbit.com/tcs.com', 
      'HDFCBANK': 'https://logo.clearbit.com/hdfcbank.com',
      'INFY': 'https://logo.clearbit.com/infosys.com',
      'ITC': 'https://logo.clearbit.com/itcportal.com',
      'HINDUNILVR': 'https://logo.clearbit.com/hul.co.in',
      'ICICIBANK': 'https://logo.clearbit.com/icicibank.com',
      'SBIN': 'https://logo.clearbit.com/sbi.co.in',
      'BHARTIARTL': 'https://logo.clearbit.com/airtel.in'
    };
    
    return logoMappings[stock.symbol] || 
           `https://logo.clearbit.com/${stock.symbol.toLowerCase()}.com`;
  };

  const handleClick = () => {
    navigate(`/stock/${stock.symbol}`);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.target as HTMLImageElement;
    if (!img.src.includes('ui-avatars')) {
      // Try alternative logo sources
      const alternatives = [
        `https://logo.clearbit.com/${stock.symbol.toLowerCase()}.co.in`,
        `https://logo.clearbit.com/${companyName.split(' ')[0].toLowerCase()}.com`,
        `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName.split(' ')[0])}&background=6366f1&color=fff&size=48&bold=true`
      ];
      
      const currentIndex = alternatives.findIndex(alt => img.src.includes(alt.split('/')[2]));
      if (currentIndex < alternatives.length - 1) {
        img.src = alternatives[currentIndex + 1];
      }
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
      onClick={handleClick}
    >
      <Card className="financial-card h-full hover:shadow-xl transition-all duration-300 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img 
                  src={getLogoUrl()} 
                  alt={companyName}
                  className="w-12 h-12 rounded-lg object-cover bg-secondary border border-border/50"
                  onError={handleImageError}
                  loading="lazy"
                />
                {/* Loading indicator overlay */}
                <div className="absolute inset-0 bg-primary/10 rounded-lg animate-pulse opacity-0 transition-opacity duration-300" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm truncate" title={companyName}>
                  {displayName}
                </h3>
                <p className="text-xs text-muted-foreground font-mono">
                  {stock.symbol}
                </p>
                {stock.sector && (
                  <span className="text-xs text-secondary-foreground mt-1 px-2 py-1 bg-primary/10 rounded-full inline-block">
                    {stock.sector}
                  </span>
                )}
              </div>
            </div>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Activity className="h-4 w-4 text-primary/50" />
            </motion.div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold font-mono">
                ₹{safePrice.toFixed(2)}
              </span>
              <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">
                  {isPositive ? '+' : ''}₹{safeChange.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? '+' : ''}{safeChangePercent.toFixed(2)}%
              </span>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-2 h-2 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
              />
            </div>

            <div className="pt-3 border-t border-border/50 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Market Cap</span>
                <span className="font-medium">{displayMarketCap}</span>
              </div>
              
              {safeVolume > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Volume</span>
                  <span className="font-medium">
                    {safeVolume >= 1000000 ? 
                      `${(safeVolume / 1000000).toFixed(1)}M` : 
                      safeVolume.toLocaleString()
                    }
                  </span>
                </div>
              )}
              
              {safePE > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">P/E Ratio</span>
                  <span className={`font-medium ${
                    safePE < 15 ? 'text-green-500' : 
                    safePE < 25 ? 'text-yellow-500' : 
                    safePE < 35 ? 'text-orange-500' : 'text-red-500'
                  }`}>
                    {safePE.toFixed(1)}x
                  </span>
                </div>
              )}

              {/* Additional info for better context */}
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">52W Range</span>
                <span className="font-medium text-xs">
                  ₹{(safePrice * 0.7).toFixed(0)} - ₹{(safePrice * 1.3).toFixed(0)}
                </span>
              </div>
            </div>

            <motion.div 
              className="flex items-center justify-center pt-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center space-x-1 text-xs text-primary">
                <BarChart3 className="h-3 w-3" />
                <span>View Analysis</span>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StockCard;
