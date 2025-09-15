#!/usr/bin/env python3
"""
Sample Data Population Script
Populates MongoDB with realistic sample data for analytics dashboard demonstration
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

class SampleDataPopulator:
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
    
    async def populate_users(self, count=50):
        """Populate sample users"""
        users = []
        for i in range(count):
            user_id = str(uuid.uuid4())
            created_date = datetime.utcnow() - timedelta(days=random.randint(1, 90))
            
            user = {
                "id": user_id,
                "email": f"user_{i}@laundrotech.demo",
                "full_name": f"Demo User {i}",
                "facebook_group_member": random.choice([True, False]),
                "subscription_tier": random.choice(["free", "professional", "enterprise"]),
                "created_at": created_date,
                "updated_at": created_date,
                "password_hash": "demo_hash"
            }
            users.append(user)
        
        await self.db.users.insert_many(users)
        logger.info(f"Created {count} sample users")
        return users
    
    async def populate_payment_transactions(self, users, count=100):
        """Populate sample payment transactions"""
        transactions = []
        offer_types = ["verified_seller", "vendor_partner", "verified_funder", "featured_post", "logo_placement", "sponsored_ama"]
        amounts = {"verified_seller": 29, "vendor_partner": 149, "verified_funder": 299, 
                  "featured_post": 250, "logo_placement": 299, "sponsored_ama": 499}
        
        for i in range(count):
            transaction_id = str(uuid.uuid4())
            user = random.choice(users)
            offer_type = random.choice(offer_types)
            created_date = datetime.utcnow() - timedelta(days=random.randint(1, 60))
            
            transaction = {
                "id": transaction_id,
                "user_id": user["id"],
                "offer_type": offer_type,
                "amount": amounts[offer_type],
                "payment_status": random.choice(["completed", "pending", "failed"]),
                "payment_provider": random.choice(["stripe", "paypal"]),
                "platform": "facebook_group",
                "created_at": created_date,
                "updated_at": created_date
            }
            transactions.append(transaction)
        
        await self.db.payment_transactions.insert_many(transactions)
        logger.info(f"Created {count} sample payment transactions")
        return transactions
    
    async def populate_facebook_subscriptions(self, users):
        """Populate sample Facebook subscriptions"""
        subscriptions = []
        badge_types = ["verified_seller", "vendor_partner", "verified_funder"]
        
        for user in users:
            if random.random() < 0.3:  # 30% of users have subscriptions
                subscription_id = str(uuid.uuid4())
                badge_type = random.choice(badge_types)
                created_date = datetime.utcnow() - timedelta(days=random.randint(1, 180))
                
                subscription = {
                    "id": subscription_id,
                    "user_id": user["id"],
                    "offer_type": badge_type,
                    "subscription_status": random.choice(["active", "cancelled", "expired"]),
                    "created_at": created_date,
                    "updated_at": created_date,
                    "expires_at": created_date + timedelta(days=365)
                }
                subscriptions.append(subscription)
        
        if subscriptions:
            await self.db.facebook_subscriptions.insert_many(subscriptions)
            logger.info(f"Created {len(subscriptions)} Facebook subscriptions")
        return subscriptions
    
    async def populate_location_analyses(self, users, count=75):
        """Populate sample location analyses"""
        analyses = []
        sample_addresses = [
            "123 Main St, Springfield, IL",
            "456 Oak Ave, Portland, OR", 
            "789 Pine Rd, Austin, TX",
            "321 Elm St, Denver, CO",
            "654 Maple Dr, Seattle, WA",
            "987 Cedar Ln, Miami, FL",
            "147 Birch Ct, Boston, MA",
            "258 Willow Way, Phoenix, AZ"
        ]
        
        for i in range(count):
            analysis_id = str(uuid.uuid4())
            user = random.choice(users)
            created_date = datetime.utcnow() - timedelta(days=random.randint(1, 120))
            
            analysis = {
                "id": analysis_id,
                "user_id": user["id"],
                "address": random.choice(sample_addresses),
                "overall_grade": random.choice(["A+", "A", "A-", "B+", "B", "B-", "C+", "C"]),
                "grade_score": random.randint(65, 98),
                "revenue_potential": {
                    "annual_revenue": random.randint(200000, 800000),
                    "monthly_profit": random.randint(15000, 65000)
                },
                "competitors": [
                    {"name": f"Competitor {j}", "distance": random.uniform(0.1, 2.5)} 
                    for j in range(random.randint(1, 5))
                ],
                "demographics": {
                    "population": random.randint(25000, 150000),
                    "median_income": random.randint(45000, 95000),
                    "age_distribution": {"25-34": 0.25, "35-44": 0.20, "45-54": 0.18}
                },
                "risk_factors": [f"Risk factor {k}" for k in range(random.randint(0, 3))],
                "opportunities": [f"Opportunity {k}" for k in range(random.randint(1, 4))],
                "created_at": created_date,
                "updated_at": created_date
            }
            analyses.append(analysis)
        
        await self.db.location_analyses.insert_many(analyses)
        logger.info(f"Created {count} location analyses")
    
    async def populate_user_sessions(self, users):
        """Populate sample user sessions for analytics"""
        sessions = []
        
        for user in users:
            # Create multiple sessions per user
            session_count = random.randint(1, 15)
            for i in range(session_count):
                session_id = str(uuid.uuid4())
                created_date = datetime.utcnow() - timedelta(days=random.randint(1, 30))
                
                session = {
                    "id": session_id,
                    "user_id": user["id"],
                    "created_at": created_date,
                    "duration_minutes": random.randint(2, 45),
                    "pages_viewed": random.randint(1, 10)
                }
                sessions.append(session)
        
        await self.db.user_sessions.insert_many(sessions)
        logger.info(f"Created {len(sessions)} user sessions")
    
    async def populate_all_data(self):
        """Populate all sample data"""
        try:
            await self.connect()
            
            logger.info("Starting sample data population...")
            
            # Create users first
            users = await self.populate_users(50)
            
            # Create dependent data
            await self.populate_payment_transactions(users, 100)
            await self.populate_facebook_subscriptions(users)
            await self.populate_location_analyses(users, 75)
            await self.populate_user_sessions(users)
            
            logger.info("✅ Sample data population completed successfully!")
            
        except Exception as e:
            logger.error(f"❌ Sample data population failed: {e}")
            raise
        finally:
            if self.client:
                self.client.close()

async def main():
    populator = SampleDataPopulator()
    await populator.populate_all_data()

if __name__ == "__main__":
    asyncio.run(main())