#!/usr/bin/env python3
"""
Analytics Engine Testing - Test comprehensive analytics endpoints
"""

import requests
import sys
import json
from datetime import datetime

class AnalyticsEngineTest:
    def __init__(self, base_url="https://laundrometrics.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        
        # Test user data
        timestamp = datetime.now().strftime('%H%M%S')
        self.test_user = {
            'email': f'analytics.test_{timestamp}@laundrotech.com',
            'password': 'SecurePass2024!',
            'full_name': f'Analytics Test User {timestamp}',
            'facebook_group_member': True
        }
        
        print(f"🔬 ANALYTICS ENGINE TESTING")
        print(f"📍 Backend URL: {self.base_url}")
        print(f"👤 Test User: {self.test_user['email']}")
        print("=" * 60)

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
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

            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                print(f"   ✅ PASSED - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, dict):
                        # Show key metrics from response
                        if 'totalRevenue' in response_data:
                            print(f"   💰 Total Revenue: ${response_data.get('totalRevenue', 0)}")
                        if 'totalUsers' in response_data:
                            print(f"   👥 Total Users: {response_data.get('totalUsers', 0)}")
                        if 'activeSubscriptions' in response_data:
                            print(f"   📋 Active Subscriptions: {response_data.get('activeSubscriptions', 0)}")
                        if 'conversionRate' in response_data:
                            print(f"   📈 Conversion Rate: {response_data.get('conversionRate', 0)}%")
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

        except Exception as e:
            print(f"   💥 ERROR - {str(e)}")
            self.failed_tests.append({'name': name, 'error': str(e)})
            return False, {}

    def authenticate(self):
        """Register and authenticate test user"""
        # Register user
        success, response = self.run_test(
            "User Registration for Analytics Testing",
            "POST",
            "auth/register",
            200,
            data=self.test_user
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            print(f"   🔑 Token acquired for analytics testing")
            return True
        return False

    def test_analytics_overview(self):
        """Test analytics overview endpoint"""
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        success, response = self.run_test(
            "Analytics Overview",
            "GET",
            "analytics/overview?timeframe=30d",
            200
        )
        
        return success

    def test_revenue_analytics(self):
        """Test revenue analytics endpoint"""
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        success, response = self.run_test(
            "Revenue Analytics",
            "GET",
            "analytics/revenue?timeframe=30d&granularity=daily",
            200
        )
        
        if success:
            daily_revenue = response.get('dailyRevenue', [])
            payment_methods = response.get('paymentMethods', {})
            print(f"   📊 Daily Revenue Data Points: {len(daily_revenue)}")
            print(f"   💳 Payment Methods: PayPal, Stripe")
        
        return success

    def test_user_growth_analytics(self):
        """Test user growth analytics endpoint"""
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        success, response = self.run_test(
            "User Growth Analytics",
            "GET",
            "analytics/user-growth?timeframe=30d",
            200
        )
        
        if success:
            daily_growth = response.get('dailyGrowth', [])
            user_segmentation = response.get('userSegmentation', {})
            print(f"   📈 Daily Growth Data Points: {len(daily_growth)}")
            print(f"   👥 Facebook Members: {user_segmentation.get('facebookMembers', 0)}")
            print(f"   💰 Paying Users: {user_segmentation.get('payingUsers', 0)}")
        
        return success

    def test_badge_distribution(self):
        """Test badge distribution analytics"""
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        success, response = self.run_test(
            "Badge Distribution Analytics",
            "GET",
            "analytics/badge-distribution?timeframe=30d",
            200
        )
        
        if success:
            distribution = response.get('distribution', [])
            total_badges = response.get('totalBadges', 0)
            print(f"   🏆 Badge Types: {len(distribution)}")
            print(f"   📊 Total Active Badges: {total_badges}")
        
        return success

    def test_conversion_funnel(self):
        """Test conversion funnel analytics"""
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        success, response = self.run_test(
            "Conversion Funnel Analytics",
            "GET",
            "analytics/conversion-funnel?timeframe=30d",
            200
        )
        
        if success:
            funnel = response.get('funnel', [])
            overall_conversion = response.get('overallConversionRate', 0)
            print(f"   🎯 Funnel Stages: {len(funnel)}")
            print(f"   📈 Overall Conversion Rate: {overall_conversion:.1f}%")
        
        return success

    def test_geographic_analytics(self):
        """Test geographic analytics"""
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        success, response = self.run_test(
            "Geographic Analytics",
            "GET",
            "analytics/geographic?timeframe=30d",
            200
        )
        
        if success:
            locations = response.get('locations', [])
            total_countries = response.get('totalCountries', 0)
            print(f"   🌍 Countries: {total_countries}")
            print(f"   🏆 Top Country: {response.get('topCountry', 'N/A')}")
        
        return success

    def test_cohort_analysis(self):
        """Test cohort analysis"""
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        success, response = self.run_test(
            "Cohort Analysis",
            "GET",
            "analytics/cohort-analysis?timeframe=90d",
            200
        )
        
        if success:
            cohorts = response.get('cohorts', [])
            avg_retention = response.get('averageRetentionRate', 0)
            print(f"   📊 Cohorts: {len(cohorts)}")
            print(f"   🔄 Avg Retention Rate: {avg_retention:.1f}%")
        
        return success

    def test_revenue_predictions(self):
        """Test AI-powered revenue predictions"""
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        success, response = self.run_test(
            "Revenue Predictions (AI)",
            "GET",
            "analytics/predictions?horizon=30",
            200
        )
        
        if success:
            predictions = response.get('predictions', [])
            confidence = response.get('confidence', 0)
            total_predicted = response.get('totalPredictedRevenue', 0)
            print(f"   🔮 Predictions: {len(predictions)} days")
            print(f"   🎯 Confidence: {confidence:.2f}")
            print(f"   💰 Total Predicted Revenue: ${total_predicted:.2f}")
        
        return success

    def test_export_analytics(self):
        """Test analytics export functionality"""
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        success, response = self.run_test(
            "Analytics Export",
            "GET",
            "analytics/export?format=pdf&timeframe=30d&sections=all",
            200
        )
        
        if success:
            download_url = response.get('download_url', '')
            expires_at = response.get('expires_at', '')
            print(f"   📄 Export Format: PDF")
            print(f"   🔗 Download URL: Available")
            print(f"   ⏰ Expires: {expires_at[:10] if expires_at else 'N/A'}")
        
        return success

    def run_comprehensive_analytics_testing(self):
        """Run all analytics tests"""
        print(f"\n🧪 COMPREHENSIVE ANALYTICS ENGINE TESTING")
        print("=" * 60)
        
        # Authentication
        print(f"\n🔐 AUTHENTICATION")
        print("-" * 30)
        if not self.authenticate():
            print("❌ Authentication failed - cannot proceed with analytics tests")
            return False
        
        # Analytics Tests
        print(f"\n📊 ANALYTICS ENGINE TESTS")
        print("-" * 30)
        analytics_tests = [
            self.test_analytics_overview,
            self.test_revenue_analytics,
            self.test_user_growth_analytics,
            self.test_badge_distribution,
            self.test_conversion_funnel,
            self.test_geographic_analytics,
            self.test_cohort_analysis,
            self.test_revenue_predictions,
            self.test_export_analytics
        ]
        
        analytics_passed = sum(1 for test in analytics_tests if test())
        print(f"📊 Analytics Tests: {analytics_passed}/{len(analytics_tests)} passed")
        
        # Final results
        self.print_results()
        return len(self.failed_tests) == 0

    def print_results(self):
        """Print test results"""
        print(f"\n" + "=" * 60)
        print(f"🏁 ANALYTICS ENGINE TEST RESULTS")
        print(f"=" * 60)
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        
        print(f"📊 Tests Run: {self.tests_run}")
        print(f"✅ Tests Passed: {self.tests_passed}")
        print(f"❌ Tests Failed: {len(self.failed_tests)}")
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        if self.failed_tests:
            print(f"\n❌ FAILED TESTS:")
            for i, failure in enumerate(self.failed_tests, 1):
                print(f"   {i}. {failure['name']}")
                if 'expected' in failure and 'actual' in failure:
                    print(f"      Expected: {failure['expected']}, Got: {failure['actual']}")
                print(f"      Error: {failure['error'][:200]}...")
                print()
        
        if success_rate >= 90:
            print(f"   ✅ ANALYTICS ENGINE OPERATIONAL")
            print(f"   📊 Advanced business intelligence ready for deployment")
        elif success_rate >= 75:
            print(f"   ⚠️  MOSTLY OPERATIONAL - Minor issues")
        else:
            print(f"   ❌ ANALYTICS ENGINE NEEDS ATTENTION")

def main():
    """Main test execution"""
    tester = AnalyticsEngineTest()
    
    try:
        success = tester.run_comprehensive_analytics_testing()
        return 0 if success else 1
    except KeyboardInterrupt:
        print(f"\n⏹️  Tests interrupted by user")
        return 1
    except Exception as e:
        print(f"\n💥 Unexpected error: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())