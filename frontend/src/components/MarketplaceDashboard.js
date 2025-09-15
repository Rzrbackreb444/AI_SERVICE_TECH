import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BuildingOffice2Icon,
  CurrencyDollarIcon,
  MapPinIcon,
  ChartBarIcon,
  EyeIcon,
  HeartIcon,
  PhotoIcon,
  DocumentTextIcon,
  ClockIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  StarIcon,
  FilterIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MarketplaceDashboard = () => {
  const [listings, setListings] = useState([]);
  const [marketStats, setMarketStats] = useState(null);
  const [featuredListings, setFeaturedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location_states: '',
    min_price: '',
    max_price: '',
    property_types: '',
    sort_by: 'created_at',
    sort_order: 'desc'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListing, setSelectedListing] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadMarketplaceData();
  }, [filters]);

  const loadMarketplaceData = async () => {
    try {
      setLoading(true);
      
      // Load marketplace listings with filters
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const [listingsResponse, statsResponse, featuredResponse] = await Promise.all([
        axios.get(`${API}/marketplace/listings/search?${params.toString()}`),
        axios.get(`${API}/marketplace/stats`),
        axios.get(`${API}/marketplace/featured?limit=6`)
      ]);

      if (listingsResponse.data.success) {
        setListings(listingsResponse.data.data.listings);
      }
      
      if (statsResponse.data.success) {
        setMarketStats(statsResponse.data.data);
      }
      
      if (featuredResponse.data.success) {
        setFeaturedListings(featuredResponse.data.data.listings);
      }

    } catch (error) {
      console.error('Error loading marketplace data:', error);
      // Use demo data for development
      setListings(getDemoListings());
      setMarketStats(getDemoStats());
      setFeaturedListings(getDemoListings().slice(0, 3));
    } finally {
      setLoading(false);
    }
  };

  const getDemoListings = () => [
    {
      listing: {
        id: '1',
        title: 'High-Performance Laundromat - Arkansas',
        property_type: 'coin_laundry',
        address: {
          city: 'Little Rock',
          state: 'Arkansas',
          street: '1234 Main Street'
        },
        financials: {
          asking_price: 425000,
          annual_revenue: 180000,
          cash_flow: 85000,
          monthly_revenue: 15000
        },
        equipment: {
          total_machines: 60,
          average_age: 3.5
        },
        square_footage: 2400,
        years_established: 15,
        photos: ['https://via.placeholder.com/400x300?text=Laundromat+1'],
        market_analysis: {
          market_score: 87,
          competition_density: 'low',
          demographic_score: 92
        },
        view_count: 156,
        inquiry_count: 8,
        favorite_count: 23,
        featured: true,
        verified: true,
        created_at: '2024-09-10T00:00:00Z'
      },
      is_favorited: false,
      inquiry_sent: false
    },
    {
      listing: {
        id: '2',
        title: 'Modern Coin Laundry - Prime Dallas Location',
        property_type: 'full_service',
        address: {
          city: 'Dallas',
          state: 'Texas',
          street: '5678 Commerce Ave'
        },
        financials: {
          asking_price: 650000,
          annual_revenue: 285000,
          cash_flow: 125000,
          monthly_revenue: 23750
        },
        equipment: {
          total_machines: 75,
          average_age: 2.1
        },
        square_footage: 3200,
        years_established: 8,
        photos: ['https://via.placeholder.com/400x300?text=Laundromat+2'],
        market_analysis: {
          market_score: 94,
          competition_density: 'medium',
          demographic_score: 89
        },
        view_count: 203,
        inquiry_count: 12,
        favorite_count: 31,
        featured: true,
        verified: true,
        created_at: '2024-09-08T00:00:00Z'
      },
      is_favorited: true,
      inquiry_sent: false
    },
    {
      listing: {
        id: '3',
        title: 'Established Laundromat Chain - 3 Locations',
        property_type: 'laundromat_chain',
        address: {
          city: 'Phoenix',
          state: 'Arizona',
          street: 'Multiple Locations'
        },
        financials: {
          asking_price: 950000,
          annual_revenue: 420000,
          cash_flow: 185000,
          monthly_revenue: 35000
        },
        equipment: {
          total_machines: 180,
          average_age: 4.2
        },
        square_footage: 8500,
        years_established: 12,
        photos: ['https://via.placeholder.com/400x300?text=Chain+Portfolio'],
        market_analysis: {
          market_score: 91,
          competition_density: 'high',
          demographic_score: 85
        },
        view_count: 89,
        inquiry_count: 15,
        favorite_count: 18,
        featured: true,
        verified: true,
        created_at: '2024-09-05T00:00:00Z'
      },
      is_favorited: false,
      inquiry_sent: true
    }
  ];

  const getDemoStats = () => ({
    total_active_listings: 247,
    average_price: 485000,
    median_price: 425000,
    average_revenue: 235000,
    average_days_on_market: 45,
    new_listings_this_month: 23,
    price_trend_30_days: 5.8
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getROI = (revenue, price) => {
    return ((revenue / price) * 100).toFixed(1);
  };

  const getMarketScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 80) return 'text-blue-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleListingClick = (listingResponse) => {
    setSelectedListing(listingResponse);
  };

  const MarketStatsCard = ({ title, value, icon: Icon, change, color = "from-blue-500 to-cyan-500" }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-2xl p-6 hover:border-white/[0.1] transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${color} bg-opacity-10`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <div className={`flex items-center text-sm font-medium ${
            change > 0 ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {change > 0 ? <TrendingUpIcon className="w-4 h-4 mr-1" /> : <TrendingDownIcon className="w-4 h-4 mr-1" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div>
        <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </motion.div>
  );

  const ListingCard = ({ listingResponse, featured = false }) => {
    const { listing, is_favorited, inquiry_sent } = listingResponse;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        onClick={() => handleListingClick(listingResponse)}
        className={`relative bg-white/[0.02] backdrop-blur-xl border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:border-white/[0.15] group ${
          featured ? 'border-cyan-400/20 shadow-lg' : 'border-white/[0.05] hover:border-white/[0.1]'
        }`}
      >
        {/* Featured Badge */}
        {listing.featured && (
          <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-yellow-500 to-orange-500 px-3 py-1 rounded-full text-xs font-bold text-white">
            <StarIcon className="w-3 h-3 inline mr-1" />
            FEATURED
          </div>
        )}
        
        {/* Verified Badge */}
        {listing.verified && (
          <div className="absolute top-4 right-4 z-10 bg-emerald-500/90 p-2 rounded-full">
            <SparklesIcon className="w-4 h-4 text-white" />
          </div>
        )}

        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-slate-800 to-slate-900">
          {listing.photos && listing.photos.length > 0 ? (
            <img
              src={listing.photos[0]}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <PhotoIcon className="w-12 h-12 text-slate-600" />
            </div>
          )}
          
          {/* Photo Count */}
          {listing.photos && listing.photos.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/70 px-2 py-1 rounded text-xs text-white">
              <PhotoIcon className="w-3 h-3 inline mr-1" />
              {listing.photos.length}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                {listing.title}
              </h3>
              <div className="flex items-center text-slate-400 text-sm mt-1">
                <MapPinIcon className="w-4 h-4 mr-1" />
                {listing.address.city}, {listing.address.state}
              </div>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Toggle favorite
              }}
              className="p-2 hover:bg-white/[0.05] rounded-lg transition-colors"
            >
              {is_favorited ? (
                <HeartSolidIcon className="w-5 h-5 text-red-400" />
              ) : (
                <HeartIcon className="w-5 h-5 text-slate-400 hover:text-red-400" />
              )}
            </button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-2xl font-bold text-emerald-400">
                {formatCurrency(listing.financials.asking_price)}
              </p>
              <p className="text-xs text-slate-400">Asking Price</p>
            </div>
            <div>
              <p className="text-lg font-bold text-white">
                {formatCurrency(listing.financials.annual_revenue || 0)}
              </p>
              <p className="text-xs text-slate-400">Annual Revenue</p>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
            <div className="text-center">
              <p className="font-bold text-white">{listing.equipment.total_machines}</p>
              <p className="text-slate-400 text-xs">Machines</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-white">{formatNumber(listing.square_footage)}</p>
              <p className="text-slate-400 text-xs">Sq Ft</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-white">{listing.years_established}y</p>
              <p className="text-slate-400 text-xs">Established</p>
            </div>
          </div>

          {/* Market Analysis */}
          {listing.market_analysis && (
            <div className="flex items-center justify-between mb-4 p-3 bg-white/[0.02] rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="text-center">
                  <p className={`text-lg font-bold ${getMarketScoreColor(listing.market_analysis.market_score)}`}>
                    {listing.market_analysis.market_score}
                  </p>
                  <p className="text-xs text-slate-400">Score</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-white">{getROI(listing.financials.annual_revenue, listing.financials.asking_price)}%</p>
                  <p className="text-xs text-slate-400">ROI</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 capitalize">{listing.market_analysis.competition_density} Competition</p>
              </div>
            </div>
          )}

          {/* Engagement Stats */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <EyeIcon className="w-3 h-3 mr-1" />
                {listing.view_count}
              </span>
              <span className="flex items-center">
                <HeartIcon className="w-3 h-3 mr-1" />
                {listing.favorite_count}
              </span>
            </div>
            <div className="flex items-center">
              <ClockIcon className="w-3 h-3 mr-1" />
              {new Date(listing.created_at).toLocaleDateString()}
            </div>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex space-x-2">
              {inquiry_sent && (
                <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
                  Inquiry Sent
                </span>
              )}
              {listing.featured && (
                <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs">
                  Featured
                </span>
              )}
            </div>
            <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-white text-lg font-medium">Loading Marketplace...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/20 backdrop-blur-2xl border-b border-white/[0.05]">
        <div className="max-w-8xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">LaundroTech Marketplace</h1>
              <p className="text-slate-400">Professional laundromat investments with AI intelligence</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all ${
                  showFilters 
                    ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-400' 
                    : 'bg-white/[0.05] border-white/[0.1] text-slate-300 hover:border-white/[0.2]'
                }`}
              >
                <FilterIcon className="w-5 h-5" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-6 lg:px-8 py-8">
        {/* Market Statistics */}
        {marketStats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
            <MarketStatsCard
              title="Active Listings"
              value={formatNumber(marketStats.total_active_listings)}
              icon={BuildingOffice2Icon}
              color="from-blue-500 to-cyan-500"
            />
            <MarketStatsCard
              title="Avg Price"
              value={formatCurrency(marketStats.average_price)}
              icon={CurrencyDollarIcon}
              change={marketStats.price_trend_30_days}
              color="from-emerald-500 to-teal-500"
            />
            <MarketStatsCard
              title="Median Price"
              value={formatCurrency(marketStats.median_price)}
              icon={ChartBarIcon}
              color="from-purple-500 to-pink-500"
            />
            <MarketStatsCard
              title="Avg Revenue"
              value={formatCurrency(marketStats.average_revenue)}
              icon={TrendingUpIcon}
              color="from-orange-500 to-red-500"
            />
            <MarketStatsCard
              title="Days on Market"
              value={`${marketStats.average_days_on_market} days`}
              icon={ClockIcon}
              color="from-yellow-500 to-orange-500"
            />
            <MarketStatsCard
              title="New This Month"
              value={formatNumber(marketStats.new_listings_this_month)}
              icon={SparklesIcon}
              color="from-cyan-500 to-blue-500"
            />
          </div>
        )}

        {/* Featured Listings */}
        {featuredListings.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Featured Opportunities</h2>
              <button className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center">
                View All <ArrowRightIcon className="w-4 h-4 ml-1" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredListings.map((listingResponse, index) => (
                <ListingCard
                  key={listingResponse.listing.id}
                  listingResponse={listingResponse}
                  featured={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Listings */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">All Listings</h2>
            <div className="flex items-center space-x-4">
              <select
                value={filters.sort_by}
                onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                className="bg-white/[0.05] border border-white/[0.1] rounded-lg px-4 py-2 text-white focus:border-cyan-400/50 focus:outline-none"
              >
                <option value="created_at">Newest First</option>
                <option value="financials.asking_price">Price: Low to High</option>
                <option value="-financials.asking_price">Price: High to Low</option>
                <option value="-financials.annual_revenue">Revenue: High to Low</option>
                <option value="-view_count">Most Viewed</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {listings.map((listingResponse) => (
              <ListingCard
                key={listingResponse.listing.id}
                listingResponse={listingResponse}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceDashboard;