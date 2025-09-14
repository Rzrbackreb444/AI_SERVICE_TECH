import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  KeyIcon,
  BuildingOffice2Icon,
  ChartBarIcon,
  CurrencyDollarIcon,
  HomeIcon,
  BanknotesIcon,
  DocumentDuplicateIcon,
  SparklesIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const EnterprisePortal = () => {
  const [apiKeyData, setApiKeyData] = useState(null);
  const [bulkResults, setBulkResults] = useState(null);
  const [equipmentData, setEquipmentData] = useState(null);
  const [financingData, setFinancingData] = useState(null);
  const [realEstateDeals, setRealEstateDeals] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('api');

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const createEnterpriseAPIKey = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${API}/enterprise/api-key`, {
        organization: 'LaundroTech Enterprise Client'
      }, { headers: getAuthHeaders() });
      
      setApiKeyData(response.data);
    } catch (error) {
      console.error('Failed to create API key:', error);
    } finally {
      setLoading(false);
    }
  };

  const testBulkAnalysis = async () => {
    if (!apiKeyData?.api_key) return;
    
    try {
      setLoading(true);
      const testAddresses = [
        '123 Main St, Springfield, IL',
        '456 Oak Ave, Springfield, IL',
        '789 Pine Rd, Springfield, IL'
      ];
      
      const response = await axios.post(`${API}/enterprise/bulk-analysis`, {
        addresses: testAddresses
      }, { headers: getAuthHeaders() });
      
      setBulkResults(response.data);
    } catch (error) {
      console.error('Bulk analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEquipmentMarketplace = async () => {
    try {
      // Get user's first analysis for demo
      const analysesResponse = await axios.get(`${API}/user/analyses`, { headers: getAuthHeaders() });
      const analyses = analysesResponse.data.analyses;
      
      if (analyses.length > 0) {
        const analysisId = analyses[0].analysis_id;
        const equipmentResponse = await axios.get(`${API}/marketplace/equipment?analysis_id=${analysisId}`, {
          headers: getAuthHeaders()
        });
        setEquipmentData(equipmentResponse.data);
      }
    } catch (error) {
      console.error('Failed to load equipment marketplace:', error);
    }
  };

  const loadFinancingOptions = async () => {
    try {
      // Get user's first analysis for demo
      const analysesResponse = await axios.get(`${API}/user/analyses`, { headers: getAuthHeaders() });
      const analyses = analysesResponse.data.analyses;
      
      if (analyses.length > 0) {
        const analysisId = analyses[0].analysis_id;
        const financingResponse = await axios.post(`${API}/financing/pre-approval`, {
          analysis_id: analysisId
        }, { headers: getAuthHeaders() });
        setFinancingData(financingResponse.data);
      }
    } catch (error) {
      console.error('Failed to load financing options:', error);
    }
  };

  const loadRealEstateDeals = async () => {
    try {
      const response = await axios.get(`${API}/real-estate/deals`, { headers: getAuthHeaders() });
      setRealEstateDeals(response.data);
    } catch (error) {
      console.error('Failed to load real estate deals:', error);
    }
  };

  useEffect(() => {
    if (activeSection === 'equipment') {
      loadEquipmentMarketplace();
    } else if (activeSection === 'financing') {
      loadFinancingOptions();
    } else if (activeSection === 'real-estate') {
      loadRealEstateDeals();
    }
  }, [activeSection]);

  const SectionButton = ({ id, label, icon: Icon, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg font-medium transition-all text-left ${
        active 
          ? 'bg-blue-600 text-white shadow-lg' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🏢 Enterprise Portal
          </h1>
          <p className="text-gray-600">
            White-label API, Equipment Marketplace, Financing, and Real Estate Integration
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-4">Enterprise Features</h3>
              <div className="space-y-2">
                <SectionButton
                  id="api"
                  label="White-Label API"
                  icon={KeyIcon}
                  active={activeSection === 'api'}
                  onClick={setActiveSection}
                />
                <SectionButton
                  id="equipment"
                  label="Equipment Marketplace"
                  icon={BuildingOffice2Icon}
                  active={activeSection === 'equipment'}
                  onClick={setActiveSection}
                />
                <SectionButton
                  id="financing"
                  label="Financing Hub"
                  icon={BanknotesIcon}
                  active={activeSection === 'financing'}
                  onClick={setActiveSection}
                />
                <SectionButton
                  id="real-estate"
                  label="Real Estate Deals"
                  icon={HomeIcon}
                  active={activeSection === 'real-estate'}
                  onClick={setActiveSection}
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            
            {/* White-Label API Section */}
            {activeSection === 'api' && (
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <KeyIcon className="w-5 h-5 text-blue-600 mr-2" />
                    Enterprise API Access
                  </h3>
                  
                  {!apiKeyData ? (
                    <div className="text-center py-8">
                      <KeyIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Create Enterprise API Key</h4>
                      <p className="text-gray-600 mb-4">
                        Get white-label API access for $2,999/month
                      </p>
                      <button
                        onClick={createEnterpriseAPIKey}
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        {loading ? 'Creating...' : 'Create API Key'}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">API Credentials</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">API Key:</span>
                            <code className="ml-2 bg-gray-200 px-2 py-1 rounded">{apiKeyData.api_key}</code>
                          </div>
                          <div>
                            <span className="font-medium">Secret Key:</span>
                            <code className="ml-2 bg-gray-200 px-2 py-1 rounded">{apiKeyData.secret_key}</code>
                          </div>
                          <div>
                            <span className="font-medium">Rate Limit:</span>
                            <span className="ml-2">{apiKeyData.rate_limit}</span>
                          </div>
                          <div>
                            <span className="font-medium">Monthly Fee:</span>
                            <span className="ml-2 text-green-600 font-semibold">${apiKeyData.monthly_fee}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <button
                          onClick={testBulkAnalysis}
                          disabled={loading}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                          {loading ? 'Testing...' : 'Test Bulk Analysis'}
                        </button>
                        <a
                          href="/api/docs/enterprise"
                          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                        >
                          View Documentation
                        </a>
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Bulk Analysis Results */}
                {bulkResults && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-lg p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Bulk Analysis Results
                    </h3>
                    
                    <div className="mb-4 grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">{bulkResults.total_addresses}</p>
                        <p className="text-sm text-gray-600">Addresses Analyzed</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">{bulkResults.processing_time}</p>
                        <p className="text-sm text-gray-600">Processing Time</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-600">${bulkResults.billing_amount}</p>
                        <p className="text-sm text-gray-600">Billing Amount</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {bulkResults.results?.map((result, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-gray-900">{result.address}</p>
                              <p className="text-sm text-gray-600">
                                Score: {result.score} | Grade: {result.grade} | ROI: {(result.estimated_roi * 100).toFixed(1)}%
                              </p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              result.market_opportunity === 'High' ? 'bg-green-100 text-green-800' :
                              result.market_opportunity === 'Medium-High' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {result.market_opportunity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Equipment Marketplace Section */}
            {activeSection === 'equipment' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <BuildingOffice2Icon className="w-5 h-5 text-blue-600 mr-2" />
                  Equipment Marketplace
                </h3>
                
                {equipmentData ? (
                  <div className="space-y-6">
                    
                    {/* Washers */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Recommended Washers</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {equipmentData.recommended_washers?.map((washer, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <h5 className="font-medium text-gray-900">{washer.model}</h5>
                            <p className="text-sm text-gray-600">{washer.capacity}</p>
                            <p className="text-lg font-semibold text-green-600 mt-2">{washer.price_range}</p>
                            <p className="text-sm text-gray-600">Qty: {washer.quantity_recommended}</p>
                            <p className="text-sm text-blue-600">ROI: {washer.roi_timeline}</p>
                            <div className="mt-3 flex space-x-2">
                              <a 
                                href={washer.marketplace_link}
                                className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                              >
                                View Details
                              </a>
                              {washer.financing_available && (
                                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                                  Financing Available
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dryers */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Recommended Dryers</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {equipmentData.recommended_dryers?.map((dryer, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <h5 className="font-medium text-gray-900">{dryer.model}</h5>
                            <p className="text-sm text-gray-600">{dryer.capacity}</p>
                            <p className="text-lg font-semibold text-green-600 mt-2">{dryer.price_range}</p>
                            <p className="text-sm text-gray-600">Qty: {dryer.quantity_recommended}</p>
                            <p className="text-sm text-blue-600">ROI: {dryer.roi_timeline}</p>
                            <div className="mt-3 flex space-x-2">
                              <a 
                                href={dryer.marketplace_link}
                                className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                              >
                                View Details
                              </a>
                              {dryer.financing_available && (
                                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                                  Financing Available
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total Cost */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">Total Equipment Cost:</span>
                        <span className="text-2xl font-bold text-blue-600">
                          ${equipmentData.total_equipment_cost?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BuildingOffice2Icon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Loading equipment recommendations...</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Financing Section */}
            {activeSection === 'financing' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <BanknotesIcon className="w-5 h-5 text-green-600 mr-2" />
                  Financing Hub
                </h3>
                
                {financingData ? (
                  <div className="space-y-6">
                    
                    <div className={`p-4 rounded-lg ${
                      financingData.pre_approval_status === 'qualified' 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-yellow-50 border border-yellow-200'
                    }`}>
                      <div className="flex items-center mb-2">
                        <ShieldCheckIcon className={`w-5 h-5 mr-2 ${
                          financingData.pre_approval_status === 'qualified' ? 'text-green-600' : 'text-yellow-600'
                        }`} />
                        <span className="font-medium">
                          Pre-Approval Status: {financingData.pre_approval_status}
                        </span>
                      </div>
                      
                      {financingData.pre_approval_status === 'qualified' && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">
                              ${financingData.approved_amount?.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600">Approved Amount</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">{financingData.interest_rate}%</p>
                            <p className="text-sm text-gray-600">Interest Rate</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-purple-600">{financingData.term_months}</p>
                            <p className="text-sm text-gray-600">Term (Months)</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-orange-600">
                              ${financingData.monthly_payment?.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600">Monthly Payment</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-4">
                      <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                        Apply for Financing
                      </button>
                      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                        Get Quote
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BanknotesIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Loading financing options...</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Real Estate Section */}
            {activeSection === 'real-estate' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <HomeIcon className="w-5 h-5 text-purple-600 mr-2" />
                  Real Estate Deal Flow
                </h3>
                
                {realEstateDeals ? (
                  <div className="space-y-4">
                    <div className="text-center mb-6">
                      <p className="text-2xl font-bold text-purple-600">
                        {realEstateDeals.new_deals_this_week}
                      </p>
                      <p className="text-gray-600">New deals this week</p>
                    </div>

                    <div className="space-y-4">
                      {realEstateDeals.active_deals?.map((deal, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium text-gray-900">{deal.address}</h4>
                              <p className="text-sm text-gray-600">{deal.property_type} • {deal.size_sqft} sqft</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              deal.deal_quality === 'Excellent' ? 'bg-green-100 text-green-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {deal.deal_quality}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Purchase Price</p>
                              <p className="font-semibold">${deal.purchase_price?.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Lease Rate</p>
                              <p className="font-semibold">{deal.lease_rate}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Suitability Score</p>
                              <p className="font-semibold text-blue-600">{deal.laundromat_suitability_score}/100</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Days on Market</p>
                              <p className="font-semibold">{deal.days_on_market} days</p>
                            </div>
                          </div>
                          
                          <div className="mt-3 flex justify-between items-center">
                            <p className="text-sm text-gray-600">
                              Est. Conversion: ${deal.estimated_conversion_cost?.toLocaleString()}
                            </p>
                            <button className="bg-purple-600 text-white px-4 py-1 rounded text-sm hover:bg-purple-700">
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <HomeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Loading real estate deals...</p>
                  </div>
                )}
              </motion.div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterprisePortal;