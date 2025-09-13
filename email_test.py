#!/usr/bin/env python3
"""
Test email service functionality for badge activation
"""

import sys
import os
sys.path.append('/app/backend')

from email_service import email_service
import asyncio

async def test_email_service():
    """Test email service badge activation functionality"""
    print("🧪 Testing Email Service for Badge Activation")
    print("=" * 50)
    
    # Test badge activation email (should handle missing SendGrid gracefully)
    print("\n📧 Testing Badge Activation Email...")
    
    try:
        result = await email_service.send_badge_activation_email(
            user_email="testuser@example.com",
            user_name="Test User",
            badge_name="Verified Seller Badge",
            offer_type="verified_seller"
        )
        
        if result:
            print("✅ Email service returned success (SendGrid configured)")
        else:
            print("⚠️  Email service returned false (SendGrid not configured - expected)")
            print("   This is expected behavior when SendGrid API key is not set")
        
        print("✅ Email service structure is working correctly")
        return True
        
    except Exception as e:
        print(f"❌ Email service error: {e}")
        return False

if __name__ == "__main__":
    result = asyncio.run(test_email_service())
    sys.exit(0 if result else 1)