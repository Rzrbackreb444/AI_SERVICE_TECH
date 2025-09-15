"""
LaundroTech Marketplace - Core Business Logic
Enterprise-grade marketplace service layer
"""

import logging
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone, timedelta
from decimal import Decimal
import asyncio
from motor.motor_asyncio import AsyncIOMotorDatabase

from marketplace_models import (
    Listing, User, Inquiry, Offer, Transaction, SavedListing, 
    SearchAlert, MarketReport, ListingStatus, UserRole,
    ListingResponse, SearchResults, MarketStats
)

class MarketplaceService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.listings_collection = db.marketplace_listings
        self.users_collection = db.marketplace_users
        self.inquiries_collection = db.marketplace_inquiries
        self.offers_collection = db.marketplace_offers
        self.transactions_collection = db.marketplace_transactions
        self.saved_listings_collection = db.marketplace_saved_listings
        self.search_alerts_collection = db.marketplace_search_alerts
        self.market_reports_collection = db.marketplace_market_reports
        
    async def create_listing(self, listing_data: Dict[str, Any], seller_id: str) -> Listing:
        """Create a new marketplace listing"""
        try:
            # Validate seller exists and is verified
            seller = await self.users_collection.find_one({"id": seller_id})
            if not seller:
                raise ValueError("Seller not found")
            
            # Create listing object
            listing_dict = listing_data.copy()
            listing_dict["seller_id"] = seller_id
            listing_dict["status"] = ListingStatus.DRAFT
            
            listing = Listing(**listing_dict)
            
            # Generate market analysis if location provided
            if listing.address:
                market_analysis = await self._generate_market_analysis(listing)
                listing.market_analysis = market_analysis
            
            # Insert into database
            result = await self.listings_collection.insert_one(listing.dict())
            
            # Update listing with database ID if needed
            listing_dict = listing.dict()
            listing_dict["_id"] = result.inserted_id
            
            logging.info(f"Created listing {listing.id} for seller {seller_id}")
            return listing
            
        except Exception as e:
            logging.error(f"Error creating listing: {e}")
            raise
    
    async def search_listings(
        self, 
        user_id: Optional[str] = None,
        location_filter: Optional[Dict] = None,
        price_range: Optional[Dict] = None,
        property_types: Optional[List[str]] = None,
        revenue_range: Optional[Dict] = None,
        sort_by: str = "created_at",
        sort_order: str = "desc",
        page: int = 1,
        per_page: int = 20
    ) -> SearchResults:
        """Advanced listing search with multiple filters"""
        try:
            # Build MongoDB query
            query = {"status": ListingStatus.ACTIVE}
            
            # Location filter
            if location_filter:
                if location_filter.get("states"):
                    query["address.state"] = {"$in": location_filter["states"]}
                if location_filter.get("cities"):
                    query["address.city"] = {"$in": location_filter["cities"]}
                if location_filter.get("radius_miles") and location_filter.get("center_lat") and location_filter.get("center_lng"):
                    # Geospatial query for radius search
                    query["address.latitude"] = {"$exists": True}
                    query["address.longitude"] = {"$exists": True}
                    # Would implement proper geospatial query here
            
            # Price range filter
            if price_range:
                price_query = {}
                if price_range.get("min_price"):
                    price_query["$gte"] = price_range["min_price"]
                if price_range.get("max_price"):
                    price_query["$lte"] = price_range["max_price"]
                if price_query:
                    query["financials.asking_price"] = price_query
            
            # Property type filter
            if property_types:
                query["property_type"] = {"$in": property_types}
            
            # Revenue range filter
            if revenue_range:
                revenue_query = {}
                if revenue_range.get("min_revenue"):
                    revenue_query["$gte"] = revenue_range["min_revenue"]
                if revenue_range.get("max_revenue"):
                    revenue_query["$lte"] = revenue_range["max_revenue"]
                if revenue_query:
                    query["financials.annual_revenue"] = revenue_query
            
            # Sorting
            sort_field = sort_by
            sort_direction = -1 if sort_order == "desc" else 1
            
            # Execute search
            skip = (page - 1) * per_page
            cursor = self.listings_collection.find(query).sort(sort_field, sort_direction).skip(skip).limit(per_page)
            
            listings_data = await cursor.to_list(length=per_page)
            total_count = await self.listings_collection.count_documents(query)
            
            # Convert to Listing objects and add user context
            listings = []
            for listing_data in listings_data:
                listing = Listing(**listing_data)
                
                # Check if user has favorited or inquired
                is_favorited = False
                inquiry_sent = False
                
                if user_id:
                    saved = await self.saved_listings_collection.find_one({
                        "user_id": user_id, 
                        "listing_id": listing.id
                    })
                    is_favorited = bool(saved)
                    
                    inquiry = await self.inquiries_collection.find_one({
                        "buyer_id": user_id,
                        "listing_id": listing.id
                    })
                    inquiry_sent = bool(inquiry)
                
                listing_response = ListingResponse(
                    listing=listing,
                    is_favorited=is_favorited,
                    inquiry_sent=inquiry_sent,
                    view_count=listing.view_count
                )
                listings.append(listing_response)
            
            return SearchResults(
                listings=listings,
                total_count=total_count,
                page=page,
                per_page=per_page,
                filters_applied={
                    "location": location_filter,
                    "price_range": price_range,
                    "property_types": property_types,
                    "revenue_range": revenue_range
                }
            )
            
        except Exception as e:
            logging.error(f"Error searching listings: {e}")
            raise
    
    async def get_listing_details(self, listing_id: str, user_id: Optional[str] = None) -> Optional[ListingResponse]:
        """Get detailed listing information"""
        try:
            listing_data = await self.listings_collection.find_one({"id": listing_id})
            if not listing_data:
                return None
            
            listing = Listing(**listing_data)
            
            # Increment view count
            await self.listings_collection.update_one(
                {"id": listing_id},
                {"$inc": {"view_count": 1}}
            )
            
            # Get user context
            is_favorited = False
            inquiry_sent = False
            
            if user_id:
                saved = await self.saved_listings_collection.find_one({
                    "user_id": user_id,
                    "listing_id": listing_id
                })
                is_favorited = bool(saved)
                
                inquiry = await self.inquiries_collection.find_one({
                    "buyer_id": user_id,
                    "listing_id": listing_id
                })
                inquiry_sent = bool(inquiry)
            
            return ListingResponse(
                listing=listing,
                is_favorited=is_favorited,
                inquiry_sent=inquiry_sent,
                view_count=listing.view_count + 1
            )
            
        except Exception as e:
            logging.error(f"Error getting listing details: {e}")
            raise
    
    async def submit_inquiry(self, inquiry_data: Dict[str, Any]) -> Inquiry:
        """Submit buyer inquiry for a listing"""
        try:
            inquiry = Inquiry(**inquiry_data)
            
            # Validate listing exists and is active
            listing = await self.listings_collection.find_one({
                "id": inquiry.listing_id,
                "status": ListingStatus.ACTIVE
            })
            if not listing:
                raise ValueError("Listing not found or inactive")
            
            # Insert inquiry
            await self.inquiries_collection.insert_one(inquiry.dict())
            
            # Update listing inquiry count
            await self.listings_collection.update_one(
                {"id": inquiry.listing_id},
                {"$inc": {"inquiry_count": 1}}
            )
            
            # TODO: Send notification to seller/broker
            # await self._notify_inquiry_received(inquiry)
            
            logging.info(f"Inquiry submitted for listing {inquiry.listing_id}")
            return inquiry
            
        except Exception as e:
            logging.error(f"Error submitting inquiry: {e}")
            raise
    
    async def submit_offer(self, offer_data: Dict[str, Any]) -> Offer:
        """Submit formal offer on a listing"""
        try:
            offer = Offer(**offer_data)
            
            # Validate listing exists and is active
            listing = await self.listings_collection.find_one({
                "id": offer.listing_id,
                "status": ListingStatus.ACTIVE
            })
            if not listing:
                raise ValueError("Listing not found or inactive")
            
            # Insert offer
            await self.offers_collection.insert_one(offer.dict())
            
            # TODO: Send notification to seller/broker
            # await self._notify_offer_received(offer)
            
            logging.info(f"Offer submitted for listing {offer.listing_id}")
            return offer
            
        except Exception as e:
            logging.error(f"Error submitting offer: {e}")
            raise
    
    async def get_market_stats(self, location_filter: Optional[Dict] = None) -> MarketStats:
        """Get current market statistics"""
        try:
            # Build query
            query = {"status": ListingStatus.ACTIVE}
            if location_filter and location_filter.get("states"):
                query["address.state"] = {"$in": location_filter["states"]}
            
            # Aggregate statistics
            pipeline = [
                {"$match": query},
                {"$group": {
                    "_id": None,
                    "total_listings": {"$sum": 1},
                    "avg_price": {"$avg": "$financials.asking_price"},
                    "median_price": {"$push": "$financials.asking_price"},
                    "avg_revenue": {"$avg": "$financials.annual_revenue"},
                    "avg_days_on_market": {"$avg": {
                        "$dateDiff": {
                            "startDate": "$created_at",
                            "endDate": "$$NOW",
                            "unit": "day"
                        }
                    }}
                }}
            ]
            
            result = await self.listings_collection.aggregate(pipeline).to_list(1)
            stats_data = result[0] if result else {}
            
            # Calculate median price
            median_price = Decimal("0")
            if stats_data.get("median_price"):
                prices = sorted(stats_data["median_price"])
                n = len(prices)
                if n > 0:
                    if n % 2 == 0:
                        median_price = (prices[n//2-1] + prices[n//2]) / 2
                    else:
                        median_price = prices[n//2]
            
            # New listings this month
            month_ago = datetime.now(timezone.utc) - timedelta(days=30)
            new_listings_count = await self.listings_collection.count_documents({
                **query,
                "created_at": {"$gte": month_ago}
            })
            
            return MarketStats(
                total_active_listings=stats_data.get("total_listings", 0),
                average_price=Decimal(str(stats_data.get("avg_price", 0))),
                median_price=median_price,
                average_revenue=Decimal(str(stats_data.get("avg_revenue", 0))) if stats_data.get("avg_revenue") else None,
                average_days_on_market=int(stats_data.get("avg_days_on_market", 0)),
                new_listings_this_month=new_listings_count,
                price_trend_30_days=0.0  # TODO: Calculate price trend
            )
            
        except Exception as e:
            logging.error(f"Error getting market stats: {e}")
            raise
    
    async def save_listing(self, user_id: str, listing_id: str, notes: Optional[str] = None) -> SavedListing:
        """Save listing to user's favorites"""
        try:
            # Check if already saved
            existing = await self.saved_listings_collection.find_one({
                "user_id": user_id,
                "listing_id": listing_id
            })
            
            if existing:
                return SavedListing(**existing)
            
            saved_listing = SavedListing(
                user_id=user_id,
                listing_id=listing_id,
                notes=notes
            )
            
            await self.saved_listings_collection.insert_one(saved_listing.dict())
            
            # Update listing favorite count
            await self.listings_collection.update_one(
                {"id": listing_id},
                {"$inc": {"favorite_count": 1}}
            )
            
            return saved_listing
            
        except Exception as e:
            logging.error(f"Error saving listing: {e}")
            raise
    
    async def _generate_market_analysis(self, listing: Listing) -> Optional[Dict[str, Any]]:
        """Generate AI-powered market analysis for listing"""
        try:
            # This would integrate with your existing location analysis system
            # For now, return basic structure
            return {
                "market_score": 75,
                "competition_density": "medium",
                "demographic_score": 82,
                "growth_potential": "good",
                "risk_factors": ["High competition within 2 miles", "Lease expires in 3 years"],
                "opportunities": ["Growing residential area", "Limited premium services"],
                "comparable_sales": []
            }
            
        except Exception as e:
            logging.error(f"Error generating market analysis: {e}")
            return None

# Global service instance
marketplace_service: Optional[MarketplaceService] = None

def get_marketplace_service() -> MarketplaceService:
    if marketplace_service is None:
        raise RuntimeError("Marketplace service not initialized")
    return marketplace_service

def initialize_marketplace_service(db: AsyncIOMotorDatabase):
    global marketplace_service
    marketplace_service = MarketplaceService(db)