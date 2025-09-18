"""
ADVANCED REVENUE ENDPOINTS - IMPLEMENT ALL REVENUE STRATEGIES
Preview/blur, pay-per-depth, report caching, real-time monitoring
"""

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Dict, List, Any, Optional
from datetime import datetime, timezone
import logging
import jwt
import os
from revenue_strategy_optimizer import revenue_strategy
import json

# Import User model and auth functions to avoid circular import
from pydantic import BaseModel, Field, EmailStr
from motor.motor_asyncio import AsyncIOMotorClient

# Load environment variables for JWT
JWT_SECRET = os.environ.get('JWT_SECRET', 'laundrotech-empire-2024')
JWT_ALGORITHM = "HS256"

# MongoDB connection for user lookup
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/siteatlas')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'sitetitan_db')]

# Security
security = HTTPBearer()

class User(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    subscription_tier: str = "free"
    created_at: datetime
    facebook_group_member: bool = False

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    user = await db.users.find_one({"id": user_id})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return User(**user)

logger = logging.getLogger(__name__)

def create_advanced_revenue_router() -> APIRouter:
    """Create advanced revenue optimization router"""
    router = APIRouter(prefix="/revenue", tags=["advanced_revenue"])
    
    @router.post("/analysis/preview")
    @router.post("/analysis/preview-guest")
    async def generate_analysis_preview_guest(
        preview_request: Dict[str, Any]
    ):
        """Guest-lite preview with strictly limited details (no auth)"""
        try:
            address = preview_request.get('address')
            if not address:
                raise HTTPException(status_code=400, detail="Address is required")

            # Reuse same generator but aggressively strip details
            mock_analysis = {
                'address': address,
                'grade': 'B',
                'score': 72,
                'created_at': datetime.now(timezone.utc).isoformat(),
                'demographics': {
                    'population': '•••••',
                    'median_income': '•••••'
                },
                'competitors': [
                    {'name': 'Nearby Competitor', 'distance': '•.• mi'}
                ],
                'roi_estimate': {
                    'monthly_revenue': '•••••',
                    'initial_investment': '•••••',
                    'payback_period': '•.•'
                }
            }

            preview_report = await revenue_strategy.generate_preview_report(
                mock_analysis, 'blur_critical_data'
            )
            preview_report['blurred'] = True

            return {
                'preview_report': preview_report,
                'blurred': True,
                'status': 'success'
            }
        except Exception as e:
            logger.error(f"Guest preview error: {e}")
            raise HTTPException(status_code=500, detail=str(e))

    async def generate_analysis_preview(
        preview_request: Dict[str, Any],
        current_user: User = Depends(get_current_user)
    ):
        """Generate preview analysis with strategic content blurring"""
        try:
            address = preview_request.get('address')
            strategy = preview_request.get('strategy', 'blur_critical_data')
            
            if not address:
                raise HTTPException(status_code=400, detail="Address is required")
            
            # For demo, create mock analysis data
            mock_analysis = {
                'address': address,
                'grade': 'B+',
                'score': 78,
                'created_at': datetime.now(timezone.utc).isoformat(),
                'demographics': {
                    'population': 15000,
                    'median_age': 35,
                    'households': 6500,
                    'median_income': 55000
                },
                'competitors': [
                    {'name': 'QuickWash Laundromat', 'distance': 0.8},
                    {'name': 'Suds & Bubbles', 'distance': 1.2},
                    {'name': 'Clean Machine', 'distance': 2.1}
                ],
                'roi_estimate': {
                    'monthly_revenue': 15000,
                    'initial_investment': 380000,
                    'payback_period': 4.8
                }
            }
            
            preview_report = await revenue_strategy.generate_preview_report(mock_analysis, strategy)
            
            return {
                'preview_report': preview_report,
                'conversion_strategy': 'active',
                'upgrade_incentives': preview_report.get('upgrade_incentives', {}),
                'revenue_optimization': preview_report.get('revenue_optimization', {}),
                'status': 'success'
            }
            
        except Exception as e:
            logger.error(f"Preview generation error: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    @router.post("/analysis/depth-based")
    async def generate_depth_based_analysis(
        depth_request: Dict[str, Any],
        current_user: User = Depends(get_current_user)
    ):
        """Generate analysis based on selected depth level"""
        try:
            address = depth_request.get('address')
            depth_level = depth_request.get('depth_level', 1)
            
            if not address:
                raise HTTPException(status_code=400, detail="Address is required")
            
            if depth_level < 1 or depth_level > 5:
                raise HTTPException(status_code=400, detail="Depth level must be between 1 and 5")
            
            # Generate depth-based analysis
            analysis = await revenue_strategy.generate_depth_based_analysis(
                address, depth_level, current_user.subscription_tier
            )
            
            # Log revenue generation
            logger.info(f"Depth analysis generated: Level {depth_level}, Price: ${analysis.get('price_paid', 0)}")
            
            return {
                'analysis': analysis,
                'depth_level': depth_level,
                'billing_info': analysis.get('billing_info', {}),
                'upgrade_options': analysis.get('billing_info', {}).get('upgrade_options', []),
                'status': 'success'
            }
            
        except Exception as e:
            logger.error(f"Depth analysis error: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    @router.get("/reports/cache-check/{address}")
    async def check_cached_reports(
        address: str,
        analysis_type: str = "business_intelligence",
        current_user: User = Depends(get_current_user)
    ):
        """Check if cached reports are available for reuse"""
        try:
            cache_info = await revenue_strategy.handle_report_caching(
                address, analysis_type, current_user.id
            )
            
            return {
                'cache_info': cache_info,
                'address': address,
                'analysis_type': analysis_type,
                'user_id': current_user.id,
                'status': 'success'
            }
            
        except Exception as e:
            logger.error(f"Cache check error: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    @router.post("/reports/purchase-cached")
    async def purchase_cached_report(
        purchase_request: Dict[str, Any],
        current_user: User = Depends(get_current_user)
    ):
        """Purchase access to cached report at discounted price"""
        try:
            cache_key = purchase_request.get('cache_key')
            address = purchase_request.get('address')
            analysis_type = purchase_request.get('analysis_type')
            
            if not cache_key or not address:
                raise HTTPException(status_code=400, detail="Cache key and address are required")
            
            # Get cache pricing
            cache_info = await revenue_strategy.handle_report_caching(
                address, analysis_type, current_user.id
            )
            
            if not cache_info.get('cached_report_available'):
                raise HTTPException(status_code=404, detail="Cached report not available")
            
            # In production, this would process payment and grant access
            purchase_result = {
                'purchase_successful': True,
                'amount_charged': cache_info['reuse_price'],
                'savings': cache_info['savings'],
                'report_access_granted': True,
                'cache_key': cache_key,
                'freshness_rating': cache_info['freshness_rating']
            }
            
            logger.info(f"Cached report purchased: {cache_key}, Amount: ${cache_info['reuse_price']}")
            
            return {
                'purchase_result': purchase_result,
                'cache_info': cache_info,
                'status': 'success'
            }
            
        except Exception as e:
            logger.error(f"Cached report purchase error: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    @router.post("/monitoring/real-time-setup")
    async def setup_real_time_monitoring(
        monitoring_request: Dict[str, Any],
        current_user: User = Depends(get_current_user)
    ):
        """Set up real-time monitoring subscription"""
        try:
            locations = monitoring_request.get('locations', [])
            
            if not locations:
                raise HTTPException(status_code=400, detail="At least one location is required")
            
            # Generate monitoring configuration
            monitoring_config = await revenue_strategy.optimize_real_time_monitoring(
                current_user.id, locations
            )
            
            return {
                'monitoring_config': monitoring_config,
                'locations_count': len(locations),
                'subscription_pricing': monitoring_config.get('subscription_price', 299),
                'roi_analysis': monitoring_config.get('roi_analysis', {}),
                'status': 'success'
            }
            
        except Exception as e:
            logger.error(f"Real-time monitoring setup error: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    @router.get("/pricing/dynamic/{address}")
    async def get_dynamic_pricing(
        address: str,
        analysis_type: str = "business_intelligence",
        current_user: User = Depends(get_current_user)
    ):
        """Get dynamic pricing based on market conditions and user profile"""
        try:
            # Mock market conditions for demo
            market_conditions = {
                'demand_level': 'high',
                'seasonal_factor': 1.1,
                'competition_density': 'medium',
                'market_saturation': 0.6
            }
            
            # Get base pricing
            base_config = revenue_strategy.depth_pricing.get(analysis_type, {})
            base_price = base_config.get('price', 99)
            
            # Handle free tier pricing (avoid division by zero)
            if base_price == 0:
                return {
                    'dynamic_pricing': {
                        'base_price': 0,
                        'dynamic_price': 0,
                        'price_adjustment': '0.0%',
                        'market_conditions': market_conditions,
                        'user_tier_discount': '0%',
                        'pricing_factors': {
                            'demand_adjustment': '0%',
                            'seasonal_adjustment': '0%',
                            'loyalty_discount': '0%'
                        },
                        'recommendations': {
                            'optimal_purchase_timing': 'FREE TIER',
                            'price_trend': 'STABLE',
                            'value_proposition': 'FREE'
                        }
                    },
                    'address': address,
                    'analysis_type': analysis_type,
                    'status': 'success'
                }
            
            # Apply dynamic pricing logic
            dynamic_multiplier = 1.0
            
            # Demand-based pricing
            if market_conditions['demand_level'] == 'high':
                dynamic_multiplier *= 1.15  # 15% premium for high demand
            elif market_conditions['demand_level'] == 'low':
                dynamic_multiplier *= 0.9   # 10% discount for low demand
            
            # Seasonal adjustments
            dynamic_multiplier *= market_conditions['seasonal_factor']
            
            # User tier discounts
            tier_discounts = {
                'free': 0,
                'analyzer': 0.05,
                'intelligence': 0.10,
                'optimization': 0.15,
                'portfolio': 0.20,
                'watch_pro': 0.25
            }
            
            user_discount = tier_discounts.get(current_user.subscription_tier, 0)
            final_multiplier = dynamic_multiplier * (1 - user_discount)
            
            dynamic_price = round(base_price * final_multiplier, 2)
            
            pricing_response = {
                'base_price': base_price,
                'dynamic_price': dynamic_price,
                'price_adjustment': f"{((dynamic_price - base_price) / base_price) * 100:+.1f}%",
                'market_conditions': market_conditions,
                'user_tier_discount': f"{user_discount:.0%}",
                'pricing_factors': {
                    'demand_adjustment': f"{((market_conditions['demand_level'] == 'high') * 0.15):+.0%}",
                    'seasonal_adjustment': f"{(market_conditions['seasonal_factor'] - 1) * 100:+.1f}%",
                    'loyalty_discount': f"-{user_discount:.0%}"
                },
                'recommendations': {
                    'optimal_purchase_timing': 'NOW' if dynamic_price < base_price else 'CONSIDER WAITING',
                    'price_trend': 'INCREASING' if dynamic_multiplier > 1.05 else 'STABLE',
                    'value_proposition': 'HIGH' if dynamic_price < base_price * 1.1 else 'MODERATE'
                }
            }
            
            return {
                'dynamic_pricing': pricing_response,
                'address': address,
                'analysis_type': analysis_type,
                'status': 'success'
            }
            
        except Exception as e:
            logger.error(f"Dynamic pricing error: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    @router.get("/strategy/revenue-forecast")
    async def get_revenue_forecast(
        current_user: User = Depends(get_current_user)
    ):
        """Get revenue forecast with all optimization strategies"""
        try:
            # Calculate potential revenue from different strategies
            strategies_impact = {
                'preview_blur_strategy': {
                    'conversion_rate_boost': '45%',
                    'estimated_monthly_revenue_increase': 15000,
                    'implementation_cost': 'Low',
                    'time_to_implement': '1-2 weeks'
                },
                'pay_per_depth': {
                    'price_point_optimization': '5 tiers from $0-$299',
                    'estimated_monthly_revenue_increase': 35000,
                    'customer_segmentation': 'Improved',
                    'time_to_implement': '2-3 weeks'
                },
                'report_caching': {
                    'cost_savings': '60% reduction in analysis costs',
                    'estimated_monthly_savings': 8000,
                    'customer_satisfaction': 'Higher (faster access)',
                    'time_to_implement': '1 week'
                },
                'real_time_monitoring': {
                    'premium_pricing': '$299/month per location',
                    'estimated_monthly_revenue_increase': 25000,
                    'customer_lifetime_value': '+300%',
                    'time_to_implement': '3-4 weeks'
                }
            }
            
            # Total impact calculation
            total_monthly_increase = (
                strategies_impact['preview_blur_strategy']['estimated_monthly_revenue_increase'] +
                strategies_impact['pay_per_depth']['estimated_monthly_revenue_increase'] +
                strategies_impact['real_time_monitoring']['estimated_monthly_revenue_increase']
            )
            
            total_monthly_savings = strategies_impact['report_caching']['estimated_monthly_savings']
            
            revenue_forecast = {
                'current_monthly_revenue': 25000,  # Baseline
                'optimized_monthly_revenue': 25000 + total_monthly_increase,
                'monthly_cost_savings': total_monthly_savings,
                'net_monthly_improvement': total_monthly_increase + total_monthly_savings,
                'annual_revenue_impact': (total_monthly_increase + total_monthly_savings) * 12,
                'roi_multiplier': f"{((total_monthly_increase + total_monthly_savings) / 25000) * 100:.0f}% revenue increase",
                'strategies_breakdown': strategies_impact,
                'implementation_timeline': '4-6 weeks for full deployment',
                'confidence_level': 'High - Based on industry benchmarks and user behavior analysis'
            }
            
            return {
                'revenue_forecast': revenue_forecast,
                'optimization_roadmap': {
                    'phase_1': 'Preview/blur strategy (Week 1-2)',
                    'phase_2': 'Pay-per-depth implementation (Week 2-4)',
                    'phase_3': 'Report caching system (Week 3)',
                    'phase_4': 'Real-time monitoring launch (Week 4-6)'
                },
                'status': 'success'
            }
            
        except Exception as e:
            logger.error(f"Revenue forecast error: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    @router.post("/analysis/upgrade-flow")
    async def handle_upgrade_flow(
        upgrade_request: Dict[str, Any],
        current_user: User = Depends(get_current_user)
    ):
        """Handle upgrade flow from preview to full analysis"""
        try:
            preview_id = upgrade_request.get('preview_id')
            selected_tier = upgrade_request.get('selected_tier', 'business_intelligence')
            
            if not preview_id:
                raise HTTPException(status_code=400, detail="Preview ID is required")
            
            # Get tier configuration
            tier_config = revenue_strategy.depth_pricing.get(selected_tier)
            if not tier_config:
                raise HTTPException(status_code=400, detail="Invalid tier selected")
            
            # Calculate upgrade pricing (with preview discount)
            base_price = tier_config['price']
            preview_discount = 0.15  # 15% discount for upgrading from preview
            upgrade_price = base_price * (1 - preview_discount)
            
            upgrade_flow = {
                'preview_id': preview_id,
                'selected_tier': selected_tier,
                'tier_description': tier_config['description'],
                'original_price': base_price,
                'upgrade_price': round(upgrade_price, 2),
                'preview_discount': f"{preview_discount:.0%}",
                'savings': round(base_price - upgrade_price, 2),
                'features_unlocked': tier_config['includes'],
                'depth_level': tier_config['depth_level'],
                'estimated_delivery': '2-5 minutes',
                'satisfaction_guarantee': '30-day money-back guarantee',
                'social_proof': '67,000+ professionals use our analysis'
            }
            
            # Add urgency and scarcity elements
            upgrade_flow['conversion_boosters'] = {
                'limited_time_discount': f"Save ${round(base_price - upgrade_price, 2)} - Offer expires in 24 hours",
                'instant_access': 'Immediate download after payment',
                'risk_free': 'Try risk-free with money-back guarantee',
                'expert_backed': 'Analysis backed by 3-generation laundromat expertise'
            }
            
            return {
                'upgrade_flow': upgrade_flow,
                'payment_options': ['stripe', 'paypal'],
                'next_steps': 'Complete payment to unlock full analysis',
                'status': 'success'
            }
            
        except Exception as e:
            logger.error(f"Upgrade flow error: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    return router

# Create the advanced revenue router
advanced_revenue_router = create_advanced_revenue_router()