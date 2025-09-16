import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  BuildingOfficeIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  BoltIcon,
  GlobeAmericasIcon
} from '@heroicons/react/24/outline';

const LaundroTechLanding = ({ onOpenAuth }) => {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      icon: MapPinIcon,
      title: "Location Intelligence",
      description: "Comprehensive site analysis with demographics, traffic patterns, and accessibility metrics powered by real-time data.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: ChartBarIcon,
      title: "Market Analysis",
      description: "Real-time competitor tracking, market saturation analysis, and demand forecasting with AI-powered insights.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: CurrencyDollarIcon,
      title: "Financial Modeling",
      description: "Accurate revenue projections, ROI calculations, and investment planning tools based on industry data.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: TrendingUpIcon,
      title: "Predictive Analytics",
      description: "Machine learning algorithms predict market trends and identify high-opportunity locations before competitors.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: ShieldCheckIcon,
      title: "Risk Assessment",
      description: "Comprehensive risk analysis including market volatility, competition threats, and economic factors.",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: BoltIcon,
      title: "Real-Time Alerts",
      description: "Instant notifications about market changes, new opportunities, and competitor activities in your target areas.",
      gradient: "from-yellow-500 to-orange-500"
    }
  ];

  const testimonials = [
    {
      name: "David King",
      title: "Multi-Unit Owner",
      company: "King's Coin Laundry",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      quote: "LaundroTech helped me avoid a $180K mistake and identified 3 profitable locations. The ROI analysis was spot-on.",
      result: "$180K saved, 40% revenue increase"
    },
    {
      name: "Sarah Martinez",
      title: "Investment Advisor",
      company: "Commercial Real Estate Partners",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      quote: "The competitive intelligence feature gives our clients a huge advantage. We've had an 85% success rate on recommendations.",
      result: "85% success rate"
    },
    {
      name: "Mike Thompson",
      title: "Franchise Developer",
      company: "Clean Express Laundromats",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      quote: "The platform identified undervalued markets that are now our top performers. Couldn't expand without this intelligence.",
      result: "3 top-performing locations"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/95 backdrop-blur-md shadow-sm border-b z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <BuildingOfficeIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                LaundroTech Intelligence
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Platform</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Pricing</a>
              <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Success Stories</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Contact</a>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onOpenAuth('login')}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium transition-all transform hover:scale-105 shadow-lg"
              >
                Start Analysis
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-6">
                <span className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
                  <StarIcon className="h-4 w-4 mr-2" />
                  Trusted by 500+ Laundromat Investors
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  Smart Location Intelligence for
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Laundromat Success
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Stop guessing. Start winning. Make data-driven investment decisions with the most comprehensive 
                location intelligence platform built specifically for laundromat investors.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => onOpenAuth('register')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 text-center font-semibold text-lg transition-all transform hover:scale-105 shadow-xl"
                >
                  Start Free Analysis
                </button>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-blue-600 hover:text-blue-600 text-center font-semibold text-lg transition-all">
                  Watch Demo
                </button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">$47M+</div>
                  <div className="text-gray-600 text-sm">Revenue Generated</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">94%</div>
                  <div className="text-gray-600 text-sm">Success Rate</div>
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent text-center">
                  <div>34.7%</div>
                  <div className="text-gray-600 text-sm">Avg ROI</div>
                </div>
              </div>
            </div>

            {/* Interactive Dashboard Preview */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Live Analysis Preview</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-500">Live Data</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                    <span className="text-gray-700 font-medium">Location Score</span>
                    <div className="flex items-center">
                      <div className="w-20 h-2 bg-gray-200 rounded-full mr-3">
                        <div className="w-17 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                      </div>
                      <span className="font-bold text-green-600">87/100</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                    <span className="text-gray-700 font-medium">Projected Revenue</span>
                    <span className="font-bold text-blue-600">$156,000/yr</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                    <span className="text-gray-700 font-medium">ROI Estimate</span>
                    <span className="font-bold text-purple-600">24.8%</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                    <span className="text-gray-700 font-medium">Competition Level</span>
                    <span className="font-bold text-orange-600">Low Risk</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500 mb-2">Market Insights</div>
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-lg text-sm">
                    <strong>AI Recommendation:</strong> High-opportunity location with optimal demographics and minimal competition.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Intelligence Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every tool you need to make informed laundromat investment decisions, 
              backed by real-time data and industry expertise.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>
                
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700">
                  {feature.description}
                </p>
                
                <div className="mt-6 flex items-center text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Learn more</span>
                  <ArrowRightIcon className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Successful Investors
            </h2>
            <p className="text-xl text-gray-600">
              See how LaundroTech Intelligence has transformed investment decisions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.title}</p>
                    <p className="text-gray-500 text-xs">{testimonial.company}</p>
                  </div>
                </div>
                
                <blockquote className="text-gray-700 mb-6 italic leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold inline-block">
                  {testimonial.result}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your investment strategy
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-300 transition-colors">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic</h3>
              <p className="text-gray-600 mb-6">Perfect for individual investors</p>
              <div className="mb-8">
                <span className="text-5xl font-bold text-gray-900">$97</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                  <span>5 location analyses per month</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                  <span>Basic competitor tracking</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                  <span>Market reports</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                  <span>Email support</span>
                </li>
              </ul>
              <button
                onClick={() => onOpenAuth('register')}
                className="w-full bg-gray-100 text-gray-900 py-3 rounded-lg hover:bg-gray-200 font-semibold transition-colors"
              >
                Get Started
              </button>
            </div>

            {/* Professional Plan */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200 relative transform scale-105">
              <div className="absolute top-0 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-b-lg text-sm font-semibold">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional</h3>
              <p className="text-gray-600 mb-6">For serious investors</p>
              <div className="mb-8">
                <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">$297</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-blue-500 mr-3" />
                  <span>Unlimited analyses</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-blue-500 mr-3" />
                  <span>Advanced competitor intelligence</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-blue-500 mr-3" />
                  <span>Custom reports & alerts</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-blue-500 mr-3" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-blue-500 mr-3" />
                  <span>API access</span>
                </li>
              </ul>
              <button
                onClick={() => onOpenAuth('register')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold transition-all transform hover:scale-105"
              >
                Get Started
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-purple-300 transition-colors">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <p className="text-gray-600 mb-6">For multi-unit operators</p>
              <div className="mb-8">
                <span className="text-5xl font-bold text-gray-900">$597</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-purple-500 mr-3" />
                  <span>Everything in Professional</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-purple-500 mr-3" />
                  <span>Dedicated account manager</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-purple-500 mr-3" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-purple-500 mr-3" />
                  <span>On-site consultations</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-purple-500 mr-3" />
                  <span>White-label reports</span>
                </li>
              </ul>
              <button
                onClick={() => onOpenAuth('register')}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 font-semibold transition-all"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Investment Strategy?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join hundreds of successful laundromat investors who use data-driven analysis 
            to identify profitable opportunities and avoid costly mistakes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onOpenAuth('register')}
              className="bg-white text-blue-600 px-10 py-4 rounded-lg hover:bg-gray-50 inline-flex items-center text-lg font-semibold transition-all transform hover:scale-105 shadow-xl"
            >
              Start Free Analysis
              <ArrowRightIcon className="ml-3 h-5 w-5" />
            </button>
            <button className="border-2 border-white text-white px-10 py-4 rounded-lg hover:bg-white hover:text-blue-600 font-semibold text-lg transition-all">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <BuildingOfficeIcon className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold">LaundroTech Intelligence</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                The most advanced location intelligence platform built specifically 
                for laundromat investors. Make smarter decisions with real data.
              </p>
              <div className="flex space-x-4">
                <div className="flex items-center text-gray-400">
                  <EnvelopeIcon className="h-5 w-5 mr-2" />
                  <a href="mailto:nick@laundryguys.net" className="hover:text-white transition-colors">
                    nick@laundryguys.net
                  </a>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Location Analysis</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Market Intelligence</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Competitor Tracking</a></li>
                <li><a href="#" className="hover:text-white transition-colors">ROI Calculator</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LaundroTech Intelligence. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LaundroTechLanding;