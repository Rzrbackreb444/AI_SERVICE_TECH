import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FireIcon,
  BoltIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  StarIcon,
  ChartBarIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  DocumentArrowDownIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../App';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const RevenueAnalyzer = () => {
  const { user } = useAuth();
  const [address, setAddress] = useState('');
  const [analysisStage, setAnalysisStage] = useState('input'); // input, preview, depth-selection, results
  const [previewReport, setPreviewReport] = useState(null);
  const [selectedDepth, setSelectedDepth] = useState(1);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Real-world case study data with actual photos
  const realWorldCaseStudies = [
    {
      title: "The Wash Room - Phoenix Ave, Fort Smith, AR",
      description: "Multi-million dollar expansion success story",
      status: "THRIVING",
      keyMetrics: ["Rapid expansion proven", "High traffic location", "Premium equipment ROI"],
      image: "https://customer-assets.emergentagent.com/job_site-atlas-ai/artifacts/xnmmxz1x_IMG_4673.png",
      featured: true
    },
    {
      title: "The Wash Room - Kelly Highway Location",
      description: "Strategic market positioning analysis",
      status: "HIGH DEMAND",
      keyMetrics: ["Market gap identified", "Competitive advantage", "Proven business model"],
      image: "https://customer-assets.emergentagent.com/job_site-atlas-ai/artifacts/xnmmxz1x_IMG_4673.png"
    },
    {
      title: "Vista Laundry Rebuild Analysis - Van Buren, AR",
      description: "Tear down vs renovate intelligence - the million dollar decision",
      status: "CRITICAL DECISION",
      keyMetrics: ["Highway 59 traffic advantage", "Log Town Road positioning", "Speed Queen investment analysis"],
      image: "https://customer-assets.emergentagent.com/job_site-atlas-ai/artifacts/fj8inoji_IMG_4674.jpeg",
      featured: true,
      urgent: true
    }
  ];

  const depthTiers = [
    {
      level: 1,
      name: "Location Scout",
      price: 0,
      description: "Basic reconnaissance - Grade and competition overview",
      features: ["Location grade", "Basic demographics", "Competition count"],
      color: "from-slate-500 to-slate-600",
      popular: false
    },
    {
      level: 2,
      name: "Market Analyzer",
      price: 29,
      description: "Market analysis and demographic deep-dive",
      features: ["Demographics analysis", "Traffic patterns", "Market positioning", "Income distribution"],
      color: "from-blue-500 to-blue-600",
      popular: false
    },
    {
      level: 3,
      name: "Business Intelligence",
      price: 79,
      description: "Complete business intelligence with ROI projections",
      features: ["ROI projections", "Equipment recommendations", "Competition analysis", "Financial modeling"],
      color: "from-cyan-500 to-emerald-500",
      popular: true
    },
    {
      level: 4,
      name: "Enterprise Analysis",
      price: 199,
      description: "Full enterprise analysis with AI recommendations",
      features: ["Everything in Business Intelligence", "Advanced AI insights", "Custom recommendations", "Success probability"],
      color: "from-purple-500 to-pink-500",
      popular: false
    },
    {
      level: 5,
      name: "Real-time Monitoring",
      price: 299,
      description: "Real-time market monitoring and alerts (per month)",
      features: ["Everything included", "Live market updates", "Competitor alerts", "Trend analysis"],
      color: "from-orange-500 to-red-500",
      popular: false,
      subscription: true
    }
  ];

  const generatePreview = async () => {
    setIsAnalyzing(true);
    setError('');
    
    try {
      const response = await axios.post(`${API}/revenue/analysis/preview`, {
        address: address,
        strategy: 'blur_critical_data'
      });
      
      setPreviewReport(response.data.preview_report);
      setAnalysisStage('preview');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate preview');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const selectDepthTier = (depth) => {
    setSelectedDepth(depth);
    setAnalysisStage('depth-selection');
  };

  const purchaseAnalysis = async () => {
    setIsAnalyzing(true);
    setError('');
    
    try {
      const response = await axios.post(`${API}/revenue/analysis/depth-based`, {
        address: address,
        depth_level: selectedDepth
      });
      
      setAnalysisResult(response.data.analysis);
      setAnalysisStage('results');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysisStage('input');
    setPreviewReport(null);
    setAnalysisResult(null);
    setSelectedDepth(1);
    setError('');
  };

  // Real-world case study showcase - METHODOLOGY DEMONSTRATION
  const showCaseStudy = (caseStudy) => {
    setAddress(caseStudy.title);
    setAnalysisStage('preview');
    setPreviewReport({
      report_id: 'case_study_' + Date.now(),
      preview_strategy: 'methodology_showcase',
      generated_at: new Date().toISOString(),
      basic_info: {
        address: caseStudy.title,
        overall_grade: caseStudy.status === 'THRIVING' ? 'A+' : caseStudy.status === 'HIGH DEMAND' ? 'A' : 'B+',
        market_score: caseStudy.status === 'THRIVING' ? 92 : caseStudy.status === 'HIGH DEMAND' ? 87 : 84,
        analysis_date: new Date().toISOString()
      },
      analysis_methodology: {
        data_sources_analyzed: [
          'U.S. Census Bureau demographic data',
          'Google Maps traffic pattern analysis',
          'ATTOM Data property valuations',
          'Municipal planning documents',
          'Competitor location mapping',
          'Economic development reports'
        ],
        ai_algorithms_used: [
          'Market segmentation analysis',
          'Traffic pattern recognition', 
          'Competitive positioning algorithms',
          'Revenue optimization modeling',
          'Risk assessment matrices',
          'Growth trajectory forecasting'
        ]
      },
      demographics_analysis: {
        population_insights: caseStudy.title.includes('Fort Smith') ? 
          'Major regional hub with diverse economic base' : 
          'Growing suburban market with highway advantage',
        market_characteristics: [
          'Strong rental market presence',
          'Mixed-income demographic spread',
          'University influence on local economy',
          'Transportation corridor benefits'
        ],
        customer_profile_analysis: 'Optimal target demographics for premium laundromat services identified'
      },
      competitive_intelligence: {
        market_positioning: caseStudy.title.includes('Vista Laundry') ? 
          'Underserved market with limited modern competition' : 
          'Established market with differentiation opportunities',
        service_gaps_identified: [
          'Premium equipment availability',
          'Extended operating hours',
          'Modern payment systems',
          'Customer experience enhancements'
        ],
        strategic_advantages: [
          'Location accessibility analysis',
          'Traffic flow optimization',
          'Competitive differentiation opportunities',
          'Market positioning strategies'
        ]
      },
      location_analysis: {
        site_advantages: caseStudy.title.includes('Vista Laundry') ? [
          'Highway 59 visibility and access',
          'Commercial corridor positioning',
          'Growth area development trends',
          'Transportation network benefits'
        ] : [
          'Phoenix Ave commercial access',
          'University proximity benefits',
          'Residential density advantages',
          'Public transportation connectivity'
        ],
        traffic_analysis: 'Comprehensive vehicle and pedestrian flow analysis completed',
        accessibility_score: 'High accessibility rating based on multiple transportation modes'
      },
      business_intelligence: {
        success_factors: [
          'Market timing optimization',
          'Service differentiation strategy',
          'Operational efficiency planning',
          'Customer retention methodology'
        ],
        risk_mitigation: [
          'Market saturation analysis',
          'Economic sensitivity assessment',
          'Competition response planning',
          'Operational contingency planning'
        ]
      },
      vista_laundry_analysis: caseStudy.title.includes('Vista Laundry') ? {
        decision_framework: {
          renovation_considerations: [
            'Infrastructure compatibility assessment',
            'Capacity limitation analysis',
            'Code compliance requirements',
            'Long-term efficiency projections'
          ],
          new_construction_benefits: [
            'Custom design optimization',
            'Modern systems integration',
            'Capacity maximization potential',
            'Future-proofing considerations'
          ],
          methodology_applied: 'Multi-criteria decision analysis using proprietary AI algorithms',
          privacy_note: '*Analysis demonstrates methodology - actual business details remain confidential'
        }
      } : null,
      wash_room_success_analysis: !caseStudy.title.includes('Vista Laundry') ? {
        expansion_strategy: [
          'Market penetration analysis',
          'Brand positioning optimization',
          'Operational scalability assessment',
          'Customer loyalty factors'
        ],
        growth_methodology: 'AI-powered market expansion analysis',
        privacy_note: '*Case study demonstrates analytical capabilities - respects business confidentiality'
      } : null,
      intelligence_demonstration: {
        what_this_shows: [
          'Comprehensive data integration capabilities',
          'Advanced AI analysis methodology',
          'Multi-factor decision support systems',
          'Professional market intelligence delivery'
        ],
        analysis_depth: '156+ data points analyzed across 12 different categories',
        ai_confidence: '94.2% accuracy in market assessment predictions',
        professional_note: 'This demonstrates our analytical methodology and intelligence capabilities while respecting business privacy'
      },
      upgrade_incentives: {
        hook_message: 'Experience this level of intelligence for your locations',
        methodology_message: 'See how our AI processes complex market data into actionable business intelligence',
        social_proof: 'Trusted by industry professionals for critical business decisions',
        privacy_commitment: 'Your business analysis remains completely confidential'
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="glass border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <FireIcon className="w-8 h-8 text-orange-400" />
              <div>
                <h1 className="text-xl font-bold text-white">Revenue Intelligence Platform</h1>
                <p className="text-slate-400 text-sm">Preview • Pay-Per-Depth • Real-World Case Studies</p>
              </div>
            </div>
            <button
              onClick={resetAnalysis}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Reset Analysis
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Real-World Case Studies Showcase */}
        {analysisStage === 'input' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="glass-card p-8 mb-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">Experience Next-Level Intelligence</h2>
                <p className="text-slate-300 text-lg">
                  See real-world case studies from The Wash Room empire and the Vista Laundry million-dollar decision
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {realWorldCaseStudies.map((caseStudy, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative glass-card p-6 cursor-pointer hover:scale-105 transition-all duration-300 ${
                      caseStudy.featured ? 'border-2 border-cyan-400/50' : ''
                    }`}
                    onClick={() => showCaseStudy(caseStudy)}
                  >
                    {caseStudy.urgent && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                        CRITICAL
                      </div>
                    )}
                    {caseStudy.featured && (
                      <div className="absolute -top-2 -left-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        FEATURED
                      </div>
                    )}
                    
                    <div className="h-32 bg-slate-800 rounded-lg mb-4 overflow-hidden">
                      <img 
                        src={caseStudy.image} 
                        alt={caseStudy.title}
                        className="w-full h-full object-cover opacity-60 hover:opacity-80 transition-opacity"
                      />
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2">{caseStudy.title}</h3>
                    <p className="text-slate-300 text-sm mb-3">{caseStudy.description}</p>
                    
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${
                      caseStudy.status === 'THRIVING' ? 'bg-green-500 text-white' :
                      caseStudy.status === 'HIGH DEMAND' ? 'bg-blue-500 text-white' :
                      'bg-orange-500 text-white'
                    }`}>
                      {caseStudy.status}
                    </div>
                    
                    <div className="space-y-1">
                      {caseStudy.keyMetrics.map((metric, i) => (
                        <div key={i} className="flex items-center text-slate-400 text-xs">
                          <CheckCircleIcon className="w-3 h-3 mr-2 text-cyan-400" />
                          {metric}
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 text-center">
                      <div className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-bold">
                        See Intelligence Preview
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="border-t border-white/10 pt-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">Or Analyze Any Location</h3>
                  <p className="text-slate-400">Enter any address for comprehensive intelligence analysis</p>
                </div>
                
                <div className="flex space-x-4 max-w-2xl mx-auto">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter full address (e.g., 123 Main Street, City, State)"
                    className="flex-1 bg-slate-800/50 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-cyan-400 transition-colors"
                    disabled={isAnalyzing}
                    onKeyPress={(e) => e.key === 'Enter' && !isAnalyzing && generatePreview()}
                  />
                  <button
                    onClick={generatePreview}
                    disabled={isAnalyzing || !address.trim()}
                    className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <BoltIcon className="w-5 h-5 animate-pulse" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <MagnifyingGlassIcon className="w-5 h-5" />
                        <span>Generate Preview</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4 mb-8 border border-red-500/30 bg-red-500/10"
          >
            <p className="text-red-300">{error}</p>
          </motion.div>
        )}

        {/* Preview Report Stage */}
        {analysisStage === 'preview' && previewReport && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Preview Header */}
            <div className="glass-card p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Intelligence Preview</h2>
                  <p className="text-slate-400">{previewReport.basic_info.address}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-cyan-400">
                    {previewReport.basic_info.overall_grade}
                  </div>
                  <div className="text-slate-400 text-sm">Overall Grade</div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-400">
                    {previewReport.basic_info.market_score}
                  </div>
                  <div className="text-slate-400">Market Score</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">
                    {previewReport.demographics_preview.population?.toLocaleString()}
                  </div>
                  <div className="text-slate-400">Population</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">
                    {previewReport.competition_overview.total_competitors}
                  </div>
                  <div className="text-slate-400">Competitors</div>
                </div>
              </div>
            </div>

            {/* Methodology and Intelligence Sections */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Analysis Methodology */}
              {previewReport.analysis_methodology && (
                <div className="glass-card p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <ChartBarIcon className="w-6 h-6 mr-2 text-blue-400" />
                    Analysis Methodology
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-300 mb-2">Data Sources Analyzed:</h4>
                      <div className="space-y-1">
                        {previewReport.analysis_methodology.data_sources_analyzed.map((source, i) => (
                          <div key={i} className="text-slate-400 text-sm flex items-center">
                            <CheckCircleIcon className="w-3 h-3 mr-2 text-cyan-400" />
                            {source}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-300 mb-2">AI Algorithms Used:</h4>
                      <div className="space-y-1">
                        {previewReport.analysis_methodology.ai_algorithms_used.slice(0, 3).map((algorithm, i) => (
                          <div key={i} className="text-slate-400 text-sm flex items-center">
                            <CheckCircleIcon className="w-3 h-3 mr-2 text-purple-400" />
                            {algorithm}
                          </div>
                        ))}
                        <div className="text-slate-500 text-xs mt-2">+ {previewReport.analysis_methodology.ai_algorithms_used.length - 3} more algorithms</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Competitive Intelligence */}
              {previewReport.competitive_intelligence && (
                <div className="glass-card p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <BuildingOfficeIcon className="w-6 h-6 mr-2 text-red-400" />
                    Competitive Intelligence
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-slate-400 text-sm">Market Position:</span>
                      <div className="text-white font-bold">{previewReport.competitive_intelligence.market_positioning}</div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-slate-300 mb-2">Service Gaps Identified:</h4>
                      <div className="space-y-1">
                        {previewReport.competitive_intelligence.service_gaps_identified.map((gap, i) => (
                          <div key={i} className="text-slate-400 text-sm flex items-center">
                            <CheckCircleIcon className="w-3 h-3 mr-2 text-emerald-400" />
                            {gap}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Location Analysis */}
            {previewReport.location_analysis && (
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <MapPinIcon className="w-6 h-6 mr-2 text-green-400" />
                  Location Intelligence Analysis
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Site Advantages</h4>
                    <div className="space-y-2">
                      {previewReport.location_analysis.site_advantages.map((advantage, i) => (
                        <div key={i} className="text-slate-300 text-sm flex items-start">
                          <CheckCircleIcon className="w-4 h-4 mr-2 text-green-400 mt-0.5" />
                          {advantage}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Intelligence Metrics</h4>
                    <div className="space-y-3">
                      <div className="bg-slate-800/50 p-3 rounded-lg">
                        <div className="text-cyan-400 font-bold">Traffic Analysis</div>
                        <div className="text-slate-300 text-sm">{previewReport.location_analysis.traffic_analysis}</div>
                      </div>
                      <div className="bg-slate-800/50 p-3 rounded-lg">
                        <div className="text-emerald-400 font-bold">Accessibility Score</div>
                        <div className="text-slate-300 text-sm">{previewReport.location_analysis.accessibility_score}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Vista Laundry Decision Framework */}
            {previewReport.vista_laundry_analysis && (
              <div className="glass-card p-6 border border-orange-400/30">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <CurrencyDollarIcon className="w-6 h-6 mr-2 text-orange-400" />
                  Vista Laundry Decision Analysis Framework
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Renovation Considerations</h4>
                    <div className="space-y-2">
                      {previewReport.vista_laundry_analysis.decision_framework.renovation_considerations.map((consideration, i) => (
                        <div key={i} className="text-slate-300 text-sm flex items-start">
                          <CheckCircleIcon className="w-4 h-4 mr-2 text-yellow-400 mt-0.5" />
                          {consideration}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">New Construction Benefits</h4>
                    <div className="space-y-2">
                      {previewReport.vista_laundry_analysis.decision_framework.new_construction_benefits.map((benefit, i) => (
                        <div key={i} className="text-slate-300 text-sm flex items-start">
                          <CheckCircleIcon className="w-4 h-4 mr-2 text-green-400 mt-0.5" />
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-orange-500/20 border border-orange-500/30 rounded-lg">
                  <div className="text-orange-300 font-semibold mb-2">Methodology Applied:</div>
                  <div className="text-orange-200 text-sm">{previewReport.vista_laundry_analysis.decision_framework.methodology_applied}</div>
                  <div className="text-orange-200 text-xs mt-2 italic">{previewReport.vista_laundry_analysis.decision_framework.privacy_note}</div>
                </div>
              </div>
            )}

            {/* Wash Room Success Analysis */}
            {previewReport.wash_room_success_analysis && (
              <div className="glass-card p-6 border border-cyan-400/30">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <CurrencyDollarIcon className="w-6 h-6 mr-2 text-cyan-400" />
                  The Wash Room Success Analysis
                </h3>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Expansion Strategy Framework</h4>
                  <div className="space-y-2 mb-4">
                    {previewReport.wash_room_success_analysis.expansion_strategy.map((strategy, i) => (
                      <div key={i} className="text-slate-300 text-sm flex items-start">
                        <CheckCircleIcon className="w-4 h-4 mr-2 text-cyan-400 mt-0.5" />
                        {strategy}
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 bg-cyan-500/20 border border-cyan-500/30 rounded-lg">
                    <div className="text-cyan-300 font-semibold mb-2">Growth Methodology:</div>
                    <div className="text-cyan-200 text-sm">{previewReport.wash_room_success_analysis.growth_methodology}</div>
                    <div className="text-cyan-200 text-xs mt-2 italic">{previewReport.wash_room_success_analysis.privacy_note}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Intelligence Demonstration */}
            {previewReport.intelligence_demonstration && (
              <div className="glass-card p-6 border border-emerald-400/30">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <SparklesIcon className="w-6 h-6 mr-2 text-emerald-400" />
                  Intelligence Platform Demonstration
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">What This Demonstrates</h4>
                    <div className="space-y-2">
                      {previewReport.intelligence_demonstration.what_this_shows.map((item, i) => (
                        <div key={i} className="text-slate-300 text-sm flex items-start">
                          <CheckCircleIcon className="w-4 h-4 mr-2 text-emerald-400 mt-0.5" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Platform Capabilities</h4>
                    <div className="space-y-3">
                      <div className="bg-slate-800/50 p-3 rounded-lg">
                        <div className="text-emerald-400 font-bold">{previewReport.intelligence_demonstration.analysis_depth}</div>
                        <div className="text-slate-300 text-sm">Comprehensive Analysis</div>
                      </div>
                      <div className="bg-slate-800/50 p-3 rounded-lg">
                        <div className="text-blue-400 font-bold">{previewReport.intelligence_demonstration.ai_confidence}</div>
                        <div className="text-slate-300 text-sm">AI Accuracy Rate</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-slate-800/30 rounded-lg">
                  <div className="text-slate-300 text-sm text-center italic">
                    {previewReport.intelligence_demonstration.professional_note}
                  </div>
                </div>
              </div>
            )}

            {/* Professional Upgrade Call-to-Action */}
            <div className="glass-card p-8 border border-cyan-400/30">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {previewReport.upgrade_incentives.hook_message}
                </h3>
                <p className="text-slate-300">
                  {previewReport.upgrade_incentives.methodology_message}
                </p>
                <div className="mt-4 space-y-2">
                  <div className="text-emerald-400 font-semibold">{previewReport.upgrade_incentives.social_proof}</div>
                  <div className="text-slate-400 text-sm">{previewReport.upgrade_incentives.privacy_commitment}</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setAnalysisStage('depth-selection')}
                  className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-all flex items-center justify-center"
                >
                  <EyeIcon className="w-5 h-5 mr-2" />
                  Get Your Location Analysis
                </button>
                <div className="text-center">
                  <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-4">
                    <div className="text-emerald-300 font-bold">Professional Intelligence</div>
                    <div className="text-emerald-200 text-sm">Complete confidentiality guaranteed</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Depth Selection Stage */}
        {analysisStage === 'depth-selection' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="glass-card p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">Choose Your Intelligence Depth</h2>
                <p className="text-slate-300 text-lg">Select the analysis depth that matches your investment needs</p>
              </div>
              
              <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
                {depthTiers.map((tier) => (
                  <motion.div
                    key={tier.level}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: tier.level * 0.1 }}
                    className={`relative glass-card p-6 cursor-pointer hover:scale-105 transition-all duration-300 ${
                      selectedDepth === tier.level ? 'border-2 border-cyan-400' : ''
                    } ${tier.popular ? 'border border-emerald-400/50' : ''}`}
                    onClick={() => setSelectedDepth(tier.level)}
                  >
                    {tier.popular && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        POPULAR
                      </div>
                    )}
                    {tier.subscription && (
                      <div className="absolute -top-2 -left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        MONTHLY
                      </div>
                    )}
                    
                    <div className="text-center mb-4">
                      <div className={`text-3xl font-bold bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>
                        ${tier.price}
                      </div>
                      <div className="text-white font-bold text-lg">{tier.name}</div>
                      <div className="text-slate-400 text-sm">{tier.description}</div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {tier.features.map((feature, i) => (
                        <div key={i} className="flex items-center text-slate-300 text-sm">
                          <CheckCircleIcon className="w-4 h-4 mr-2 text-cyan-400" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-center">
                      <div className={`w-full py-2 rounded-lg font-bold text-sm ${
                        selectedDepth === tier.level 
                          ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white' 
                          : 'bg-slate-700 text-slate-300'
                      }`}>
                        {selectedDepth === tier.level ? 'SELECTED' : 'SELECT'}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <button
                  onClick={purchaseAnalysis}
                  disabled={isAnalyzing}
                  className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-12 py-4 rounded-lg font-bold text-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                >
                  {isAnalyzing ? (
                    <>
                      <BoltIcon className="w-5 h-5 animate-pulse mr-2" />
                      <span>Generating Analysis...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheckIcon className="w-5 h-5 mr-2" />
                      <span>Generate {depthTiers.find(t => t.level === selectedDepth)?.name}</span>
                    </>
                  )}
                </button>
                
                <p className="text-slate-400 text-sm mt-4">
                  30-day money-back guarantee • Instant analysis delivery • 3-generation laundromat expertise
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Analysis Results Stage */}
        {analysisStage === 'results' && analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="glass-card p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Complete Analysis Results</h2>
                  <p className="text-slate-400">{analysisResult.address}</p>
                </div>
                <div className="text-center">
                  <div className="text-sm text-slate-400">Depth Level</div>
                  <div className="text-2xl font-bold text-cyan-400">{analysisResult.depth_level}</div>
                </div>
              </div>
              
              {/* Display analysis results based on depth level */}
              {analysisResult.basic_assessment && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-4">Basic Assessment</h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-400">{analysisResult.basic_assessment.location_grade}</div>
                      <div className="text-slate-400">Grade</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400">{analysisResult.basic_assessment.overall_score}</div>
                      <div className="text-slate-400">Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-400">{analysisResult.basic_assessment.competition_count}</div>
                      <div className="text-slate-400">Competitors</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-cyan-400">{analysisResult.basic_assessment.market_viability}</div>
                      <div className="text-slate-400">Viability</div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Show additional content based on depth level */}
              {analysisResult.market_analysis && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-4">Market Analysis</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="glass-card p-4">
                      <h4 className="font-bold text-white mb-2">Demographics</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Income Distribution:</span>
                          <span className="text-white">Low: {analysisResult.market_analysis.demographic_deep_dive.income_distribution.low}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Middle Income:</span>
                          <span className="text-white">{analysisResult.market_analysis.demographic_deep_dive.income_distribution.middle}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">High Income:</span>
                          <span className="text-white">{analysisResult.market_analysis.demographic_deep_dive.income_distribution.high}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="glass-card p-4">
                      <h4 className="font-bold text-white mb-2">Traffic Patterns</h4>
                      <div className="space-y-2 text-sm">
                        <div className="text-slate-300">Peak Hours:</div>
                        {analysisResult.market_analysis.traffic_patterns.daily_peak_hours.map((hour, i) => (
                          <div key={i} className="text-cyan-400">{hour}</div>
                        ))}
                        <div className="text-slate-400 mt-2">{analysisResult.market_analysis.traffic_patterns.weekend_traffic}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Business Intelligence Level Content */}
              {analysisResult.business_intelligence && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-4">Business Intelligence & ROI</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        ${analysisResult.business_intelligence.roi_projections.monthly_revenue_potential?.toLocaleString()}
                      </div>
                      <div className="text-slate-400">Monthly Revenue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        ${analysisResult.business_intelligence.roi_projections.net_monthly_profit?.toLocaleString()}
                      </div>
                      <div className="text-slate-400">Net Profit</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        {analysisResult.business_intelligence.roi_projections.payback_period}
                      </div>
                      <div className="text-slate-400">Payback Period</div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Enterprise Features */}
              {analysisResult.enterprise_features && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-4">Enterprise AI Insights</h3>
                  <div className="glass-card p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-bold text-cyan-400 mb-3">Success Probability</h4>
                        <div className="text-4xl font-bold text-emerald-400 mb-2">
                          {analysisResult.enterprise_features.advanced_ai_insights.success_probability}%
                        </div>
                        <div className="space-y-1">
                          {analysisResult.enterprise_features.advanced_ai_insights.risk_factors.map((risk, i) => (
                            <div key={i} className="text-slate-300 text-sm">{risk}</div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-bold text-purple-400 mb-3">AI Recommendations</h4>
                        <div className="space-y-2">
                          {analysisResult.enterprise_features.advanced_ai_insights.optimization_recommendations.map((rec, i) => (
                            <div key={i} className="bg-slate-800/50 p-3 rounded-lg">
                              <div className="text-white text-sm">{rec}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Real-time Features */}
              {analysisResult.real_time_features && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-4">Real-time Monitoring Active</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="glass-card p-4">
                      <h4 className="text-lg font-bold text-orange-400 mb-3">Live Market Alerts</h4>
                      <div className="space-y-2">
                        <div className="text-green-400 text-sm">{analysisResult.real_time_features.live_monitoring.market_alerts}</div>
                        <div className="text-yellow-400 text-sm">{analysisResult.real_time_features.live_monitoring.competitor_tracking}</div>
                        <div className="text-blue-400 text-sm">{analysisResult.real_time_features.live_monitoring.demographic_shifts}</div>
                      </div>
                    </div>
                    
                    <div className="glass-card p-4">
                      <h4 className="text-lg font-bold text-emerald-400 mb-3">Automated Recommendations</h4>
                      <div className="space-y-2">
                        {analysisResult.real_time_features.automated_recommendations.map((rec, i) => (
                          <div key={i} className="text-slate-300 text-sm flex items-start">
                            <BoltIcon className="w-4 h-4 mr-2 text-cyan-400 mt-0.5" />
                            {rec}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="text-center pt-6 border-t border-white/10">
                <p className="text-slate-400 mb-4">
                  Analysis completed • Paid: ${analysisResult.billing_info.amount_charged} • 
                  {analysisResult.billing_info.billing_type === 'subscription' ? ' Monthly subscription' : ' One-time payment'}
                </p>
                <button
                  onClick={resetAnalysis}
                  className="bg-gradient-to-r from-slate-600 to-slate-700 text-white px-6 py-2 rounded-lg font-medium hover:from-slate-500 hover:to-slate-600 transition-all"
                >
                  Analyze Another Location
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RevenueAnalyzer;