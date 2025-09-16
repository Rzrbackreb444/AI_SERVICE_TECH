"""
SEO-Optimized Marketplace Listings System
High-ranking, keyphrase-focused laundromat listings for search visibility
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
import uuid
import re
import os
from motor.motor_asyncio import AsyncIOMotorClient
import logging

# Database connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client.sitetitan_db

logger = logging.getLogger(__name__)

class SEOListingData(BaseModel):
    """SEO-optimized listing data model"""
    seo_title: str = Field(..., description="SEO optimized title")
    meta_description: str = Field(..., description="Meta description for search results")
    focus_keyphrase: str = Field(..., description="Primary focus keyphrase")
    secondary_keyphrases: List[str] = Field(default_factory=list, description="Secondary keyphrases")
    schema_markup: Dict[str, Any] = Field(default_factory=dict, description="JSON-LD structured data")
    canonical_url: str = Field(..., description="Canonical URL for the listing")
    social_media_title: str = Field(..., description="Title for social sharing")
    social_media_description: str = Field(..., description="Description for social sharing")
    social_media_image: str = Field(..., description="Image for social sharing")

def create_seo_marketplace_router():
    router = APIRouter(prefix="/seo-marketplace", tags=["SEO Marketplace"])

    def generate_high_ranking_keyphrases(listing_data: dict) -> List[str]:
        """Generate high-ranking focus keyphrases for laundromat listings"""
        location = listing_data.get('location', {})
        city = location.get('city', '')
        state = location.get('state', '')
        
        base_keyphrases = [
            f"laundromat for sale {city} {state}",
            f"coin laundry business {city}",
            f"laundromat investment {city}",
            f"commercial laundry for sale {state}",
            f"laundromat business opportunity {city}",
            f"self service laundry {city}",
            f"washers and dryers business {city}",
            f"laundromat real estate {city} {state}",
            f"coin operated laundry {city}",
            f"laundromat franchise {city}",
        ]
        
        # Add revenue-based keyphrases
        revenue = listing_data.get('financials', {}).get('annual_revenue', 0)
        if revenue > 500000:
            base_keyphrases.extend([
                f"high revenue laundromat {city}",
                f"profitable laundromat for sale {city}",
                f"established laundromat business {city}"
            ])
        
        # Add equipment-based keyphrases
        equipment = listing_data.get('equipment', {})
        if equipment.get('washers', {}).get('brand'):
            brand = equipment['washers']['brand']
            base_keyphrases.extend([
                f"{brand} laundromat for sale {city}",
                f"commercial {brand} washers {city}",
                f"{brand} equipment laundromat {state}"
            ])
        
        return base_keyphrases[:10]  # Return top 10 keyphrases

    def generate_seo_optimized_title(listing_data: dict) -> str:
        """Generate SEO-optimized title with primary keyphrase"""
        location = listing_data.get('location', {})
        city = location.get('city', '')
        state = location.get('state', '')
        
        revenue = listing_data.get('financials', {}).get('annual_revenue', 0)
        asking_price = listing_data.get('financials', {}).get('asking_price', 0)
        
        if revenue > 500000:
            return f"High-Revenue Laundromat for Sale in {city}, {state} - ${asking_price:,.0f}"
        else:
            return f"Laundromat Business for Sale {city} {state} | ${asking_price:,.0f} Investment"

    def generate_meta_description(listing_data: dict) -> str:
        """Generate compelling meta description with keyphrases"""
        location = listing_data.get('location', {})
        city = location.get('city', '')
        state = location.get('state', '')
        
        financials = listing_data.get('financials', {})
        roi = financials.get('roi_percentage', 0)
        revenue = financials.get('annual_revenue', 0)
        
        equipment = listing_data.get('equipment', {})
        washers = equipment.get('washers', {}).get('count', 0)
        dryers = equipment.get('dryers', {}).get('count', 0)
        
        return f"Profitable laundromat for sale in {city}, {state}. {roi:.1f}% ROI, ${revenue:,.0f} annual revenue, {washers}+{dryers} machines. Prime location, established business. Contact for details."

    def generate_schema_markup(listing_data: dict, seo_data: dict) -> dict:
        """Generate JSON-LD schema markup for business listings"""
        location = listing_data.get('location', {})
        financials = listing_data.get('financials', {})
        
        schema = {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": seo_data.get('seo_title'),
            "description": seo_data.get('meta_description'),
            "url": seo_data.get('canonical_url'),
            "image": listing_data.get('media', {}).get('photos', [None])[0],
            "address": {
                "@type": "PostalAddress",
                "streetAddress": location.get('address', ''),
                "addressLocality": location.get('city', ''),
                "addressRegion": location.get('state', ''),
                "postalCode": location.get('zip_code', ''),
                "addressCountry": "US"
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": location.get('coordinates', {}).get('lat'),
                "longitude": location.get('coordinates', {}).get('lng')
            },
            "priceRange": f"${financials.get('asking_price', 0):,.0f}",
            "category": "Laundromat",
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.5",
                "reviewCount": "1"
            },
            "offers": {
                "@type": "Offer",
                "price": financials.get('asking_price', 0),
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock",
                "businessFunction": "https://schema.org/Sell"
            }
        }
        
        # Add additional business properties
        if financials.get('annual_revenue'):
            schema["additionalProperty"] = [{
                "@type": "PropertyValue",
                "name": "Annual Revenue",
                "value": f"${financials['annual_revenue']:,.0f}"
            }]
        
        return schema

    @router.post("/optimize-listing/{listing_id}")
    async def optimize_listing_seo(listing_id: str):
        """Optimize an existing marketplace listing for SEO"""
        try:
            # Get existing listing
            listing = await db.marketplace_listings.find_one({"id": listing_id})
            if not listing:
                raise HTTPException(status_code=404, detail="Listing not found")
            
            # Generate SEO data
            seo_title = generate_seo_optimized_title(listing)
            meta_description = generate_meta_description(listing)
            focus_keyphrase = f"laundromat for sale {listing.get('location', {}).get('city', '')}"
            secondary_keyphrases = generate_high_ranking_keyphrases(listing)
            
            canonical_url = f"https://laundrotech.com/marketplace/{listing.get('slug', listing_id)}"
            
            seo_data = {
                "seo_title": seo_title,
                "meta_description": meta_description,
                "focus_keyphrase": focus_keyphrase,
                "secondary_keyphrases": secondary_keyphrases,
                "canonical_url": canonical_url,
                "social_media_title": seo_title,
                "social_media_description": meta_description,
                "social_media_image": listing.get('media', {}).get('photos', [None])[0] or "https://laundrotech.com/default-listing-image.jpg"
            }
            
            # Generate schema markup
            seo_data["schema_markup"] = generate_schema_markup(listing, seo_data)
            
            # Calculate SEO score
            seo_score = calculate_listing_seo_score(listing, seo_data)
            
            # Update listing with SEO data
            update_data = {
                "seo_data": seo_data,
                "seo_score": seo_score,
                "seo_optimized_at": datetime.now(timezone.utc)
            }
            
            await db.marketplace_listings.update_one(
                {"id": listing_id},
                {"$set": update_data}
            )
            
            logger.info(f"Listing SEO optimized: {listing_id} with score: {seo_score}")
            
            return {
                "success": True,
                "listing_id": listing_id,
                "seo_data": seo_data,
                "seo_score": seo_score,
                "optimization_summary": {
                    "title_optimized": True,
                    "meta_description_optimized": True,
                    "keyphrases_targeted": len(secondary_keyphrases),
                    "schema_markup_added": True,
                    "canonical_url_set": True
                }
            }
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error optimizing listing SEO {listing_id}: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to optimize listing SEO: {str(e)}")

    @router.post("/optimize-all-listings")
    async def optimize_all_listings_seo():
        """Optimize all marketplace listings for SEO"""
        try:
            listings = await db.marketplace_listings.find({}).to_list(None)
            optimized_count = 0
            errors = []
            
            for listing in listings:
                try:
                    listing_id = listing.get('id')
                    if not listing_id:
                        continue
                    
                    # Generate SEO data
                    seo_title = generate_seo_optimized_title(listing)
                    meta_description = generate_meta_description(listing)
                    focus_keyphrase = f"laundromat for sale {listing.get('location', {}).get('city', '')}"
                    secondary_keyphrases = generate_high_ranking_keyphrases(listing)
                    
                    canonical_url = f"https://laundrotech.com/marketplace/{listing.get('slug', listing_id)}"
                    
                    seo_data = {
                        "seo_title": seo_title,
                        "meta_description": meta_description,
                        "focus_keyphrase": focus_keyphrase,
                        "secondary_keyphrases": secondary_keyphrases,
                        "canonical_url": canonical_url,
                        "social_media_title": seo_title,
                        "social_media_description": meta_description,
                        "social_media_image": listing.get('media', {}).get('photos', [None])[0] or "https://laundrotech.com/default-listing-image.jpg"
                    }
                    
                    # Generate schema markup
                    seo_data["schema_markup"] = generate_schema_markup(listing, seo_data)
                    
                    # Calculate SEO score
                    seo_score = calculate_listing_seo_score(listing, seo_data)
                    
                    # Update listing
                    await db.marketplace_listings.update_one(
                        {"id": listing_id},
                        {"$set": {
                            "seo_data": seo_data,
                            "seo_score": seo_score,
                            "seo_optimized_at": datetime.now(timezone.utc)
                        }}
                    )
                    
                    optimized_count += 1
                    
                except Exception as e:
                    errors.append(f"Listing {listing.get('id', 'unknown')}: {str(e)}")
            
            logger.info(f"Bulk SEO optimization completed: {optimized_count} listings optimized")
            
            return {
                "success": True,
                "optimized_count": optimized_count,
                "total_listings": len(listings),
                "errors": errors[:10] if errors else []  # Return first 10 errors
            }
            
        except Exception as e:
            logger.error(f"Error in bulk SEO optimization: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to optimize listings: {str(e)}")

    @router.get("/seo-analysis/{listing_id}")
    async def get_listing_seo_analysis(listing_id: str):
        """Get detailed SEO analysis for a marketplace listing"""
        try:
            listing = await db.marketplace_listings.find_one({"id": listing_id})
            if not listing:
                raise HTTPException(status_code=404, detail="Listing not found")
            
            seo_data = listing.get('seo_data', {})
            
            analysis = {
                "listing_id": listing_id,
                "seo_score": listing.get('seo_score', 0),
                "optimization_status": "optimized" if seo_data else "not_optimized",
                "seo_data": seo_data,
                "technical_analysis": {
                    "title_length": len(seo_data.get('seo_title', '')),
                    "meta_description_length": len(seo_data.get('meta_description', '')),
                    "focus_keyphrase": seo_data.get('focus_keyphrase', ''),
                    "secondary_keyphrases_count": len(seo_data.get('secondary_keyphrases', [])),
                    "schema_markup_present": bool(seo_data.get('schema_markup')),
                    "canonical_url_set": bool(seo_data.get('canonical_url')),
                    "social_media_optimized": bool(seo_data.get('social_media_title'))
                },
                "recommendations": []
            }
            
            # Generate recommendations
            if analysis["technical_analysis"]["title_length"] > 60:
                analysis["recommendations"].append("SEO title is too long. Keep under 60 characters.")
            
            if analysis["technical_analysis"]["meta_description_length"] < 120:
                analysis["recommendations"].append("Meta description too short. Aim for 120-160 characters.")
            elif analysis["technical_analysis"]["meta_description_length"] > 160:
                analysis["recommendations"].append("Meta description too long. Keep under 160 characters.")
            
            if analysis["technical_analysis"]["secondary_keyphrases_count"] < 5:
                analysis["recommendations"].append("Add more secondary keyphrases for better targeting.")
            
            if not analysis["technical_analysis"]["schema_markup_present"]:
                analysis["recommendations"].append("Add structured data markup for better search visibility.")
            
            return analysis
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error analyzing listing SEO {listing_id}: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to analyze listing SEO: {str(e)}")

    @router.get("/top-keyphrases")
    async def get_top_laundromat_keyphrases():
        """Get top-performing keyphrases for laundromat listings"""
        return {
            "primary_keyphrases": [
                "laundromat for sale",
                "coin laundry business",
                "laundromat investment",
                "commercial laundry for sale",
                "self service laundry",
                "laundromat business opportunity"
            ],
            "location_modifiers": [
                "{city} {state}",
                "{city} area",
                "near {city}",
                "{state} laundromat",
                "downtown {city}",
                "{city} commercial real estate"
            ],
            "revenue_modifiers": [
                "high revenue",
                "profitable",
                "established",
                "turnkey",
                "cash flow positive",
                "passive income"
            ],
            "equipment_modifiers": [
                "Speed Queen equipment",
                "Huebsch washers",
                "Continental dryers",
                "new equipment",
                "modern facility",
                "upgraded machines"
            ]
        }

    def calculate_listing_seo_score(listing_data: dict, seo_data: dict) -> float:
        """Calculate SEO score for marketplace listing"""
        score = 0.0
        
        # Title optimization (25 points)
        title = seo_data.get('seo_title', '')
        focus_keyphrase = seo_data.get('focus_keyphrase', '')
        
        if focus_keyphrase.lower() in title.lower():
            score += 25
        elif any(word in title.lower() for word in focus_keyphrase.lower().split()):
            score += 15
        
        # Meta description (20 points)
        meta_desc = seo_data.get('meta_description', '')
        if meta_desc:
            if 120 <= len(meta_desc) <= 160 and focus_keyphrase.lower() in meta_desc.lower():
                score += 20
            elif 100 <= len(meta_desc) <= 180:
                score += 15
            else:
                score += 10
        
        # Secondary keyphrases (15 points)
        secondary_keyphrases = seo_data.get('secondary_keyphrases', [])
        if len(secondary_keyphrases) >= 8:
            score += 15
        elif len(secondary_keyphrases) >= 5:
            score += 10
        elif len(secondary_keyphrases) >= 3:
            score += 5
        
        # Schema markup (15 points)
        if seo_data.get('schema_markup'):
            score += 15
        
        # Location data quality (10 points)
        location = listing_data.get('location', {})
        if location.get('city') and location.get('state') and location.get('coordinates'):
            score += 10
        elif location.get('city') and location.get('state'):
            score += 7
        
        # Financial data completeness (10 points)
        financials = listing_data.get('financials', {})
        if all(financials.get(key) for key in ['asking_price', 'annual_revenue', 'roi_percentage']):
            score += 10
        elif financials.get('asking_price') and financials.get('annual_revenue'):
            score += 7
        
        # Media optimization (5 points)
        if listing_data.get('media', {}).get('photos'):
            score += 5
        
        return min(score, 100.0)

    return router