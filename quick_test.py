#!/usr/bin/env python3
import requests
import json

base_url = 'https://laundroinsight.preview.emergentagent.com/api'

print('🚀 TESTING KEY ENDPOINTS FROM REVIEW REQUEST')
print('=' * 60)

# Test 1: GET /api/ (main API info)
print('\n1. Testing GET /api/ (main API info)')
try:
    response = requests.get(f'{base_url}/')
    print(f'   Status: {response.status_code}')
    if response.status_code == 200:
        data = response.json()
        print(f'   ✅ API accessible')
        print(f'   Version: {data.get("version", "Unknown")}')
        print(f'   Features: {len(data.get("features", []))}')
    else:
        print(f'   ❌ Failed with status {response.status_code}')
except Exception as e:
    print(f'   💥 Error: {e}')

# Test 2: POST /api/auth/register (user registration)
print('\n2. Testing POST /api/auth/register (user registration)')
try:
    user_data = {
        'email': 'test.validation@laundrotech.com',
        'password': 'TestPass2024!',
        'full_name': 'Test Validation User',
        'facebook_group_member': True
    }
    response = requests.post(f'{base_url}/auth/register', json=user_data)
    print(f'   Status: {response.status_code}')
    if response.status_code == 200:
        data = response.json()
        print(f'   ✅ User registration working')
        print(f'   Token received: {"access_token" in data}')
        token = data.get('access_token')
    else:
        print(f'   ❌ Failed with status {response.status_code}')
        token = None
except Exception as e:
    print(f'   💥 Error: {e}')
    token = None

# Test 3: GET /api/facebook-group/offers (payment offerings)
print('\n3. Testing GET /api/facebook-group/offers (payment offerings)')
try:
    response = requests.get(f'{base_url}/facebook-group/offers')
    print(f'   Status: {response.status_code}')
    if response.status_code == 200:
        data = response.json()
        offers = data.get('offers', {})
        print(f'   ✅ Facebook Group offers accessible')
        print(f'   Offers available: {len(offers)}')
        # Check key pricing
        if 'verified_seller' in offers:
            print(f'   Verified Seller: ${offers["verified_seller"].get("price", 0)}')
        if 'vendor_partner' in offers:
            print(f'   Vendor Partner: ${offers["vendor_partner"].get("price", 0)}')
        if 'verified_funder' in offers:
            print(f'   Verified Funder: ${offers["verified_funder"].get("price", 0)}')
    else:
        print(f'   ❌ Failed with status {response.status_code}')
except Exception as e:
    print(f'   💥 Error: {e}')

# Test 4: POST /api/analyze (location analysis) - requires auth
print('\n4. Testing POST /api/analyze (location analysis)')
if token:
    try:
        headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
        analysis_data = {
            'address': '123 Main Street, Springfield, IL',
            'analysis_type': 'scout',
            'additional_data': {}
        }
        response = requests.post(f'{base_url}/analyze', json=analysis_data, headers=headers)
        print(f'   Status: {response.status_code}')
        if response.status_code == 200:
            data = response.json()
            print(f'   ✅ Location analysis working')
            print(f'   Address: {data.get("address", "Unknown")}')
            print(f'   Score: {data.get("score", 0)}')
            print(f'   Grade: {data.get("grade", "Unknown")}')
        else:
            print(f'   ❌ Failed with status {response.status_code}')
            try:
                error_data = response.json()
                print(f'   Error: {error_data}')
            except:
                print(f'   Raw error: {response.text[:200]}')
    except Exception as e:
        print(f'   💥 Error: {e}')
else:
    print('   ⚠️  Skipping - No authentication token')

# Test 5: Check marketplace endpoint variations
print('\n5. Testing Marketplace Endpoints')
marketplace_endpoints = [
    'marketplace/listings/search',
    'marketplace/listings/featured', 
    'marketplace/featured'
]

for endpoint in marketplace_endpoints:
    try:
        response = requests.get(f'{base_url}/{endpoint}')
        print(f'   GET /{endpoint}: {response.status_code}')
        if response.status_code == 200:
            print(f'   ✅ {endpoint} accessible')
            break
    except Exception as e:
        print(f'   💥 Error on {endpoint}: {e}')

print('\n' + '=' * 60)
print('🏁 KEY ENDPOINTS VALIDATION COMPLETE')