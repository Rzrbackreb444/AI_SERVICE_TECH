import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { 
  TrendingUp, TrendingDown, MapPin, Users, DollarSign, 
  Activity, Zap, Brain, Target, Globe, Clock, Bell,
  BarChart3, PieChart, LineChart, Map, Layers, Sparkles,
  Eye, AlertTriangle, CheckCircle, Radio, Cpu
} from 'lucide-react';

const RealTimeMarketIntelligence = () => {
  const [marketData, setMarketData] = useState({
    totalMarketValue: 847000000,
    activeListings: 1247,
    avgDaysOnMarket: 67,
    priceChangePercent: 2.4,
    demandIndex: 78,
    competitionLevel: 'MODERATE',
    marketTrend: 'BULLISH'
  });

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'opportunity',
      title: 'New Market Gap Identified',
      message: 'Low competition zone detected in Northwest Little Rock',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      priority: 'high'
    },
    {
      id: 2,
      type: 'competition',
      title: 'Competitor Price Drop',
      message: 'Wash & Dry Express reduced pricing by 12%',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      priority: 'medium'
    },
    {
      id: 3,
      type: 'market',
      title: 'Demand Surge Predicted',
      message: 'AI forecasts 15% demand increase next quarter',
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      priority: 'high'
    }
  ]);

  const [performanceMetrics, setPerformanceMetrics] = useState({
    roi: 24.8,
    paybackPeriod: 3.2,
    cashFlow: 8400,
    occupancyRate: 78,
    customerSatisfaction: 4.3,
    marketShare: 12.5
  });

  const [realTimeEvents, setRealTimeEvents] = useState([]);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prev => ({
        ...prev,
        demandIndex: Math.max(0, Math.min(100, prev.demandIndex + (Math.random() - 0.5) * 5)),
        priceChangePercent: prev.priceChangePercent + (Math.random() - 0.5) * 0.5,
        avgDaysOnMarket: Math.max(30, prev.avgDaysOnMarket + Math.floor((Math.random() - 0.5) * 3))
      }));

      // Add real-time events
      if (Math.random() < 0.3) {
        const events = [
          'New listing added in target area',
          'Competitor analysis updated',
          'Market trend shift detected',
          'Price optimization opportunity',
          'Demand spike in South region'
        ];
        
        setRealTimeEvents(prev => [
          {
            id: Date.now(),
            message: events[Math.floor(Math.random() * events.length)],
            timestamp: new Date(),
            type: Math.random() > 0.5 ? 'positive' : 'neutral'
          },
          ...prev.slice(0, 4)
        ]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'opportunity': return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'competition': return <Target className="h-4 w-4 text-orange-400" />;
      case 'market': return <BarChart3 className="h-4 w-4 text-blue-400" />;
      default: return <Bell className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-500/10';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10';
      case 'low': return 'border-blue-500 bg-blue-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <Radio className="h-8 w-8 text-purple-400 animate-pulse" />
              Real-Time Market Intelligence
              <Badge variant="secondary" className="ml-2 bg-green-500/20 text-green-200">
                LIVE
              </Badge>
            </h1>
            <p className="text-slate-300 mt-2">Advanced market monitoring and competitive intelligence</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
              <span className="text-green-300 text-sm">Live Data</span>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Market Value</p>
                    <p className="text-2xl font-bold text-white">
                      {formatCurrency(marketData.totalMarketValue)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-400" />
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 text-sm">+{marketData.priceChangePercent.toFixed(1)}%</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Active Listings</p>
                    <p className="text-2xl font-bold text-white">{marketData.activeListings.toLocaleString()}</p>
                  </div>
                  <MapPin className="h-8 w-8 text-blue-400" />
                </div>
                <div className="mt-2">
                  <span className="text-slate-400 text-sm">{marketData.avgDaysOnMarket} days avg on market</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Demand Index</p>
                    <p className="text-2xl font-bold text-white">{Math.round(marketData.demandIndex)}</p>
                  </div>
                  <Activity className="h-8 w-8 text-purple-400" />
                </div>
                <div className="mt-2">
                  <Progress value={marketData.demandIndex} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Competition</p>
                    <p className="text-2xl font-bold text-white">{marketData.competitionLevel}</p>
                  </div>
                  <Target className="h-8 w-8 text-orange-400" />
                </div>
                <div className="mt-2">
                  <Badge variant="outline" className="border-orange-500 text-orange-400">
                    {marketData.marketTrend}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Real-time Alerts */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bell className="h-5 w-5 text-purple-400" />
                  Market Alerts
                  <Badge variant="secondary" className="ml-2 bg-red-500/20 text-red-200">
                    {alerts.length} Active
                  </Badge>
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Real-time notifications about market opportunities and threats
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <AnimatePresence>
                  {alerts.map((alert) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Alert className={`${getPriorityColor(alert.priority)} border-l-4`}>
                        <div className="flex items-start gap-3">
                          {getAlertIcon(alert.type)}
                          <div className="flex-1">
                            <h4 className="font-semibold text-white mb-1">{alert.title}</h4>
                            <AlertDescription className="text-slate-300">
                              {alert.message}
                            </AlertDescription>
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-xs text-slate-400">
                                {formatTimeAgo(alert.timestamp)}
                              </span>
                              <div className="flex gap-2">
                                <Button size="sm" variant="ghost" className="text-xs">
                                  View Details
                                </Button>
                                <Button size="sm" variant="ghost" className="text-xs">
                                  Dismiss
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Alert>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm mt-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                  Performance Dashboard
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Key performance indicators and business metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">{performanceMetrics.roi}%</div>
                    <div className="text-sm text-slate-400">ROI</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">{performanceMetrics.paybackPeriod}</div>
                    <div className="text-sm text-slate-400">Years Payback</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">{formatCurrency(performanceMetrics.cashFlow)}</div>
                    <div className="text-sm text-slate-400">Monthly Cash Flow</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-400">{performanceMetrics.occupancyRate}%</div>
                    <div className="text-sm text-slate-400">Occupancy Rate</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-400">{performanceMetrics.customerSatisfaction}</div>
                    <div className="text-sm text-slate-400">Customer Rating</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-cyan-400">{performanceMetrics.marketShare}%</div>
                    <div className="text-sm text-slate-400">Market Share</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Real-time Events & Intelligence */}
          <div className="space-y-6">
            {/* Live Events Feed */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-400 animate-pulse" />
                  Live Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <AnimatePresence>
                  {realTimeEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg"
                    >
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        event.type === 'positive' ? 'bg-green-400' : 'bg-blue-400'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-300">{event.message}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {formatTimeAgo(event.timestamp)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {realTimeEvents.length === 0 && (
                  <div className="text-center py-4">
                    <div className="text-slate-500 text-sm">Monitoring market activity...</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Intelligence Summary */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Brain className="h-4 w-4 text-purple-400" />
                  AI Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Alert className="border-purple-500/50 bg-purple-500/10">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <AlertDescription className="text-purple-200 text-sm">
                    Market conditions are 73% favorable for new investments
                  </AlertDescription>
                </Alert>
                <Alert className="border-green-500/50 bg-green-500/10">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <AlertDescription className="text-green-200 text-sm">
                    Identified 3 high-potential locations within budget
                  </AlertDescription>
                </Alert>
                <Alert className="border-orange-500/50 bg-orange-500/10">
                  <AlertTriangle className="h-4 w-4 text-orange-400" />
                  <AlertDescription className="text-orange-200 text-sm">
                    Increased competition expected in Q2 2025
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-blue-400" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm">API Status</span>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                    Operational
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm">Data Freshness</span>
                  <span className="text-blue-400 text-sm font-semibold">2 min ago</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm">Processing Speed</span>
                  <span className="text-purple-400 text-sm font-semibold">1.8s avg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm">Accuracy</span>
                  <span className="text-yellow-400 text-sm font-semibold">96.3%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RealTimeMarketIntelligence;