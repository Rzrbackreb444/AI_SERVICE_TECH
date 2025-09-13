import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Map, { Marker, Popup, Source, Layer, NavigationControl, ScaleControl } from 'react-map-gl';
import { 
  MapPinIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  AdjustmentsHorizontalIcon,
  EyeIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import 'mapbox-gl/dist/mapbox-gl.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const MAPBOX_TOKEN = "pk.eyJ1IjoicmF6b3JiYWNrcmViIiwiYSI6ImNtZjVtZjRmdjA3bXAya3EwcTljOTlxZDMifQ.kXXBJs7_5bXyPO2hPlDMsA";

const InteractiveMap = ({ analyticsData, className = "" }) => {
  const [viewState, setViewState] = useState({
    longitude: -98.5795,
    latitude: 39.8283,
    zoom: 4
  });
  
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/dark-v11');
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showUserData, setShowUserData] = useState(true);
  const [showRevenueData, setShowRevenueData] = useState(true);
  const [isRealTime, setIsRealTime] = useState(false);
  const [realTimeData, setRealTimeData] = useState([]);
  const mapRef = useRef();

  // Sample geographic data (in real app, this would come from analytics API)
  const [locationData, setLocationData] = useState([
    {
      id: 1,
      city: "New York",
      state: "NY",
      coordinates: [-73.935242, 40.730610],
      users: 245,
      revenue: 12890,
      badges: { verified_seller: 45, vendor_partner: 28, verified_funder: 12 },
      growth: 23.5,
      averageOrderValue: 156.78
    },
    {
      id: 2,
      city: "Los Angeles",
      state: "CA", 
      coordinates: [-118.243685, 34.052234],
      users: 189,
      revenue: 9870,
      badges: { verified_seller: 38, vendor_partner: 22, verified_funder: 8 },
      growth: 18.2,
      averageOrderValue: 142.30
    },
    {
      id: 3,
      city: "Chicago",
      state: "IL",
      coordinates: [-87.623177, 41.881832],
      users: 156,
      revenue: 8450,
      badges: { verified_seller: 32, vendor_partner: 18, verified_funder: 6 },
      growth: 15.7,
      averageOrderValue: 134.90
    },
    {
      id: 4,
      city: "Houston",
      state: "TX",
      coordinates: [-95.358421, 29.749907],
      users: 134,
      revenue: 7320,
      badges: { verified_seller: 28, vendor_partner: 15, verified_funder: 5 },
      growth: 12.4,
      averageOrderValue: 128.50
    },
    {
      id: 5,
      city: "Phoenix",
      state: "AZ",
      coordinates: [-112.073844, 33.448457],
      users: 98,
      revenue: 5680,
      badges: { verified_seller: 21, vendor_partner: 12, verified_funder: 3 },
      growth: 28.9,
      averageOrderValue: 145.20
    },
    {
      id: 6,
      city: "Miami",
      state: "FL",
      coordinates: [-80.191790, 25.761680],
      users: 87,
      revenue: 4950,
      badges: { verified_seller: 18, vendor_partner: 10, verified_funder: 4 },
      growth: 31.2,
      averageOrderValue: 167.80
    }
  ]);

  const heatmapData = {
    type: 'FeatureCollection',
    features: locationData.map(location => ({
      type: 'Feature',
      properties: {
        revenue: location.revenue,
        users: location.users,
        city: location.city,
        state: location.state
      },
      geometry: {
        type: 'Point',
        coordinates: location.coordinates
      }
    }))
  };

  const heatmapLayer = {
    id: 'revenue-heatmap',
    type: 'heatmap',
    source: 'revenue-data',
    maxzoom: 15,
    paint: {
      'heatmap-weight': [
        'interpolate',
        ['linear'],
        ['get', 'revenue'],
        0, 0,
        15000, 1
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
        0, 'rgba(33, 102, 172, 0)',
        0.2, 'rgb(103, 169, 207)',
        0.4, 'rgb(209, 229, 240)',
        0.6, 'rgb(253, 219, 199)',
        0.8, 'rgb(239, 138, 98)',
        1, 'rgb(178, 24, 43)'
      ],
      'heatmap-radius': [
        'interpolate',
        ['linear'],
        ['zoom'],
        0, 20,
        15, 40
      ],
      'heatmap-opacity': [
        'interpolate',
        ['linear'],
        ['zoom'],
        7, 1,
        15, 0
      ]
    }
  };

  useEffect(() => {
    let interval;
    if (isRealTime) {
      interval = setInterval(() => {
        // Simulate real-time data updates
        setLocationData(prevData => 
          prevData.map(location => ({
            ...location,
            users: location.users + Math.floor(Math.random() * 3),
            revenue: location.revenue + Math.floor(Math.random() * 100)
          }))
        );
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isRealTime]);

  const getMarkerSize = (revenue) => {
    const baseSize = 20;
    const maxSize = 60;
    const maxRevenue = Math.max(...locationData.map(l => l.revenue));
    return baseSize + (revenue / maxRevenue) * (maxSize - baseSize);
  };

  const getMarkerColor = (growth) => {
    if (growth > 25) return '#10B981'; // Green
    if (growth > 15) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const mapStyles = [
    { id: 'dark', name: 'Dark', style: 'mapbox://styles/mapbox/dark-v11' },
    { id: 'light', name: 'Light', style: 'mapbox://styles/mapbox/light-v11' },
    { id: 'satellite', name: 'Satellite', style: 'mapbox://styles/mapbox/satellite-v9' },
    { id: 'streets', name: 'Streets', style: 'mapbox://styles/mapbox/streets-v12' }
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-10 glass-card p-4 space-y-3">
        <div className="flex items-center space-x-2">
          <AdjustmentsHorizontalIcon className="w-5 h-5 text-white" />
          <span className="text-white font-medium">Map Controls</span>
        </div>
        
        <div className="space-y-2">
          <label className="block text-slate-300 text-sm font-medium">Map Style</label>
          <select
            value={mapStyle}
            onChange={(e) => setMapStyle(e.target.value)}
            className="w-full bg-slate-800 border border-slate-600 text-white px-3 py-2 rounded text-sm"
          >
            {mapStyles.map(style => (
              <option key={style.id} value={style.style}>{style.name}</option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          {[
            { key: 'showHeatmap', label: 'Revenue Heatmap', value: showHeatmap, setter: setShowHeatmap },
            { key: 'showUserData', label: 'User Markers', value: showUserData, setter: setShowUserData },
            { key: 'showRevenueData', label: 'Revenue Data', value: showRevenueData, setter: setShowRevenueData }
          ].map(control => (
            <div key={control.key} className="flex items-center justify-between">
              <span className="text-slate-300 text-sm">{control.label}</span>
              <button
                onClick={() => control.setter(!control.value)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  control.value ? 'bg-blue-500' : 'bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                    control.value ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
        
        <div className="pt-2 border-t border-slate-600">
          <button
            onClick={() => setIsRealTime(!isRealTime)}
            className={`flex items-center space-x-2 w-full px-3 py-2 rounded text-sm font-medium transition-colors ${
              isRealTime 
                ? 'bg-green-500 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {isRealTime ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
            <span>{isRealTime ? 'Pause Real-time' : 'Start Real-time'}</span>
          </button>
        </div>
      </div>

      {/* Map Stats */}
      <div className="absolute top-4 right-4 z-10 glass-card p-4 space-y-3">
        <div className="flex items-center space-x-2">
          <ChartBarIcon className="w-5 h-5 text-white" />
          <span className="text-white font-medium">Live Stats</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-300 text-sm">Total Users:</span>
            <span className="text-white font-medium">
              {locationData.reduce((sum, loc) => sum + loc.users, 0).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-300 text-sm">Total Revenue:</span>
            <span className="text-white font-medium">
              {formatCurrency(locationData.reduce((sum, loc) => sum + loc.revenue, 0))}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-300 text-sm">Active Cities:</span>
            <span className="text-white font-medium">{locationData.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-300 text-sm">Avg Growth:</span>
            <span className="text-green-400 font-medium">
              +{(locationData.reduce((sum, loc) => sum + loc.growth, 0) / locationData.length).toFixed(1)}%
            </span>
          </div>
        </div>
        
        {isRealTime && (
          <div className="pt-2 border-t border-slate-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm">Live Updates Active</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Map */}
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
        mapStyle={mapStyle}
        interactiveLayerIds={['revenue-heatmap']}
      >
        <NavigationControl position="bottom-right" />
        <ScaleControl position="bottom-left" />

        {/* Heatmap Layer */}
        {showHeatmap && (
          <Source id="revenue-data" type="geojson" data={heatmapData}>
            <Layer {...heatmapLayer} />
          </Source>
        )}

        {/* Location Markers */}
        {showUserData && locationData.map(location => (
          <Marker
            key={location.id}
            longitude={location.coordinates[0]}
            latitude={location.coordinates[1]}
            anchor="bottom"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="cursor-pointer"
              onClick={() => setSelectedLocation(location)}
            >
              <div
                className="rounded-full border-2 border-white shadow-lg flex items-center justify-center"
                style={{
                  width: `${getMarkerSize(location.revenue)}px`,
                  height: `${getMarkerSize(location.revenue)}px`,
                  backgroundColor: getMarkerColor(location.growth)
                }}
              >
                <UserGroupIcon className="w-4 h-4 text-white" />
              </div>
            </motion.div>
          </Marker>
        ))}

        {/* Location Popup */}
        {selectedLocation && (
          <Popup
            longitude={selectedLocation.coordinates[0]}
            latitude={selectedLocation.coordinates[1]}
            anchor="top"
            onClose={() => setSelectedLocation(null)}
            closeButton={true}
            closeOnClick={false}
            className="location-popup"
          >
            <div className="p-3 bg-slate-900 text-white rounded-lg min-w-72">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold">
                  {selectedLocation.city}, {selectedLocation.state}
                </h3>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  selectedLocation.growth > 25 ? 'bg-green-500' :
                  selectedLocation.growth > 15 ? 'bg-yellow-500' : 'bg-red-500'
                }`}>
                  +{selectedLocation.growth}%
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <UserGroupIcon className="w-4 h-4 text-blue-400" />
                    <span className="text-slate-300 text-sm">Users</span>
                  </div>
                  <div className="text-xl font-bold">{selectedLocation.users.toLocaleString()}</div>
                </div>
                
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <CurrencyDollarIcon className="w-4 h-4 text-green-400" />
                    <span className="text-slate-300 text-sm">Revenue</span>
                  </div>
                  <div className="text-xl font-bold">{formatCurrency(selectedLocation.revenue)}</div>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-slate-700">
                <h4 className="text-sm font-medium text-slate-300 mb-2">Active Badges</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Verified Sellers:</span>
                    <span className="text-green-400">{selectedLocation.badges.verified_seller}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Vendor Partners:</span>
                    <span className="text-blue-400">{selectedLocation.badges.vendor_partner}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Verified Funders:</span>
                    <span className="text-purple-400">{selectedLocation.badges.verified_funder}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-slate-700">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Avg Order Value:</span>
                  <span className="text-white font-medium">{formatCurrency(selectedLocation.averageOrderValue)}</span>
                </div>
              </div>
            </div>
          </Popup>
        )}
      </Map>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 glass-card p-4">
        <h4 className="text-white font-medium mb-3">Map Legend</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-slate-300 text-sm">High Growth (&gt;25%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span className="text-slate-300 text-sm">Medium Growth (15-25%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-slate-300 text-sm">Low Growth (&lt;15%)</span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-600">
            <div className="text-slate-400 text-xs">Marker size = Revenue volume</div>
            <div className="text-slate-400 text-xs">Heat intensity = User concentration</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;