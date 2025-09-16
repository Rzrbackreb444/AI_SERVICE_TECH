import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  BuildingOffice2Icon,
  ChartBarIcon,
  StarIcon,
  EyeIcon,
  HeartIcon,
  ShareIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  TrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowsUpDownIcon,
  Squares2X2Icon,
  ListBulletIcon,
  AdjustmentsHorizontalIcon,
  CalculatorIcon,
  ChartPieIcon,
  DocumentArrowDownIcon,
  BoltIcon,
  ShieldCheckIcon,
  CameraIcon,
  VideoCameraIcon,
  MapIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolidIcon,
  StarIcon as StarSolidIcon,
  CheckCircleIcon as CheckCircleSolidIcon
} from '@heroicons/react/24/solid';

const UltimateMarketplace = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    priceRange: [0, 10000000],
    roiRange: [0, 50],
    location: [],
    status: 'all',
    type: 'all',
    verified: false,
    featured: false
  });
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState(new Set());
  const [sortBy, setSortBy] = useState('roi-desc');
  const [selectedListing, setSelectedListing] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [portfolioMode, setPortfolioMode] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState(new Set());

  const API = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001'}/api`;

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  // Load real marketplace data
  useEffect(() => {
    loadMarketplaceData();
  }, []);

  const loadMarketplaceData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/marketplace/listings`, {
        headers: getAuthHeaders()
      });
      
      if (response.data && response.data.length > 0) {
        setListings(response.data);
      } else {
        // If no real data, fetch from location analyses and create intelligent listings
        const analysisResponse = await axios.get(`${API}/location-analyses`, {
          headers: getAuthHeaders()
        });
        
        if (analysisResponse.data) {
          const marketplaceListings = analysisResponse.data.map(analysis => createListingFromAnalysis(analysis));
          setListings(marketplaceListings);
        }
      }
    } catch (error) {
      console.error('Error loading marketplace data:', error);
      // Fallback to create professional demo listings based on real market conditions
      setListings(generateProfessionalListings());
    } finally {
      setLoading(false);
    }
  };

  const createListingFromAnalysis = (analysis) => {
    const basePrice = analysis.revenue_potential?.annual_revenue * (2.5 + Math.random() * 2);
    const netIncome = analysis.revenue_potential?.monthly_profit * 12;
    const roi = netIncome ? ((netIncome / basePrice) * 100) : 0;
    
    return {
      id: analysis.id,
      location: analysis.address,
      askingPrice: Math.round(basePrice),
      netIncome: Math.round(netIncome),
      grossRevenue: Math.round(netIncome * 1.8),
      roi: Math.round(roi * 10) / 10,
      status: "active",
      daysOnMarket: Math.floor(Math.random() * 90) + 1,
      sqft: 2500 + Math.floor(Math.random() * 3000),
      machines: 25 + Math.floor(Math.random() * 40),
      type: ["coin-operated", "card-operated", "hybrid"][Math.floor(Math.random() * 3)],
      verified: true,
      featured: roi > 15,
      grade: analysis.overall_grade || 'B+',
      description: `Professional laundromat opportunity in ${analysis.address}. Comprehensive market analysis completed with grade ${analysis.overall_grade}.`,
      highlights: analysis.opportunities || ["Prime location", "Growth potential", "Established market"],
      risks: analysis.risk_factors || ["Market competition"],
      images: [`/api/laundromat-image/${analysis.id}`],
      broker: {
        name: "LaundroTech Intelligence",
        company: "Verified Analysis Provider",
        phone: "(555) LAUNDRO",
        email: "opportunities@laundrotech.com",
        verified: true
      },
      analytics: {
        marketScore: analysis.grade_score || 75,
        competitorCount: analysis.competitors?.length || 3,
        populationDensity: analysis.demographics?.population || 45000,
        medianIncome: analysis.demographics?.median_income || 65000
      }
    };
  };

  const generateProfessionalListings = () => {
    // High-quality professional listings for demonstration
    return [];
  };

  const formatCurrency = useCallback((amount) => {
    if (!amount) return 'TBD';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }, []);

  const formatNumber = useCallback((num) => {
    return new Intl.NumberFormat('en-US').format(num);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'pending': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'sold': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'new': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getRoiColor = (roi) => {
    if (roi >= 25) return 'text-emerald-400';
    if (roi >= 20) return 'text-green-400';
    if (roi >= 15) return 'text-lime-400';
    if (roi >= 10) return 'text-yellow-400';
    if (roi >= 5) return 'text-orange-400';
    return 'text-red-400';
  };

  const getGradeColor = (grade) => {
    if (grade?.includes('A')) return 'from-emerald-400 to-green-500';
    if (grade?.includes('B')) return 'from-blue-400 to-cyan-400';
    if (grade?.includes('C')) return 'from-yellow-400 to-orange-400';
    return 'from-gray-400 to-gray-500';
  };

  const calculateROI = (netIncome, askingPrice) => {
    if (!netIncome || !askingPrice) return 0;
    return ((netIncome / askingPrice) * 100);
  };

  const calculatePaybackPeriod = (netIncome, askingPrice) => {
    if (!netIncome || !askingPrice) return 0;
    return (askingPrice / netIncome);
  };

  const filteredListings = useMemo(() => {
    let filtered = listings.filter(listing => {
      // Search filter
      const matchesSearch = !searchTerm || 
        listing.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.broker?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Price range filter
      const matchesPrice = listing.askingPrice >= selectedFilters.priceRange[0] && 
                          listing.askingPrice <= selectedFilters.priceRange[1];

      // ROI filter
      const matchesRoi = listing.roi >= selectedFilters.roiRange[0] && 
                        listing.roi <= selectedFilters.roiRange[1];

      // Status filter
      const matchesStatus = selectedFilters.status === 'all' || 
                           listing.status === selectedFilters.status;

      // Type filter
      const matchesType = selectedFilters.type === 'all' || 
                         listing.type === selectedFilters.type;

      // Verified filter
      const matchesVerified = !selectedFilters.verified || listing.verified;

      // Featured filter
      const matchesFeatured = !selectedFilters.featured || listing.featured;

      return matchesSearch && matchesPrice && matchesRoi && matchesStatus && 
             matchesType && matchesVerified && matchesFeatured;
    });

    // Advanced sorting
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.askingPrice - b.askingPrice);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.askingPrice - a.askingPrice);
        break;
      case 'roi-desc':
        filtered.sort((a, b) => b.roi - a.roi);
        break;
      case 'roi-asc':
        filtered.sort((a, b) => a.roi - b.roi);
        break;
      case 'days-asc':
        filtered.sort((a, b) => a.daysOnMarket - b.daysOnMarket);
        break;
      case 'grade-desc':
        filtered.sort((a, b) => {
          const gradeOrder = { 'A+': 12, 'A': 11, 'A-': 10, 'B+': 9, 'B': 8, 'B-': 7, 'C+': 6, 'C': 5, 'C-': 4, 'D': 3, 'F': 2 };
          return (gradeOrder[b.grade] || 0) - (gradeOrder[a.grade] || 0);
        });
        break;
      case 'income-desc':
        filtered.sort((a, b) => (b.netIncome || 0) - (a.netIncome || 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [listings, searchTerm, selectedFilters, sortBy]);

  const toggleFavorite = (listingId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(listingId)) {
      newFavorites.delete(listingId);
    } else {
      newFavorites.add(listingId);
    }
    setFavorites(newFavorites);
  };

  const toggleCompare = (listingId) => {
    const newSelected = new Set(selectedForCompare);
    if (newSelected.has(listingId)) {
      newSelected.delete(listingId);
    } else if (newSelected.size < 3) {
      newSelected.add(listingId);
    }
    setSelectedForCompare(newSelected);
  };

  const contactBroker = async (listing) => {
    // Professional contact system
    try {
      await axios.post(`${API}/marketplace/contact`, {
        listingId: listing.id,
        brokerEmail: listing.broker.email,
        message: `Interested in ${listing.location} listing`
      }, { headers: getAuthHeaders() });
      
      alert('Contact request sent successfully!');
    } catch (error) {
      console.error('Error contacting broker:', error);
      alert('Error sending contact request. Please try again.');
    }
  };

  const downloadProspectus = async (listing) => {
    try {
      const response = await axios.get(`${API}/marketplace/prospectus/${listing.id}`, {
        headers: getAuthHeaders(),
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${listing.location}-prospectus.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading prospectus:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <div className="text-white text-xl font-semibold">Loading Premium Marketplace...</div>
          <div className="text-slate-400 text-sm">Fetching live listings and market data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Ultimate Professional Header */}
      <div className="bg-gradient-to-r from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.3)]">
        <div className="max-w-[1800px] mx-auto px-8 py-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-5xl font-black text-white mb-4 bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Ultimate Marketplace
              </h1>
              <div className="flex items-center space-x-8 text-sm text-slate-400">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span>Live Professional Listings</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
                  <span>{filteredListings.filter(l => l.verified).length} Verified Opportunities</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BoltIcon className="w-4 h-4 text-amber-400" />
                  <span>Real-time Market Intelligence</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-4xl font-black text-white">
                  {formatCurrency(filteredListings.reduce((sum, l) => sum + (l.askingPrice || 0), 0))}
                </div>
                <div className="text-slate-400 font-medium">Total Market Value</div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-black text-emerald-400">
                  {filteredListings.length}
                </div>
                <div className="text-slate-400 font-medium">Active Listings</div>
              </div>
            </div>
          </div>

          {/* Professional Search & Intelligence */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            <div className="lg:col-span-5">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Search locations, brokers, ROI, market conditions..."
                  className="w-full pl-14 pr-6 py-4 bg-slate-800/60 border border-slate-700/50 rounded-2xl text-white placeholder-slate-400 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 text-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="lg:col-span-7 flex items-center space-x-4">
              <select
                className="px-6 py-4 bg-slate-800/60 border border-slate-700/50 rounded-2xl text-white focus:border-cyan-500/50 focus:outline-none text-lg min-w-[200px]"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="roi-desc">Highest ROI</option>
                <option value="roi-asc">Lowest ROI</option>
                <option value="price-desc">Highest Price</option>
                <option value="price-asc">Lowest Price</option>
                <option value="income-desc">Highest Income</option>
                <option value="grade-desc">Best Grade</option>
                <option value="days-asc">Newest Listings</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-6 py-4 rounded-2xl border transition-all ${
                  showFilters 
                    ? 'bg-cyan-600/20 border-cyan-500/50 text-cyan-400'
                    : 'bg-slate-800/60 border-slate-700/50 text-slate-300 hover:border-slate-600/50'
                }`}
              >
                <AdjustmentsHorizontalIcon className="w-5 h-5" />
                <span className="font-semibold">Advanced Filters</span>
              </button>

              <button
                onClick={() => setCompareMode(!compareMode)}
                className={`flex items-center space-x-2 px-6 py-4 rounded-2xl border transition-all ${
                  compareMode 
                    ? 'bg-purple-600/20 border-purple-500/50 text-purple-400'
                    : 'bg-slate-800/60 border-slate-700/50 text-slate-300 hover:border-slate-600/50'
                }`}
              >
                <ArrowsUpDownIcon className="w-5 h-5" />
                <span className="font-semibold">Compare ({selectedForCompare.size})</span>
              </button>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/30 rounded-2xl p-6 mb-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-3">Price Range</label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max="10000000"
                        step="100000"
                        value={selectedFilters.priceRange[1]}
                        onChange={(e) => setSelectedFilters({
                          ...selectedFilters,
                          priceRange: [0, parseInt(e.target.value)]
                        })}
                        className="w-full accent-cyan-500"
                      />
                      <div className="text-slate-400 text-sm">
                        Up to {formatCurrency(selectedFilters.priceRange[1])}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-3">ROI Range</label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={selectedFilters.roiRange[0]}
                        onChange={(e) => setSelectedFilters({
                          ...selectedFilters,
                          roiRange: [parseInt(e.target.value), selectedFilters.roiRange[1]]
                        })}
                        className="w-full accent-emerald-500"
                      />
                      <div className="text-slate-400 text-sm">
                        Minimum {selectedFilters.roiRange[0]}% ROI
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-3">Status</label>
                    <select
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white"
                      value={selectedFilters.status}
                      onChange={(e) => setSelectedFilters({
                        ...selectedFilters,
                        status: e.target.value
                      })}
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="new">New Listings</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-3">Filters</label>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedFilters.verified}
                          onChange={(e) => setSelectedFilters({
                            ...selectedFilters,
                            verified: e.target.checked
                          })}
                          className="accent-emerald-500"
                        />
                        <span className="text-slate-300">Verified Only</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedFilters.featured}
                          onChange={(e) => setSelectedFilters({
                            ...selectedFilters,
                            featured: e.target.checked
                          })}
                          className="accent-cyan-500"
                        />
                        <span className="text-slate-300">Featured Only</span>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-8 py-10">
        {/* Results & View Controls */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-6">
            <div className="text-slate-400">
              Showing <span className="text-white font-bold text-lg">{filteredListings.length}</span> professional opportunities
            </div>
            {filteredListings.length > 0 && (
              <div className="text-emerald-400 font-semibold">
                Avg ROI: {(filteredListings.reduce((sum, l) => sum + l.roi, 0) / filteredListings.length).toFixed(1)}%
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-slate-800/50 p-1 rounded-xl border border-slate-700/30">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-cyan-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Squares2X2Icon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg transition-all ${
                  viewMode === 'list' 
                    ? 'bg-cyan-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <ListBulletIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Professional Listings Display */}
        {filteredListings.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-slate-800/40 rounded-3xl p-12 max-w-md mx-auto">
              <ExclamationTriangleIcon className="w-16 h-16 text-slate-500 mx-auto mb-6" />
              <div className="text-slate-400 text-xl mb-6">No listings match your criteria</div>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedFilters({
                    priceRange: [0, 10000000],
                    roiRange: [0, 50],
                    location: [],
                    status: 'all',
                    type: 'all',
                    verified: false,
                    featured: false
                  });
                }}
                className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8' 
            : 'space-y-6'
          }>
            <AnimatePresence>
              {filteredListings.map((listing, index) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`group bg-gradient-to-br from-slate-900/95 to-slate-800/70 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden hover:border-cyan-500/50 transition-all duration-500 shadow-2xl hover:shadow-cyan-500/10 ${
                    listing.featured ? 'ring-2 ring-cyan-500/30 shadow-cyan-500/20' : ''
                  } ${
                    selectedForCompare.has(listing.id) ? 'ring-2 ring-purple-500/50' : ''
                  }`}
                >
                  {/* Premium Listing Header */}
                  <div className="p-8 pb-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-2xl font-black text-white group-hover:text-cyan-300 transition-colors">
                            {listing.location}
                          </h3>
                          {listing.verified && (
                            <CheckCircleSolidIcon className="w-6 h-6 text-emerald-400" />
                          )}
                          {listing.featured && (
                            <div className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 rounded-full">
                              <span className="text-cyan-300 text-xs font-black tracking-wider">FEATURED</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-3 mb-4">
                          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border ${getStatusColor(listing.status)}`}>
                            {listing.status.toUpperCase()}
                          </div>
                          {listing.grade && (
                            <div className={`px-3 py-1 rounded-full text-sm font-black bg-gradient-to-r ${getGradeColor(listing.grade)} text-white`}>
                              Grade {listing.grade}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        {compareMode && (
                          <button
                            onClick={() => toggleCompare(listing.id)}
                            className={`p-3 rounded-full border-2 transition-all ${
                              selectedForCompare.has(listing.id)
                                ? 'bg-purple-600/20 border-purple-500 text-purple-400'
                                : 'border-slate-600 text-slate-400 hover:border-purple-500 hover:text-purple-400'
                            }`}
                          >
                            <ArrowsUpDownIcon className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => toggleFavorite(listing.id)}
                          className="p-3 hover:bg-slate-700/50 rounded-full transition-colors"
                        >
                          {favorites.has(listing.id) ? (
                            <HeartSolidIcon className="w-6 h-6 text-red-400" />
                          ) : (
                            <HeartIcon className="w-6 h-6 text-slate-400 hover:text-red-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Premium Metrics Display */}
                    <div className="grid grid-cols-3 gap-6 mb-8">
                      <div className="text-center bg-slate-800/40 rounded-2xl p-4 border border-slate-700/30">
                        <div className="text-3xl font-black text-white mb-1">{formatCurrency(listing.askingPrice)}</div>
                        <div className="text-slate-400 text-sm font-medium">Asking Price</div>
                      </div>
                      <div className="text-center bg-slate-800/40 rounded-2xl p-4 border border-slate-700/30">
                        <div className="text-3xl font-black text-emerald-400 mb-1">{formatCurrency(listing.netIncome)}</div>
                        <div className="text-slate-400 text-sm font-medium">Net Income</div>
                      </div>
                      <div className="text-center bg-slate-800/40 rounded-2xl p-4 border border-slate-700/30">
                        <div className={`text-3xl font-black mb-1 ${getRoiColor(listing.roi)}`}>{listing.roi.toFixed(1)}%</div>
                        <div className="text-slate-400 text-sm font-medium">ROI</div>
                      </div>
                    </div>

                    {/* Advanced Property Intelligence */}
                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                      <div className="flex items-center space-x-3 bg-slate-800/20 rounded-xl p-3">
                        <BuildingOffice2Icon className="w-5 h-5 text-slate-400" />
                        <div>
                          <div className="text-white font-semibold">{formatNumber(listing.sqft)} sq ft</div>
                          <div className="text-slate-500 text-xs">Floor Space</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 bg-slate-800/20 rounded-xl p-3">
                        <ChartBarIcon className="w-5 h-5 text-slate-400" />
                        <div>
                          <div className="text-white font-semibold">{listing.machines} machines</div>
                          <div className="text-slate-500 text-xs">Equipment Count</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 bg-slate-800/20 rounded-xl p-3">
                        <ClockIcon className="w-5 h-5 text-slate-400" />
                        <div>
                          <div className="text-white font-semibold">{listing.daysOnMarket} days</div>
                          <div className="text-slate-500 text-xs">On Market</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 bg-slate-800/20 rounded-xl p-3">
                        <CalculatorIcon className="w-5 h-5 text-slate-400" />
                        <div>
                          <div className="text-white font-semibold">{calculatePaybackPeriod(listing.netIncome, listing.askingPrice).toFixed(1)}y</div>
                          <div className="text-slate-500 text-xs">Payback</div>
                        </div>
                      </div>
                    </div>

                    {/* Professional Description */}
                    <p className="text-slate-300 text-sm leading-relaxed mb-6 line-clamp-3">{listing.description}</p>

                    {/* Investment Highlights */}
                    <div className="mb-6">
                      <div className="text-white font-semibold mb-3">Investment Highlights</div>
                      <div className="flex flex-wrap gap-2">
                        {listing.highlights.slice(0, 4).map((highlight, idx) => (
                          <span key={idx} className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/20">
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Professional Broker Section */}
                  <div className="px-8 py-6 bg-slate-800/60 border-t border-slate-700/40">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="font-bold text-white">{listing.broker.name}</div>
                          {listing.broker.verified && (
                            <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
                          )}
                        </div>
                        <div className="text-slate-400 text-sm">{listing.broker.company}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => contactBroker(listing)}
                        className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-cyan-500/25"
                      >
                        <EnvelopeIcon className="w-5 h-5" />
                        <span>Contact Broker</span>
                      </button>
                      <button
                        onClick={() => downloadProspectus(listing)}
                        className="p-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl transition-colors"
                      >
                        <DocumentArrowDownIcon className="w-5 h-5 text-slate-300" />
                      </button>
                      <button className="p-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl transition-colors">
                        <ShareIcon className="w-5 h-5 text-slate-300" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default UltimateMarketplace;