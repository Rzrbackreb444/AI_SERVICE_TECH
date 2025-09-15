import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LockClosedIcon, EyeSlashIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PreviewAnalysis = ({ address }) => {
  const [previewData, setPreviewData] = useState(null);
  const [selectedDepth, setSelectedDepth] = useState(1);
  const [loading, setLoading] = useState(false);

  const depthTiers = [
    {
      level: 1,
      name: "Basic Scout",
      price: 0,
      description: "Location grade and competition overview",
      preview: "Perfect for initial screening",
      features: ["Location Grade", "Competition Count", "Basic Demographics"]
    },
    {
      level: 2, 
      name: "Market Insights",
      price: 29,
      description: "Demographics and traffic patterns",
      preview: "Market analysis and customer insights",
      features: ["Demographic Deep Dive", "Traffic Patterns", "Market Positioning"]
    },
    {
      level: 3,
      name: "Business Intelligence", 
      price: 79,
      description: "ROI projections and equipment recommendations",
      preview: "Complete business intelligence",
      features: ["ROI Projections", "Equipment Specs", "Competition Analysis"]
    },
    {
      level: 4,
      name: "Enterprise Analysis",
      price: 199,
      description: "Full AI analysis with custom recommendations", 
      preview: "Enterprise-grade insights",
      features: ["Advanced AI", "Custom Recommendations", "Risk Analysis"]
    },
    {
      level: 5,
      name: "Real-Time Monitoring",
      price: 299,
      description: "Live market monitoring and alerts",
      preview: "Continuous intelligence",
      features: ["Live Updates", "Market Alerts", "Trend Analysis"],
      billing: "per month"
    }
  ];

  const generatePreview = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API}/revenue/analysis/preview`, {
        address: address,
        strategy: 'blur_critical_data'
      });
      setPreviewData(response.data.preview_report);
    } catch (error) {
      console.error('Preview generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const purchaseAnalysis = async (depth) => {
    try {
      const response = await axios.post(`${API}/revenue/analysis/depth-based`, {
        address: address,
        depth_level: depth
      });
      
      // Redirect to payment or show full analysis
      if (response.data.billing_info.amount_charged > 0) {
        // Redirect to payment
        window.location.href = `/payment?analysis_id=${response.data.analysis.analysis_id}&amount=${response.data.billing_info.amount_charged}`;
      } else {
        // Free tier - show results immediately
        setPreviewData(response.data.analysis);
      }
    } catch (error) {
      console.error('Analysis purchase failed:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Location Intelligence Preview
        </h2>
        <p className="text-lg text-gray-600">
          Choose your analysis depth - pay only for what you need
        </p>
      </div>

      {/* Address Display */}
      <div className="bg-blue-50 rounded-lg p-4 mb-8 text-center">
        <h3 className="text-xl font-semibold text-gray-900">Analyzing: {address}</h3>
      </div>

      {/* Depth Tier Selection */}
      <div className="grid md:grid-cols-5 gap-4 mb-8">
        {depthTiers.map((tier, index) => (
          <motion.div
            key={tier.level}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedDepth === tier.level
                ? 'border-blue-500 bg-blue-50 shadow-lg'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedDepth(tier.level)}
          >
            <div className="text-center">
              <h4 className="font-bold text-gray-900">{tier.name}</h4>
              <p className={`text-2xl font-bold mb-2 ${tier.price === 0 ? 'text-green-600' : 'text-blue-600'}`}>
                {tier.price === 0 ? 'FREE' : `$${tier.price}`}
                {tier.billing && <span className="text-sm">/{tier.billing}</span>}
              </p>
              <p className="text-sm text-gray-600 mb-3">{tier.description}</p>
              
              <div className="space-y-1">
                {tier.features.map((feature, fIndex) => (
                  <div key={fIndex} className="text-xs text-gray-500 flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Preview Button */}
      <div className="text-center mb-8">
        <button
          onClick={generatePreview}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300"
        >
          {loading ? 'Generating Preview...' : 'Generate Analysis Preview'}
        </button>
      </div>

      {/* Preview Results */}
      {previewData && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          
          {/* Basic Information (Always Shown) */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Location Assessment</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {previewData.basic_info?.overall_grade || 'B+'}
                </div>
                <p className="text-sm text-gray-600">Overall Grade</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {previewData.basic_info?.market_score || 78}
                </div>
                <p className="text-sm text-gray-600">Market Score</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {previewData.demographics_preview?.population?.toLocaleString() || '15,000'}
                </div>
                <p className="text-sm text-gray-600">Population</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {previewData.competition_overview?.total_competitors || 3}
                </div>
                <p className="text-sm text-gray-600">Competitors</p>
              </div>
            </div>
          </div>

          {/* Demographics Preview (Partially Blurred) */}
          <div className="bg-white rounded-lg shadow-lg p-6 relative">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Demographics Overview</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Population</p>
                <p className="text-lg font-semibold">{previewData.demographics_preview?.population?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Median Age</p>
                <p className="text-lg font-semibold">{previewData.demographics_preview?.median_age}</p>
              </div>
              <div className="relative">
                <p className="text-sm text-gray-600">Median Income</p>
                <div className="bg-yellow-100 border border-yellow-300 rounded p-2 text-center">
                  <LockClosedIcon className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
                  <p className="text-sm text-yellow-700 font-medium">🔒 PREMIUM DATA</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
              <p className="text-yellow-700 text-sm">
                {previewData.demographics_preview?.education_level}
              </p>
            </div>
          </div>

          {/* Competition Overview (Teaser) */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Competition Analysis</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Competition Density</p>
                <p className="text-lg font-semibold text-green-600">
                  {previewData.competition_overview?.competitive_density}
                </p>
                <p className="text-sm text-gray-500">
                  Nearest: {previewData.competition_overview?.nearest_competitor}
                </p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/80 to-gray-200/80 rounded-lg z-10 flex items-center justify-center">
                  <div className="text-center">
                    <LockClosedIcon className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="font-bold text-gray-700">LOCKED CONTENT</p>
                    <p className="text-sm text-gray-600">Upgrade to unlock detailed analysis</p>
                  </div>
                </div>
                <div className="blur-sm">
                  <p className="text-sm text-gray-600 mb-2">Detailed Analysis</p>
                  <p className="text-lg font-semibold">Competitor Strengths & Weaknesses</p>
                  <p className="text-sm text-gray-500">Market positioning opportunities</p>
                </div>
              </div>
            </div>
          </div>

          {/* ROI Projections (Heavily Blurred) */}
          <div className="bg-white rounded-lg shadow-lg p-6 relative">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Financial Projections</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Investment Range</p>
                <p className="text-lg font-semibold text-blue-600">
                  {previewData.roi_preview?.investment_range}
                </p>
                <p className="text-sm text-gray-600 mb-2">Timeline</p>
                <p className="text-lg font-semibold">
                  {previewData.roi_preview?.roi_timeline}
                </p>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-100/60 to-red-200/80 rounded-lg z-10 flex items-center justify-center">
                  <div className="text-center">
                    <EyeSlashIcon className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <p className="font-bold text-red-700">🔒 PREMIUM CONTENT</p>
                    <p className="text-sm text-red-600">Exact ROI figures locked</p>
                  </div>
                </div>
                <div className="blur-md">
                  <p className="text-sm text-gray-600 mb-2">Monthly Revenue Potential</p>
                  <p className="text-2xl font-bold text-green-600">$XX,XXX</p>
                  <p className="text-sm text-gray-600 mb-2">Profit Margins</p>
                  <p className="text-lg font-semibold">XX.X% annually</p>
                </div>
              </div>
            </div>

            {/* Upgrade Hook */}
            <div className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white text-center">
              <h4 className="text-lg font-bold mb-2">Unlock Complete Financial Analysis</h4>
              <p className="mb-4">{previewData.upgrade_incentives?.hook_message}</p>
              <p className="text-sm opacity-90 mb-4">
                {previewData.upgrade_incentives?.premium_features_locked} premium features locked • 
                {previewData.upgrade_incentives?.upgrade_discount} • 
                {previewData.upgrade_incentives?.conversion_guarantee}
              </p>
            </div>
          </div>

          {/* Equipment Teaser (Partially Shown) */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Equipment Recommendations</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Recommended Setup</p>
                <div className="space-y-2">
                  <p className="text-base">Washers: {previewData.equipment_teaser?.washer_count_needed}</p>
                  <p className="text-base">Dryers: {previewData.equipment_teaser?.dryer_count_needed}</p>
                  <p className="text-base font-semibold text-blue-600">
                    Investment: {previewData.equipment_teaser?.equipment_investment}
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-300/90 rounded-lg z-10 flex items-end justify-center pb-4">
                  <div className="text-center">
                    <LockClosedIcon className="w-6 h-6 text-gray-700 mx-auto mb-1" />
                    <p className="text-sm font-bold text-gray-700">LOCKED</p>
                  </div>
                </div>
                <div className="blur-sm">
                  <p className="text-sm text-gray-600 mb-2">Detailed Specifications</p>
                  <p className="text-base">Exact models and pricing</p>
                  <p className="text-base">Financing options available</p>
                  <p className="text-base">ROI per machine analysis</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-center p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-medium">
                {previewData.equipment_teaser?.detailed_specifications}
              </p>
            </div>
          </div>

          {/* Depth Selection & Purchase */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
              Choose Your Analysis Depth
            </h3>
            
            <div className="grid md:grid-cols-5 gap-3 mb-6">
              {depthTiers.map((tier) => (
                <button
                  key={tier.level}
                  onClick={() => setSelectedDepth(tier.level)}
                  className={`p-4 rounded-lg border transition-all ${
                    selectedDepth === tier.level
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="text-center">
                    <p className="font-bold text-sm">{tier.name}</p>
                    <p className={`text-lg font-bold ${tier.price === 0 ? 'text-green-600' : 'text-blue-600'}`}>
                      {tier.price === 0 ? 'FREE' : `$${tier.price}`}
                      {tier.billing && <span className="text-xs">/{tier.billing}</span>}
                    </p>
                    <p className="text-xs text-gray-500">{tier.preview}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Tier Details */}
            <div className="bg-white rounded-lg p-6 mb-4">
              <h4 className="font-bold text-lg mb-2">
                {depthTiers[selectedDepth - 1].name} Analysis
              </h4>
              <p className="text-gray-600 mb-4">
                {depthTiers[selectedDepth - 1].description}
              </p>
              
              <div className="grid md:grid-cols-3 gap-4">
                {depthTiers[selectedDepth - 1].features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Purchase Button */}
            <div className="text-center">
              <button
                onClick={() => purchaseAnalysis(selectedDepth)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105"
              >
                <CreditCardIcon className="w-5 h-5 inline mr-2" />
                {depthTiers[selectedDepth - 1].price === 0 
                  ? 'Get Free Analysis' 
                  : `Purchase for $${depthTiers[selectedDepth - 1].price}`}
              </button>
            </div>

          </div>

          {/* Social Proof */}
          <div className="text-center bg-green-50 rounded-lg p-6">
            <p className="text-green-700 font-medium mb-2">
              ✅ {previewData.upgrade_incentives?.social_proof}
            </p>
            <p className="text-sm text-gray-600">
              Conversion Rate: {previewData.revenue_optimization?.conversion_rate_boost} • 
              Recommended Tier: {previewData.revenue_optimization?.recommended_pricing_tier?.replace('_', ' ')}
            </p>
          </div>

        </motion.div>
      )}

      {/* Generate Preview if no data */}
      {!previewData && !loading && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg mb-4">
            See a preview of our location intelligence before you buy
          </p>
          <p className="text-sm text-gray-500">
            We'll show you exactly what quality insights you'll receive
          </p>
        </div>
      )}

    </div>
  );
};

export default PreviewAnalysis;