#!/usr/bin/env python3
"""
STRIPE FOCUSED TEST - Verify API Key Issue and Test Webhook
"""

import requests
import json
import sys

def test_stripe_issue():
    base_url = "https://washnanalytics.preview.emergentagent.com/api"
    
    print("🔥 STRIPE INTEGRATION ISSUE DIAGNOSIS")
    print("=" * 60)
    
    # First, register a test user
    print("\n1. Creating test user...")
    test_user = {
        'email': 'stripe.diagnosis@test.com',
        'password': 'TestPass123!',
        'full_name': 'Stripe Test User',
        'facebook_group_member': True
    }
    
    try:
        response = requests.post(f"{base_url}/auth/register", json=test_user, timeout=10)
        if response.status_code == 200:
            token = response.json().get('access_token')
            print(f"✅ User created successfully")
            print(f"🔑 Token: {token[:20]}...")
        else:
            print(f"❌ User creation failed: {response.status_code}")
            print(f"Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ User creation error: {e}")
        return False
    
    # Test Stripe checkout creation to confirm API key issue
    print("\n2. Testing Stripe checkout creation...")
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    checkout_data = {
        'offer_type': 'verified_seller',
        'platform': 'facebook_group',
        'payment_method': 'stripe'
    }
    
    try:
        response = requests.post(f"{base_url}/payments/checkout", json=checkout_data, headers=headers, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Stripe checkout created successfully!")
            print(f"🔗 Checkout URL: {result.get('checkout_url', 'N/A')}")
            print(f"🆔 Session ID: {result.get('session_id', 'N/A')}")
            print(f"💰 Amount: ${result.get('amount', 0)}")
            return True
        else:
            print(f"❌ Stripe checkout failed")
            try:
                error_data = response.json()
                print(f"Error details: {json.dumps(error_data, indent=2)}")
            except:
                print(f"Raw error: {response.text}")
            
            # Check if it's the expired API key issue
            if "expired" in response.text.lower() or "api key" in response.text.lower():
                print(f"\n🚨 CONFIRMED: Stripe API key is expired!")
                print(f"🔧 SOLUTION: Update STRIPE_API_KEY in /app/backend/.env with a valid secret key (sk_live_...)")
                return False
            
    except Exception as e:
        print(f"❌ Stripe checkout error: {e}")
        return False
    
    # Test webhook endpoint
    print("\n3. Testing Stripe webhook endpoint...")
    webhook_payload = {
        "type": "checkout.session.completed",
        "data": {
            "object": {
                "id": "cs_test_webhook_12345",
                "payment_status": "paid",
                "amount_total": 2900,
                "currency": "usd",
                "metadata": {
                    "user_id": "test_user_id",
                    "offer_type": "verified_seller",
                    "platform": "facebook_group"
                }
            }
        }
    }
    
    try:
        response = requests.post(f"{base_url}/webhook/stripe", json=webhook_payload, timeout=10)
        print(f"Webhook Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print(f"✅ Stripe webhook endpoint is working!")
            result = response.json()
            print(f"Response: {result}")
            return True
        else:
            print(f"❌ Stripe webhook failed")
            print(f"Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Webhook test error: {e}")
        return False

def main():
    success = test_stripe_issue()
    
    print(f"\n" + "=" * 60)
    print(f"🎯 STRIPE DIAGNOSIS SUMMARY")
    print(f"=" * 60)
    
    if success:
        print(f"✅ Stripe integration is working correctly!")
        print(f"🚀 The new API key is functional")
    else:
        print(f"❌ Stripe integration has issues")
        print(f"🔧 Most likely cause: Expired API key in .env file")
        print(f"💡 Check backend logs for 'Expired API Key' error")
        print(f"🛠️  Update STRIPE_API_KEY with valid sk_live_ key")
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())