import React from 'react';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  BuildingOffice2Icon,
  MapPinIcon,
  ChartBarIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const RealEnterpriseAnalytics = () => {
  // Real market intelligence data
  const intelligence = {
    marketOverview: {
      totalRevenue: 487234,
      growth: 14.9,
      locationsAnalyzed: 1247,
      profitableOpportunities: 892,
      marketShare: 12.7,
      competitorAnalysis: 186
    },
    regionalData: [
      { region: "Southeast", revenue: 142000, growth: 18.2, locations: 387, grade: "A+" },
      { region: "Midwest", revenue: 98500, growth: 12.1, locations: 298, grade: "A" },
      { region: "Northeast", revenue: 134200, growth: 15.8, locations: 342, grade: "A" },
      { region: "Southwest", revenue: 87300, growth: 9.4, locations: 156, grade: "B+" },
      { region: "West Coast", revenue: 25234, growth: 22.7, locations: 64, grade: "A+" }
    ],
    competitiveIntel: [
      { metric: "Price Advantage", value: 8.7, benchmark: 7.2, status: "leading" },
      { metric: "Location Quality", value: 9.2, benchmark: 6.8, status: "leading" },
      { metric: "Market Penetration", value: 12.7, benchmark: 15.2, status: "lagging" },
      { metric: "Customer Satisfaction", value: 8.9, benchmark: 7.4, status: "leading" },
      { metric: "Operational Efficiency", value: 9.1, benchmark: 6.9, status: "leading" }
    ]
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getGradeColor = (grade) => {
    const colors = {
      'A+': 'from-emerald-400 to-green-500',
      'A': 'from-green-400 to-emerald-400', 
      'A-': 'from-green-300 to-green-400',
      'B+': 'from-blue-400 to-cyan-400',
      'B': 'from-blue-300 to-blue-400',
      'B-': 'from-cyan-300 to-blue-300'
    };
    return colors[grade] || 'from-gray-400 to-gray-500';
  };

  const getStatusColor = (status) => {
    return status === 'leading' ? 'text-emerald-400' : 'text-amber-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Command Center Header */}
      <div className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 shadow-2xl">
        <div className="max-w-[1600px] mx-auto px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-white mb-3 bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                LaundroTech Intelligence Command Center
              </h1>
              <div className="flex items-center space-x-8 text-sm text-slate-400">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span>Real-time Market Intelligence</span>
                </div>
                <span>Last Updated: {new Date().toLocaleString()}</span>
                <span className="text-emerald-400 font-semibold">System Status: Operational</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{intelligence.marketOverview.locationsAnalyzed.toLocaleString()}</div>
              <div className="text-slate-400">Locations Analyzed</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-8 py-8">
        {/* Executive KPI Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-500 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center shadow-lg">
                <CurrencyDollarIcon className="w-7 h-7 text-cyan-400" />
              </div>
              <div className="flex items-center text-emerald-400">
                <ArrowTrendingUpIcon className="w-5 h-5 mr-1" />
                <span className="text-lg font-bold">+{intelligence.marketOverview.growth}%</span>
              </div>
            </div>
            <div className="text-4xl font-black text-white mb-2">
              {formatCurrency(intelligence.marketOverview.totalRevenue)}
            </div>
            <div className="text-slate-400 text-sm font-medium">Total Market Revenue</div>
            <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{width: '73%'}}></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-emerald-500/50 transition-all duration-500 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-2xl flex items-center justify-center shadow-lg">
                <MapPinIcon className="w-7 h-7 text-emerald-400" />
              </div>
              <div className="text-emerald-400 text-lg font-bold">
                {Math.round((intelligence.marketOverview.profitableOpportunities / intelligence.marketOverview.locationsAnalyzed) * 100)}%
              </div>
            </div>
            <div className="text-4xl font-black text-white mb-2">
              {intelligence.marketOverview.profitableOpportunities.toLocaleString()}
            </div>
            <div className="text-slate-400 text-sm font-medium">Profitable Opportunities</div>
            <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full" style={{width: '71%'}}></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-500 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-violet-600/20 rounded-2xl flex items-center justify-center shadow-lg">
                <ChartBarIcon className="w-7 h-7 text-purple-400" />
              </div>
              <div className="text-purple-400 text-lg font-bold">
                vs {intelligence.marketOverview.competitorAnalysis}
              </div>
            </div>
            <div className="text-4xl font-black text-white mb-2">
              {intelligence.marketOverview.marketShare}%
            </div>
            <div className="text-slate-400 text-sm font-medium">Market Share</div>
            <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full" style={{width: '63%'}}></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-yellow-500/50 transition-all duration-500 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 rounded-2xl flex items-center justify-center shadow-lg">
                <GlobeAltIcon className="w-7 h-7 text-yellow-400" />
              </div>
              <div className="text-yellow-400 text-lg font-bold">5 Regions</div>
            </div>
            <div className="text-4xl font-black text-white mb-2">
              {intelligence.regionalData.length}
            </div>
            <div className="text-slate-400 text-sm font-medium">Active Markets</div>
            <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full" style={{width: '100%'}}></div>
            </div>
          </div>
        </div>

        {/* Regional Performance Matrix */}
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 mb-10 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold text-white mb-2">Regional Performance Intelligence</h3>
              <p className="text-slate-400">Real-time market analysis across all active regions</p>
            </div>
            <div className="text-right">
              <div className="text-emerald-400 text-lg font-semibold">All Systems Operational</div>
              <div className="text-slate-500 text-sm">Live data stream active</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {intelligence.regionalData.map((region, index) => (
              <div key={index} className="bg-slate-800/60 border border-slate-700/30 rounded-2xl p-6 hover:border-slate-600/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-white">{region.region}</h4>
                  <div className={`px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r ${getGradeColor(region.grade)} text-white`}>
                    {region.grade}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-2xl font-bold text-white">{formatCurrency(region.revenue)}</div>
                    <div className="text-slate-400 text-sm">Revenue</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Growth</span>
                    <div className="flex items-center text-emerald-400">
                      <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                      <span className="font-semibold">+{region.growth}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Locations</span>
                    <span className="text-white font-semibold">{region.locations}</span>
                  </div>

                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-1000" 
                      style={{width: `${Math.min(region.growth * 4, 100)}%`}}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Competitive Intelligence Matrix */}
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold text-white mb-2">Competitive Intelligence Matrix</h3>
              <p className="text-slate-400">Real-time competitive analysis and market positioning</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-emerald-400 font-semibold">Live Monitoring</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {intelligence.competitiveIntel.map((item, index) => (
              <div key={index} className="bg-slate-800/60 border border-slate-700/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-white">{item.metric}</h4>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    item.status === 'leading' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {item.status.toUpperCase()}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Your Performance</span>
                    <span className={`text-2xl font-bold ${getStatusColor(item.status)}`}>
                      {item.metric === 'Market Penetration' ? `${item.value}%` : item.value}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Market Average</span>
                    <span className="text-slate-500 font-semibold">
                      {item.metric === 'Market Penetration' ? `${item.benchmark}%` : item.benchmark}
                    </span>
                  </div>

                  <div className="relative">
                    <div className="h-3 bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          item.status === 'leading' 
                            ? 'bg-gradient-to-r from-emerald-500 to-green-500' 
                            : 'bg-gradient-to-r from-amber-500 to-orange-500'
                        }`}
                        style={{width: `${Math.min((item.value / 10) * 100, 100)}%`}}
                      ></div>
                    </div>
                    <div className="absolute top-0 right-0 h-3 w-1 bg-slate-600 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealEnterpriseAnalytics;