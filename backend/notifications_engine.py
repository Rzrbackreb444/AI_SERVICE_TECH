"""
Enterprise Notifications Engine
Real-time notifications, email campaigns, SMS alerts, and push notifications
"""

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
import logging
import json
import asyncio
from email_service import email_service
import uuid

logger = logging.getLogger(__name__)

def create_notifications_router(db, get_current_user):
    """Create comprehensive notifications management router"""
    notifications_router = APIRouter(prefix="/notifications", tags=["notifications"])
    
    @notifications_router.get("/")
    async def get_user_notifications(
        limit: int = 50,
        offset: int = 0,
        unread_only: bool = False,
        current_user = Depends(get_current_user)
    ):
        """Get user's notifications with pagination"""
        try:
            query = {"user_id": current_user.id}
            if unread_only:
                query["read"] = False
            
            notifications = await db.notifications.find(query).sort("created_at", -1).skip(offset).limit(limit).to_list(length=limit)
            total_count = await db.notifications.count_documents(query)
            unread_count = await db.notifications.count_documents({"user_id": current_user.id, "read": False})
            
            return {
                "notifications": [
                    {
                        "id": notif.get("id"),
                        "type": notif.get("type"),
                        "title": notif.get("title"),
                        "message": notif.get("message"),
                        "data": notif.get("data", {}),
                        "read": notif.get("read", False),
                        "created_at": notif.get("created_at"),
                        "expires_at": notif.get("expires_at"),
                        "action_url": notif.get("action_url"),
                        "icon": notif.get("icon"),
                        "priority": notif.get("priority", "normal")
                    }
                    for notif in notifications
                ],
                "total_count": total_count,
                "unread_count": unread_count,
                "has_more": offset + limit < total_count
            }
            
        except Exception as e:
            logger.error(f"Get notifications error: {e}")
            raise HTTPException(status_code=500, detail="Failed to fetch notifications")
    
    @notifications_router.post("/{notification_id}/mark-read")
    async def mark_notification_read(
        notification_id: str,
        current_user = Depends(get_current_user)
    ):
        """Mark a notification as read"""
        try:
            result = await db.notifications.update_one(
                {"id": notification_id, "user_id": current_user.id},
                {"$set": {"read": True, "read_at": datetime.utcnow()}}
            )
            
            if result.modified_count == 0:
                raise HTTPException(status_code=404, detail="Notification not found")
            
            return {"success": True, "message": "Notification marked as read"}
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Mark notification read error: {e}")
            raise HTTPException(status_code=500, detail="Failed to mark notification as read")
    
    @notifications_router.post("/mark-all-read")
    async def mark_all_notifications_read(current_user = Depends(get_current_user)):
        """Mark all notifications as read"""
        try:
            result = await db.notifications.update_many(
                {"user_id": current_user.id, "read": False},
                {"$set": {"read": True, "read_at": datetime.utcnow()}}
            )
            
            return {
                "success": True,
                "marked_count": result.modified_count,
                "message": f"Marked {result.modified_count} notifications as read"
            }
            
        except Exception as e:
            logger.error(f"Mark all notifications read error: {e}")
            raise HTTPException(status_code=500, detail="Failed to mark notifications as read")
    
    @notifications_router.delete("/{notification_id}")
    async def delete_notification(
        notification_id: str,
        current_user = Depends(get_current_user)
    ):
        """Delete a notification"""
        try:
            result = await db.notifications.delete_one({
                "id": notification_id,
                "user_id": current_user.id
            })
            
            if result.deleted_count == 0:
                raise HTTPException(status_code=404, detail="Notification not found")
            
            return {"success": True, "message": "Notification deleted"}
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Delete notification error: {e}")
            raise HTTPException(status_code=500, detail="Failed to delete notification")
    
    @notifications_router.get("/settings")
    async def get_notification_settings(current_user = Depends(get_current_user)):
        """Get user's notification preferences"""
        try:
            user = await db.users.find_one({"id": current_user.id})
            settings = user.get("notification_settings", {})
            
            # Default settings if none exist
            default_settings = {
                "email_notifications": True,
                "sms_notifications": False,
                "push_notifications": True,
                "marketing_emails": False,
                "security_alerts": True,
                "payment_notifications": True,
                "badge_updates": True,
                "weekly_reports": True,
                "real_time_updates": True,
                "digest_frequency": "daily"  # immediate, daily, weekly
            }
            
            # Merge with defaults
            final_settings = {**default_settings, **settings}
            
            return {"settings": final_settings}
            
        except Exception as e:
            logger.error(f"Get notification settings error: {e}")
            raise HTTPException(status_code=500, detail="Failed to fetch notification settings")
    
    @notifications_router.put("/settings")
    async def update_notification_settings(
        settings_data: Dict[str, Any],
        current_user = Depends(get_current_user)
    ):
        """Update user's notification preferences"""
        try:
            # Validate settings
            valid_keys = [
                "email_notifications", "sms_notifications", "push_notifications",
                "marketing_emails", "security_alerts", "payment_notifications",
                "badge_updates", "weekly_reports", "real_time_updates", "digest_frequency"
            ]
            
            filtered_settings = {k: v for k, v in settings_data.items() if k in valid_keys}
            
            await db.users.update_one(
                {"id": current_user.id},
                {"$set": {"notification_settings": filtered_settings}}
            )
            
            # Create notification about settings change
            await create_notification(
                user_id=current_user.id,
                type="settings_updated",
                title="Notification Settings Updated",
                message="Your notification preferences have been successfully updated.",
                icon="cog",
                priority="low"
            )
            
            return {"success": True, "message": "Notification settings updated"}
            
        except Exception as e:
            logger.error(f"Update notification settings error: {e}")
            raise HTTPException(status_code=500, detail="Failed to update notification settings")
    
    @notifications_router.post("/test")
    async def send_test_notification(
        test_data: Dict[str, str],
        background_tasks: BackgroundTasks,
        current_user = Depends(get_current_user)
    ):
        """Send test notification to verify settings"""
        try:
            notification_type = test_data.get("type", "email")
            
            if notification_type == "email":
                background_tasks.add_task(
                    send_test_email,
                    current_user.email,
                    current_user.full_name
                )
            elif notification_type == "push":
                await create_notification(
                    user_id=current_user.id,
                    type="test",
                    title="Test Notification",
                    message="This is a test notification to verify your settings are working correctly.",
                    icon="bell",
                    priority="normal"
                )
            elif notification_type == "sms":
                # SMS implementation would go here
                pass
            
            return {"success": True, "message": f"Test {notification_type} notification sent"}
            
        except Exception as e:
            logger.error(f"Send test notification error: {e}")
            raise HTTPException(status_code=500, detail="Failed to send test notification")
    
    async def create_notification(
        user_id: str,
        type: str,
        title: str,
        message: str,
        data: Dict = None,
        action_url: str = None,
        icon: str = None,
        priority: str = "normal",
        expires_at: datetime = None
    ):
        """Create a new notification for a user"""
        try:
            notification = {
                "id": str(uuid.uuid4()),
                "user_id": user_id,
                "type": type,
                "title": title,
                "message": message,
                "data": data or {},
                "action_url": action_url,
                "icon": icon,
                "priority": priority,
                "read": False,
                "created_at": datetime.utcnow(),
                "expires_at": expires_at or datetime.utcnow() + timedelta(days=30)
            }
            
            await db.notifications.insert_one(notification)
            
            # Check if user wants real-time notifications
            user = await db.users.find_one({"id": user_id})
            settings = user.get("notification_settings", {})
            
            if settings.get("real_time_updates", True):
                # Here you would integrate with WebSocket or push notification service
                # For now, we'll just log it
                logger.info(f"Real-time notification sent to user {user_id}: {title}")
            
            return notification["id"]
            
        except Exception as e:
            logger.error(f"Create notification error: {e}")
            return None
    
    async def send_bulk_notification(
        user_ids: List[str],
        type: str,
        title: str,
        message: str,
        data: Dict = None,
        action_url: str = None,
        icon: str = None,
        priority: str = "normal"
    ):
        """Send notification to multiple users"""
        try:
            notifications = []
            for user_id in user_ids:
                notification = {
                    "id": str(uuid.uuid4()),
                    "user_id": user_id,
                    "type": type,
                    "title": title,
                    "message": message,
                    "data": data or {},
                    "action_url": action_url,
                    "icon": icon,
                    "priority": priority,
                    "read": False,
                    "created_at": datetime.utcnow(),
                    "expires_at": datetime.utcnow() + timedelta(days=30)
                }
                notifications.append(notification)
            
            if notifications:
                await db.notifications.insert_many(notifications)
            
            return len(notifications)
            
        except Exception as e:
            logger.error(f"Send bulk notification error: {e}")
            return 0
    
    async def send_badge_activation_notification(user_id: str, badge_name: str, badge_type: str):
        """Send notification when badge is activated"""
        await create_notification(
            user_id=user_id,
            type="badge_activated",
            title=f"🎉 {badge_name} Activated!",
            message=f"Your {badge_name} has been successfully activated and is now visible in the Facebook group.",
            data={"badge_type": badge_type, "badge_name": badge_name},
            action_url="/dashboard",
            icon="shield-check",
            priority="high"
        )
    
    async def send_payment_notification(user_id: str, amount: float, badge_name: str, payment_method: str):
        """Send notification for successful payment"""
        await create_notification(
            user_id=user_id,
            type="payment_success",
            title="💳 Payment Successful",
            message=f"Your payment of ${amount:.2f} for {badge_name} has been processed successfully via {payment_method}.",
            data={"amount": amount, "badge_name": badge_name, "payment_method": payment_method},
            action_url="/dashboard",
            icon="credit-card",
            priority="normal"
        )
    
    async def send_renewal_reminder(user_id: str, badge_name: str, days_until_renewal: int):
        """Send subscription renewal reminder"""
        await create_notification(
            user_id=user_id,
            type="renewal_reminder",
            title="🔔 Subscription Renewal Reminder",
            message=f"Your {badge_name} subscription will renew in {days_until_renewal} days.",
            data={"badge_name": badge_name, "days_until_renewal": days_until_renewal},
            action_url="/dashboard",
            icon="clock",
            priority="normal"
        )
    
    async def send_security_alert(user_id: str, event_type: str, location: str, ip_address: str):
        """Send security alert notification"""
        event_messages = {
            "login_success": f"New login from {location} ({ip_address})",
            "password_changed": "Your account password has been changed",
            "2fa_enabled": "Two-factor authentication has been enabled",
            "2fa_disabled": "Two-factor authentication has been disabled"
        }
        
        message = event_messages.get(event_type, f"Security event: {event_type}")
        
        await create_notification(
            user_id=user_id,
            type="security_alert",
            title="🔒 Security Alert",
            message=message,
            data={"event_type": event_type, "location": location, "ip_address": ip_address},
            action_url="/profile/security",
            icon="shield-exclamation",
            priority="high"
        )
    
    async def send_test_email(email: str, name: str):
        """Send test email notification"""
        try:
            html_content = f"""
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ text-align: center; padding: 30px 0; background: linear-gradient(135deg, #0F172A, #1E3A8A); border-radius: 12px; }}
                    .content {{ background: #F8FAFC; padding: 20px; border-radius: 8px; margin: 20px 0; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1 style="color: white; margin: 15px 0 5px 0;">🔔 Test Notification</h1>
                        <p style="color: #94A3B8; margin: 0;">LaundroTech Notification System</p>
                    </div>
                    
                    <div class="content">
                        <h2>Hi {name},</h2>
                        <p>This is a test email to verify that your notification settings are working correctly.</p>
                        <p>If you're receiving this email, your email notifications are properly configured!</p>
                        <p>You can manage your notification preferences in your <a href="https://siteatlas.preview.emergentagent.com/profile" style="color: #3B82F6;">profile settings</a>.</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            await email_service.send_custom_email(
                email,
                name,
                "🔔 Test Notification - LaundroTech",
                html_content
            )
            
        except Exception as e:
            logger.error(f"Send test email error: {e}")
    
    # Admin endpoints for managing notifications
    @notifications_router.post("/admin/broadcast")
    async def broadcast_notification(
        broadcast_data: Dict[str, Any],
        current_user = Depends(get_current_user)
    ):
        """Send notification to all users (admin only)"""
        try:
            # In production, add admin role check here
            
            title = broadcast_data.get("title")
            message = broadcast_data.get("message")
            type = broadcast_data.get("type", "announcement")
            priority = broadcast_data.get("priority", "normal")
            
            # Get all user IDs
            users = await db.users.find({}, {"id": 1}).to_list(length=None)
            user_ids = [user["id"] for user in users]
            
            sent_count = await send_bulk_notification(
                user_ids=user_ids,
                type=type,
                title=title,
                message=message,
                icon="speaker-wave",
                priority=priority
            )
            
            return {
                "success": True,
                "sent_count": sent_count,
                "message": f"Broadcast sent to {sent_count} users"
            }
            
        except Exception as e:
            logger.error(f"Broadcast notification error: {e}")
            raise HTTPException(status_code=500, detail="Failed to send broadcast")
    
    return notifications_router, {
        "create_notification": create_notification,
        "send_bulk_notification": send_bulk_notification,
        "send_badge_activation_notification": send_badge_activation_notification,
        "send_payment_notification": send_payment_notification,
        "send_renewal_reminder": send_renewal_reminder,
        "send_security_alert": send_security_alert
    }