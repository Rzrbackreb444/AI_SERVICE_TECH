import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolidIcon,
  StarIcon as StarSolidIcon
} from '@heroicons/react/24/solid';

const ProfessionalMarketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    priceRange: 'all',
    location: 'all',
    netIncome: 'all',
    status: 'all'
  });
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState(new Set());
  const [sortBy, setSortBy] = useState('price-asc');

  // Real marketplace data based on the image you showed
  const listings = [
    {
      id: 1,
      location: "Philadelphia, PA",
      askingPrice: 1800000,
      netIncome: 342000,
      grossRevenue: 816000,
      roi: 19.0,
      status: "active",
      daysOnMarket: 45,
      sqft: 3500,
      machines: 42,
      type: "coin-operated",
      verified: true,
      featured: true,
      images: ['/api/placeholder/400/300'],
      description: "Prime Philadelphia location with established customer base. Recently renovated with new equipment.",
      highlights: ["High-traffic area", "Recently renovated", "Parking available", "Long-term lease"],
      risks: ["High rent", "Competitive market"],
      broker: {
        name: "Kim Greene",
        company: "Hedgestone Business Advisors",
        phone: "(555) 123-4567",
        email: "kim@hedgestone.com"
      }
    },
    {
      id: 2,
      location: "Essex, MD",
      askingPrice: 700000,
      netIncome: 200000,
      grossRevenue: null,
      roi: 28.6,
      status: "active",
      daysOnMarket: 23,
      sqft: 2800,
      machines: 36,
      type: "coin-operated",
      verified: true,
      featured: false,
      images: ['/api/placeholder/400/300'],
      description: "Excellent ROI opportunity in established neighborhood. Strong cash flow.",
      highlights: ["Excellent ROI", "Established location", "Strong cash flow"],
      risks: ["Market saturation"],
      broker: {
        name: "Kim Greene",
        company: "Hedgestone Business Advisors",
        phone: "(555) 123-4567",
        email: "kim@hedgestone.com"
      }
    },
    {
      id: 3,
      location: "Bronx, NY",
      askingPrice: 3000000,
      netIncome: 300000,
      grossRevenue: 495000,
      roi: 10.0,
      status: "active",
      daysOnMarket: 67,
      sqft: 4200,
      machines: 58,
      type: "card-operated",
      verified: true,
      featured: true,
      images: ['/api/placeholder/400/300'],
      description: "Large format laundromat in high-density area. Card payment system installed.",
      highlights: ["Large capacity", "Card payment system", "High-density area"],
      risks: ["High asking price", "Lower ROI"],
      broker: {
        name: "Kim Greene",
        company: "Hedgestone Business Advisors",
        phone: "(555) 123-4567",
        email: "kim@hedgestone.com"
      }
    },
    {
      id: 4,
      location: "Paterson, NJ",
      askingPrice: 3750000,
      netIncome: 659000,
      grossRevenue: 1230000,
      roi: 17.6,
      status: "pending",
      daysOnMarket: 12,
      sqft: 5600,
      machines: 72,
      type: "hybrid",
      verified: true,
      featured: true,
      images: ['/api/placeholder/400/300'],
      description: "Premium location with exceptional cash flow. Hybrid coin/card system.",
      highlights: ["Exceptional cash flow", "Premium location", "Hybrid payment", "Large facility"],
      risks: ["High investment"],
      broker: {
        name: "Kim Greene",
        company: "Hedgestone Business Advisors",
        phone: "(555) 123-4567",
        email: "kim@hedgestone.com"
      }
    },
    {
      id: 5,
      location: "Brooklyn, NY",
      askingPrice: 1850000,
      netIncome: 192000,
      grossRevenue: 540000,
      roi: 10.4,
      status: "active",
      daysOnMarket: 89,
      sqft: 3200,
      machines: 45,
      type: "coin-operated",
      verified: true,
      featured: false,
      images: ['/api/placeholder/400/300'],
      description: "Established Brooklyn location with steady customer base.",
      highlights: ["Established location", "Steady customer base", "Brooklyn market"],
      risks: ["Competitive area", "Moderate ROI"],
      broker: {
        name: "Kim Greene", 
        company: "Hedgestone Business Advisors",
        phone: "(555) 123-4567",
        email: "kim@hedgestone.com"
      }
    },
    {
      id: 6,
      location: "Queens, NY",
      askingPrice: 475000,
      netIncome: 115000,
      grossRevenue: 240000,
      roi: 24.2,
      status: "active",
      daysOnMarket: 34,
      sqft: 2400,
      machines: 28,
      type: "coin-operated",
      verified: true,
      featured: false,
      images: ['/api/placeholder/400/300'],
      description: "Great starter opportunity with solid returns in Queens.",
      highlights: ["Great ROI", "Starter opportunity", "Queens location"],
      risks: ["Smaller facility"],
      broker: {
        name: "Kim Greene",
        company: "Hedgestone Business Advisors", 
        phone: "(555) 123-4567",
        email: "kim@hedgestone.com"
      }
    }
  ];

  const formatCurrency = (amount) => {
    if (!amount) return 'TBD';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'pending': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'sold': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getRoiColor = (roi) => {
    if (roi >= 20) return 'text-emerald-400';
    if (roi >= 15) return 'text-green-400';
    if (roi >= 10) return 'text-yellow-400';
    return 'text-red-400';
  };

  const filteredListings = useMemo(() => {
    let filtered = listings.filter(listing => {
      const matchesSearch = listing.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesFilters = true;
      
      if (selectedFilters.priceRange !== 'all') {
        const [min, max] = selectedFilters.priceRange.split('-').map(Number);
        matchesFilters = matchesFilters && listing.askingPrice >= min && (max ? listing.askingPrice <= max : true);
      }
      
      if (selectedFilters.status !== 'all') {
        matchesFilters = matchesFilters && listing.status === selectedFilters.status;
      }
      
      return matchesSearch && matchesFilters;
    });

    // Sort listings
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
      case 'days-asc':
        filtered.sort((a, b) => a.daysOnMarket - b.daysOnMarket);
        break;
      default:
        break;
    }

    return filtered;
  }, [searchTerm, selectedFilters, sortBy]);

  const toggleFavorite = (listingId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(listingId)) {
      newFavorites.delete(listingId);
    } else {
      newFavorites.add(listingId);
    }
    setFavorites(newFavorites);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Professional Header */}
      <div className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 shadow-2xl">
        <div className="max-w-[1600px] mx-auto px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-black text-white mb-3 bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Professional Marketplace
              </h1>
              <div className="flex items-center space-x-8 text-sm text-slate-400">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span>Live Listings • Updated Real-time</span>
                </div>
                <span>{filteredListings.length} Active Opportunities</span>
                <span className="text-emerald-400 font-semibold">Verified Brokers</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">${((listings.reduce((sum, l) => sum + l.askingPrice, 0)) / 1000000).toFixed(1)}M</div>
              <div className="text-slate-400">Total Market Value</div>
            </div>
          </div>

          {/* Advanced Search & Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-2">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by location, broker, or listing details..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/60 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                className="px-4 py-3 bg-slate-800/60 border border-slate-700/50 rounded-xl text-white focus:border-cyan-500/50 focus:outline-none"
                value={selectedFilters.priceRange}
                onChange={(e) => setSelectedFilters({...selectedFilters, priceRange: e.target.value})}
              >
                <option value="all">All Prices</option>
                <option value="0-1000000">Under $1M</option>
                <option value="1000000-2000000">$1M - $2M</option>
                <option value="2000000-5000000">$2M - $5M</option>
                <option value="5000000-">Over $5M</option>
              </select>
              
              <select
                className="px-4 py-3 bg-slate-800/60 border border-slate-700/50 rounded-xl text-white focus:border-cyan-500/50 focus:outline-none"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="roi-desc">ROI: High to Low</option>
                <option value="days-asc">Newest First</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-8 py-8">
        {/* Results Summary */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-slate-400">
            Showing <span className="text-white font-semibold">{filteredListings.length}</span> professional listings
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-slate-400">View:</span>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              List
            </button>
          </div>
        </div>

        {/* Professional Listings Grid */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8' : 'space-y-6'}>
          <AnimatePresence>
            {filteredListings.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-br from-slate-900/90 to-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-500 shadow-2xl ${listing.featured ? 'ring-2 ring-cyan-500/30' : ''}`}
              >
                {/* Listing Header */}
                <div className="p-6 pb-0">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{listing.location}</h3>
                        {listing.verified && (
                          <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
                        )}
                        {listing.featured && (
                          <div className="px-2 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full">
                            <span className="text-cyan-400 text-xs font-semibold">FEATURED</span>
                          </div>
                        )}
                      </div>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(listing.status)}`}>
                        {listing.status.toUpperCase()}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFavorite(listing.id)}
                      className="p-2 hover:bg-slate-700/50 rounded-full transition-colors"
                    >
                      {favorites.has(listing.id) ? (
                        <HeartSolidIcon className="w-6 h-6 text-red-400" />
                      ) : (
                        <HeartIcon className="w-6 h-6 text-slate-400 hover:text-red-400" />
                      )}
                    </button>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{formatCurrency(listing.askingPrice)}</div>
                      <div className="text-slate-400 text-sm">Asking Price</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-400">{formatCurrency(listing.netIncome)}</div>
                      <div className="text-slate-400 text-sm">Net Income</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getRoiColor(listing.roi)}`}>{listing.roi.toFixed(1)}%</div>
                      <div className="text-slate-400 text-sm">ROI</div>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <BuildingOffice2Icon className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">{listing.sqft?.toLocaleString()} sq ft</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ChartBarIcon className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">{listing.machines} machines</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">{listing.daysOnMarket} days</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CurrencyDollarIcon className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">{listing.type}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-slate-300 text-sm mb-4 line-clamp-2">{listing.description}</p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {listing.highlights.slice(0, 3).map((highlight, idx) => (
                      <span key={idx} className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full border border-emerald-500/20">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Broker Information */}
                <div className="px-6 py-4 bg-slate-800/40 border-t border-slate-700/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white text-sm">{listing.broker.name}</div>
                      <div className="text-slate-400 text-xs">{listing.broker.company}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors">
                        <PhoneIcon className="w-4 h-4 text-slate-300" />
                      </button>
                      <button className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors">
                        <EnvelopeIcon className="w-4 h-4 text-slate-300" />
                      </button>
                      <button className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-semibold rounded-lg transition-all">
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* No Results */}
        {filteredListings.length === 0 && (
          <div className="text-center py-16">
            <div className="text-slate-400 text-lg mb-4">No listings match your search criteria</div>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedFilters({ priceRange: 'all', location: 'all', netIncome: 'all', status: 'all' });
              }}
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-lg transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalMarketplace;