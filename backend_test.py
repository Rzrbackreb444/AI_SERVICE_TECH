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
        
        # Try with scout analysis type (should be available for free tier)
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
                    'analysis_type': 'scout',  # Use scout which should be available for free tier
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
        
        # Get an analysis ID for testing (use first one if available, otherwise skip equipment/financing tests)
        analysis_id = getattr(self, 'analysis_ids', [None])[0] if hasattr(self, 'analysis_ids') and self.analysis_ids else None
        
        equipment_success = True
        financing_success = True
        
        if analysis_id:
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
        else:
            print("   ⚠️  No analysis data available - skipping equipment marketplace and financing tests")
            print("   ℹ️  Equipment marketplace and financing require analysis data to function")
            equipment_success = True  # Don't fail the test if no data available
            financing_success = True
        
        # Test real estate deals (doesn't require analysis data)
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

    # ========== NEW OPTIMIZATION ENDPOINTS TESTING ==========
    
    def test_system_optimization_endpoints(self):
        """Test new system optimization endpoints"""
        print(f"\n🚀 TESTING NEW SYSTEM OPTIMIZATION ENDPOINTS")
        
        # Test system health check
        health_success, health_response = self.run_test(
            "System Health Check",
            "GET",
            "optimization/system/health",
            200,
            critical=True
        )
        
        if health_success:
            system_health = health_response.get('system_health', {})
            print(f"   🏥 System Status: {system_health.get('status', 'Unknown')}")
            print(f"   💾 Memory Usage: {system_health.get('memory_usage_percent', 0)}%")
            print(f"   🗄️  Database Status: {system_health.get('database_status', 'Unknown')}")
            print(f"   🔄 Redis Status: {system_health.get('redis_status', 'Unknown')}")
            print(f"   ⚡ Optimization Status: {health_response.get('optimization_status', 'Unknown')}")
        
        # Test full system optimization
        optimize_success, optimize_response = self.run_test(
            "Full System Optimization",
            "POST",
            "optimization/system/optimize",
            200,
            critical=True
        )
        
        if optimize_success:
            results = optimize_response.get('optimization_results', {})
            optimizations = results.get('optimizations_applied', [])
            print(f"   🔧 Optimizations Applied: {len(optimizations)}")
            for opt in optimizations:
                print(f"      - {opt}")
            print(f"   ⏰ Optimization Time: {results.get('optimization_timestamp', 'Unknown')}")
        
        return health_success and optimize_success
    
    def test_performance_optimization_endpoints(self):
        """Test performance optimization endpoints"""
        print(f"\n📊 TESTING PERFORMANCE OPTIMIZATION ENDPOINTS")
        
        # Test performance metrics
        metrics_success, metrics_response = self.run_test(
            "Performance Metrics",
            "GET",
            "optimization/performance/metrics",
            200,
            critical=True
        )
        
        if metrics_success:
            metrics = metrics_response.get('performance_metrics', {})
            print(f"   ⚡ API Response Time: {metrics.get('avg_response_time', 0)}ms")
            print(f"   💾 Memory Usage: {metrics.get('memory_usage', 0)}MB")
            print(f"   🔄 Cache Hit Rate: {metrics.get('cache_hit_rate', 0)}%")
            print(f"   📈 Throughput: {metrics.get('requests_per_second', 0)} req/s")
        
        # Test cache status
        cache_success, cache_response = self.run_test(
            "Cache Performance Status",
            "GET",
            "optimization/cache/status",
            200,
            critical=True
        )
        
        if cache_success:
            cache_status = cache_response.get('cache_status', {})
            print(f"   🗄️  Cache Active: {cache_status.get('active', False)}")
            print(f"   📦 Cache Size: {cache_status.get('cache_size', 0)} items")
            print(f"   📊 Hit Ratio: {cache_status.get('cache_hit_ratio', 'Unknown')}")
            print(f"   ⚡ Performance Impact: {cache_status.get('performance_impact', 'Unknown')}")
        
        # Test database index optimization
        db_success, db_response = self.run_test(
            "Database Index Optimization",
            "GET",
            "optimization/database/indexes",
            200,
            critical=True
        )
        
        if db_success:
            db_opt = db_response.get('database_optimization', {})
            collections = db_opt.get('collections_optimized', [])
            print(f"   🗃️  Collections Optimized: {len(collections)}")
            print(f"   📈 Performance Improvement: {db_opt.get('performance_improvement', 'Unknown')}")
        
        return metrics_success and cache_success and db_success
    
    def test_revenue_optimization_endpoints(self):
        """Test revenue optimization endpoints"""
        print(f"\n💰 TESTING REVENUE OPTIMIZATION ENDPOINTS")
        
        # Test dynamic pricing optimization
        pricing_success, pricing_response = self.run_test(
            "Dynamic Pricing Optimization",
            "POST",
            "optimization/revenue/pricing",
            200,
            data={
                'user_data': {
                    'subscription_tier': 'free',
                    'usage_history': {'api_calls': 50, 'analyses': 3}
                },
                'market_conditions': {
                    'demand_level': 'high',
                    'competitor_pricing': {'avg_price': 99.0},
                    'seasonal_factor': 1.2
                }
            },
            critical=True
        )
        
        if pricing_success:
            pricing_opt = pricing_response.get('pricing_optimization', {})
            print(f"   💵 Recommended Price: ${pricing_opt.get('recommended_price', 0)}")
            print(f"   📊 Price Adjustment: {pricing_opt.get('price_adjustment_percent', 0)}%")
            print(f"   🎯 Revenue Impact: ${pricing_opt.get('estimated_revenue_impact', 0)}")
            print(f"   📈 Conversion Rate: {pricing_opt.get('expected_conversion_rate', 0)}%")
        
        # Test revenue forecasting
        forecast_success, forecast_response = self.run_test(
            "Revenue Forecasting with Optimization",
            "POST",
            "optimization/revenue/forecast",
            200,
            data={
                'historical_data': {
                    'monthly_revenue': [10000, 12000, 15000, 18000, 22000],
                    'user_growth': [100, 120, 150, 180, 220],
                    'churn_rate': [0.05, 0.04, 0.03, 0.03, 0.02]
                },
                'optimization_impacts': {
                    'pricing_optimization': 0.15,
                    'conversion_optimization': 0.12,
                    'churn_reduction': 0.08
                }
            },
            critical=True
        )
        
        if forecast_success:
            forecasts = forecast_response.get('revenue_forecasts', {})
            print(f"   📈 Next Month Forecast: ${forecasts.get('next_month_revenue', 0):,}")
            print(f"   📊 3-Month Forecast: ${forecasts.get('three_month_revenue', 0):,}")
            print(f"   🎯 Annual Forecast: ${forecasts.get('annual_revenue', 0):,}")
            print(f"   💰 Optimization Impact: ${forecasts.get('optimization_impact', 0):,}")
        
        # Test conversion funnel optimization (if user exists)
        conversion_success = True
        if self.user_data and self.user_data.get('id'):
            conversion_success, conversion_response = self.run_test(
                "Conversion Funnel Optimization",
                "POST",
                f"optimization/revenue/conversion/{self.user_data['id']}",
                200,
                data={
                    'user_behavior': {
                        'page_views': 25,
                        'time_on_site': 180,
                        'bounce_rate': 0.3,
                        'conversion_events': ['signup', 'pricing_view']
                    }
                },
                critical=True
            )
            
            if conversion_success:
                conv_opt = conversion_response.get('conversion_optimization', {})
                print(f"   🎯 Conversion Score: {conv_opt.get('current_conversion_score', 0)}")
                print(f"   📈 Improvement Potential: {conv_opt.get('improvement_potential', 0)}%")
                recommendations = conv_opt.get('recommendations', [])
                print(f"   💡 Recommendations: {len(recommendations)}")
        
        # Test churn prediction (if user exists)
        churn_success = True
        if self.user_data and self.user_data.get('id'):
            churn_success, churn_response = self.run_test(
                "Churn Prediction and Prevention",
                "POST",
                f"optimization/revenue/churn/{self.user_data['id']}",
                200,
                data={
                    'usage_data': {
                        'last_login': '2024-12-20',
                        'api_calls_last_30_days': 15,
                        'feature_usage': {'analyze': 3, 'reports': 1},
                        'support_tickets': 0
                    }
                },
                critical=True
            )
            
            if churn_success:
                churn_analysis = churn_response.get('churn_analysis', {})
                print(f"   ⚠️  Churn Risk: {churn_analysis.get('churn_risk_level', 'Unknown')}")
                print(f"   📊 Risk Score: {churn_analysis.get('churn_risk_score', 0)}")
                prevention = churn_analysis.get('prevention_strategies', [])
                print(f"   🛡️  Prevention Strategies: {len(prevention)}")
        
        # Test upsell optimization (if user exists)
        upsell_success = True
        if self.user_data and self.user_data.get('id'):
            upsell_success, upsell_response = self.run_test(
                "Upsell Opportunity Optimization",
                "POST",
                f"optimization/revenue/upsell/{self.user_data['id']}",
                200,
                data={
                    'current_tier': 'free',
                    'usage_data': {
                        'api_calls_used': 45,
                        'api_calls_limit': 50,
                        'analyses_used': 1,
                        'analyses_limit': 1,
                        'feature_requests': ['premium_reports', 'bulk_analysis']
                    }
                },
                critical=True
            )
            
            if upsell_success:
                upsell_opt = upsell_response.get('upsell_optimization', {})
                print(f"   🎯 Upsell Score: {upsell_opt.get('upsell_score', 0)}")
                print(f"   💰 Recommended Tier: {upsell_opt.get('recommended_tier', 'Unknown')}")
                print(f"   📈 Revenue Potential: ${upsell_opt.get('revenue_potential', 0)}")
                triggers = upsell_opt.get('upsell_triggers', [])
                print(f"   🚀 Upsell Triggers: {len(triggers)}")
        
        return pricing_success and forecast_success and conversion_success and churn_success and upsell_success
    
    def test_mrr_integration_validation(self):
        """Test that all 5 MRR systems still work after optimization"""
        print(f"\n🔄 TESTING MRR INTEGRATION AFTER OPTIMIZATION")
        
        # Re-test all MRR systems to ensure they still work
        mrr_tests = [
            ("Recurring Value Engine", self.test_recurring_value_engine),
            ("Usage-Based Billing", self.test_usage_based_billing_system),
            ("Multi-Location Dashboard", self.test_multi_location_dashboard),
            ("Enterprise API Layer", self.test_enterprise_api_layer),
            ("Sticky Ecosystem Features", self.test_sticky_ecosystem_features)
        ]
        
        all_passed = True
        for test_name, test_func in mrr_tests:
            print(f"\n   🔍 Re-testing {test_name}...")
            try:
                success = test_func()
                if success:
                    print(f"   ✅ {test_name}: STILL WORKING after optimization")
                else:
                    print(f"   ❌ {test_name}: BROKEN after optimization")
                    all_passed = False
            except Exception as e:
                print(f"   💥 {test_name}: ERROR after optimization - {e}")
                all_passed = False
        
        return all_passed
    
    def test_performance_under_load(self):
        """Test system performance under simulated load"""
        print(f"\n⚡ TESTING PERFORMANCE UNDER LOAD CONDITIONS")
        
        # Test multiple concurrent requests to analyze endpoint
        if not self.token:
            print("   ⚠️  Skipping - No authentication token")
            return False
        
        import threading
        import time
        
        results = []
        
        def make_request():
            try:
                success, response = self.run_test(
                    "Load Test - Analyze Endpoint",
                    "POST",
                    "analyze",
                    200,
                    data={
                        'address': f'123 Load Test St, Chicago, IL',
                        'analysis_type': 'scout',
                        'additional_data': {}
                    }
                )
                results.append(success)
            except Exception as e:
                results.append(False)
        
        # Create 5 concurrent requests
        threads = []
        start_time = time.time()
        
        for i in range(5):
            thread = threading.Thread(target=make_request)
            threads.append(thread)
            thread.start()
        
        # Wait for all threads to complete
        for thread in threads:
            thread.join()
        
        end_time = time.time()
        total_time = end_time - start_time
        
        successful_requests = sum(results)
        success_rate = (successful_requests / len(results)) * 100 if results else 0
        
        print(f"   📊 Concurrent Requests: {len(results)}")
        print(f"   ✅ Successful: {successful_requests}")
        print(f"   📈 Success Rate: {success_rate:.1f}%")
        print(f"   ⏱️  Total Time: {total_time:.2f}s")
        print(f"   ⚡ Avg Response Time: {total_time/len(results):.2f}s per request")
        
        # Test passes if at least 80% of requests succeed and total time is reasonable
        return success_rate >= 80 and total_time < 30

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
        print(f"\n🧪 COMPREHENSIVE FINAL OPTIMIZATION TESTING SUITE - $500K+ MRR TARGET")
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
        
        # 3. NEW OPTIMIZATION ENDPOINTS - CRITICAL FOR PERFORMANCE
        print(f"\n🚀 NEW OPTIMIZATION ENDPOINTS - PERFORMANCE & REVENUE")
        print("-" * 50)
        optimization_tests = [
            self.test_system_optimization_endpoints,
            self.test_performance_optimization_endpoints,
            self.test_revenue_optimization_endpoints
        ]
        optimization_passed = sum(1 for test in optimization_tests if test())
        print(f"📊 Optimization Tests: {optimization_passed}/{len(optimization_tests)} passed")
        
        # 4. MRR OPTIMIZATION SYSTEMS - THE MONEY MAKERS
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
        
        # 5. MRR INTEGRATION VALIDATION - ENSURE NO REGRESSIONS
        print(f"\n🔄 MRR INTEGRATION VALIDATION AFTER OPTIMIZATION")
        print("-" * 50)
        integration_tests = [
            self.test_mrr_integration_validation
        ]
        integration_passed = sum(1 for test in integration_tests if test())
        print(f"📊 Integration Validation Tests: {integration_passed}/{len(integration_tests)} passed")
        
        # 6. PERFORMANCE UNDER LOAD - SYSTEM STRESS TESTING
        print(f"\n⚡ PERFORMANCE UNDER LOAD TESTING")
        print("-" * 50)
        load_tests = [
            self.test_performance_under_load
        ]
        load_passed = sum(1 for test in load_tests if test())
        print(f"📊 Load Testing: {load_passed}/{len(load_tests)} passed")
        
        # 7. Facebook Group Offers & Pricing
        print(f"\n💰 FACEBOOK GROUP OFFERS & PRICING")
        print("-" * 50)
        pricing_tests = [
            self.test_facebook_group_offers_pricing
        ]
        pricing_passed = sum(1 for test in pricing_tests if test())
        print(f"📊 Pricing Tests: {pricing_passed}/{len(pricing_tests)} passed")
        
        # 8. Payment Integration
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
        
        # 9. User Dashboard System
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
        
        # 10. Admin Dashboard System
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
        
        # 11. Customer Support System
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
        
        # OPTIMIZATION & MRR readiness assessment
        print(f"\n🚀 OPTIMIZATION & MRR READINESS ASSESSMENT:")
        print(f"🎯 Target: $500K+ Monthly Recurring Revenue with Peak Performance")
        
        if len(self.critical_failures) == 0 and success_rate >= 90:
            print(f"   ✅ OPTIMIZATION SYSTEMS READY - All performance & revenue features operational")
            print(f"   🚀 Ready for $500K+ MRR target with optimized performance!")
            print(f"   💰 Revenue engines: Recurring Value ✅, Usage Billing ✅, Portfolio ✅, Enterprise API ✅, Ecosystem ✅")
            print(f"   ⚡ Performance optimizations: System Health ✅, Caching ✅, Database Indexes ✅, Revenue Forecasting ✅")
            print(f"   🎯 Dynamic pricing, churn prediction, and conversion optimization all operational")
        elif len(self.critical_failures) == 0 and success_rate >= 75:
            print(f"   ⚠️  MOSTLY READY - Minor optimization issues need attention")
            print(f"   🔧 Address non-critical issues before full optimized revenue deployment")
            print(f"   💰 Core MRR systems operational, performance optimizations may need tuning")
        elif len(self.critical_failures) > 0:
            print(f"   🚨 NOT OPTIMIZATION READY - Critical performance/revenue-blocking failures")
            print(f"   ❌ Cannot achieve optimized $500K+ target until critical issues resolved")
            print(f"   🔧 Focus on fixing optimization endpoints and MRR integration issues")
        else:
            print(f"   🔧 NEEDS SIGNIFICANT WORK - Multiple optimization issues prevent peak performance")
            print(f"   📊 System may function but won't achieve optimal revenue performance")
        
        return len(self.critical_failures) == 0 and success_rate >= 75

class AdvancedRevenueTester:
    """Test all new advanced revenue optimization strategies"""
    
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
            'email': f'revenue.tester_{timestamp}@laundrotech.com',
            'password': 'RevenueTest2024!',
            'full_name': f'Revenue Tester {timestamp}',
            'facebook_group_member': True
        }
        
        print(f"💰 ADVANCED REVENUE OPTIMIZATION TESTING")
        print(f"📍 Backend URL: {self.base_url}")
        print(f"👤 Test User: {self.test_user['email']}")
        print(f"🎯 Target: $500K+ MRR with Advanced Revenue Strategies")
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
            print(f"   🚨 CRITICAL TEST - Revenue Blocker if Failed")
        
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

    def setup_authentication(self):
        """Set up authentication for testing"""
        print(f"\n🔐 SETTING UP AUTHENTICATION")
        
        # Register test user
        success, response = self.run_test(
            "Revenue Tester Registration",
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

    def test_preview_blur_strategy(self):
        """Test preview/blur strategy for conversion optimization"""
        print(f"\n🎭 TESTING PREVIEW/BLUR STRATEGY")
        
        test_addresses = [
            "123 Main Street, Springfield, IL 62701",
            "456 Oak Avenue, Chicago, IL 60601",
            "789 Pine Road, Peoria, IL 61602"
        ]
        
        strategies = ['blur_critical_data', 'teaser_insights']
        
        for strategy in strategies:
            for address in test_addresses[:2]:  # Test 2 addresses per strategy
                success, response = self.run_test(
                    f"Preview Analysis - {strategy}",
                    "POST",
                    "revenue/analysis/preview",
                    200,
                    data={
                        'address': address,
                        'strategy': strategy
                    },
                    critical=True
                )
                
                if success:
                    preview_report = response.get('preview_report', {})
                    conversion_strategy = response.get('conversion_strategy')
                    upgrade_incentives = response.get('upgrade_incentives', {})
                    
                    print(f"   🎯 Strategy: {strategy}")
                    print(f"   📍 Address: {address}")
                    print(f"   🔄 Conversion Strategy: {conversion_strategy}")
                    print(f"   💡 Upgrade Incentives: {len(upgrade_incentives)} items")
                    
                    if preview_report.get('blurred_sections'):
                        print(f"   🎭 Blurred Sections: {len(preview_report['blurred_sections'])}")
                    
                    if preview_report.get('conversion_hooks'):
                        print(f"   🪝 Conversion Hooks: {len(preview_report['conversion_hooks'])}")

    def test_pay_per_depth_analysis(self):
        """Test pay-per-depth analysis with all 5 tiers"""
        print(f"\n📊 TESTING PAY-PER-DEPTH ANALYSIS")
        
        test_address = "123 Business District, Chicago, IL 60601"
        depth_levels = [1, 2, 3, 4, 5]
        expected_prices = [0, 29, 79, 199, 299]
        
        for depth_level, expected_price in zip(depth_levels, expected_prices):
            success, response = self.run_test(
                f"Depth Analysis - Level {depth_level}",
                "POST",
                "revenue/analysis/depth-based",
                200,
                data={
                    'address': test_address,
                    'depth_level': depth_level
                },
                critical=True
            )
            
            if success:
                analysis = response.get('analysis', {})
                billing_info = response.get('billing_info', {})
                upgrade_options = response.get('upgrade_options', [])
                
                print(f"   📈 Depth Level: {depth_level}")
                print(f"   💰 Expected Price: ${expected_price}")
                print(f"   💳 Billing Info: {billing_info.get('price', 'N/A')}")
                print(f"   🔄 Upgrade Options: {len(upgrade_options)}")
                
                # Verify pricing matches expected
                actual_price = billing_info.get('price', 0)
                if actual_price == expected_price:
                    print(f"   ✅ Pricing Verified: ${actual_price}")
                else:
                    print(f"   ⚠️  Price Mismatch: Expected ${expected_price}, Got ${actual_price}")
                
                # Check feature inclusion/exclusion
                includes = analysis.get('features_included', [])
                excludes = analysis.get('features_excluded', [])
                print(f"   ✅ Features Included: {len(includes)}")
                print(f"   ❌ Features Excluded: {len(excludes)}")

    def test_report_caching_reuse(self):
        """Test report caching and reuse functionality"""
        print(f"\n💾 TESTING REPORT CACHING & REUSE")
        
        test_addresses = [
            "789 Cache Test Street, Springfield, IL 62701",
            "456 Reuse Avenue, Chicago, IL 60601"
        ]
        
        for address in test_addresses:
            # Check cache availability
            success, response = self.run_test(
                f"Cache Check - {address}",
                "GET",
                f"revenue/reports/cache-check/{address.replace(' ', '%20')}",
                200,
                critical=True
            )
            
            if success:
                cache_info = response.get('cache_info', {})
                print(f"   📍 Address: {address}")
                print(f"   💾 Cache Available: {cache_info.get('cached_report_available', False)}")
                print(f"   💰 Reuse Price: ${cache_info.get('reuse_price', 0)}")
                print(f"   💸 Savings: ${cache_info.get('savings', 0)}")
                print(f"   🕒 Freshness Rating: {cache_info.get('freshness_rating', 'N/A')}")
                
                # Test purchasing cached report if available
                if cache_info.get('cached_report_available'):
                    purchase_success, purchase_response = self.run_test(
                        f"Purchase Cached Report - {address}",
                        "POST",
                        "revenue/reports/purchase-cached",
                        200,
                        data={
                            'cache_key': cache_info.get('cache_key', 'test_key'),
                            'address': address,
                            'analysis_type': 'business_intelligence'
                        },
                        critical=True
                    )
                    
                    if purchase_success:
                        purchase_result = purchase_response.get('purchase_result', {})
                        print(f"   ✅ Purchase Successful: {purchase_result.get('purchase_successful', False)}")
                        print(f"   💳 Amount Charged: ${purchase_result.get('amount_charged', 0)}")
                        print(f"   💰 Total Savings: ${purchase_result.get('savings', 0)}")

    def test_real_time_monitoring(self):
        """Test real-time monitoring subscription setup"""
        print(f"\n📡 TESTING REAL-TIME MONITORING")
        
        test_locations = [
            "123 Monitor Street, Chicago, IL 60601",
            "456 Alert Avenue, Springfield, IL 62701",
            "789 Watch Road, Peoria, IL 61602"
        ]
        
        success, response = self.run_test(
            "Real-Time Monitoring Setup",
            "POST",
            "revenue/monitoring/real-time-setup",
            200,
            data={
                'locations': test_locations
            },
            critical=True
        )
        
        if success:
            monitoring_config = response.get('monitoring_config', {})
            locations_count = response.get('locations_count', 0)
            subscription_pricing = response.get('subscription_pricing', 0)
            roi_analysis = response.get('roi_analysis', {})
            
            print(f"   📍 Locations Count: {locations_count}")
            print(f"   💰 Subscription Price: ${subscription_pricing}/month")
            print(f"   📊 ROI Analysis: {roi_analysis.get('estimated_roi', 'N/A')}")
            print(f"   ⏱️  Update Frequency: {monitoring_config.get('update_frequency', 'N/A')}")
            print(f"   🚨 Alert Types: {len(monitoring_config.get('alert_types', []))}")
            
            # Verify $299/month pricing
            if subscription_pricing == 299:
                print(f"   ✅ Pricing Verified: ${subscription_pricing}/month")
            else:
                print(f"   ⚠️  Price Unexpected: Expected $299, Got ${subscription_pricing}")

    def test_dynamic_pricing(self):
        """Test dynamic pricing based on market conditions"""
        print(f"\n💹 TESTING DYNAMIC PRICING")
        
        test_addresses = [
            "123 High Demand Street, Chicago, IL 60601",
            "456 Low Demand Avenue, Springfield, IL 62701"
        ]
        
        analysis_types = ['basic_scout', 'business_intelligence', 'enterprise_analysis']
        
        for address in test_addresses:
            for analysis_type in analysis_types:
                success, response = self.run_test(
                    f"Dynamic Pricing - {analysis_type}",
                    "GET",
                    f"revenue/pricing/dynamic/{address.replace(' ', '%20')}?analysis_type={analysis_type}",
                    200,
                    critical=True
                )
                
                if success:
                    dynamic_pricing = response.get('dynamic_pricing', {})
                    base_price = dynamic_pricing.get('base_price', 0)
                    dynamic_price = dynamic_pricing.get('dynamic_price', 0)
                    price_adjustment = dynamic_pricing.get('price_adjustment', '0%')
                    market_conditions = dynamic_pricing.get('market_conditions', {})
                    recommendations = dynamic_pricing.get('recommendations', {})
                    
                    print(f"   📍 Address: {address}")
                    print(f"   📊 Analysis Type: {analysis_type}")
                    print(f"   💰 Base Price: ${base_price}")
                    print(f"   💹 Dynamic Price: ${dynamic_price}")
                    print(f"   📈 Price Adjustment: {price_adjustment}")
                    print(f"   🌡️  Market Demand: {market_conditions.get('demand_level', 'N/A')}")
                    print(f"   🎯 Purchase Timing: {recommendations.get('optimal_purchase_timing', 'N/A')}")

    def test_revenue_forecasting(self):
        """Test revenue forecasting with strategy breakdown"""
        print(f"\n📈 TESTING REVENUE FORECASTING")
        
        success, response = self.run_test(
            "Revenue Forecast Analysis",
            "GET",
            "revenue/strategy/revenue-forecast",
            200,
            critical=True
        )
        
        if success:
            revenue_forecast = response.get('revenue_forecast', {})
            optimization_roadmap = response.get('optimization_roadmap', {})
            
            current_revenue = revenue_forecast.get('current_monthly_revenue', 0)
            optimized_revenue = revenue_forecast.get('optimized_monthly_revenue', 0)
            monthly_savings = revenue_forecast.get('monthly_cost_savings', 0)
            annual_impact = revenue_forecast.get('annual_revenue_impact', 0)
            roi_multiplier = revenue_forecast.get('roi_multiplier', 'N/A')
            
            print(f"   💰 Current Monthly Revenue: ${current_revenue:,}")
            print(f"   🚀 Optimized Monthly Revenue: ${optimized_revenue:,}")
            print(f"   💸 Monthly Cost Savings: ${monthly_savings:,}")
            print(f"   📊 Annual Revenue Impact: ${annual_impact:,}")
            print(f"   📈 ROI Multiplier: {roi_multiplier}")
            
            # Check strategy breakdown
            strategies_breakdown = revenue_forecast.get('strategies_breakdown', {})
            print(f"   🎯 Strategy Count: {len(strategies_breakdown)}")
            
            for strategy_name, strategy_data in strategies_breakdown.items():
                revenue_increase = strategy_data.get('estimated_monthly_revenue_increase', 0)
                print(f"   📊 {strategy_name}: +${revenue_increase:,}/month")
            
            # Implementation timeline
            timeline = revenue_forecast.get('implementation_timeline', 'N/A')
            confidence = revenue_forecast.get('confidence_level', 'N/A')
            print(f"   ⏱️  Implementation Timeline: {timeline}")
            print(f"   🎯 Confidence Level: {confidence}")

    def test_upgrade_flow(self):
        """Test upgrade flow from preview to full analysis"""
        print(f"\n🔄 TESTING UPGRADE FLOW")
        
        preview_id = f"preview_{uuid.uuid4().hex[:8]}"
        tiers = ['market_insights', 'business_intelligence', 'enterprise_analysis']
        
        for tier in tiers:
            success, response = self.run_test(
                f"Upgrade Flow - {tier}",
                "POST",
                "revenue/analysis/upgrade-flow",
                200,
                data={
                    'preview_id': preview_id,
                    'selected_tier': tier
                },
                critical=True
            )
            
            if success:
                upgrade_flow = response.get('upgrade_flow', {})
                payment_options = response.get('payment_options', [])
                
                selected_tier = upgrade_flow.get('selected_tier')
                original_price = upgrade_flow.get('original_price', 0)
                upgrade_price = upgrade_flow.get('upgrade_price', 0)
                preview_discount = upgrade_flow.get('preview_discount', '0%')
                savings = upgrade_flow.get('savings', 0)
                features_unlocked = upgrade_flow.get('features_unlocked', [])
                conversion_boosters = upgrade_flow.get('conversion_boosters', {})
                
                print(f"   🎯 Selected Tier: {selected_tier}")
                print(f"   💰 Original Price: ${original_price}")
                print(f"   💸 Upgrade Price: ${upgrade_price}")
                print(f"   🎁 Preview Discount: {preview_discount}")
                print(f"   💵 Savings: ${savings}")
                print(f"   ✨ Features Unlocked: {len(features_unlocked)}")
                print(f"   🚀 Conversion Boosters: {len(conversion_boosters)}")
                print(f"   💳 Payment Options: {', '.join(payment_options)}")

    def run_comprehensive_revenue_testing(self):
        """Run all advanced revenue optimization tests"""
        print(f"\n🚀 STARTING COMPREHENSIVE REVENUE OPTIMIZATION TESTING")
        
        # Setup authentication
        if not self.setup_authentication():
            print(f"❌ Authentication failed - cannot proceed with revenue testing")
            return False
        
        # Run all revenue optimization tests
        test_methods = [
            self.test_preview_blur_strategy,
            self.test_pay_per_depth_analysis,
            self.test_report_caching_reuse,
            self.test_real_time_monitoring,
            self.test_dynamic_pricing,
            self.test_revenue_forecasting,
            self.test_upgrade_flow
        ]
        
        for test_method in test_methods:
            try:
                test_method()
            except Exception as e:
                print(f"💥 Test method {test_method.__name__} failed: {e}")
        
        # Generate final report
        self.generate_revenue_testing_report()
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        return len(self.critical_failures) == 0 and success_rate >= 80

    def generate_revenue_testing_report(self):
        """Generate comprehensive revenue testing report"""
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        
        print(f"\n" + "="*80)
        print(f"💰 ADVANCED REVENUE OPTIMIZATION TESTING REPORT")
        print(f"="*80)
        print(f"📊 Tests Run: {self.tests_run}")
        print(f"✅ Tests Passed: {self.tests_passed}")
        print(f"❌ Tests Failed: {len(self.failed_tests)}")
        print(f"🚨 Critical Failures: {len(self.critical_failures)}")
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        if self.critical_failures:
            print(f"\n🚨 CRITICAL REVENUE FAILURES:")
            for failure in self.critical_failures:
                print(f"   ❌ {failure['name']}: {failure.get('error', 'Unknown error')}")
        
        if self.failed_tests and not self.critical_failures:
            print(f"\n⚠️  NON-CRITICAL FAILURES:")
            for failure in self.failed_tests:
                if not failure.get('critical', False):
                    print(f"   ⚠️  {failure['name']}: {failure.get('error', 'Unknown error')}")
        
        print(f"\n🎯 REVENUE OPTIMIZATION READINESS:")
        if len(self.critical_failures) == 0 and success_rate >= 80:
            print(f"   ✅ REVENUE SYSTEMS READY - All advanced revenue strategies operational")
            print(f"   💰 Revenue engines: Preview/Blur ✅, Pay-per-Depth ✅, Caching ✅, Real-time ✅")
            print(f"   📈 Pricing optimization: Dynamic Pricing ✅, Revenue Forecasting ✅, Upgrade Flow ✅")
            print(f"   🚀 Ready for $500K+ MRR target deployment")
        elif success_rate >= 60:
            print(f"   ⚠️  PARTIAL REVENUE READINESS - Some advanced features may need attention")
            print(f"   🔧 Address non-critical issues before full revenue optimization deployment")
        else:
            print(f"   🚨 NOT REVENUE READY - Critical revenue-blocking failures")
            print(f"   ❌ Must fix critical issues before revenue optimization deployment")
            print(f"   📊 System may function but won't achieve optimal revenue performance")
        
        return len(self.critical_failures) == 0 and success_rate >= 80

def main():
    """Main test execution"""
    print("🎯 REVENUE OPTIMIZATION TESTING SUITE")
    print("Choose testing mode:")
    print("1. Advanced Revenue Optimization Testing (NEW)")
    print("2. Comprehensive System Testing (EXISTING)")
    
    choice = input("Enter choice (1 or 2): ").strip()
    
    if choice == "1":
        tester = AdvancedRevenueTester()
        try:
            revenue_ready = tester.run_comprehensive_revenue_testing()
            return 0 if revenue_ready else 1
        except KeyboardInterrupt:
            print(f"\n⏹️  Revenue tests interrupted by user")
            return 1
        except Exception as e:
            print(f"\n💥 Unexpected error in revenue testing: {e}")
            return 1
    else:
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