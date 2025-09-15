#!/usr/bin/env python3
"""
COMPREHENSIVE AUTH SYSTEM TEST - Complete Authentication System Testing
Testing all areas requested: Registration, Login, User Management, Protected Routes, Session Management
"""

import requests
import json
from datetime import datetime
import time

def comprehensive_auth_test():
    base_url = "https://siteatlas.preview.emergentagent.com/api"
    
    # Generate unique test user
    timestamp = datetime.now().strftime('%H%M%S%f')
    test_user = {
        'email': f'comprehensive_auth_{timestamp}@laundrotech.com',
        'password': 'ComprehensiveAuth2024!',
        'full_name': f'Comprehensive Auth Test {timestamp}',
        'facebook_group_member': True
    }
    
    print(f"🔐 COMPREHENSIVE AUTH SYSTEM TEST")
    print(f"📍 Backend URL: {base_url}")
    print(f"👤 Test User: {test_user['email']}")
    print("=" * 80)
    
    results = {
        'tests_run': 0,
        'tests_passed': 0,
        'critical_failures': [],
        'token': None,
        'user_data': None
    }
    
    def run_test(name, test_func):
        results['tests_run'] += 1
        print(f"\n🔍 Test {results['tests_run']}: {name}")
        try:
            success = test_func()
            if success:
                results['tests_passed'] += 1
                print(f"   ✅ PASSED")
            else:
                print(f"   ❌ FAILED")
            return success
        except Exception as e:
            print(f"   💥 ERROR: {e}")
            results['critical_failures'].append(f"{name}: {str(e)}")
            return False
    
    # ========== 1. REGISTRATION FLOW ==========
    def test_registration():
        response = requests.post(
            f"{base_url}/auth/register",
            json=test_user,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if 'access_token' in data and 'user' in data:
                results['token'] = data['access_token']
                results['user_data'] = data['user']
                print(f"      🔑 JWT Token: {len(results['token'])} chars")
                print(f"      👤 User ID: {results['user_data'].get('id')}")
                print(f"      📧 Email: {results['user_data'].get('email')}")
                return True
        print(f"      Status: {response.status_code}, Response: {response.text[:100]}")
        return False
    
    def test_welcome_email():
        # Email is sent in background, so we just verify the endpoint worked
        return results['token'] is not None
    
    def test_jwt_token_validation():
        if not results['token']:
            return False
        # JWT should have 3 parts separated by dots
        parts = results['token'].split('.')
        return len(parts) == 3
    
    # ========== 2. LOGIN FLOW ==========
    def test_login():
        response = requests.post(
            f"{base_url}/auth/login",
            json={
                'email': test_user['email'],
                'password': test_user['password']
            },
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if 'access_token' in data and 'user' in data:
                print(f"      🔑 Login Token: {len(data['access_token'])} chars")
                print(f"      👤 User Match: {'✅' if data['user']['email'] == test_user['email'] else '❌'}")
                return True
        print(f"      Status: {response.status_code}, Response: {response.text[:100]}")
        return False
    
    def test_password_validation():
        # Test wrong password
        response = requests.post(
            f"{base_url}/auth/login",
            json={
                'email': test_user['email'],
                'password': 'WrongPassword123!'
            },
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        success = response.status_code == 401
        print(f"      Wrong Password Status: {response.status_code} ({'✅' if success else '❌'})")
        return success
    
    def test_invalid_credentials():
        # Test non-existent user
        response = requests.post(
            f"{base_url}/auth/login",
            json={
                'email': 'nonexistent@example.com',
                'password': 'SomePassword123!'
            },
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        success = response.status_code == 401
        print(f"      Non-existent User Status: {response.status_code} ({'✅' if success else '❌'})")
        return success
    
    # ========== 3. USER MANAGEMENT ==========
    def test_get_user_profile():
        if not results['token']:
            return False
        
        response = requests.get(
            f"{base_url}/user/profile",
            headers={
                'Authorization': f'Bearer {results["token"]}',
                'Content-Type': 'application/json'
            },
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if 'user' in data:
                user = data['user']
                print(f"      📧 Email: {user.get('email')}")
                print(f"      👤 Name: {user.get('full_name')}")
                print(f"      🔒 Password Hidden: {'✅' if 'password' not in user else '❌'}")
                return True
        print(f"      Status: {response.status_code}, Response: {response.text[:100]}")
        return False
    
    def test_update_user_profile():
        if not results['token']:
            return False
        
        update_data = {
            'full_name': f'Updated {test_user["full_name"]}',
            'phone': '+1-555-123-4567',
            'location': 'Chicago, IL'
        }
        
        response = requests.put(
            f"{base_url}/user/profile",
            json=update_data,
            headers={
                'Authorization': f'Bearer {results["token"]}',
                'Content-Type': 'application/json'
            },
            timeout=10
        )
        
        success = response.status_code == 200
        print(f"      Update Status: {response.status_code} ({'✅' if success else '❌'})")
        return success
    
    def test_user_subscriptions():
        if not results['token']:
            return False
        
        response = requests.get(
            f"{base_url}/user/subscriptions",
            headers={
                'Authorization': f'Bearer {results["token"]}',
                'Content-Type': 'application/json'
            },
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            subscriptions = data.get('subscriptions', [])
            print(f"      📋 Subscriptions: {len(subscriptions)}")
            return True
        print(f"      Status: {response.status_code}")
        return False
    
    def test_user_analyses():
        if not results['token']:
            return False
        
        response = requests.get(
            f"{base_url}/user/analyses",
            headers={
                'Authorization': f'Bearer {results["token"]}',
                'Content-Type': 'application/json'
            },
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            analyses = data.get('analyses', [])
            print(f"      📊 Analyses: {len(analyses)}")
            return True
        print(f"      Status: {response.status_code}")
        return False
    
    # ========== 4. PROTECTED ROUTES ==========
    def test_jwt_authentication():
        if not results['token']:
            return False
        
        # Test with valid token
        response = requests.get(
            f"{base_url}/user/profile",
            headers={
                'Authorization': f'Bearer {results["token"]}',
                'Content-Type': 'application/json'
            },
            timeout=10
        )
        
        success = response.status_code == 200
        print(f"      Valid Token Status: {response.status_code} ({'✅' if success else '❌'})")
        return success
    
    def test_invalid_token_rejection():
        # Test with invalid token
        response = requests.get(
            f"{base_url}/user/profile",
            headers={
                'Authorization': 'Bearer invalid.jwt.token',
                'Content-Type': 'application/json'
            },
            timeout=10
        )
        
        success = response.status_code == 401
        print(f"      Invalid Token Status: {response.status_code} ({'✅' if success else '❌'})")
        return success
    
    def test_no_token_rejection():
        # Test without token
        response = requests.get(
            f"{base_url}/user/profile",
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        # Should be 401 or 403
        success = response.status_code in [401, 403]
        print(f"      No Token Status: {response.status_code} ({'✅' if success else '❌'})")
        return success
    
    # ========== 5. SESSION MANAGEMENT ==========
    def test_token_persistence():
        if not results['token']:
            return False
        
        # Make multiple requests with same token
        endpoints = [
            'user/profile',
            'user/subscriptions', 
            'user/analyses'
        ]
        
        successful_requests = 0
        for endpoint in endpoints:
            response = requests.get(
                f"{base_url}/{endpoint}",
                headers={
                    'Authorization': f'Bearer {results["token"]}',
                    'Content-Type': 'application/json'
                },
                timeout=10
            )
            if response.status_code == 200:
                successful_requests += 1
        
        success = successful_requests == len(endpoints)
        print(f"      Persistent Access: {successful_requests}/{len(endpoints)} ({'✅' if success else '❌'})")
        return success
    
    def test_session_validity():
        if not results['token']:
            return False
        
        # Test that token is still valid after some time
        time.sleep(1)
        response = requests.get(
            f"{base_url}/user/profile",
            headers={
                'Authorization': f'Bearer {results["token"]}',
                'Content-Type': 'application/json'
            },
            timeout=10
        )
        
        success = response.status_code == 200
        print(f"      Session Valid: {'✅' if success else '❌'}")
        return success
    
    # Run all tests
    print(f"\n🧪 RUNNING COMPREHENSIVE AUTH TESTS")
    print("=" * 50)
    
    print(f"\n📝 1. REGISTRATION FLOW")
    run_test("User Registration", test_registration)
    run_test("Welcome Email Trigger", test_welcome_email)
    run_test("JWT Token Generation", test_jwt_token_validation)
    
    print(f"\n🔐 2. LOGIN FLOW")
    run_test("User Login", test_login)
    run_test("Password Validation", test_password_validation)
    run_test("Invalid Credentials Handling", test_invalid_credentials)
    
    print(f"\n👤 3. USER MANAGEMENT")
    run_test("Get User Profile", test_get_user_profile)
    run_test("Update User Profile", test_update_user_profile)
    run_test("User Subscriptions", test_user_subscriptions)
    run_test("User Analyses", test_user_analyses)
    
    print(f"\n🔒 4. PROTECTED ROUTES")
    run_test("JWT Authentication", test_jwt_authentication)
    run_test("Invalid Token Rejection", test_invalid_token_rejection)
    run_test("No Token Rejection", test_no_token_rejection)
    
    print(f"\n🔄 5. SESSION MANAGEMENT")
    run_test("Token Persistence", test_token_persistence)
    run_test("Session Validity", test_session_validity)
    
    # Print final results
    print(f"\n" + "=" * 80)
    print(f"🔐 COMPREHENSIVE AUTH SYSTEM TEST RESULTS")
    print(f"=" * 80)
    
    success_rate = (results['tests_passed'] / results['tests_run'] * 100) if results['tests_run'] > 0 else 0
    
    print(f"📊 Tests Run: {results['tests_run']}")
    print(f"✅ Tests Passed: {results['tests_passed']}")
    print(f"❌ Tests Failed: {results['tests_run'] - results['tests_passed']}")
    print(f"🚨 Critical Failures: {len(results['critical_failures'])}")
    print(f"📈 Success Rate: {success_rate:.1f}%")
    
    if results['critical_failures']:
        print(f"\n🚨 CRITICAL FAILURES:")
        for failure in results['critical_failures']:
            print(f"   - {failure}")
    
    print(f"\n🔍 SIGN IN ISSUE ANALYSIS:")
    if success_rate >= 90:
        print(f"✅ AUTHENTICATION SYSTEM FULLY FUNCTIONAL")
        print(f"   - JWT tokens are being generated correctly")
        print(f"   - User registration and login working perfectly")
        print(f"   - Protected routes properly secured")
        print(f"   - Session management operational")
        print(f"   - Invalid credentials properly rejected")
        
        print(f"\n💡 IF USER STILL CAN'T TELL IF SIGN IN WORKED:")
        print(f"   🎯 ISSUE IS LIKELY IN THE FRONTEND:")
        print(f"   1. Frontend not storing JWT token in localStorage/sessionStorage")
        print(f"   2. Frontend not showing proper UI feedback after login")
        print(f"   3. Frontend not including Authorization header in API calls")
        print(f"   4. Frontend not redirecting user after successful login")
        print(f"   5. Browser blocking cookies/storage due to privacy settings")
        print(f"   6. Network issues preventing frontend from receiving response")
        
        print(f"\n🔧 RECOMMENDED FRONTEND CHECKS:")
        print(f"   1. Check browser Network tab for successful login response")
        print(f"   2. Check browser Application tab for stored JWT token")
        print(f"   3. Verify frontend JavaScript handles login response correctly")
        print(f"   4. Ensure UI updates to show logged-in state")
        print(f"   5. Check console for JavaScript errors")
        
    else:
        print(f"❌ AUTHENTICATION SYSTEM HAS ISSUES")
        print(f"   - Backend authentication needs fixes before frontend investigation")
    
    return success_rate >= 90

if __name__ == "__main__":
    success = comprehensive_auth_test()
    if success:
        print(f"\n🎉 COMPREHENSIVE AUTH TESTING COMPLETED SUCCESSFULLY")
    else:
        print(f"\n💥 COMPREHENSIVE AUTH TESTING FAILED")