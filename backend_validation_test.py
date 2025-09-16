#!/usr/bin/env python3
"""
BACKEND VALIDATION POST-IMPROVEMENTS
Testing the specific areas mentioned in the review request:
1. Analytics Engine Validation with newly populated data
2. Data Integration Verification 
3. Enhanced AI Consultant System
4. Authentication & Security
5. Quick MRR Dashboard Test
"""

import requests
import sys
import json
from datetime import datetime
import time
import uuid

class BackendValidationTester:
    def __init__(self, base_url="https://washnanalytics.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.user_data = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.critical_failures = []
        self.zero_value_sections = []
        
        # Test user data
        timestamp = datetime.now().strftime('%H%M%S')
        self.test_user = {
            'email': f'validation.tester_{timestamp}@laundrotech.com',
            'password': 'ValidationTest2024!',
            'full_name': f'Validation Tester {timestamp}',
            'facebook_group_member': True
        }
        
        print(f"🔍 BACKEND VALIDATION POST-IMPROVEMENTS")
        print(f"📍 Backend URL: {self.base_url}")
        print(f"👤 Test User: {self.test_user['email']}")
        print(f"🎯 Focus: Analytics, AI Consultant, Auth, MRR Dashboard")
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
            print(f"   🚨 CRITICAL TEST")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=30)

            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                print(f"   ✅ PASSED - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, dict) and len(str(response_data)) <= 300:
                        print(f"   📄 Response: {json.dumps(response_data, indent=2)[:200]}...")
                except:
                    pass
            else:
                print(f"   ❌ FAILED - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   📄 Error: {error_data}")
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

            return success, response.json() if response.content else {}

        except Exception as e:
            print(f"   💥 ERROR - {str(e)}")
            failure_info = {'name': name, 'error': str(e), 'critical': critical}
            self.failed_tests.append(failure_info)
            if critical:
                self.critical_failures.append(failure_info)
            return False, {}

    def setup_authentication(self):
        """Setup authentication for testing"""
        print(f"\n🔐 AUTHENTICATION SETUP")
        print("-" * 50)
        
        # Register test user
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data=self.test_user,
            critical=True
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.user_data = response.get('user', {})
            print(f"   🔑 Token acquired: {self.token[:20]}...")
            print(f"   👤 User ID: {self.user_data.get('id', 'Unknown')}")
            return True
        
        return False

    def test_authentication_security(self):
        """Test Authentication & Security - Focus on dashboard stats endpoint vulnerability"""
        print(f"\n🔒 AUTHENTICATION & SECURITY VALIDATION")
        print("-" * 50)
        
        # Test 1: Dashboard stats without token (should be 401)
        success, response = self.run_test(
            "Dashboard Stats - No Token (Security Test)",
            "GET",
            "dashboard/stats",
            401,  # Should require authentication
            critical=True
        )
        
        if not success:
            print(f"   🚨 CRITICAL SECURITY VULNERABILITY: Dashboard stats accessible without authentication!")
            self.critical_failures.append({
                'name': 'Authentication Bypass Vulnerability',
                'error': 'Dashboard stats endpoint accessible without token',
                'critical': True
            })
        
        # Test 2: Dashboard stats with invalid token
        invalid_headers = {'Authorization': 'Bearer invalid_token_12345'}
        success, response = self.run_test(
            "Dashboard Stats - Invalid Token",
            "GET",
            "dashboard/stats",
            401,
            headers=invalid_headers,
            critical=True
        )
        
        # Test 3: Dashboard stats with valid token (should work)
        if self.token:
            success, response = self.run_test(
                "Dashboard Stats - Valid Token",
                "GET",
                "dashboard/stats",
                200,
                critical=True
            )
            
            if success:
                print(f"   📊 Total Analyses: {response.get('total_analyses', 0)}")
                print(f"   📈 Average Score: {response.get('average_score', 0)}")
                print(f"   🎫 Subscription Tier: {response.get('subscription_tier', 'Unknown')}")
        
        return True

    def test_analytics_engine_validation(self):
        """Test Analytics Engine Validation - Check for real data vs zero values"""
        print(f"\n📊 ANALYTICS ENGINE VALIDATION")
        print("-" * 50)
        
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        analytics_endpoints = [
            ("Analytics Overview", "analytics/overview"),
            ("Analytics Revenue", "analytics/revenue"), 
            ("Analytics User Growth", "analytics/user-growth"),
            ("Analytics Badge Distribution", "analytics/badge-distribution"),
            ("Analytics Conversion Funnel", "analytics/conversion-funnel"),
            ("Analytics Geographic", "analytics/geographic"),
            ("Analytics Cohort Analysis", "analytics/cohort-analysis")
        ]
        
        all_passed = True
        zero_value_count = 0
        
        for name, endpoint in analytics_endpoints:
            success, response = self.run_test(
                name,
                "GET",
                endpoint,
                200,
                critical=True
            )
            
            if success:
                # Check for zero values that indicate missing data population
                if endpoint == "analytics/overview":
                    overview = response.get('overview', response)
                    total_users = overview.get('total_users', overview.get('totalUsers', 0))
                    total_analyses = overview.get('total_analyses', overview.get('totalAnalyses', 0))
                    total_revenue = overview.get('total_revenue', overview.get('totalRevenue', 0))
                    
                    print(f"      👥 Total Users: {total_users}")
                    print(f"      📊 Total Analyses: {total_analyses}")
                    print(f"      💰 Total Revenue: ${total_revenue}")
                    
                    if total_users == 0:
                        self.zero_value_sections.append("Analytics Overview - Total Users")
                        zero_value_count += 1
                    if total_analyses == 0:
                        self.zero_value_sections.append("Analytics Overview - Total Analyses")
                        zero_value_count += 1
                    if total_revenue == 0:
                        self.zero_value_sections.append("Analytics Overview - Total Revenue")
                        zero_value_count += 1
                
                elif endpoint == "analytics/revenue":
                    revenue_data = response.get('revenue_data', response)
                    mrr = revenue_data.get('mrr', 0)
                    monthly_revenue = revenue_data.get('monthly_revenue', [])
                    
                    print(f"      💰 MRR: ${mrr}")
                    print(f"      📈 Monthly Revenue Points: {len(monthly_revenue)}")
                    
                    if mrr == 0:
                        self.zero_value_sections.append("Analytics Revenue - MRR")
                        zero_value_count += 1
                
                elif endpoint == "analytics/user-growth":
                    growth_data = response.get('growth_data', response)
                    new_users = growth_data.get('new_users_this_month', 0)
                    growth_rate = growth_data.get('growth_rate', 0)
                    
                    print(f"      👥 New Users This Month: {new_users}")
                    print(f"      📈 Growth Rate: {growth_rate}%")
                    
                    if new_users == 0:
                        zero_value_count += 1
                    if growth_rate == 0:
                        zero_value_count += 1
                
                elif endpoint == "analytics/badge-distribution":
                    distribution = response.get('badge_distribution', {})
                    total_badges = sum(distribution.values()) if distribution else 0
                    
                    print(f"      🏆 Total Active Badges: {total_badges}")
                    
                    if total_badges == 0:
                        self.zero_value_sections.append("Analytics Badge Distribution - Total Badges")
                        zero_value_count += 1
                
                elif endpoint == "analytics/conversion-funnel":
                    funnel = response.get('conversion_funnel', response)
                    visitors = funnel.get('visitors', 0)
                    signups = funnel.get('signups', 0)
                    purchases = funnel.get('purchases', 0)
                    
                    print(f"      👁️  Visitors: {visitors}")
                    print(f"      ✍️  Signups: {signups}")
                    print(f"      💳 Purchases: {purchases}")
                    
                    if visitors == 0:
                        zero_value_count += 1
                    if signups == 0:
                        zero_value_count += 1
                    if purchases == 0:
                        zero_value_count += 1
            else:
                all_passed = False
        
        print(f"\n   📊 Analytics Summary:")
        print(f"      ✅ Endpoints Working: {len([e for e in analytics_endpoints if True])}")
        print(f"      ⚠️  Zero-Value Sections: {zero_value_count}")
        
        if zero_value_count > 0:
            print(f"   🚨 DATA POPULATION NEEDED: {zero_value_count} sections showing zero values")
        
        return all_passed

    def test_enhanced_ai_consultant_system(self):
        """Test Enhanced AI Consultant System - Focus on initialization and profile endpoints"""
        print(f"\n🤖 ENHANCED AI CONSULTANT SYSTEM")
        print("-" * 50)
        
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        # Test 1: Consultant initialization (should work without analysis ID)
        success, response = self.run_test(
            "AI Consultant - Initialize (No Analysis ID Required)",
            "POST",
            "consultant/initialize",
            200,
            data={
                'user_profile': {
                    'experience_level': 'intermediate',
                    'business_goals': ['expansion', 'optimization'],
                    'location': 'Chicago, IL',
                    'budget_range': '500k-1m'
                }
            },
            critical=True
        )
        
        consultant_id = None
        if success:
            consultant = response.get('consultant', {})
            consultant_id = consultant.get('consultant_id')
            specialization = consultant.get('specialization')
            
            print(f"      🤖 Consultant ID: {consultant_id}")
            print(f"      🎯 Specialization: {specialization}")
            print(f"      📋 Action Items: {len(consultant.get('action_items', []))}")
            
            self.consultant_id = consultant_id
        else:
            print(f"   🚨 CRITICAL: AI Consultant initialization failing")
            self.critical_failures.append({
                'name': 'AI Consultant Initialization Failure',
                'error': 'Cannot initialize consultant without analysis ID',
                'critical': True
            })
        
        # Test 2: Consultant profile endpoint
        success, response = self.run_test(
            "AI Consultant - Profile",
            "GET",
            "consultant/profile",
            200,
            critical=True
        )
        
        if success:
            consultant_active = response.get('consultant_active', False)
            subscription_tier = response.get('subscription_tier')
            consultation_history = response.get('consultation_history', [])
            
            print(f"      🎫 Consultant Active: {consultant_active}")
            print(f"      📊 Subscription Tier: {subscription_tier}")
            print(f"      📚 Consultation History: {len(consultation_history)} sessions")
        
        # Test 3: Consultant update profile endpoint (should exist)
        success, response = self.run_test(
            "AI Consultant - Update Profile",
            "PUT",
            "consultant/update-profile",
            200,
            data={
                'preferences': {
                    'communication_style': 'detailed',
                    'focus_areas': ['roi_optimization', 'market_analysis']
                }
            },
            critical=True
        )
        
        if not success:
            print(f"   🚨 CRITICAL: AI Consultant update profile endpoint missing or broken")
            self.critical_failures.append({
                'name': 'AI Consultant Update Profile Missing',
                'error': 'Update profile endpoint not implemented',
                'critical': True
            })
        
        # Test 4: Consultant subscription tier awareness
        success, response = self.run_test(
            "AI Consultant - Subscription Tier Awareness",
            "POST",
            "consultant/chat",
            200,
            data={
                'message': 'What features are available in my current subscription tier?',
                'conversation_context': {
                    'user_tier': self.user_data.get('subscription_tier', 'free') if self.user_data else 'free'
                }
            },
            critical=True
        )
        
        if success:
            chat_response = response.get('response', '')
            usage_info = response.get('usage_info', {})
            
            print(f"      💬 Response Length: {len(chat_response)} chars")
            print(f"      📊 Usage Remaining: {usage_info.get('remaining_queries', 'Unknown')}")
            
            # Check if response mentions subscription tier
            if 'tier' in chat_response.lower() or 'subscription' in chat_response.lower():
                print(f"      ✅ Subscription tier awareness confirmed")
            else:
                print(f"      ⚠️  Subscription tier awareness unclear")
        
        return True

    def test_data_integration_verification(self):
        """Test Data Integration Verification - MongoDB data retrieval and display"""
        print(f"\n🗄️  DATA INTEGRATION VERIFICATION")
        print("-" * 50)
        
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        # Test 1: User analyses retrieval (MongoDB data)
        success, response = self.run_test(
            "MongoDB Data - User Analyses",
            "GET",
            "user/analyses",
            200,
            critical=True
        )
        
        if success:
            analyses = response.get('analyses', [])
            print(f"      📊 User Analyses: {len(analyses)}")
            
            if analyses:
                latest = analyses[0]
                print(f"      📍 Latest Analysis: {latest.get('address', 'Unknown')}")
                print(f"      🎯 Score: {latest.get('score', 0)}")
                print(f"      📅 Created: {latest.get('created_at', 'Unknown')}")
            else:
                print(f"      ⚠️  No analysis data found")
        
        # Test 2: User transactions (MongoDB data)
        success, response = self.run_test(
            "MongoDB Data - User Transactions",
            "GET",
            "user/transactions",
            200,
            critical=True
        )
        
        if success:
            transactions = response.get('transactions', [])
            print(f"      💳 User Transactions: {len(transactions)}")
            
            if transactions:
                latest = transactions[0]
                print(f"      💰 Latest Transaction: ${latest.get('amount', 0)}")
                print(f"      🏷️  Offer Type: {latest.get('offer_type', 'Unknown')}")
                print(f"      📊 Status: {latest.get('payment_status', 'Unknown')}")
        
        # Test 3: User subscriptions (MongoDB data)
        success, response = self.run_test(
            "MongoDB Data - User Subscriptions",
            "GET",
            "user/subscriptions",
            200,
            critical=True
        )
        
        if success:
            subscriptions = response.get('subscriptions', [])
            print(f"      📋 User Subscriptions: {len(subscriptions)}")
            
            if subscriptions:
                for sub in subscriptions:
                    print(f"         - {sub.get('offer_type', 'unknown')}: {sub.get('subscription_status', 'unknown')}")
        
        # Test 4: Admin stats (aggregated MongoDB data)
        success, response = self.run_test(
            "MongoDB Data - Admin Statistics",
            "GET",
            "admin/stats",
            200,
            critical=True
        )
        
        if success:
            total_revenue = response.get('totalRevenue', 0)
            active_subscribers = response.get('activeSubscribers', 0)
            total_users = response.get('totalUsers', 0)
            
            print(f"      💰 Total Revenue: ${total_revenue}")
            print(f"      👥 Active Subscribers: {active_subscribers}")
            print(f"      📊 Total Users: {total_users}")
            
            if total_revenue > 0 and active_subscribers > 0:
                print(f"      ✅ Real data integration confirmed")
            else:
                print(f"      ⚠️  Data may need population")
        
        return True

    def test_mrr_dashboard_quick_test(self):
        """Quick MRR Dashboard Test - Performance metrics and billing endpoints"""
        print(f"\n💰 QUICK MRR DASHBOARD TEST")
        print("-" * 50)
        
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        # Test 1: Performance metrics
        success, response = self.run_test(
            "MRR Dashboard - Performance Metrics",
            "GET",
            "dashboard/performance",
            200,
            critical=True
        )
        
        if success:
            total_analyses = response.get('total_analyses', 0)
            average_score = response.get('average_score', 0)
            engagement_score = response.get('engagement_score', 0)
            
            print(f"      📊 Total Analyses: {total_analyses}")
            print(f"      📈 Average Score: {average_score}")
            print(f"      🎯 Engagement Score: {engagement_score}")
        
        # Test 2: Usage and billing
        success, response = self.run_test(
            "MRR Dashboard - Usage & Billing",
            "GET",
            "usage/current",
            200,
            critical=True
        )
        
        if success:
            api_calls_used = response.get('api_calls_used', 0)
            api_calls_limit = response.get('api_calls_limit', 0)
            utilization_percent = response.get('utilization_percent', 0)
            
            print(f"      📞 API Calls: {api_calls_used}/{api_calls_limit}")
            print(f"      📊 Utilization: {utilization_percent}%")
        
        # Test 3: Billing report
        success, response = self.run_test(
            "MRR Dashboard - Billing Report",
            "GET",
            "billing/report",
            200,
            critical=True
        )
        
        if success:
            base_subscription = response.get('base_subscription', 0)
            overage_charges = response.get('overage_charges', 0)
            total_billing = response.get('total_billing', 0)
            
            print(f"      💳 Base Subscription: ${base_subscription}")
            print(f"      💸 Overage Charges: ${overage_charges}")
            print(f"      💰 Total Billing: ${total_billing}")
        
        # Test 4: Portfolio dashboard
        success, response = self.run_test(
            "MRR Dashboard - Portfolio",
            "GET",
            "portfolio/dashboard",
            200,
            critical=True
        )
        
        if success:
            total_locations = response.get('total_locations', 0)
            portfolio_stats = response.get('portfolio_stats', {})
            total_investment = portfolio_stats.get('total_investment_estimated', 0)
            
            print(f"      🏢 Total Locations: {total_locations}")
            print(f"      💰 Total Investment: ${total_investment:,}")
        
        return True

    def run_validation_tests(self):
        """Run all validation tests"""
        print(f"\n🚀 STARTING BACKEND VALIDATION TESTS")
        print("=" * 80)
        
        # Setup authentication
        if not self.setup_authentication():
            print("❌ Authentication setup failed - cannot continue")
            return False
        
        # Run validation tests
        self.test_authentication_security()
        self.test_analytics_engine_validation()
        self.test_enhanced_ai_consultant_system()
        self.test_data_integration_verification()
        self.test_mrr_dashboard_quick_test()
        
        # Print summary
        self.print_summary()
        
        return len(self.critical_failures) == 0

    def print_summary(self):
        """Print test summary"""
        print(f"\n" + "=" * 80)
        print(f"🔍 BACKEND VALIDATION RESULTS")
        print("=" * 80)
        print(f"📊 Tests Run: {self.tests_run}")
        print(f"✅ Tests Passed: {self.tests_passed}")
        print(f"❌ Tests Failed: {len(self.failed_tests)}")
        print(f"🚨 Critical Failures: {len(self.critical_failures)}")
        print(f"📈 Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        if self.critical_failures:
            print(f"\n🚨 CRITICAL FAILURES:")
            for i, failure in enumerate(self.critical_failures, 1):
                print(f"   {i}. {failure['name']}")
                print(f"      Error: {failure['error']}")
        
        if self.zero_value_sections:
            print(f"\n⚠️  ZERO-VALUE DATA SECTIONS ({len(self.zero_value_sections)}):")
            for section in self.zero_value_sections:
                print(f"   - {section}")
        
        # Determine overall status
        if len(self.critical_failures) == 0:
            print(f"\n✅ VALIDATION PASSED - Backend ready for deployment")
        else:
            print(f"\n❌ VALIDATION FAILED - Critical issues need resolution")

if __name__ == "__main__":
    tester = BackendValidationTester()
    success = tester.run_validation_tests()
    sys.exit(0 if success else 1)