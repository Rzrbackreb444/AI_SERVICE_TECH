"""
ENTERPRISE ENDPOINTS - The Real Deal
All APIs connected: Google Maps, ATTOM, Census, Mapbox
Street View, heatmaps, PDF generation, comprehensive intelligence
"""

import os
import json
from typing import Dict, Any, List
from fastapi import APIRouter, HTTPException, Depends, Response
from pydantic import BaseModel
from datetime import datetime
from enterprise_intelligence_engine import enterprise_engine
from motor.motor_asyncio import AsyncIOMotorClient
import base64

router = APIRouter(prefix="/api/enterprise-analysis", tags=["Enterprise Analysis"])

# Database connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'sitetitan_db')

async def get_current_user(token: str = None):
    """Basic auth check - replace with actual auth"""
    # For now, allow access - in production add proper JWT validation
    return {"id": f"user_{datetime.now().timestamp()}", "subscription_tier": "enterprise"}

class ComprehensiveAnalysisRequest(BaseModel):
    address: str
    analysis_type: str = "full"

class PDFGenerationRequest(BaseModel):
    analysis_data: Dict[str, Any]

@router.post("/comprehensive")
async def comprehensive_location_analysis(
    request: ComprehensiveAnalysisRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    COMPREHENSIVE location analysis using ALL data sources
    Google Maps, ATTOM Data, Census Bureau, competitive intelligence
    """
    try:
        print(f"🚀 Starting enterprise analysis for: {request.address}")
        
        # Run comprehensive analysis
        analysis_result = await enterprise_engine.comprehensive_location_analysis(
            address=request.address,
            analysis_type=request.analysis_type
        )
        
        if "error" in analysis_result:
            return {
                "success": False,
                "error": analysis_result["error"],
                "message": "Analysis failed - please check the address and try again"
            }
        
        # Save analysis to database
        try:
            client = AsyncIOMotorClient(mongo_url)
            db = client[db_name]
            
            analysis_record = {
                "id": f"analysis_{datetime.now().timestamp()}",
                "user_id": current_user["id"],
                "address": request.address,
                "analysis_data": analysis_result,
                "created_at": datetime.now(),
                "analysis_type": "enterprise_comprehensive"
            }
            
            await db.analyses.insert_one(analysis_record)
            print(f"✅ Analysis saved to database")
            
        except Exception as e:
            print(f"Database save error: {e}")
            # Continue even if database save fails
        
        return {
            "success": True,
            "analysis": analysis_result,
            "message": "Comprehensive analysis completed with real data from multiple sources",
            "data_sources": analysis_result.get("data_sources", []),
            "generated_at": analysis_result.get("generated_at")
        }
        
    except Exception as e:
        print(f"❌ Enterprise analysis error: {e}")
        return {
            "success": False,
            "error": str(e),
            "message": "Enterprise analysis failed - please try again"
        }

@router.get("/enterprise-status")
async def get_enterprise_platform_status():
    """Get enterprise platform status and API connections"""
    try:
        # Check API key configurations
        api_status = {
            "google_maps": bool(os.environ.get('GOOGLE_MAPS_API_KEY')) and os.environ.get('GOOGLE_MAPS_API_KEY') != 'YOUR_GOOGLE_MAPS_API_KEY',
            "attom_data": bool(os.environ.get('ATTOM_API_KEY')) and os.environ.get('ATTOM_API_KEY') != 'YOUR_ATTOM_API_KEY',
            "census_bureau": bool(os.environ.get('CENSUS_API_KEY')) and os.environ.get('CENSUS_API_KEY') != 'YOUR_CENSUS_API_KEY',
            "mapbox": bool(os.environ.get('MAPBOX_ACCESS_TOKEN')) and os.environ.get('MAPBOX_ACCESS_TOKEN') != 'YOUR_MAPBOX_TOKEN'
        }
        
        # Database connectivity
        try:
            client = AsyncIOMotorClient(mongo_url)
            db = client[db_name]
            await db.command('ping')
            database_status = "connected"
        except:
            database_status = "disconnected"
        
        return {
            "platform_status": "enterprise_operational",
            "api_connections": api_status,
            "database_status": database_status,
            "features_available": {
                "google_street_view": api_status["google_maps"],
                "real_estate_data": api_status["attom_data"],
                "census_demographics": api_status["census_bureau"], 
                "heatmap_visualization": api_status["mapbox"],
                "pdf_report_generation": True,
                "competitive_intelligence": True,
                "equipment_valuation": True
            },
            "community": {
                "facebook_group": "facebook.com/groups/thelaundromat",
                "members": "Growing community of laundromat professionals"
            },
            "system_timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        return {
            "platform_status": "error",
            "error": str(e),
            "message": "Enterprise status check failed"
        }