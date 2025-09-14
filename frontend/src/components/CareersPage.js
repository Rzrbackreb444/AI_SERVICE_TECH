import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CareersPage = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [applicationData, setApplicationData] = useState({
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    portfolio: '',
    position: '',
    experience_years: '',
    salary_expectation: '',
    start_date: '',
    cover_letter: '',
    why_laundrotech: '',
    remote_preference: 'hybrid'
  });

  useEffect(() => {
    loadCareersData();
  }, []);

  const loadCareersData = async () => {
    try {
      const [jobsResponse, blogResponse] = await Promise.all([
        axios.get(`${API}/careers/jobs`),
        axios.get(`${API}/careers/blog`)
      ]);
      
      setJobs(jobsResponse.data.jobs || []);
      setBlogPosts(blogResponse.data.posts || []);
    } catch (error) {
      console.error('Failed to load careers data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setApplicationData({
      ...applicationData,
      [e.target.name]: e.target.value
    });
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post(`${API}/careers/apply`, {
        ...applicationData,
        job_id: selectedJob?.id
      });
      
      alert('Application submitted successfully! We\'ll be in touch soon.');
      setShowApplicationForm(false);
      setApplicationData({
        name: '',
        email: '',
        phone: '',
        linkedin: '',
        portfolio: '',
        position: '',
        experience_years: '',
        salary_expectation: '',
        start_date: '',
        cover_letter: '',
        why_laundrotech: '',
        remote_preference: 'hybrid'
      });
    } catch (error) {
      alert('Failed to submit application. Please try again or email directly to nick@laundrotech.xyz');
    }
  };

  // Mock job data if API doesn't return jobs
  const mockJobs = [
    {
      id: 1,
      title: 'Senior Full-Stack Developer',
      department: 'Engineering',
      location: 'Arkansas / Remote',
      type: 'Full-time',
      experience: '5+ years',
      salary: '$120k - $160k',
      description: 'Join our core engineering team building the future of location intelligence for the laundromat industry.',
      requirements: [
        'Expert-level React and Node.js experience',
        'Experience with AI/ML integration',
        'Background in mapping/GIS technologies',
        'Understanding of business intelligence platforms'
      ],
      benefits: [
        'Equity participation in growing company',
        'Flexible remote work options',
        'Health, dental, vision insurance',
        'Professional development budget'
      ]
    },
    {
      id: 2,
      title: 'AI/Data Science Engineer',
      department: 'Data Science',
      location: 'Arkansas / Remote',
      type: 'Full-time',
      experience: '3+ years',
      salary: '$110k - $140k',
      description: 'Lead the development of our proprietary AI algorithms for location analysis and market intelligence.',
      requirements: [
        'PhD or Masters in Data Science, ML, or related field',
        'Experience with Python, TensorFlow, PyTorch',
        'Background in geospatial data analysis',
        'Knowledge of statistical modeling and prediction'
      ],
      benefits: [
        'Work directly with founder Nick Kremers',
        'Shape the future of AI in commercial real estate',
        'Equity participation',
        'Conference and research budget'
      ]
    },
    {
      id: 3,
      title: 'Business Development Manager',
      department: 'Sales',
      location: 'Arkansas / Travel Required',
      type: 'Full-time',
      experience: '3+ years',
      salary: '$80k - $120k + Commission',
      description: 'Drive growth by building relationships with laundromat operators, real estate professionals, and industry partners.',
      requirements: [
        'B2B sales experience, preferably SaaS',
        'Understanding of commercial real estate',
        'Excellent communication and presentation skills',
        'Willingness to travel for conferences and meetings'
      ],
      benefits: [
        'Uncapped commission structure',
        'Travel expense coverage',
        'Direct access to 67k+ member community',
        'Equity participation'
      ]
    }
  ];

  const displayJobs = jobs.length > 0 ? jobs : mockJobs;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading careers...</p>
        </div>
      </div>
    );
  }

  if (showApplicationForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              Apply for {selectedJob?.title}
            </h1>
            <button 
              onClick={() => setShowApplicationForm(false)}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              ← Back to Jobs
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20"
          >
            <form onSubmit={handleApplicationSubmit} className="space-y-6">
              
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={applicationData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={applicationData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={applicationData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    value={applicationData.linkedin}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Professional Information */}
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Years of Experience *
                  </label>
                  <select
                    name="experience_years"
                    value={applicationData.experience_years}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select...</option>
                    <option value="0-1">0-1 years</option>
                    <option value="2-3">2-3 years</option>
                    <option value="4-5">4-5 years</option>
                    <option value="6-10">6-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Salary Expectation
                  </label>
                  <input
                    type="text"
                    name="salary_expectation"
                    value={applicationData.salary_expectation}
                    onChange={handleInputChange}
                    placeholder="$120k - $150k"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Work Preference
                  </label>
                  <select
                    name="remote_preference"
                    value={applicationData.remote_preference}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="remote">Fully Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">On-site (Arkansas)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Portfolio/GitHub (if applicable)
                </label>
                <input
                  type="url"
                  name="portfolio"
                  value={applicationData.portfolio}
                  onChange={handleInputChange}
                  placeholder="https://github.com/yourprofile or portfolio link"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Cover Letter *
                </label>
                <textarea
                  name="cover_letter"
                  value={applicationData.cover_letter}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  placeholder="Tell us about your background, relevant experience, and what excites you about this role..."
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>

              {/* Why LaundroTech */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Why LaundroTech? *
                </label>
                <textarea
                  name="why_laundrotech"
                  value={applicationData.why_laundrotech}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  placeholder="What draws you to LaundroTech and our mission? How do you see yourself contributing to our growth?"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Submit Application
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-6">
            Join LaundroTech
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Help us revolutionize location intelligence for the laundromat industry
          </p>
          <div className="bg-blue-500/20 rounded-lg p-6 max-w-3xl mx-auto">
            <p className="text-gray-200 text-lg">
              We're building the future of commercial real estate intelligence. Join a team that combines 
              <strong className="text-blue-400"> Arkansas grit</strong> with 
              <strong className="text-purple-400"> cutting-edge AI</strong> to help operators make 
              million-dollar decisions with confidence.
            </p>
          </div>
        </motion.div>

        {/* Open Positions */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Open Positions</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-blue-500/50 transition-all duration-300 cursor-pointer"
                onClick={() => {
                  setSelectedJob(job);
                  setApplicationData(prev => ({ ...prev, position: job.title }));
                  setShowApplicationForm(true);
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-white">{job.title}</h3>
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    {job.type}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-300 mb-4">
                  <p><strong>Department:</strong> {job.department}</p>
                  <p><strong>Location:</strong> {job.location}</p>
                  <p><strong>Experience:</strong> {job.experience}</p>
                  <p><strong>Salary:</strong> {job.salary}</p>
                </div>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {job.description}
                </p>
                
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  Apply Now
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Company Culture */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Why Work at LaundroTech?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-lg font-bold text-white mb-2">Growth Potential</h3>
              <p className="text-gray-300 text-sm">
                Join a rapidly scaling company with equity participation and leadership opportunities
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="text-lg font-bold text-white mb-2">Remote-First</h3>
              <p className="text-gray-300 text-sm">
                Work from anywhere with flexible hours and quarterly team meetups in Arkansas
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-lg font-bold text-white mb-2">Innovation</h3>
              <p className="text-gray-300 text-sm">
                Work on cutting-edge AI and mapping technologies that directly impact business success
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-lg font-bold text-white mb-2">Mission-Driven</h3>
              <p className="text-gray-300 text-sm">
                Help real families make better business decisions and build generational wealth
              </p>
            </div>
          </div>
        </motion.div>

        {/* Blog Section */}
        {blogPosts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Company Updates</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {blogPosts.slice(0, 4).map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
                >
                  <h3 className="text-lg font-bold text-white mb-2">{post.title}</h3>
                  <p className="text-gray-400 text-sm mb-3">{post.excerpt}</p>
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    <span>{post.author}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Contact Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-8 border border-blue-500/30">
            <h2 className="text-2xl font-bold text-white mb-4">Don't See Your Role?</h2>
            <p className="text-gray-300 mb-6">
              We're always looking for exceptional talent. Send us your resume and tell us how you'd like to contribute.
            </p>
            <a 
              href="mailto:nick@laundrotech.xyz" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 inline-block"
            >
              Email Us: nick@laundrotech.xyz
            </a>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default CareersPage;