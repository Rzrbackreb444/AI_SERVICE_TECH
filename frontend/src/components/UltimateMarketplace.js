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
        setListings([]);
      }
    } catch (error) {
      console.error('Error loading marketplace data:', error);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  // Utility functions
  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    if (!num || isNaN(num)) return '0';
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'pending':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'under_contract':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/40';
    }
  };

  const getRoiColor = (roi) => {
    if (!roi || isNaN(roi)) return 'text-slate-400';
    if (roi >= 25) return 'text-emerald-400';
    if (roi >= 20) return 'text-cyan-400';
    if (roi >= 15) return 'text-blue-400';
    return 'text-slate-400';
  };

  const formatStatus = (status) => {
    if (!status) return 'AVAILABLE';
    return status.replace('_', ' ').toUpperCase();
  };

  const calculatePaybackPeriod = (askingPrice, monthlyProfit) => {
    if (!askingPrice || !monthlyProfit || isNaN(askingPrice) || isNaN(monthlyProfit) || monthlyProfit <= 0) {
      return 'N/A';
    }
    const years = (askingPrice / (monthlyProfit * 12));
    return `${years.toFixed(1)}yr`;
  };

  const filteredListings = useMemo(() => {
    let filtered = listings.filter(listing => {
      // Search filter
      const matchesSearch = !searchTerm || 
        listing.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.broker?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description?.toLowerCase().includes(searchTerm.toLowerCase());

      // Price range filter
      const askingPrice = listing.askingPrice || 0;
      const matchesPrice = askingPrice >= selectedFilters.priceRange[0] && 
                          askingPrice <= selectedFilters.priceRange[1];

      // ROI filter
      const roi = listing.roi || 0;
      const matchesRoi = roi >= selectedFilters.roiRange[0] && 
                        roi <= selectedFilters.roiRange[1];

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
        filtered.sort((a, b) => (a.askingPrice || 0) - (b.askingPrice || 0));
        break;
      case 'price-desc':
        filtered.sort((a, b) => (b.askingPrice || 0) - (a.askingPrice || 0));
        break;
      case 'roi-asc':
        filtered.sort((a, b) => (a.roi || 0) - (b.roi || 0));
        break;
      case 'roi-desc':
        filtered.sort((a, b) => (b.roi || 0) - (a.roi || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [listings, searchTerm, selectedFilters, sortBy]);

  const toggleFavorite = (listingId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(listingId)) {
        newFavorites.delete(listingId);
      } else {
        newFavorites.add(listingId);
      }
      return newFavorites;
    });
  };

  const toggleCompare = (listingId) => {
    setSelectedForCompare(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(listingId)) {
        newSelected.delete(listingId);
      } else if (newSelected.size < 3) {
        newSelected.add(listingId);
      }
      return newSelected;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <div className="text-white text-xl font-semibold">Loading Professional Listings...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Enhanced Professional Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-purple-500/10"></div>
        <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl lg:text-6xl font-black text-white mb-4">
              Ultimate Marketplace
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-slate-300 mb-8">
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
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <div className="text-3xl lg:text-5xl font-black text-white">
                  {formatCurrency(filteredListings.reduce((sum, l) => sum + (l.askingPrice || 0), 0))}
                </div>
                <div className="text-slate-400 font-medium">Total Market Value</div>
              </div>
              <div className="text-center sm:text-right">
                <div className="text-3xl lg:text-5xl font-black text-emerald-400">
                  {filteredListings.length}
                </div>
                <div className="text-slate-400 font-medium">Active Listings</div>
              </div>
            </div>
          </motion.div>

          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search locations, brokers, ROI, market conditions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-800/70 border-2 border-slate-600/70 rounded-2xl text-white placeholder-slate-300 focus:outline-none focus:border-cyan-400/80 focus:bg-slate-800/90 transition-all shadow-xl"
                />
              </div>

              {/* Sort and View Controls */}
              <div className="flex gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-white focus:outline-none focus:border-cyan-500/50"
                >
                  <option value="roi-desc">Highest ROI</option>
                  <option value="roi-asc">Lowest ROI</option>
                  <option value="price-desc">Highest Price</option>
                  <option value="price-asc">Lowest Price</option>
                  <option value="newest">Newest First</option>
                </select>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-6 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-white hover:border-cyan-500/50 transition-all flex items-center gap-2"
                >
                  <AdjustmentsHorizontalIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">Advanced Filters</span>
                </button>

                <button
                  onClick={() => setCompareMode(!compareMode)}
                  className={`px-6 py-4 border border-slate-700/50 rounded-2xl transition-all flex items-center gap-2 ${
                    compareMode
                      ? 'bg-purple-600/20 border-purple-500/50 text-purple-400'
                      : 'bg-slate-800/50 text-white hover:border-purple-500/50'
                  }`}
                >
                  <ArrowsUpDownIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">Compare ({selectedForCompare.size})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Summary */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="text-slate-400">
              Showing <span className="text-white font-bold text-lg">{filteredListings.length}</span> professional opportunities
            </div>
            {filteredListings.length > 0 && (
              <div className="text-emerald-400 font-semibold">
                Avg ROI: {(filteredListings.reduce((sum, l) => sum + (l.roi || 0), 0) / filteredListings.length).toFixed(1)}%
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-cyan-600/20 text-cyan-400' : 'text-slate-400 hover:text-cyan-400'}`}
            >
              <Squares2X2Icon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-cyan-600/20 text-cyan-400' : 'text-slate-400 hover:text-cyan-400'}`}
            >
              <ListBulletIcon className="w-5 h-5" />
            </button>
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
                className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-2xl transition-all transform hover:scale-105"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6' 
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
                  {/* Card Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {listing.location || 'Location TBD'}
                          </h3>
                          {listing.verified && (
                            <CheckCircleSolidIcon className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(listing.status)}`}>
                            {formatStatus(listing.status)}
                          </span>
                          {listing.featured && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 text-cyan-300">
                              FEATURED
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        {compareMode && (
                          <button
                            onClick={() => toggleCompare(listing.id)}
                            className={`p-2 rounded-full border transition-all ${
                              selectedForCompare.has(listing.id)
                                ? 'bg-purple-600/20 border-purple-500 text-purple-400'
                                : 'border-slate-600 text-slate-400 hover:border-purple-500 hover:text-purple-400'
                            }`}
                          >
                            <ArrowsUpDownIcon className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => toggleFavorite(listing.id)}
                          className="p-2 hover:bg-slate-700/50 rounded-full transition-colors"
                        >
                          {favorites.has(listing.id) ? (
                            <HeartSolidIcon className="w-5 h-5 text-red-400" />
                          ) : (
                            <HeartIcon className="w-5 h-5 text-slate-400 hover:text-red-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <div className="text-center bg-slate-800/40 rounded-xl p-3">
                        <div className="text-lg font-bold text-white mb-1">{formatCurrency(listing.askingPrice)}</div>
                        <div className="text-xs text-slate-400">Asking Price</div>
                      </div>
                      <div className="text-center bg-slate-800/40 rounded-xl p-3">
                        <div className="text-lg font-bold text-emerald-400 mb-1">{formatCurrency(listing.monthlyProfit)}</div>
                        <div className="text-xs text-slate-400">Net Income</div>
                      </div>
                      <div className="text-center bg-slate-800/40 rounded-xl p-3">
                        <div className={`text-lg font-bold mb-1 ${getRoiColor(listing.roi)}`}>
                          {listing.roi ? `${listing.roi.toFixed(1)}%` : 'N/A'}
                        </div>
                        <div className="text-xs text-slate-400">ROI</div>
                      </div>
                    </div>

                    {/* Property Details */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="flex items-center gap-2 bg-slate-800/20 rounded-lg p-3">
                        <BuildingOffice2Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="text-sm text-white font-medium truncate">
                            {listing.squareFeet ? `${formatNumber(listing.squareFeet)} sq ft` : 'N/A'}
                          </div>
                          <div className="text-xs text-slate-500">Floor Space</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-800/20 rounded-lg p-3">
                        <ChartBarIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="text-sm text-white font-medium truncate">
                            {listing.washerCount && listing.dryerCount 
                              ? `${listing.washerCount}+${listing.dryerCount} machines`
                              : 'Equipment Count'
                            }
                          </div>
                          <div className="text-xs text-slate-500">Equipment Count</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-800/20 rounded-lg p-3">
                        <ClockIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="text-sm text-white font-medium truncate">
                            {calculatePaybackPeriod(listing.askingPrice, listing.monthlyProfit)}
                          </div>
                          <div className="text-xs text-slate-500">Payback Period</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-800/20 rounded-lg p-3">
                        <EyeIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="text-sm text-white font-medium truncate">
                            {listing.views || 0} views
                          </div>
                          <div className="text-xs text-slate-500">Interest Level</div>
                        </div>
                      </div>
                    </div>

                    {/* Investment Highlights */}
                    {listing.highlights && listing.highlights.length > 0 && (
                      <div className="mb-6">
                        <div className="text-white font-semibold mb-3 text-sm">Investment Highlights</div>
                        <div className="flex flex-wrap gap-2">
                          {listing.highlights.slice(0, 4).map((highlight, idx) => (
                            <span key={idx} className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/20">
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Broker Information */}
                    {listing.broker && (
                      <div className="border-t border-slate-700/50 pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-white font-medium">{listing.broker.name}</div>
                            <div className="text-xs text-slate-400">{listing.broker.company}</div>
                          </div>
                          <div className="flex gap-2">
                            {listing.broker.phone && (
                              <a href={`tel:${listing.broker.phone}`} className="p-2 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors">
                                <PhoneIcon className="w-4 h-4 text-slate-400" />
                              </a>
                            )}
                            {listing.broker.email && (
                              <a href={`mailto:${listing.broker.email}`} className="p-2 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors">
                                <EnvelopeIcon className="w-4 h-4 text-slate-400" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
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