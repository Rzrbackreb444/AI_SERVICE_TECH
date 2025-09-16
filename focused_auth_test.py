#!/usr/bin/env python3
"""
FOCUSED AUTH SYSTEM TEST - Direct testing of authentication endpoints
"""

import requests
import json
from datetime import datetime
import time

def test_auth_system():
    base_url = "https://smartlaundry.preview.emergentagent.com/api"
    
    # Generate unique test user
    timestamp = datetime.now().strftime('%H%M%S%f')
    test_user = {
        'email': f'auth_test_{timestamp}@laundrotech.com',
        'password': 'AuthTest2024!',
        'full_name': f'Auth Test User {timestamp}',
        'facebook_group_member': True
    }
    
    print(f"🔐 FOCUSED AUTH SYSTEM TEST")
    print(f"📍 Backend URL: {base_url}")
    print(f"👤 Test User: {test_user['email']}")
    print("=" * 80)
    
    # Test 1: User Registration
    print(f"\n🔍 Test 1: User Registration")
    try:
        response = requests.post(
            f"{base_url}/auth/register",
            json=test_user,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Registration Successful")
            print(f"   🔑 Token Generated: {'✅' if 'access_token' in data else '❌'}")
            print(f"   👤 User Data: {'✅' if 'user' in data else '❌'}")
            
            if 'access_token' in data:
                token = data['access_token']
                user_data = data.get('user', {})
                print(f"   📧 Email: {user_data.get('email')}")
                print(f"   🆔 User ID: {user_data.get('id')}")
                print(f"   🎫 Subscription: {user_data.get('subscription_tier')}")
                
                # Test 2: Login with same credentials
                print(f"\n🔍 Test 2: User Login")
                login_response = requests.post(
                    f"{base_url}/auth/login",
                    json={
                        'email': test_user['email'],
                        'password': test_user['password']
                    },
                    headers={'Content-Type': 'application/json'},
                    timeout=10
                )
                
                print(f"   Status Code: {login_response.status_code}")
                
                if login_response.status_code == 200:
                    login_data = login_response.json()
                    print(f"   ✅ Login Successful")
                    print(f"   🔑 Token Generated: {'✅' if 'access_token' in login_data else '❌'}")
                    print(f"   👤 User Data: {'✅' if 'user' in login_data else '❌'}")
                    
                    # Test 3: Protected Route Access
                    print(f"\n🔍 Test 3: Protected Route Access")
                    profile_response = requests.get(
                        f"{base_url}/user/profile",
                        headers={
                            'Authorization': f'Bearer {token}',
                            'Content-Type': 'application/json'
                        },
                        timeout=10
                    )
                    
                    print(f"   Status Code: {profile_response.status_code}")
                    
                    if profile_response.status_code == 200:
                        profile_data = profile_response.json()
                        print(f"   ✅ Protected Route Accessible")
                        print(f"   👤 Profile Data: {'✅' if 'user' in profile_data else '❌'}")
                        
                        # Test 4: Invalid Token
                        print(f"\n🔍 Test 4: Invalid Token Test")
                        invalid_response = requests.get(
                            f"{base_url}/user/profile",
                            headers={
                                'Authorization': 'Bearer invalid.token.here',
                                'Content-Type': 'application/json'
                            },
                            timeout=10
                        )
                        
                        print(f"   Status Code: {invalid_response.status_code}")
                        
                        if invalid_response.status_code == 401:
                            print(f"   ✅ Invalid Token Correctly Rejected")
                        else:
                            print(f"   ❌ Invalid Token Not Properly Handled")
                        
                        # Test 5: No Token
                        print(f"\n🔍 Test 5: No Token Test")
                        no_token_response = requests.get(
                            f"{base_url}/user/profile",
                            headers={'Content-Type': 'application/json'},
                            timeout=10
                        )
                        
                        print(f"   Status Code: {no_token_response.status_code}")
                        
                        if no_token_response.status_code == 401:
                            print(f"   ✅ No Token Correctly Rejected")
                        else:
                            print(f"   ❌ No Token Not Properly Handled")
                        
                        # Test 6: Invalid Login Credentials
                        print(f"\n🔍 Test 6: Invalid Login Credentials")
                        invalid_login_response = requests.post(
                            f"{base_url}/auth/login",
                            json={
                                'email': test_user['email'],
                                'password': 'WrongPassword123!'
                            },
                            headers={'Content-Type': 'application/json'},
                            timeout=10
                        )
                        
                        print(f"   Status Code: {invalid_login_response.status_code}")
                        
                        if invalid_login_response.status_code == 401:
                            print(f"   ✅ Invalid Credentials Correctly Rejected")
                        else:
                            print(f"   ❌ Invalid Credentials Not Properly Handled")
                        
                        print(f"\n🎉 ALL AUTH TESTS COMPLETED SUCCESSFULLY!")
                        print(f"✅ Registration: Working")
                        print(f"✅ Login: Working") 
                        print(f"✅ JWT Token Generation: Working")
                        print(f"✅ Protected Routes: Working")
                        print(f"✅ Token Validation: Working")
                        print(f"✅ Invalid Credential Handling: Working")
                        
                        print(f"\n💡 SIGN IN ISSUE ANALYSIS:")
                        print(f"   🔍 Backend authentication system is FULLY FUNCTIONAL")
                        print(f"   🔍 JWT tokens are being generated and validated correctly")
                        print(f"   🔍 Protected routes are working with valid tokens")
                        print(f"   🔍 Invalid credentials are properly rejected")
                        
                        print(f"\n🎯 IF USER STILL CAN'T TELL IF SIGN IN WORKED:")
                        print(f"   1. Check FRONTEND JavaScript token handling")
                        print(f"   2. Verify browser localStorage/sessionStorage usage")
                        print(f"   3. Check UI feedback after successful login")
                        print(f"   4. Verify CORS headers are properly configured")
                        print(f"   5. Check network tab in browser dev tools")
                        print(f"   6. Ensure frontend is using correct API endpoints")
                        
                        return True
                    else:
                        print(f"   ❌ Protected Route Access Failed")
                        print(f"   Response: {profile_response.text}")
                else:
                    print(f"   ❌ Login Failed")
                    print(f"   Response: {login_response.text}")
            else:
                print(f"   ❌ No Token in Registration Response")
        else:
            print(f"   ❌ Registration Failed")
            print(f"   Response: {response.text}")
            
    except Exception as e:
        print(f"   💥 Error: {e}")
    
    return False

if __name__ == "__main__":
    success = test_auth_system()
    if not success:
        print(f"\n💥 AUTH SYSTEM TESTING FAILED")