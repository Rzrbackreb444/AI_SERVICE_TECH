// Simple CSS-based chart components to replace recharts
import React from 'react';

export const ResponsiveContainer = ({ children, width = "100%", height = 300 }) => (
  <div style={{ width, height }} className="chart-container">
    {children}
  </div>
);

export const LineChart = ({ data, children }) => (
  <div className="simple-line-chart">
    <div className="chart-data" data-values={JSON.stringify(data)}>
      {children}
    </div>
  </div>
);

export const Line = ({ dataKey, stroke = "#3b82f6" }) => null;

export const XAxis = ({ dataKey }) => (
  <div className="x-axis" data-key={dataKey}></div>
);

export const YAxis = () => (
  <div className="y-axis"></div>
);

export const CartesianGrid = ({ strokeDasharray }) => (
  <div className="grid" data-dash={strokeDasharray}></div>
);

export const Tooltip = () => (
  <div className="chart-tooltip"></div>
);

export const BarChart = ({ data, children }) => (
  <div className="simple-bar-chart">
    <div className="bars-container">
      {data && data.map((item, index) => (
        <div key={index} className="bar-item">
          <div 
            className="bar" 
            style={{ 
              height: `${Math.max(item.value || 0, 0) / 100 * 80}%`,
              backgroundColor: '#3b82f6'
            }}
          ></div>
          <span className="bar-label">{item.name}</span>
        </div>
      ))}
    </div>
    {children}
  </div>
);

export const Bar = ({ dataKey, fill = "#3b82f6" }) => null;

export const PieChart = ({ data, children }) => (
  <div className="simple-pie-chart">
    <div className="pie-container">
      {data && data.map((item, index) => (
        <div 
          key={index} 
          className="pie-segment"
          style={{
            '--segment-color': `hsl(${index * 60}, 70%, 50%)`,
            '--segment-size': `${(item.value || 0) / data.reduce((sum, d) => sum + (d.value || 0), 0) * 100}%`
          }}
        >
          {item.name}: {item.value}
        </div>
      ))}
    </div>
    {children}
  </div>
);

export const Pie = ({ dataKey, cx, cy, outerRadius, fill, label }) => null;

export const Cell = ({ fill }) => null;

export const Legend = () => (
  <div className="chart-legend"></div>
);

export const Area = ({ dataKey, stroke, fill }) => null;

export const AreaChart = ({ data, children }) => (
  <div className="simple-area-chart">
    <div className="area-container" data-values={JSON.stringify(data)}>
      {children}
    </div>
  </div>
);