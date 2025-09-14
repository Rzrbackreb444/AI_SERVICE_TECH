import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  GlobeAmericasIcon,
  FireIcon,
  BoltIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { Loader } from '@googlemaps/js-api-loader';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Google Maps and Mapbox configuration
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const EnterpriseLocationAnalyzer = () => {
  const [address, setAddress] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showStreetView, setShowStreetView] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Refs for maps
  const googleMapRef = useRef(null);
  const streetViewRef = useRef(null);
  const mapboxRef = useRef(null);
  const mapboxMapRef = useRef(null);
  
  // Analysis steps for progress indication
  const analysisSteps = [
    { name: 'Geocoding Location', description: 'Finding precise coordinates' },
    { name: 'Census Demographics', description: 'Gathering population data' },
    { name: 'Real Estate Analysis', description: 'Property values & market data' },
    { name: 'Competition Intelligence', description: 'Mapping nearby laundromats' },
    { name: 'Traffic Analysis', description: 'Foot traffic patterns' },
    { name: 'Scoring Algorithm', description: 'Calculating final score' },
    { name: 'Report Generation', description: 'Creating comprehensive report' }
  ];

  useEffect(() => {
    // Initialize Mapbox
    if (MAPBOX_ACCESS_TOKEN && MAPBOX_ACCESS_TOKEN !== 'YOUR_MAPBOX_TOKEN') {
      mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
    }
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const analyzeLocation = async () => {
    if (!address.trim()) {
      alert('Please enter a valid address');
      return;
    }

    setIsAnalyzing(true);
    setCurrentStep(0);
    setAnalysisResult(null);

    try {
      // Start comprehensive analysis
      const response = await axios.post(`${API}/enterprise-analysis/comprehensive`, {
        address: address.trim(),
        analysis_type: 'full'
      }, {
        headers: getAuthHeaders(),
      });

      if (response.data.success) {
        setAnalysisResult(response.data.analysis);
        
        // Initialize maps after getting results
        await initializeMaps(response.data.analysis);
        
        setCurrentStep(analysisSteps.length);
      } else {
        throw new Error(response.data.error || 'Analysis failed');
      }

    } catch (error) {
      console.error('Analysis error:', error);
      alert(`Analysis failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const initializeMaps = async (analysisData) => {
    const coordinates = analysisData.location?.coordinates;
    if (!coordinates) return;

    const { lat, lng } = coordinates;

    // Initialize Google Maps and Street View
    if (GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY') {
      try {
        const loader = new Loader({
          apiKey: GOOGLE_MAPS_API_KEY,
          version: "weekly",
          libraries: ["places", "geometry"]
        });

        const google = await loader.load();
        
        // Initialize Google Map
        if (googleMapRef.current) {
          const map = new google.maps.Map(googleMapRef.current, {
            center: { lat, lng },
            zoom: 15,
            mapTypeId: 'roadmap'
          });

          // Mark the analyzed location
          new google.maps.Marker({
            position: { lat, lng },
            map: map,
            title: 'Analyzed Location',
            icon: {
              url: 'data:image/svg+xml;base64,' + btoa(`
                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="15" fill="#10B981" stroke="#ffffff" stroke-width="3"/>
                  <text x="20" y="25" text-anchor="middle" fill="white" font-size="20">📍</text>
                </svg>
              `),
              scaledSize: new google.maps.Size(40, 40)
            }
          });

          // Add competitor markers
          if (analysisData.competition?.competitors) {
            analysisData.competition.competitors.forEach((competitor, index) => {
              if (competitor.coordinates) {
                const marker = new google.maps.Marker({
                  position: { 
                    lat: competitor.coordinates.lat, 
                    lng: competitor.coordinates.lng 
                  },
                  map: map,
                  title: competitor.name,
                  icon: {
                    url: 'data:image/svg+xml;base64,' + btoa(`
                      <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="15" cy="15" r="12" fill="#EF4444" stroke="#ffffff" stroke-width="2"/>
                        <text x="15" y="19" text-anchor="middle" fill="white" font-size="14">🏪</text>
                      </svg>
                    `),
                    scaledSize: new google.maps.Size(30, 30)
                  }
                });

                // Add info window
                const infoWindow = new google.maps.InfoWindow({
                  content: `
                    <div style="padding: 10px;">
                      <h3 style="margin: 0 0 5px 0; color: #1f2937;">${competitor.name}</h3>
                      <p style="margin: 0; color: #6b7280;">Distance: ${competitor.distance_miles} miles</p>
                      <p style="margin: 0; color: #6b7280;">Rating: ${competitor.rating}/5 (${competitor.review_count} reviews)</p>
                      <p style="margin: 5px 0 0 0; color: #ef4444;">Threat Level: ${competitor.threat_level}</p>
                    </div>
                  `
                });

                marker.addListener('click', () => {
                  infoWindow.open(map, marker);
                });
              }
            });
          }
        }

        // Initialize Street View
        if (streetViewRef.current) {
          const streetView = new google.maps.StreetViewPanorama(streetViewRef.current, {
            position: { lat, lng },
            pov: { heading: 0, pitch: 0 },
            zoom: 1
          });
        }

      } catch (error) {
        console.error('Google Maps initialization error:', error);
      }
    }

    // Initialize Mapbox map
    if (mapboxRef.current && MAPBOX_ACCESS_TOKEN && MAPBOX_ACCESS_TOKEN !== 'YOUR_MAPBOX_TOKEN') {
      try {
        const map = new mapboxgl.Map({
          container: mapboxRef.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [lng, lat],
          zoom: 14
        });

        mapboxMapRef.current = map;

        map.on('load', () => {
          // Add heatmap layer for demographic data
          if (analysisData.demographics) {
            // Create demographic heatmap
            const heatmapData = {
              type: 'FeatureCollection',
              features: [{
                type: 'Feature',
                properties: {
                  population: analysisData.demographics.total_population,
                  income: analysisData.demographics.median_household_income,
                  renters: analysisData.demographics.renter_percentage
                },
                geometry: {
                  type: 'Point',
                  coordinates: [lng, lat]
                }
              }]
            };

            map.addSource('demographic-data', {
              type: 'geojson',
              data: heatmapData
            });

            map.addLayer({
              id: 'demographic-heatmap',
              type: 'heatmap',
              source: 'demographic-data',
              maxzoom: 15,
              paint: {
                'heatmap-weight': [
                  'interpolate',
                  ['linear'],
                  ['get', 'population'],
                  0, 0,
                  10000, 1
                ],
                'heatmap-intensity': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  0, 1,
                  15, 3
                ],
                'heatmap-color': [
                  'interpolate',
                  ['linear'],
                  ['heatmap-density'],
                  0, 'rgba(33,102,172,0)',
                  0.2, 'rgb(103,169,207)',
                  0.4, 'rgb(209,229,240)',
                  0.6, 'rgb(253,219,199)',
                  0.8, 'rgb(239,138,98)',
                  1, 'rgb(178,24,43)'
                ],
                'heatmap-radius': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  0, 2,
                  15, 20
                ]
              }
            });
          }

          // Add location marker
          const el = document.createElement('div');
          el.className = 'mapbox-marker';
          el.style.backgroundColor = '#10B981';
          el.style.width = '20px';
          el.style.height = '20px';
          el.style.borderRadius = '50%';
          el.style.border = '3px solid white';

          new mapboxgl.Marker(el)
            .setLngLat([lng, lat])
            .setPopup(new mapboxgl.Popup({ offset: 25 })
              .setHTML(`<h3>${analysisData.location.formatted_address}</h3>`))
            .addTo(map);
        });

      } catch (error) {
        console.error('Mapbox initialization error:', error);
      }
    }
  };

  const downloadPDFReport = async () => {
    if (!analysisResult) return;

    try {
      const response = await axios.post(`${API}/enterprise-analysis/generate-pdf`, {
        analysis_data: analysisResult
      }, {
        headers: getAuthHeaders(),
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `SiteAtlas_Analysis_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('PDF download error:', error);
      alert('Failed to generate PDF report');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 65) return 'text-blue-400';
    if (score >= 50) return 'text-yellow-400';
    if (score >= 35) return 'text-orange-400';
    return 'text-red-400';
  };

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'from-green-500 to-emerald-500';
    if (grade.startsWith('B')) return 'from-blue-500 to-cyan-500';
    if (grade.startsWith('C')) return 'from-yellow-500 to-orange-500';
    if (grade.startsWith('D')) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-red-700';
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
                <h1 className="text-xl font-bold text-white">Enterprise Location Analyzer</h1>
                <p className="text-slate-400 text-sm">Comprehensive intelligence with real data</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Input */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="glass-card p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Professional Location Intelligence</h2>
            <p className="text-slate-300">
              Enter any address for comprehensive analysis using Google Maps, Census data, ATTOM real estate data, and competitive intelligence
            </p>
          </div>

          <div className="flex space-x-4 max-w-2xl mx-auto">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter full address (e.g., 123 Main Street, City, State)"
              className="flex-1 bg-slate-800/50 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
              disabled={isAnalyzing}
              onKeyPress={(e) => e.key === 'Enter' && !isAnalyzing && analyzeLocation()}
            />
            <button
              onClick={analyzeLocation}
              disabled={isAnalyzing || !address.trim()}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <BoltIcon className="w-5 h-5 animate-pulse" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <MagnifyingGlassIcon className="w-5 h-5" />
                  <span>Analyze</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Analysis Progress */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card p-8 mb-8"
            >
              <h3 className="text-xl font-bold text-white mb-6 text-center">Analysis in Progress</h3>
              <div className="space-y-4">
                {analysisSteps.map((step, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index < currentStep ? 'bg-green-500' : 
                      index === currentStep ? 'bg-blue-500 animate-pulse' : 
                      'bg-slate-700'
                    }`}>
                      {index < currentStep ? (
                        <CheckCircleIcon className="w-5 h-5 text-white" />
                      ) : (
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">{step.name}</div>
                      <div className="text-slate-400 text-sm">{step.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Analysis Results */}
        <AnimatePresence>
          {analysisResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Executive Summary */}
              <div className="glass-card p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">Executive Summary</h3>
                  <button
                    onClick={downloadPDFReport}
                    className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
                  >
                    <DocumentArrowDownIcon className="w-5 h-5" />
                    <span>Download PDF</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Overall Score */}
                  <div className="text-center">
                    <div className={`text-6xl font-bold mb-2 ${getScoreColor(analysisResult.location_score?.total_score || 0)}`}>
                      {analysisResult.location_score?.total_score || 0}
                    </div>
                    <div className="text-slate-400">Overall Score</div>
                    <div className={`inline-block px-4 py-2 rounded-full text-white font-bold mt-2 bg-gradient-to-r ${getGradeColor(analysisResult.location_score?.grade || 'F')}`}>
                      Grade: {analysisResult.location_score?.grade || 'F'}
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-2">
                      {analysisResult.location_score?.recommendation || 'Unknown'}
                    </div>
                    <div className="text-slate-400">Recommendation</div>
                    <div className={`inline-block px-4 py-2 rounded-full text-white font-bold mt-2 ${
                      analysisResult.location_score?.risk_level === 'LOW' ? 'bg-green-500' :
                      analysisResult.location_score?.risk_level === 'MEDIUM' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}>
                      Risk: {analysisResult.location_score?.risk_level || 'Unknown'}
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Demographics:</span>
                      <span className="text-white font-bold">{analysisResult.location_score?.score_breakdown?.demographics || 0}/35</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Competition:</span>
                      <span className="text-white font-bold">{analysisResult.location_score?.score_breakdown?.competition || 0}/25</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Real Estate:</span>
                      <span className="text-white font-bold">{analysisResult.location_score?.score_breakdown?.real_estate || 0}/20</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Traffic:</span>
                      <span className="text-white font-bold">{analysisResult.location_score?.score_breakdown?.traffic_accessibility || 0}/20</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Maps Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Google Maps */}
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-bold text-white">Location & Competition Map</h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowStreetView(!showStreetView)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                          showStreetView ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        <EyeIcon className="w-4 h-4" />
                        <span>Street View</span>
                      </button>
                    </div>
                  </div>
                  <div className="h-96 rounded-lg overflow-hidden bg-slate-800 relative">
                    {!showStreetView ? (
                      <div ref={googleMapRef} className="w-full h-full" />
                    ) : (
                      <div ref={streetViewRef} className="w-full h-full" />
                    )}
                  </div>
                </div>

                {/* Mapbox Heatmap */}
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-bold text-white">Demographic Heatmap</h4>
                    <button
                      onClick={() => setShowHeatmap(!showHeatmap)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                        showHeatmap ? 'bg-purple-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      <GlobeAmericasIcon className="w-4 h-4" />
                      <span>Toggle Heatmap</span>
                    </button>
                  </div>
                  <div className="h-96 rounded-lg overflow-hidden bg-slate-800">
                    <div ref={mapboxRef} className="w-full h-full" />
                  </div>
                </div>
              </div>

              {/* Detailed Analysis Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Demographics */}
                <div className="glass-card p-6">
                  <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                    <ChartBarIcon className="w-6 h-6 mr-2 text-blue-400" />
                    Demographics Analysis
                  </h4>
                  {analysisResult.demographics && (
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Population:</span>
                        <span className="text-white font-bold">{analysisResult.demographics.total_population?.toLocaleString() || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Median Income:</span>
                        <span className="text-white font-bold">${analysisResult.demographics.median_household_income?.toLocaleString() || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Renter Percentage:</span>
                        <span className="text-white font-bold">{((analysisResult.demographics.renter_percentage || 0) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Target Score:</span>
                        <span className="text-white font-bold">{analysisResult.demographics.laundromat_target_score || 'N/A'}/100</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Competition */}
                <div className="glass-card p-6">
                  <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                    <BuildingOfficeIcon className="w-6 h-6 mr-2 text-red-400" />
                    Competition Analysis
                  </h4>
                  {analysisResult.competition && (
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Competitors:</span>
                        <span className="text-white font-bold">{analysisResult.competition.total_competitors || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Opportunity Score:</span>
                        <span className="text-white font-bold">{analysisResult.competition.opportunity_score || 'N/A'}/100</span>
                      </div>
                      {analysisResult.competition.competitors && analysisResult.competition.competitors.length > 0 && (
                        <div>
                          <h5 className="text-white font-medium mb-2">Nearest Competitors:</h5>
                          <div className="space-y-2">
                            {analysisResult.competition.competitors.slice(0, 3).map((comp, index) => (
                              <div key={index} className="bg-slate-800/50 p-3 rounded-lg">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="text-white font-medium">{comp.name}</div>
                                    <div className="text-slate-400 text-sm">{comp.distance_miles} miles away</div>
                                  </div>
                                  <div className={`px-2 py-1 rounded text-xs font-bold ${
                                    comp.threat_level === 'HIGH' ? 'bg-red-500 text-white' :
                                    comp.threat_level === 'MEDIUM' ? 'bg-yellow-500 text-black' :
                                    'bg-green-500 text-white'
                                  }`}>
                                    {comp.threat_level}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Financial Projections */}
              {analysisResult.financial_projections && (
                <div className="glass-card p-6">
                  <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                    <CurrencyDollarIcon className="w-6 h-6 mr-2 text-green-400" />
                    Financial Projections
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        ${analysisResult.financial_projections.monthly_revenue?.toLocaleString() || 'N/A'}
                      </div>
                      <div className="text-slate-400">Market Potential</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        ${analysisResult.financial_projections.monthly_profit?.toLocaleString() || 'N/A'}
                      </div>
                      <div className="text-slate-400">Monthly Profit</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        {analysisResult.financial_projections.roi_5_year || 'N/A'}%
                      </div>
                      <div className="text-slate-400">5-Year ROI</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Strategic Recommendations */}
              {analysisResult.recommendations && (
                <div className="glass-card p-6">
                  <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                    <ShieldCheckIcon className="w-6 h-6 mr-2 text-cyan-400" />
                    Strategic Recommendations
                  </h4>
                  <div className="space-y-4">
                    {analysisResult.recommendations.slice(0, 5).map((rec, index) => (
                      <div key={index} className="bg-slate-800/50 p-4 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            rec.priority === 'High' ? 'bg-red-500' :
                            rec.priority === 'Medium' ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="text-white font-medium mb-1">{rec.recommendation}</div>
                            <div className="text-slate-400 text-sm mb-2">{rec.reasoning}</div>
                            {rec.action_items && (
                              <div className="space-y-1">
                                {rec.action_items.map((item, i) => (
                                  <div key={i} className="text-slate-300 text-sm flex items-center">
                                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
                                    {item}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EnterpriseLocationAnalyzer;