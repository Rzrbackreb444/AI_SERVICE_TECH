import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CodeBracketIcon,
  CpuChipIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  KeyIcon,
  ClipboardDocumentIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import Navbar from './Navbar';

const APIDocumentation = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedCode, setCopiedCode] = useState('');

  const apiEndpoints = [
    {
      method: 'POST',
      endpoint: '/api/analyze/location',
      description: 'Analyze a specific location with AI intelligence',
      parameters: [
        { name: 'address', type: 'string', required: true, description: 'Full address to analyze' },
        { name: 'depth_level', type: 'integer', required: false, description: 'Analysis depth 1-5 (default: 3)' },
        { name: 'include_financials', type: 'boolean', required: false, description: 'Include ROI projections' }
      ],
      response: {
        location_grade: 'A+',
        market_score: 92,
        demographics: { population: 88000, median_income: 52400 },
        competition: { total_competitors: 4, density: 'medium' },
        roi_projections: { monthly_revenue: 23750, payback_months: 14 }
      }
    },
    {
      method: 'GET',
      endpoint: '/api/markets/trends',
      description: 'Get market trends and forecasts for specific regions',
      parameters: [
        { name: 'region', type: 'string', required: true, description: 'Geographic region (state/city)' },
        { name: 'industry', type: 'string', required: false, description: 'Industry focus (laundromat/healthcare)' },
        { name: 'timeframe', type: 'string', required: false, description: 'Forecast period (1y/3y/5y)' }
      ],
      response: {
        region: 'Arkansas',
        growth_rate: '12%',
        market_saturation: 'low',
        opportunities: ['rural expansion', 'premium services'],
        forecast: { year_1: '15% growth', year_3: '42% growth' }
      }
    },
    {
      method: 'POST',
      endpoint: '/api/portfolio/analyze',
      description: 'Multi-location portfolio analysis and optimization',
      parameters: [
        { name: 'locations', type: 'array', required: true, description: 'Array of location objects' },
        { name: 'analysis_type', type: 'string', required: false, description: 'portfolio/expansion/optimization' },
        { name: 'benchmark', type: 'boolean', required: false, description: 'Include industry benchmarks' }
      ],
      response: {
        portfolio_score: 89,
        total_locations: 3,
        performance: { top_performer: 'Phoenix Ave', lowest: 'Kelly Highway' },
        recommendations: ['expand in Van Buren', 'optimize Kelly Highway hours'],
        projected_revenue: 847500
      }
    },
    {
      method: 'GET',
      endpoint: '/api/whitelabel/config',
      description: 'White-label configuration for healthcare/custom branding',
      parameters: [
        { name: 'brand_id', type: 'string', required: true, description: 'Your white-label brand identifier' },
        { name: 'industry', type: 'string', required: true, description: 'healthcare/retail/custom' },
        { name: 'customizations', type: 'object', required: false, description: 'Branding customizations' }
      ],
      response: {
        brand_config: { name: 'SiteAtlas Health', logo_url: '...', colors: '...' },
        industry_templates: ['hospital', 'clinic', 'urgent_care'],
        analysis_modules: ['patient_flow', 'demographics', 'accessibility'],
        pricing_tier: 'enterprise'
      }
    }
  ];

  const codeExamples = {
    javascript: `// LaundroTech API - Location Analysis
const response = await fetch('https://api.laundrotech.xyz/api/analyze/location', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    address: "123 Main Street, Fort Smith, AR 72901",
    depth_level: 3,
    include_financials: true
  })
});

const analysis = await response.json();
console.log('Location Grade:', analysis.location_grade);
console.log('ROI Projection:', analysis.roi_projections);`,

    python: `import requests

# LaundroTech API - Location Analysis
url = "https://api.laundrotech.xyz/api/analyze/location"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
data = {
    "address": "123 Main Street, Fort Smith, AR 72901",
    "depth_level": 3,
    "include_financials": True
}

response = requests.post(url, headers=headers, json=data)
analysis = response.json()

print(f"Location Grade: {analysis['location_grade']}")
print(f"Market Score: {analysis['market_score']}")`,

    curl: `curl -X POST https://api.laundrotech.xyz/api/analyze/location \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "address": "123 Main Street, Fort Smith, AR 72901",
    "depth_level": 3,
    "include_financials": true
  }'`
  };

  const pricingTiers = [
    {
      name: 'API Starter',
      price: '$99/month',
      requests: '1,000 requests/month',
      features: ['Basic location analysis', 'Standard support', 'JSON responses'],
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'API Professional', 
      price: '$299/month',
      requests: '5,000 requests/month',
      features: ['Advanced analytics', 'Portfolio analysis', 'Priority support', 'Webhooks'],
      color: 'from-cyan-500 to-emerald-500',
      popular: true
    },
    {
      name: 'API Enterprise',
      price: '$999/month', 
      requests: 'Unlimited requests',
      features: ['White-label config', 'Custom endpoints', 'SLA guarantee', 'Account manager'],
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const copyToClipboard = (code, language) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(language);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            API <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Documentation</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto mb-8">
            Integrate LaundroTech Intelligence directly into your applications. Enterprise-grade APIs for location analysis, 
            market intelligence, and white-label healthcare solutions.
          </p>
          <div className="flex items-center justify-center space-x-8 text-slate-400">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">99.9%</div>
              <div className="text-sm">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">&lt;200ms</div>
              <div className="text-sm">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">24/7</div>
              <div className="text-sm">Support</div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center space-x-1 mb-12 bg-slate-800/30 rounded-xl p-2">
          {['overview', 'endpoints', 'examples', 'pricing'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === tab 
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="glass-card p-8">
                  <CpuChipIcon className="w-12 h-12 text-cyan-400 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-4">AI-Powered Analysis</h3>
                  <p className="text-slate-300 mb-6">
                    Access the same 94.2% accurate AI algorithms that power our platform. 
                    Analyze 156+ data points in real-time for any location.
                  </p>
                  <ul className="space-y-2 text-slate-400">
                    <li className="flex items-center"><CheckCircleIcon className="w-4 h-4 mr-2 text-emerald-400" />Demographics analysis</li>
                    <li className="flex items-center"><CheckCircleIcon className="w-4 h-4 mr-2 text-emerald-400" />Competition intelligence</li>
                    <li className="flex items-center"><CheckCircleIcon className="w-4 h-4 mr-2 text-emerald-400" />ROI projections</li>
                    <li className="flex items-center"><CheckCircleIcon className="w-4 h-4 mr-2 text-emerald-400" />Market forecasting</li>
                  </ul>
                </div>

                <div className="glass-card p-8">
                  <GlobeAltIcon className="w-12 h-12 text-emerald-400 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-4">White-Label Ready</h3>
                  <p className="text-slate-300 mb-6">
                    Rebrand our intelligence platform for healthcare, retail, or any location-based industry. 
                    SiteAtlas healthcare solutions included.
                  </p>
                  <ul className="space-y-2 text-slate-400">
                    <li className="flex items-center"><CheckCircleIcon className="w-4 h-4 mr-2 text-emerald-400" />Custom branding</li>
                    <li className="flex items-center"><CheckCircleIcon className="w-4 h-4 mr-2 text-emerald-400" />Healthcare templates</li>
                    <li className="flex items-center"><CheckCircleIcon className="w-4 h-4 mr-2 text-emerald-400" />Industry-specific modules</li>
                    <li className="flex items-center"><CheckCircleIcon className="w-4 h-4 mr-2 text-emerald-400" />Partner revenue sharing</li>
                  </ul>
                </div>
              </div>

              <div className="glass-card p-8">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Getting Started</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <KeyIcon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">1. Get API Key</h4>
                    <p className="text-slate-400 text-sm">Contact nick@laundrotech.xyz for your enterprise API credentials</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <CodeBracketIcon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">2. Integrate</h4>
                    <p className="text-slate-400 text-sm">Use our RESTful APIs with any programming language</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <ShieldCheckIcon className="w-6 h-6 text-purple-400" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">3. Scale</h4>
                    <p className="text-slate-400 text-sm">Enterprise support and white-label options available</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'endpoints' && (
            <motion.div
              key="endpoints"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-8">
                {apiEndpoints.map((endpoint, index) => (
                  <div key={index} className="glass-card p-8">
                    <div className="flex items-center space-x-4 mb-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        endpoint.method === 'POST' ? 'bg-green-500/20 text-green-400' : 
                        endpoint.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="text-cyan-400 font-mono text-lg">{endpoint.endpoint}</code>
                    </div>
                    
                    <p className="text-slate-300 mb-6">{endpoint.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-lg font-bold text-white mb-4">Parameters</h4>
                        <div className="space-y-3">
                          {endpoint.parameters.map((param, paramIndex) => (
                            <div key={paramIndex} className="bg-slate-800/30 p-4 rounded-lg">
                              <div className="flex items-center space-x-2 mb-2">
                                <code className="text-cyan-400 font-mono">{param.name}</code>
                                <span className="text-slate-500">•</span>
                                <span className="text-slate-400 text-sm">{param.type}</span>
                                {param.required && (
                                  <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs">required</span>
                                )}
                              </div>
                              <p className="text-slate-300 text-sm">{param.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-bold text-white mb-4">Response Example</h4>
                        <div className="bg-slate-900/50 p-4 rounded-lg overflow-x-auto">
                          <pre className="text-sm text-slate-300">
                            <code>{JSON.stringify(endpoint.response, null, 2)}</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'examples' && (
            <motion.div
              key="examples"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-8">
                {Object.entries(codeExamples).map(([language, code]) => (
                  <div key={language} className="glass-card p-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white capitalize">{language}</h3>
                      <button
                        onClick={() => copyToClipboard(code, language)}
                        className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        {copiedCode === language ? (
                          <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <ClipboardDocumentIcon className="w-4 h-4" />
                        )}
                        <span>{copiedCode === language ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="bg-slate-900/50 p-6 rounded-lg overflow-x-auto">
                      <pre className="text-sm">
                        <code className="text-slate-300">{code}</code>
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'pricing' && (
            <motion.div
              key="pricing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {pricingTiers.map((tier, index) => (
                  <div key={index} className={`glass-card p-8 hover:scale-105 transition-all duration-300 ${
                    tier.popular ? 'border-2 border-cyan-400' : ''
                  }`}>
                    {tier.popular && (
                      <div className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-4 py-1 rounded-full text-sm font-bold text-center mb-4">
                        Most Popular
                      </div>
                    )}
                    <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                    <div className={`text-4xl font-bold bg-gradient-to-r ${tier.color} bg-clip-text text-transparent mb-4`}>
                      {tier.price}
                    </div>
                    <div className="text-slate-400 mb-6">{tier.requests}</div>
                    <div className="space-y-3 mb-8">
                      {tier.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-slate-300">
                          <CheckCircleIcon className="w-4 h-4 mr-3 text-emerald-400" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <a
                      href="mailto:nick@laundrotech.xyz"
                      className={`w-full text-center block py-3 rounded-lg font-semibold transition-all duration-300 ${
                        tier.popular 
                          ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white hover:shadow-lg' 
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      Get Started
                    </a>
                  </div>
                ))}
              </div>

              <div className="glass-card p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Enterprise & White-Label Solutions</h3>
                <p className="text-slate-300 mb-6 max-w-3xl mx-auto">
                  Need custom integration, healthcare modules, or white-label solutions? 
                  We offer enterprise packages with dedicated support, custom endpoints, and revenue sharing partnerships.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="mailto:nick@laundrotech.xyz"
                    className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-all"
                  >
                    Contact Enterprise Sales
                  </a>
                  <a
                    href="mailto:nick@laundrotech.xyz"
                    className="bg-white/10 border border-white/20 text-white px-8 py-3 rounded-lg font-bold hover:bg-white/20 transition-all"
                  >
                    Schedule Demo
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default APIDocumentation;