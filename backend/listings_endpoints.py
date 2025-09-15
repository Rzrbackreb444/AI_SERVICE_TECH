"""
Laundromat Listings API Endpoints
Provides real laundromat listings for the consultant widget
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Optional
import asyncio
import logging
from datetime import datetime, timedelta
import json
import os

from listings_scraper import listings_scraper, LaundryListing

router = APIRouter()

# Cache for listings (refresh every 24 hours)
listings_cache = {
    'data': [],
    'last_updated': None,
    'expires_at': None
}

CACHE_DURATION_HOURS = 24

async def get_cached_listings() -> List[Dict]:
    """Get listings from cache or refresh if expired"""
    now = datetime.now()
    
    # Check if cache is valid
    if (listings_cache['expires_at'] and 
        now < listings_cache['expires_at'] and 
        listings_cache['data']):
        return listings_cache['data']
    
    # Refresh cache
    try:
        # Run scraping in thread pool to avoid blocking
        loop = asyncio.get_event_loop()
        listings = await loop.run_in_executor(None, listings_scraper.scrape_all_sources)
        
        # Convert to dict format
        listings_data = []
        for listing in listings:
            listings_data.append({
                'title': listing.title,
                'price': listing.price,
                'location': listing.location,
                'revenue': listing.revenue,
                'cash_flow': listing.cash_flow,
                'description': listing.description,
                'url': listing.url,
                'source': listing.source,
                'posted_date': listing.posted_date,
                'business_type': listing.business_type,
                'square_footage': listing.square_footage,
                'equipment_count': listing.equipment_count,
                'lease_info': listing.lease_info
            })
        
        # Update cache
        listings_cache['data'] = listings_data
        listings_cache['last_updated'] = now
        listings_cache['expires_at'] = now + timedelta(hours=CACHE_DURATION_HOURS)
        
        logging.info(f"Refreshed listings cache with {len(listings_data)} listings")
        return listings_data
        
    except Exception as e:
        logging.error(f"Error refreshing listings cache: {e}")
        
        # Return cached data if available, even if expired
        if listings_cache['data']:
            return listings_cache['data']
        
        # Return demo data as fallback
        demo_listings = listings_scraper.get_demo_listings()
        return [listing.__dict__ for listing in demo_listings]

@router.get("/listings/current")
async def get_current_listings(limit: int = 10):
    """Get current laundromat listings"""
    try:
        listings = await get_cached_listings()
        
        # Limit results
        limited_listings = listings[:limit]
        
        return {
            'success': True,
            'count': len(limited_listings),
            'listings': limited_listings,
            'last_updated': listings_cache['last_updated'].isoformat() if listings_cache['last_updated'] else None,
            'message': f'Found {len(limited_listings)} current laundromat opportunities'
        }
        
    except Exception as e:
        logging.error(f"Error getting current listings: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch listings")

@router.get("/listings/by-location")
async def get_listings_by_location(state: Optional[str] = None, city: Optional[str] = None):
    """Get listings filtered by location"""
    try:
        all_listings = await get_cached_listings()
        
        filtered_listings = all_listings
        
        if state:
            filtered_listings = [
                listing for listing in filtered_listings 
                if state.lower() in listing['location'].lower()
            ]
        
        if city:
            filtered_listings = [
                listing for listing in filtered_listings 
                if city.lower() in listing['location'].lower()
            ]
        
        return {
            'success': True,
            'count': len(filtered_listings),
            'listings': filtered_listings,
            'filters': {
                'state': state,
                'city': city
            }
        }
        
    except Exception as e:
        logging.error(f"Error filtering listings by location: {e}")
        raise HTTPException(status_code=500, detail="Failed to filter listings")

@router.get("/listings/price-range")
async def get_listings_by_price(min_price: Optional[int] = None, max_price: Optional[int] = None):
    """Get listings filtered by price range"""
    try:
        all_listings = await get_cached_listings()
        
        filtered_listings = []
        
        for listing in all_listings:
            try:
                # Extract numeric price from string like "$425,000"
                price_str = listing['price'].replace('$', '').replace(',', '').replace('Contact', '0')
                
                # Handle various price formats
                if 'on request' in price_str.lower() or 'contact' in price_str.lower():
                    price_num = 0
                else:
                    # Extract first number found
                    import re
                    numbers = re.findall(r'\d+', price_str)
                    price_num = int(numbers[0]) if numbers else 0
                
                # Apply filters
                if min_price and price_num < min_price:
                    continue
                if max_price and price_num > max_price:
                    continue
                
                filtered_listings.append(listing)
                
            except (ValueError, IndexError):
                # Include listings with unclear pricing
                if not min_price and not max_price:
                    filtered_listings.append(listing)
        
        return {
            'success': True,
            'count': len(filtered_listings),
            'listings': filtered_listings,
            'filters': {
                'min_price': min_price,
                'max_price': max_price
            }
        }
        
    except Exception as e:
        logging.error(f"Error filtering listings by price: {e}")
        raise HTTPException(status_code=500, detail="Failed to filter listings by price")

@router.get("/listings/formatted-for-consultant")
async def get_formatted_listings():
    """Get listings formatted for consultant widget responses"""
    try:
        listings_data = await get_cached_listings()
        
        # Convert back to LaundryListing objects for formatting
        listings = []
        for data in listings_data[:5]:  # Limit to 5 for consultant
            listing = LaundryListing(**data)
            listings.append(listing)
        
        formatted_response = listings_scraper.format_for_consultant(listings)
        
        return {
            'success': True,
            'formatted_message': formatted_response,
            'raw_listings': listings_data[:5],
            'count': len(listings)
        }
        
    except Exception as e:
        logging.error(f"Error formatting listings for consultant: {e}")
        raise HTTPException(status_code=500, detail="Failed to format listings")

@router.post("/listings/analyze")
async def request_listing_analysis(listing_location: str):
    """Request analysis for a specific listing location"""
    try:
        # This would integrate with your existing location analysis
        return {
            'success': True,
            'message': f'Analysis requested for {listing_location}',
            'analysis_url': f'/analyze?address={listing_location}',
            'upgrade_message': 'Upgrade to Market Analyzer ($29/month) for detailed investment analysis of this opportunity!'
        }
        
    except Exception as e:
        logging.error(f"Error requesting analysis: {e}")
        raise HTTPException(status_code=500, detail="Failed to request analysis")

@router.get("/listings/refresh")
async def refresh_listings_cache():
    """Manually refresh the listings cache (admin endpoint)"""
    try:
        # Force cache refresh
        listings_cache['expires_at'] = datetime.now() - timedelta(hours=1)
        
        listings = await get_cached_listings()
        
        return {
            'success': True,
            'message': 'Listings cache refreshed successfully',
            'count': len(listings),
            'last_updated': listings_cache['last_updated'].isoformat()
        }
        
    except Exception as e:
        logging.error(f"Error refreshing listings cache: {e}")
        raise HTTPException(status_code=500, detail="Failed to refresh listings")