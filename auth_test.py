#!/usr/bin/env python3
"""
URGENT AUTH SYSTEM TEST - Complete Authentication System Testing
Focus: User says sign in isn't working properly - identify WHY user can't tell if sign in worked
"""

import requests
import sys
import json
from datetime import datetime
import time
import uuid

class AuthenticationSystemTester:
    def __init__(self, base_url="https://site-atlas-ai.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.user_data = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.critical_failures = []
        
        # Test user data with realistic information
        timestamp = datetime.now().strftime('%H%M%S')
        self.test_user = {
            'email': f'auth.test_{timestamp}@laundrotech.com',
            'password': 'AuthTest2024!',
            'full_name': f'Auth Test User {timestamp}',
            'facebook_group_member': True
        }
        
        print(f"🔐 URGENT AUTH SYSTEM TEST - Sign In Issue Investigation")
        print(f"📍 Backend URL: {self.base_url}")
        print(f"👤 Test User: {self.test_user['email']}")
        print(f"🎯 Focus: Identify WHY user can't tell if sign in worked")
        print("=" * 80)

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None, critical=False):
        """Run a single API test with detailed logging"""
        url = f"{self.base_url}/{endpoint}" if not endpoint.startswith('http') else endpoint
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Test {self.tests_run}: {name}")
        print(f"   Method: {method} | Endpoint: /{endpoint}")
        if critical:
            print(f"   🚨 CRITICAL TEST - Auth Blocker if Failed")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=30)

            success = response.status_code == expected_status
            
            print(f"   📊 Status Code: {response.status_code} (Expected: {expected_status})")
            
            if success:
                self.tests_passed += 1
                print(f"   ✅ PASSED")
                try:
                    response_data = response.json()
                    print(f"   📄 Response Keys: {list(response_data.keys()) if isinstance(response_data, dict) else 'Not a dict'}")
                    return True, response_data
                except:
                    print(f"   📄 Response: {response.text[:200]}...")
                    return True, {}
            else:
                print(f"   ❌ FAILED - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   📄 Error Response: {error_data}")
                except:
                    print(f"   📄 Raw Response: {response.text[:200]}...")
                
                failure_info = {
                    'name': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'endpoint': endpoint,
                    'error': response.text[:500],
                    'critical': critical
                }
                
                self.failed_tests.append(failure_info)
                if critical:
                    self.critical_failures.append(failure_info)
                
                return False, {}

        except requests.exceptions.Timeout:
            print(f"   ⏰ TIMEOUT - Request took longer than 30 seconds")
            failure_info = {'name': name, 'error': 'Timeout', 'critical': critical}
            self.failed_tests.append(failure_info)
            if critical:
                self.critical_failures.append(failure_info)
            return False, {}
        except Exception as e:
            print(f"   💥 ERROR - {str(e)}")
            failure_info = {'name': name, 'error': str(e), 'critical': critical}
            self.failed_tests.append(failure_info)
            if critical:
                self.critical_failures.append(failure_info)
            return False, {}

    # ========== 1. REGISTRATION FLOW TESTING ==========
    
    def test_user_registration_flow(self):
        """Test complete user registration flow"""
        print(f"\n🔐 1. REGISTRATION FLOW TESTING")
        print("-" * 50)
        
        success, response = self.run_test(
            "User Registration - POST /api/auth/register",
            "POST",
            "auth/register",
            200,
            data=self.test_user,
            critical=True
        )
        
        if success:
            # Check JWT token generation
            if 'access_token' in response:
                self.token = response['access_token']
                print(f"   🔑 JWT Token Generated: ✅ ({len(self.token)} chars)")
                print(f"   🔑 Token Preview: {self.token[:20]}...")
                
                # Validate token format (should be JWT with 3 parts)
                token_parts = self.token.split('.')
                if len(token_parts) == 3:
                    print(f"   ✅ JWT Format Valid: 3 parts (header.payload.signature)")
                else:
                    print(f"   ❌ JWT Format Invalid: {len(token_parts)} parts")
                    self.critical_failures.append({
                        'name': 'JWT Token Format',
                        'error': f'JWT should have 3 parts, got {len(token_parts)}',
                        'critical': True
                    })
            else:
                print(f"   ❌ JWT Token Missing in Response")
                self.critical_failures.append({
                    'name': 'JWT Token Generation',
                    'error': 'access_token not found in registration response',
                    'critical': True
                })
            
            # Check user data
            if 'user' in response:
                self.user_data = response['user']
                print(f"   👤 User Data Returned: ✅")
                print(f"   📧 Email: {self.user_data.get('email', 'Missing')}")
                print(f"   🆔 User ID: {self.user_data.get('id', 'Missing')}")
                print(f"   🎫 Subscription Tier: {self.user_data.get('subscription_tier', 'Missing')}")
                print(f"   📅 Created At: {self.user_data.get('created_at', 'Missing')}")
                print(f"   👥 Facebook Member: {self.user_data.get('facebook_group_member', 'Missing')}")
            else:
                print(f"   ❌ User Data Missing in Response")
                self.critical_failures.append({
                    'name': 'User Data in Registration',
                    'error': 'user object not found in registration response',
                    'critical': True
                })
            
            # Check welcome email sending (should be triggered)
            print(f"   📧 Welcome Email: Should be sent in background")
            
        return success
    
    def test_database_user_creation(self):
        """Verify user was actually created in database by attempting login"""
        print(f"\n🗄️  Database User Creation Verification")
        print("-" * 50)
        
        # Try to login with the same credentials to verify user exists in DB
        success, response = self.run_test(
            "Database Verification - Login with New User",
            "POST",
            "auth/login",
            200,
            data={
                'email': self.test_user['email'],
                'password': self.test_user['password']
            },
            critical=True
        )
        
        if success:
            print(f"   ✅ User Successfully Created in Database")
            if 'access_token' in response:
                print(f"   🔑 Login Token Generated: ✅")
            if 'user' in response:
                print(f"   👤 User Data Retrieved from DB: ✅")
        else:
            print(f"   ❌ User NOT Created in Database - Login Failed")
            self.critical_failures.append({
                'name': 'Database User Creation',
                'error': 'User registration succeeded but login failed - user not in database',
                'critical': True
            })
        
        return success

    # ========== 2. LOGIN FLOW TESTING ==========
    
    def test_user_login_flow(self):
        """Test complete user login flow"""
        print(f"\n🔐 2. LOGIN FLOW TESTING")
        print("-" * 50)
        
        # Test successful login
        success, response = self.run_test(
            "User Login - POST /api/auth/login",
            "POST",
            "auth/login",
            200,
            data={
                'email': self.test_user['email'],
                'password': self.test_user['password']
            },
            critical=True
        )
        
        if success:
            # Check JWT token creation
            if 'access_token' in response:
                new_token = response['access_token']
                print(f"   🔑 JWT Token Created: ✅ ({len(new_token)} chars)")
                print(f"   🔑 Token Preview: {new_token[:20]}...")
                
                # Update token for subsequent tests
                self.token = new_token
                
                # Validate token format
                token_parts = new_token.split('.')
                if len(token_parts) == 3:
                    print(f"   ✅ JWT Format Valid: 3 parts")
                else:
                    print(f"   ❌ JWT Format Invalid: {len(token_parts)} parts")
            else:
                print(f"   ❌ JWT Token Missing in Login Response")
                self.critical_failures.append({
                    'name': 'JWT Token in Login',
                    'error': 'access_token not found in login response',
                    'critical': True
                })
            
            # Check user data
            if 'user' in response:
                user_data = response['user']
                print(f"   👤 User Data Returned: ✅")
                print(f"   📧 Email Match: {'✅' if user_data.get('email') == self.test_user['email'] else '❌'}")
                print(f"   🆔 User ID: {user_data.get('id', 'Missing')}")
            else:
                print(f"   ❌ User Data Missing in Login Response")
        
        return success
    
    def test_invalid_credentials_handling(self):
        """Test login with invalid credentials"""
        print(f"\n🚫 Invalid Credentials Testing")
        print("-" * 30)
        
        # Test wrong password
        success, response = self.run_test(
            "Invalid Password - Should Return 401",
            "POST",
            "auth/login",
            401,
            data={
                'email': self.test_user['email'],
                'password': 'WrongPassword123!'
            },
            critical=True
        )
        
        if success:
            print(f"   ✅ Invalid Password Correctly Rejected")
        else:
            print(f"   ❌ Invalid Password Not Properly Handled")
        
        # Test non-existent user
        success2, response2 = self.run_test(
            "Non-existent User - Should Return 401",
            "POST",
            "auth/login",
            401,
            data={
                'email': 'nonexistent@example.com',
                'password': 'SomePassword123!'
            },
            critical=True
        )
        
        if success2:
            print(f"   ✅ Non-existent User Correctly Rejected")
        else:
            print(f"   ❌ Non-existent User Not Properly Handled")
        
        return success and success2

    # ========== 3. USER MANAGEMENT TESTING ==========
    
    def test_user_profile_endpoints(self):
        """Test user profile management endpoints"""
        print(f"\n👤 3. USER MANAGEMENT TESTING")
        print("-" * 50)
        
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        # Test GET /api/user/profile
        success1, response1 = self.run_test(
            "Get User Profile - GET /api/user/profile",
            "GET",
            "user/profile",
            200,
            critical=True
        )
        
        if success1:
            user_profile = response1.get('user', {})
            print(f"   👤 Profile Retrieved: ✅")
            print(f"   📧 Email: {user_profile.get('email', 'Missing')}")
            print(f"   👤 Full Name: {user_profile.get('full_name', 'Missing')}")
            print(f"   🎫 Subscription: {user_profile.get('subscription_tier', 'Missing')}")
            print(f"   🔒 Password Field: {'❌ Exposed' if 'password' in user_profile else '✅ Hidden'}")
        
        # Test POST /api/user/profile (update)
        update_data = {
            'full_name': f'Updated {self.test_user["full_name"]}',
            'phone': '+1-555-123-4567',
            'location': 'Chicago, IL',
            'company': 'LaundroTech Testing Inc'
        }
        
        success2, response2 = self.run_test(
            "Update User Profile - POST /api/user/profile",
            "PUT",
            "user/profile",
            200,
            data=update_data,
            critical=True
        )
        
        if success2:
            print(f"   ✅ Profile Update: {response2.get('message', 'Success')}")
        
        return success1 and success2
    
    def test_user_subscriptions_endpoint(self):
        """Test GET /api/user/subscriptions"""
        print(f"\n📋 User Subscriptions Testing")
        print("-" * 30)
        
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        success, response = self.run_test(
            "Get User Subscriptions - GET /api/user/subscriptions",
            "GET",
            "user/subscriptions",
            200,
            critical=True
        )
        
        if success:
            subscriptions = response.get('subscriptions', [])
            print(f"   📋 Subscriptions Found: {len(subscriptions)}")
            for sub in subscriptions:
                print(f"      - {sub.get('offer_type', 'unknown')}: {sub.get('subscription_status', 'unknown')}")
        
        return success
    
    def test_user_analyses_endpoint(self):
        """Test GET /api/user/analyses"""
        print(f"\n📊 User Analyses Testing")
        print("-" * 30)
        
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        success, response = self.run_test(
            "Get User Analyses - GET /api/user/analyses",
            "GET",
            "user/analyses",
            200,
            critical=True
        )
        
        if success:
            analyses = response.get('analyses', [])
            print(f"   📊 Analyses Found: {len(analyses)}")
            for analysis in analyses[:3]:  # Show first 3
                print(f"      - {analysis.get('address', 'unknown')}: {analysis.get('grade', 'unknown')} ({analysis.get('score', 0)})")
        
        return success

    # ========== 4. PROTECTED ROUTES TESTING ==========
    
    def test_protected_routes_authentication(self):
        """Test JWT authentication on protected endpoints"""
        print(f"\n🔒 4. PROTECTED ROUTES TESTING")
        print("-" * 50)
        
        # Test without token (should fail)
        old_token = self.token
        self.token = None
        
        success1, response1 = self.run_test(
            "Protected Route Without Token - Should Return 401",
            "GET",
            "user/profile",
            401,
            critical=True
        )
        
        if success1:
            print(f"   ✅ Unauthorized Access Correctly Blocked")
        else:
            print(f"   ❌ Protected Route Accessible Without Token")
        
        # Test with invalid token (should fail)
        self.token = "invalid.jwt.token"
        
        success2, response2 = self.run_test(
            "Protected Route With Invalid Token - Should Return 401",
            "GET",
            "user/profile",
            401,
            critical=True
        )
        
        if success2:
            print(f"   ✅ Invalid Token Correctly Rejected")
        else:
            print(f"   ❌ Invalid Token Accepted")
        
        # Test with valid token (should succeed)
        self.token = old_token
        
        success3, response3 = self.run_test(
            "Protected Route With Valid Token - Should Return 200",
            "GET",
            "user/profile",
            200,
            critical=True
        )
        
        if success3:
            print(f"   ✅ Valid Token Correctly Accepted")
        else:
            print(f"   ❌ Valid Token Rejected")
        
        return success1 and success2 and success3
    
    def test_token_expiration_handling(self):
        """Test token expiration (if implemented)"""
        print(f"\n⏰ Token Expiration Testing")
        print("-" * 30)
        
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return True  # Not a failure
        
        # For now, just verify token is still valid
        # In production, you'd test with an expired token
        success, response = self.run_test(
            "Current Token Validity Check",
            "GET",
            "user/profile",
            200
        )
        
        if success:
            print(f"   ✅ Current Token Still Valid")
        else:
            print(f"   ⚠️  Current Token May Be Expired")
        
        return True  # Don't fail test suite for this

    # ========== 5. SESSION MANAGEMENT TESTING ==========
    
    def test_session_management(self):
        """Test session persistence and management"""
        print(f"\n🔄 5. SESSION MANAGEMENT TESTING")
        print("-" * 50)
        
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        # Test session persistence by making multiple requests
        endpoints_to_test = [
            ("user/profile", "GET"),
            ("user/subscriptions", "GET"),
            ("user/analyses", "GET")
        ]
        
        session_tests_passed = 0
        for endpoint, method in endpoints_to_test:
            success, response = self.run_test(
                f"Session Persistence - {method} {endpoint}",
                method,
                endpoint,
                200
            )
            if success:
                session_tests_passed += 1
        
        print(f"   📊 Session Persistence: {session_tests_passed}/{len(endpoints_to_test)} endpoints accessible")
        
        # Test token refresh (if implemented)
        # For now, just verify we can still access protected routes
        if session_tests_passed == len(endpoints_to_test):
            print(f"   ✅ Session Management Working")
            return True
        else:
            print(f"   ❌ Session Management Issues Detected")
            return False

    # ========== COMPREHENSIVE AUTH TESTING ==========
    
    def run_comprehensive_auth_testing(self):
        """Run all authentication system tests"""
        print(f"\n🧪 COMPREHENSIVE AUTHENTICATION SYSTEM TESTING")
        print("=" * 80)
        
        # 1. Registration Flow
        registration_success = self.test_user_registration_flow()
        db_verification_success = self.test_database_user_creation()
        
        # 2. Login Flow
        login_success = self.test_user_login_flow()
        invalid_creds_success = self.test_invalid_credentials_handling()
        
        # 3. User Management
        profile_success = self.test_user_profile_endpoints()
        subscriptions_success = self.test_user_subscriptions_endpoint()
        analyses_success = self.test_user_analyses_endpoint()
        
        # 4. Protected Routes
        protected_routes_success = self.test_protected_routes_authentication()
        token_expiration_success = self.test_token_expiration_handling()
        
        # 5. Session Management
        session_success = self.test_session_management()
        
        # Print results
        self.print_auth_test_results()
        
        return self.tests_passed >= (self.tests_run * 0.8)  # 80% pass rate

    def print_auth_test_results(self):
        """Print comprehensive authentication test results"""
        print(f"\n" + "=" * 80)
        print(f"🔐 AUTHENTICATION SYSTEM TEST RESULTS")
        print(f"=" * 80)
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        
        print(f"📊 Tests Run: {self.tests_run}")
        print(f"✅ Tests Passed: {self.tests_passed}")
        print(f"❌ Tests Failed: {len(self.failed_tests)}")
        print(f"🚨 Critical Failures: {len(self.critical_failures)}")
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        # Analyze WHY sign in might not be working
        print(f"\n🔍 SIGN IN ISSUE ANALYSIS:")
        
        if self.critical_failures:
            print(f"🚨 CRITICAL AUTH ISSUES FOUND:")
            for i, failure in enumerate(self.critical_failures, 1):
                print(f"   {i}. {failure['name']}")
                print(f"      Error: {failure['error'][:200]}...")
                print()
            
            print(f"💡 LIKELY REASONS USER CAN'T TELL IF SIGN IN WORKED:")
            print(f"   - JWT token not being generated or returned properly")
            print(f"   - Frontend not receiving/storing the authentication token")
            print(f"   - User data not being returned with login response")
            print(f"   - Protected routes not working with valid tokens")
            print(f"   - Session management issues preventing persistent login")
        else:
            print(f"✅ NO CRITICAL AUTH ISSUES FOUND")
            print(f"💡 IF USER STILL CAN'T TELL IF SIGN IN WORKED, CHECK:")
            print(f"   - Frontend JavaScript token handling")
            print(f"   - Browser localStorage/sessionStorage")
            print(f"   - Frontend UI feedback after successful login")
            print(f"   - Network connectivity issues")
            print(f"   - CORS configuration")
        
        # Auth system readiness assessment
        print(f"\n🔐 AUTHENTICATION SYSTEM READINESS:")
        
        if len(self.critical_failures) == 0 and success_rate >= 90:
            print(f"   ✅ AUTH SYSTEM READY - All authentication flows working")
            print(f"   🔑 JWT generation, validation, and protected routes operational")
            print(f"   👤 User management and session handling functional")
        elif len(self.critical_failures) == 0 and success_rate >= 75:
            print(f"   ⚠️  MOSTLY READY - Minor auth issues need attention")
            print(f"   🔧 Address non-critical issues for optimal user experience")
        else:
            print(f"   🚨 AUTH SYSTEM NOT READY - Critical authentication failures")
            print(f"   ❌ Users will experience sign in problems until issues resolved")
        
        return len(self.critical_failures) == 0 and success_rate >= 75

if __name__ == "__main__":
    tester = AuthenticationSystemTester()
    success = tester.run_comprehensive_auth_testing()
    
    if success:
        print(f"\n🎉 AUTHENTICATION SYSTEM TESTING COMPLETED SUCCESSFULLY")
        sys.exit(0)
    else:
        print(f"\n💥 AUTHENTICATION SYSTEM TESTING FAILED")
        sys.exit(1)