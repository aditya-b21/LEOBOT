
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StockInfo {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string;
  pe: number;
}

interface ChatAnalysisProps {
  stockInfo: StockInfo;
  analysisType: string;
  onClose: () => void;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const ChatAnalysis = ({ stockInfo, analysisType, onClose }: ChatAnalysisProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const getAnalysisTitle = (type: string): string => {
    const titles: Record<string, string> = {
      'overview': 'Business Overview Analysis',
      'fundamentals': 'Fundamental Analysis',
      'financials': 'Financial Analysis',
      'balance-sheet': 'Balance Sheet Analysis',
      'cashflow': 'Cashflow Analysis',
      'pnl': 'Profit & Loss Analysis',
      'management': 'Management Analysis',
      'shareholding': 'Shareholding Pattern Analysis',
      'quarterly': 'Quarterly Results Analysis',
      'competitors': 'Competitive Analysis'
    };
    return titles[type] || 'Stock Analysis';
  };

  const generateAnalysis = async (type: string) => {
    setLoading(true);
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: `Analyze ${stockInfo.name} - ${getAnalysisTitle(type)}`,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock AI response - replace with actual OpenAI API call
      const mockResponse = generateMockAnalysis(type, stockInfo);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: mockResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Analysis failed:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Sorry, I encountered an error while analyzing the stock. Please try again later.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const generateMockAnalysis = (type: string, stock: StockInfo): string => {
    const analyses: Record<string, string> = {
      'overview': `**${stock.name} Business Overview Analysis**\n\n${stock.name} is a leading company in its sector with a current market capitalization of ${stock.marketCap}. The company has shown ${stock.change >= 0 ? 'positive' : 'negative'} momentum with a ${stock.changePercent.toFixed(2)}% change.\n\n**Key Business Segments:**\n- Core operations generating substantial revenue\n- Strong market presence in multiple verticals\n- Diversified business model reducing risk\n\n**Recent Performance:**\n- Current trading price: ₹${stock.price.toFixed(2)}\n- P/E Ratio: ${stock.pe.toFixed(2)} indicating ${stock.pe > 20 ? 'premium' : 'reasonable'} valuation\n- Market sentiment appears ${stock.change >= 0 ? 'bullish' : 'bearish'} in the short term\n\n**Investment Outlook:**\nBased on current fundamentals, the company shows ${stock.change >= 0 ? 'promising' : 'challenging'} prospects. Investors should consider the overall market conditions and sector trends before making investment decisions.`,
      
      'fundamentals': `**Fundamental Analysis of ${stock.name}**\n\n**Valuation Metrics:**\n- P/E Ratio: ${stock.pe.toFixed(2)}\n- Market Cap: ${stock.marketCap}\n- Current Price: ₹${stock.price.toFixed(2)}\n\n**Financial Health:**\n- The company's P/E ratio of ${stock.pe.toFixed(2)} suggests ${stock.pe > 25 ? 'high growth expectations' : stock.pe > 15 ? 'moderate valuation' : 'attractive valuation'}\n- Recent price movement of ${stock.changePercent.toFixed(2)}% indicates ${Math.abs(stock.changePercent) > 5 ? 'high volatility' : 'stable performance'}\n\n**Key Strengths:**\n- Established market position\n- Consistent operational performance\n- Strong brand recognition\n\n**Areas of Concern:**\n- Market competition\n- Regulatory changes\n- Economic headwinds\n\n**Recommendation:**\n${stock.change >= 0 && stock.pe < 25 ? 'BUY - Strong fundamentals with positive momentum' : stock.change >= 0 ? 'HOLD - Good performance but premium valuation' : 'HOLD - Monitor closely for improvement signs'}`,
      
      'financials': `**Financial Analysis of ${stock.name}**\n\n**Current Financial Position:**\n- Market Valuation: ${stock.marketCap}\n- Share Price: ₹${stock.price.toFixed(2)}\n- Recent Performance: ${stock.changePercent >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%\n\n**Revenue Analysis:**\n- The company has maintained ${stock.change >= 0 ? 'steady growth' : 'challenging conditions'} in recent quarters\n- Revenue streams appear ${stock.pe < 20 ? 'well-diversified' : 'concentrated in key segments'}\n\n**Profitability Metrics:**\n- P/E ratio of ${stock.pe.toFixed(2)} indicates ${stock.pe > 20 ? 'premium pricing' : 'reasonable valuation'}\n- Profit margins are ${stock.change >= 0 ? 'improving' : 'under pressure'}\n\n**Cash Flow Insights:**\n- Operating cash flows appear ${stock.change >= 0 ? 'strong' : 'stressed'}\n- Capital allocation strategy seems ${stock.pe < 25 ? 'conservative' : 'aggressive'}\n\n**Financial Ratios:**\n- Return on Equity: Estimated ${(15 + Math.random() * 10).toFixed(1)}%\n- Debt-to-Equity: Moderate levels\n- Current Ratio: Healthy liquidity position`,
      
      'competitors': `**Competitive Analysis for ${stock.name}**\n\n**Market Position:**\n${stock.name} operates in a ${stock.pe > 25 ? 'highly competitive' : 'moderately competitive'} industry with several key players.\n\n**Key Competitors:**\n- Established market leaders with strong financials\n- Emerging players with innovative approaches\n- International companies expanding in the region\n\n**Competitive Advantages:**\n- Strong brand recognition\n- Established distribution network\n- Cost-effective operations\n- Innovation capabilities\n\n**Market Share Analysis:**\n- The company holds a ${stock.pe > 20 ? 'significant' : 'moderate'} market share\n- Recent performance ${stock.change >= 0 ? 'outpacing' : 'lagging'} industry averages\n\n**Threats & Opportunities:**\n- **Threats:** New market entrants, pricing pressure, regulatory changes\n- **Opportunities:** Market expansion, digital transformation, strategic partnerships\n\n**Competitive Score:** ${stock.change >= 0 && stock.pe < 25 ? '8/10 - Strong position' : stock.change >= 0 ? '7/10 - Good position' : '6/10 - Average position'}`
    };
    
    return analyses[type] || `**${getAnalysisTitle(type)} for ${stock.name}**\n\nDetailed analysis based on current market data and fundamental indicators. The company shows ${stock.change >= 0 ? 'positive' : 'mixed'} signals with a current valuation of ₹${stock.price.toFixed(2)} per share.`;
  };

  useEffect(() => {
    if (analysisType) {
      generateAnalysis(analysisType);
    }
  }, [analysisType]);

  return (
    <Card className="financial-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">{getAnalysisTitle(analysisType)}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-4 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' ? 'bg-primary' : 'bg-secondary'
                }`}>
                  {message.type === 'user' ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                
                <div className={`rounded-lg p-4 ${
                  message.type === 'user' 
                    ? 'bg-primary text-primary-foreground ml-2' 
                    : 'bg-secondary mr-2'
                }`}>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                  <div className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-secondary rounded-lg p-4 mr-2">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Analyzing stock data...</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChatAnalysis;
