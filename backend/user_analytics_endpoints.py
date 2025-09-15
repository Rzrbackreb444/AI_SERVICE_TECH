"""
Real User Analytics Endpoints
Provides actual user-specific analytics data instead of mock data
"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timedelta
from typing import Dict, Any
import logging
import os
from motor.motor_asyncio import AsyncIOMotorClient

logger = logging.getLogger(__name__)

# Database connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'sitetitan_db')]

# Security
security = HTTPBearer()

class User:
    def __init__(self, **data):
        for key, value in data.items():
            setattr(self, key, value)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    """Get current user from JWT token"""
    import jwt
    try:
        JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key')
        JWT_ALGORITHM = 'HS256'
        
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

def create_user_analytics_router():
    """Create user analytics router"""
    router = APIRouter(prefix="/user", tags=["user-analytics"])
    
    @router.get("/analytics")
    async def get_user_analytics(current_user: User = Depends(get_current_user)) -> Dict[str, Any]:
        """Get real user analytics data"""
        try:
            user_id = current_user.id
            
            # Real analyses completed by this user
            analyses_completed = await db.location_analyses.count_documents({"user_id": user_id})
            
            # Unique locations analyzed
            unique_locations = await db.location_analyses.distinct("address", {"user_id": user_id})
            locations_analyzed = len(unique_locations)
            
            # Reports generated (assuming each analysis can generate a report)
            reports_generated = await db.location_analyses.count_documents({
                "user_id": user_id,
                "report_generated": {"$exists": True}
            })
            
            # If no specific report tracking, estimate based on recent analyses
            if reports_generated == 0:
                reports_generated = await db.location_analyses.count_documents({
                    "user_id": user_id,
                    "created_at": {"$gte": datetime.utcnow() - timedelta(days=30)}
                })
            
            # Saved listings (from marketplace or favorites)
            saved_listings = await db.user_favorites.count_documents({"user_id": user_id}) if await db.user_favorites.count_documents({}) > 0 else 0
            
            # Payment transactions by this user
            user_transactions = await db.payment_transactions.count_documents({
                "user_id": user_id,
                "payment_status": "completed"
            })
            
            # Total spent by user
            user_payments = await db.payment_transactions.find({
                "user_id": user_id, 
                "payment_status": "completed"
            }).to_list(None)
            total_spent = sum(payment.get("amount", 0) for payment in user_payments)
            
            # Active subscriptions
            active_subscriptions = await db.facebook_subscriptions.count_documents({
                "user_id": user_id,
                "subscription_status": "active"
            })
            
            # Account creation date
            user_data = await db.users.find_one({"id": user_id})
            account_created = user_data.get("created_at", datetime.utcnow())
            
            # Days since account creation
            days_active = (datetime.utcnow() - account_created).days
            
            # Average usage per week
            avg_analyses_per_week = (analyses_completed / max(days_active / 7, 1)) if days_active > 0 else 0
            
            return {
                "analyses_completed": analyses_completed,
                "locations_analyzed": locations_analyzed,
                "reports_generated": reports_generated,
                "saved_listings": saved_listings,
                "account_created": account_created.isoformat(),
                "days_active": days_active,
                "total_spent": round(total_spent, 2),
                "active_subscriptions": active_subscriptions,
                "avg_analyses_per_week": round(avg_analyses_per_week, 1),
                "user_transactions": user_transactions,
                "last_activity": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error getting user analytics: {e}")
            raise HTTPException(status_code=500, detail="Failed to fetch user analytics")
    
    @router.get("/profile/complete")
    async def get_complete_user_profile(current_user: User = Depends(get_current_user)) -> Dict[str, Any]:
        """Get complete user profile with real data"""
        try:
            user_id = current_user.id
            
            # Get user data
            user_data = await db.users.find_one({"id": user_id})
            if not user_data:
                raise HTTPException(status_code=404, detail="User not found")
            
            # Get subscription data
            active_subscription = await db.facebook_subscriptions.find_one({
                "user_id": user_id,
                "subscription_status": "active"
            })
            
            # Calculate subscription tier
            subscription_tier = user_data.get("subscription_tier", "free")
            if active_subscription:
                offer_type = active_subscription.get("offer_type", "")
                if "funder" in offer_type:
                    subscription_tier = "enterprise"
                elif "partner" in offer_type:
                    subscription_tier = "professional"
                else:
                    subscription_tier = "basic"
            
            # Get recent activity
            recent_analyses = await db.location_analyses.find({
                "user_id": user_id
            }).sort("created_at", -1).limit(5).to_list(5)
            
            # Get payment history
            payment_history = await db.payment_transactions.find({
                "user_id": user_id,
                "payment_status": "completed"
            }).sort("created_at", -1).limit(10).to_list(10)
            
            return {
                "user_profile": {
                    "id": user_data["id"],
                    "full_name": user_data.get("full_name", ""),
                    "email": user_data.get("email", ""),
                    "subscription_tier": subscription_tier,
                    "facebook_group_member": user_data.get("facebook_group_member", False),
                    "created_at": user_data.get("created_at", datetime.utcnow()).isoformat(),
                    "phone": user_data.get("phone", ""),
                    "company": user_data.get("company", ""),
                    "location": user_data.get("location", "")
                },
                "subscription_info": {
                    "active_subscription": active_subscription is not None,
                    "subscription_type": active_subscription.get("offer_type") if active_subscription else None,
                    "subscription_status": active_subscription.get("subscription_status") if active_subscription else "none",
                    "created_at": active_subscription.get("created_at").isoformat() if active_subscription and active_subscription.get("created_at") else None
                },
                "recent_activity": [
                    {
                        "type": "analysis",
                        "address": analysis.get("address", ""),
                        "grade": analysis.get("overall_grade", ""),
                        "created_at": analysis.get("created_at", datetime.utcnow()).isoformat()
                    } for analysis in recent_analyses
                ],
                "payment_summary": {
                    "total_transactions": len(payment_history),
                    "total_spent": sum(p.get("amount", 0) for p in payment_history),
                    "recent_payments": [
                        {
                            "amount": payment.get("amount", 0),
                            "offer_type": payment.get("offer_type", ""),
                            "created_at": payment.get("created_at", datetime.utcnow()).isoformat()
                        } for payment in payment_history[:3]
                    ]
                }
            }
            
        except Exception as e:
            logger.error(f"Error getting complete user profile: {e}")
            raise HTTPException(status_code=500, detail="Failed to fetch user profile")
    
    return router