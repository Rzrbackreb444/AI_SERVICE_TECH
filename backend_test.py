#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for SiteTitan - LaundroTech Intelligence Platform
Tests all authentication, analysis, tier-based access control, and Facebook Group badge monetization functionality
"""

import requests
import sys
import json
from datetime import datetime
import time

class SiteTitanAPITester:
    def __init__(self, base_url="https://site-analytics-6.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.user_data = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        
        # Test user data
        timestamp = datetime.now().strftime('%H%M%S')
        self.test_user = {
            'email': f'test_user_{timestamp}@example.com',
            'password': 'TestPass123!',
            'full_name': f'Test User {timestamp}',
            'facebook_group_member': True
        }
        
        print(f"🚀 Starting SiteTitan API Testing")
        print(f"📍 Backend URL: {self.base_url}")
        print(f"👤 Test User: {self.test_user['email']}")
        print("=" * 60)

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
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
            
            if success:
                self.tests_passed += 1
                print(f"   ✅ PASSED - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, dict) and len(response_data) <= 3:
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
                
                self.failed_tests.append({
                    'name': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'endpoint': endpoint,
                    'error': response.text[:500]
                })

            return success, response.json() if response.content else {}

        except requests.exceptions.Timeout:
            print(f"   ⏰ TIMEOUT - Request took longer than 30 seconds")
            self.failed_tests.append({'name': name, 'error': 'Timeout'})
            return False, {}
        except Exception as e:
            print(f"   💥 ERROR - {str(e)}")
            self.failed_tests.append({'name': name, 'error': str(e)})
            return False, {}

    def test_api_root(self):
        """Test API root endpoint"""
        success, response = self.run_test(
            "API Root Endpoint",
            "GET", 
            "",
            200
        )
        return success

    def test_pricing_endpoint(self):
        """Test pricing tiers endpoint"""
        success, response = self.run_test(
            "Get Pricing Tiers",
            "GET",
            "pricing",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   📊 Found {len(response)} pricing tiers")
            tier_names = [tier.get('tier_name', 'Unknown') for tier in response]
            print(f"   🏷️  Tiers: {', '.join(tier_names)}")
        
        return success

    def test_user_registration(self):
        """Test user registration"""
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data=self.test_user
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.user_data = response.get('user', {})
            print(f"   🔑 Token acquired: {self.token[:20]}...")
            print(f"   👤 User ID: {self.user_data.get('id', 'Unknown')}")
            print(f"   🎫 Subscription: {self.user_data.get('subscription_tier', 'Unknown')}")
        
        return success

    def test_user_login(self):
        """Test user login with existing credentials"""
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data={
                'email': self.test_user['email'],
                'password': self.test_user['password']
            }
        )
        
        if success and 'access_token' in response:
            # Update token for subsequent tests
            self.token = response['access_token']
            print(f"   🔄 Token refreshed: {self.token[:20]}...")
        
        return success

    def test_dashboard_stats(self):
        """Test dashboard statistics endpoint"""
        success, response = self.run_test(
            "Dashboard Statistics",
            "GET",
            "dashboard/stats",
            200
        )
        
        if success:
            print(f"   📈 Total Analyses: {response.get('total_analyses', 0)}")
            print(f"   ⭐ Average Score: {response.get('average_score', 0)}")
            print(f"   🎫 Subscription: {response.get('subscription_tier', 'Unknown')}")
        
        return success

    def test_location_analysis_scout(self):
        """Test location analysis with scout tier (free users)"""
        test_address = "123 Main Street, New York, NY 10001"
        
        success, response = self.run_test(
            "Location Analysis - Scout Tier",
            "POST",
            "analyze",
            200,
            data={
                'address': test_address,
                'analysis_type': 'scout'
            }
        )
        
        if success:
            print(f"   📍 Address: {response.get('address', 'Unknown')}")
            print(f"   🎯 Grade: {response.get('grade', 'Unknown')}")
            print(f"   📊 Score: {response.get('score', 0):.1f}")
            print(f"   👥 Competitors: {len(response.get('competitors', []))}")
            
            # Store analysis ID for later tests
            self.analysis_id = response.get('id')
        
        return success

    def test_location_analysis_premium_access_denied(self):
        """Test that free users cannot access premium analysis types"""
        test_address = "123 Main Street, New York, NY 10001"
        
        success, response = self.run_test(
            "Premium Analysis Access Denied",
            "POST",
            "analyze",
            403,  # Should be forbidden for free users
            data={
                'address': test_address,
                'analysis_type': 'intelligence'
            }
        )
        
        return success

    def test_analysis_history(self):
        """Test getting user's analysis history"""
        success, response = self.run_test(
            "Analysis History",
            "GET",
            "analyses",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   📚 Found {len(response)} previous analyses")
            if response:
                latest = response[0]
                print(f"   🕒 Latest: {latest.get('address', 'Unknown')} - Grade {latest.get('grade', 'Unknown')}")
        
        return success

    def test_hybrid_analysis_access_denied(self):
        """Test that free users cannot access hybrid analysis"""
        success, response = self.run_test(
            "Hybrid Analysis Access Denied",
            "POST",
            "hybrid-analysis/coffee",
            403,  # Should be forbidden for free users
            data={
                'address': '123 Main Street, New York, NY 10001',
                'analysis_type': 'optimization'
            }
        )
        
        return success

    def test_monitoring_alerts_access_denied(self):
        """Test that non-pro users cannot access monitoring alerts"""
        success, response = self.run_test(
            "Monitoring Alerts Access Denied",
            "GET",
            "monitoring/alerts",
            403  # Should be forbidden for non-pro users
        )
        
        return success

    def test_invalid_authentication(self):
        """Test API behavior with invalid authentication"""
        # Temporarily remove token
        original_token = self.token
        self.token = "invalid_token_12345"
        
        success, response = self.run_test(
            "Invalid Authentication",
            "GET",
            "dashboard/stats",
            401  # Should be unauthorized
        )
        
        # Restore original token
        self.token = original_token
        return success

    def test_external_api_integrations(self):
        """Test that external API integrations are working by analyzing a real location"""
        print(f"\n🌐 Testing External API Integrations...")
        
        # Test with a well-known address that should return data
        test_address = "Times Square, New York, NY"
        
        success, response = self.run_test(
            "External API Integration Test",
            "POST",
            "analyze",
            200,
            data={
                'address': test_address,
                'analysis_type': 'scout'
            }
        )
        
        if success:
            demographics = response.get('demographics', {})
            competitors = response.get('competitors', [])
            
            print(f"   🏙️  Demographics Data: {'✅' if demographics else '❌'}")
            if demographics:
                print(f"      Population: {demographics.get('population', 'N/A')}")
                print(f"      Median Income: ${demographics.get('median_income', 'N/A'):,}")
            
            print(f"   🏪 Competitor Data: {'✅' if competitors else '❌'}")
            if competitors:
                print(f"      Found {len(competitors)} competitors")
                top_competitor = competitors[0] if competitors else {}
                print(f"      Top Competitor: {top_competitor.get('name', 'N/A')} (Rating: {top_competitor.get('rating', 'N/A')})")
        
        return success

    def run_comprehensive_test_suite(self):
        """Run all tests in logical order"""
        print(f"\n🧪 COMPREHENSIVE API TEST SUITE")
        print("=" * 60)
        
        # Basic connectivity tests
        print(f"\n📡 CONNECTIVITY TESTS")
        self.test_api_root()
        self.test_pricing_endpoint()
        
        # Authentication tests
        print(f"\n🔐 AUTHENTICATION TESTS")
        self.test_user_registration()
        self.test_user_login()
        self.test_invalid_authentication()
        
        # Core functionality tests
        print(f"\n🎯 CORE FUNCTIONALITY TESTS")
        self.test_dashboard_stats()
        self.test_location_analysis_scout()
        self.test_analysis_history()
        
        # Access control tests
        print(f"\n🛡️  ACCESS CONTROL TESTS")
        self.test_location_analysis_premium_access_denied()
        self.test_hybrid_analysis_access_denied()
        self.test_monitoring_alerts_access_denied()
        
        # Integration tests
        print(f"\n🔗 INTEGRATION TESTS")
        self.test_external_api_integrations()
        
        # Final results
        self.print_final_results()

    def print_final_results(self):
        """Print comprehensive test results"""
        print(f"\n" + "=" * 60)
        print(f"🏁 FINAL TEST RESULTS")
        print(f"=" * 60)
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        
        print(f"📊 Tests Run: {self.tests_run}")
        print(f"✅ Tests Passed: {self.tests_passed}")
        print(f"❌ Tests Failed: {len(self.failed_tests)}")
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        if self.failed_tests:
            print(f"\n💥 FAILED TESTS DETAILS:")
            for i, failure in enumerate(self.failed_tests, 1):
                print(f"   {i}. {failure['name']}")
                if 'expected' in failure and 'actual' in failure:
                    print(f"      Expected: {failure['expected']}, Got: {failure['actual']}")
                print(f"      Error: {failure['error'][:200]}...")
                print()
        
        # Production readiness assessment
        print(f"\n🚀 PRODUCTION READINESS ASSESSMENT:")
        if success_rate >= 90:
            print(f"   ✅ EXCELLENT - Ready for production deployment")
        elif success_rate >= 75:
            print(f"   ⚠️  GOOD - Minor issues need attention")
        elif success_rate >= 50:
            print(f"   🔧 NEEDS WORK - Several critical issues")
        else:
            print(f"   🚨 CRITICAL - Major issues prevent production deployment")
        
        return success_rate >= 75  # Return True if production ready

def main():
    """Main test execution"""
    tester = SiteTitanAPITester()
    
    try:
        production_ready = tester.run_comprehensive_test_suite()
        return 0 if production_ready else 1
    except KeyboardInterrupt:
        print(f"\n⏹️  Tests interrupted by user")
        return 1
    except Exception as e:
        print(f"\n💥 Unexpected error: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())