from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timedelta
from typing import Dict, Any, List
import logging
from collections import defaultdict

# This file contains admin-only endpoints for managing the Facebook Group badge system
# These endpoints should be protected with admin authentication in production

logger = logging.getLogger(__name__)

def create_admin_router(db, get_current_user):
    """Create admin router with database and auth dependencies"""
    admin_router = APIRouter(prefix="/admin", tags=["admin"])
    
    # TODO: Add proper admin authentication middleware
    # For now, we'll use the regular user auth but in production this should check for admin role
    
    @admin_router.get("/stats")
    async def get_admin_stats(period: int = 30, current_user = Depends(get_current_user)):
        """Get comprehensive admin statistics"""
        try:
            # Calculate date range
            end_date = datetime.utcnow()
            start_date = end_date - timedelta(days=period)
            prev_start_date = start_date - timedelta(days=period)
            
            # Get current period transactions
            current_transactions = await db.payment_transactions.find({
                "payment_status": "completed",
                "created_at": {"$gte": start_date, "$lte": end_date}
            }).to_list(length=None)
            
            # Get previous period transactions for comparison
            prev_transactions = await db.payment_transactions.find({
                "payment_status": "completed", 
                "created_at": {"$gte": prev_start_date, "$lt": start_date}
            }).to_list(length=None)
            
            # Calculate current period stats
            total_revenue = sum(trans.get("amount", 0) for trans in current_transactions)
            prev_revenue = sum(trans.get("amount", 0) for trans in prev_transactions)
            revenue_change = ((total_revenue - prev_revenue) / max(prev_revenue, 1)) * 100 if prev_revenue > 0 else 0
            
            # Get active subscriptions
            active_subscriptions = await db.facebook_subscriptions.find({
                "subscription_status": "active"
            }).to_list(length=None)
            
            # New subscribers in current period
            new_subscribers = await db.facebook_subscriptions.count_documents({
                "created_at": {"$gte": start_date, "$lte": end_date}
            })
            
            # Revenue by badge type
            revenue_by_badge = defaultdict(float)
            count_by_badge = defaultdict(int)
            for trans in current_transactions:
                offer_type = trans.get("offer_type", "unknown")
                revenue_by_badge[offer_type] += trans.get("amount", 0)
                count_by_badge[offer_type] += 1
            
            # Payment method breakdown
            paypal_transactions = [t for t in current_transactions if t.get("payment_provider") == "paypal"]
            stripe_transactions = [t for t in current_transactions if t.get("payment_provider") == "stripe"]
            
            paypal_revenue = sum(t.get("amount", 0) for t in paypal_transactions)
            stripe_revenue = sum(t.get("amount", 0) for t in stripe_transactions)
            paypal_discounts = sum(t.get("metadata", {}).get("discount_applied", 0) for t in paypal_transactions)
            
            # Calculate success rates
            total_transactions_count = await db.payment_transactions.count_documents({
                "created_at": {"$gte": start_date, "$lte": end_date}
            })
            success_rate = (len(current_transactions) / max(total_transactions_count, 1)) * 100
            
            stripe_total = await db.payment_transactions.count_documents({
                "payment_provider": "stripe",
                "created_at": {"$gte": start_date, "$lte": end_date}
            })
            stripe_success_rate = (len(stripe_transactions) / max(stripe_total, 1)) * 100
            
            # Average order value
            avg_order_value = total_revenue / max(len(current_transactions), 1)
            
            # Churn rate (cancelled subscriptions / total subscriptions)
            cancelled_subs = await db.facebook_subscriptions.count_documents({
                "subscription_status": "cancelled",
                "updated_at": {"$gte": start_date, "$lte": end_date}
            })
            total_subs = await db.facebook_subscriptions.count_documents({})
            churn_rate = (cancelled_subs / max(total_subs, 1)) * 100
            
            return {
                "totalRevenue": total_revenue,
                "revenueChange": round(revenue_change, 1),
                "activeSubscribers": len(active_subscriptions),
                "newSubscribers": new_subscribers,
                "totalTransactions": len(current_transactions),
                "successRate": round(success_rate, 1),
                "averageOrderValue": avg_order_value,
                "churnRate": round(churn_rate, 1),
                "revenueByBadge": dict(revenue_by_badge),
                "countByBadge": dict(count_by_badge),
                "paypalRevenue": paypal_revenue,
                "stripeRevenue": stripe_revenue,
                "paypalCount": len(paypal_transactions),
                "stripeCount": len(stripe_transactions),
                "paypalDiscounts": paypal_discounts,
                "stripeSuccessRate": round(stripe_success_rate, 1)
            }
            
        except Exception as e:
            logger.error(f"Error fetching admin stats: {e}")
            raise HTTPException(status_code=500, detail="Failed to fetch admin statistics")
    
    @admin_router.get("/users")
    async def get_admin_users(limit: int = 100, current_user = Depends(get_current_user)):
        """Get user list for admin management"""
        try:
            users = await db.users.find({}).sort("created_at", -1).limit(limit).to_list(length=limit)
            # Remove password field for security
            for user in users:
                user.pop("password", None)
            return {"users": users}
        except Exception as e:
            logger.error(f"Error fetching users: {e}")
            raise HTTPException(status_code=500, detail="Failed to fetch users")
    
    @admin_router.get("/subscriptions")
    async def get_admin_subscriptions(status: str = None, current_user = Depends(get_current_user)):
        """Get subscriptions list for admin management"""
        try:
            query = {}
            if status:
                query["subscription_status"] = status
            
            subscriptions = await db.facebook_subscriptions.find(query).sort("created_at", -1).to_list(length=None)
            return {"subscriptions": subscriptions}
        except Exception as e:
            logger.error(f"Error fetching subscriptions: {e}")
            raise HTTPException(status_code=500, detail="Failed to fetch subscriptions")
    
    @admin_router.get("/transactions")
    async def get_admin_transactions(limit: int = 50, current_user = Depends(get_current_user)):
        """Get transaction list for admin management"""
        try:
            transactions = await db.payment_transactions.find({}).sort("created_at", -1).limit(limit).to_list(length=limit)
            return {"transactions": transactions}
        except Exception as e:
            logger.error(f"Error fetching transactions: {e}")
            raise HTTPException(status_code=500, detail="Failed to fetch transactions")
    
    @admin_router.post("/subscriptions/{subscription_id}/toggle")
    async def toggle_subscription_status(subscription_id: str, status_data: Dict[str, str], current_user = Depends(get_current_user)):
        """Toggle subscription status (activate/suspend)"""
        try:
            new_status = status_data.get("status")
            if new_status not in ["active", "suspended", "cancelled"]:
                raise HTTPException(status_code=400, detail="Invalid status")
            
            result = await db.facebook_subscriptions.update_one(
                {"id": subscription_id},
                {"$set": {
                    "subscription_status": new_status,
                    "badge_active": new_status == "active",
                    "updated_at": datetime.utcnow()
                }}
            )
            
            if result.modified_count == 0:
                raise HTTPException(status_code=404, detail="Subscription not found")
            
            return {"message": f"Subscription {new_status} successfully"}
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error toggling subscription status: {e}")
            raise HTTPException(status_code=500, detail="Failed to update subscription")
    
    @admin_router.post("/transactions/{transaction_id}/refund")
    async def process_refund(transaction_id: str, refund_data: Dict[str, float], current_user = Depends(get_current_user)):
        """Process a refund for a transaction"""
        try:
            refund_amount = refund_data.get("amount")
            if not refund_amount or refund_amount <= 0:
                raise HTTPException(status_code=400, detail="Invalid refund amount")
            
            # Find the transaction
            transaction = await db.payment_transactions.find_one({"id": transaction_id})
            if not transaction:
                raise HTTPException(status_code=404, detail="Transaction not found")
            
            if transaction.get("payment_status") != "completed":
                raise HTTPException(status_code=400, detail="Cannot refund incomplete transaction")
            
            # In a real implementation, you would integrate with Stripe/PayPal APIs to process the actual refund
            # For now, we'll just mark it as refunded in our database
            
            await db.payment_transactions.update_one(
                {"id": transaction_id},
                {"$set": {
                    "payment_status": "refunded",
                    "refund_amount": refund_amount,
                    "refund_date": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }}
            )
            
            # Deactivate related subscription if exists
            if transaction.get("platform") == "facebook_group":
                await db.facebook_subscriptions.update_many(
                    {"user_id": transaction.get("user_id"), "offer_type": transaction.get("offer_type")},
                    {"$set": {
                        "subscription_status": "refunded",
                        "badge_active": False,
                        "updated_at": datetime.utcnow()
                    }}
                )
            
            return {"message": "Refund processed successfully"}
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error processing refund: {e}")
            raise HTTPException(status_code=500, detail="Failed to process refund")
    
    @admin_router.get("/export/subscriptions")
    async def export_subscriptions(format: str = "json", current_user = Depends(get_current_user)):
        """Export subscriptions data"""
        try:
            subscriptions = await db.facebook_subscriptions.find({}).to_list(length=None)
            
            if format.lower() == "csv":
                # In a real implementation, you would convert to CSV format
                # For now, return JSON with a note
                return {
                    "format": "csv",
                    "note": "CSV export would be implemented here",
                    "data": subscriptions
                }
            
            return {"subscriptions": subscriptions}
            
        except Exception as e:
            logger.error(f"Error exporting subscriptions: {e}")
            raise HTTPException(status_code=500, detail="Failed to export subscriptions")
    
    @admin_router.get("/export/revenue")
    async def export_revenue_report(period: int = 30, current_user = Depends(get_current_user)):
        """Export revenue report"""
        try:
            end_date = datetime.utcnow()
            start_date = end_date - timedelta(days=period)
            
            transactions = await db.payment_transactions.find({
                "payment_status": "completed",
                "created_at": {"$gte": start_date, "$lte": end_date}
            }).to_list(length=None)
            
            # Calculate detailed revenue metrics
            total_revenue = sum(t.get("amount", 0) for t in transactions)
            paypal_revenue = sum(t.get("amount", 0) for t in transactions if t.get("payment_provider") == "paypal")
            stripe_revenue = sum(t.get("amount", 0) for t in transactions if t.get("payment_provider") == "stripe")
            
            revenue_by_day = defaultdict(float)
            for trans in transactions:
                day = trans.get("created_at", datetime.utcnow()).strftime("%Y-%m-%d")
                revenue_by_day[day] += trans.get("amount", 0)
            
            return {
                "period_days": period,
                "start_date": start_date.isoformat(),
                "end_date": end_date.isoformat(),
                "total_revenue": total_revenue,
                "paypal_revenue": paypal_revenue,
                "stripe_revenue": stripe_revenue,
                "transaction_count": len(transactions),
                "daily_revenue": dict(revenue_by_day),
                "transactions": transactions
            }
            
        except Exception as e:
            logger.error(f"Error exporting revenue report: {e}")
            raise HTTPException(status_code=500, detail="Failed to export revenue report")
    
    return admin_router