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
  DocumentArrowDownIcon
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

  // Real-world case study data
  const realWorldCaseStudies = [
    {
      title: "The Wash Room - Phoenix Ave, Fort Smith, AR",
      description: "Multi-million dollar expansion success story",
      status: "THRIVING",
      keyMetrics: ["Rapid expansion proven", "High traffic location", "Premium equipment ROI"],
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      featured: true
    },
    {
      title: "The Wash Room - Kelly Highway Location",
      description: "Strategic market positioning analysis",
      status: "HIGH DEMAND",
      keyMetrics: ["Market gap identified", "Competitive advantage", "Proven business model"],
      image: "https://images.unsplash.com/photo-1521791055366-0d553872125f?w=400"
    },
    {
      title: "Vista Laundry Rebuild Analysis - Van Buren, AR",
      description: "Tear down vs renovate intelligence - the million dollar decision",
      status: "CRITICAL DECISION",
      keyMetrics: ["Highway 59 traffic advantage", "Log Town Road positioning", "Speed Queen investment analysis"],
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400",
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

  // Real-world case study showcase - FULL VALUE REVEAL
  const showCaseStudy = (caseStudy) => {
    setAddress(caseStudy.title);
    setAnalysisStage('preview');
    setPreviewReport({
      report_id: 'case_study_' + Date.now(),
      preview_strategy: 'full_showcase',
      generated_at: new Date().toISOString(),
      basic_info: {
        address: caseStudy.title,
        overall_grade: caseStudy.status === 'THRIVING' ? 'A+' : caseStudy.status === 'HIGH DEMAND' ? 'A' : 'B+',
        market_score: caseStudy.status === 'THRIVING' ? 92 : caseStudy.status === 'HIGH DEMAND' ? 87 : 84,
        analysis_date: new Date().toISOString()
      },
      demographics_preview: {
        population: caseStudy.title.includes('Fort Smith') ? 88000 : caseStudy.title.includes('Van Buren') ? 23000 : 15000,
        median_age: 35,
        households: caseStudy.title.includes('Fort Smith') ? 35000 : 9500,
        median_income: caseStudy.title.includes('Fort Smith') ? '$52,400' : '$48,200',
        education_demographics: {
          high_school: '34%',
          some_college: '29%',
          bachelors: '23%',
          graduate: '14%'
        },
        household_composition: 'Average 2.3 persons per household, 67% family households',
        spending_power: caseStudy.title.includes('Fort Smith') ? '$1.2B annual retail spending' : '$720M annual retail spending'
      },
      competition_overview: {
        total_competitors: caseStudy.title.includes('Vista Laundry') ? 2 : 4,
        nearest_competitor: caseStudy.title.includes('Phoenix Ave') ? 'Nearest competitor 1.2 miles' : 'Wash World 0.8 miles',
        competitive_density: caseStudy.title.includes('Vista Laundry') ? 'LOW - MAJOR OPPORTUNITY' : 'MEDIUM',
        competitor_analysis: {
          'Wash World': 'Older equipment, limited hours, no card payment',
          'Quick Clean': 'Mid-tier, moderate pricing, inconsistent maintenance',
          'Suds & Bubbles': 'Budget option, cash only, limited capacity'
        },
        market_gaps: [
          'Premium service segment completely unserved',
          'No 24/7 locations in 3-mile radius',
          'Contactless payment gap - 67% prefer card/mobile',
          'Large capacity washers missing from market'
        ],
        competitive_advantages: [
          'Speed Queen equipment = 40% faster cycles',
          'Touch-and-go payment system = convenience leader',
          'Extended hours = capture shift workers',
          'Premium positioning = 35% higher margins'
        ]
      },
      roi_preview: {
        investment_range: caseStudy.title.includes('Vista Laundry') ? '$485,000' : '$425,000',
        roi_timeline: caseStudy.title.includes('Vista Laundry') ? '16 months' : '14 months',
        detailed_projections: {
          year_1_revenue: caseStudy.title.includes('Fort Smith') ? '$285,000' : '$245,000',
          year_1_profit: caseStudy.title.includes('Fort Smith') ? '$142,500' : '$122,500',
          year_3_revenue: caseStudy.title.includes('Fort Smith') ? '$380,000' : '$320,000',
          year_3_profit: caseStudy.title.includes('Fort Smith') ? '$228,000' : '$192,000'
        },
        monthly_revenue_potential: caseStudy.title.includes('Fort Smith') ? '$23,750' : '$20,400',
        profit_margins: '50% gross margin, 32% net margin after all expenses',
        cash_flow_analysis: {
          break_even_month: caseStudy.title.includes('Vista Laundry') ? 'Month 8' : 'Month 7',
          positive_cash_flow: caseStudy.title.includes('Vista Laundry') ? 'Month 12' : 'Month 10',
          payback_period: caseStudy.title.includes('Vista Laundry') ? '16 months' : '14 months'
        }
      },
      equipment_analysis: {
        washer_count_needed: caseStudy.title.includes('Vista Laundry') ? '10 units' : '8 units',
        dryer_count_needed: caseStudy.title.includes('Vista Laundry') ? '12 units' : '10 units',
        equipment_investment: caseStudy.title.includes('Vista Laundry') ? '$156,000' : '$128,000',
        detailed_specifications: {
          'Speed Queen SC60': '4 units - Large capacity, 40lb loads',
          'Speed Queen SC40': '4 units - Standard, 27lb loads',
          'Speed Queen SC27': '2 units - Compact, 18lb loads',
          'Speed Queen Stack Dryers': '12 units - Gas, 30lb capacity each'
        },
        financing_options: 'Speed Queen financing available - 4.9% APR, 7-year terms',
        maintenance_costs: '$2,400/month - full service contract included'
      },
      market_trends: {
        market_growth: caseStudy.title.includes('Fort Smith') ? '12% annual growth' : '8% annual growth',
        demand_indicators: [
          caseStudy.title.includes('Vista Laundry') ? 'Highway 59 sees 23,000 vehicles daily' : 'Phoenix Ave traffic increased 18% since 2022',
          'New apartment complexes adding 340 units within 2 miles',
          'Median rent increased 15% - more renters = more laundromat customers',
          'University student population grew 8% (key demographic)'
        ],
        seasonal_patterns: {
          'Peak Season': 'August-December (back to school + holidays) - 25% above average',
          'Steady Season': 'January-May - baseline demand',
          'Summer Dip': 'June-July - 10% below average (vacation travel)'
        },
        growth_projections: caseStudy.title.includes('Fort Smith') ? 
          '5-year forecast: Market capacity could support 2-3 additional premium locations' :
          '5-year forecast: Market expansion likely with new residential development'
      },
      success_factors: {
        location_advantages: caseStudy.title.includes('Vista Laundry') ? [
          'Highway 59 frontage = maximum visibility',
          'Log Town Road intersection = high foot traffic',
          'Adjacent to shopping center = convenience factor',
          'Van Buren growth corridor = expanding customer base'
        ] : [
          'Phoenix Ave = main commercial artery',
          'Close to university = steady customer base',
          'Residential density = walk-in customers',
          'Public transportation route = accessibility'
        ],
        why_the_wash_room_succeeds: [
          'Premium positioning strategy = higher margins',
          'Speed Queen reliability = customer loyalty',
          'Extended hours operation = market advantage',
          'Contactless payment systems = modern convenience',
          'Clean, well-lit facilities = safety factor'
        ]
      },
      vista_laundry_decision: caseStudy.title.includes('Vista Laundry') ? {
        tear_down_vs_renovate: {
          renovation_cost: '$125,000',
          renovation_issues: [
            'Outdated plumbing cannot handle Speed Queen requirements',
            'Electrical system needs complete overhaul - $35,000',
            'Floor reinforcement needed for new equipment - $18,000',
            'HVAC inadequate for larger space - $22,000',
            'Still limited by existing footprint - only 8 washers max'
          ],
          tear_down_rebuild: '$485,000',
          rebuild_advantages: [
            'Custom design for Speed Queen equipment efficiency',
            'Optimal traffic flow and customer experience',
            '25% larger footprint = 10 washers + 12 dryers',
            'Modern electrical/plumbing from ground up',
            'ADA compliance built-in',
            'Energy efficient design = $400/month savings'
          ],
          recommendation: 'TEAR DOWN AND REBUILD',
          financial_justification: 'Additional capacity = $60,000 more annual revenue, justifying higher initial investment'
        }
      } : null,
      upgrade_incentives: {
        hook_message: caseStudy.title.includes('Vista Laundry') 
          ? 'This is the complete intelligence that powered David King\'s million-dollar decision'
          : 'This is how The Wash Room achieved their rapid expansion success',
        social_proof: 'Full analysis revealed - no paywall for real-world case studies',
        conversion_message: 'Experience this level of intelligence for your own locations'
      },
      revenue_optimization: {
        conversion_rate_boost: '100% - Full transparency builds trust',
        estimated_upgrade_probability: 'HIGH - Proven results drive conversions',
        recommended_pricing_tier: 'business_intelligence'
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

            {/* Blurred Content Sections */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Demographics Preview */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <ChartBarIcon className="w-6 h-6 mr-2 text-blue-400" />
                  Demographics Analysis
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Population:</span>
                    <span className="text-white font-bold">{previewReport.demographics_preview.population?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Median Age:</span>
                    <span className="text-white font-bold">{previewReport.demographics_preview.median_age}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Income Range:</span>
                    <span className="text-orange-400 font-bold">{previewReport.demographics_preview.median_income_range}</span>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg blur-sm">
                    <div className="text-slate-400 text-sm">{previewReport.demographics_preview.education_level}</div>
                  </div>
                </div>
              </div>

              {/* Competition Overview */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <BuildingOfficeIcon className="w-6 h-6 mr-2 text-red-400" />
                  Competition Analysis
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Competitors:</span>
                    <span className="text-white font-bold">{previewReport.competition_overview.total_competitors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nearest:</span>
                    <span className="text-white font-bold">{previewReport.competition_overview.nearest_competitor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Density:</span>
                    <span className="text-white font-bold">{previewReport.competition_overview.competitive_density}</span>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg blur-sm">
                    <div className="text-slate-400 text-sm">{previewReport.competition_overview.detailed_analysis}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ROI Preview (Heavily Blurred) */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <CurrencyDollarIcon className="w-6 h-6 mr-2 text-green-400" />
                Financial Projections
                <LockClosedIcon className="w-5 h-5 ml-2 text-orange-400" />
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center blur-sm">
                  <div className="text-2xl font-bold text-green-400">
                    {previewReport.roi_preview.monthly_revenue_potential}
                  </div>
                  <div className="text-slate-400">Monthly Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">
                    {previewReport.roi_preview.investment_range}
                  </div>
                  <div className="text-slate-400">Investment Range</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {previewReport.roi_preview.roi_timeline}
                  </div>
                  <div className="text-slate-400">ROI Timeline</div>
                </div>
              </div>
              
              <div className="mt-6 bg-slate-800/30 p-6 rounded-lg blur-md">
                <p className="text-slate-400 text-center">{previewReport.roi_preview.detailed_projections}</p>
                <p className="text-slate-400 text-center mt-2">{previewReport.roi_preview.cash_flow_analysis}</p>
              </div>
            </div>

            {/* Upgrade Call-to-Action */}
            <div className="glass-card p-8 border border-cyan-400/30">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {previewReport.upgrade_incentives.hook_message}
                </h3>
                <p className="text-slate-300">
                  {previewReport.upgrade_incentives.premium_features_locked} premium features locked • {previewReport.upgrade_incentives.social_proof}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setAnalysisStage('depth-selection')}
                  className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-all flex items-center justify-center"
                >
                  <EyeIcon className="w-5 h-5 mr-2" />
                  Unlock Full Analysis
                </button>
                <div className="text-center">
                  <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4">
                    <div className="text-orange-300 font-bold">{previewReport.upgrade_incentives.upgrade_discount}</div>
                    <div className="text-orange-200 text-sm">{previewReport.upgrade_incentives.conversion_guarantee}</div>
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