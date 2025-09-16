import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  BuildingOffice2Icon,
  MapPinIcon
} from '@heroicons/react/24/outline';

const EnterpriseAnalyticsDashboard = () => {
  const revenueChartRef = useRef(null);
  const competitorChartRef = useRef(null);
  const trafficChartRef = useRef(null);
  const heatmapChartRef = useRef(null);
  const [revenueChart, setRevenueChart] = useState(null);
  const [competitorChart, setCompetitorChart] = useState(null);
  const [trafficChart, setTrafficChart] = useState(null);
  const [heatmapChart, setHeatmapChart] = useState(null);

  // Realistic market data
  const marketData = {
    revenue: {
      current: 487234,
      previous: 423891,
      growth: 14.9,
      projection: 562000
    },
    locations: {
      analyzed: 1247,
      profitable: 892,
      highRisk: 78,
      optimal: 277
    },
    competition: {
      totalCompetitors: 2843,
      directCompetitors: 186,
      marketShare: 12.7,
      priceAdvantage: 8.3
    }
  };

  useEffect(() => {
    // Revenue Trend Chart
    if (revenueChartRef.current) {
      const ctx = revenueChartRef.current.getContext('2d');
      
      if (revenueChart) {
        revenueChart.destroy();
      }

      const newRevenueChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
            label: 'Revenue Trend',
            data: [320000, 342000, 366000, 389000, 412000, 438000, 461000, 487000, 506000, 523000, 541000, 562000],
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6, 182, 212, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#06b6d4',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 6
          }, {
            label: 'Market Average',
            data: [298000, 315000, 331000, 347000, 363000, 379000, 395000, 411000, 427000, 443000, 459000, 475000],
            borderColor: '#64748b',
            backgroundColor: 'rgba(100, 116, 139, 0.05)',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: false,
              grid: {
                color: 'rgba(100, 116, 139, 0.1)'
              },
              ticks: {
                color: '#94a3b8',
                callback: function(value) {
                  return '$' + (value / 1000) + 'K';
                }
              }
            },
            x: {
              grid: {
                color: 'rgba(100, 116, 139, 0.1)'
              },
              ticks: {
                color: '#94a3b8'
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                color: '#e2e8f0',
                usePointStyle: true
              }
            }
          }
        }
      });
      setRevenueChart(newRevenueChart);
    }

    // Competitor Analysis Chart
    if (competitorChartRef.current) {
      const ctx = competitorChartRef.current.getContext('2d');
      
      if (competitorChart) {
        competitorChart.destroy();
      }

      const newCompetitorChart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ['Price Competitiveness', 'Location Quality', 'Service Level', 'Equipment Modern', 'Customer Satisfaction', 'Market Presence'],
          datasets: [{
            label: 'Your Performance',
            data: [8.7, 9.2, 8.9, 9.5, 8.8, 7.6],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            borderWidth: 2,
            pointBackgroundColor: '#10b981',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2
          }, {
            label: 'Market Average',
            data: [7.2, 6.8, 7.1, 6.9, 7.3, 8.1],
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            borderWidth: 2,
            pointBackgroundColor: '#f59e0b',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              beginAtZero: true,
              max: 10,
              grid: {
                color: 'rgba(100, 116, 139, 0.2)'
              },
              angleLines: {
                color: 'rgba(100, 116, 139, 0.2)'
              },
              pointLabels: {
                color: '#e2e8f0',
                font: {
                  size: 12
                }
              },
              ticks: {
                color: '#94a3b8',
                backdropColor: 'transparent'
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                color: '#e2e8f0',
                usePointStyle: true
              }
            }
          }
        }
      });
      setCompetitorChart(newCompetitorChart);
    }

    // Traffic Patterns Chart
    if (trafficChartRef.current) {
      const ctx = trafficChartRef.current.getContext('2d');
      
      if (trafficChart) {
        trafficChart.destroy();
      }

      const newTrafficChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'],
          datasets: [{
            label: 'Weekday Traffic',
            data: [12, 28, 45, 67, 52, 73, 89, 64, 31],
            backgroundColor: 'rgba(139, 92, 246, 0.8)',
            borderColor: '#8b5cf6',
            borderWidth: 1
          }, {
            label: 'Weekend Traffic',
            data: [8, 15, 38, 72, 84, 91, 76, 58, 42],
            backgroundColor: 'rgba(236, 72, 153, 0.8)',
            borderColor: '#ec4899',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(100, 116, 139, 0.1)'
              },
              ticks: {
                color: '#94a3b8'
              }
            },
            x: {
              grid: {
                color: 'rgba(100, 116, 139, 0.1)'
              },
              ticks: {
                color: '#94a3b8'
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                color: '#e2e8f0',
                usePointStyle: true
              }
            }
          }
        }
      });
      setTrafficChart(newTrafficChart);
    }

    // Market Heatmap (simulated with doughnut)
    if (heatmapChartRef.current) {
      const ctx = heatmapChartRef.current.getContext('2d');
      
      if (heatmapChart) {
        heatmapChart.destroy();
      }

      const newHeatmapChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['High Opportunity', 'Moderate Opportunity', 'Saturated Market', 'Emerging Market'],
          datasets: [{
            data: [34, 28, 21, 17],
            backgroundColor: [
              '#10b981',
              '#06b6d4', 
              '#f59e0b',
              '#8b5cf6'
            ],
            borderColor: '#1e293b',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#e2e8f0',
                usePointStyle: true,
                padding: 20
              }
            }
          }
        }
      });
      setHeatmapChart(newHeatmapChart);
    }

    return () => {
      if (revenueChart) revenueChart.destroy();
      if (competitorChart) competitorChart.destroy();
      if (trafficChart) trafficChart.destroy();
      if (heatmapChart) heatmapChart.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Command Center Header */}
      <div className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-[1600px] mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">LaundroTech Intelligence Command Center</h1>
              <div className="flex items-center space-x-6 text-sm text-slate-400">
                <span>Last Updated: {new Date().toLocaleString()}</span>
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  Live Data Stream Active
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-500/20 px-4 py-2 rounded-lg border border-green-500/30">
                <span className="text-green-400 font-semibold">System Status: Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-8 py-8">
        {/* Executive KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                <CurrencyDollarIcon className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="flex items-center text-green-400">
                <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                <span className="text-sm font-semibold">+{marketData.revenue.growth}%</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              ${(marketData.revenue.current / 1000).toFixed(0)}K
            </div>
            <div className="text-slate-400 text-sm">Total Revenue (YTD)</div>
            <div className="text-xs text-slate-500 mt-2">
              Projection: ${(marketData.revenue.projection / 1000).toFixed(0)}K
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-violet-600/20 rounded-xl flex items-center justify-center">
                <MapPinIcon className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-purple-400 text-sm font-semibold">
                {((marketData.locations.profitable / marketData.locations.analyzed) * 100).toFixed(1)}%
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {marketData.locations.analyzed.toLocaleString()}
            </div>
            <div className="text-slate-400 text-sm">Locations Analyzed</div>
            <div className="text-xs text-slate-500 mt-2">
              {marketData.locations.profitable} profitable opportunities
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-6 hover:border-emerald-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-xl flex items-center justify-center">
                <BuildingOffice2Icon className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="text-emerald-400 text-sm font-semibold">
                +{marketData.competition.priceAdvantage}%
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {marketData.competition.marketShare}%
            </div>
            <div className="text-slate-400 text-sm">Market Share</div>
            <div className="text-xs text-slate-500 mt-2">
              vs {marketData.competition.directCompetitors} direct competitors
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-6 hover:border-yellow-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 rounded-xl flex items-center justify-center">
                <UserGroupIcon className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-red-400 text-sm font-semibold">
                {marketData.locations.highRisk} high risk
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {marketData.locations.optimal}
            </div>
            <div className="text-slate-400 text-sm">Optimal Locations</div>
            <div className="text-xs text-slate-500 mt-2">
              Grade A+ investment opportunities
            </div>
          </div>
        </div>

        {/* Advanced Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Trend Analysis */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Revenue Trend Analysis</h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                <span className="text-sm text-slate-400">Real-time data</span>
              </div>
            </div>
            <div className="h-80">
              <canvas ref={revenueChartRef}></canvas>
            </div>
          </div>

          {/* Competitive Intelligence Radar */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Competitive Intelligence</h3>
              <div className="text-sm text-emerald-400 font-semibold">Above Market Average</div>
            </div>
            <div className="h-80">
              <canvas ref={competitorChartRef}></canvas>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Traffic Pattern Analysis */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Peak Traffic Intelligence</h3>
              <div className="text-sm text-slate-400">Hourly breakdown</div>
            </div>
            <div className="h-80">
              <canvas ref={trafficChartRef}></canvas>
            </div>
          </div>

          {/* Market Opportunity Distribution */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Market Opportunity Matrix</h3>
              <div className="text-sm text-slate-400">Geographic distribution</div>
            </div>
            <div className="h-80">
              <canvas ref={heatmapChartRef}></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseAnalyticsDashboard;