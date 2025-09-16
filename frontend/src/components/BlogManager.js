import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ChartBarIcon,
  TagIcon,
  CalendarIcon,
  GlobeAltIcon,
  SparklesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../App';
import axios from 'axios';

const BlogManager = () => {
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [filter, setFilter] = useState('all');
  
  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'Market Analysis',
    tags: [],
    featured_image: '',
    seo_title: '',
    meta_description: '',
    focus_keyphrase: '',
    status: 'draft'
  });

  const [tagInput, setTagInput] = useState('');
  const [seoAnalysis, setSeoAnalysis] = useState(null);

  const API = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001'}/api`;

  const categories = [
    'Market Analysis',
    'Investment Strategies', 
    'Case Studies',
    'Industry News',
    'Equipment Reviews',
    'Location Intelligence',
    'Financial Analysis',
    'Technology'
  ];

  useEffect(() => {
    loadPosts();
  }, [filter]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/blog/posts?status=${filter}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setPosts(response.data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const postData = {
        ...postForm,
        tags: postForm.tags.filter(tag => tag.trim())
      };

      if (editingPost) {
        await axios.put(`${API}/blog/posts/${editingPost.id}`, postData, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
      } else {
        await axios.post(`${API}/blog/create`, postData, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
      }

      resetForm();
      loadPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post. Please try again.');
    }
  };

  const resetForm = () => {
    setPostForm({
      title: '',
      content: '',
      excerpt: '',
      category: 'Market Analysis',
      tags: [],
      featured_image: '',
      seo_title: '',
      meta_description: '',
      focus_keyphrase: '',
      status: 'draft'
    });
    setEditingPost(null);
    setShowEditor(false);
    setSeoAnalysis(null);
  };

  const editPost = (post) => {
    setPostForm({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      category: post.category,
      tags: post.tags || [],
      featured_image: post.featured_image || '',
      seo_title: post.seo_title || '',
      meta_description: post.meta_description || '',
      focus_keyphrase: post.focus_keyphrase || '',
      status: post.status
    });
    setEditingPost(post);
    setShowEditor(true);
  };

  const deletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await axios.delete(`${API}/blog/posts/${postId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      loadPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post.');
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !postForm.tags.includes(tagInput.trim())) {
      setPostForm(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setPostForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const analyzeSEO = async () => {
    if (!postForm.title || !postForm.content || !postForm.focus_keyphrase) {
      alert('Please fill in title, content, and focus keyphrase for SEO analysis.');
      return;
    }

    // Simulate SEO analysis (in production, this would call the backend)
    const analysis = {
      overall_score: 75,
      title_optimization: postForm.focus_keyphrase.toLowerCase().includes(postForm.title.toLowerCase()) ? 90 : 30,
      content_length: postForm.content.length > 1000 ? 85 : 50,
      keyphrase_density: 2.1,
      meta_description_length: postForm.meta_description.length,
      recommendations: []
    };

    if (analysis.title_optimization < 70) {
      analysis.recommendations.push('Include your focus keyphrase in the title');
    }
    if (analysis.content_length < 70) {
      analysis.recommendations.push('Content should be at least 1000 words for better SEO');
    }
    if (analysis.meta_description_length < 120 || analysis.meta_description_length > 160) {
      analysis.recommendations.push('Meta description should be 120-160 characters');
    }

    setSeoAnalysis(analysis);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'draft':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'scheduled':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/40';
    }
  };

  const getSEOScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-slate-400">Please log in to manage blog posts.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">Blog Manager</h1>
            <p className="text-slate-400">Create and manage SEO-optimized blog posts</p>
          </div>
          <button
            onClick={() => setShowEditor(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-2xl transition-all transform hover:scale-105"
          >
            <PlusIcon className="w-5 h-5" />
            New Post
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8">
          {['all', 'published', 'draft', 'scheduled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl font-medium capitalize transition-all ${
                filter === status
                  ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/50'
                  : 'bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700/50'
              }`}
            >
              {status === 'all' ? 'All Posts' : status}
            </button>
          ))}
        </div>

        {/* Posts List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 hover:border-cyan-500/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(post.status)}`}>
                    {post.status.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${getSEOScoreColor(post.seo_score || 0)}`}>
                      SEO: {(post.seo_score || 0).toFixed(0)}%
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {(post.tags || []).slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-lg">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                  <span className="flex items-center gap-1">
                    <EyeIcon className="w-4 h-4" />
                    {post.views || 0}
                  </span>
                  <span>{post.category}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => editPost(post)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white rounded-xl transition-all"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded-xl transition-all"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Blog Editor Modal */}
        <AnimatePresence>
          {showEditor && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {editingPost ? 'Edit Post' : 'Create New Post'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={postForm.title}
                        onChange={(e) => setPostForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50"
                        placeholder="Enter post title..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Category
                      </label>
                      <select
                        value={postForm.category}
                        onChange={(e) => setPostForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Content *
                    </label>
                    <textarea
                      value={postForm.content}
                      onChange={(e) => setPostForm(prev => ({ ...prev, content: e.target.value }))}
                      rows={12}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50"
                      placeholder="Write your post content..."
                      required
                    />
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Excerpt *
                    </label>
                    <textarea
                      value={postForm.excerpt}
                      onChange={(e) => setPostForm(prev => ({ ...prev, excerpt: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50"
                      placeholder="Brief description of the post..."
                      required
                    />
                  </div>

                  {/* SEO Section */}
                  <div className="border-t border-slate-700/50 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">SEO Optimization</h3>
                      <button
                        type="button"
                        onClick={analyzeSEO}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 rounded-xl hover:bg-emerald-600/30 transition-all"
                      >
                        <SparklesIcon className="w-4 h-4" />
                        Analyze SEO
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Focus Keyphrase *
                        </label>
                        <input
                          type="text"
                          value={postForm.focus_keyphrase}
                          onChange={(e) => setPostForm(prev => ({ ...prev, focus_keyphrase: e.target.value }))}
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50"
                          placeholder="laundromat investment tips"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          SEO Title
                        </label>
                        <input
                          type="text"
                          value={postForm.seo_title}
                          onChange={(e) => setPostForm(prev => ({ ...prev, seo_title: e.target.value }))}
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50"
                          placeholder="SEO optimized title..."
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-white mb-2">
                        Meta Description
                      </label>
                      <textarea
                        value={postForm.meta_description}
                        onChange={(e) => setPostForm(prev => ({ ...prev, meta_description: e.target.value }))}
                        rows={3}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50"
                        placeholder="120-160 character description for search results..."
                      />
                      <div className="text-xs text-slate-500 mt-1">
                        {postForm.meta_description.length}/160 characters
                      </div>
                    </div>
                  </div>

                  {/* SEO Analysis Results */}
                  {seoAnalysis && (
                    <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
                      <h4 className="text-white font-semibold mb-3">SEO Analysis</h4>
                      <div className="flex items-center gap-4 mb-3">
                        <div className={`text-2xl font-bold ${getSEOScoreColor(seoAnalysis.overall_score)}`}>
                          {seoAnalysis.overall_score}%
                        </div>
                        <div className="text-slate-400">Overall SEO Score</div>
                      </div>
                      {seoAnalysis.recommendations.length > 0 && (
                        <div>
                          <h5 className="text-white font-medium mb-2">Recommendations:</h5>
                          <ul className="space-y-1">
                            {seoAnalysis.recommendations.map((rec, index) => (
                              <li key={index} className="text-amber-400 text-sm flex items-start gap-2">
                                <ExclamationTriangleIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Tags
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        className="flex-1 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50"
                        placeholder="Add a tag..."
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="px-4 py-2 bg-cyan-600/20 text-cyan-400 border border-cyan-500/40 rounded-xl hover:bg-cyan-600/30 transition-all"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {postForm.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="flex items-center gap-1 px-3 py-1 bg-slate-700/50 text-slate-300 text-sm rounded-lg"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="text-slate-500 hover:text-red-400"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Featured Image */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Featured Image URL
                    </label>
                    <input
                      type="url"
                      value={postForm.featured_image}
                      onChange={(e) => setPostForm(prev => ({ ...prev, featured_image: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  {/* Status and Actions */}
                  <div className="flex items-center justify-between pt-6 border-t border-slate-700/50">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Status
                      </label>
                      <select
                        value={postForm.status}
                        onChange={(e) => setPostForm(prev => ({ ...prev, status: e.target.value }))}
                        className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="scheduled">Scheduled</option>
                      </select>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-6 py-3 bg-slate-700/50 text-slate-300 hover:text-white rounded-xl transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-xl transition-all"
                      >
                        {editingPost ? 'Update Post' : 'Create Post'}
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BlogManager;