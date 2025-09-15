import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BuildingOffice2Icon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  PhotoIcon,
  MapPinIcon,
  Cog6ToothIcon,
  CheckCircleIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ListingCreator = ({ onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [listingData, setListingData] = useState({
    // Basic Information
    title: '',
    description: '',
    listing_type: 'business_and_real_estate',
    property_type: 'coin_laundry',
    
    // Location
    address: {
      street: '',
      city: '',
      state: '',
      zip_code: '',
      county: ''
    },
    
    // Financial Details
    financials: {
      asking_price: '',
      annual_revenue: '',
      monthly_revenue: '',
      annual_expenses: '',
      net_income: '',
      cash_flow: '',
      ebitda: '',
      down_payment_required: '',
      financing_available: false,
      owner_financing_terms: '',
      monthly_rent: '',
      lease_years_remaining: '',
      property_taxes: '',
      utilities_cost: ''
    },
    
    // Physical Details
    square_footage: '',
    parking_spaces: '',
    
    // Equipment
    equipment: {
      washers: [],
      dryers: [],
      other_equipment: [],
      total_machines: '',
      average_age: '',
      replacement_value: ''
    },
    
    // Business Details
    years_established: '',
    hours_of_operation: '',
    employee_count: '',
    customer_demographics: {},
    
    // Media
    photos: [],
    virtual_tour_url: '',
    floor_plan_url: '',
    
    // Documents
    documents: []
  });
  
  const [uploadedFiles, setUploadedFiles] = useState({
    photos: [],
    financial_docs: [],
    legal_docs: [],
    equipment_docs: []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { id: 1, title: 'Basic Information', icon: BuildingOffice2Icon },
    { id: 2, title: 'Location & Details', icon: MapPinIcon },
    { id: 3, title: 'Financial Information', icon: CurrencyDollarIcon },
    { id: 4, title: 'Equipment Details', icon: Cog6ToothIcon },
    { id: 5, title: 'Photos & Documents', icon: DocumentTextIcon },
    { id: 6, title: 'Review & Publish', icon: CheckCircleIcon }
  ];

  const propertyTypes = [
    { value: 'coin_laundry', label: 'Coin Laundry' },
    { value: 'full_service', label: 'Full Service (Wash/Dry/Fold)' },
    { value: 'hybrid', label: 'Hybrid (Coin + Services)' },
    { value: 'commercial_laundry', label: 'Commercial B2B Laundry' },
    { value: 'laundromat_chain', label: 'Laundromat Chain' }
  ];

  const listingTypes = [
    { value: 'business_only', label: 'Business Only (Assets)' },
    { value: 'real_estate_only', label: 'Real Estate Only' },
    { value: 'business_and_real_estate', label: 'Business + Real Estate' },
    { value: 'equipment_only', label: 'Equipment Only' }
  ];

  const handleInputChange = (section, field, value) => {
    if (section) {
      setListingData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setListingData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const addEquipment = (type) => {
    const newEquipment = {
      id: Date.now(),
      brand: '',
      model: '',
      capacity: '',
      age: '',
      condition: 'good',
      serial_number: '',
      purchase_price: '',
      current_value: ''
    };
    
    setListingData(prev => ({
      ...prev,
      equipment: {
        ...prev.equipment,
        [type]: [...prev.equipment[type], newEquipment]
      }
    }));
  };

  const updateEquipment = (type, id, field, value) => {
    setListingData(prev => ({
      ...prev,
      equipment: {
        ...prev.equipment,
        [type]: prev.equipment[type].map(item =>
          item.id === id ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const removeEquipment = (type, id) => {
    setListingData(prev => ({
      ...prev,
      equipment: {
        ...prev.equipment,
        [type]: prev.equipment[type].filter(item => item.id !== id)
      }
    }));
  };

  const handleFileUpload = async (files, category) => {
    // Mock file upload - would integrate with cloud storage
    const mockUrls = Array.from(files).map((file, index) => ({
      name: file.name,
      url: `https://cdn.laundrotech.com/listings/${Date.now()}_${index}`,
      size: file.size,
      type: file.type
    }));
    
    setUploadedFiles(prev => ({
      ...prev,
      [category]: [...prev[category], ...mockUrls]
    }));
    
    if (category === 'photos') {
      setListingData(prev => ({
        ...prev,
        photos: [...prev.photos, ...mockUrls.map(f => f.url)]
      }));
    }
  };

  const calculateTotalMachines = () => {
    const { washers, dryers } = listingData.equipment;
    return washers.length + dryers.length;
  };

  const calculateAverageAge = () => {
    const { washers, dryers } = listingData.equipment;
    const allEquipment = [...washers, ...dryers];
    if (allEquipment.length === 0) return 0;
    
    const totalAge = allEquipment.reduce((sum, item) => sum + (parseInt(item.age) || 0), 0);
    return (totalAge / allEquipment.length).toFixed(1);
  };

  const validateStep = (step) => {
    switch(step) {
      case 1:
        return listingData.title && listingData.description && listingData.property_type;
      case 2:
        return listingData.address.street && listingData.address.city && 
               listingData.address.state && listingData.square_footage;
      case 3:
        return listingData.financials.asking_price && 
               (listingData.financials.annual_revenue || listingData.financials.monthly_revenue);
      case 4:
        return listingData.equipment.washers.length > 0 || listingData.equipment.dryers.length > 0;
      case 5:
        return uploadedFiles.photos.length > 0;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 6));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const submitListing = async () => {
    setIsSubmitting(true);
    
    try {
      // Update calculated fields
      const submissionData = {
        ...listingData,
        equipment: {
          ...listingData.equipment,
          total_machines: calculateTotalMachines(),
          average_age: parseFloat(calculateAverageAge())
        },
        documents: uploadedFiles
      };
      
      const response = await axios.post(`${API}/marketplace/listings`, submissionData);
      
      if (response.data.success) {
        onSuccess(response.data.data);
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      alert('Error creating listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Listing Title *
              </label>
              <input
                type="text"
                value={listingData.title}
                onChange={(e) => handleInputChange(null, 'title', e.target.value)}
                placeholder="e.g., High-Performance Laundromat - Prime Location"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400/50 focus:outline-none"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Listing Type *
                </label>
                <select
                  value={listingData.listing_type}
                  onChange={(e) => handleInputChange(null, 'listing_type', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyan-400/50 focus:outline-none"
                >
                  {listingTypes.map(type => (
                    <option key={type.value} value={type.value} className="bg-slate-800">
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Property Type *
                </label>
                <select
                  value={listingData.property_type}
                  onChange={(e) => handleInputChange(null, 'property_type', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyan-400/50 focus:outline-none"
                >
                  {propertyTypes.map(type => (
                    <option key={type.value} value={type.value} className="bg-slate-800">
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Business Description *
              </label>
              <textarea
                value={listingData.description}
                onChange={(e) => handleInputChange(null, 'description', e.target.value)}
                rows={6}
                placeholder="Describe the business, location advantages, customer base, growth potential, and key selling points..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400/50 focus:outline-none"
              />
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={listingData.address.street}
                  onChange={(e) => handleInputChange('address', 'street', e.target.value)}
                  placeholder="1234 Main Street"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400/50 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={listingData.address.city}
                  onChange={(e) => handleInputChange('address', 'city', e.target.value)}
                  placeholder="Little Rock"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400/50 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  value={listingData.address.state}
                  onChange={(e) => handleInputChange('address', 'state', e.target.value)}
                  placeholder="Arkansas"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400/50 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  value={listingData.address.zip_code}
                  onChange={(e) => handleInputChange('address', 'zip_code', e.target.value)}
                  placeholder="72201"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400/50 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  County
                </label>
                <input
                  type="text"
                  value={listingData.address.county}
                  onChange={(e) => handleInputChange('address', 'county', e.target.value)}
                  placeholder="Pulaski County"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400/50 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Square Footage *
                </label>
                <input
                  type="number"
                  value={listingData.square_footage}
                  onChange={(e) => handleInputChange(null, 'square_footage', e.target.value)}
                  placeholder="2400"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400/50 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Parking Spaces
                </label>
                <input
                  type="number"
                  value={listingData.parking_spaces}
                  onChange={(e) => handleInputChange(null, 'parking_spaces', e.target.value)}
                  placeholder="20"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400/50 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Years Established
                </label>
                <input
                  type="number"
                  value={listingData.years_established}
                  onChange={(e) => handleInputChange(null, 'years_established', e.target.value)}
                  placeholder="15"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400/50 focus:outline-none"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Hours of Operation
              </label>
              <input
                type="text"
                value={listingData.hours_of_operation}
                onChange={(e) => handleInputChange(null, 'hours_of_operation', e.target.value)}
                placeholder="6:00 AM - 10:00 PM Daily"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400/50 focus:outline-none"
              />
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Asking Price * ($)
                </label>
                <input
                  type="number"
                  value={listingData.financials.asking_price}
                  onChange={(e) => handleInputChange('financials', 'asking_price', e.target.value)}
                  placeholder="425000"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400/50 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Annual Revenue ($)
                </label>
                <input
                  type="number"
                  value={listingData.financials.annual_revenue}
                  onChange={(e) => handleInputChange('financials', 'annual_revenue', e.target.value)}
                  placeholder="180000"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400/50 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Monthly Revenue ($)
                </label>
                <input
                  type="number"
                  value={listingData.financials.monthly_revenue}
                  onChange={(e) => handleInputChange('financials', 'monthly_revenue', e.target.value)}
                  placeholder="15000"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400/50 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Cash Flow ($)
                </label>
                <input
                  type="number"
                  value={listingData.financials.cash_flow}
                  onChange={(e) => handleInputChange('financials', 'cash_flow', e.target.value)}
                  placeholder="85000"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Monthly Rent ($)
                </label>
                <input
                  type="number"
                  value={listingData.financials.monthly_rent}
                  onChange={(e) => handleInputChange('financials', 'monthly_rent', e.target.value)}
                  placeholder="8500"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400/50 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Lease Years Remaining
                </label>
                <input
                  type="number"
                  value={listingData.financials.lease_years_remaining}
                  onChange={(e) => handleInputChange('financials', 'lease_years_remaining', e.target.value)}
                  placeholder="8"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400/50 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={listingData.financials.financing_available}
                  onChange={(e) => handleInputChange('financials', 'financing_available', e.target.checked)}
                  className="bg-white/5 border border-white/10 rounded focus:ring-cyan-400"
                />
                <span className="text-slate-300">Financing Available</span>
              </label>
            </div>
            
            {listingData.financials.financing_available && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Owner Financing Terms
                </label>
                <textarea
                  value={listingData.financials.owner_financing_terms}
                  onChange={(e) => handleInputChange('financials', 'owner_financing_terms', e.target.value)}
                  rows={3}
                  placeholder="20% down, 7% interest, 10-year term..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400/50 focus:outline-none"
                />
              </div>
            )}
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            {/* Washers Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Washers</h3>
                <button
                  onClick={() => addEquipment('washers')}
                  className="flex items-center space-x-2 bg-cyan-500/20 text-cyan-400 px-3 py-2 rounded-lg hover:bg-cyan-500/30 transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Add Washer</span>
                </button>
              </div>
              
              {listingData.equipment.washers.map((washer, index) => (
                <motion.div
                  key={washer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-white">Washer #{index + 1}</h4>
                    <button
                      onClick={() => removeEquipment('washers', washer.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Brand</label>
                      <input
                        type="text"
                        value={washer.brand}
                        onChange={(e) => updateEquipment('washers', washer.id, 'brand', e.target.value)}
                        placeholder="Speed Queen"
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-cyan-400/50 focus:outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Model</label>
                      <input
                        type="text"
                        value={washer.model}
                        onChange={(e) => updateEquipment('washers', washer.id, 'model', e.target.value)}
                        placeholder="SC30MD2"
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-cyan-400/50 focus:outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Capacity (lbs)</label>
                      <input
                        type="number"
                        value={washer.capacity}
                        onChange={(e) => updateEquipment('washers', washer.id, 'capacity', e.target.value)}
                        placeholder="30"
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-cyan-400/50 focus:outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Age (years)</label>
                      <input
                        type="number"
                        value={washer.age}
                        onChange={(e) => updateEquipment('washers', washer.id, 'age', e.target.value)}
                        placeholder="3"
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-cyan-400/50 focus:outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Condition</label>
                      <select
                        value={washer.condition}
                        onChange={(e) => updateEquipment('washers', washer.id, 'condition', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-cyan-400/50 focus:outline-none"
                      >
                        <option value="excellent">Excellent</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                        <option value="needs_repair">Needs Repair</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Current Value ($)</label>
                      <input
                        type="number"
                        value={washer.current_value}
                        onChange={(e) => updateEquipment('washers', washer.id, 'current_value', e.target.value)}
                        placeholder="3500"
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-cyan-400/50 focus:outline-none"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Dryers Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Dryers</h3>
                <button
                  onClick={() => addEquipment('dryers')}
                  className="flex items-center space-x-2 bg-orange-500/20 text-orange-400 px-3 py-2 rounded-lg hover:bg-orange-500/30 transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Add Dryer</span>
                </button>
              </div>
              
              {listingData.equipment.dryers.map((dryer, index) => (
                <motion.div
                  key={dryer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-white">Dryer #{index + 1}</h4>
                    <button
                      onClick={() => removeEquipment('dryers', dryer.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Brand</label>
                      <input
                        type="text"
                        value={dryer.brand}
                        onChange={(e) => updateEquipment('dryers', dryer.id, 'brand', e.target.value)}
                        placeholder="Speed Queen"
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-cyan-400/50 focus:outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Model</label>
                      <input
                        type="text"
                        value={dryer.model}
                        onChange={(e) => updateEquipment('dryers', dryer.id, 'model', e.target.value)}
                        placeholder="SD30DG"
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-cyan-400/50 focus:outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Capacity (lbs)</label>
                      <input
                        type="number"
                        value={dryer.capacity}
                        onChange={(e) => updateEquipment('dryers', dryer.id, 'capacity', e.target.value)}
                        placeholder="30"
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-cyan-400/50 focus:outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Age (years)</label>
                      <input
                        type="number"
                        value={dryer.age}
                        onChange={(e) => updateEquipment('dryers', dryer.id, 'age', e.target.value)}
                        placeholder="3"
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-cyan-400/50 focus:outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Condition</label>
                      <select
                        value={dryer.condition}
                        onChange={(e) => updateEquipment('dryers', dryer.id, 'condition', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-cyan-400/50 focus:outline-none"
                      >
                        <option value="excellent">Excellent</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                        <option value="needs_repair">Needs Repair</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Current Value ($)</label>
                      <input
                        type="number"
                        value={dryer.current_value}
                        onChange={(e) => updateEquipment('dryers', dryer.id, 'current_value', e.target.value)}
                        placeholder="2800"
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-cyan-400/50 focus:outline-none"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Equipment Summary */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-3">Equipment Summary</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-cyan-400">{calculateTotalMachines()}</div>
                  <div className="text-sm text-slate-400">Total Machines</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-400">{calculateAverageAge()}</div>
                  <div className="text-sm text-slate-400">Avg Age (years)</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-400">
                    {listingData.equipment.washers.length}/{listingData.equipment.dryers.length}
                  </div>
                  <div className="text-sm text-slate-400">Washers/Dryers</div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="space-y-6">
            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Property Photos * (Upload at least 5 high-quality photos)
              </label>
              <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-cyan-400/50 transition-colors">
                <CloudArrowUpIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-300 mb-2">Drag and drop photos here, or click to browse</p>
                <p className="text-slate-500 text-sm">Maximum 20 photos, 10MB each</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e.target.files, 'photos')}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="inline-block mt-4 bg-cyan-500/20 text-cyan-400 px-6 py-2 rounded-lg cursor-pointer hover:bg-cyan-500/30 transition-colors"
                >
                  Choose Photos
                </label>
              </div>
              
              {uploadedFiles.photos.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {uploadedFiles.photos.map((photo, index) => (
                    <div key={index} className="relative bg-white/5 rounded-lg p-2">
                      <PhotoIcon className="w-full h-20 text-slate-400" />
                      <p className="text-xs text-slate-400 mt-1 truncate">{photo.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Financial Documents */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Financial Documents (P&L, Tax Returns, Cash Flow Statements)
              </label>
              <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                <DocumentTextIcon className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-300 mb-2">Upload financial documents</p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  onChange={(e) => handleFileUpload(e.target.files, 'financial_docs')}
                  className="hidden"
                  id="financial-upload"
                />
                <label
                  htmlFor="financial-upload"
                  className="inline-block bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg cursor-pointer hover:bg-emerald-500/30 transition-colors"
                >
                  Upload Financial Docs
                </label>
              </div>
            </div>
            
            {/* Legal Documents */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Legal Documents (Lease Agreement, Permits, Licenses)
              </label>
              <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                <DocumentTextIcon className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-300 mb-2">Upload legal and permit documents</p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload(e.target.files, 'legal_docs')}
                  className="hidden"
                  id="legal-upload"
                />
                <label
                  htmlFor="legal-upload"
                  className="inline-block bg-purple-500/20 text-purple-400 px-4 py-2 rounded-lg cursor-pointer hover:bg-purple-500/30 transition-colors"
                >
                  Upload Legal Docs
                </label>
              </div>
            </div>
          </div>
        );
        
      case 6:
        return (
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Listing Summary</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-emerald-400">{listingData.title}</h4>
                  <p className="text-slate-300">{listingData.address.street}, {listingData.address.city}, {listingData.address.state}</p>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-slate-400 text-sm">Asking Price</p>
                    <p className="text-xl font-bold text-white">${parseInt(listingData.financials.asking_price || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Annual Revenue</p>
                    <p className="text-xl font-bold text-white">${parseInt(listingData.financials.annual_revenue || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Cash Flow</p>
                    <p className="text-xl font-bold text-white">${parseInt(listingData.financials.cash_flow || 0).toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-400 text-sm">Property Details</p>
                    <p className="text-white">{listingData.square_footage} sq ft • {calculateTotalMachines()} machines</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Equipment Age</p>
                    <p className="text-white">{calculateAverageAge()} years average</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-cyan-400/30 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-2">Listing Package: Professional</h3>
              <div className="text-slate-300 space-y-1">
                <p>• 6-month listing duration</p>
                <p>• AI-powered market analysis included</p>
                <p>• Featured placement in search results</p>
                <p>• Professional listing optimization</p>
                <p>• Inquiry management tools</p>
                <p>• Performance analytics dashboard</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-2xl font-bold text-emerald-400">$199</span>
                <span className="text-slate-400">one-time fee</span>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold text-white">Create Professional Listing</h2>
            <p className="text-slate-400">Step {currentStep} of {steps.length}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' :
                    isActive ? 'border-cyan-400 text-cyan-400' :
                    'border-white/20 text-slate-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircleIcon className="w-6 h-6" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-2 transition-colors ${
                      isCompleted ? 'bg-emerald-500' : 'bg-white/20'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-white/10">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-2 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          <div className="flex space-x-3">
            {currentStep < 6 ? (
              <button
                onClick={nextStep}
                disabled={!validateStep(currentStep)}
                className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-8 py-2 rounded-lg font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={submitListing}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-8 py-2 rounded-lg font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Listing ($199)'}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ListingCreator;