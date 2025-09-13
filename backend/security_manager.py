"""
Enterprise Security Manager
Advanced security features including 2FA, audit logs, session management, and security monitoring
"""

from fastapi import APIRouter, HTTPException, Depends, Request
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
import logging
import secrets
import hashlib
import pyotp
import qrcode
import io
import base64
from email_service import email_service
import json

logger = logging.getLogger(__name__)

def create_security_router(db, get_current_user):
    """Create comprehensive security management router"""
    security_router = APIRouter(prefix="/security", tags=["security"])
    
    @security_router.post("/2fa/setup")
    async def setup_two_factor_auth(current_user = Depends(get_current_user)):
        """Set up two-factor authentication for user"""
        try:
            # Generate secret key for TOTP
            secret = pyotp.random_base32()
            
            # Create TOTP URI for QR code
            totp_uri = pyotp.totp.TOTP(secret).provisioning_uri(
                name=current_user.email,
                issuer_name="LaundroTech - SiteAtlas"
            )
            
            # Generate QR code
            qr = qrcode.QRCode(version=1, box_size=10, border=5)
            qr.add_data(totp_uri)
            qr.make(fit=True)
            
            img = qr.make_image(fill_color="black", back_color="white")
            img_buffer = io.BytesIO()
            img.save(img_buffer, format='PNG')
            img_buffer.seek(0)
            
            qr_code_base64 = base64.b64encode(img_buffer.getvalue()).decode()
            
            # Store secret temporarily (not activated until verified)
            await db.users.update_one(
                {"id": current_user.id},
                {"$set": {
                    "two_factor_secret": secret,
                    "two_factor_enabled": False,
                    "two_factor_setup_at": datetime.utcnow()
                }}
            )
            
            # Log security event
            await log_security_event(
                user_id=current_user.id,
                event_type="2fa_setup_initiated",
                ip_address="unknown",
                user_agent="unknown",
                details={"setup_method": "TOTP"}
            )
            
            return {
                "secret": secret,
                "qr_code": f"data:image/png;base64,{qr_code_base64}",
                "backup_codes": generate_backup_codes(),
                "setup_uri": totp_uri
            }
            
        except Exception as e:
            logger.error(f"2FA setup error: {e}")
            raise HTTPException(status_code=500, detail="Failed to setup 2FA")
    
    @security_router.post("/2fa/verify")
    async def verify_two_factor_setup(
        verification_data: Dict[str, str],
        current_user = Depends(get_current_user)
    ):
        """Verify and activate two-factor authentication"""
        try:
            totp_code = verification_data.get("code")
            if not totp_code:
                raise HTTPException(status_code=400, detail="TOTP code required")
            
            # Get user's temporary secret
            user = await db.users.find_one({"id": current_user.id})
            secret = user.get("two_factor_secret")
            
            if not secret:
                raise HTTPException(status_code=400, detail="2FA setup not initiated")
            
            # Verify TOTP code
            totp = pyotp.TOTP(secret)
            if not totp.verify(totp_code, valid_window=2):
                raise HTTPException(status_code=400, detail="Invalid TOTP code")
            
            # Generate backup codes
            backup_codes = generate_backup_codes()
            hashed_backup_codes = [hashlib.sha256(code.encode()).hexdigest() for code in backup_codes]
            
            # Activate 2FA
            await db.users.update_one(
                {"id": current_user.id},
                {"$set": {
                    "two_factor_enabled": True,
                    "two_factor_activated_at": datetime.utcnow(),
                    "backup_codes": hashed_backup_codes
                }}
            )
            
            # Log security event
            await log_security_event(
                user_id=current_user.id,
                event_type="2fa_activated",
                ip_address="unknown",
                user_agent="unknown",
                details={"activation_method": "TOTP_verification"}
            )
            
            # Send confirmation email
            await email_service.send_security_notification(
                current_user.email,
                current_user.full_name,
                "Two-Factor Authentication Enabled",
                "2FA has been successfully activated on your account for enhanced security."
            )
            
            return {
                "success": True,
                "backup_codes": backup_codes,
                "message": "Two-factor authentication activated successfully"
            }
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"2FA verification error: {e}")
            raise HTTPException(status_code=500, detail="Failed to verify 2FA")
    
    @security_router.post("/2fa/disable")
    async def disable_two_factor_auth(
        disable_data: Dict[str, str],
        current_user = Depends(get_current_user)
    ):
        """Disable two-factor authentication"""
        try:
            password = disable_data.get("password")
            totp_code = disable_data.get("code")
            
            if not password:
                raise HTTPException(status_code=400, detail="Password required")
            
            # Verify password
            user = await db.users.find_one({"id": current_user.id})
            if not verify_password(password, user.get("password", "")):
                raise HTTPException(status_code=400, detail="Invalid password")
            
            # Verify TOTP if provided
            if totp_code:
                secret = user.get("two_factor_secret")
                totp = pyotp.TOTP(secret)
                if not totp.verify(totp_code, valid_window=2):
                    raise HTTPException(status_code=400, detail="Invalid TOTP code")
            
            # Disable 2FA
            await db.users.update_one(
                {"id": current_user.id},
                {"$unset": {
                    "two_factor_secret": "",
                    "two_factor_enabled": "",
                    "backup_codes": ""
                },
                "$set": {
                    "two_factor_disabled_at": datetime.utcnow()
                }}
            )
            
            # Log security event
            await log_security_event(
                user_id=current_user.id,
                event_type="2fa_disabled",
                ip_address="unknown",
                user_agent="unknown",
                details={"disable_reason": "user_request"}
            )
            
            return {"success": True, "message": "Two-factor authentication disabled"}
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"2FA disable error: {e}")
            raise HTTPException(status_code=500, detail="Failed to disable 2FA")
    
    @security_router.get("/sessions")
    async def get_user_sessions(current_user = Depends(get_current_user)):
        """Get user's active sessions"""
        try:
            sessions = await db.user_sessions.find({
                "user_id": current_user.id,
                "expires_at": {"$gt": datetime.utcnow()}
            }).sort("created_at", -1).to_list(length=None)
            
            return {
                "sessions": [
                    {
                        "id": session.get("id"),
                        "device": session.get("device", "Unknown"),
                        "location": session.get("location", "Unknown"),
                        "ip_address": session.get("ip_address", "Unknown"),
                        "created_at": session.get("created_at"),
                        "last_activity": session.get("last_activity"),
                        "is_current": session.get("id") == current_user.session_id
                    }
                    for session in sessions
                ],
                "total_sessions": len(sessions)
            }
            
        except Exception as e:
            logger.error(f"Get sessions error: {e}")
            raise HTTPException(status_code=500, detail="Failed to fetch sessions")
    
    @security_router.delete("/sessions/{session_id}")
    async def revoke_session(session_id: str, current_user = Depends(get_current_user)):
        """Revoke a specific session"""
        try:
            # Don't allow revoking current session
            if session_id == getattr(current_user, 'session_id', None):
                raise HTTPException(status_code=400, detail="Cannot revoke current session")
            
            result = await db.user_sessions.delete_one({
                "id": session_id,
                "user_id": current_user.id
            })
            
            if result.deleted_count == 0:
                raise HTTPException(status_code=404, detail="Session not found")
            
            # Log security event
            await log_security_event(
                user_id=current_user.id,
                event_type="session_revoked",
                ip_address="unknown",
                user_agent="unknown",
                details={"revoked_session_id": session_id}
            )
            
            return {"success": True, "message": "Session revoked successfully"}
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Revoke session error: {e}")
            raise HTTPException(status_code=500, detail="Failed to revoke session")
    
    @security_router.post("/sessions/revoke-all")
    async def revoke_all_sessions(current_user = Depends(get_current_user)):
        """Revoke all other sessions except current"""
        try:
            result = await db.user_sessions.delete_many({
                "user_id": current_user.id,
                "id": {"$ne": getattr(current_user, 'session_id', None)}
            })
            
            # Log security event
            await log_security_event(
                user_id=current_user.id,
                event_type="all_sessions_revoked",
                ip_address="unknown",
                user_agent="unknown",
                details={"revoked_count": result.deleted_count}
            )
            
            return {
                "success": True,
                "revoked_count": result.deleted_count,
                "message": f"Revoked {result.deleted_count} sessions"
            }
            
        except Exception as e:
            logger.error(f"Revoke all sessions error: {e}")
            raise HTTPException(status_code=500, detail="Failed to revoke sessions")
    
    @security_router.get("/audit-log")
    async def get_security_audit_log(
        limit: int = 50,
        offset: int = 0,
        event_type: Optional[str] = None,
        current_user = Depends(get_current_user)
    ):
        """Get user's security audit log"""
        try:
            query = {"user_id": current_user.id}
            if event_type:
                query["event_type"] = event_type
            
            events = await db.security_events.find(query).sort("created_at", -1).skip(offset).limit(limit).to_list(length=limit)
            total_count = await db.security_events.count_documents(query)
            
            return {
                "events": [
                    {
                        "id": event.get("id"),
                        "event_type": event.get("event_type"),
                        "created_at": event.get("created_at"),
                        "ip_address": event.get("ip_address"),
                        "location": event.get("location"),
                        "device": event.get("device"),
                        "success": event.get("success", True),
                        "details": event.get("details", {})
                    }
                    for event in events
                ],
                "total_count": total_count,
                "has_more": offset + limit < total_count
            }
            
        except Exception as e:
            logger.error(f"Audit log error: {e}")
            raise HTTPException(status_code=500, detail="Failed to fetch audit log")
    
    @security_router.post("/change-password")
    async def change_password(
        password_data: Dict[str, str],
        current_user = Depends(get_current_user)
    ):
        """Change user password with security validation"""
        try:
            current_password = password_data.get("current_password")
            new_password = password_data.get("new_password")
            
            if not current_password or not new_password:
                raise HTTPException(status_code=400, detail="Current and new passwords required")
            
            # Validate password strength
            if not is_strong_password(new_password):
                raise HTTPException(
                    status_code=400, 
                    detail="Password must be at least 8 characters with uppercase, lowercase, number, and special character"
                )
            
            # Verify current password
            user = await db.users.find_one({"id": current_user.id})
            if not verify_password(current_password, user.get("password", "")):
                raise HTTPException(status_code=400, detail="Current password is incorrect")
            
            # Hash new password
            hashed_password = hash_password(new_password)
            
            # Update password
            await db.users.update_one(
                {"id": current_user.id},
                {"$set": {
                    "password": hashed_password,
                    "password_changed_at": datetime.utcnow()
                }}
            )
            
            # Revoke all other sessions for security
            await db.user_sessions.delete_many({
                "user_id": current_user.id,
                "id": {"$ne": getattr(current_user, 'session_id', None)}
            })
            
            # Log security event
            await log_security_event(
                user_id=current_user.id,
                event_type="password_changed",
                ip_address="unknown",
                user_agent="unknown",
                details={"forced_session_logout": True}
            )
            
            # Send security notification
            await email_service.send_security_notification(
                current_user.email,
                current_user.full_name,
                "Password Changed",
                "Your account password has been successfully changed. All other sessions have been logged out for security."
            )
            
            return {"success": True, "message": "Password changed successfully"}
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Change password error: {e}")
            raise HTTPException(status_code=500, detail="Failed to change password")
    
    @security_router.get("/security-settings")
    async def get_security_settings(current_user = Depends(get_current_user)):
        """Get user's current security settings"""
        try:
            user = await db.users.find_one({"id": current_user.id})
            
            return {
                "two_factor_enabled": user.get("two_factor_enabled", False),
                "password_last_changed": user.get("password_changed_at"),
                "account_created": user.get("created_at"),
                "login_notifications": user.get("login_notifications", True),
                "security_alerts": user.get("security_alerts", True),
                "session_timeout": user.get("session_timeout", 30),  # days
                "backup_codes_remaining": len(user.get("backup_codes", [])),
                "recent_login_attempts": await get_recent_login_attempts(current_user.id)
            }
            
        except Exception as e:
            logger.error(f"Security settings error: {e}")
            raise HTTPException(status_code=500, detail="Failed to fetch security settings")
    
    async def log_security_event(user_id: str, event_type: str, ip_address: str, user_agent: str, details: Dict = None):
        """Log security event to audit trail"""
        try:
            event = {
                "id": secrets.token_urlsafe(32),
                "user_id": user_id,
                "event_type": event_type,
                "created_at": datetime.utcnow(),
                "ip_address": ip_address,
                "user_agent": user_agent,
                "details": details or {},
                "success": True
            }
            
            await db.security_events.insert_one(event)
            
        except Exception as e:
            logger.error(f"Failed to log security event: {e}")
    
    def generate_backup_codes(count: int = 10) -> List[str]:
        """Generate backup codes for 2FA recovery"""
        return [secrets.token_hex(4).upper() for _ in range(count)]
    
    def is_strong_password(password: str) -> bool:
        """Validate password strength"""
        if len(password) < 8:
            return False
        
        has_upper = any(c.isupper() for c in password)
        has_lower = any(c.islower() for c in password)
        has_digit = any(c.isdigit() for c in password)
        has_special = any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in password)
        
        return has_upper and has_lower and has_digit and has_special
    
    def hash_password(password: str) -> str:
        """Hash password with salt (simplified - use proper hashing in production)"""
        salt = secrets.token_hex(32)
        pwdhash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
        return salt + pwdhash.hex()
    
    def verify_password(password: str, stored_hash: str) -> bool:
        """Verify password against stored hash"""
        if len(stored_hash) < 64:
            return False
        
        salt = stored_hash[:64]
        stored_pwdhash = stored_hash[64:]
        pwdhash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
        return pwdhash.hex() == stored_pwdhash
    
    async def get_recent_login_attempts(user_id: str, days: int = 7) -> List[Dict]:
        """Get recent login attempts for user"""
        try:
            start_date = datetime.utcnow() - timedelta(days=days)
            attempts = await db.security_events.find({
                "user_id": user_id,
                "event_type": {"$in": ["login_success", "login_failed"]},
                "created_at": {"$gte": start_date}
            }).sort("created_at", -1).limit(10).to_list(length=10)
            
            return [
                {
                    "timestamp": attempt.get("created_at"),
                    "success": attempt.get("event_type") == "login_success",
                    "ip_address": attempt.get("ip_address"),
                    "location": attempt.get("location", "Unknown")
                }
                for attempt in attempts
            ]
        except Exception:
            return []
    
    return security_router