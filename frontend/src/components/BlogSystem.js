import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FireIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import Navbar from './Navbar';

const BlogSystem = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Real blog posts focused on driving traffic and showcasing expertise
  const blogPosts = [
    {
      id: 1,
      title: "The Vista Laundry Decision: How AI Predicted a Million-Dollar Rebuild Choice",
      slug: "vista-laundry-million-dollar-ai-analysis",
      excerpt: "Inside look at how LaundroTech Intelligence analyzed David King's critical decision to tear down Vista Laundry and rebuild from scratch on Highway 59 in Van Buren, Arkansas.",
      author: "Nick",
      authorTitle: "Founder & CEO, LaundroTech",
      authorImage: "https://customer-assets.emergentagent.com/job_site-atlas-ai/artifacts/q1fcstvvw_IMG_1750.jpeg",
      publishDate: "December 15, 2024",
      readTime: "8 min read",
      category: "Case Studies", 
      tags: ["AI Analysis", "Investment Decisions", "Arkansas Markets", "ROI Analysis"],
      image: "https://customer-assets.emergentagent.com/job_site-atlas-ai/artifacts/fj8inoji_IMG_4674.jpeg",
      featured: true,
      views: 2347,
      trending: true
    },
    {
      id: 2,
      title: "Why The Wash Room's Rapid Expansion Strategy is Reshaping Arkansas Laundromat Markets",
      slug: "wash-room-expansion-arkansas-market-analysis", 
      excerpt: "An in-depth analysis of The Wash Room's aggressive expansion across Fort Smith, including Phoenix Ave and Kelly Highway locations, and what it means for the Arkansas laundromat industry.",
      author: "Nick",
      authorTitle: "Founder & CEO, LaundroTech",
      authorImage: "https://customer-assets.emergentagent.com/job_site-atlas-ai/artifacts/q1fcstvvw_IMG_1750.jpeg",
      publishDate: "December 12, 2024",
      readTime: "7 min read",
      category: "Market Analysis",
      tags: ["Market Expansion", "Arkansas", "The Wash Room", "Competition Analysis"],
      image: "https://customer-assets.emergentagent.com/job_site-atlas-ai/artifacts/xnmmxz1x_IMG_4673.png",
      featured: false,
      views: 1892,
      trending: true
    },
    {
      id: 3,
      title: "94.2% Accuracy: How Our AI Outperforms Traditional Site Selection Methods",
      slug: "ai-accuracy-site-selection-traditional-methods",
      excerpt: "LaundroTech AI achieves 94.2% accuracy in location analysis by processing 156+ data points that human analysts typically miss. Here's how we do it.",
      author: "Nick",
      authorTitle: "Founder & CEO, LaundroTech",
      authorImage: "https://customer-assets.emergentagent.com/job_site-atlas-ai/artifacts/q1fcstvvw_IMG_1750.jpeg",
      publishDate: "December 10, 2024",
      readTime: "9 min read",
      category: "Technology",
      tags: ["AI Analysis", "Site Selection", "Machine Learning", "Accuracy"],
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800",
      featured: false,
      views: 3421,
      trending: false
    }
  ];

  const categories = [
    { name: 'All', slug: 'all', count: blogPosts.length },
    { name: 'Case Studies', slug: 'case-studies', count: 1 },
    { name: 'Market Analysis', slug: 'market-analysis', count: 1 },
    { name: 'Technology', slug: 'technology', count: 1 }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category.toLowerCase().replace(' ', '-') === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts.find(post => post.featured);
  const trendingPosts = blogPosts.filter(post => post.trending);

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
            LaundroTech <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Intelligence</span> Blog
          </h1>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto mb-8">
            Expert insights, real-world case studies, and market intelligence from 3 generations of Arkansas laundromat expertise.
          </p>
        </motion.div>

        {/* Featured Post */}
        {featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <div className="glass-card p-8 lg:p-12 border border-cyan-400/30">
              <div className="flex items-center space-x-2 mb-4">
                <FireIcon className="w-5 h-5 text-orange-400" />
                <span className="text-orange-400 font-semibold text-sm">FEATURED ARTICLE</span>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                    {featuredPost.title}
                  </h2>
                  <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={featuredPost.authorImage} 
                        alt={featuredPost.author}
                        className="w-10 h-10 rounded-full border-2 border-cyan-400/30"
                      />
                      <div>
                        <div className="text-white font-semibold text-sm">{featuredPost.author}</div>
                        <div className="text-slate-400 text-xs">{featuredPost.authorTitle}</div>
                      </div>
                    </div>
                    <div className="text-slate-400 text-sm">
                      {featuredPost.publishDate} • {featuredPost.readTime}
                    </div>
                  </div>
                  
                  <Link
                    to={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    <span>Read Full Analysis</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>
                
                <div className="h-80 lg:h-96 rounded-2xl overflow-hidden">
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Trending Posts */}
        {trendingPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-12"
          >
            <div className="flex items-center space-x-2 mb-6">
              <TrendingUpIcon className="w-6 h-6 text-red-400" />
              <h2 className="text-2xl font-bold text-white">Trending Intelligence</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingPosts.map((post, index) => (
                <div key={post.id} className="glass-card p-6 hover:scale-105 transition-all duration-300">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      #{index + 1}
                    </span>
                    <span className="text-red-400 text-xs font-semibold">TRENDING</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-3">
                    {post.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                    <span>{post.readTime}</span>
                    <div className="flex items-center space-x-1">
                      <EyeIcon className="w-4 h-4" />
                      <span>{post.views.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <Link
                    to={`/blog/${post.slug}`}
                    className="block bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-center py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Read Analysis
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="glass-card p-8 text-center border border-emerald-400/30"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Get Exclusive Market Intelligence</h2>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Join 2,000+ laundromat professionals receiving expert insights, case studies, and market analysis. 
            Subscribe for exclusive access to our latest intelligence reports.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto mb-6">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-600 text-white rounded-lg focus:outline-none focus:border-cyan-400 transition-colors"
            />
            <button className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 whitespace-nowrap">
              Subscribe Now
            </button>
          </div>
          
          <p className="text-slate-400 text-sm">
            Weekly insights • Real case studies • No spam • Unsubscribe anytime
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogSystem;