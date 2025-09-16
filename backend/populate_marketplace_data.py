#!/usr/bin/env python3
"""
Marketplace Data Population Script
Populates MongoDB with realistic professional laundromat marketplace listings
"""

import asyncio
import os
import uuid
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
import logging
import random

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MarketplaceDataPopulator:
    def __init__(self):
        self.mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
        self.db_name = os.environ.get('DB_NAME', 'sitetitan_db')
        self.client = None
        self.db = None
    
    async def connect(self):
        """Connect to MongoDB"""
        try:
            self.client = AsyncIOMotorClient(self.mongo_url)
            self.db = self.client[self.db_name]
            logger.info(f"Connected to MongoDB: {self.db_name}")
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            raise
    
    def generate_professional_listing(self, listing_id):
        """Generate a professional laundromat listing with real market data"""
        
        # Real cities and locations
        locations = [
            {"city": "Austin", "state": "TX", "zip": "78701", "lat": 30.2672, "lng": -97.7431},
            {"city": "Phoenix", "state": "AZ", "zip": "85001", "lat": 33.4484, "lng": -112.0740},
            {"city": "Nashville", "state": "TN", "zip": "37201", "lat": 36.1627, "lng": -86.7816},
            {"city": "Tampa", "state": "FL", "zip": "33601", "lat": 27.9506, "lng": -82.4572},
            {"city": "Sacramento", "state": "CA", "zip": "95814", "lat": 38.5816, "lng": -121.4944},
            {"city": "Orlando", "state": "FL", "zip": "32801", "lat": 28.5383, "lng": -81.3792},
            {"city": "Charlotte", "state": "NC", "zip": "28201", "lat": 35.2271, "lng": -80.8431},
            {"city": "Denver", "state": "CO", "zip": "80202", "lat": 39.7392, "lng": -104.9903},
            {"city": "Atlanta", "state": "GA", "zip": "30301", "lat": 33.7490, "lng": -84.3880},
            {"city": "Raleigh", "state": "NC", "zip": "27601", "lat": 35.7796, "lng": -78.6382}
        ]
        
        # Equipment brands and specifications
        equipment_brands = ["Speed Queen", "Huebsch", "Continental", "Wascomat", "Milnor", "UniMac"]
        washer_capacities = [20, 25, 30, 35, 40, 50, 60, 80]
        dryer_capacities = [30, 35, 45, 50, 55, 75]
        
        location = random.choice(locations)
        brand = random.choice(equipment_brands)
        
        # Realistic equipment counts and financials
        num_washers = random.randint(12, 35)
        num_dryers = random.randint(8, 25)
        washer_capacity = random.choice(washer_capacities)
        dryer_capacity = random.choice(dryer_capacities)
        
        # Calculate realistic revenue based on equipment
        turns_per_day = random.uniform(3.5, 7.2)
        avg_wash_price = random.uniform(2.75, 4.50)
        avg_dry_price = random.uniform(0.25, 0.50)
        
        daily_revenue = (num_washers * turns_per_day * avg_wash_price) + (num_dryers * turns_per_day * dryer_capacity * 0.1 * avg_dry_price)
        monthly_revenue = daily_revenue * 30
        annual_revenue = monthly_revenue * 12
        
        # Operating expenses (typically 35-45% of revenue)
        expense_ratio = random.uniform(0.35, 0.45)
        monthly_expenses = monthly_revenue * expense_ratio
        monthly_profit = monthly_revenue - monthly_expenses
        
        # Calculate asking price (typically 3-5x annual profit)
        asking_price = monthly_profit * 12 * random.uniform(3.2, 4.8)
        
        # ROI calculation
        roi = (monthly_profit * 12) / asking_price * 100
        
        listing = {
            "id": str(uuid.uuid4()),
            "listing_id": f"LT-{listing_id:04d}",
            "title": f"Premium {brand} Laundromat - {location['city']}, {location['state']}",
            "description": f"Established laundromat featuring {num_washers} {brand} washers and {num_dryers} dryers. Prime location in {location['city']} with consistent customer base and strong cash flow.",
            
            # Location data
            "location": {
                "address": f"{random.randint(100, 9999)} {random.choice(['Main St', 'Oak Ave', 'Park Blvd', 'Center Dr', 'Commerce Way'])}",
                "city": location['city'],
                "state": location['state'],
                "zip_code": location['zip'],
                "coordinates": {"lat": location['lat'], "lng": location['lng']},
                "demographics": {
                    "population_radius_1mi": random.randint(8000, 25000),
                    "median_income": random.randint(35000, 85000),
                    "competition_score": random.uniform(6.5, 9.2)
                }
            },
            
            # Equipment details
            "equipment": {
                "washers": {
                    "count": num_washers,
                    "brand": brand,
                    "capacity_lbs": washer_capacity,
                    "age_years": random.randint(2, 8),
                    "condition": random.choice(["Excellent", "Very Good", "Good"])
                },
                "dryers": {
                    "count": num_dryers,
                    "brand": brand,
                    "capacity_lbs": dryer_capacity,
                    "age_years": random.randint(2, 8),
                    "condition": random.choice(["Excellent", "Very Good", "Good"])
                },
                "additional": random.choice([
                    ["Change Machine", "Vending Machine", "Folding Tables"],
                    ["ATM", "Card Reader System", "Security Cameras"],
                    ["Soap Dispenser", "Coin Counter", "Seating Area"]
                ])
            },
            
            # Financial data
            "financials": {
                "asking_price": round(asking_price, 0),
                "monthly_revenue": round(monthly_revenue, 0),
                "monthly_expenses": round(monthly_expenses, 0),
                "monthly_profit": round(monthly_profit, 0),
                "annual_revenue": round(annual_revenue, 0),
                "roi_percentage": round(roi, 1),
                "cap_rate": round((monthly_profit * 12) / asking_price * 100, 1),
                "cash_on_cash_return": round(roi * 0.8, 1)  # Assuming 80% financing
            },
            
            # Business details
            "business": {
                "established_year": random.randint(2015, 2022),
                "square_feet": random.randint(1500, 4500),
                "operating_hours": "6:00 AM - 10:00 PM",
                "lease_terms": {
                    "monthly_rent": round(asking_price * 0.02 / 12, 0),  # ~2% of asking price annually
                    "lease_remaining_years": random.randint(5, 15),
                    "renewal_options": random.choice(["5+5", "10", "5+5+5"])
                },
                "utilities": {
                    "electric_monthly": random.randint(800, 1800),
                    "water_monthly": random.randint(400, 900),
                    "gas_monthly": random.randint(200, 500)
                }
            },
            
            # Real estate information
            "real_estate": {
                "included": random.choice([True, False]),
                "building_value": round(asking_price * random.uniform(0.4, 0.7), 0) if random.choice([True, False]) else None,
                "land_size": f"{random.uniform(0.5, 2.1):.1f} acres" if random.choice([True, False]) else None,
                "parking_spaces": random.randint(15, 40),
                "zoning": "Commercial"
            },
            
            # Listing details
            "listing_details": {
                "status": random.choice(["active", "pending", "under_contract"]),
                "listing_date": (datetime.utcnow() - timedelta(days=random.randint(1, 45))).isoformat(),
                "broker": {
                    "name": f"{random.choice(['Sarah', 'Mike', 'Jennifer', 'David', 'Lisa'])} {random.choice(['Johnson', 'Williams', 'Brown', 'Davis', 'Miller'])}",
                    "company": random.choice(["Commercial Laundry Brokers", "National Laundromat Sales", "Business Brokers LLC"]),
                    "phone": f"({random.randint(200, 999)}) {random.randint(200, 999)}-{random.randint(1000, 9999)}",
                    "email": f"broker{random.randint(1, 100)}@example.com"
                },
                "verified": random.choice([True, False]),
                "featured": random.choice([True, False]),
                "views": random.randint(45, 890),
                "inquiries": random.randint(2, 25)
            },
            
            # Media
            "media": {
                "photos": [
                    f"https://picsum.photos/800/600?random={listing_id}1",
                    f"https://picsum.photos/800/600?random={listing_id}2",
                    f"https://picsum.photos/800/600?random={listing_id}3"
                ],
                "virtual_tour": random.choice([True, False]),
                "floor_plan": random.choice([True, False])
            },
            
            # Market intelligence
            "market_intelligence": {
                "local_competition": random.randint(2, 8),
                "market_saturation": random.choice(["Low", "Medium", "High"]),
                "growth_potential": random.choice(["Excellent", "Good", "Fair"]),
                "risk_factors": random.choice([
                    ["New development planned"],
                    ["Aging equipment", "High rent"],
                    ["Strong competition nearby"],
                    []
                ])
            },
            
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        return listing
    
    async def populate_marketplace_listings(self, count=25):
        """Populate professional marketplace listings"""
        logger.info(f"Generating {count} professional marketplace listings...")
        
        # Clear existing listings
        await self.db.marketplace_listings.delete_many({})
        
        listings = []
        for i in range(count):
            listing = self.generate_professional_listing(i + 1)
            listings.append(listing)
        
        try:
            await self.db.marketplace_listings.insert_many(listings)
            logger.info(f"✅ Created {count} professional marketplace listings")
            return listings
        except Exception as e:
            logger.error(f"❌ Failed to create marketplace listings: {e}")
            raise
    
    async def close(self):
        """Close database connection"""
        if self.client:
            self.client.close()

async def main():
    """Main execution function"""
    populator = MarketplaceDataPopulator()
    
    try:
        await populator.connect()
        logger.info("Starting marketplace data population...")
        
        # Populate marketplace listings
        await populator.populate_marketplace_listings(25)
        
        logger.info("✅ Marketplace data population completed successfully!")
        
    except Exception as e:
        logger.error(f"❌ Marketplace data population failed: {e}")
        raise
    finally:
        await populator.close()

if __name__ == "__main__":
    asyncio.run(main())