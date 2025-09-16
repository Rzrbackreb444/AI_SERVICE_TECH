import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Input } from './ui/input';
import { 
  Target, Eye, Users, TrendingUp, TrendingDown, MapPin, 
  DollarSign, Star, Clock, Phone, Globe, Mail, Shield,
  AlertTriangle, CheckCircle, Zap, Brain, Search, Filter,
  BarChart3, PieChart, Activity, Radar, Crosshair, Focus
} from 'lucide-react';

const CompetitiveIntelligenceHub = () => {
  const [selectedCompetitor, setSelectedCompetitor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [surveillanceMode, setSurveillanceMode] = useState(false);

  const [competitors] = useState([
    {
      id: 1,
      name: 'Wash & Go Express',
      distance: 0.8,
      rating: 3.2,
      reviews: 127,
      priceLevel: 2,
      threatLevel: 'HIGH',
      marketShare: 15.2,
      revenue: 12000,
      customers: 890,
      openHours: '6:00 AM - 11:00 PM',
      services: ['Self-Service', 'Wash & Fold', 'Dry Cleaning'],
      strengths: ['Extended Hours', 'Multiple Services'],
      weaknesses: ['Poor Reviews', 'Outdated Equipment'],
      recentChanges: [
        { type: 'price', change: 'Increased wash price to $3.50', date: '3 days ago' },
        { type: 'service', change: 'Added mobile payment', date: '1 week ago' }
      ],
      website: 'www.washgoexpress.com',
      phone: '(501) 555-0123',
      coordinates: { lat: 34.7465, lng: -92.2896 },
      lastUpdated: new Date(Date.now() - 1000 * 60 * 30)
    },
    {
      id: 2,
      name: 'Clean Machine Laundromat',
      distance: 1.2,
      rating: 4.1,
      reviews: 203,
      priceLevel: 3,
      threatLevel: 'MEDIUM',
      marketShare: 22.8,
      revenue: 18500,
      customers: 1240,
      openHours: '7:00 AM - 10:00 PM',
      services: ['Self-Service', 'Wash & Fold', 'Commercial'],
      strengths: ['Good Reviews', 'Commercial Clients'],
      weaknesses: ['Higher Prices', 'Limited Parking'],
      recentChanges: [
        { type: 'upgrade', change: 'Installed new Speed Queen washers', date: '2 weeks ago' },
        { type: 'marketing', change: 'Started loyalty program', date: '1 month ago' }
      ],
      website: 'www.cleanmachine.net',
      phone: '(501) 555-0456',
      coordinates: { lat: 34.7521, lng: -92.2751 },
      lastUpdated: new Date(Date.now() - 1000 * 60 * 45)
    },
    {
      id: 3,
      name: 'Suds City',
      distance: 2.1,
      rating: 3.8,
      reviews: 89,
      priceLevel: 2,
      threatLevel: 'LOW',
      marketShare: 8.5,
      revenue: 7200,
      customers: 520,
      openHours: '8:00 AM - 9:00 PM',
      services: ['Self-Service', 'Drop-off'],
      strengths: ['Convenient Location', 'Fair Prices'],
      weaknesses: ['Limited Services', 'Old Equipment'],
      recentChanges: [
        { type: 'issue', change: 'Customer complaints about broken dryers', date: '5 days ago' }
      ],
      website: null,
      phone: '(501) 555-0789',
      coordinates: { lat: 34.7331, lng: -92.2634 },
      lastUpdated: new Date(Date.now() - 1000 * 60 * 120)
    }
  ]);

  const [marketIntelligence] = useState({
    totalMarketSize: 156000,
    averageRevenue: 12567,
    marketGrowth: 3.2,
    customerRetention: 68,
    priceElasticity: -0.8,
    seasonalTrends: {
      peak: 'September - November',
      low: 'February - April'
    }
  });

  const [surveillanceData, setSurveillanceData] = useState([]);

  // Simulate competitive surveillance
  useEffect(() => {
    if (surveillanceMode) {
      const interval = setInterval(() => {
        const events = [
          'Price change detected at Clean Machine',
          'New equipment installation at Wash & Go',
          'Customer review sentiment shift',
          'Marketing campaign launched',
          'Service hours modification',
          'Staff hiring activity observed'
        ];

        setSurveillanceData(prev => [
          {
            id: Date.now(),
            event: events[Math.floor(Math.random() * events.length)],
            competitor: competitors[Math.floor(Math.random() * competitors.length)].name,
            timestamp: new Date(),
            priority: Math.random() > 0.7 ? 'high' : 'medium'
          },
          ...prev.slice(0, 9)
        ]);
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [surveillanceMode, competitors]);

  const getThreatColor = (level) => {
    switch (level) {
      case 'HIGH': return 'text-red-400 bg-red-500/20 border-red-500';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500';
      case 'LOW': return 'text-green-400 bg-green-500/20 border-green-500';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500';
    }
  };

  const filteredCompetitors = competitors.filter(comp => {
    if (filterBy !== 'all' && comp.threatLevel.toLowerCase() !== filterBy) return false;
    if (searchQuery && !comp.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 p-6">
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
              <Radar className="h-8 w-8 text-red-400" />
              Competitive Intelligence Hub
              <Badge variant="secondary" className="ml-2 bg-red-500/20 text-red-200">
                {surveillanceMode ? 'ACTIVE SURVEILLANCE' : 'MONITORING'}
              </Badge>
            </h1>
            <p className="text-slate-300 mt-2">Advanced competitor monitoring and market intelligence</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant={surveillanceMode ? "destructive" : "outline"}
              onClick={() => setSurveillanceMode(!surveillanceMode)}
              className="border-red-400 text-red-400 hover:bg-red-500/20"
            >
              <Eye className="h-4 w-4 mr-2" />
              {surveillanceMode ? 'Stop Surveillance' : 'Start Surveillance'}
            </Button>
          </div>
        </div>

        {/* Market Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Market Size</p>
                  <p className="text-xl font-bold text-white">
                    {formatCurrency(marketIntelligence.totalMarketSize)}
                  </p>
                </div>
                <Target className="h-6 w-6 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Avg Revenue</p>
                  <p className="text-xl font-bold text-white">
                    {formatCurrency(marketIntelligence.averageRevenue)}
                  </p>
                </div>
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Market Growth</p>
                  <p className="text-xl font-bold text-white">
                    +{marketIntelligence.marketGrowth}%
                  </p>
                </div>
                <TrendingUp className="h-6 w-6 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Retention Rate</p>
                  <p className="text-xl font-bold text-white">
                    {marketIntelligence.customerRetention}%
                  </p>
                </div>
                <Users className="h-6 w-6 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Competitor List */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Crosshair className="h-5 w-5 text-red-400" />
                  Competitor Analysis
                </CardTitle>
                <div className="flex gap-4 mt-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search competitors..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="px-3 py-2 bg-slate-700 border-slate-600 rounded-md text-white"
                  >
                    <option value="all">All Threats</option>
                    <option value="high">High Threat</option>
                    <option value="medium">Medium Threat</option>
                    <option value="low">Low Threat</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <AnimatePresence>
                  {filteredCompetitors.map((competitor) => (
                    <motion.div
                      key={competitor.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedCompetitor?.id === competitor.id
                          ? 'bg-red-500/10 border-red-500'
                          : 'bg-slate-700/30 border-slate-600 hover:bg-slate-700/50'
                      }`}
                      onClick={() => setSelectedCompetitor(competitor)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white font-semibold">{competitor.name}</h3>
                        <Badge variant="outline" className={getThreatColor(competitor.threatLevel)}>
                          {competitor.threatLevel}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-300">{competitor.distance} miles</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-400" />
                          <span className="text-slate-300">{competitor.rating} ({competitor.reviews})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-400" />
                          <span className="text-slate-300">{formatCurrency(competitor.revenue)}/mo</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-400" />
                          <span className="text-slate-300">{competitor.customers} customers</span>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-600">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-400">Market Share</span>
                          <span className="text-xs text-white font-semibold">{competitor.marketShare}%</span>
                        </div>
                        <Progress value={competitor.marketShare} className="h-2 mt-1" />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analysis */}
          <div className="lg:col-span-2 space-y-6">
            {selectedCompetitor ? (
              <>
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Focus className="h-5 w-5 text-red-400" />
                        {selectedCompetitor.name}
                      </span>
                      <Badge variant="outline" className={getThreatColor(selectedCompetitor.threatLevel)}>
                        {selectedCompetitor.threatLevel} THREAT
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-4 bg-slate-700/50">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="services">Services</TabsTrigger>
                        <TabsTrigger value="intel">Intel</TabsTrigger>
                        <TabsTrigger value="actions">Actions</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="overview" className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <h4 className="text-white font-semibold">Contact Info</h4>
                            <div className="space-y-1 text-sm">
                              {selectedCompetitor.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-slate-400" />
                                  <span className="text-slate-300">{selectedCompetitor.phone}</span>
                                </div>
                              )}
                              {selectedCompetitor.website && (
                                <div className="flex items-center gap-2">
                                  <Globe className="h-4 w-4 text-slate-400" />
                                  <span className="text-slate-300">{selectedCompetitor.website}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-slate-400" />
                                <span className="text-slate-300">{selectedCompetitor.openHours}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="text-white font-semibold">Performance</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-slate-400 text-sm">Rating</span>
                                <span className="text-white text-sm">{selectedCompetitor.rating}/5.0</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400 text-sm">Reviews</span>
                                <span className="text-white text-sm">{selectedCompetitor.reviews}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400 text-sm">Market Share</span>
                                <span className="text-white text-sm">{selectedCompetitor.marketShare}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="services" className="space-y-4 mt-4">
                        <div>
                          <h4 className="text-white font-semibold mb-2">Services Offered</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedCompetitor.services.map((service, index) => (
                              <Badge key={index} variant="secondary" className="bg-blue-500/20 text-blue-300">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-white font-semibold mb-2">Strengths</h4>
                            <ul className="space-y-1">
                              {selectedCompetitor.strengths.map((strength, index) => (
                                <li key={index} className="flex items-center gap-2 text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-400" />
                                  <span className="text-slate-300">{strength}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="text-white font-semibold mb-2">Weaknesses</h4>
                            <ul className="space-y-1">
                              {selectedCompetitor.weaknesses.map((weakness, index) => (
                                <li key={index} className="flex items-center gap-2 text-sm">
                                  <AlertTriangle className="h-4 w-4 text-red-400" />
                                  <span className="text-slate-300">{weakness}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="intel" className="space-y-4 mt-4">
                        <div>
                          <h4 className="text-white font-semibold mb-2">Recent Intelligence</h4>
                          <div className="space-y-2">
                            {selectedCompetitor.recentChanges.map((change, index) => (
                              <Alert key={index} className="border-orange-500/50 bg-orange-500/10">
                                <Zap className="h-4 w-4 text-orange-400" />
                                <AlertDescription className="text-orange-200">
                                  <div className="flex justify-between items-start">
                                    <span>{change.change}</span>
                                    <span className="text-xs opacity-60">{change.date}</span>
                                  </div>
                                </AlertDescription>
                              </Alert>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-white font-semibold">Data Freshness</h4>
                            <span className="text-xs text-slate-400">
                              Updated {formatTimeAgo(selectedCompetitor.lastUpdated)}
                            </span>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="actions" className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-3">
                          <Button variant="outline" size="sm" className="justify-start">
                            <Eye className="h-4 w-4 mr-2" />
                            Monitor Pricing
                          </Button>
                          <Button variant="outline" size="sm" className="justify-start">
                            <Bell className="h-4 w-4 mr-2" />
                            Set Alerts
                          </Button>
                          <Button variant="outline" size="sm" className="justify-start">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Compare Metrics
                          </Button>
                          <Button variant="outline" size="sm" className="justify-start">
                            <MapPin className="h-4 w-4 mr-2" />
                            Visit Location
                          </Button>
                        </div>
                        
                        <Alert className="border-purple-500/50 bg-purple-500/10">
                          <Brain className="h-4 w-4 text-purple-400" />
                          <AlertDescription className="text-purple-200">
                            AI Recommendation: Focus on superior customer service and equipment maintenance to counter their extended hours advantage.
                          </AlertDescription>
                        </Alert>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <Target className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">Select a Competitor</h3>
                  <p className="text-slate-400">Choose a competitor from the list to view detailed intelligence</p>
                </CardContent>
              </Card>
            )}

            {/* Surveillance Feed */}
            {surveillanceMode && (
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-red-400 animate-pulse" />
                    Live Surveillance Feed
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-60 overflow-y-auto">
                  <AnimatePresence>
                    {surveillanceData.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg"
                      >
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          item.priority === 'high' ? 'bg-red-400' : 'bg-yellow-400'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-300">{item.event}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {item.competitor} • {formatTimeAgo(item.timestamp)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {surveillanceData.length === 0 && (
                    <div className="text-center py-4">
                      <div className="text-slate-500 text-sm">Monitoring competitor activity...</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CompetitiveIntelligenceHub;