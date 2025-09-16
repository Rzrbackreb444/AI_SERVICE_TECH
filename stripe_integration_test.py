#!/usr/bin/env python3
"""
STRIPE INTEGRATION FOCUSED TESTING - Critical Payment Issue Resolution
Tests ONLY Stripe payment integration after backend restart with new API key
"""

import requests
import sys
import json
from datetime import datetime
import time
import uuid

class StripeIntegrationTester:
    def __init__(self, base_url="https://washer-analytics.preview.emergentagent.com/api"):
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
            'email': f'stripe.test_{timestamp}@laundrotech.com',
            'password': 'StripeTest2024!',
            'full_name': f'Stripe Test User {timestamp}',
            'facebook_group_member': True
        }
        
        print(f"🔥 STRIPE INTEGRATION FOCUSED TESTING - CRITICAL PAYMENT ISSUE")
        print(f"📍 Backend URL: {self.base_url}")
        print(f"👤 Test User: {self.test_user['email']}")
        print(f"🎯 Focus: Stripe payment integration after backend restart")
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
            print(f"   🚨 CRITICAL TEST - Payment System Blocker if Failed")
        
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
                    if isinstance(response_data, dict) and len(str(response_data)) <= 500:
                        print(f"   📄 Response: {json.dumps(response_data, indent=2)}")
                except:
                    pass
            else:
                print(f"   ❌ FAILED - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   📄 Error: {error_data}")
                except:
                    print(f"   📄 Raw Response: {response.text[:500]}...")
                
                failure_info = {
                    'name': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'endpoint': endpoint,
                    'error': response.text[:1000],
                    'critical': critical
                }
                
                self.failed_tests.append(failure_info)
                if critical:
                    self.critical_failures.append(failure_info)

            return success, response.json() if response.content else {}

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

    def test_user_registration_and_login(self):
        """Register and login test user for Stripe testing"""
        print(f"\n🔐 USER AUTHENTICATION FOR STRIPE TESTING")
        print("-" * 50)
        
        # Register user
        success, response = self.run_test(
            "User Registration for Stripe Testing",
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
        else:
            print(f"   ❌ Registration failed - cannot proceed with Stripe tests")
            return False

    def test_stripe_api_key_loading(self):
        """Verify that the correct Stripe API key is being loaded from .env"""
        print(f"\n🔑 STRIPE API KEY VERIFICATION")
        print("-" * 50)
        
        # Test by attempting to create a checkout - this will fail if API key is wrong
        success, response = self.run_test(
            "Stripe API Key Loading Verification",
            "POST",
            "payments/checkout",
            200,
            data={
                'offer_type': 'verified_seller',
                'platform': 'facebook_group',
                'payment_method': 'stripe'
            },
            critical=True
        )
        
        if success:
            print(f"   ✅ Stripe API key is correctly loaded and functional")
            print(f"   🔗 Checkout URL generated: {'✅' if response.get('checkout_url') else '❌'}")
            print(f"   🆔 Session ID created: {'✅' if response.get('session_id') else '❌'}")
            return True
        else:
            print(f"   ❌ Stripe API key issue detected")
            # Check if it's an API key error
            error_text = str(response).lower()
            if 'publishable' in error_text or 'secret' in error_text or 'api' in error_text:
                print(f"   🚨 LIKELY API KEY ISSUE: Check if secret key (sk_live_) is being used instead of publishable key (pk_live_)")
            return False

    def test_stripe_checkout_creation_all_offers(self):
        """Test Stripe checkout creation for all offer types"""
        print(f"\n💳 STRIPE CHECKOUT CREATION - ALL OFFER TYPES")
        print("-" * 50)
        
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        offer_types = ['verified_seller', 'vendor_partner', 'verified_funder']
        all_passed = True
        checkout_sessions = {}
        
        for offer_type in offer_types:
            success, response = self.run_test(
                f"Stripe Checkout Creation - {offer_type}",
                "POST",
                "payments/checkout",
                200,
                data={
                    'offer_type': offer_type,
                    'platform': 'facebook_group',
                    'payment_method': 'stripe'
                },
                critical=True
            )
            
            if success:
                print(f"   🔗 Checkout URL: {'✅' if response.get('checkout_url') else '❌'}")
                print(f"   🆔 Session ID: {'✅' if response.get('session_id') else '❌'}")
                print(f"   💰 Amount: ${response.get('amount', 0)}")
                
                # Store session ID for webhook testing
                if response.get('session_id'):
                    checkout_sessions[offer_type] = response.get('session_id')
                    
                # Verify checkout URL format
                checkout_url = response.get('checkout_url', '')
                if 'stripe.com' in checkout_url or 'checkout.stripe.com' in checkout_url:
                    print(f"   ✅ Valid Stripe checkout URL format")
                else:
                    print(f"   ❌ Invalid checkout URL format: {checkout_url}")
                    all_passed = False
            else:
                all_passed = False
                print(f"   ❌ Failed to create checkout for {offer_type}")
        
        # Store for webhook testing
        self.stripe_sessions = checkout_sessions
        return all_passed

    def test_stripe_webhook_processing(self):
        """Test Stripe webhook endpoint processing"""
        print(f"\n🔗 STRIPE WEBHOOK PROCESSING")
        print("-" * 50)
        
        # Test with mock Stripe webhook payload
        test_session_id = "cs_test_stripe_integration_12345"
        stripe_webhook_payload = {
            "type": "checkout.session.completed",
            "data": {
                "object": {
                    "id": test_session_id,
                    "payment_status": "paid",
                    "amount_total": 2900,  # $29.00 in cents
                    "currency": "usd",
                    "metadata": {
                        "user_id": self.user_data.get('id') if self.user_data else 'test_user',
                        "offer_type": "verified_seller",
                        "platform": "facebook_group"
                    }
                }
            }
        }
        
        success, response = self.run_test(
            "Stripe Webhook Processing",
            "POST",
            "webhook/stripe",
            200,
            data=stripe_webhook_payload,
            critical=True
        )
        
        if success:
            print(f"   ✅ Webhook processed successfully")
            print(f"   📄 Response: {response}")
            return True
        else:
            print(f"   ❌ Webhook processing failed")
            return False

    def test_payment_transaction_flow(self):
        """Test complete payment transaction flow"""
        print(f"\n🔄 COMPLETE PAYMENT TRANSACTION FLOW")
        print("-" * 50)
        
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        # Step 1: Create checkout
        print(f"   Step 1: Creating Stripe checkout...")
        success, checkout_response = self.run_test(
            "Transaction Flow - Create Checkout",
            "POST",
            "payments/checkout",
            200,
            data={
                'offer_type': 'vendor_partner',
                'platform': 'facebook_group',
                'payment_method': 'stripe'
            },
            critical=True
        )
        
        if not success:
            print(f"   ❌ Transaction flow failed at checkout creation")
            return False
        
        session_id = checkout_response.get('session_id')
        if not session_id:
            print(f"   ❌ No session ID returned from checkout creation")
            return False
        
        print(f"   ✅ Checkout created with session ID: {session_id}")
        
        # Step 2: Check payment status (should be pending)
        print(f"   Step 2: Checking initial payment status...")
        success, status_response = self.run_test(
            "Transaction Flow - Check Status",
            "GET",
            f"payments/status/{session_id}",
            200,
            critical=True
        )
        
        if success:
            status = status_response.get('status', 'unknown')
            print(f"   📊 Payment Status: {status}")
            if status in ['pending', 'incomplete', 'open']:
                print(f"   ✅ Correct initial status for new checkout")
            else:
                print(f"   ⚠️  Unexpected initial status: {status}")
        
        # Step 3: Simulate webhook completion
        print(f"   Step 3: Simulating successful payment webhook...")
        webhook_payload = {
            "type": "checkout.session.completed",
            "data": {
                "object": {
                    "id": session_id,
                    "payment_status": "paid",
                    "amount_total": 14900,  # $149.00 in cents
                    "currency": "usd",
                    "metadata": {
                        "user_id": self.user_data.get('id'),
                        "offer_type": "vendor_partner",
                        "platform": "facebook_group"
                    }
                }
            }
        }
        
        webhook_success, webhook_response = self.run_test(
            "Transaction Flow - Webhook Completion",
            "POST",
            "webhook/stripe",
            200,
            data=webhook_payload,
            critical=True
        )
        
        if webhook_success:
            print(f"   ✅ Webhook processed successfully")
        
        # Step 4: Verify transaction was recorded
        print(f"   Step 4: Verifying transaction recording...")
        success, transactions_response = self.run_test(
            "Transaction Flow - Verify Recording",
            "GET",
            "user/transactions",
            200,
            critical=True
        )
        
        if success:
            transactions = transactions_response.get('transactions', [])
            print(f"   📋 Total transactions: {len(transactions)}")
            
            # Look for our transaction
            our_transaction = None
            for trans in transactions:
                if trans.get('session_id') == session_id:
                    our_transaction = trans
                    break
            
            if our_transaction:
                print(f"   ✅ Transaction recorded successfully")
                print(f"   💰 Amount: ${our_transaction.get('amount', 0)}")
                print(f"   📊 Status: {our_transaction.get('payment_status', 'unknown')}")
                print(f"   🏷️  Offer: {our_transaction.get('offer_type', 'unknown')}")
                return True
            else:
                print(f"   ❌ Transaction not found in user's transaction history")
                return False
        
        return False

    def test_stripe_error_handling(self):
        """Test Stripe error handling with invalid data"""
        print(f"\n🚨 STRIPE ERROR HANDLING")
        print("-" * 50)
        
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        # Test with invalid offer type
        success, response = self.run_test(
            "Error Handling - Invalid Offer Type",
            "POST",
            "payments/checkout",
            400,  # Should return 400 for invalid offer
            data={
                'offer_type': 'invalid_offer_type',
                'platform': 'facebook_group',
                'payment_method': 'stripe'
            }
        )
        
        if success:
            print(f"   ✅ Correctly rejected invalid offer type")
        
        # Test with missing required fields
        success2, response2 = self.run_test(
            "Error Handling - Missing Fields",
            "POST",
            "payments/checkout",
            422,  # Should return 422 for validation error
            data={
                'payment_method': 'stripe'
                # Missing offer_type and platform
            }
        )
        
        if success2:
            print(f"   ✅ Correctly handled missing required fields")
        
        return success or success2  # Pass if at least one error handling test works

    def run_stripe_integration_tests(self):
        """Run all Stripe integration tests"""
        print(f"\n🧪 STRIPE INTEGRATION TEST SUITE")
        print("=" * 80)
        
        # Test sequence
        tests = [
            ("User Authentication", self.test_user_registration_and_login),
            ("Stripe API Key Loading", self.test_stripe_api_key_loading),
            ("Stripe Checkout Creation", self.test_stripe_checkout_creation_all_offers),
            ("Stripe Webhook Processing", self.test_stripe_webhook_processing),
            ("Payment Transaction Flow", self.test_payment_transaction_flow),
            ("Stripe Error Handling", self.test_stripe_error_handling)
        ]
        
        passed_tests = 0
        for test_name, test_func in tests:
            print(f"\n🔍 Running: {test_name}")
            try:
                if test_func():
                    passed_tests += 1
                    print(f"   ✅ {test_name}: PASSED")
                else:
                    print(f"   ❌ {test_name}: FAILED")
            except Exception as e:
                print(f"   💥 {test_name}: ERROR - {e}")
        
        print(f"\n📊 Test Summary: {passed_tests}/{len(tests)} tests passed")
        
        # Final results
        self.print_stripe_test_results()
        
        return len(self.critical_failures) == 0 and passed_tests >= len(tests) * 0.8

    def print_stripe_test_results(self):
        """Print Stripe integration test results"""
        print(f"\n" + "=" * 80)
        print(f"🔥 STRIPE INTEGRATION TEST RESULTS")
        print(f"=" * 80)
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        
        print(f"📊 Tests Run: {self.tests_run}")
        print(f"✅ Tests Passed: {self.tests_passed}")
        print(f"❌ Tests Failed: {len(self.failed_tests)}")
        print(f"🚨 Critical Failures: {len(self.critical_failures)}")
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        if self.critical_failures:
            print(f"\n🚨 CRITICAL STRIPE FAILURES:")
            for i, failure in enumerate(self.critical_failures, 1):
                print(f"   {i}. {failure['name']}")
                if 'expected' in failure and 'actual' in failure:
                    print(f"      Expected: {failure['expected']}, Got: {failure['actual']}")
                print(f"      Error: {failure['error'][:500]}...")
                print()
        
        # Stripe readiness assessment
        print(f"\n💳 STRIPE INTEGRATION READINESS:")
        
        if len(self.critical_failures) == 0 and success_rate >= 90:
            print(f"   ✅ STRIPE INTEGRATION READY")
            print(f"   🚀 New API key is working correctly!")
            print(f"   💰 All payment flows operational")
            print(f"   🔗 Webhook processing functional")
        elif len(self.critical_failures) == 0 and success_rate >= 75:
            print(f"   ⚠️  MOSTLY READY - Minor issues need attention")
            print(f"   🔧 Address non-critical issues before production")
        else:
            print(f"   🚨 NOT READY - Critical Stripe integration failures")
            print(f"   ❌ Payment system will not work properly")
            print(f"   🔧 Check API key configuration and error details above")
        
        return len(self.critical_failures) == 0 and success_rate >= 75

def main():
    """Main test execution"""
    tester = StripeIntegrationTester()
    
    try:
        stripe_ready = tester.run_stripe_integration_tests()
        return 0 if stripe_ready else 1
    except KeyboardInterrupt:
        print(f"\n⏹️  Tests interrupted by user")
        return 1
    except Exception as e:
        print(f"\n💥 Unexpected error: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())