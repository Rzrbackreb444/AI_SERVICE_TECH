import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  UserGroupIcon,
  ChartBarIcon,
  MapPinIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import Navbar from './Navbar';

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Arkansas Laundromat Expertise",
      role: "3-Generation Industry Knowledge",
      description: "Decades of hands-on laundromat experience in Arkansas markets",
      expertise: ["Market Dynamics", "Equipment Selection", "Site Analysis", "Operational Excellence"]
    },
    {
      name: "Advanced AI Development",
      role: "Machine Learning Engineers", 
      description: "Cutting-edge algorithms and data science expertise",
      expertise: ["Pattern Recognition", "Predictive Analytics", "Market Intelligence", "Decision Systems"]
    }
  ];

  const milestones = [
    {
      year: "2023",
      title: "Platform Foundation",
      description: "Built core AI algorithms and data integration systems"
    },
    {
      year: "2024", 
      title: "Industry Validation",
      description: "Tested with real-world Arkansas laundromat operations"
    },
    {
      year: "2024",
      title: "SiteAtlas Evolution", 
      description: "Expanded beyond laundromats to multi-industry intelligence"
    },
    {
      year: "2025",
      title: "Enterprise Launch",
      description: "Full-scale platform ready for 67K+ professional network"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            About <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">LaundroTech</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            We combine 3 generations of Arkansas laundromat expertise with cutting-edge AI to deliver 
            unprecedented business intelligence for location-based investments.
          </p>
        </motion.div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-card p-8"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-slate-300 mb-6 leading-relaxed">
              To democratize professional-grade location intelligence, empowering entrepreneurs 
              and investors with the same analytical tools used by billion-dollar corporations.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <ChartBarIcon className="w-6 h-6 text-cyan-400" />
                <span className="text-white">Advanced Analytics for Everyone</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPinIcon className="w-6 h-6 text-emerald-400" />
                <span className="text-white">Location Intelligence Revolution</span>
              </div>
              <div className="flex items-center space-x-3">
                <CpuChipIcon className="w-6 h-6 text-blue-400" />
                <span className="text-white">AI-Powered Decision Making</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="glass-card p-8"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Our Vision</h2>
            <p className="text-slate-300 mb-6 leading-relaxed">
              To become the global standard for location-based business intelligence, 
              expanding from laundromats to all location-dependent industries.
            </p>
            <div className="bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-3">SiteAtlas Expansion</h3>
              <p className="text-slate-300 text-sm">
                Our platform evolution includes healthcare facilities, retail locations, 
                restaurants, and any business where location intelligence drives success.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold text-white text-center mb-12">Our Expertise</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="glass-card p-8 hover:scale-105 transition-all duration-300">
                <div className="flex items-center space-x-4 mb-6">
                  <UserGroupIcon className="w-12 h-12 text-cyan-400" />
                  <div>
                    <h3 className="text-xl font-bold text-white">{member.name}</h3>
                    <p className="text-cyan-400">{member.role}</p>
                  </div>
                </div>
                <p className="text-slate-300 mb-6">{member.description}</p>
                <div className="grid grid-cols-2 gap-3">
                  {member.expertise.map((skill, i) => (
                    <div key={i} className="bg-slate-800/50 px-3 py-2 rounded-lg text-center">
                      <span className="text-slate-300 text-sm">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold text-white text-center mb-12">Our Journey</h2>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center space-x-8">
                <div className="flex-shrink-0 w-24 text-center">
                  <div className="text-3xl font-bold text-cyan-400">{milestone.year}</div>
                </div>
                <div className="glass-card p-6 flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{milestone.title}</h3>
                  <p className="text-slate-300">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold text-white text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-8 text-center">
              <ShieldCheckIcon className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-4">Privacy First</h3>
              <p className="text-slate-300">
                Complete confidentiality for all business analysis and data protection.
              </p>
            </div>
            <div className="glass-card p-8 text-center">
              <SparklesIcon className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-4">Innovation</h3>
              <p className="text-slate-300">
                Continuously advancing AI capabilities to deliver better insights.
              </p>
            </div>
            <div className="glass-card p-8 text-center">
              <UserGroupIcon className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-4">Community</h3>
              <p className="text-slate-300">
                Supporting the 67K+ professional network with shared knowledge.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center glass-card p-12"
        >
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Experience Next-Level Intelligence?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Join thousands of professionals using LaundroTech Intelligence for critical business decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/analyze"
              className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300"
            >
              Try Our Platform
            </Link>
            <Link
              to="/pricing"
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300"
            >
              View Pricing
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;