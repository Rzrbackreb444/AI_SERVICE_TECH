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
    def __init__(self, base_url="https://siteanalytics.preview.emergentagent.com/api"):
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

    # ========== MRR OPTIMIZATION SYSTEMS TESTING ==========
    
    def test_analyze_endpoint_for_data_generation(self):
        """Run analysis to generate data for MRR testing"""
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        # Run a few analyses to generate data
        test_addresses = [
            "123 Main Street, Springfield, IL",
            "456 Oak Avenue, Chicago, IL", 
            "789 University Drive, Urbana, IL"
        ]
        
        analyses_created = 0
        for address in test_addresses:
            success, response = self.run_test(
                f"Generate Analysis Data - {address}",
                "POST",
                "analyze",
                200,
                data={
                    'address': address,
                    'analysis_type': 'analyzer',
                    'additional_data': {}
                }
            )
            
            if success:
                analyses_created += 1
                print(f"   📊 Analysis created for: {address}")
                # Store analysis ID for later use
                if hasattr(self, 'analysis_ids'):
                    self.analysis_ids.append(response.get('analysis_id'))
                else:
                    self.analysis_ids = [response.get('analysis_id')]
            
            # Small delay between requests
            time.sleep(1)
        
        print(f"   ✅ Generated {analyses_created} analyses for MRR testing")
        return analyses_created > 0

    def test_recurring_value_engine(self):
        """Test RECURRING VALUE ENGINE - /api/dashboard/performance and /api/alerts/market"""
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        # Test performance dashboard
        perf_success, perf_response = self.run_test(
            "Recurring Value Engine - Performance Dashboard",
            "GET",
            "dashboard/performance",
            200,
            critical=True
        )
        
        if perf_success:
            print(f"   📊 Total Analyses: {perf_response.get('total_analyses', 0)}")
            print(f"   📈 Average Score: {perf_response.get('average_score', 0)}")
            print(f"   🚨 Recent Alerts: {perf_response.get('recent_alerts', 0)}")
            print(f"   📱 Engagement Score: {perf_response.get('engagement_score', 0)}")
        
        # Test market alerts
        alerts_success, alerts_response = self.run_test(
            "Recurring Value Engine - Market Alerts",
            "GET",
            "alerts/market",
            200,
            critical=True
        )
        
        if alerts_success:
            alerts = alerts_response.get('alerts', [])
            print(f"   🚨 Market Alerts Generated: {len(alerts)}")
            for alert in alerts[:2]:  # Show first 2
                print(f"      - {alert.get('title', 'Unknown')}: {alert.get('severity', 'unknown')}")
        
        return perf_success and alerts_success

    def test_usage_based_billing_system(self):
        """Test USAGE-BASED BILLING SYSTEM - /api/usage/current and /api/billing/report"""
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        # Test current usage
        usage_success, usage_response = self.run_test(
            "Usage-Based Billing - Current Usage",
            "GET",
            "usage/current",
            200,
            critical=True
        )
        
        if usage_success:
            print(f"   📊 API Calls Used: {usage_response.get('api_calls_used', 0)}/{usage_response.get('api_calls_limit', 0)}")
            print(f"   🔬 Analyses Used: {usage_response.get('analyses_used', 0)}/{usage_response.get('analyses_limit', 0)}")
            print(f"   💰 Overage Charges: ${usage_response.get('overage_charges', 0)}")
            print(f"   📈 Utilization: {usage_response.get('utilization_percent', 0)}%")
            
            if usage_response.get('upsell_trigger'):
                print(f"   🎯 UPSELL OPPORTUNITY DETECTED!")
        
        # Test billing report
        billing_success, billing_response = self.run_test(
            "Usage-Based Billing - Billing Report",
            "GET",
            "billing/report",
            200,
            critical=True
        )
        
        if billing_success:
            print(f"   💳 Base Subscription: ${billing_response.get('base_subscription', 0)}")
            print(f"   💸 Overage Charges: ${billing_response.get('overage_charges', 0)}")
            print(f"   💰 Total Billing: ${billing_response.get('total_billing', 0)}")
            
            usage_summary = billing_response.get('usage_summary', {})
            print(f"   📊 Usage Summary: {usage_summary.get('api_calls', 0)} calls, {usage_summary.get('analyses', 0)} analyses")
        
        return usage_success and billing_success

    def test_multi_location_dashboard(self):
        """Test MULTI-LOCATION DASHBOARD - /api/portfolio/dashboard and /api/portfolio/expansion"""
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        # Test portfolio dashboard
        portfolio_success, portfolio_response = self.run_test(
            "Multi-Location Dashboard - Portfolio Dashboard",
            "GET",
            "portfolio/dashboard",
            200,
            critical=True
        )
        
        if portfolio_success:
            print(f"   🏢 Total Locations: {portfolio_response.get('total_locations', 0)}")
            
            portfolio_stats = portfolio_response.get('portfolio_stats', {})
            print(f"   📊 Average Score: {portfolio_stats.get('average_score', 0)}")
            print(f"   💰 Total Investment: ${portfolio_stats.get('total_investment_estimated', 0):,}")
            print(f"   🏆 Best Location: {portfolio_stats.get('best_performing_location', 'None')}")
            print(f"   🚀 Expansion Opportunities: {portfolio_stats.get('expansion_opportunities', 0)}")
        
        # Test portfolio expansion analysis
        expansion_success, expansion_response = self.run_test(
            "Multi-Location Dashboard - Expansion Analysis",
            "POST",
            "portfolio/expansion",
            200,
            data={'target_market': 'Chicago Metro Area'},
            critical=True
        )
        
        if expansion_success:
            gap_analysis = expansion_response.get('market_gap_analysis', {})
            print(f"   🎯 Underserved Areas: {gap_analysis.get('underserved_areas', 0)}")
            print(f"   💪 Competitor Weakness Zones: {gap_analysis.get('competitor_weakness_zones', 0)}")
            
            recommendations = expansion_response.get('expansion_recommendations', [])
            print(f"   📋 Expansion Recommendations: {len(recommendations)}")
            for rec in recommendations[:1]:  # Show first recommendation
                print(f"      - {rec.get('area', 'Unknown')}: Score {rec.get('opportunity_score', 0)}")
        
        return portfolio_success and expansion_success

    def test_enterprise_api_layer(self):
        """Test ENTERPRISE API LAYER - /api/enterprise/api-key and /api/enterprise/bulk-analysis"""
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        # Test enterprise API key creation
        api_key_success, api_key_response = self.run_test(
            "Enterprise API Layer - API Key Creation",
            "POST",
            "enterprise/api-key",
            200,
            data={'organization': 'LaundroTech Enterprises LLC'},
            critical=True
        )
        
        enterprise_api_key = None
        if api_key_success:
            enterprise_api_key = api_key_response.get('api_key')
            print(f"   🔑 API Key: {enterprise_api_key}")
            print(f"   🔐 Secret Key: {api_key_response.get('secret_key', 'Hidden')[:10]}...")
            print(f"   📊 API Limit: {api_key_response.get('api_limit', 0):,}")
            print(f"   ⚡ Rate Limit: {api_key_response.get('rate_limit', 'Unknown')}")
            print(f"   💰 Monthly Fee: ${api_key_response.get('monthly_fee', 0)}")
        
        # Test bulk analysis endpoint
        bulk_addresses = [
            "100 Enterprise Blvd, Chicago, IL",
            "200 Business Park Dr, Springfield, IL",
            "300 Commercial Ave, Peoria, IL"
        ]
        
        bulk_success, bulk_response = self.run_test(
            "Enterprise API Layer - Bulk Analysis",
            "POST",
            "enterprise/bulk-analysis",
            200,
            data={'addresses': bulk_addresses},
            critical=True
        )
        
        if bulk_success:
            print(f"   📊 Request ID: {bulk_response.get('request_id', 'Unknown')}")
            print(f"   🏢 Total Addresses: {bulk_response.get('total_addresses', 0)}")
            print(f"   ⚡ Processing Time: {bulk_response.get('processing_time', 'Unknown')}")
            print(f"   📞 API Calls Used: {bulk_response.get('api_calls_used', 0)}")
            print(f"   💰 Billing Amount: ${bulk_response.get('billing_amount', 0)}")
            
            results = bulk_response.get('results', [])
            print(f"   📋 Analysis Results: {len(results)}")
            for result in results[:2]:  # Show first 2 results
                print(f"      - {result.get('address', 'Unknown')}: Score {result.get('score', 0)} ({result.get('grade', 'F')})")
        
        return api_key_success and bulk_success

    def test_sticky_ecosystem_features(self):
        """Test STICKY ECOSYSTEM FEATURES - /api/marketplace/equipment, /api/financing/pre-approval, /api/real-estate/deals"""
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        # Get an analysis ID for testing (use first one if available)
        analysis_id = getattr(self, 'analysis_ids', ['test_analysis_id'])[0] if hasattr(self, 'analysis_ids') and self.analysis_ids else 'test_analysis_id'
        
        # Test equipment marketplace
        equipment_success, equipment_response = self.run_test(
            "Sticky Ecosystem - Equipment Marketplace",
            "GET",
            f"marketplace/equipment?analysis_id={analysis_id}",
            200,
            critical=True
        )
        
        if equipment_success:
            washers = equipment_response.get('recommended_washers', [])
            dryers = equipment_response.get('recommended_dryers', [])
            print(f"   🧺 Recommended Washers: {len(washers)}")
            print(f"   🌪️  Recommended Dryers: {len(dryers)}")
            print(f"   💰 Total Equipment Cost: ${equipment_response.get('total_equipment_cost', 0):,}")
            
            financing_options = equipment_response.get('financing_options', [])
            print(f"   💳 Financing Options: {len(financing_options)}")
            for option in financing_options[:1]:  # Show first option
                print(f"      - {option.get('lender', 'Unknown')}: {option.get('rate', 0)}% for {option.get('term', 0)} months")
        
        # Test financing pre-approval
        financing_success, financing_response = self.run_test(
            "Sticky Ecosystem - Financing Pre-Approval",
            "POST",
            "financing/pre-approval",
            200,
            data={'analysis_id': analysis_id},
            critical=True
        )
        
        if financing_success:
            print(f"   ✅ Pre-Approval Status: {financing_response.get('pre_approval_status', 'Unknown')}")
            print(f"   💰 Approved Amount: ${financing_response.get('approved_amount', 0):,}")
            print(f"   📊 Interest Rate: {financing_response.get('interest_rate', 0)}%")
            print(f"   💳 Monthly Payment: ${financing_response.get('monthly_payment', 0):,}")
        
        # Test real estate deals
        deals_success, deals_response = self.run_test(
            "Sticky Ecosystem - Real Estate Deals",
            "GET",
            "real-estate/deals",
            200,
            critical=True
        )
        
        if deals_success:
            active_deals = deals_response.get('active_deals', [])
            print(f"   🏢 Active Deals: {len(active_deals)}")
            print(f"   📅 New Deals This Week: {deals_response.get('new_deals_this_week', 0)}")
            
            for deal in active_deals[:2]:  # Show first 2 deals
                print(f"      - {deal.get('address', 'Unknown')}: ${deal.get('purchase_price', 0):,} ({deal.get('deal_quality', 'Unknown')})")
                print(f"        Score: {deal.get('laundromat_suitability_score', 0)}, Size: {deal.get('size_sqft', 0)} sqft")
        
        return equipment_success and financing_success and deals_success

    def test_user_lifetime_value_analytics(self):
        """Test user lifetime value calculation"""
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        success, response = self.run_test(
            "User Lifetime Value Analytics",
            "GET",
            "analytics/ltv",
            200,
            critical=True
        )
        
        if success:
            print(f"   👤 User Tier: {response.get('current_tier', 'Unknown')}")
            print(f"   💰 Base Monthly Value: ${response.get('base_monthly_value', 0)}")
            print(f"   💸 Avg Monthly Overages: ${response.get('avg_monthly_overages', 0)}")
            print(f"   📊 Estimated LTV: ${response.get('estimated_ltv', 0)}")
            print(f"   📅 Retention Months: {response.get('retention_months', 0)}")
        
        return success

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
        print(f"\n🧪 COMPREHENSIVE FINAL TESTING SUITE - MRR OPTIMIZATION FOCUS")
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
        
        # 2. Data Generation for MRR Testing
        print(f"\n📊 DATA GENERATION FOR MRR TESTING")
        print("-" * 50)
        data_gen_tests = [
            self.test_analyze_endpoint_for_data_generation
        ]
        data_gen_passed = sum(1 for test in data_gen_tests if test())
        print(f"📊 Data Generation Tests: {data_gen_passed}/{len(data_gen_tests)} passed")
        
        # 3. MRR OPTIMIZATION SYSTEMS - THE MONEY MAKERS
        print(f"\n💰 MRR OPTIMIZATION SYSTEMS - $500K+ TARGET")
        print("-" * 50)
        mrr_tests = [
            self.test_recurring_value_engine,
            self.test_usage_based_billing_system,
            self.test_multi_location_dashboard,
            self.test_enterprise_api_layer,
            self.test_sticky_ecosystem_features,
            self.test_user_lifetime_value_analytics
        ]
        mrr_passed = sum(1 for test in mrr_tests if test())
        print(f"📊 MRR Optimization Tests: {mrr_passed}/{len(mrr_tests)} passed")
        
        # 4. Facebook Group Offers & Pricing
        print(f"\n💰 FACEBOOK GROUP OFFERS & PRICING")
        print("-" * 50)
        pricing_tests = [
            self.test_facebook_group_offers_pricing
        ]
        pricing_passed = sum(1 for test in pricing_tests if test())
        print(f"📊 Pricing Tests: {pricing_passed}/{len(pricing_tests)} passed")
        
        # 5. Payment Integration
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
        
        # 6. User Dashboard System
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
        
        # 7. Admin Dashboard System
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
        
        # 8. Customer Support System
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
        print(f"🏁 COMPREHENSIVE MRR OPTIMIZATION TEST RESULTS")
        print(f"=" * 80)
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        
        print(f"📊 Tests Run: {self.tests_run}")
        print(f"✅ Tests Passed: {self.tests_passed}")
        print(f"❌ Tests Failed: {len(self.failed_tests)}")
        print(f"🚨 Critical Failures: {len(self.critical_failures)}")
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        if self.critical_failures:
            print(f"\n🚨 CRITICAL FAILURES (MRR REVENUE BLOCKERS):")
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
        
        # MRR Optimization readiness assessment
        print(f"\n💰 MRR OPTIMIZATION READINESS ASSESSMENT:")
        print(f"🎯 Target: $500K+ Monthly Recurring Revenue")
        
        if len(self.critical_failures) == 0 and success_rate >= 90:
            print(f"   ✅ MRR SYSTEMS READY - All money-making features operational")
            print(f"   🚀 Ready for $500K+ MRR target deployment!")
            print(f"   💰 Revenue engines: Recurring Value ✅, Usage Billing ✅, Portfolio ✅, Enterprise API ✅, Ecosystem ✅")
        elif len(self.critical_failures) == 0 and success_rate >= 75:
            print(f"   ⚠️  MOSTLY READY - Minor MRR optimization issues need attention")
            print(f"   🔧 Address non-critical issues before full revenue deployment")
        elif len(self.critical_failures) > 0:
            print(f"   🚨 NOT MRR READY - Critical revenue-blocking failures must be fixed")
            print(f"   ❌ Cannot achieve $500K+ target until critical MRR issues resolved")
        else:
            print(f"   🔧 NEEDS SIGNIFICANT WORK - Multiple MRR issues prevent revenue optimization")
        
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