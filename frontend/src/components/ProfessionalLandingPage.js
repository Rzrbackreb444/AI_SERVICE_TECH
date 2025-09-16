import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChartBarIcon, 
  MapPinIcon, 
  CurrencyDollarIcon, 
  TrophyIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  BuildingOfficeIcon,
  UsersIcon,
  TrendingUpIcon,
  ClockIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../App';

const ProfessionalLandingPage = ({ onOpenAuth }) => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: MapPinIcon,
      title: "Location Intelligence",
      description: "Comprehensive site analysis using real estate data, demographics, and competitor intelligence."
    },
    {
      icon: ChartBarIcon,
      title: "Market Analytics",
      description: "Detailed market research with ROI projections, demand forecasting, and risk assessment."
    },
    {
      icon: CurrencyDollarIcon,
      title: "Financial Modeling",
      description: "Accurate revenue projections, operational cost analysis, and investment planning tools."
    },
    {
      icon: TrendingUpIcon,
      title: "Competitive Analysis",
      description: "Track competitors, identify market gaps, and develop strategic positioning."
    }
  ];

  const benefits = [
    "Reduce investment risk with data-driven decisions",
    "Identify high-ROI locations before competitors",
    "Access to 15+ years of industry expertise",
    "Comprehensive reports in 24 hours or less",
    "Integration with MLS and commercial databases",
    "Custom analysis for your specific requirements"
  ];

  const testimonials = [
    {
      name: "Mike Johnson",
      company: "Johnson Laundry Services",
      quote: "LaundroTech helped me identify 3 profitable locations that I would have never considered. The ROI analysis was spot-on.",
      result: "+32% ROI"
    },
    {
      name: "Sarah Martinez",
      company: "Clean Coin Laundromats",
      quote: "The competitive analysis feature saved me from making a costly mistake. Found a much better location 2 blocks away.",
      result: "Avoided $200K loss"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <BuildingOfficeIcon className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">LaundroTech</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#about" className="text-gray-600 hover:text-gray-900">About</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900">Contact</a>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => onOpenAuth('login')}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => onOpenAuth('register')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Smart Location Intelligence for Laundromat Investors
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Make data-driven investment decisions with comprehensive market analysis, 
                competitor intelligence, and accurate ROI projections.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <Link
                    to="/analyze"
                    className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 text-center"
                  >
                    Start Analysis
                  </Link>
                ) : (
                  <button
                    onClick={() => onOpenAuth('register')}
                    className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700"
                  >
                    Start Free Analysis
                  </button>
                )}
                <a
                  href="#features"
                  className="border border-gray-300 text-gray-700 px-8 py-3 rounded-md hover:bg-gray-50 text-center"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample Analysis Results</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Location Score</span>
                  <span className="font-semibold text-green-600">87/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Projected Annual Revenue</span>
                  <span className="font-semibold">$156,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ROI Estimate</span>
                  <span className="font-semibold text-blue-600">24.8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payback Period</span>
                  <span className="font-semibold">3.2 years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Competition Level</span>
                  <span className="font-semibold text-green-600">Low</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Professional Location Analysis Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines industry expertise with advanced data analytics 
              to provide comprehensive investment insights.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why Choose LaundroTech?
              </h2>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Trusted by Industry Leaders</h3>
              <div className="space-y-6">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="border-l-4 border-blue-600 pl-4">
                    <p className="text-gray-600 mb-2">"{testimonial.quote}"</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                        <p className="text-sm text-gray-600">{testimonial.company}</p>
                      </div>
                      <span className="text-green-600 font-semibold text-sm">
                        {testimonial.result}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Find Your Next Profitable Location?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of successful laundromat investors who trust LaundroTech 
            for their location analysis needs.
          </p>
          {isAuthenticated ? (
            <Link
              to="/analyze"
              className="bg-white text-blue-600 px-8 py-3 rounded-md hover:bg-gray-50 inline-flex items-center text-lg font-semibold"
            >
              Start Analysis Now
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          ) : (
            <button
              onClick={() => onOpenAuth('register')}
              className="bg-white text-blue-600 px-8 py-3 rounded-md hover:bg-gray-50 inline-flex items-center text-lg font-semibold"
            >
              Get Started Free
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <BuildingOfficeIcon className="h-8 w-8 text-blue-400 mr-2" />
                <span className="text-xl font-bold">LaundroTech</span>
              </div>
              <p className="text-gray-400">
                Professional location intelligence for laundromat investors.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <a href="mailto:nick@laundryguys.net" className="text-gray-400 hover:text-white">
                    nick@laundryguys.net
                  </a>
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-400">(501) 555-0123</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Location Analysis</li>
                <li>Market Research</li>
                <li>ROI Projections</li>
                <li>Competitive Intelligence</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LaundroTech. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProfessionalLandingPage;