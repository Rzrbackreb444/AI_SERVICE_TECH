"""
OPTIMIZATION ENDPOINTS - EXPOSE ALL OPTIMIZATION FEATURES
Performance monitoring, system health, revenue optimization APIs
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, List, Any, Optional
from datetime import datetime, timezone
import logging
from performance_optimizer import performance_optimizer, monitor_performance, cache_result
from system_optimizer import system_optimizer
from revenue_optimizer import revenue_optimizer
import os

logger = logging.getLogger(__name__)

def create_optimization_router() -> APIRouter:
    """Create optimization router with all optimization endpoints"""
    router = APIRouter(prefix="/optimization", tags=["optimization"])
    
    @router.get("/performance/metrics")
    @monitor_performance("get_performance_metrics")
    async def get_performance_metrics():
        """Get current performance metrics"""
        try:
            metrics = await performance_optimizer.get_performance_metrics()
            return {
                'performance_metrics': metrics,
                'status': 'success',
                'timestamp': datetime.now(timezone.utc).isoformat()
            }
        except Exception as e:
            logger.error(f"Performance metrics error: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    @router.get("/system/health")
    @monitor_performance("system_health_check")
    async def get_system_health():
        """Get comprehensive system health status"""
        try:
            health = await system_optimizer.get_system_health()
            return {
                'system_health': health,
                'status': 'success',
                'optimization_status': 'active'
            }
        except Exception as e:
            logger.error(f"System health error: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    @router.post("/system/optimize")
    @monitor_performance("full_system_optimization")
    async def run_full_system_optimization():
        """Run complete system optimization"""
        try:
            # Get environment variables for optimization
            mongo_url = os.environ.get('MONGO_URL')
            db_name = os.environ.get('DB_NAME')
            redis_url = os.environ.get('REDIS_URL')
            
            optimization_results = await system_optimizer.full_system_optimization(
                mongo_url=mongo_url,
                db_name=db_name,
                redis_url=redis_url
            )
            
            return {
                'optimization_results': optimization_results,
                'status': 'success',
                'message': 'Full system optimization completed'
            }
        except Exception as e:
            logger.error(f"System optimization error: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    @router.post("/revenue/pricing")
    @monitor_performance("optimize_pricing")
    async def optimize_pricing_strategy(
        pricing_request: Dict[str, Any]
    ):
        """Optimize pricing strategy based on market conditions"""
        try:
            user_data = pricing_request.get('user_data', {})
            market_conditions = pricing_request.get('market_conditions', {'demand_level': 'medium'})
            
            optimization = await revenue_optimizer.optimize_pricing_strategy(user_data, market_conditions)
            
            return {
                'pricing_optimization': optimization,
                'status': 'success',
                'timestamp': datetime.now(timezone.utc).isoformat()
            }
        except Exception as e:
            logger.error(f"Pricing optimization error: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    @router.post("/revenue/conversion/{user_id}")
    @monitor_performance("optimize_conversion")
    async def optimize_conversion_funnel(
        user_id: str,
        conversion_request: Dict[str, Any]
    ):
        """Optimize conversion funnel for specific user"""
        try:
            user_behavior = conversion_request.get('user_behavior', {})
            
            optimization = await revenue_optimizer.optimize_conversion_funnel(user_id, user_behavior)
            
            return {
                'conversion_optimization': optimization,
                'user_id': user_id,
                'status': 'success'
            }
        except Exception as e:
            logger.error(f"Conversion optimization error: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    @router.post("/revenue/churn/{user_id}")
    @monitor_performance("predict_churn")
    async def predict_and_prevent_churn(
        user_id: str,
        churn_request: Dict[str, Any]
    ):
        """Predict churn risk and generate prevention strategies"""
        try:
            usage_data = churn_request.get('usage_data', {})
            
            churn_analysis = await revenue_optimizer.predict_and_prevent_churn(user_id, usage_data)
            
            return {
                'churn_analysis': churn_analysis,
                'user_id': user_id,
                'status': 'success'
            }
        except Exception as e:
            logger.error(f"Churn prediction error: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    @router.post("/revenue/upsell/{user_id}")
    @monitor_performance("optimize_upsell")
    async def optimize_upsell_opportunities(
        user_id: str,
        upsell_request: Dict[str, Any]
    ):
        """Optimize upsell opportunities for user"""
        try:
            current_tier = upsell_request.get('current_tier', 'free')
            usage_data = upsell_request.get('usage_data', {})
            
            upsell_optimization = await revenue_optimizer.optimize_upsell_opportunities(
                user_id, current_tier, usage_data
            )
            
            return {
                'upsell_optimization': upsell_optimization,
                'user_id': user_id,
                'current_tier': current_tier,
                'status': 'success'
            }
        except Exception as e:
            logger.error(f"Upsell optimization error: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    @router.post("/revenue/forecast")
    @monitor_performance("calculate_revenue_forecasts")
    @cache_result(ttl=3600)  # Cache for 1 hour
    async def calculate_revenue_forecasts(
        forecast_request: Dict[str, Any]
    ):
        """Calculate optimized revenue forecasts"""
        try:
            historical_data = forecast_request.get('historical_data', {})
            optimization_impacts = forecast_request.get('optimization_impacts', {})
            
            forecasts = await revenue_optimizer.calculate_revenue_forecasts(
                historical_data, optimization_impacts
            )
            
            return {
                'revenue_forecasts': forecasts,
                'status': 'success',
                'generated_at': datetime.now(timezone.utc).isoformat()
            }
        except Exception as e:
            logger.error(f"Revenue forecast error: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    @router.get("/cache/status")
    async def get_cache_status():
        """Get current cache status and performance"""
        try:
            cache_size = len(performance_optimizer.cache)
            
            return {
                'cache_status': {
                    'active': True,
                    'cache_size': cache_size,
                    'cache_hit_ratio': 'Monitoring active',
                    'performance_impact': 'Optimized'
                },
                'status': 'success'
            }
        except Exception as e:
            logger.error(f"Cache status error: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    @router.post("/cache/clear")
    async def clear_cache():
        """Clear performance cache"""
        try:
            performance_optimizer.cache.clear()
            
            return {
                'cache_cleared': True,
                'message': 'Performance cache cleared successfully',
                'status': 'success'
            }
        except Exception as e:
            logger.error(f"Cache clear error: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    @router.get("/database/indexes")
    @monitor_performance("optimize_database_indexes")
    async def optimize_database_indexes():
        """Optimize database indexes for performance"""
        try:
            from motor.motor_asyncio import AsyncIOMotorClient
            
            mongo_url = os.environ.get('MONGO_URL')
            db_name = os.environ.get('DB_NAME')
            
            if not mongo_url or not db_name:
                raise HTTPException(status_code=500, detail="Database configuration missing")
            
            client = AsyncIOMotorClient(mongo_url)
            db = client[db_name]
            
            # Optimize database indexes
            index_optimization = await performance_optimizer.optimize_database_queries(db)
            
            return {
                'database_optimization': {
                    'indexes_optimized': index_optimization,
                    'collections_optimized': [
                        'analyses', 'users', 'usage_tracking', 'market_monitoring',
                        'market_alerts', 'facebook_subscriptions', 'payment_transactions'
                    ],
                    'performance_improvement': 'Significant query speed improvements expected'
                },
                'status': 'success'
            }
        except Exception as e:
            logger.error(f"Database optimization error: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    return router

# Create the optimization router
optimization_router = create_optimization_router()