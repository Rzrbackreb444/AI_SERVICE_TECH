import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as d3 from 'd3';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { 
  TrendingUp, TrendingDown, MapPin, Users, DollarSign, 
  Activity, Zap, Brain, Target, Globe, Clock, ChevronRight,
  BarChart3, PieChart, LineChart, Map, Layers, Sparkles,
  Eye, Lock, Unlock, Download, Share2, Bell, Settings,
  Cpu, Database, Network, Shield, Rocket, Star
} from 'lucide-react';

const AdvancedIntelligenceDashboard = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [realTimeData, setRealTimeData] = useState({});
  const [aiInsights, setAiInsights] = useState([]);
  const [competitorTracker, setCompetitorTracker] = useState([]);
  const [predictiveMetrics, setPredictiveMetrics] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  const heatmapRef = useRef();
  const networkGraphRef = useRef();
  const predictionChartRef = useRef();

  // Real-time data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        marketActivity: Math.floor(Math.random() * 100),
        competitorMovement: Math.floor(Math.random() * 50),
        demandIndex: Math.floor(Math.random() * 80) + 20,
        priceFluctuation: (Math.random() - 0.5) * 10,
        timestamp: new Date().toISOString()
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Advanced D3 Heat Map
  useEffect(() => {
    if (!heatmapRef.current) return;

    const data = generateHeatmapData();
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 90, bottom: 60, left: 60 };

    d3.select(heatmapRef.current).selectAll('*').remove();

    const svg = d3.select(heatmapRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const colorScale = d3.scaleSequential(d3.interpolateViridis)
      .domain([0, 100]);

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.x))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const yScale = d3.scaleBand()
      .domain(data.map(d => d.y))
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => xScale(d.x))
      .attr('y', d => yScale(d.y))
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .attr('fill', d => colorScale(d.value))
      .attr('rx', 4)
      .on('mouseover', function(event, d) {
        d3.select(this).style('stroke', '#fff').style('stroke-width', 2);
      })
      .on('mouseout', function() {
        d3.select(this).style('stroke', 'none');
      });

  }, []);

  // Network Graph Visualization
  useEffect(() => {
    if (!networkGraphRef.current) return;

    const nodes = generateNetworkNodes();
    const links = generateNetworkLinks(nodes);

    const width = 500;
    const height = 400;

    d3.select(networkGraphRef.current).selectAll('*').remove();

    const svg = d3.select(networkGraphRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).distance(80))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', '#666')
      .attr('stroke-width', 2);

    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', d => d.size * 3)
      .attr('fill', d => d.color)
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
    });

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }, []);

  // Predictive Analytics Chart
  useEffect(() => {
    if (!predictionChartRef.current) return;

    const data = generatePredictionData();
    const width = 800;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };

    d3.select(predictionChartRef.current).selectAll('*').remove();

    const svg = d3.select(predictionChartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.date))
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.value))
      .range([height - margin.bottom, margin.top]);

    const line = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.value))
      .curve(d3.curveCardinal);

    const area = d3.area()
      .x(d => xScale(d.date))
      .y0(height - margin.bottom)
      .y1(d => yScale(d.value))
      .curve(d3.curveCardinal);

    // Gradient
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0).attr('y1', height)
      .attr('x2', 0).attr('y2', 0);

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#3b82f6')
      .attr('stop-opacity', 0);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#3b82f6')
      .attr('stop-opacity', 0.8);

    svg.append('path')
      .datum(data)
      .attr('fill', 'url(#gradient)')
      .attr('d', area);

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 3)
      .attr('d', line);

    // Interactive points
    svg.selectAll('.dot')
      .data(data)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(d.date))
      .attr('cy', d => yScale(d.value))
      .attr('r', 4)
      .attr('fill', '#3b82f6')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('r', 6);
      })
      .on('mouseout', function() {
        d3.select(this).attr('r', 4);
      });

  }, []);

  const generateHeatmapData = () => {
    const data = [];
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 8; y++) {
        data.push({
          x: x,
          y: y,
          value: Math.floor(Math.random() * 100)
        });
      }
    }
    return data;
  };

  const generateNetworkNodes = () => [
    { id: 'center', size: 8, color: '#3b82f6', type: 'primary' },
    { id: 'competitor1', size: 6, color: '#ef4444', type: 'competitor' },
    { id: 'competitor2', size: 5, color: '#ef4444', type: 'competitor' },
    { id: 'supplier1', size: 4, color: '#10b981', type: 'supplier' },
    { id: 'supplier2', size: 4, color: '#10b981', type: 'supplier' },
    { id: 'market1', size: 3, color: '#f59e0b', type: 'market' },
    { id: 'market2', size: 3, color: '#f59e0b', type: 'market' },
  ];

  const generateNetworkLinks = (nodes) => [
    { source: 'center', target: 'competitor1' },
    { source: 'center', target: 'competitor2' },
    { source: 'center', target: 'supplier1' },
    { source: 'center', target: 'supplier2' },
    { source: 'center', target: 'market1' },
    { source: 'center', target: 'market2' },
    { source: 'competitor1', target: 'market1' },
    { source: 'competitor2', target: 'market2' },
  ];

  const generatePredictionData = () => {
    const data = [];
    const startDate = new Date();
    for (let i = 0; i < 30; i++) {
      data.push({
        date: new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000),
        value: 50 + Math.sin(i * 0.2) * 20 + Math.random() * 10
      });
    }
    return data;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <motion.div 
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <Brain className="h-8 w-8 text-purple-400" />
            LaundroTech Intelligence
            <Badge variant="secondary" className="ml-2 bg-purple-500/20 text-purple-200">
              AI-Powered
            </Badge>
          </h1>
          <p className="text-slate-300 mt-2">Advanced business intelligence for the laundromat industry</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="text-white border-purple-400 hover:bg-purple-500/20">
            <Bell className="h-4 w-4 mr-2" />
            Alerts
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </motion.div>

      {/* Real-time Status Bar */}
      <motion.div 
        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 mb-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="grid grid-cols-5 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Activity className="h-4 w-4 text-green-400" />
              <span className="text-xs text-slate-300">Market Activity</span>
            </div>
            <div className="text-xl font-bold text-green-400">{realTimeData.marketActivity || 0}%</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Target className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-slate-300">Demand Index</span>
            </div>
            <div className="text-xl font-bold text-blue-400">{realTimeData.demandIndex || 0}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-purple-400" />
              <span className="text-xs text-slate-300">Competitors</span>
            </div>
            <div className="text-xl font-bold text-purple-400">{realTimeData.competitorMovement || 0}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-yellow-400" />
              <span className="text-xs text-slate-300">Price Trend</span>
            </div>
            <div className="text-xl font-bold text-yellow-400">
              {realTimeData.priceFluctuation > 0 ? '+' : ''}{realTimeData.priceFluctuation?.toFixed(1) || 0}%
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-orange-400" />
              <span className="text-xs text-slate-300">Updated</span>
            </div>
            <div className="text-sm font-mono text-orange-400">
              {realTimeData.timestamp ? new Date(realTimeData.timestamp).toLocaleTimeString() : '--:--'}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Dashboard */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-slate-800/50 border-slate-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="intelligence" className="data-[state=active]:bg-purple-600">
            <Brain className="h-4 w-4 mr-2" />
            AI Intelligence
          </TabsTrigger>
          <TabsTrigger value="competitors" className="data-[state=active]:bg-purple-600">
            <Target className="h-4 w-4 mr-2" />
            Competition
          </TabsTrigger>
          <TabsTrigger value="predictions" className="data-[state=active]:bg-purple-600">
            <Sparkles className="h-4 w-4 mr-2" />
            Predictions
          </TabsTrigger>
          <TabsTrigger value="network" className="data-[state=active]:bg-purple-600">
            <Network className="h-4 w-4 mr-2" />
            Network
          </TabsTrigger>
          <TabsTrigger value="heatmap" className="data-[state=active]:bg-purple-600">
            <Map className="h-4 w-4 mr-2" />
            Heat Map
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Rocket className="h-5 w-5 text-purple-400" />
                    Performance Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-400 mb-2">94.2%</div>
                  <Progress value={94.2} className="mb-2" />
                  <p className="text-xs text-slate-400">Exceptional market positioning</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-400" />
                    Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400 mb-2">Low</div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                      Stable Market
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400">Minimal competitive threats</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400" />
                    Opportunity Rating
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-400 mb-2">A+</div>
                  <div className="flex gap-1 mb-2">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-400">Prime investment location</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Market Intelligence</CardTitle>
                  <CardDescription className="text-slate-400">
                    Real-time competitive landscape analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Market Saturation</span>
                      <Badge variant="outline" className="border-green-500 text-green-400">
                        Low (23%)
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Demand Growth</span>
                      <span className="text-green-400 flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        +12.4%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Average Revenue</span>
                      <span className="text-blue-400 font-semibold">$8,400/mo</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">ROI Timeframe</span>
                      <span className="text-purple-400 font-semibold">2.3 years</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">AI Recommendations</CardTitle>
                  <CardDescription className="text-slate-400">
                    Powered by machine learning algorithms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Alert className="border-purple-500/50 bg-purple-500/10">
                      <Zap className="h-4 w-4 text-purple-400" />
                      <AlertDescription className="text-purple-200">
                        Optimal equipment mix: 60% 20lb, 40% 30lb washers
                      </AlertDescription>
                    </Alert>
                    <Alert className="border-blue-500/50 bg-blue-500/10">
                      <Globe className="h-4 w-4 text-blue-400" />
                      <AlertDescription className="text-blue-200">
                        Target demographic: Young professionals (25-35)
                      </AlertDescription>
                    </Alert>
                    <Alert className="border-green-500/50 bg-green-500/10">
                      <DollarSign className="h-4 w-4 text-green-400" />
                      <AlertDescription className="text-green-200">
                        Premium pricing strategy recommended (+15%)
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="heatmap" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Map className="h-5 w-5 text-purple-400" />
                  Market Density Heat Map
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Geographic distribution of market opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div ref={heatmapRef} className="w-full h-96 flex items-center justify-center"></div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="network" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Network className="h-5 w-5 text-purple-400" />
                  Business Network Analysis
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Interactive network of business relationships and dependencies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div ref={networkGraphRef} className="w-full h-96 flex items-center justify-center"></div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                  Predictive Analytics
                </CardTitle>
                <CardDescription className="text-slate-400">
                  30-day revenue and performance forecasting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div ref={predictionChartRef} className="w-full h-80"></div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedIntelligenceDashboard;