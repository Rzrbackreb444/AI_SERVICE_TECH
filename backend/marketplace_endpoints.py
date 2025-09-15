"""
LaundroTech Marketplace - API Endpoints
Enterprise marketplace REST API
"""

from fastapi import APIRouter, HTTPException, Depends, Query, Request, UploadFile, File
from typing import List, Optional, Dict, Any
import logging
from datetime import datetime
import json

from marketplace_models import (
    Listing, User, Inquiry, Offer, Transaction, SavedListing,
    SearchAlert, ListingResponse, SearchResults, MarketStats,
    ListingStatus, ListingType, PropertyType, UserRole
)
from marketplace_service import get_marketplace_service, MarketplaceService

router = APIRouter()

# Dependency to get authenticated user
async def get_current_user(request: Request) -> Optional[str]:
    """Extract user ID from authentication token"""
    # TODO: Implement proper JWT authentication
    # For now, return None or mock user ID
    return None

@router.get("/marketplace/listings/search")
async def search_listings(
    request: Request,
    location_states: Optional[str] = Query(None, description="Comma-separated state codes"),
    location_cities: Optional[str] = Query(None, description="Comma-separated city names"), 
    min_price: Optional[int] = Query(None, description="Minimum asking price"),
    max_price: Optional[int] = Query(None, description="Maximum asking price"),
    property_types: Optional[str] = Query(None, description="Comma-separated property types"),
    min_revenue: Optional[int] = Query(None, description="Minimum annual revenue"),
    max_revenue: Optional[int] = Query(None, description="Maximum annual revenue"),
    sort_by: str = Query("created_at", description="Sort field"),
    sort_order: str = Query("desc", description="Sort order (asc/desc)"),
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(20, ge=1, le=100, description="Results per page")
):
    """Search marketplace listings with advanced filters"""
    try:
        service = get_marketplace_service()
        user_id = await get_current_user(request)
        
        # Parse filters
        location_filter = {}
        if location_states:
            location_filter["states"] = [s.strip() for s in location_states.split(",")]
        if location_cities:
            location_filter["cities"] = [c.strip() for c in location_cities.split(",")]
        
        price_range = {}
        if min_price:
            price_range["min_price"] = min_price
        if max_price:
            price_range["max_price"] = max_price
        
        property_type_list = None
        if property_types:
            property_type_list = [t.strip() for t in property_types.split(",")]
        
        revenue_range = {}
        if min_revenue:
            revenue_range["min_revenue"] = min_revenue  
        if max_revenue:
            revenue_range["max_revenue"] = max_revenue
        
        # Execute search
        results = await service.search_listings(
            user_id=user_id,
            location_filter=location_filter if location_filter else None,
            price_range=price_range if price_range else None,
            property_types=property_type_list,
            revenue_range=revenue_range if revenue_range else None,
            sort_by=sort_by,
            sort_order=sort_order,
            page=page,
            per_page=per_page
        )
        
        return {
            "success": True,
            "data": results.dict(),
            "message": f"Found {results.total_count} listings"
        }
        
    except Exception as e:
        logging.error(f"Error searching listings: {e}")
        raise HTTPException(status_code=500, detail="Failed to search listings")

@router.get("/marketplace/listings/{listing_id}")
async def get_listing_details(listing_id: str, request: Request):
    """Get detailed information for a specific listing"""
    try:
        service = get_marketplace_service()
        user_id = await get_current_user(request)
        
        listing_response = await service.get_listing_details(listing_id, user_id)
        
        if not listing_response:
            raise HTTPException(status_code=404, detail="Listing not found")
        
        return {
            "success": True,
            "data": listing_response.dict(),
            "message": "Listing details retrieved successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error getting listing details: {e}")
        raise HTTPException(status_code=500, detail="Failed to get listing details")

@router.post("/marketplace/listings")
async def create_listing(listing_data: Dict[str, Any], request: Request):
    """Create a new marketplace listing"""
    try:
        service = get_marketplace_service()
        user_id = await get_current_user(request)
        
        if not user_id:
            raise HTTPException(status_code=401, detail="Authentication required to create listings")
        
        # TODO: Validate user can create listings (verified seller/broker)
        
        listing = await service.create_listing(listing_data, user_id)
        
        return {
            "success": True,
            "data": {
                "listing_id": listing.id,
                "status": listing.status,
                "created_at": listing.created_at.isoformat()
            },
            "message": "Listing created successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error creating listing: {e}")
        raise HTTPException(status_code=500, detail="Failed to create listing")

@router.post("/marketplace/listings/{listing_id}/inquire")
async def submit_inquiry(listing_id: str, inquiry_data: Dict[str, Any], request: Request):
    """Submit an inquiry for a listing"""
    try:
        service = get_marketplace_service()
        user_id = await get_current_user(request)
        
        if not user_id:
            raise HTTPException(status_code=401, detail="Authentication required to submit inquiries")
        
        # Add required fields
        inquiry_data["listing_id"] = listing_id
        inquiry_data["buyer_id"] = user_id
        
        # Get listing to populate seller_id
        listing_response = await service.get_listing_details(listing_id)
        if not listing_response:
            raise HTTPException(status_code=404, detail="Listing not found")
        
        inquiry_data["seller_id"] = listing_response.listing.seller_id
        if listing_response.listing.broker_id:
            inquiry_data["broker_id"] = listing_response.listing.broker_id
        
        inquiry = await service.submit_inquiry(inquiry_data)
        
        return {
            "success": True,
            "data": {
                "inquiry_id": inquiry.id,
                "created_at": inquiry.created_at.isoformat()
            },
            "message": "Inquiry submitted successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error submitting inquiry: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit inquiry")

@router.post("/marketplace/listings/{listing_id}/offers")
async def submit_offer(listing_id: str, offer_data: Dict[str, Any], request: Request):
    """Submit a formal offer on a listing"""
    try:
        service = get_marketplace_service()
        user_id = await get_current_user(request)
        
        if not user_id:
            raise HTTPException(status_code=401, detail="Authentication required to submit offers")
        
        # Add required fields
        offer_data["listing_id"] = listing_id
        offer_data["buyer_id"] = user_id
        
        # Get listing to populate seller_id
        listing_response = await service.get_listing_details(listing_id)
        if not listing_response:
            raise HTTPException(status_code=404, detail="Listing not found")
        
        offer_data["seller_id"] = listing_response.listing.seller_id
        if listing_response.listing.broker_id:
            offer_data["broker_id"] = listing_response.listing.broker_id
        
        offer = await service.submit_offer(offer_data)
        
        return {
            "success": True,
            "data": {
                "offer_id": offer.id,
                "status": offer.status,
                "created_at": offer.created_at.isoformat()
            },
            "message": "Offer submitted successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error submitting offer: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit offer")

@router.post("/marketplace/listings/{listing_id}/save")
async def save_listing(listing_id: str, request: Request):
    """Save listing to user's favorites"""
    try:
        service = get_marketplace_service()
        user_id = await get_current_user(request)
        
        if not user_id:
            raise HTTPException(status_code=401, detail="Authentication required to save listings")
        
        saved_listing = await service.save_listing(user_id, listing_id)
        
        return {
            "success": True,
            "data": {
                "saved_at": saved_listing.created_at.isoformat()
            },
            "message": "Listing saved to favorites"
        }
        
    except Exception as e:
        logging.error(f"Error saving listing: {e}")
        raise HTTPException(status_code=500, detail="Failed to save listing")

@router.get("/marketplace/stats")
async def get_market_stats(
    location_states: Optional[str] = Query(None, description="Comma-separated state codes for filtering")
):
    """Get current marketplace statistics"""
    try:
        service = get_marketplace_service()
        
        location_filter = {}
        if location_states:
            location_filter["states"] = [s.strip() for s in location_states.split(",")]
        
        stats = await service.get_market_stats(
            location_filter=location_filter if location_filter else None
        )
        
        return {
            "success": True,
            "data": stats.dict(),
            "message": "Market statistics retrieved successfully"
        }
        
    except Exception as e:
        logging.error(f"Error getting market stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to get market statistics")

@router.get("/marketplace/featured")
async def get_featured_listings(
    limit: int = Query(10, ge=1, le=50, description="Number of featured listings to return")
):
    """Get featured marketplace listings"""
    try:
        service = get_marketplace_service()
        
        # Search for featured listings
        results = await service.search_listings(
            page=1,
            per_page=limit
        )
        
        # Filter featured listings
        featured_listings = [
            lr for lr in results.listings 
            if lr.listing.featured or lr.listing.verified
        ]
        
        return {
            "success": True,
            "data": {
                "listings": [fl.dict() for fl in featured_listings[:limit]],
                "count": len(featured_listings[:limit])
            },
            "message": f"Retrieved {len(featured_listings[:limit])} featured listings"
        }
        
    except Exception as e:
        logging.error(f"Error getting featured listings: {e}")
        raise HTTPException(status_code=500, detail="Failed to get featured listings")

@router.post("/marketplace/listings/{listing_id}/photos")
async def upload_listing_photos(
    listing_id: str,
    photos: List[UploadFile] = File(...),
    request: Request = None
):
    """Upload photos for a listing"""
    try:
        user_id = await get_current_user(request)
        
        if not user_id:
            raise HTTPException(status_code=401, detail="Authentication required")
        
        # TODO: Implement photo upload to cloud storage
        # For now, return mock response
        photo_urls = []
        for i, photo in enumerate(photos):
            # Mock photo URL
            photo_url = f"https://cdn.laundrotech.com/listings/{listing_id}/photo_{i+1}.jpg"
            photo_urls.append(photo_url)
        
        return {
            "success": True,
            "data": {
                "photo_urls": photo_urls,
                "count": len(photo_urls)
            },
            "message": f"Uploaded {len(photo_urls)} photos successfully"
        }
        
    except Exception as e:
        logging.error(f"Error uploading photos: {e}")
        raise HTTPException(status_code=500, detail="Failed to upload photos")

@router.get("/marketplace/listings/{listing_id}/similar")
async def get_similar_listings(listing_id: str, limit: int = Query(5, ge=1, le=20)):
    """Get listings similar to the specified listing"""
    try:
        service = get_marketplace_service()
        
        # Get the base listing
        base_listing = await service.get_listing_details(listing_id)
        if not base_listing:
            raise HTTPException(status_code=404, detail="Listing not found")
        
        # Search for similar listings based on location, property type, and price range
        similar_results = await service.search_listings(
            location_filter={"states": [base_listing.listing.address.state]},
            property_types=[base_listing.listing.property_type],
            price_range={
                "min_price": float(base_listing.listing.financials.asking_price * 0.7),
                "max_price": float(base_listing.listing.financials.asking_price * 1.3)
            },
            per_page=limit + 1  # +1 to exclude the base listing
        )
        
        # Filter out the base listing itself
        similar_listings = [
            lr for lr in similar_results.listings 
            if lr.listing.id != listing_id
        ][:limit]
        
        return {
            "success": True,
            "data": {
                "listings": [sl.dict() for sl in similar_listings],
                "count": len(similar_listings)
            },
            "message": f"Found {len(similar_listings)} similar listings"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error getting similar listings: {e}")
        raise HTTPException(status_code=500, detail="Failed to get similar listings")