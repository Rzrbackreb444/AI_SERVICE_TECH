import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { 
  Bot, Send, Mic, MicOff, Brain, Zap, Target, 
  TrendingUp, MapPin, Users, Clock, Star, Shield,
  ChevronDown, Play, Pause, Volume2, VolumeX,
  Copy, Download, Share2, ThumbsUp, ThumbsDown,
  Sparkles, Activity, Eye, Lock, Unlock
} from 'lucide-react';

const AIAgentInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'agent',
      content: "Hello! I'm your LaundroTech AI Intelligence Agent. I can analyze locations, predict market trends, and provide strategic recommendations. What would you like to explore?",
      timestamp: new Date(),
      confidence: 98,
      sources: ['Market Data', 'Demographics', 'Competition Analysis']
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [agentPersonality, setAgentPersonality] = useState('analytical');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsThinking(true);

    // Simulate AI processing
    setTimeout(() => {
      const agentResponse = generateAgentResponse(inputValue);
      setMessages(prev => [...prev, agentResponse]);
      setIsThinking(false);
    }, 2000 + Math.random() * 3000);
  };

  const generateAgentResponse = (userInput) => {
    const responses = {
      location: {
        content: "I've analyzed the location data for your query. Based on demographics, competition density, and market trends, here's what I found:\n\n📍 **Location Score**: 87/100 (Excellent)\n📊 **Market Saturation**: Low (23%)\n👥 **Target Demographics**: 68% match\n💰 **Projected ROI**: 28.4% annually\n\n**Key Insights:**\n• High foot traffic during peak hours (7-9 AM, 6-8 PM)\n• Limited competition within 2-mile radius\n• Growing young professional population\n• Average household income: $52,000\n\nWould you like me to generate a detailed report or analyze specific competitive factors?",
        confidence: 94,
        sources: ['Google Maps API', 'Census Data', 'ATTOM Real Estate', 'Proprietary Algorithms']
      },
      competition: {
        content: "🎯 **Competitive Intelligence Analysis Complete**\n\nI've identified 12 competitors within a 5-mile radius:\n\n**Direct Competitors (3):**\n• Wash & Go Laundromat - 0.8 miles, 3.2★ rating\n• Clean Machine - 1.2 miles, 4.1★ rating  \n• Suds City - 2.1 miles, 3.8★ rating\n\n**Market Gaps Identified:**\n✅ Premium service tier (wash-dry-fold)\n✅ Extended hours (24/7 operations)\n✅ Mobile app integration\n✅ Loyalty program\n\n**Competitive Advantage Opportunities:**\n• 40% of competitors lack modern payment systems\n• Average wait time: 23 minutes (industry: 18 minutes)\n• Only 1 competitor offers pickup/delivery\n\nRecommendation: Focus on premium positioning with superior customer experience.",
        confidence: 91,
        sources: ['Google Places', 'Review Analysis', 'Market Research', 'Customer Surveys']
      },
      financial: {
        content: "💰 **Financial Projection Analysis**\n\nBased on location demographics and market conditions:\n\n**Revenue Projections (Year 1):**\n• Gross Revenue: $156,000\n• Operating Expenses: $89,000\n• Net Profit: $67,000\n• ROI: 24.8%\n\n**Key Performance Drivers:**\n📈 Average revenue per customer: $8.50\n🔄 Customer frequency: 2.3x per week\n👥 Projected customer base: 850 regulars\n⏰ Peak utilization: 78%\n\n**Break-even Analysis:**\n• Initial Investment: $270,000\n• Monthly Break-even: $7,400\n• Payback Period: 3.2 years\n\n**Optimization Recommendations:**\n• Implement dynamic pricing (+12% revenue)\n• Add vending machines (+$800/month)\n• Loyalty program (+18% retention)\n\nWould you like me to model different scenarios or equipment configurations?",
        confidence: 96,
        sources: ['Financial Models', 'Industry Benchmarks', 'Local Market Data', 'Equipment Costs']
      },
      default: {
        content: "I understand you're looking for insights. I can help you with:\n\n🔍 **Location Analysis** - Demographics, foot traffic, accessibility\n🎯 **Competition Intelligence** - Market gaps, competitor analysis\n💰 **Financial Projections** - ROI calculations, break-even analysis\n📊 **Market Trends** - Industry forecasts, demand patterns\n🏗️ **Equipment Recommendations** - Optimal machine mix, brands\n📈 **Growth Strategies** - Expansion opportunities, optimization\n\nJust ask me about any of these areas, or tell me about a specific location you're considering. I'll provide data-driven insights to help you make informed decisions.",
        confidence: 85,
        sources: ['Comprehensive Database', 'Market Intelligence', 'Analytics Engine']
      }
    };

    const inputLower = userInput.toLowerCase();
    let responseType = 'default';

    if (inputLower.includes('location') || inputLower.includes('address') || inputLower.includes('area')) {
      responseType = 'location';
    } else if (inputLower.includes('competitor') || inputLower.includes('competition')) {
      responseType = 'competition';  
    } else if (inputLower.includes('financial') || inputLower.includes('revenue') || inputLower.includes('profit') || inputLower.includes('roi')) {
      responseType = 'financial';
    }

    return {
      id: Date.now(),
      type: 'agent',
      content: responses[responseType].content,
      timestamp: new Date(),
      confidence: responses[responseType].confidence,
      sources: responses[responseType].sources,
      actions: ['Generate Report', 'Export Data', 'Schedule Follow-up']
    };
  };

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    // Voice recognition implementation would go here
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <motion.div 
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <motion.div
                className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
                animate={{ 
                  boxShadow: isThinking ? 
                    "0 0 20px rgba(59, 130, 246, 0.5)" : 
                    "0 0 10px rgba(59, 130, 246, 0.3)"
                }}
                transition={{ duration: 0.5 }}
              >
                <Bot className="h-6 w-6 text-white" />
              </motion.div>
              {isThinking && (
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </motion.div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">LaundroTech AI Agent</h1>
              <p className="text-slate-400">Your intelligent business advisor</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-green-400 text-green-400">
              <Activity className="h-3 w-3 mr-1" />
              Active
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className="border-blue-400 text-blue-400 hover:bg-blue-500/20"
            >
              {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chat */}
          <div className="lg:col-span-3">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm h-[600px] flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-400" />
                  Intelligent Conversation
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] rounded-lg p-4 ${
                          message.type === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-slate-700 text-slate-100'
                        }`}>
                          <div className="whitespace-pre-wrap">{message.content}</div>
                          
                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-600">
                            <span className="text-xs opacity-60">
                              {formatTimestamp(message.timestamp)}
                            </span>
                            
                            {message.type === 'agent' && (
                              <div className="flex items-center gap-2">
                                {message.confidence && (
                                  <Badge variant="secondary" className="text-xs">
                                    {message.confidence}% confidence
                                  </Badge>
                                )}
                                <div className="flex gap-1">
                                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                    <ThumbsUp className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>

                          {message.sources && (
                            <div className="mt-2 pt-2 border-t border-slate-600">
                              <div className="text-xs opacity-60 mb-1">Sources:</div>
                              <div className="flex flex-wrap gap-1">
                                {message.sources.map((source, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {source}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {message.actions && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {message.actions.map((action, index) => (
                                <Button key={index} size="sm" variant="secondary" className="text-xs">
                                  {action}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {isThinking && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-slate-700 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <Brain className="h-4 w-4 text-blue-400" />
                          </motion.div>
                          <span className="text-slate-300">AI is analyzing...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Textarea
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me about location analysis, market insights, or competitive intelligence..."
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 min-h-[60px] resize-none"
                      disabled={isThinking}
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={handleVoiceToggle}
                      variant="outline"
                      size="sm"
                      className={`border-slate-600 ${isListening ? 'bg-red-500/20 border-red-400' : ''}`}
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                    
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isThinking}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quick Actions */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start text-slate-300 border-slate-600 hover:bg-slate-700"
                  onClick={() => setInputValue("Analyze location: 123 Main St, Little Rock, AR")}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Analyze Location
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start text-slate-300 border-slate-600 hover:bg-slate-700"
                  onClick={() => setInputValue("Show me the competition analysis")}
                >
                  <Target className="h-4 w-4 mr-2" />
                  Competition Report
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start text-slate-300 border-slate-600 hover:bg-slate-700"
                  onClick={() => setInputValue("Calculate ROI projections")}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Financial Projections
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start text-slate-300 border-slate-600 hover:bg-slate-700"
                  onClick={() => setInputValue("What are the market trends?")}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Market Trends
                </Button>
              </CardContent>
            </Card>

            {/* Agent Status */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">Agent Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm">Processing Power</span>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                    Active
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm">Data Sources</span>
                  <span className="text-blue-400 text-sm font-semibold">12 Connected</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm">Response Time</span>
                  <span className="text-purple-400 text-sm font-semibold">2.3s avg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm">Accuracy</span>
                  <span className="text-yellow-400 text-sm font-semibold">94.2%</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Insights */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">Recent Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-xs text-slate-400 border-l-2 border-blue-400 pl-2">
                  Market opportunity increased 12% in Northwest Arkansas
                </div>
                <div className="text-xs text-slate-400 border-l-2 border-green-400 pl-2">
                  New competitor identified: Clean Express (2.1 mi)
                </div>
                <div className="text-xs text-slate-400 border-l-2 border-purple-400 pl-2">
                  Demand surge predicted for Q2 2025
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AIAgentInterface;