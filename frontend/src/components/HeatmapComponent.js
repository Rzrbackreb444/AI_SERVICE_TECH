import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon,
  AdjustmentsHorizontalIcon,
  CalendarIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HeatmapComponent = ({ data, title = "Data Heatmap", className = "" }) => {
  const [loading, setLoading] = useState(true);
  const [heatmapData, setHeatmapData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [hoveredCell, setHoveredCell] = useState(null);

  const metrics = [
    { id: 'revenue', name: 'Revenue', color: '#10B981', icon: '💰' },
    { id: 'users', name: 'Active Users', color: '#3B82F6', icon: '👥' },
    { id: 'badges', name: 'Badge Sales', color: '#8B5CF6', icon: '🏆' },
    { id: 'conversion', name: 'Conversion Rate', color: '#F59E0B', icon: '📈' },
    { id: 'engagement', name: 'User Engagement', color: '#EF4444', icon: '⚡' }
  ];

  const timeframes = [
    { id: '7d', name: 'Last 7 Days' },
    { id: '30d', name: 'Last 30 Days' },
    { id: '90d', name: 'Last 90 Days' }
  ];

  useEffect(() => {
    loadHeatmapData();
  }, [selectedMetric, selectedTimeframe]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const loadHeatmapData = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get(`${API}/analytics/heatmap`, {
        headers: getAuthHeaders(),
        params: {
          metric: selectedMetric,
          timeframe: selectedTimeframe
        }
      });
      
      setHeatmapData(response.data.heatmap || []);
    } catch (error) {
      console.error('Failed to load heatmap data:', error);
      
      // Get REAL heatmap data from backend API
      const response = await axios.get(`${API}/real-analytics/heatmap-data/${lat}/${lng}?data_type=${selectedMetric}`, {
        headers: getAuthHeaders()
      });
      
      if (response.data.success) {
        setHeatmapData(response.data.heatmap_data || []);
      } else {
        // Only show empty state if no real data exists
        setHeatmapData([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const generateMockHeatmapData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    return days.map((day, dayIndex) => ({
      day,
      dayIndex,
      hours: hours.map(hour => {
        const baseValue = selectedMetric === 'revenue' ? 1000 : 
                         selectedMetric === 'users' ? 50 : 
                         selectedMetric === 'badges' ? 10 : 
                         selectedMetric === 'conversion' ? 15 : 80;
        
        // Create realistic patterns - higher activity during business hours
        let multiplier = 0.3;
        if (hour >= 9 && hour <= 17) multiplier = 1.2; // Business hours
        if (hour >= 18 && hour <= 22) multiplier = 0.8; // Evening
        if (dayIndex === 0 || dayIndex === 6) multiplier *= 0.6; // Weekends
        
        const value = Math.floor(baseValue * multiplier * (0.5 + Math.random()));
        
        return {
          hour,
          day,
          value,
          intensity: Math.min(value / (baseValue * 1.5), 1),
          timestamp: new Date(2024, 0, dayIndex + 1, hour).toISOString()
        };
      })
    }));
  };

  const getIntensityColor = (intensity, metric) => {
    const colors = {
      revenue: ['#065f46', '#047857', '#059669', '#10b981', '#34d399'],
      users: ['#1e3a8a', '#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa'],
      badges: ['#581c87', '#7c2d92', '#8b5cf6', '#a855f7', '#c084fc'],
      conversion: ['#92400e', '#b45309', '#d97706', '#f59e0b', '#fbbf24'],
      engagement: ['#991b1b', '#dc2626', '#ef4444', '#f87171', '#fca5a5']
    };
    
    const colorScale = colors[metric] || colors.revenue;
    const colorIndex = Math.floor(intensity * (colorScale.length - 1));
    return colorScale[colorIndex];
  };

  const formatValue = (value, metric) => {
    switch (metric) {
      case 'revenue':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(value);
      case 'conversion':
        return `${value.toFixed(1)}%`;
      case 'engagement':
        return `${value}%`;
      default:
        return value.toLocaleString();
    }
  };

  const getMaxValue = () => {
    if (!heatmapData.length) return 0;
    return Math.max(...heatmapData.flatMap(day => day.hours.map(hour => hour.value)));
  };

  if (loading) {
    return (
      <div className={`${className} glass-card p-8`}>
        <div className="flex items-center justify-center h-96">
          <ArrowPathIcon className="w-12 h-12 text-blue-400 animate-spin" />
          <span className="ml-4 text-white text-lg">Loading heatmap...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} glass-card`}>
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <FireIcon className="w-8 h-8 text-orange-400" />
            <div>
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <p className="text-slate-400">Activity patterns and intensity visualization</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="bg-slate-800 border border-slate-600 text-white px-3 py-2 rounded-lg text-sm"
            >
              {metrics.map(metric => (
                <option key={metric.id} value={metric.id}>
                  {metric.icon} {metric.name}
                </option>
              ))}
            </select>
            
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="bg-slate-800 border border-slate-600 text-white px-3 py-2 rounded-lg text-sm"
            >
              {timeframes.map(timeframe => (
                <option key={timeframe.id} value={timeframe.id}>{timeframe.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Metric Legend */}
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-slate-700 rounded"></div>
            <span className="text-slate-400">Low Activity</span>
          </div>
          <div className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded"
              style={{ backgroundColor: getIntensityColor(0.5, selectedMetric) }}
            ></div>
            <span className="text-slate-400">Medium Activity</span>
          </div>
          <div className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded"
              style={{ backgroundColor: getIntensityColor(1, selectedMetric) }}
            ></div>
            <span className="text-slate-400">High Activity</span>
          </div>
          <div className="ml-auto text-slate-400">
            Peak: {formatValue(getMaxValue(), selectedMetric)}
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="p-6">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Hour Labels */}
            <div className="flex mb-2">
              <div className="w-16"></div> {/* Day label spacing */}
              {Array.from({ length: 24 }, (_, i) => (
                <div key={i} className="flex-1 text-center text-xs text-slate-400 min-w-8">
                  {i.toString().padStart(2, '0')}
                </div>
              ))}
            </div>

            {/* Heatmap Rows */}
            <div className="space-y-1">
              {heatmapData.map((dayData, dayIndex) => (
                <div key={dayData.day} className="flex items-center">
                  <div className="w-16 text-sm text-slate-300 font-medium text-right pr-3">
                    {dayData.day}
                  </div>
                  <div className="flex-1 flex space-x-1">
                    {dayData.hours.map((hourData, hourIndex) => (
                      <motion.div
                        key={`${dayIndex}-${hourIndex}`}
                        className="flex-1 aspect-square rounded-sm cursor-pointer border border-slate-700/50 min-w-8 min-h-8"
                        style={{
                          backgroundColor: hourData.intensity > 0 
                            ? getIntensityColor(hourData.intensity, selectedMetric)
                            : '#374151'
                        }}
                        whileHover={{ scale: 1.1, zIndex: 10 }}
                        onMouseEnter={() => setHoveredCell({
                          day: dayData.day,
                          hour: hourData.hour,
                          value: hourData.value,
                          intensity: hourData.intensity
                        })}
                        onMouseLeave={() => setHoveredCell(null)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tooltip */}
        {hoveredCell && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed z-50 bg-slate-900 border border-slate-600 rounded-lg p-3 pointer-events-none"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="text-white font-medium">
              {hoveredCell.day}, {hoveredCell.hour.toString().padStart(2, '0')}:00
            </div>
            <div className="text-slate-300 text-sm">
              {formatValue(hoveredCell.value, selectedMetric)}
            </div>
            <div className="text-slate-400 text-xs">
              Intensity: {(hoveredCell.intensity * 100).toFixed(0)}%
            </div>
          </motion.div>
        )}
      </div>

      {/* Insights */}
      <div className="p-6 border-t border-white/10">
        <h4 className="text-white font-medium mb-4">Key Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-4">
            <div className="flex items-center space-x-2 mb-2">
              <ArrowTrendingUpIcon className="w-4 h-4 text-green-400" />
              <span className="text-slate-300 text-sm">Peak Activity</span>
            </div>
            <div className="text-white font-bold">Weekdays 10-15h</div>
            <div className="text-slate-400 text-xs">Highest engagement period</div>
          </div>
          
          <div className="glass-card p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CalendarIcon className="w-4 h-4 text-blue-400" />
              <span className="text-slate-300 text-sm">Best Day</span>
            </div>
            <div className="text-white font-bold">Wednesday</div>
            <div className="text-slate-400 text-xs">Consistently high performance</div>
          </div>
          
          <div className="glass-card p-4">
            <div className="flex items-center space-x-2 mb-2">
              <ChartBarIcon className="w-4 h-4 text-purple-400" />
              <span className="text-slate-300 text-sm">Efficiency Score</span>
            </div>
            <div className="text-white font-bold">87%</div>
            <div className="text-slate-400 text-xs">Above industry average</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapComponent;