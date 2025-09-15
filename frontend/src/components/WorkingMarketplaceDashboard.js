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
  ClockIcon,
  TrendingUpIcon,
  StarIcon,
  ArrowRightIcon,
  SparklesIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const WorkingMarketplaceDashboard = () => {
  const [listings, setListings] = useState([]);
  const [marketStats, setMarketStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showListingCreator, setShowListingCreator] = useState(false);

  useEffect(() => {
    loadMarketplaceData();
  }, []);

  const loadMarketplaceData = async () => {
    try {
      setLoading(true);
      
      // For now, use demo data
      setListings(getDemoListings());
      setMarketStats(getDemoStats());

    } catch (error) {
      console.error('Error loading marketplace data:', error);
      setListings(getDemoListings());
      setMarketStats(getDemoStats());
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
        photos: ['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop'],
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
        photos: ['https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&h=300&fit=crop'],
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
        photos: ['https://images.unsplash.com/photo-1486312338219-ce68e2c6de44?w=400&h=300&fit=crop'],
        market_analysis: {
          market_score: 91,
          competition_density: 'high',
          demographic_score: 85
        },
        view_count: 89,
        inquiry_count: 15,
        favorite_count: 18,
        featured: false,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-white text-lg font-medium">Loading Professional Marketplace...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Premium Header */}
      <div className="sticky top-0 z-40 bg-black/20 backdrop-blur-2xl border-b border-white/[0.05]">
        <div className="max-w-8xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">LaundroTech Marketplace</h1>
              <p className="text-slate-400">Professional laundromat investments with AI intelligence</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowListingCreator(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Create Listing</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-6 lg:px-8 py-8">
        {/* Market Statistics */}
        {marketStats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-2xl p-6 hover:border-white/[0.1] transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 bg-opacity-10">
                  <BuildingOffice2Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-slate-400 text-sm font-medium mb-1">Active Listings</h3>
                <p className="text-2xl font-bold text-white">{formatNumber(marketStats.total_active_listings)}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-2xl p-6 hover:border-white/[0.1] transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 bg-opacity-10">
                  <CurrencyDollarIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center text-sm font-medium text-emerald-400">
                  <TrendingUpIcon className="w-4 h-4 mr-1" />
                  {Math.abs(marketStats.price_trend_30_days)}%
                </div>
              </div>
              <div>
                <h3 className="text-slate-400 text-sm font-medium mb-1">Avg Price</h3>
                <p className="text-2xl font-bold text-white">{formatCurrency(marketStats.average_price)}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-2xl p-6 hover:border-white/[0.1] transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 bg-opacity-10">
                  <ChartBarIcon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-slate-400 text-sm font-medium mb-1">Median Price</h3>
                <p className="text-2xl font-bold text-white">{formatCurrency(marketStats.median_price)}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-2xl p-6 hover:border-white/[0.1] transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 bg-opacity-10">
                  <TrendingUpIcon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-slate-400 text-sm font-medium mb-1">Avg Revenue</h3>
                <p className="text-2xl font-bold text-white">{formatCurrency(marketStats.average_revenue)}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-2xl p-6 hover:border-white/[0.1] transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 bg-opacity-10">
                  <ClockIcon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-slate-400 text-sm font-medium mb-1">Days on Market</h3>
                <p className="text-2xl font-bold text-white">{marketStats.average_days_on_market} days</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-2xl p-6 hover:border-white/[0.1] transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 bg-opacity-10">
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-slate-400 text-sm font-medium mb-1">New This Month</h3>
                <p className="text-2xl font-bold text-white">{formatNumber(marketStats.new_listings_this_month)}</p>
              </div>
            </motion.div>
          </div>
        )}

        {/* Featured Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Featured Opportunities</h2>
            <button className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center">
              View All <ArrowRightIcon className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {listings.filter(l => l.listing.featured).map((listingResponse) => {
              const { listing, is_favorited, inquiry_sent } = listingResponse;
              
              return (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="relative bg-white/[0.02] backdrop-blur-xl border border-cyan-400/20 shadow-lg rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:border-white/[0.15] group"
                >
                  {/* Featured Badge */}
                  <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-yellow-500 to-orange-500 px-3 py-1 rounded-full text-xs font-bold text-white">
                    <StarIcon className="w-3 h-3 inline mr-1" />
                    FEATURED
                  </div>
                  
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
                      
                      <button className="p-2 hover:bg-white/[0.05] rounded-lg transition-colors">
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

                    <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors ml-auto" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* All Listings */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">All Listings</h2>
            <div className="flex items-center space-x-4">
              <select className="bg-white/[0.05] border border-white/[0.1] rounded-lg px-4 py-2 text-white focus:border-cyan-400/50 focus:outline-none">
                <option value="newest">Newest First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="revenue">Revenue: High to Low</option>
                <option value="most_viewed">Most Viewed</option>
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

export default WorkingMarketplaceDashboard;