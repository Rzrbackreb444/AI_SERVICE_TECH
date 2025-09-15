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

        {/* Founder Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <div className="glass-card p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="w-48 h-48 mx-auto lg:mx-0 mb-6 rounded-full overflow-hidden border-4 border-cyan-400/30"
                >
                  <img 
                    src="https://customer-assets.emergentagent.com/job_site-atlas-ai/artifacts/q1fcsvvw_IMG_1750.jpeg" 
                    alt="Nick - Founder of LaundroTech" 
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">Nick</h3>
                <p className="text-cyan-400 text-lg mb-4">Founder & CEO</p>
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  <span className="bg-slate-800/50 px-3 py-1 rounded-full text-slate-300 text-sm">3rd Generation</span>
                  <span className="bg-slate-800/50 px-3 py-1 rounded-full text-slate-300 text-sm">Arkansas Expert</span>
                  <span className="bg-slate-800/50 px-3 py-1 rounded-full text-slate-300 text-sm">Industry Veteran</span>
                </div>
              </div>
              
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Meet the Founder</h2>
                <div className="space-y-4 text-slate-300 leading-relaxed">
                  <p className="text-lg">
                    With <strong className="text-white">three generations of Arkansas laundromat expertise</strong> running 
                    through my family, I've seen firsthand how location intelligence can make or break 
                    multi-million dollar investment decisions.
                  </p>
                  <p>
                    After watching too many great entrepreneurs fail due to poor location analysis, 
                    I combined our decades of industry knowledge with cutting-edge AI to create 
                    LaundroTech Intelligence.
                  </p>
                  <p>
                    <strong className="text-cyan-400">My mission is simple:</strong> Give every laundromat investor 
                    access to the same level of intelligence that billion-dollar corporations use for their 
                    location decisions.
                  </p>
                  <div className="bg-slate-800/30 border border-cyan-500/20 rounded-lg p-4 mt-6">
                    <p className="text-cyan-300 font-semibold mb-2">Personal Note:</p>
                    <p className="text-sm italic">
                      "Every analysis we provide could be the difference between someone's dream succeeding 
                      or failing. That's why we built LaundroTech to deliver institutional-grade intelligence 
                      with the personal touch of three generations of industry experience."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

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

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold text-white text-center mb-12">Get in Touch</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card p-8">
              <h3 className="text-xl font-bold text-white mb-4">Direct Contact</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-cyan-400 text-sm font-bold">@</span>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm">Email</div>
                    <a href="mailto:nick@laundrotech.xyz" className="text-white hover:text-cyan-400 transition-colors">
                      nick@laundrotech.xyz
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <UserGroupIcon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm">Professional Network</div>
                    <a 
                      href="https://facebook.com/groups/thelaundromat" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white hover:text-emerald-400 transition-colors"
                    >
                      67K+ Laundromat Exchange Group
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-card p-8">
              <h3 className="text-xl font-bold text-white mb-4">Arkansas Expertise</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPinIcon className="w-5 h-5 text-cyan-400" />
                  <span className="text-slate-300">Fort Smith & Van Buren Markets</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ShieldCheckIcon className="w-5 h-5 text-emerald-400" />
                  <span className="text-slate-300">Equipment & Site Analysis</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CpuChipIcon className="w-5 h-5 text-purple-400" />
                  <span className="text-slate-300">Investment Decision Support</span>
                </div>
              </div>
              <div className="mt-6 p-4 bg-slate-800/30 rounded-lg">
                <p className="text-slate-300 text-sm">
                  <strong className="text-cyan-400">Personal Consultation Available</strong><br/>
                  For critical investment decisions, I provide direct consultation 
                  combining our AI analysis with three generations of hands-on experience.
                </p>
              </div>
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