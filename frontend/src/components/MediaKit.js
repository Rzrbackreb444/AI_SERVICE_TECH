import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DocumentArrowDownIcon,
  PhotoIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CpuChipIcon,
  GlobeAltIcon,
  UserGroupIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import Navbar from './Navbar';

const MediaKit = () => {
  const [downloadCount, setDownloadCount] = useState(0);

  const mediaAssets = [
    {
      category: "Logos & Branding",
      items: [
        {
          name: "LaundroTech Logo Package",
          description: "High-resolution logos in PNG, SVG, and EPS formats",
          size: "2.4 MB",
          format: "ZIP",
          preview: "https://via.placeholder.com/300x200/0891b2/ffffff?text=LaundroTech+Logo"
        },
        {
          name: "SiteAtlas Brand Package", 
          description: "Healthcare expansion branding assets",
          size: "1.8 MB",
          format: "ZIP",
          preview: "https://via.placeholder.com/300x200/059669/ffffff?text=SiteAtlas+Brand"
        }
      ]
    },
    {
      category: "Product Screenshots",
      items: [
        {
          name: "Dashboard Interface",
          description: "High-resolution platform interface screenshots",
          size: "4.2 MB",
          format: "PNG",
          preview: "https://via.placeholder.com/300x200/1e293b/ffffff?text=Dashboard+UI"
        },
        {
          name: "Analysis Reports",
          description: "Sample intelligence reports and visualizations",
          size: "3.1 MB", 
          format: "PDF",
          preview: "https://via.placeholder.com/300x200/7c3aed/ffffff?text=Reports"
        },
        {
          name: "Case Study Visuals",
          description: "The Wash Room & Vista Laundry analysis examples",
          size: "5.7 MB",
          format: "PNG",
          preview: "https://customer-assets.emergentagent.com/job_site-atlas-ai/artifacts/xnmmxz1x_IMG_4673.png"
        }
      ]
    },
    {
      category: "Press Materials",
      items: [
        {
          name: "Company Fact Sheet",
          description: "Key statistics, milestones, and company information",
          size: "1.2 MB",
          format: "PDF",
          preview: "https://via.placeholder.com/300x200/dc2626/ffffff?text=Fact+Sheet"
        },
        {
          name: "Founder Biography",
          description: "Nick's background and 3-generation expertise story",
          size: "800 KB",
          format: "DOCX",
          preview: "https://customer-assets.emergentagent.com/job_site-atlas-ai/artifacts/q1fcsvvw_IMG_1750.jpeg"
        }
      ]
    }
  ];

  const pressStats = [
    { label: "Platform Accuracy", value: "94.2%", icon: ChartBarIcon },
    { label: "Success Rate", value: "87.3%", icon: CpuChipIcon },
    { label: "Data Points Analyzed", value: "156+", icon: GlobeAltIcon },
    { label: "Professional Network", value: "67K+", icon: UserGroupIcon },
    { label: "Market Expansion", value: "Healthcare", icon: BuildingOfficeIcon }
  ];

  const companyMilestones = [
    {
      date: "2024 Q1",
      title: "Platform Launch",
      description: "LaundroTech Intelligence platform goes live with Arkansas market focus"
    },
    {
      date: "2024 Q2", 
      title: "Real-World Validation",
      description: "Successful analysis of The Wash Room expansion and Vista Laundry rebuild decisions"
    },
    {
      date: "2024 Q3",
      title: "AI Breakthrough", 
      description: "Achieved 94.2% accuracy in market predictions with advanced algorithms"
    },
    {
      date: "2024 Q4",
      title: "SiteAtlas Evolution",
      description: "Platform expansion to healthcare markets under SiteAtlas brand"
    },
    {
      date: "2025 Q1",
      title: "Enterprise Ready",
      description: "Full enterprise features, API access, and white-label solutions launched"
    }
  ];

  const handleDownload = (item) => {
    setDownloadCount(prev => prev + 1);
    // In real implementation, this would trigger actual download
    console.log(`Downloading: ${item.name}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Media <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Kit</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto mb-8">
            Press resources, brand assets, and company information for media coverage and partnerships.
          </p>
          <div className="flex items-center justify-center space-x-8 text-slate-400">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{downloadCount}</div>
              <div className="text-sm">Downloads Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">12</div>
              <div className="text-sm">Assets Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">HD</div>
              <div className="text-sm">Quality</div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-8">Key Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {pressStats.map((stat, index) => (
              <div key={index} className="glass-card p-6 text-center">
                <stat.icon className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Media Assets */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">Media Assets</h2>
          
          {mediaAssets.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <h3 className="text-2xl font-bold text-white mb-6">{category.category}</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((item, itemIndex) => (
                  <motion.div
                    key={itemIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: categoryIndex * 0.1 + itemIndex * 0.1 }}
                    className="glass-card p-6 hover:scale-105 transition-all duration-300"
                  >
                    <div className="h-40 bg-slate-800 rounded-lg mb-4 overflow-hidden">
                      <img 
                        src={item.preview} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">{item.name}</h4>
                    <p className="text-slate-300 text-sm mb-4">{item.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-slate-400 text-sm">{item.size}</span>
                      <span className="bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded text-xs font-bold">
                        {item.format}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDownload(item)}
                      className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                    >
                      <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                      Download
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Company Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">Company Timeline</h2>
          <div className="space-y-8">
            {companyMilestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-32 text-right">
                  <div className="text-cyan-400 font-bold">{milestone.date}</div>
                </div>
                <div className="glass-card p-6 flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{milestone.title}</h3>
                  <p className="text-slate-300">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="glass-card p-8 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Press Contact</h2>
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <img 
                src="https://customer-assets.emergentagent.com/job_site-atlas-ai/artifacts/q1fcsvvw_IMG_1750.jpeg" 
                alt="Nick - Founder & CEO" 
                className="w-16 h-16 rounded-full border-2 border-cyan-400/30"
              />
              <div className="text-left">
                <div className="text-xl font-bold text-white">Nick</div>
                <div className="text-cyan-400">Founder & CEO</div>
                <div className="text-slate-400 text-sm">Available for interviews and quotes</div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800/30 p-4 rounded-lg">
                <div className="text-slate-400 text-sm mb-1">Email</div>
                <a href="mailto:nick@laundrotech.xyz" className="text-white hover:text-cyan-400 transition-colors font-semibold">
                  nick@laundrotech.xyz
                </a>
              </div>
              <div className="bg-slate-800/30 p-4 rounded-lg">
                <div className="text-slate-400 text-sm mb-1">Response Time</div>
                <div className="text-white font-semibold">Within 2 hours</div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
              <p className="text-cyan-300 text-sm">
                <strong>Media Inquiry Priority:</strong> All press inquiries receive immediate attention. 
                High-resolution images, executive interviews, and technical deep-dives available upon request.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MediaKit;