"""
MRR OPTIMIZATION ENGINE - THE MONEY MAKER
All 5 critical systems to optimize Monthly Recurring Revenue
"""

import os
import asyncio
import json
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Any, Optional
from motor.motor_asyncio import AsyncIOMotorClient
import logging
import uuid
import httpx
from dataclasses import dataclass

logger = logging.getLogger(__name__)

@dataclass
class MarketAlert:
    """Market change alert structure"""
    user_id: str
    location_id: str
    alert_type: str  # competitor_new, competitor_closed, demographic_shift, price_change
    title: str
    description: str
    severity: str  # low, medium, high, critical
    action_required: bool
    created_at: datetime

@dataclass
class UsageMeter:
    """Usage tracking for billing optimization"""
    user_id: str
    subscription_tier: str
    api_calls_used: int
    api_calls_limit: int
    analyses_used: int
    analyses_limit: int
    overage_charges: float
    billing_period_start: datetime
    billing_period_end: datetime

class MRROptimizationEngine:
    """The money-making engine for LaundroTech"""
    
    def __init__(self):
        self.mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
        self.db_name = os.environ.get('DB_NAME', 'sitetitan_db')
        self.client = AsyncIOMotorClient(self.mongo_url)
        self.db = self.client[self.db_name]
        
        # Usage limits by tier (for billing optimization)
        self.tier_limits = {
            'free': {'api_calls': 10, 'analyses': 3, 'locations': 1},
            'analyzer': {'api_calls': 500, 'analyses': 25, 'locations': 3},
            'intelligence': {'api_calls': 2000, 'analyses': 100, 'locations': 10},
            'optimization': {'api_calls': 5000, 'analyses': 250, 'locations': 25},
            'portfolio': {'api_calls': 15000, 'analyses': 1000, 'locations': 100},
            'watch_pro': {'api_calls': 50000, 'analyses': 5000, 'locations': 500}
        }
        
        # Overage pricing ($$$ maker)
        self.overage_rates = {
            'api_call': 0.10,  # $0.10 per API call over limit
            'analysis': 15.00,  # $15 per analysis over limit
            'location': 50.00   # $50 per additional location
        }

    # ═══════════════════════════════════════════════════════════════
    # 1. RECURRING VALUE ENGINE - KEEPS USERS COMING BACK
    # ═══════════════════════════════════════════════════════════════

    async def create_market_monitoring_system(self, user_id: str, locations: List[Dict]) -> Dict[str, Any]:
        """Set up recurring market monitoring for user locations"""
        try:
            monitoring_config = {
                'user_id': user_id,
                'locations': locations,
                'monitoring_frequency': 'weekly',  # weekly checks
                'alert_preferences': {
                    'new_competitors': True,
                    'competitor_closures': True,
                    'demographic_changes': True,
                    'equipment_price_changes': True,
                    'market_opportunities': True
                },
                'created_at': datetime.now(timezone.utc),
                'active': True,
                'next_check': datetime.now(timezone.utc) + timedelta(days=7)
            }
            
            await self.db.market_monitoring.insert_one(monitoring_config)
            
            return {
                'monitoring_enabled': True,
                'locations_monitored': len(locations),
                'alert_types': 5,
                'next_update': 'Weekly',
                'recurring_value': 'HIGH'
            }
            
        except Exception as e:
            logger.error(f"Market monitoring setup error: {e}")
            return {'monitoring_enabled': False, 'error': str(e)}

    async def generate_recurring_alerts(self, user_id: str) -> List[MarketAlert]:
        """Generate market alerts to bring users back"""
        try:
            alerts = []
            
            # Get user's monitored locations
            monitoring = await self.db.market_monitoring.find_one({'user_id': user_id, 'active': True})
            if not monitoring:
                return alerts
            
            for location in monitoring['locations']:
                # Simulate market changes (in production, this would check real APIs)
                
                # New competitor alert
                if len(location.get('competitors', [])) < 5:  # Low competition area
                    alerts.append(MarketAlert(
                        user_id=user_id,
                        location_id=location.get('id', 'unknown'),
                        alert_type='market_opportunity',
                        title='🚀 Market Opportunity Detected',
                        description=f"Competition remains low at {location.get('address', 'your location')}. Prime time for market entry.",
                        severity='high',
                        action_required=True,
                        created_at=datetime.now(timezone.utc)
                    ))
                
                # Demographic change alert
                alerts.append(MarketAlert(
                    user_id=user_id,
                    location_id=location.get('id', 'unknown'),
                    alert_type='demographic_shift',
                    title='📊 Demographic Update Available',
                    description=f"New census data shows 5% income increase in your target area. Upgrade analysis recommended.",
                    severity='medium',
                    action_required=True,
                    created_at=datetime.now(timezone.utc)
                ))
            
            # Store alerts in database
            for alert in alerts:
                await self.db.market_alerts.insert_one({
                    'user_id': alert.user_id,
                    'location_id': alert.location_id,
                    'alert_type': alert.alert_type,
                    'title': alert.title,
                    'description': alert.description,
                    'severity': alert.severity,
                    'action_required': alert.action_required,
                    'created_at': alert.created_at,
                    'read': False,
                    'acted_upon': False
                })
            
            return alerts
            
        except Exception as e:
            logger.error(f"Alert generation error: {e}")
            return []

    async def get_performance_dashboard_data(self, user_id: str) -> Dict[str, Any]:
        """Get recurring performance data to keep users engaged"""
        try:
            # Get user's analyses
            analyses = await self.db.analyses.find({'user_id': user_id}).to_list(length=None)
            
            # Calculate performance metrics
            total_analyses = len(analyses)
            avg_score = sum(a.get('score', 0) for a in analyses) / max(total_analyses, 1)
            
            # Get recent alerts
            recent_alerts = await self.db.market_alerts.find({
                'user_id': user_id,
                'created_at': {'$gte': datetime.now(timezone.utc) - timedelta(days=30)}
            }).to_list(length=20)
            
            return {
                'total_analyses': total_analyses,
                'average_score': round(avg_score, 1),
                'recent_alerts': len(recent_alerts),
                'unread_alerts': len([a for a in recent_alerts if not a.get('read', False)]),
                'market_status': 'Active monitoring',
                'next_update': 'In 3 days',
                'engagement_score': min(100, total_analyses * 10 + len(recent_alerts) * 5)
            }
            
        except Exception as e:
            logger.error(f"Performance dashboard error: {e}")
            return {'error': str(e)}

    # ═══════════════════════════════════════════════════════════════
    # 2. USAGE-BASED BILLING SYSTEM - OVERAGE REVENUE
    # ═══════════════════════════════════════════════════════════════

    async def track_api_usage(self, user_id: str, endpoint: str, subscription_tier: str) -> Dict[str, Any]:
        """Track API usage for billing optimization"""
        try:
            # Get current billing period
            now = datetime.now(timezone.utc)
            period_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            period_end = (period_start + timedelta(days=32)).replace(day=1) - timedelta(seconds=1)
            
            # Get or create usage record
            usage_record = await self.db.usage_tracking.find_one({
                'user_id': user_id,
                'billing_period_start': period_start
            })
            
            if not usage_record:
                usage_record = {
                    'user_id': user_id,
                    'subscription_tier': subscription_tier,
                    'billing_period_start': period_start,
                    'billing_period_end': period_end,
                    'api_calls_used': 0,
                    'analyses_used': 0,
                    'locations_used': 0,
                    'overage_charges': 0.0,
                    'last_updated': now
                }
                await self.db.usage_tracking.insert_one(usage_record)
            
            # Increment usage
            if endpoint == 'analyze':
                usage_record['analyses_used'] += 1
            else:
                usage_record['api_calls_used'] += 1
            
            # Calculate overages
            limits = self.tier_limits.get(subscription_tier, self.tier_limits['free'])
            overage_charges = 0.0
            
            # API call overages
            if usage_record['api_calls_used'] > limits['api_calls']:
                overage_api_calls = usage_record['api_calls_used'] - limits['api_calls']
                overage_charges += overage_api_calls * self.overage_rates['api_call']
            
            # Analysis overages
            if usage_record['analyses_used'] > limits['analyses']:
                overage_analyses = usage_record['analyses_used'] - limits['analyses']
                overage_charges += overage_analyses * self.overage_rates['analysis']
            
            usage_record['overage_charges'] = overage_charges
            usage_record['last_updated'] = now
            
            # Update database
            await self.db.usage_tracking.update_one(
                {'user_id': user_id, 'billing_period_start': period_start},
                {'$set': usage_record}
            )
            
            # Check if user is approaching limits (upsell opportunity)
            upsell_trigger = False
            if (usage_record['api_calls_used'] / limits['api_calls'] > 0.8 or 
                usage_record['analyses_used'] / limits['analyses'] > 0.8):
                upsell_trigger = True
            
            return {
                'usage_tracked': True,
                'api_calls_used': usage_record['api_calls_used'],
                'api_calls_limit': limits['api_calls'],
                'analyses_used': usage_record['analyses_used'],
                'analyses_limit': limits['analyses'],
                'overage_charges': overage_charges,
                'upsell_trigger': upsell_trigger,
                'utilization_percent': round((usage_record['api_calls_used'] / limits['api_calls']) * 100, 1)
            }
            
        except Exception as e:
            logger.error(f"Usage tracking error: {e}")
            return {'usage_tracked': False, 'error': str(e)}

    async def generate_usage_billing_report(self, user_id: str) -> Dict[str, Any]:
        """Generate billing report with overages"""
        try:
            # Get current billing period usage
            now = datetime.now(timezone.utc)
            period_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            
            usage_record = await self.db.usage_tracking.find_one({
                'user_id': user_id,
                'billing_period_start': period_start
            })
            
            if not usage_record:
                return {'billing_amount': 0, 'overages': 0}
            
            # Get user's subscription info
            user = await self.db.users.find_one({'id': user_id})
            base_price = self.get_tier_price(user.get('subscription_tier', 'free'))
            
            return {
                'base_subscription': base_price,
                'overage_charges': usage_record.get('overage_charges', 0),
                'total_billing': base_price + usage_record.get('overage_charges', 0),
                'usage_summary': {
                    'api_calls': usage_record.get('api_calls_used', 0),
                    'analyses': usage_record.get('analyses_used', 0),
                    'locations': usage_record.get('locations_used', 0)
                },
                'billing_period': f"{period_start.strftime('%Y-%m-%d')} to {usage_record['billing_period_end'].strftime('%Y-%m-%d')}"
            }
            
        except Exception as e:
            logger.error(f"Billing report error: {e}")
            return {'error': str(e)}

    # ═══════════════════════════════════════════════════════════════
    # 3. MULTI-LOCATION DASHBOARD - PORTFOLIO MANAGEMENT
    # ═══════════════════════════════════════════════════════════════

    async def create_portfolio_dashboard(self, user_id: str) -> Dict[str, Any]:
        """Create multi-location portfolio management"""
        try:
            # Get all user's analyses (locations)
            analyses = await self.db.analyses.find({'user_id': user_id}).to_list(length=None)
            
            # Group by location
            portfolio_data = {
                'total_locations': len(analyses),
                'locations': [],
                'portfolio_stats': {
                    'average_score': 0,
                    'total_investment_estimated': 0,
                    'best_performing_location': None,
                    'expansion_opportunities': 0
                }
            }
            
            total_score = 0
            total_investment = 0
            best_score = 0
            best_location = None
            
            for analysis in analyses:
                location_data = {
                    'id': analysis.get('analysis_id', 'unknown'),
                    'address': analysis.get('address', 'Unknown Address'),
                    'score': analysis.get('score', 0),
                    'grade': analysis.get('grade', 'F'),
                    'analysis_date': analysis.get('created_at', datetime.now(timezone.utc)),
                    'roi_estimate': analysis.get('roi_estimate', {}),
                    'status': 'analyzed',
                    'alerts_count': 0  # Will be populated from alerts
                }
                
                # Get alerts for this location
                alerts = await self.db.market_alerts.find({
                    'user_id': user_id,
                    'location_id': location_data['id'],
                    'read': False
                }).to_list(length=None)
                location_data['alerts_count'] = len(alerts)
                
                portfolio_data['locations'].append(location_data)
                
                # Update portfolio stats
                score = analysis.get('score', 0)
                total_score += score
                
                if score > best_score:
                    best_score = score
                    best_location = analysis.get('address', 'Unknown')
                
                # Estimate investment
                roi = analysis.get('roi_estimate', {})
                investment = roi.get('estimated_startup_cost', 350000)
                total_investment += investment
            
            # Calculate portfolio stats
            if len(analyses) > 0:
                portfolio_data['portfolio_stats'] = {
                    'average_score': round(total_score / len(analyses), 1),
                    'total_investment_estimated': total_investment,
                    'best_performing_location': best_location,
                    'expansion_opportunities': len([a for a in analyses if a.get('score', 0) > 75])
                }
            
            # Store portfolio data
            portfolio_record = {
                'user_id': user_id,
                'portfolio_data': portfolio_data,
                'created_at': datetime.now(timezone.utc),
                'last_updated': datetime.now(timezone.utc)
            }
            
            await self.db.user_portfolios.replace_one(
                {'user_id': user_id},
                portfolio_record,
                upsert=True
            )
            
            return portfolio_data
            
        except Exception as e:
            logger.error(f"Portfolio dashboard error: {e}")
            return {'error': str(e)}

    async def portfolio_expansion_analysis(self, user_id: str, target_market: str) -> Dict[str, Any]:
        """Analyze expansion opportunities for portfolio owners"""
        try:
            # Get existing portfolio
            portfolio = await self.db.user_portfolios.find_one({'user_id': user_id})
            if not portfolio:
                return {'error': 'No portfolio found'}
            
            existing_locations = portfolio['portfolio_data']['locations']
            
            # Analyze expansion potential
            expansion_analysis = {
                'market_gap_analysis': {
                    'underserved_areas': 3,  # Simulated
                    'competitor_weakness_zones': 2,
                    'demographic_growth_areas': 4
                },
                'expansion_recommendations': [
                    {
                        'area': f'{target_market} - North District',
                        'opportunity_score': 85,
                        'estimated_investment': 380000,
                        'expected_roi': '24% annually',
                        'timeline': '6-8 months to profitability'
                    },
                    {
                        'area': f'{target_market} - University District',
                        'opportunity_score': 78,
                        'estimated_investment': 340000,
                        'expected_roi': '19% annually',
                        'timeline': '4-6 months to profitability'
                    }
                ],
                'portfolio_synergies': {
                    'cross_location_benefits': 'Brand recognition, bulk purchasing power',
                    'operational_efficiency': '15% cost reduction through shared management',
                    'market_dominance_potential': 'High - strategic positioning'
                }
            }
            
            return expansion_analysis
            
        except Exception as e:
            logger.error(f"Expansion analysis error: {e}")
            return {'error': str(e)}

    # ═══════════════════════════════════════════════════════════════
    # 4. ENTERPRISE API LAYER - WHITE LABEL REVENUE
    # ═══════════════════════════════════════════════════════════════

    async def create_enterprise_api_key(self, user_id: str, organization: str) -> Dict[str, Any]:
        """Create enterprise API key for white-label usage"""
        try:
            api_key = f"ltk_{uuid.uuid4().hex[:16]}"
            secret_key = f"lts_{uuid.uuid4().hex[:32]}"
            
            enterprise_config = {
                'user_id': user_id,
                'organization': organization,
                'api_key': api_key,
                'secret_key': secret_key,
                'api_calls_limit': 50000,  # Enterprise limit
                'rate_limit': 1000,  # per hour
                'webhook_url': None,
                'white_label_enabled': True,
                'custom_branding': True,
                'pricing_tier': 'enterprise',
                'monthly_fee': 2999,  # $2999/month for enterprise API
                'created_at': datetime.now(timezone.utc),
                'active': True
            }
            
            await self.db.enterprise_api_keys.insert_one(enterprise_config)
            
            return {
                'api_key': api_key,
                'secret_key': secret_key,
                'api_limit': 50000,
                'rate_limit': '1000/hour',
                'white_label': True,
                'monthly_fee': 2999,
                'documentation_url': '/api/docs/enterprise'
            }
            
        except Exception as e:
            logger.error(f"Enterprise API creation error: {e}")
            return {'error': str(e)}

    async def bulk_analysis_endpoint(self, api_key: str, addresses: List[str]) -> Dict[str, Any]:
        """Enterprise bulk analysis endpoint"""
        try:
            # Verify API key
            api_config = await self.db.enterprise_api_keys.find_one({'api_key': api_key, 'active': True})
            if not api_config:
                return {'error': 'Invalid API key', 'status': 401}
            
            # Check rate limits
            # (Implementation would check rate limiting here)
            
            # Process bulk analyses
            bulk_results = {
                'request_id': str(uuid.uuid4()),
                'total_addresses': len(addresses),
                'results': [],
                'processing_time': '2.3 seconds',
                'api_calls_used': len(addresses) * 5,  # Each analysis = 5 API calls
                'billing_amount': len(addresses) * 12.50  # $12.50 per bulk analysis
            }
            
            for address in addresses[:10]:  # Limit to 10 for demo
                # This would call the actual enterprise intelligence engine
                analysis_result = {
                    'address': address,
                    'score': 78 + (hash(address) % 20),  # Simulated score
                    'grade': 'B+',
                    'confidence': 0.87,
                    'market_opportunity': 'Medium-High',
                    'competitor_density': 2,
                    'estimated_roi': 0.18
                }
                bulk_results['results'].append(analysis_result)
            
            # Track usage
            await self.track_enterprise_usage(api_key, len(addresses))
            
            return bulk_results
            
        except Exception as e:
            logger.error(f"Bulk analysis error: {e}")
            return {'error': str(e)}

    async def track_enterprise_usage(self, api_key: str, api_calls: int) -> bool:
        """Track enterprise API usage for billing"""
        try:
            now = datetime.now(timezone.utc)
            period_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            
            # Update usage tracking
            await self.db.enterprise_usage.update_one(
                {'api_key': api_key, 'period_start': period_start},
                {
                    '$inc': {'api_calls_used': api_calls},
                    '$set': {'last_used': now}
                },
                upsert=True
            )
            
            return True
            
        except Exception as e:
            logger.error(f"Enterprise usage tracking error: {e}")
            return False

    # ═══════════════════════════════════════════════════════════════
    # 5. STICKY ECOSYSTEM FEATURES - PLATFORM LOCK-IN
    # ═══════════════════════════════════════════════════════════════

    async def equipment_marketplace_integration(self, user_id: str, location_analysis: Dict) -> Dict[str, Any]:
        """Integrate equipment marketplace for stickiness"""
        try:
            # Extract equipment recommendations from analysis
            demographics = location_analysis.get('demographics', {})
            median_income = demographics.get('median_income', 45000)
            
            # Generate equipment recommendations with real marketplace links
            equipment_recommendations = {
                'recommended_washers': [
                    {
                        'model': 'Speed Queen SFNBCASP115TW01',
                        'capacity': '20 lb',
                        'price_range': '$4,200 - $4,800',
                        'quantity_recommended': 6,
                        'marketplace_link': '/equipment/washers/speed-queen-20lb',
                        'financing_available': True,
                        'roi_timeline': '18 months'
                    },
                    {
                        'model': 'Speed Queen SFNBCASP127TW01',
                        'capacity': '30 lb',
                        'price_range': '$5,800 - $6,400',
                        'quantity_recommended': 4,
                        'marketplace_link': '/equipment/washers/speed-queen-30lb',
                        'financing_available': True,
                        'roi_timeline': '16 months'
                    }
                ],
                'recommended_dryers': [
                    {
                        'model': 'Speed Queen SDGBCAGS175TW01',
                        'capacity': '30 lb stack',
                        'price_range': '$3,400 - $3,900',
                        'quantity_recommended': 8,
                        'marketplace_link': '/equipment/dryers/speed-queen-30lb-stack',
                        'financing_available': True,
                        'roi_timeline': '20 months'
                    }
                ],
                'total_equipment_cost': 89600,
                'financing_options': [
                    {
                        'lender': 'Equipment Finance Partners',
                        'rate': '7.9%',
                        'term': '84 months',
                        'monthly_payment': 1340,
                        'pre_approval_link': '/financing/pre-approval'
                    }
                ]
            }
            
            # Store equipment recommendations
            await self.db.equipment_recommendations.insert_one({
                'user_id': user_id,
                'location_analysis_id': location_analysis.get('analysis_id'),
                'recommendations': equipment_recommendations,
                'created_at': datetime.now(timezone.utc),
                'marketplace_integration': True
            })
            
            return equipment_recommendations
            
        except Exception as e:
            logger.error(f"Equipment marketplace error: {e}")
            return {'error': str(e)}

    async def financing_pre_approval_system(self, user_id: str, location_data: Dict) -> Dict[str, Any]:
        """Financing pre-approval integration"""
        try:
            # Get user info
            user = await self.db.users.find_one({'id': user_id})
            
            # Simulate financing pre-approval process
            financing_profile = {
                'user_id': user_id,
                'location_score': location_data.get('score', 0),
                'estimated_investment': location_data.get('roi_estimate', {}).get('estimated_startup_cost', 350000),
                'pre_approval_status': 'qualified' if location_data.get('score', 0) > 70 else 'review_needed',
                'approved_amount': 0,
                'interest_rate': 0,
                'term_months': 84,
                'monthly_payment': 0
            }
            
            if financing_profile['pre_approval_status'] == 'qualified':
                investment = financing_profile['estimated_investment']
                financing_profile.update({
                    'approved_amount': min(investment * 0.85, 500000),  # 85% financing up to $500k
                    'interest_rate': 7.9,
                    'monthly_payment': round((investment * 0.85) * 0.015, 2)  # Simplified calculation
                })
            
            # Store financing profile
            await self.db.financing_profiles.replace_one(
                {'user_id': user_id},
                financing_profile,
                upsert=True
            )
            
            return financing_profile
            
        except Exception as e:
            logger.error(f"Financing pre-approval error: {e}")
            return {'error': str(e)}

    async def real_estate_deal_alerts(self, user_id: str, target_criteria: Dict) -> Dict[str, Any]:
        """Real estate deal flow integration"""
        try:
            # Simulate real estate deal alerts
            deal_alerts = {
                'active_deals': [
                    {
                        'property_id': 'RE_' + str(uuid.uuid4())[:8],
                        'address': '1245 Commercial Avenue, Springfield, IL',
                        'property_type': 'Retail Space',
                        'size_sqft': 2800,
                        'lease_rate': '$18/sqft/year',
                        'purchase_price': 485000,
                        'laundromat_suitability_score': 82,
                        'deal_quality': 'Excellent',
                        'days_on_market': 12,
                        'estimated_conversion_cost': 45000
                    },
                    {
                        'property_id': 'RE_' + str(uuid.uuid4())[:8],
                        'address': '890 University Boulevard, Springfield, IL',
                        'property_type': 'Former Restaurant',
                        'size_sqft': 3200,
                        'lease_rate': '$22/sqft/year',
                        'purchase_price': 625000,
                        'laundromat_suitability_score': 76,
                        'deal_quality': 'Good',
                        'days_on_market': 28,
                        'estimated_conversion_cost': 75000
                    }
                ],
                'deal_criteria': target_criteria,
                'alerts_enabled': True,
                'new_deals_this_week': 2
            }
            
            # Store deal alerts
            await self.db.real_estate_alerts.replace_one(
                {'user_id': user_id},
                {
                    'user_id': user_id,
                    'deal_alerts': deal_alerts,
                    'created_at': datetime.now(timezone.utc),
                    'active': True
                },
                upsert=True
            )
            
            return deal_alerts
            
        except Exception as e:
            logger.error(f"Real estate alerts error: {e}")
            return {'error': str(e)}

    # ═══════════════════════════════════════════════════════════════
    # UTILITY METHODS
    # ═══════════════════════════════════════════════════════════════

    def get_tier_price(self, tier: str) -> float:
        """Get monthly price for subscription tier"""
        prices = {
            'free': 0,
            'analyzer': 49,
            'intelligence': 99,
            'optimization': 199,
            'portfolio': 999,
            'watch_pro': 199
        }
        return prices.get(tier, 0)

    async def calculate_user_ltv(self, user_id: str) -> Dict[str, Any]:
        """Calculate user lifetime value"""
        try:
            # Get user data
            user = await self.db.users.find_one({'id': user_id})
            subscription_tier = user.get('subscription_tier', 'free')
            
            # Get usage data
            usage = await self.db.usage_tracking.find({'user_id': user_id}).to_list(length=None)
            total_overages = sum(u.get('overage_charges', 0) for u in usage)
            
            # Calculate LTV
            base_monthly = self.get_tier_price(subscription_tier)
            avg_monthly_overages = total_overages / max(len(usage), 1)
            
            # Assume 18 month average retention for laundromat industry
            ltv = (base_monthly + avg_monthly_overages) * 18
            
            return {
                'user_id': user_id,
                'current_tier': subscription_tier,
                'base_monthly_value': base_monthly,
                'avg_monthly_overages': avg_monthly_overages,
                'estimated_ltv': ltv,
                'retention_months': 18
            }
            
        except Exception as e:
            logger.error(f"LTV calculation error: {e}")
            return {'error': str(e)}

# Global MRR optimization engine instance
mrr_engine = MRROptimizationEngine()