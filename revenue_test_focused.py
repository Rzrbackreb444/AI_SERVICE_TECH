#!/usr/bin/env python3
"""
FOCUSED REVENUE OPTIMIZATION ENDPOINTS TESTING
Test the specific endpoints mentioned in the review request
"""

import requests
import json
from datetime import datetime
import uuid

class FocusedRevenueTester:
    def __init__(self, base_url="https://smartlaundry.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.user_data = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        
        # Generate unique test user
        unique_id = str(uuid.uuid4())[:8]
        self.test_user = {
            'email': f'revenue.test.{unique_id}@laundrotech.com',
            'password': 'RevenueTest2024!',
            'full_name': f'Revenue Tester {unique_id}',
            'facebook_group_member': True
        }
        
        print(f"💰 FOCUSED REVENUE OPTIMIZATION TESTING")
        print(f"📍 Backend URL: {self.base_url}")
        print(f"👤 Test User: {self.test_user['email']}")
        print("=" * 80)

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Test {self.tests_run}: {name}")
        print(f"   {method} /{endpoint}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)
            
            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                print(f"   ✅ PASSED - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   📄 Response keys: {list(response_data.keys())}")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"   ❌ FAILED - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   📄 Error: {error_data}")
                except:
                    print(f"   📄 Raw Response: {response.text[:200]}")
                
                self.failed_tests.append({
                    'name': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'error': response.text[:300]
                })
                return False, {}
                
        except Exception as e:
            print(f"   💥 ERROR - {str(e)}")
            self.failed_tests.append({'name': name, 'error': str(e)})
            return False, {}

    def setup_auth(self):
        """Set up authentication"""
        print(f"\n🔐 SETTING UP AUTHENTICATION")
        
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
            print(f"   🔑 Token acquired successfully")
            return True
        
        # Try login if registration failed
        print(f"   🔄 Registration failed, trying login...")
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
            self.token = response['access_token']
            self.user_data = response.get('user', {})
            print(f"   🔑 Token acquired via login")
            return True
        
        return False

    def test_preview_analysis_endpoint(self):
        """Test POST /api/revenue/analysis/preview"""
        print(f"\n📊 TESTING PREVIEW ANALYSIS ENDPOINT")
        print("-" * 50)
        
        test_addresses = [
            "The Wash Room Phoenix Ave, Fort Smith, AR",
            "Vista Laundry, Van Buren, AR"
        ]
        
        strategies = ['blur_critical_data', 'teaser_insights']
        all_passed = True
        
        for address in test_addresses:
            for strategy in strategies:
                success, response = self.run_test(
                    f"Preview Analysis - {strategy}",
                    "POST",
                    "revenue/analysis/preview",
                    200,
                    data={
                        'address': address,
                        'strategy': strategy
                    }
                )
                
                if success:
                    print(f"   ✅ Preview generated for {address}")
                    print(f"   📊 Strategy: {strategy}")
                    print(f"   🎯 Conversion Strategy: {response.get('conversion_strategy', 'N/A')}")
                    print(f"   💰 Has Upgrade Incentives: {bool(response.get('upgrade_incentives'))}")
                else:
                    all_passed = False
        
        return all_passed

    def test_depth_based_analysis_endpoint(self):
        """Test POST /api/revenue/analysis/depth-based"""
        print(f"\n📊 TESTING DEPTH-BASED ANALYSIS ENDPOINT")
        print("-" * 50)
        
        test_address = "The Wash Room Phoenix Ave, Fort Smith, AR"
        depth_levels = [1, 2, 3, 4, 5]
        expected_pricing = {1: 0, 2: 29, 3: 79, 4: 199, 5: 299}
        
        all_passed = True
        
        for depth_level in depth_levels:
            success, response = self.run_test(
                f"Depth Analysis - Level {depth_level}",
                "POST",
                "revenue/analysis/depth-based",
                200,
                data={
                    'address': test_address,
                    'depth_level': depth_level
                }
            )
            
            if success:
                analysis = response.get('analysis', {})
                billing_info = response.get('billing_info', {})
                
                print(f"   ✅ Level {depth_level} analysis generated")
                print(f"   💳 Billing Info Present: {bool(billing_info)}")
                
                # Check pricing structure
                if billing_info and 'price' in billing_info:
                    actual_price = billing_info['price']
                    expected_price = expected_pricing.get(depth_level, 0)
                    if actual_price == expected_price:
                        print(f"   💰 Correct Pricing: ${actual_price}")
                    else:
                        print(f"   ❌ Pricing Issue: Expected ${expected_price}, got ${actual_price}")
                        all_passed = False
            else:
                all_passed = False
        
        return all_passed

    def test_revenue_strategy_endpoints(self):
        """Test revenue strategy endpoints"""
        print(f"\n📊 TESTING REVENUE STRATEGY ENDPOINTS")
        print("-" * 50)
        
        all_passed = True
        
        # Test 1: Revenue Forecast
        success, response = self.run_test(
            "Revenue Forecast",
            "GET",
            "revenue/strategy/revenue-forecast",
            200
        )
        
        if success:
            forecast = response.get('revenue_forecast', {})
            print(f"   📈 Current Revenue: ${forecast.get('current_monthly_revenue', 0):,}")
            print(f"   🚀 Optimized Revenue: ${forecast.get('optimized_monthly_revenue', 0):,}")
            print(f"   💰 Annual Impact: ${forecast.get('annual_revenue_impact', 0):,}")
        else:
            all_passed = False
        
        # Test 2: Dynamic Pricing
        test_address = "The Wash Room Phoenix Ave, Fort Smith, AR"
        success, response = self.run_test(
            "Dynamic Pricing",
            "GET",
            f"revenue/pricing/dynamic/{test_address}",
            200
        )
        
        if success:
            pricing = response.get('dynamic_pricing', {})
            print(f"   💰 Base Price: ${pricing.get('base_price', 0)}")
            print(f"   📊 Dynamic Price: ${pricing.get('dynamic_price', 0)}")
            print(f"   📈 Adjustment: {pricing.get('price_adjustment', '0%')}")
        else:
            all_passed = False
        
        # Test 3: Upgrade Flow
        success, response = self.run_test(
            "Upgrade Flow",
            "POST",
            "revenue/analysis/upgrade-flow",
            200,
            data={
                'preview_id': 'test_preview_12345',
                'selected_tier': 'business_intelligence'
            }
        )
        
        if success:
            upgrade_flow = response.get('upgrade_flow', {})
            print(f"   🎚️  Selected Tier: {upgrade_flow.get('selected_tier', 'N/A')}")
            print(f"   💰 Original Price: ${upgrade_flow.get('original_price', 0)}")
            print(f"   💸 Upgrade Price: ${upgrade_flow.get('upgrade_price', 0)}")
        else:
            all_passed = False
        
        return all_passed

    def test_integration_flow(self):
        """Test complete integration flow"""
        print(f"\n🔗 TESTING INTEGRATION FLOW")
        print("-" * 50)
        
        test_address = "Vista Laundry, Van Buren, AR"
        
        # Step 1: Preview
        success1, preview_response = self.run_test(
            "Integration - Preview",
            "POST",
            "revenue/analysis/preview",
            200,
            data={
                'address': test_address,
                'strategy': 'blur_critical_data'
            }
        )
        
        # Step 2: Depth Analysis
        success2, depth_response = self.run_test(
            "Integration - Depth Analysis",
            "POST",
            "revenue/analysis/depth-based",
            200,
            data={
                'address': test_address,
                'depth_level': 3
            }
        )
        
        # Step 3: Dynamic Pricing
        success3, pricing_response = self.run_test(
            "Integration - Dynamic Pricing",
            "GET",
            f"revenue/pricing/dynamic/{test_address}",
            200
        )
        
        if success1 and success2 and success3:
            print(f"   ✅ Complete Integration Chain: WORKING")
            print(f"   🔗 Frontend can successfully communicate with all endpoints")
            return True
        else:
            print(f"   ❌ Integration chain broken")
            return False

    def run_all_tests(self):
        """Run all focused revenue tests"""
        print(f"\n🚀 STARTING FOCUSED REVENUE OPTIMIZATION TESTING")
        
        # Setup authentication
        if not self.setup_auth():
            print(f"❌ Authentication failed - cannot proceed")
            return False
        
        # Run tests
        tests = [
            ("Preview Analysis Endpoint", self.test_preview_analysis_endpoint),
            ("Depth-Based Analysis Endpoint", self.test_depth_based_analysis_endpoint),
            ("Revenue Strategy Endpoints", self.test_revenue_strategy_endpoints),
            ("Integration Flow", self.test_integration_flow)
        ]
        
        results = []
        for test_name, test_func in tests:
            try:
                result = test_func()
                results.append(result)
                print(f"   {'✅' if result else '❌'} {test_name}: {'PASSED' if result else 'FAILED'}")
            except Exception as e:
                print(f"   💥 {test_name}: ERROR - {e}")
                results.append(False)
        
        # Print final results
        self.print_final_results(results)
        return all(results)

    def print_final_results(self, results):
        """Print final test results"""
        print(f"\n" + "=" * 80)
        print(f"🏁 FOCUSED REVENUE OPTIMIZATION TEST RESULTS")
        print(f"=" * 80)
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        
        print(f"📊 Tests Run: {self.tests_run}")
        print(f"✅ Tests Passed: {self.tests_passed}")
        print(f"❌ Tests Failed: {len(self.failed_tests)}")
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        if self.failed_tests:
            print(f"\n❌ FAILED TESTS:")
            for failure in self.failed_tests:
                print(f"   • {failure['name']}: {failure.get('error', 'Unknown error')}")
        
        print(f"\n💰 REVENUE OPTIMIZATION ASSESSMENT:")
        
        if success_rate >= 90:
            print(f"   ✅ REVENUE OPTIMIZATION READY")
            print(f"   🎯 Preview/Blur Strategy: OPERATIONAL")
            print(f"   📊 Pay-Per-Depth System: OPERATIONAL")
            print(f"   💰 Revenue Strategy Endpoints: OPERATIONAL")
            print(f"   🔗 Frontend Integration: READY")
        elif success_rate >= 75:
            print(f"   ⚠️  MOSTLY READY - Minor issues detected")
            print(f"   🔧 Address issues before full deployment")
        else:
            print(f"   🚨 NOT READY - Critical failures detected")
            print(f"   ❌ Cannot deploy revenue optimization features")

if __name__ == "__main__":
    tester = FocusedRevenueTester()
    success = tester.run_all_tests()
    exit(0 if success else 1)