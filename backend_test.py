#!/usr/bin/env python3
"""
COMPREHENSIVE FINAL TESTING - Complete Enterprise-Grade Facebook Group Badge Monetization System
Tests all critical areas for production deployment to 67K member Facebook group
"""

import requests
import sys
import json
from datetime import datetime
import time
import uuid

class ComprehensiveFinalTester:
    def __init__(self, base_url="https://site-analytics-6.preview.emergentagent.com/api"):
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
            'email': f'john.smith_{timestamp}@laundrotech.com',
            'password': 'SecurePass2024!',
            'full_name': f'John Smith {timestamp}',
            'facebook_group_member': True
        }
        
        print(f"🚀 COMPREHENSIVE FINAL TESTING - Enterprise Facebook Group Badge System")
        print(f"📍 Backend URL: {self.base_url}")
        print(f"👤 Test User: {self.test_user['email']}")
        print(f"🎯 Target: 67K Member Facebook Group Deployment")
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

    # ========== AUTHENTICATION & USER MANAGEMENT ==========
    
    def test_user_registration(self):
        """Test user registration with realistic data"""
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
            print(f"   🎫 Subscription: {self.user_data.get('subscription_tier', 'Unknown')}")
        
        return success

    def test_user_login(self):
        """Test user login functionality"""
        success, response = self.run_test(
            "User Login",
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

    # ========== FACEBOOK GROUP OFFERS & PRICING ==========
    
    def test_facebook_group_offers_pricing(self):
        """Test Facebook Group offers with updated pricing structure"""
        success, response = self.run_test(
            "Facebook Group Offers - Updated Pricing Structure",
            "GET",
            "facebook-group/offers",
            200,
            critical=True
        )
        
        if success:
            offers = response.get('offers', {})
            print(f"   📦 Found {len(offers)} offers")
            
            # Test specific pricing structure ($29/$149/$299)
            expected_badges = {
                'verified_seller': {'price': 29.0, 'paypal_price': 26.10},
                'vendor_partner': {'price': 149.0, 'paypal_price': 134.10},
                'verified_funder': {'price': 299.0, 'paypal_price': 269.10}
            }
            
            pricing_correct = True
            for badge_type, expected in expected_badges.items():
                if badge_type in offers:
                    actual_price = offers[badge_type].get('price')
                    actual_paypal = offers[badge_type].get('paypal_price')
                    print(f"   💰 {badge_type}: ${actual_price} (PayPal: ${actual_paypal})")
                    
                    if actual_price != expected['price']:
                        print(f"   ❌ Price mismatch for {badge_type}: expected ${expected['price']}, got ${actual_price}")
                        pricing_correct = False
                    if actual_paypal != expected['paypal_price']:
                        print(f"   ❌ PayPal price mismatch for {badge_type}: expected ${expected['paypal_price']}, got ${actual_paypal}")
                        pricing_correct = False
                else:
                    print(f"   ❌ Missing badge type: {badge_type}")
                    pricing_correct = False
            
            # Test Sponsored AMA at $499/event
            if 'sponsored_ama' in offers:
                ama_price = offers['sponsored_ama'].get('price')
                if ama_price == 499.0:
                    print(f"   ✅ Sponsored AMA: ${ama_price} (correct)")
                else:
                    print(f"   ❌ Sponsored AMA price incorrect: expected $499, got ${ama_price}")
                    pricing_correct = False
            
            # Test add-ons (no PayPal discount)
            add_ons = ['featured_post', 'logo_placement', 'sponsored_ama']
            for addon in add_ons:
                if addon in offers:
                    price = offers[addon].get('price')
                    paypal_price = offers[addon].get('paypal_price')
                    if price != paypal_price:
                        print(f"   ❌ Add-on {addon} should have no PayPal discount: ${price} vs ${paypal_price}")
                        pricing_correct = False
                    else:
                        print(f"   ✅ {addon}: ${price} (no PayPal discount)")
            
            if not pricing_correct:
                self.critical_failures.append({
                    'name': 'Pricing Structure Validation',
                    'error': 'Pricing structure does not match requirements',
                    'critical': True
                })
        
        return success

    # ========== PAYMENT INTEGRATION TESTING ==========
    
    def test_stripe_checkout_creation(self):
        """Test Stripe checkout creation for all badge types"""
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        badge_types = ['verified_seller', 'vendor_partner', 'verified_funder']
        all_passed = True
        
        for badge_type in badge_types:
            success, response = self.run_test(
                f"Stripe Checkout Creation - {badge_type}",
                "POST",
                "payments/checkout",
                200,
                data={
                    'offer_type': badge_type,
                    'platform': 'facebook_group',
                    'payment_method': 'stripe'
                },
                critical=True
            )
            
            if success:
                print(f"   🔗 Checkout URL: {'✅' if response.get('checkout_url') else '❌'}")
                print(f"   🆔 Session ID: {'✅' if response.get('session_id') else '❌'}")
                print(f"   💰 Amount: ${response.get('amount', 0)}")
                
                # Store session ID for status testing
                if badge_type == 'verified_seller':
                    self.stripe_session_id = response.get('session_id')
            else:
                all_passed = False
        
        return all_passed
    
    def test_paypal_checkout_with_discount(self):
        """Test PayPal checkout creation with 10% discount logic"""
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        success, response = self.run_test(
            "PayPal Checkout - Badge with 10% Discount",
            "POST",
            "payments/checkout",
            200,
            data={
                'offer_type': 'vendor_partner',
                'platform': 'facebook_group',
                'payment_method': 'paypal'
            },
            critical=True
        )
        
        if success:
            print(f"   🔗 Approval URL: {'✅' if response.get('approval_url') else '❌'}")
            print(f"   🆔 Payment ID: {'✅' if response.get('payment_id') else '❌'}")
            print(f"   💰 Final Amount: ${response.get('amount', 0)}")
            print(f"   💰 Original Price: ${response.get('original_price', 0)}")
            print(f"   💸 Discount: ${response.get('discount', 0)}")
            print(f"   ✅ Discount Applied: {response.get('discount_applied', False)}")
            
            # Verify 10% discount for badges
            if response.get('discount_applied'):
                expected_discount = response.get('original_price', 0) * 0.1
                actual_discount = response.get('discount', 0)
                if abs(expected_discount - actual_discount) < 0.01:
                    print(f"   ✅ Correct 10% discount applied")
                else:
                    print(f"   ❌ Incorrect discount: expected ${expected_discount:.2f}, got ${actual_discount:.2f}")
                    return False
        
        return success
    
    def test_paypal_addon_no_discount(self):
        """Test PayPal checkout for add-ons (should have no discount)"""
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        success, response = self.run_test(
            "PayPal Checkout - Add-on (No Discount)",
            "POST",
            "payments/checkout",
            200,
            data={
                'offer_type': 'sponsored_ama',
                'platform': 'facebook_group',
                'payment_method': 'paypal'
            },
            critical=True
        )
        
        if success:
            print(f"   💰 Final Amount: ${response.get('amount', 0)}")
            print(f"   💰 Original Price: ${response.get('original_price', 0)}")
            print(f"   💸 Discount: ${response.get('discount', 0)}")
            print(f"   ❌ Discount Applied: {response.get('discount_applied', False)}")
            
            # Verify no discount for add-ons
            if not response.get('discount_applied') and response.get('discount', 0) == 0:
                print(f"   ✅ Correctly no discount applied to add-on")
            else:
                print(f"   ❌ Add-on should not have discount applied")
                return False
        
        return success

    # ========== USER DASHBOARD SYSTEM ==========
    
    def test_user_subscriptions_endpoint(self):
        """Test user subscriptions retrieval"""
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        success, response = self.run_test(
            "User Subscriptions Dashboard",
            "GET",
            "user/subscriptions",
            200,
            critical=True
        )
        
        if success:
            subscriptions = response.get('subscriptions', [])
            print(f"   📋 User Subscriptions: {len(subscriptions)}")
            for sub in subscriptions:
                print(f"      - {sub.get('offer_type', 'unknown')}: {sub.get('subscription_status', 'unknown')}")
        
        return success
    
    def test_user_transactions_endpoint(self):
        """Test user transaction history"""
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        success, response = self.run_test(
            "User Transaction History",
            "GET",
            "user/transactions",
            200,
            critical=True
        )
        
        if success:
            transactions = response.get('transactions', [])
            print(f"   💳 Transaction History: {len(transactions)} transactions")
            for trans in transactions[:3]:  # Show first 3
                print(f"      - {trans.get('offer_type', 'unknown')}: ${trans.get('amount', 0)} ({trans.get('payment_status', 'unknown')})")
        
        return success
    
    def test_subscription_cancellation(self):
        """Test subscription cancellation flow"""
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        # First get user subscriptions to find one to cancel
        success, response = self.run_test(
            "Get Subscriptions for Cancellation Test",
            "GET",
            "user/subscriptions",
            200
        )
        
        if success and response.get('subscriptions'):
            subscription_id = response['subscriptions'][0].get('id')
            if subscription_id:
                success, cancel_response = self.run_test(
                    "Subscription Cancellation",
                    "POST",
                    f"user/subscriptions/{subscription_id}/cancel",
                    200,
                    critical=True
                )
                
                if success:
                    print(f"   ✅ Cancellation successful: {cancel_response.get('message', 'No message')}")
                return success
        
        print("   ℹ️  No active subscriptions to cancel (expected for new user)")
        return True  # Not a failure if no subscriptions exist

    # ========== ADMIN DASHBOARD SYSTEM ==========
    
    def test_admin_stats_endpoint(self):
        """Test admin statistics dashboard"""
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        success, response = self.run_test(
            "Admin Statistics Dashboard",
            "GET",
            "admin/stats",
            200,
            critical=True
        )
        
        if success:
            print(f"   💰 Total Revenue: ${response.get('totalRevenue', 0)}")
            print(f"   👥 Active Subscribers: {response.get('activeSubscribers', 0)}")
            print(f"   📈 Success Rate: {response.get('successRate', 0)}%")
            print(f"   💳 Avg Order Value: ${response.get('averageOrderValue', 0):.2f}")
            print(f"   📊 Revenue by Badge: {len(response.get('revenueByBadge', {}))}")
        
        return success
    
    def test_admin_users_endpoint(self):
        """Test admin user management"""
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        success, response = self.run_test(
            "Admin User Management",
            "GET",
            "admin/users",
            200,
            critical=True
        )
        
        if success:
            users = response.get('users', [])
            print(f"   👥 Total Users: {len(users)}")
            if users:
                print(f"   📅 Latest User: {users[0].get('full_name', 'Unknown')} ({users[0].get('email', 'Unknown')})")
        
        return success
    
    def test_admin_subscriptions_endpoint(self):
        """Test admin subscription management"""
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        success, response = self.run_test(
            "Admin Subscription Management",
            "GET",
            "admin/subscriptions",
            200,
            critical=True
        )
        
        if success:
            subscriptions = response.get('subscriptions', [])
            print(f"   📋 Total Subscriptions: {len(subscriptions)}")
            
            # Test filtering by status
            active_success, active_response = self.run_test(
                "Admin Subscriptions - Active Filter",
                "GET",
                "admin/subscriptions?status=active",
                200
            )
            
            if active_success:
                active_subs = active_response.get('subscriptions', [])
                print(f"   ✅ Active Subscriptions: {len(active_subs)}")
        
        return success
    
    def test_admin_transactions_endpoint(self):
        """Test admin transaction management"""
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        success, response = self.run_test(
            "Admin Transaction Management",
            "GET",
            "admin/transactions",
            200,
            critical=True
        )
        
        if success:
            transactions = response.get('transactions', [])
            print(f"   💳 Total Transactions: {len(transactions)}")
            if transactions:
                latest = transactions[0]
                print(f"   💰 Latest: ${latest.get('amount', 0)} ({latest.get('payment_status', 'unknown')})")
        
        return success

    # ========== CUSTOMER SUPPORT SYSTEM ==========
    
    def test_support_contact_endpoint(self):
        """Test customer support system"""
        support_request = {
            "name": "John Smith",
            "email": "john.smith@example.com",
            "subject": "Badge Activation Issue",
            "category": "technical",
            "message": "I purchased a Verified Seller badge but it's not showing up in my profile. Can you help activate it?",
            "priority": "high"
        }
        
        success, response = self.run_test(
            "Customer Support Request",
            "POST",
            "support/contact",
            200,
            data=support_request,
            critical=True
        )
        
        if success:
            print(f"   🎫 Ticket Created: {response.get('ticket_id', 'Unknown')}")
            print(f"   📧 Confirmation: {response.get('message', 'No message')}")
        
        return success

    # ========== EMAIL SYSTEM TESTING ==========
    
    def test_webhook_endpoints(self):
        """Test webhook endpoints for payment processing"""
        # Test PayPal webhook
        paypal_webhook_payload = {
            "event_type": "PAYMENT.SALE.COMPLETED",
            "resource": {
                "id": "test_sale_id_12345",
                "amount": {"total": "26.10", "currency": "USD"},
                "custom": json.dumps({
                    "user_id": self.user_data.get('id') if self.user_data else 'test_user',
                    "offer_type": "verified_seller",
                    "platform": "facebook_group",
                    "transaction_id": "test_transaction_12345"
                })
            }
        }
        
        paypal_success, paypal_response = self.run_test(
            "PayPal Webhook Processing",
            "POST",
            "webhook/paypal",
            200,
            data=paypal_webhook_payload,
            critical=True
        )
        
        # Test Stripe webhook (basic structure test)
        stripe_webhook_payload = {
            "type": "checkout.session.completed",
            "data": {
                "object": {
                    "id": "cs_test_12345",
                    "payment_status": "paid",
                    "metadata": {
                        "user_id": self.user_data.get('id') if self.user_data else 'test_user',
                        "offer_type": "vendor_partner",
                        "platform": "facebook_group"
                    }
                }
            }
        }
        
        stripe_success, stripe_response = self.run_test(
            "Stripe Webhook Processing",
            "POST",
            "webhook/stripe",
            200,
            data=stripe_webhook_payload,
            critical=True
        )
        
        return paypal_success and stripe_success

    # ========== PRODUCTION READINESS CHECKS ==========
    
    def test_api_root_and_health(self):
        """Test API root endpoint and health check"""
        success, response = self.run_test(
            "API Root & Health Check",
            "GET",
            "",
            200,
            critical=True
        )
        
        if success:
            print(f"   🏥 API Health: ✅")
            print(f"   📋 Features: {len(response.get('features', []))}")
            print(f"   🔢 Version: {response.get('version', 'Unknown')}")
        
        return success
    
    def test_user_badges_endpoint(self):
        """Test user badges retrieval"""
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        success, response = self.run_test(
            "User Active Badges",
            "GET",
            "facebook-group/user-badges",
            200,
            critical=True
        )
        
        if success:
            badges = response.get('badges', [])
            print(f"   🏆 Active Badges: {len(badges)}")
            for badge in badges:
                print(f"      - {badge.get('offer_type', 'unknown')}: {badge.get('subscription_status', 'unknown')}")
        
        return success

    # ========== COMPREHENSIVE TEST EXECUTION ==========
    
    def run_comprehensive_final_testing(self):
        """Run all critical tests for production deployment"""
        print(f"\n🧪 COMPREHENSIVE FINAL TESTING SUITE")
        print("=" * 80)
        
        # 1. Authentication & User Management
        print(f"\n🔐 AUTHENTICATION & USER MANAGEMENT")
        print("-" * 50)
        auth_tests = [
            self.test_api_root_and_health,
            self.test_user_registration,
            self.test_user_login
        ]
        auth_passed = sum(1 for test in auth_tests if test())
        print(f"📊 Authentication Tests: {auth_passed}/{len(auth_tests)} passed")
        
        # 2. Facebook Group Offers & Pricing
        print(f"\n💰 FACEBOOK GROUP OFFERS & PRICING")
        print("-" * 50)
        pricing_tests = [
            self.test_facebook_group_offers_pricing
        ]
        pricing_passed = sum(1 for test in pricing_tests if test())
        print(f"📊 Pricing Tests: {pricing_passed}/{len(pricing_tests)} passed")
        
        # 3. Payment Integration
        print(f"\n💳 PAYMENT INTEGRATION TESTING")
        print("-" * 50)
        payment_tests = [
            self.test_stripe_checkout_creation,
            self.test_paypal_checkout_with_discount,
            self.test_paypal_addon_no_discount,
            self.test_webhook_endpoints
        ]
        payment_passed = sum(1 for test in payment_tests if test())
        print(f"📊 Payment Tests: {payment_passed}/{len(payment_tests)} passed")
        
        # 4. User Dashboard System
        print(f"\n👤 USER DASHBOARD SYSTEM")
        print("-" * 50)
        user_dashboard_tests = [
            self.test_user_subscriptions_endpoint,
            self.test_user_transactions_endpoint,
            self.test_subscription_cancellation,
            self.test_user_badges_endpoint
        ]
        user_dashboard_passed = sum(1 for test in user_dashboard_tests if test())
        print(f"📊 User Dashboard Tests: {user_dashboard_passed}/{len(user_dashboard_tests)} passed")
        
        # 5. Admin Dashboard System
        print(f"\n🛠️  ADMIN DASHBOARD SYSTEM")
        print("-" * 50)
        admin_tests = [
            self.test_admin_stats_endpoint,
            self.test_admin_users_endpoint,
            self.test_admin_subscriptions_endpoint,
            self.test_admin_transactions_endpoint
        ]
        admin_passed = sum(1 for test in admin_tests if test())
        print(f"📊 Admin Dashboard Tests: {admin_passed}/{len(admin_tests)} passed")
        
        # 6. Customer Support System
        print(f"\n🎫 CUSTOMER SUPPORT SYSTEM")
        print("-" * 50)
        support_tests = [
            self.test_support_contact_endpoint
        ]
        support_passed = sum(1 for test in support_tests if test())
        print(f"📊 Support Tests: {support_passed}/{len(support_tests)} passed")
        
        # Final results
        self.print_final_results()

    def print_final_results(self):
        """Print comprehensive test results with production readiness assessment"""
        print(f"\n" + "=" * 80)
        print(f"🏁 COMPREHENSIVE FINAL TEST RESULTS")
        print(f"=" * 80)
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        
        print(f"📊 Tests Run: {self.tests_run}")
        print(f"✅ Tests Passed: {self.tests_passed}")
        print(f"❌ Tests Failed: {len(self.failed_tests)}")
        print(f"🚨 Critical Failures: {len(self.critical_failures)}")
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        if self.critical_failures:
            print(f"\n🚨 CRITICAL FAILURES (PRODUCTION BLOCKERS):")
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
        
        # Production readiness assessment
        print(f"\n🚀 PRODUCTION READINESS ASSESSMENT:")
        print(f"🎯 Target: 67K Member Facebook Group Deployment")
        
        if len(self.critical_failures) == 0 and success_rate >= 90:
            print(f"   ✅ PRODUCTION READY - All critical systems operational")
            print(f"   🎉 Ready for 67K member Facebook group deployment!")
        elif len(self.critical_failures) == 0 and success_rate >= 75:
            print(f"   ⚠️  MOSTLY READY - Minor issues need attention")
            print(f"   🔧 Address non-critical issues before deployment")
        elif len(self.critical_failures) > 0:
            print(f"   🚨 NOT PRODUCTION READY - Critical failures must be fixed")
            print(f"   ❌ Cannot deploy to Facebook group until critical issues resolved")
        else:
            print(f"   🔧 NEEDS SIGNIFICANT WORK - Multiple issues prevent deployment")
        
        return len(self.critical_failures) == 0 and success_rate >= 75

def main():
    """Main test execution"""
    tester = ComprehensiveFinalTester()
    
    try:
        production_ready = tester.run_comprehensive_final_testing()
        return 0 if production_ready else 1
    except KeyboardInterrupt:
        print(f"\n⏹️  Tests interrupted by user")
        return 1
    except Exception as e:
        print(f"\n💥 Unexpected error: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())