"""
FastAPI endpoints for AI Laundromat Consultant
Enterprise-grade professional consulting API
"""

import os
import uuid
from typing import Dict, Any, List
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel
from datetime import datetime
from auth import get_current_user
from ai_consultant import laundry_consultant
from motor.motor_asyncio import AsyncIOMotorClient

router = APIRouter(prefix="/api/consultant", tags=["AI Consultant"])

# Pydantic models
class ConsultantRequest(BaseModel):
    message: str
    session_id: str = None
    
class ConsultantResponse(BaseModel):
    success: bool
    response: str
    session_id: str
    consultant_type: str
    user_tier: str
    enhanced_features: List[str]
    timestamp: datetime
    
class ConversationHistory(BaseModel):
    conversations: List[Dict[str, Any]]
    total_conversations: int
    session_info: Dict[str, Any]

@router.post("/ask", response_model=ConsultantResponse)
async def ask_consultant(
    request: ConsultantRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Ask the professional AI laundromat consultant a question
    Provides enterprise-grade consulting equivalent to $500/hour expert
    """
    try:
        user_id = current_user.get("id")
        
        # Validate user access (basic validation - all authenticated users can access)
        if not user_id:
            raise HTTPException(status_code=401, detail="Authentication required")
            
        # Get consultant response
        result = await laundry_consultant.ask_consultant(
            user_id=user_id,
            message=request.message,
            session_id=request.session_id
        )
        
        if not result["success"]:
            raise HTTPException(status_code=500, detail=result.get("error", "Consultant service unavailable"))
            
        return ConsultantResponse(
            success=True,
            response=result["response"],
            session_id=result["session_id"],
            consultant_type=result["consultant_type"],
            user_tier=result["user_tier"],
            enhanced_features=result["enhanced_features"],
            timestamp=datetime.now()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/history/{session_id}", response_model=ConversationHistory)
async def get_conversation_history(
    session_id: str,
    limit: int = 20,
    current_user: dict = Depends(get_current_user)
):
    """Get conversation history for a specific session"""
    try:
        user_id = current_user.get("id")
        
        conversations = await laundry_consultant.get_conversation_history(
            user_id=user_id,
            session_id=session_id,
            limit=limit
        )
        
        # Get session info
        session_info = {
            "session_id": session_id,
            "user_id": user_id,
            "total_messages": len(conversations),
            "last_activity": conversations[0]["created_at"] if conversations else None
        }
        
        return ConversationHistory(
            conversations=conversations,
            total_conversations=len(conversations),
            session_info=session_info
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving history: {str(e)}")

@router.get("/sessions")
async def get_user_sessions(
    current_user: dict = Depends(get_current_user)
):
    """Get all consultant sessions for the current user"""
    try:
        user_id = current_user.get("id")
        
        # Get database connection
        mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
        db_name = os.environ.get('DB_NAME', 'sitetitan_db')
        
        client = AsyncIOMotorClient(mongo_url)
        db = client[db_name]
        
        # Aggregate sessions with message counts
        pipeline = [
            {"$match": {"user_id": user_id, "message_type": "consultant"}},
            {
                "$group": {
                    "_id": "$session_id",
                    "message_count": {"$sum": 1},
                    "last_activity": {"$max": "$created_at"},
                    "first_message": {"$first": "$user_message"}
                }
            },
            {"$sort": {"last_activity": -1}},
            {"$limit": 50}
        ]
        
        sessions = await db.ai_conversations.aggregate(pipeline).to_list(length=50)
        
        return {
            "sessions": [
                {
                    "session_id": session["_id"],
                    "message_count": session["message_count"],
                    "last_activity": session["last_activity"],
                    "preview": session["first_message"][:100] + "..." if len(session["first_message"]) > 100 else session["first_message"]
                }
                for session in sessions
            ],
            "total_sessions": len(sessions)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving sessions: {str(e)}")

@router.get("/features")
async def get_consultant_features(
    current_user: dict = Depends(get_current_user)
):
    """Get available consultant features based on user subscription tier"""
    try:
        user_id = current_user.get("id")
        
        # Get user context to determine features
        context = await laundry_consultant.get_user_context(user_id)
        enhanced_features = laundry_consultant._get_enhanced_features(context)
        
        user_tier = context.get("user_profile", {}).get("subscription_tier", "free")
        
        # Feature descriptions
        feature_details = {
            "Basic laundromat guidance": {
                "description": "General advice on laundromat operations and best practices",
                "tier_required": "free"
            },
            "Equipment recommendations": {
                "description": "Washer/dryer selection and capacity planning",
                "tier_required": "free"
            },
            "Site analysis integration": {
                "description": "AI recommendations based on your location analyses",
                "tier_required": "analyzer"
            },
            "Custom business projections": {
                "description": "ROI calculations and financial modeling",
                "tier_required": "analyzer"
            },
            "Equipment ROI calculations": {
                "description": "Equipment cost-benefit analysis and financing options",
                "tier_required": "analyzer"
            },
            "Advanced troubleshooting": {
                "description": "Equipment diagnostics and repair guidance",
                "tier_required": "intelligence"
            },
            "Compliance consulting": {
                "description": "ADA, zoning, permits, and regulatory guidance",
                "tier_required": "intelligence"
            },
            "Market analysis": {
                "description": "Competition and demographic analysis",
                "tier_required": "intelligence"
            },
            "Master technician support": {
                "description": "Expert-level equipment repair and error code resolution",
                "tier_required": "optimization"
            },
            "Business optimization strategies": {
                "description": "Operations efficiency and revenue optimization",
                "tier_required": "optimization"
            },
            "Multi-location consulting": {
                "description": "Portfolio management and expansion strategies",
                "tier_required": "optimization"
            }
        }
        
        available_features = [
            {
                "feature": feature,
                "details": feature_details.get(feature, {"description": "Advanced consulting feature", "tier_required": "unknown"}),
                "available": True
            }
            for feature in enhanced_features
        ]
        
        all_features = [
            {
                "feature": feature,
                "details": details,
                "available": feature in enhanced_features
            }
            for feature, details in feature_details.items()
        ]
        
        return {
            "user_tier": user_tier,
            "available_features": available_features,
            "all_features": all_features,
            "consultant_type": "LaundroTech Master AI",
            "consultation_value": "$500/hour equivalent"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving features: {str(e)}")

@router.post("/feedback")
async def submit_consultant_feedback(
    session_id: str,
    rating: int,
    feedback: str = "",
    current_user: dict = Depends(get_current_user)
):
    """Submit feedback on consultant interaction"""
    try:
        user_id = current_user.get("id")
        
        # Validate rating
        if rating < 1 or rating > 5:
            raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
            
        # Get database connection
        mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
        db_name = os.environ.get('DB_NAME', 'sitetitan_db')
        
        client = AsyncIOMotorClient(mongo_url)
        db = client[db_name]
        
        feedback_record = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "session_id": session_id,
            "rating": rating,
            "feedback": feedback,
            "created_at": datetime.now(),
            "type": "consultant_feedback"
        }
        
        await db.consultant_feedback.insert_one(feedback_record)
        
        return {
            "success": True,
            "message": "Thank you for your feedback! It helps us improve the consultant experience."
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error submitting feedback: {str(e)}")