import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as d3 from 'd3';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { 
  TrendingUp, TrendingDown, Brain, Sparkles, Target, Zap,
  BarChart3, LineChart, PieChart, Activity, Clock, Globe,
  Cpu, Database, Network, Shield, Eye, AlertTriangle,
  CheckCircle, Star, DollarSign, Users, MapPin, Calendar
} from 'lucide-react';

const PredictiveAnalyticsEngine = () => {
  const [selectedModel, setSelectedModel] = useState('revenue');
  const [predictionAccuracy, setPredictionAccuracy] = useState(94.2);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPredictions, setCurrentPredictions] = useState({});
  
  const chartRef = useRef();
  const heatmapRef = useRef();
  const correlationRef = useRef();

  const [models] = useState([
    {
      id: 'revenue',
      name: 'Revenue Forecasting',
      type: 'Time Series',
      accuracy: 94.2,
      status: 'active',
      lastTrained: '2 hours ago',
      confidence: 'High',
      features: ['Historical Revenue', 'Seasonal Trends', 'Market Conditions', 'Competitor Activity'],
      predictions: {
        next7Days: { value: 28400, trend: 'up', confidence: 92 },
        next30Days: { value: 124800, trend: 'up', confidence: 87 },
        next90Days: { value: 386200, trend: 'up', confidence: 78 }
      }
    },
    {
      id: 'demand',
      name: 'Demand Prediction',
      type: 'Neural Network',
      accuracy: 91.8,
      status: 'active',
      lastTrained: '6 hours ago',
      confidence: 'High',
      features: ['Weather Data', 'Local Events', 'Historical Patterns', 'Demographics'],
      predictions: {
        peakHours: { times: ['7-9 AM', '6-8 PM'], confidence: 95 },
        busyDays: { days: ['Tuesday', 'Saturday'], confidence: 89 },
        seasonalPeak: { period: 'Fall (Sep-Nov)', confidence: 92 }
      }
    },
    {
      id: 'maintenance',
      name: 'Equipment Failure Prediction',
      type: 'Random Forest',
      accuracy: 88.5,
      status: 'active',
      lastTrained: '1 day ago',
      confidence: 'Medium',
      features: ['Usage Patterns', 'Age', 'Performance Metrics', 'Maintenance History'],
      predictions: {
        criticalAlerts: 2,
        nextFailure: { equipment: 'Washer Unit #3', probability: 73, timeframe: '14 days' },
        maintenanceCost: { estimated: 2400, confidence: 81 }
      }
    },
    {
      id: 'competition',
      name: 'Competitive Impact Analysis',
      type: 'Ensemble',
      accuracy: 89.7,
      status: 'training',
      lastTrained: '3 days ago',
      confidence: 'Medium',
      features: ['Competitor Pricing', 'New Openings', 'Service Changes', 'Market Share'],
      predictions: {
        marketImpact: { risk: 'Low', percentage: -2.1 },
        opportunityScore: 78,
        recommendedActions: ['Price adjustment', 'Service expansion']
      }
    }
  ]);

  const [marketSentiment] = useState({
    overall: 76,
    trends: [
      { metric: 'Customer Satisfaction', value: 82, change: +5.2 },
      { metric: 'Price Sensitivity', value: 34, change: -2.1 },
      { metric: 'Service Demand', value: 91, change: +8.7 },
      { metric: 'Competition Intensity', value: 45, change: +1.3 }
    ],
    insights: [
      {
        type: 'opportunity',
        title: 'Service Expansion Window',
        description: 'High demand for premium services detected. 73% customer interest in wash-fold services.',
        impact: 'High',
        actionable: true
      },
      {
        type: 'risk',
        title: 'Peak Hour Congestion',
        description: 'Customer wait times increasing during 7-9 AM slot. May impact satisfaction.',
        impact: 'Medium',
        actionable: true
      },
      {
        type: 'trend',
        title: 'Demographic Shift',
        description: 'Young professional segment growing 12% quarterly.',
        impact: 'Medium',
        actionable: false
      }
    ]
  });

  // Advanced Time Series Prediction Chart
  useEffect(() => {
    if (!chartRef.current || selectedModel !== 'revenue') return;

    const data = generateTimeSeriesData();
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 90, bottom: 60, left: 60 };

    d3.select(chartRef.current).selectAll('*').remove();

    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.date))
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.value))
      .range([height - margin.bottom, margin.top]);

    // Historical data line
    const historicalLine = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.value))
      .curve(d3.curveCardinal);

    // Prediction line
    const predictionLine = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.predictedValue || d.value))
      .curve(d3.curveCardinal);

    // Confidence band
    const area = d3.area()
      .x(d => xScale(d.date))
      .y0(d => yScale((d.predictedValue || d.value) - (d.confidence || 0)))
      .y1(d => yScale((d.predictedValue || d.value) + (d.confidence || 0)))
      .curve(d3.curveCardinal);

    // Gradient for prediction area
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'predictionGradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0).attr('y1', height)
      .attr('x2', 0).attr('y2', 0);

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#8b5cf6')
      .attr('stop-opacity', 0.1);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#8b5cf6')
      .attr('stop-opacity', 0.3);

    // Draw confidence band
    svg.append('path')
      .datum(data.filter(d => d.isPrediction))
      .attr('fill', 'url(#predictionGradient)')
      .attr('d', area);

    // Draw historical data
    svg.append('path')
      .datum(data.filter(d => !d.isPrediction))
      .attr('fill', 'none')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 3)
      .attr('d', historicalLine);

    // Draw prediction line
    svg.append('path')
      .datum(data.filter(d => d.isPrediction))
      .attr('fill', 'none')
      .attr('stroke', '#8b5cf6')
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', '5,5')
      .attr('d', predictionLine);

    // Add axes
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%b %d')));

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).tickFormat(d => `$${d3.format('.1s')(d)}`));

    // Add prediction points
    svg.selectAll('.prediction-point')
      .data(data.filter(d => d.isPrediction))
      .enter().append('circle')
      .attr('class', 'prediction-point')
      .attr('cx', d => xScale(d.date))
      .attr('cy', d => yScale(d.predictedValue))
      .attr('r', 4)
      .attr('fill', '#8b5cf6')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('r', 6);
        // Tooltip would go here
      })
      .on('mouseout', function() {
        d3.select(this).attr('r', 4);
      });

  }, [selectedModel]);

  // Correlation Matrix Heatmap
  useEffect(() => {
    if (!correlationRef.current) return;

    const correlationData = generateCorrelationMatrix();
    const size = 300;
    const cellSize = size / correlationData.length;

    d3.select(correlationRef.current).selectAll('*').remove();

    const svg = d3.select(correlationRef.current)
      .append('svg')
      .attr('width', size + 100)
      .attr('height', size + 100);

    const colorScale = d3.scaleSequential(d3.interpolateRdBu)
      .domain([-1, 1]);

    correlationData.forEach((row, i) => {
      row.forEach((value, j) => {
        svg.append('rect')
          .attr('x', j * cellSize + 50)
          .attr('y', i * cellSize + 50)
          .attr('width', cellSize)
          .attr('height', cellSize)
          .attr('fill', colorScale(value))
          .attr('stroke', '#fff')
          .attr('stroke-width', 1);

        svg.append('text')
          .attr('x', j * cellSize + cellSize/2 + 50)
          .attr('y', i * cellSize + cellSize/2 + 55)
          .attr('text-anchor', 'middle')
          .attr('font-size', '10px')
          .attr('fill', Math.abs(value) > 0.5 ? '#fff' : '#000')
          .text(value.toFixed(2));
      });
    });

    // Add labels
    const labels = ['Revenue', 'Traffic', 'Weather', 'Competition'];
    labels.forEach((label, i) => {
      svg.append('text')
        .attr('x', 45)
        .attr('y', i * cellSize + cellSize/2 + 55)
        .attr('text-anchor', 'end')
        .attr('font-size', '12px')
        .attr('fill', '#333')
        .text(label);

      svg.append('text')
        .attr('x', i * cellSize + cellSize/2 + 50)
        .attr('y', 45)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .attr('fill', '#333')
        .text(label);
    });

  }, []);

  const generateTimeSeriesData = () => {
    const data = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 90);

    // Historical data
    for (let i = 0; i < 90; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      data.push({
        date,
        value: 8000 + Math.sin(i * 0.1) * 2000 + Math.random() * 1000,
        isPrediction: false
      });
    }

    // Prediction data
    for (let i = 90; i < 120; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const baseValue = 8000 + Math.sin(i * 0.1) * 2000;
      data.push({
        date,
        value: baseValue,
        predictedValue: baseValue + (i - 90) * 50,
        confidence: 500 + (i - 90) * 20,
        isPrediction: true
      });
    }

    return data;
  };

  const generateCorrelationMatrix = () => [
    [1.0, 0.84, -0.23, -0.45],
    [0.84, 1.0, -0.18, -0.52],
    [-0.23, -0.18, 1.0, 0.12],
    [-0.45, -0.52, 0.12, 1.0]
  ];

  const selectedModelData = models.find(m => m.id === selectedModel);

  const runPrediction = async () => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));
    setPredictionAccuracy(Math.random() * 5 + 90);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6">
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
              <Brain className="h-8 w-8 text-indigo-400" />
              Predictive Analytics Engine
              <Badge variant="secondary" className="ml-2 bg-indigo-500/20 text-indigo-200">
                AI-Powered
              </Badge>
            </h1>
            <p className="text-slate-300 mt-2">Advanced machine learning models for business intelligence</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-indigo-400">{predictionAccuracy.toFixed(1)}%</div>
              <div className="text-sm text-slate-400">Model Accuracy</div>
            </div>
            <Button
              onClick={runPrediction}
              disabled={isProcessing}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isProcessing ? (
                <>
                  <Cpu className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Run Prediction
                </>
              )}
            </Button>
          </div>
        </div>

        <Tabs value={selectedModel} onValueChange={setSelectedModel} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border-slate-700">
            {models.map((model) => (
              <TabsTrigger key={model.id} value={model.id} className="data-[state=active]:bg-indigo-600">
                {model.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {models.map((model) => (
            <TabsContent key={model.id} value={model.id} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Model Stats */}
                <div className="lg:col-span-1 space-y-4">
                  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-sm flex items-center gap-2">
                        <Target className="h-4 w-4 text-indigo-400" />
                        Model Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-slate-300 text-sm">Accuracy</span>
                          <span className="text-indigo-400 font-semibold">{model.accuracy}%</span>
                        </div>
                        <Progress value={model.accuracy} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-400 text-sm">Type</span>
                          <span className="text-white text-sm">{model.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 text-sm">Status</span>
                          <Badge variant="outline" className={
                            model.status === 'active' ? 'border-green-500 text-green-400' : 'border-yellow-500 text-yellow-400'
                          }>
                            {model.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 text-sm">Last Trained</span>
                          <span className="text-white text-sm">{model.lastTrained}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 text-sm">Confidence</span>
                          <span className="text-white text-sm">{model.confidence}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-sm flex items-center gap-2">
                        <Database className="h-4 w-4 text-purple-400" />
                        Feature Importance
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {model.features.map((feature, index) => (
                        <div key={feature} className="flex justify-between items-center">
                          <span className="text-slate-300 text-sm">{feature}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-700 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full"
                                style={{ width: `${90 - index * 15}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-slate-400 w-8">{90 - index * 15}%</span>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Main Visualization */}
                <div className="lg:col-span-3">
                  {model.id === 'revenue' && (
                    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <LineChart className="h-5 w-5 text-indigo-400" />
                          Revenue Forecasting Model
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                          90-day historical data with 30-day predictions and confidence intervals
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div ref={chartRef} className="w-full h-96"></div>
                      </CardContent>
                    </Card>
                  )}

                  {model.id !== 'revenue' && (
                    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-indigo-400" />
                          {model.name} Predictions
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                          Latest model predictions and insights
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {Object.entries(model.predictions).map(([key, value]) => (
                            <div key={key} className="p-4 bg-slate-700/30 rounded-lg">
                              <h4 className="text-white font-semibold mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                              <div className="text-slate-300">
                                {typeof value === 'object' ? (
                                  <div className="space-y-1">
                                    {Object.entries(value).map(([subKey, subValue]) => (
                                      <div key={subKey} className="flex justify-between">
                                        <span className="capitalize">{subKey}:</span>
                                        <span className="text-indigo-400">{String(subValue)}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-indigo-400 text-lg font-semibold">{String(value)}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Market Sentiment & Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-400" />
                  Market Sentiment Analysis
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Real-time market sentiment tracking and trend analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg text-white">Overall Market Sentiment</span>
                  <div className="flex items-center gap-3">
                    <Progress value={marketSentiment.overall} className="w-32 h-3" />
                    <span className="text-2xl font-bold text-green-400">{marketSentiment.overall}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {marketSentiment.trends.map((trend) => (
                    <div key={trend.metric} className="p-4 bg-slate-700/30 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-medium">{trend.metric}</span>
                        <div className="flex items-center gap-1">
                          {trend.change > 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-400" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-400" />
                          )}
                          <span className={`text-sm ${trend.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {trend.change > 0 ? '+' : ''}{trend.change}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={trend.value} className="flex-1 h-2" />
                        <span className="text-indigo-400 font-semibold">{trend.value}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h4 className="text-white font-semibold">AI-Generated Insights</h4>
                  {marketSentiment.insights.map((insight, index) => (
                    <Alert key={index} className={`border-l-4 ${
                      insight.type === 'opportunity' ? 'border-green-500 bg-green-500/10' :
                      insight.type === 'risk' ? 'border-red-500 bg-red-500/10' : 
                      'border-blue-500 bg-blue-500/10'
                    }`}>
                      <div className="flex items-start gap-3">
                        {insight.type === 'opportunity' ? (
                          <TrendingUp className="h-5 w-5 text-green-400 mt-0.5" />
                        ) : insight.type === 'risk' ? (
                          <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
                        ) : (
                          <Eye className="h-5 w-5 text-blue-400 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h5 className="font-semibold text-white">{insight.title}</h5>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={`text-xs ${
                                insight.impact === 'High' ? 'border-red-500 text-red-400' :
                                insight.impact === 'Medium' ? 'border-yellow-500 text-yellow-400' :
                                'border-green-500 text-green-400'
                              }`}>
                                {insight.impact} Impact
                              </Badge>
                              {insight.actionable && (
                                <Badge variant="secondary" className="text-xs bg-indigo-500/20 text-indigo-300">
                                  Actionable
                                </Badge>
                              )}
                            </div>
                          </div>
                          <AlertDescription className="text-slate-300">
                            {insight.description}
                          </AlertDescription>
                        </div>
                      </div>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Correlation Matrix */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Network className="h-4 w-4 text-purple-400" />
                  Feature Correlations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div ref={correlationRef} className="w-full flex justify-center"></div>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-400" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm">Model Pipeline</span>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                    Healthy
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm">Data Pipeline</span>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                    Operational
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm">API Latency</span>
                  <span className="text-blue-400 text-sm font-semibold">127ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm">Prediction Rate</span>
                  <span className="text-purple-400 text-sm font-semibold">2.3k/hr</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PredictiveAnalyticsEngine;