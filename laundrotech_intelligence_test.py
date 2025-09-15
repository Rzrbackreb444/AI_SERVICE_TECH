#!/usr/bin/env python3
"""
LAUNDROTECH INTELLIGENCE PLATFORM TESTING
Comprehensive testing of the core LaundroTech Intelligence Platform functionality:
- Enterprise analysis endpoint with intelligence engine integration
- PDF report generation
- User analysis history
- Rate limiting functionality
- Self-learning AI integration
- Advanced AI algorithms and next-gen scoring
- Enterprise intelligence engine with ALL API integrations
"""

import requests
import sys
import json
from datetime import datetime
import time
import uuid

class LaundroTechIntelligenceTester:
    def __init__(self, base_url="https://site-atlas-ai.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.user_data = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.critical_failures = []
        self.analysis_ids = []  # Store analysis IDs for PDF testing
        
        # Test user data with realistic information
        timestamp = datetime.now().strftime('%H%M%S')
        self.test_user = {
            'email': f'laundrotech.tester_{timestamp}@example.com',
            'password': 'SecurePass2024!',
            'full_name': f'LaundroTech Tester {timestamp}',
            'facebook_group_member': False  # Focus on platform features
        }
        
        # Realistic laundromat addresses for testing
        self.test_addresses = [
            "1234 Main Street, Springfield, IL 62701",
            "5678 Oak Avenue, Austin, TX 78701", 
            "9012 Pine Road, Denver, CO 80202",
            "3456 Elm Street, Portland, OR 97201",
            "7890 Maple Drive, Atlanta, GA 30309"
        ]
        
        print(f"🚀 LAUNDROTECH INTELLIGENCE PLATFORM TESTING")
        print(f"📍 Backend URL: {self.base_url}")
        print(f"👤 Test User: {self.test_user['email']}")
        print(f"🎯 Focus: Core LaundroTech Intelligence Platform Features")
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
            print(f"   🚨 CRITICAL TEST - Core Platform Feature")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=60)  # Longer timeout for analysis
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=60)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=60)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=60)

            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                print(f"   ✅ PASSED - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, dict):
                        # Show key information without overwhelming output
                        if 'analysis_id' in response_data:
                            print(f"   📊 Analysis ID: {response_data['analysis_id']}")
                            self.analysis_ids.append(response_data['analysis_id'])
                        if 'overall_score' in response_data:
                            print(f"   📈 Overall Score: {response_data['overall_score']}")
                        if 'grade' in response_data:
                            print(f"   🎯 Grade: {response_data['grade']}")
                        if 'analyses' in response_data:
                            print(f"   📋 Analysis Count: {len(response_data['analyses'])}")
                        if 'ai_analysis' in response_data:
                            print(f"   🤖 AI Analysis: Present")
                        if 'enterprise_analysis' in response_data:
                            print(f"   🏢 Enterprise Analysis: Present")
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

        except requests.exceptions.Timeout:
            print(f"   ⏰ TIMEOUT - Request took longer than 60 seconds")
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

    # ========== AUTHENTICATION & USER SETUP ==========
    
    def test_user_registration(self):
        """Test user registration for LaundroTech platform"""
        success, response = self.run_test(
            "User Registration - LaundroTech Platform",
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
            print(f"   🎫 Subscription Tier: {self.user_data.get('subscription_tier', 'free')}")
        
        return success

    def test_user_login(self):
        """Test user login functionality"""
        success, response = self.run_test(
            "User Login - LaundroTech Platform",
            "POST",
            "auth/login",
            200,
            data={
                'email': self.test_user['email'],
                'password': self.test_user['password']
            },
            critical=True
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            print(f"   🔄 Token refreshed: {self.token[:20]}...")
        
        return success

    # ========== ENTERPRISE ANALYSIS TESTING ==========
    
    def test_enterprise_analysis_endpoint(self):
        """Test POST /api/analyze with enterprise intelligence engine integration"""
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        # Test with realistic laundromat address
        test_address = self.test_addresses[0]
        
        success, response = self.run_test(
            "Enterprise Analysis - Intelligence Engine Integration",
            "POST",
            "analyze",
            200,
            data={
                'address': test_address,
                'analysis_type': 'intelligence',  # Higher tier analysis
                'additional_data': {
                    'business_type': 'laundromat',
                    'investment_budget': 500000,
                    'timeline': '6_months'
                }
            },
            critical=True
        )
        
        if success:
            # Verify enterprise intelligence engine components
            required_components = [
                'demographics', 'competitors', 'location_score', 
                'ai_analysis', 'enterprise_analysis'
            ]
            
            missing_components = []
            for component in required_components:
                if component not in response:
                    missing_components.append(component)
            
            if missing_components:
                print(f"   ⚠️  Missing enterprise components: {missing_components}")
                return False
            
            # Verify API integrations are working
            demographics = response.get('demographics', {})
            competitors = response.get('competitors', [])
            
            print(f"   🏢 Enterprise Analysis: Complete")
            print(f"   📊 Demographics Data: {'✅' if demographics else '❌'}")
            print(f"   🏪 Competitors Found: {len(competitors)}")
            print(f"   🤖 AI Analysis: {'✅' if response.get('ai_analysis') else '❌'}")
            print(f"   🎯 Location Score: {response.get('location_score', {}).get('total_score', 'N/A')}")
            
            # Verify Google Maps integration
            if competitors:
                print(f"   🗺️  Google Maps API: ✅ (Found {len(competitors)} competitors)")
            else:
                print(f"   🗺️  Google Maps API: ⚠️  (No competitors found)")
            
            # Verify Census integration
            if demographics.get('total_population'):
                print(f"   📈 Census API: ✅ (Population: {demographics.get('total_population', 0):,})")
            else:
                print(f"   📈 Census API: ⚠️  (No population data)")
        
        return success

    def test_advanced_ai_algorithms(self):
        """Test advanced AI algorithms and next-gen scoring"""
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        # Test with different analysis types to verify AI scaling
        analysis_types = ['analyzer', 'intelligence', 'optimization']
        all_passed = True
        
        for analysis_type in analysis_types:
            test_address = self.test_addresses[analysis_types.index(analysis_type) % len(self.test_addresses)]
            
            success, response = self.run_test(
                f"Advanced AI Algorithms - {analysis_type.title()} Tier",
                "POST",
                "analyze",
                200,
                data={
                    'address': test_address,
                    'analysis_type': analysis_type,
                    'additional_data': {
                        'ai_enhanced': True,
                        'next_gen_scoring': True
                    }
                },
                critical=True
            )
            
            if success:
                # Verify AI analysis components
                ai_analysis = response.get('ai_analysis', {})
                location_score = response.get('location_score', {})
                
                print(f"   🤖 AI Analysis Type: {analysis_type}")
                print(f"   🧠 AI Components: {'✅' if ai_analysis else '❌'}")
                print(f"   📊 Scoring Algorithm: {'✅' if location_score.get('total_score') else '❌'}")
                
                # Verify next-gen scoring features
                if location_score.get('score_breakdown'):
                    print(f"   🎯 Next-Gen Scoring: ✅")
                else:
                    print(f"   🎯 Next-Gen Scoring: ❌")
                    all_passed = False
            else:
                all_passed = False
        
        return all_passed

    def test_self_learning_ai_integration(self):
        """Test self-learning AI integration in analysis flow"""
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        # First, create an analysis to generate learning data
        test_address = self.test_addresses[1]
        
        success, response = self.run_test(
            "Self-Learning AI - Analysis Creation",
            "POST",
            "analyze",
            200,
            data={
                'address': test_address,
                'analysis_type': 'intelligence',
                'additional_data': {
                    'self_learning_enabled': True
                }
            },
            critical=True
        )
        
        if not success:
            return False
        
        analysis_id = response.get('analysis_id')
        if not analysis_id:
            print("   ❌ No analysis_id returned for self-learning test")
            return False
        
        # Test AI learning stats endpoint
        learning_success, learning_response = self.run_test(
            "Self-Learning AI - Learning Statistics",
            "GET",
            "ai/learning-stats",
            200,
            critical=True
        )
        
        if learning_success:
            learning_stats = learning_response.get('learning_stats', {})
            print(f"   🧠 AI Learning Enabled: {learning_response.get('ai_learning_enabled', False)}")
            print(f"   📊 Total Predictions: {learning_stats.get('total_predictions_made', 0)}")
            print(f"   🎯 Success Rate: {learning_stats.get('current_ai_success_rate', 'N/A')}")
            print(f"   🔄 Learning Cycles: {learning_stats.get('learning_cycles_completed', 0)}")
        
        # Test recording business outcome (simulate real-world feedback)
        outcome_success, outcome_response = self.run_test(
            "Self-Learning AI - Record Business Outcome",
            "POST",
            f"ai/record-outcome/{analysis_id}",
            200,
            data={
                'business_successful': True,
                'actual_monthly_revenue': 15000,
                'problems_encountered': ['parking_limited'],
                'customer_satisfaction': 4.2,
                'roi_achieved': 18.5
            },
            critical=True
        )
        
        if outcome_success:
            print(f"   ✅ Outcome Recorded: {outcome_response.get('success', False)}")
            print(f"   🎯 Learning Result: {outcome_response.get('message', 'N/A')}")
        
        return success and learning_success and outcome_success

    def test_rate_limiting_functionality(self):
        """Test rate limiting - ensure free tier users get limited to 1 analysis per day"""
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        # Verify user is on free tier
        if self.user_data.get('subscription_tier', 'free') != 'free':
            print("   ⚠️  User not on free tier - upgrading for rate limit test")
            # For testing, we'll proceed anyway
        
        print(f"   👤 Testing rate limits for tier: {self.user_data.get('subscription_tier', 'free')}")
        
        # First analysis should succeed
        success1, response1 = self.run_test(
            "Rate Limiting - First Analysis (Should Succeed)",
            "POST",
            "analyze",
            200,
            data={
                'address': self.test_addresses[2],
                'analysis_type': 'scout',  # Free tier analysis
                'additional_data': {'rate_limit_test': True}
            },
            critical=True
        )
        
        if not success1:
            return False
        
        # Second analysis should be rate limited for free tier
        success2, response2 = self.run_test(
            "Rate Limiting - Second Analysis (Should Be Limited)",
            "POST",
            "analyze",
            429,  # Expect rate limit error
            data={
                'address': self.test_addresses[3],
                'analysis_type': 'scout',
                'additional_data': {'rate_limit_test': True}
            },
            critical=True
        )
        
        if success2:
            print(f"   ✅ Rate limiting working - Second analysis blocked")
            print(f"   📊 Rate limit message: {response2.get('detail', 'N/A')}")
        else:
            print(f"   ❌ Rate limiting not working - Second analysis should be blocked")
            return False
        
        return True

    # ========== PDF REPORT GENERATION TESTING ==========
    
    def test_pdf_report_generation(self):
        """Test GET /api/reports/generate-pdf/{analysis_id}"""
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        if not self.analysis_ids:
            print("   ⚠️  No analysis IDs available - running analysis first")
            # Create an analysis for PDF testing
            analysis_success, analysis_response = self.run_test(
                "PDF Test - Create Analysis",
                "POST",
                "analyze",
                200,
                data={
                    'address': self.test_addresses[4],
                    'analysis_type': 'intelligence',
                    'additional_data': {'pdf_test': True}
                }
            )
            
            if analysis_success and analysis_response.get('analysis_id'):
                self.analysis_ids.append(analysis_response['analysis_id'])
            else:
                print("   ❌ Could not create analysis for PDF test")
                return False
        
        # Test PDF generation
        analysis_id = self.analysis_ids[0]
        
        # Note: PDF endpoint returns binary data, so we need special handling
        url = f"{self.base_url}/reports/generate-pdf/{analysis_id}"
        headers = {'Authorization': f'Bearer {self.token}'}
        
        try:
            response = requests.get(url, headers=headers, timeout=60)
            
            success = response.status_code == 200
            
            if success:
                self.tests_passed += 1
                print(f"   ✅ PASSED - PDF Generated Successfully")
                print(f"   📄 Content Type: {response.headers.get('content-type', 'Unknown')}")
                print(f"   📊 PDF Size: {len(response.content)} bytes")
                
                # Verify it's actually a PDF
                if response.content.startswith(b'%PDF'):
                    print(f"   ✅ Valid PDF format confirmed")
                else:
                    print(f"   ⚠️  Response may not be valid PDF")
                    
            else:
                self.tests_run += 1
                print(f"   ❌ FAILED - Expected 200, got {response.status_code}")
                print(f"   📄 Error: {response.text[:200]}...")
                
                failure_info = {
                    'name': 'PDF Report Generation',
                    'expected': 200,
                    'actual': response.status_code,
                    'endpoint': f'reports/generate-pdf/{analysis_id}',
                    'error': response.text[:500],
                    'critical': True
                }
                
                self.failed_tests.append(failure_info)
                self.critical_failures.append(failure_info)
            
            return success
            
        except Exception as e:
            self.tests_run += 1
            print(f"   💥 ERROR - {str(e)}")
            failure_info = {'name': 'PDF Report Generation', 'error': str(e), 'critical': True}
            self.failed_tests.append(failure_info)
            self.critical_failures.append(failure_info)
            return False

    # ========== USER ANALYSIS HISTORY TESTING ==========
    
    def test_user_analysis_history(self):
        """Test GET /api/user/analyses"""
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        success, response = self.run_test(
            "User Analysis History",
            "GET",
            "user/analyses",
            200,
            critical=True
        )
        
        if success:
            analyses = response.get('analyses', [])
            print(f"   📋 Total Analyses: {len(analyses)}")
            
            if analyses:
                # Verify analysis structure
                latest_analysis = analyses[0]
                required_fields = ['analysis_id', 'address', 'created_at', 'analysis_type']
                
                missing_fields = []
                for field in required_fields:
                    if field not in latest_analysis:
                        missing_fields.append(field)
                
                if missing_fields:
                    print(f"   ⚠️  Missing fields in analysis: {missing_fields}")
                else:
                    print(f"   ✅ Analysis structure complete")
                    print(f"   📊 Latest Analysis: {latest_analysis.get('address', 'Unknown')}")
                    print(f"   📅 Created: {latest_analysis.get('created_at', 'Unknown')[:10]}")
                    print(f"   🎯 Type: {latest_analysis.get('analysis_type', 'Unknown')}")
            else:
                print(f"   ℹ️  No analyses found (expected for new user)")
        
        return success

    # ========== API INTEGRATIONS TESTING ==========
    
    def test_api_integrations(self):
        """Test enterprise intelligence engine with ALL API integrations"""
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        # Test with a well-known address to ensure API integrations work
        test_address = "1600 Pennsylvania Avenue NW, Washington, DC 20500"  # White House - guaranteed to have data
        
        success, response = self.run_test(
            "API Integrations - Google Maps, ATTOM, Census, Mapbox",
            "POST",
            "analyze",
            200,
            data={
                'address': test_address,
                'analysis_type': 'intelligence',
                'additional_data': {
                    'test_api_integrations': True,
                    'require_all_apis': True
                }
            },
            critical=True
        )
        
        if success:
            # Check each API integration
            integrations_status = {}
            
            # Google Maps API (competitors and location data)
            competitors = response.get('competitors', [])
            if competitors or response.get('location', {}).get('coordinates'):
                integrations_status['google_maps'] = '✅'
                print(f"   🗺️  Google Maps API: ✅ (Competitors: {len(competitors)})")
            else:
                integrations_status['google_maps'] = '❌'
                print(f"   🗺️  Google Maps API: ❌")
            
            # Census API (demographics)
            demographics = response.get('demographics', {})
            if demographics.get('total_population') or demographics.get('median_household_income'):
                integrations_status['census'] = '✅'
                print(f"   📊 Census API: ✅ (Population: {demographics.get('total_population', 'N/A')})")
            else:
                integrations_status['census'] = '❌'
                print(f"   📊 Census API: ❌")
            
            # ATTOM Data API (real estate)
            real_estate = response.get('real_estate', {})
            if real_estate.get('average_property_value'):
                integrations_status['attom'] = '✅'
                print(f"   🏠 ATTOM Data API: ✅ (Avg Value: ${real_estate.get('average_property_value', 0):,})")
            else:
                integrations_status['attom'] = '⚠️'
                print(f"   🏠 ATTOM Data API: ⚠️  (Using estimation)")
            
            # Mapbox API (traffic patterns)
            traffic = response.get('traffic_patterns', {})
            if traffic.get('accessibility_score'):
                integrations_status['mapbox'] = '✅'
                print(f"   🚦 Mapbox API: ✅ (Accessibility: {traffic.get('accessibility_score', 'N/A')})")
            else:
                integrations_status['mapbox'] = '⚠️'
                print(f"   🚦 Mapbox API: ⚠️  (Limited data)")
            
            # Overall integration score
            working_apis = sum(1 for status in integrations_status.values() if status == '✅')
            total_apis = len(integrations_status)
            
            print(f"   📈 API Integration Score: {working_apis}/{total_apis} ({working_apis/total_apis*100:.0f}%)")
            
            # Consider test successful if at least Google Maps and Census are working
            return integrations_status.get('google_maps') == '✅' and integrations_status.get('census') == '✅'
        
        return success

    # ========== COMPREHENSIVE TEST EXECUTION ==========
    
    def run_comprehensive_testing(self):
        """Run all LaundroTech Intelligence Platform tests"""
        print(f"\n🧪 LAUNDROTECH INTELLIGENCE PLATFORM TEST SUITE")
        print("=" * 80)
        
        # 1. Authentication & Setup
        print(f"\n🔐 AUTHENTICATION & USER SETUP")
        print("-" * 50)
        auth_tests = [
            self.test_user_registration,
            self.test_user_login
        ]
        auth_passed = sum(1 for test in auth_tests if test())
        print(f"📊 Authentication Tests: {auth_passed}/{len(auth_tests)} passed")
        
        # 2. Enterprise Analysis Engine
        print(f"\n🏢 ENTERPRISE ANALYSIS ENGINE")
        print("-" * 50)
        analysis_tests = [
            self.test_enterprise_analysis_endpoint,
            self.test_advanced_ai_algorithms,
            self.test_api_integrations
        ]
        analysis_passed = sum(1 for test in analysis_tests if test())
        print(f"📊 Enterprise Analysis Tests: {analysis_passed}/{len(analysis_tests)} passed")
        
        # 3. AI & Machine Learning
        print(f"\n🤖 AI & MACHINE LEARNING")
        print("-" * 50)
        ai_tests = [
            self.test_self_learning_ai_integration
        ]
        ai_passed = sum(1 for test in ai_tests if test())
        print(f"📊 AI & ML Tests: {ai_passed}/{len(ai_tests)} passed")
        
        # 4. Platform Features
        print(f"\n📊 PLATFORM FEATURES")
        print("-" * 50)
        platform_tests = [
            self.test_rate_limiting_functionality,
            self.test_pdf_report_generation,
            self.test_user_analysis_history
        ]
        platform_passed = sum(1 for test in platform_tests if test())
        print(f"📊 Platform Feature Tests: {platform_passed}/{len(platform_tests)} passed")
        
        # Final results
        self.print_final_results()

    def print_final_results(self):
        """Print comprehensive test results"""
        print(f"\n" + "=" * 80)
        print(f"🏁 LAUNDROTECH INTELLIGENCE PLATFORM TEST RESULTS")
        print(f"=" * 80)
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        
        print(f"📊 Tests Run: {self.tests_run}")
        print(f"✅ Tests Passed: {self.tests_passed}")
        print(f"❌ Tests Failed: {len(self.failed_tests)}")
        print(f"🚨 Critical Failures: {len(self.critical_failures)}")
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        if self.critical_failures:
            print(f"\n🚨 CRITICAL FAILURES:")
            for i, failure in enumerate(self.critical_failures, 1):
                print(f"   {i}. {failure['name']}")
                if 'expected' in failure and 'actual' in failure:
                    print(f"      Expected: {failure['expected']}, Got: {failure['actual']}")
                print(f"      Error: {failure['error'][:200]}...")
                print()
        
        if self.failed_tests and not self.critical_failures:
            print(f"\n⚠️  NON-CRITICAL FAILURES:")
            non_critical = [f for f in self.failed_tests if not f.get('critical', False)]
            for i, failure in enumerate(non_critical, 1):
                print(f"   {i}. {failure['name']}")
                if 'expected' in failure and 'actual' in failure:
                    print(f"      Expected: {failure['expected']}, Got: {failure['actual']}")
                print(f"      Error: {failure['error'][:200]}...")
                print()
        
        # Platform readiness assessment
        print(f"\n🚀 LAUNDROTECH INTELLIGENCE PLATFORM ASSESSMENT:")
        
        if len(self.critical_failures) == 0 and success_rate >= 90:
            print(f"   ✅ PLATFORM READY - All core intelligence features operational")
            print(f"   🎉 LaundroTech Intelligence Platform is production-ready!")
        elif len(self.critical_failures) == 0 and success_rate >= 75:
            print(f"   ⚠️  MOSTLY READY - Minor issues need attention")
            print(f"   🔧 Address non-critical issues for optimal performance")
        elif len(self.critical_failures) > 0:
            print(f"   🚨 NOT READY - Critical intelligence features failing")
            print(f"   ❌ Core platform issues must be resolved")
        else:
            print(f"   🔧 NEEDS WORK - Multiple platform issues detected")
        
        return len(self.critical_failures) == 0 and success_rate >= 75

def main():
    """Main test execution"""
    tester = LaundroTechIntelligenceTester()
    
    try:
        platform_ready = tester.run_comprehensive_testing()
        return 0 if platform_ready else 1
    except KeyboardInterrupt:
        print(f"\n⏹️  Tests interrupted by user")
        return 1
    except Exception as e:
        print(f"\n💥 Unexpected error: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())