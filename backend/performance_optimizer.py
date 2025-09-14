"""
PERFORMANCE OPTIMIZER - MAKE EVERYTHING BLAZING FAST
Optimize database queries, API responses, caching, and overall system performance
"""

import asyncio
import time
from functools import wraps
from motor.motor_asyncio import AsyncIOMotorClient
import redis
import json
import logging
from datetime import datetime, timedelta, timezone
from typing import Dict, List, Any, Optional
import hashlib

logger = logging.getLogger(__name__)

class PerformanceOptimizer:
    """Make the platform blazing fast and efficient"""
    
    def __init__(self):
        self.cache = {}
        self.query_cache_ttl = 300  # 5 minutes
        self.expensive_queries = {}
        
    def performance_monitor(self, operation_name: str):
        """Decorator to monitor performance of operations"""
        def decorator(func):
            @wraps(func)
            async def wrapper(*args, **kwargs):
                start_time = time.time()
                try:
                    result = await func(*args, **kwargs)
                    execution_time = time.time() - start_time
                    
                    # Log slow operations
                    if execution_time > 2.0:
                        logger.warning(f"SLOW OPERATION: {operation_name} took {execution_time:.2f}s")
                    
                    # Track performance metrics
                    await self.track_performance_metric(operation_name, execution_time, True)
                    return result
                    
                except Exception as e:
                    execution_time = time.time() - start_time
                    await self.track_performance_metric(operation_name, execution_time, False)
                    raise e
                    
            return wrapper
        return decorator
    
    async def track_performance_metric(self, operation: str, execution_time: float, success: bool):
        """Track performance metrics for optimization"""
        try:
            # Store in performance cache for monitoring
            metric = {
                'operation': operation,
                'execution_time': execution_time,
                'success': success,
                'timestamp': datetime.now(timezone.utc).isoformat()
            }
            
            # Keep last 100 metrics per operation
            if operation not in self.expensive_queries:
                self.expensive_queries[operation] = []
            
            self.expensive_queries[operation].append(metric)
            
            # Keep only last 100 entries
            if len(self.expensive_queries[operation]) > 100:
                self.expensive_queries[operation] = self.expensive_queries[operation][-100:]
                
        except Exception as e:
            logger.error(f"Performance tracking error: {e}")
    
    def cache_key(self, *args, **kwargs) -> str:
        """Generate cache key from arguments"""
        key_data = str(args) + str(sorted(kwargs.items()))
        return hashlib.md5(key_data.encode()).hexdigest()
    
    def cached_response(self, ttl: int = 300):
        """Decorator for caching expensive operations"""
        def decorator(func):
            @wraps(func)
            async def wrapper(*args, **kwargs):
                cache_key = self.cache_key(func.__name__, *args, **kwargs)
                
                # Check cache first
                if cache_key in self.cache:
                    cached_data, cache_time = self.cache[cache_key]
                    if time.time() - cache_time < ttl:
                        logger.info(f"CACHE HIT: {func.__name__}")
                        return cached_data
                
                # Execute function and cache result  
                result = await func(*args, **kwargs)
                self.cache[cache_key] = (result, time.time())
                
                # Clean old cache entries
                await self.clean_expired_cache()
                
                logger.info(f"CACHE MISS: {func.__name__} - cached for {ttl}s")
                return result
                
            return wrapper
        return decorator
    
    async def clean_expired_cache(self):
        """Clean expired cache entries"""
        try:
            current_time = time.time()
            expired_keys = []
            
            for key, (data, cache_time) in self.cache.items():
                if current_time - cache_time > self.query_cache_ttl:
                    expired_keys.append(key)
            
            for key in expired_keys:
                del self.cache[key]
                
            if expired_keys:
                logger.info(f"CACHE CLEANED: Removed {len(expired_keys)} expired entries")
                
        except Exception as e:
            logger.error(f"Cache cleaning error: {e}")
    
    async def optimize_database_queries(self, db):
        """Optimize database queries with indexes and efficient queries"""
        try:
            # Create performance indexes
            await db.analyses.create_index([("user_id", 1), ("created_at", -1)])
            await db.analyses.create_index([("analysis_id", 1)])
            await db.users.create_index([("email", 1)], unique=True)
            await db.users.create_index([("id", 1)], unique=True)
            await db.usage_tracking.create_index([("user_id", 1), ("billing_period_start", 1)])
            await db.market_monitoring.create_index([("user_id", 1), ("active", 1)])
            await db.market_alerts.create_index([("user_id", 1), ("created_at", -1)])
            await db.facebook_subscriptions.create_index([("user_id", 1), ("subscription_status", 1)])
            await db.payment_transactions.create_index([("user_id", 1), ("created_at", -1)])
            
            logger.info("✅ DATABASE INDEXES OPTIMIZED")
            return True
            
        except Exception as e:
            logger.error(f"Database optimization error: {e}")
            return False
    
    async def get_performance_metrics(self) -> Dict[str, Any]:
        """Get current performance metrics"""
        try:
            metrics = {
                'cache_size': len(self.cache),
                'total_operations': sum(len(ops) for ops in self.expensive_queries.values()),
                'operation_metrics': {},
                'slow_operations': []
            }
            
            # Analyze operation performance
            for operation, op_metrics in self.expensive_queries.items():
                if op_metrics:
                    avg_time = sum(m['execution_time'] for m in op_metrics) / len(op_metrics)
                    success_rate = sum(1 for m in op_metrics if m['success']) / len(op_metrics)
                    
                    metrics['operation_metrics'][operation] = {
                        'average_time': round(avg_time, 3),
                        'success_rate': round(success_rate, 3),
                        'total_calls': len(op_metrics)
                    }
                    
                    # Identify slow operations
                    if avg_time > 1.5:
                        metrics['slow_operations'].append({
                            'operation': operation,
                            'avg_time': round(avg_time, 3)
                        })
            
            return metrics
            
        except Exception as e:
            logger.error(f"Performance metrics error: {e}")
            return {'error': str(e)}

# Global performance optimizer
performance_optimizer = PerformanceOptimizer()

# Decorators for easy use
def monitor_performance(operation_name: str):
    return performance_optimizer.performance_monitor(operation_name)

def cache_result(ttl: int = 300):
    return performance_optimizer.cached_response(ttl)