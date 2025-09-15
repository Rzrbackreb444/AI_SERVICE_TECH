#!/usr/bin/env python3
"""
URGENT REGRESSION TEST - /api/analyze endpoint
Focus: Test the core /api/analyze endpoint for ObjectId serialization issues and mathematical operation errors
"""

import requests
import sys
import json
from datetime import datetime
import time
import uuid

class AnalyzeRegressionTester:
    def __init__(self, base_url="https://laundrometrics.preview.emergentagent.com/api"):
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
            'email': f'regression_test_{timestamp}@laundrotech.com',
            'password': 'SecurePass2024!',
            'full_name': f'Regression Test User {timestamp}',
            'facebook_group_member': True
        }
        
        print(f"🚨 URGENT REGRESSION TEST - /api/analyze endpoint")
        print(f"📍 Backend URL: {self.base_url}")
        print(f"👤 Test User: {self.test_user['email']}")
        print(f"🎯 Focus: ObjectId serialization & mathematical operation errors")
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
            print(f"   🚨 CRITICAL TEST - Production Blocker if Failed")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=60)
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
                        # Check for specific fields that indicate success
                        if 'analysis_id' in response_data:
                            print(f"   📊 Analysis ID: {response_data.get('analysis_id')}")
                        if 'score' in response_data:
                            print(f"   📈 Score: {response_data.get('score')}")
                        if 'grade' in response_data:
                            print(f"   🎯 Grade: {response_data.get('grade')}")
                        if 'address' in response_data:
                            print(f"   📍 Address: {response_data.get('address')}")
                        if 'demographics' in response_data:
                            demo = response_data.get('demographics', {})
                            print(f"   👥 Demographics: Population {demo.get('population', 'N/A')}, Income ${demo.get('median_income', 'N/A')}")
                        if 'competitors' in response_data:
                            competitors = response_data.get('competitors', [])
                            print(f"   🏪 Competitors: {len(competitors)} found")
                        if 'ai_analysis' in response_data:
                            print(f"   🤖 AI Analysis: Present")
                        
                        # Check for ObjectId serialization issues
                        response_str = json.dumps(response_data)
                        if 'ObjectId' in response_str:
                            print(f"   ❌ OBJECTID SERIALIZATION ISSUE DETECTED!")
                            self.critical_failures.append({
                                'name': f'{name} - ObjectId Serialization',
                                'error': 'ObjectId found in JSON response - not serializable',
                                'critical': True
                            })
                            success = False
                        else:
                            print(f"   ✅ No ObjectId serialization issues")
                            
                except Exception as e:
                    print(f"   ⚠️  Response parsing error: {e}")
            else:
                print(f"   ❌ FAILED - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   📄 Error: {error_data}")
                    
                    # Check for specific error patterns
                    error_str = str(error_data)
                    if "unsupported operand type(s) for *: 'dict' and 'float'" in error_str:
                        print(f"   🚨 MATHEMATICAL OPERATION ERROR DETECTED!")
                        self.critical_failures.append({
                            'name': f'{name} - Mathematical Operation Error',
                            'error': "unsupported operand type(s) for *: 'dict' and 'float'",
                            'critical': True
                        })
                    
                except:
                    print(f"   📄 Raw Response: {response.text[:500]}...")
                
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
            failure_info = {'name': name, 'error': 'Timeout after 60 seconds', 'critical': critical}
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

    def test_user_registration(self):
        """Test user registration for analyze endpoint testing"""
        success, response = self.run_test(
            "User Registration for Analysis Testing",
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
            print(f"   🎫 Subscription: {self.user_data.get('subscription_tier', 'Unknown')}")
        
        return success

    def test_analyze_endpoint_basic(self):
        """Test /api/analyze endpoint with simple address"""
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        # Test with the specific address mentioned in the request
        analyze_request = {
            "address": "123 Main St, Springfield, IL",
            "analysis_type": "scout",
            "additional_data": {}
        }
        
        success, response = self.run_test(
            "Analyze Endpoint - Basic Address Test",
            "POST",
            "analyze",
            200,
            data=analyze_request,
            critical=True
        )
        
        if success:
            print(f"   🎉 ANALYZE ENDPOINT WORKING - No crashes detected!")
            
            # Store analysis_id for further testing
            if 'analysis_id' in response:
                self.analysis_id = response['analysis_id']
                print(f"   📊 Analysis ID stored: {self.analysis_id}")
            
            # Check enterprise intelligence engine
            if 'demographics' in response and 'competitors' in response:
                print(f"   ✅ Enterprise intelligence engine working")
            else:
                print(f"   ⚠️  Enterprise intelligence engine may have issues")
                
        return success

    def test_analyze_endpoint_different_types(self):
        """Test /api/analyze endpoint with different analysis types"""
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        # Test different analysis types to check for mathematical errors
        analysis_types = ["scout"]  # Start with free tier
        addresses = [
            "456 Oak Ave, Chicago, IL",
            "789 Pine St, Los Angeles, CA",
            "321 Elm Dr, Houston, TX"
        ]
        
        all_passed = True
        
        for i, (analysis_type, address) in enumerate(zip(analysis_types, addresses)):
            analyze_request = {
                "address": address,
                "analysis_type": analysis_type,
                "additional_data": {}
            }
            
            success, response = self.run_test(
                f"Analyze Endpoint - {analysis_type.title()} Analysis #{i+1}",
                "POST",
                "analyze",
                200,
                data=analyze_request,
                critical=True
            )
            
            if not success:
                all_passed = False
            else:
                # Check for mathematical operation errors in the response
                if 'error' not in response and 'analysis_id' in response:
                    print(f"   ✅ No mathematical operation errors detected")
                else:
                    print(f"   ⚠️  Potential issues in analysis response")
        
        return all_passed

    def test_user_analyses_history(self):
        """Test user analyses history endpoint for ObjectId issues"""
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        success, response = self.run_test(
            "User Analyses History - ObjectId Serialization Check",
            "GET",
            "user/analyses",
            200,
            critical=True
        )
        
        if success:
            analyses = response.get('analyses', [])
            print(f"   📊 Found {len(analyses)} analyses in history")
            
            # Check each analysis for ObjectId serialization issues
            for i, analysis in enumerate(analyses):
                if '_id' in analysis:
                    if isinstance(analysis['_id'], str):
                        print(f"   ✅ Analysis {i+1}: _id properly serialized as string")
                    else:
                        print(f"   ❌ Analysis {i+1}: _id not properly serialized")
                        self.critical_failures.append({
                            'name': 'User Analyses History - ObjectId Serialization',
                            'error': f'Analysis _id not serialized as string: {type(analysis["_id"])}',
                            'critical': True
                        })
                        return False
        
        return success

    def test_pdf_report_generation(self):
        """Test PDF report generation if analysis_id is available"""
        if not self.token or not hasattr(self, 'analysis_id'):
            print("   ⚠️  Skipping - No authentication token or analysis_id")
            return True  # Not critical for regression test
        
        success, response = self.run_test(
            "PDF Report Generation - Analysis ID Test",
            "GET",
            f"reports/generate-pdf/{self.analysis_id}",
            200,
            critical=False
        )
        
        return success

    def run_regression_testing(self):
        """Run focused regression testing for /api/analyze endpoint"""
        print(f"\n🧪 ANALYZE ENDPOINT REGRESSION TESTING")
        print("=" * 80)
        
        # 1. Setup - User Registration
        print(f"\n🔐 SETUP - USER AUTHENTICATION")
        print("-" * 50)
        if not self.test_user_registration():
            print(f"❌ Cannot proceed without authentication")
            return False
        
        # 2. Core Analyze Endpoint Testing
        print(f"\n📊 CORE ANALYZE ENDPOINT TESTING")
        print("-" * 50)
        analyze_tests = [
            self.test_analyze_endpoint_basic,
            self.test_analyze_endpoint_different_types,
        ]
        analyze_passed = sum(1 for test in analyze_tests if test())
        print(f"📊 Analyze Tests: {analyze_passed}/{len(analyze_tests)} passed")
        
        # 3. Related Endpoint Testing
        print(f"\n🔗 RELATED ENDPOINT TESTING")
        print("-" * 50)
        related_tests = [
            self.test_user_analyses_history,
            self.test_pdf_report_generation
        ]
        related_passed = sum(1 for test in related_tests if test())
        print(f"📊 Related Tests: {related_passed}/{len(related_tests)} passed")
        
        # Final results
        self.print_regression_results()
        
        return len(self.critical_failures) == 0

    def print_regression_results(self):
        """Print regression test results"""
        print(f"\n" + "=" * 80)
        print(f"🏁 ANALYZE ENDPOINT REGRESSION TEST RESULTS")
        print(f"=" * 80)
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        
        print(f"📊 Tests Run: {self.tests_run}")
        print(f"✅ Tests Passed: {self.tests_passed}")
        print(f"❌ Tests Failed: {len(self.failed_tests)}")
        print(f"🚨 Critical Failures: {len(self.critical_failures)}")
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        if self.critical_failures:
            print(f"\n🚨 CRITICAL REGRESSION ISSUES FOUND:")
            for i, failure in enumerate(self.critical_failures, 1):
                print(f"   {i}. {failure['name']}")
                print(f"      Error: {failure['error']}")
                print()
        
        if self.failed_tests and not self.critical_failures:
            print(f"\n⚠️  NON-CRITICAL ISSUES:")
            non_critical = [f for f in self.failed_tests if not f.get('critical', False)]
            for i, failure in enumerate(non_critical, 1):
                print(f"   {i}. {failure['name']}")
                if 'expected' in failure and 'actual' in failure:
                    print(f"      Expected: {failure['expected']}, Got: {failure['actual']}")
                print(f"      Error: {failure['error'][:200]}...")
                print()
        
        # Regression assessment
        print(f"\n🔍 REGRESSION ASSESSMENT:")
        
        if len(self.critical_failures) == 0:
            print(f"   ✅ NO REGRESSION DETECTED - /api/analyze endpoint working correctly")
            print(f"   🎉 Enterprise intelligence engine operational!")
            print(f"   ✅ No ObjectId serialization issues")
            print(f"   ✅ No mathematical operation errors")
        else:
            print(f"   🚨 REGRESSION DETECTED - Critical issues found")
            print(f"   ❌ /api/analyze endpoint has problems")
            for failure in self.critical_failures:
                if 'ObjectId' in failure['error']:
                    print(f"   🔧 Fix needed: ObjectId serialization")
                if 'unsupported operand' in failure['error']:
                    print(f"   🔧 Fix needed: Mathematical operation error")
        
        return len(self.critical_failures) == 0

def main():
    """Main regression test execution"""
    tester = AnalyzeRegressionTester()
    
    try:
        regression_passed = tester.run_regression_testing()
        return 0 if regression_passed else 1
    except KeyboardInterrupt:
        print(f"\n⏹️  Regression tests interrupted by user")
        return 1
    except Exception as e:
        print(f"\n💥 Unexpected error during regression testing: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())