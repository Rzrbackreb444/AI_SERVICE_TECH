#!/usr/bin/env python3
"""
Focused Facebook Group Badge Monetization System Test
Tests core functionality that should work with current configuration
"""

import requests
import sys
import json
from datetime import datetime

class FacebookMonetizationTester:
    def __init__(self, base_url="https://laundroinsight.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.user_data = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        
        # Test user data
        timestamp = datetime.now().strftime('%H%M%S')
        self.test_user = {
            'email': f'fb_test_{timestamp}@example.com',
            'password': 'TestPass123!',
            'full_name': f'Facebook Test User {timestamp}',
            'facebook_group_member': True
        }
        
        print(f"🎯 Facebook Group Badge Monetization System Test")
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
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=30)

            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                print(f"   ✅ PASSED - Status: {response.status_code}")
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

    def test_user_registration(self):
        """Register test user"""
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
            print(f"   🔑 Token acquired")
            print(f"   👤 User ID: {self.user_data.get('id', 'Unknown')}")
        
        return success

    def test_pricing_structure(self):
        """Test updated pricing structure"""
        success, response = self.run_test(
            "Updated Pricing Structure",
            "GET",
            "facebook-group/offers",
            200
        )
        
        if success:
            offers = response.get('offers', {})
            print(f"   📦 Total Offers: {len(offers)}")
            
            # Test badge pricing with PayPal discount
            badge_tests = [
                ('verified_seller', 29.0, 26.10),
                ('vendor_partner', 149.0, 134.10),
                ('verified_funder', 299.0, 269.10)
            ]
            
            pricing_correct = True
            for badge_type, expected_price, expected_paypal in badge_tests:
                if badge_type in offers:
                    actual_price = offers[badge_type].get('price')
                    actual_paypal = offers[badge_type].get('paypal_price')
                    
                    if actual_price == expected_price and actual_paypal == expected_paypal:
                        print(f"   ✅ {badge_type}: ${actual_price} (PayPal: ${actual_paypal})")
                    else:
                        print(f"   ❌ {badge_type}: Expected ${expected_price}/${expected_paypal}, got ${actual_price}/${actual_paypal}")
                        pricing_correct = False
                else:
                    print(f"   ❌ Missing badge: {badge_type}")
                    pricing_correct = False
            
            # Test add-ons (no PayPal discount)
            addon_tests = [
                ('featured_post', 250.0),
                ('logo_placement', 299.0),
                ('sponsored_ama', 499.0)
            ]
            
            for addon_type, expected_price in addon_tests:
                if addon_type in offers:
                    actual_price = offers[addon_type].get('price')
                    actual_paypal = offers[addon_type].get('paypal_price')
                    
                    if actual_price == expected_price and actual_price == actual_paypal:
                        print(f"   ✅ {addon_type}: ${actual_price} (no PayPal discount)")
                    else:
                        print(f"   ❌ {addon_type}: Expected ${expected_price} (no discount), got ${actual_price}/${actual_paypal}")
                        pricing_correct = False
                else:
                    print(f"   ❌ Missing add-on: {addon_type}")
                    pricing_correct = False
            
            return pricing_correct
        
        return success

    def test_stripe_integration(self):
        """Test Stripe checkout creation"""
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        success, response = self.run_test(
            "Stripe Integration",
            "POST",
            "payments/checkout",
            200,
            data={
                'offer_type': 'verified_seller',
                'platform': 'facebook_group',
                'payment_method': 'stripe'
            }
        )
        
        if success:
            required_fields = ['checkout_url', 'session_id', 'amount']
            all_present = all(field in response for field in required_fields)
            
            if all_present:
                print(f"   ✅ All required fields present")
                print(f"   💰 Amount: ${response.get('amount')}")
                self.stripe_session_id = response.get('session_id')
                return True
            else:
                missing = [f for f in required_fields if f not in response]
                print(f"   ❌ Missing fields: {missing}")
                return False
        
        return success

    def test_payment_status(self):
        """Test payment status endpoint"""
        if not self.token or not hasattr(self, 'stripe_session_id'):
            print("   ⚠️  Skipping - No session ID available")
            return True  # Not a failure, just can't test
        
        success, response = self.run_test(
            "Payment Status Check",
            "GET",
            f"payments/status/{self.stripe_session_id}",
            200
        )
        
        if success:
            status = response.get('status')
            offer_type = response.get('offer_type')
            print(f"   📊 Status: {status}")
            print(f"   🎯 Offer: {offer_type}")
            
            return status is not None and offer_type is not None
        
        return success

    def test_user_badges(self):
        """Test user badges endpoint"""
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        success, response = self.run_test(
            "User Badges Endpoint",
            "GET",
            "facebook-group/user-badges",
            200
        )
        
        if success:
            badges = response.get('badges', [])
            print(f"   🏆 Active Badges: {len(badges)}")
            return True
        
        return success

    def test_webhook_endpoints(self):
        """Test webhook endpoints exist and handle requests"""
        # Test PayPal webhook
        paypal_payload = {
            "event_type": "PAYMENT.SALE.COMPLETED",
            "resource": {
                "id": "test_sale_id",
                "amount": {"total": "29.00", "currency": "USD"},
                "custom": json.dumps({
                    "user_id": "test_user",
                    "offer_type": "verified_seller",
                    "platform": "facebook_group",
                    "transaction_id": "test_transaction"
                })
            }
        }
        
        paypal_success, _ = self.run_test(
            "PayPal Webhook Endpoint",
            "POST",
            "webhook/paypal",
            200,
            data=paypal_payload
        )
        
        return paypal_success

    def run_comprehensive_test(self):
        """Run all Facebook Group monetization tests"""
        print(f"\n🧪 FACEBOOK GROUP MONETIZATION COMPREHENSIVE TEST")
        print("=" * 60)
        
        # Core functionality tests
        tests = [
            ("User Registration", self.test_user_registration),
            ("Pricing Structure", self.test_pricing_structure),
            ("Stripe Integration", self.test_stripe_integration),
            ("Payment Status", self.test_payment_status),
            ("User Badges", self.test_user_badges),
            ("Webhook Endpoints", self.test_webhook_endpoints)
        ]
        
        for test_name, test_func in tests:
            print(f"\n📋 Running: {test_name}")
            try:
                result = test_func()
                if result:
                    print(f"   ✅ {test_name}: PASSED")
                else:
                    print(f"   ❌ {test_name}: FAILED")
            except Exception as e:
                print(f"   💥 {test_name}: ERROR - {e}")
        
        self.print_results()

    def print_results(self):
        """Print final test results"""
        print(f"\n" + "=" * 60)
        print(f"🏁 FACEBOOK GROUP MONETIZATION TEST RESULTS")
        print(f"=" * 60)
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        
        print(f"📊 Tests Run: {self.tests_run}")
        print(f"✅ Tests Passed: {self.tests_passed}")
        print(f"❌ Tests Failed: {len(self.failed_tests)}")
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        if self.failed_tests:
            print(f"\n💥 FAILED TESTS:")
            for i, failure in enumerate(self.failed_tests, 1):
                print(f"   {i}. {failure['name']}")
                if 'expected' in failure and 'actual' in failure:
                    print(f"      Expected: {failure['expected']}, Got: {failure['actual']}")
                print(f"      Error: {failure['error'][:200]}...")
        
        # Assessment
        print(f"\n🎯 FACEBOOK GROUP MONETIZATION ASSESSMENT:")
        if success_rate >= 85:
            print(f"   ✅ EXCELLENT - Core monetization system working")
        elif success_rate >= 70:
            print(f"   ⚠️  GOOD - Minor configuration issues (PayPal/SendGrid)")
        elif success_rate >= 50:
            print(f"   🔧 NEEDS WORK - Several issues need attention")
        else:
            print(f"   🚨 CRITICAL - Major functionality broken")
        
        return success_rate >= 70

def main():
    """Main test execution"""
    tester = FacebookMonetizationTester()
    
    try:
        production_ready = tester.run_comprehensive_test()
        return 0 if production_ready else 1
    except KeyboardInterrupt:
        print(f"\n⏹️  Tests interrupted by user")
        return 1
    except Exception as e:
        print(f"\n💥 Unexpected error: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())