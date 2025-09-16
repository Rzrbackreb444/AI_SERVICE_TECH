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
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const LaundroTechLanding = ({ onOpenAuth }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <BuildingOfficeIcon className="h-8 w-8 text-blue-600 mr-3" />
              <span className="text-xl font-bold text-gray-900">LaundroTech Intelligence</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Platform</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900">Contact</a>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onOpenAuth('login')}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
              >
                Start Analysis
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Location Intelligence for Laundromat Investors
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Make data-driven investment decisions with comprehensive market analysis, 
                demographic insights, and competitor intelligence specifically designed for the laundromat industry.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => onOpenAuth('register')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 text-center font-medium"
                >
                  Start Free Analysis
                </button>
                <a
                  href="#features"
                  className="border border-gray-300 text-gray-700 px-8 py-3 rounded-md hover:bg-gray-50 text-center font-medium"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample Analysis Results</h3>
              <div className="space-y-3">
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
              Comprehensive Location Analysis
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines industry expertise with advanced data analytics 
              to provide investment insights for laundromat locations.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow p-6">
              <MapPinIcon className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Location Intelligence
              </h3>
              <p className="text-gray-600">
                Comprehensive site analysis including demographics, traffic patterns, 
                and accessibility metrics.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <ChartBarIcon className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Market Analysis
              </h3>
              <p className="text-gray-600">
                Real-time competitor tracking, market saturation analysis, 
                and demand forecasting.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <CurrencyDollarIcon className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Financial Modeling
              </h3>
              <p className="text-gray-600">
                Accurate revenue projections, ROI calculations, 
                and investment planning tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your investment strategy
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Basic</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$97</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
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
              </ul>
              <button
                onClick={() => onOpenAuth('register')}
                className="w-full bg-gray-100 text-gray-900 py-3 rounded-md hover:bg-gray-200 font-medium"
              >
                Get Started
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-blue-600 relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Professional</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$297</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                  <span>Unlimited analyses</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                  <span>Advanced competitor intelligence</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                  <span>Custom reports</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                  <span>Priority support</span>
                </li>
              </ul>
              <button
                onClick={() => onOpenAuth('register')}
                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 font-medium"
              >
                Get Started
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Enterprise</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$597</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                  <span>Everything in Professional</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                  <span>Dedicated account manager</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                  <span>On-site consultations</span>
                </li>
              </ul>
              <button
                onClick={() => onOpenAuth('register')}
                className="w-full bg-gray-100 text-gray-900 py-3 rounded-md hover:bg-gray-200 font-medium"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Make Smarter Investment Decisions?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join successful laundromat investors who use data-driven analysis 
            to identify profitable locations.
          </p>
          <button
            onClick={() => onOpenAuth('register')}
            className="bg-white text-blue-600 px-8 py-3 rounded-md hover:bg-gray-50 inline-flex items-center text-lg font-semibold"
          >
            Start Free Analysis
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <BuildingOfficeIcon className="h-8 w-8 text-blue-400 mr-3" />
                <span className="text-xl font-bold">LaundroTech Intelligence</span>
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
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Location Analysis</li>
                <li>Market Intelligence</li>
                <li>Competitor Tracking</li>
                <li>ROI Modeling</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LaundroTech Intelligence. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LaundroTechLanding;