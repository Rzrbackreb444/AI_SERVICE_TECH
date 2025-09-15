"""
Enhanced Consultant API Endpoints - 2025 Enterprise Grade
Real conversation memory, subscription awareness, dynamic learning
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from typing import Dict, List, Any, Optional
from datetime import datetime
import logging
import jwt
import os

from enhanced_consultant_system import EnhancedConsultantSystem

# JWT settings
JWT_SECRET = os.getenv('JWT_SECRET', 'laundrotech-empire-2024')
JWT_ALGORITHM = 'HS256'

# Security
security = HTTPBearer()

# Initialize LLM client
try:
    from emergentintegrations import LlmChat
    
    emergent_key = os.getenv('EMERGENT_LLM_KEY')
    if emergent_key:
        llm_client = LlmChat(
            api_key=emergent_key,
            session_id="consultant_system",
            system_message="You are a professional laundromat investment consultant with deep industry expertise."
        )
    else:
        llm_client = None
except Exception as e:
    logging.warning(f"LLM client initialization failed: {e}")
    llm_client = None

# Database connection (will be injected)
db = None

def init_db(database):
    """Initialize database connection"""
    global db
    db = database

class User(BaseModel):
    id: str
    email: str
    full_name: str
    subscription_tier: str = "free"

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    """Get current user from JWT token"""
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get('sub')
        
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Get user from database
        user_doc = await db.users.find_one({'id': user_id})
        if not user_doc:
            raise HTTPException(status_code=401, detail="User not found")
        
        return User(
            id=user_doc['id'],
            email=user_doc['email'],
            full_name=user_doc['full_name'],
            subscription_tier=user_doc.get('subscription_tier', 'free')
        )
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        logging.error(f"Auth error: {e}")
        raise HTTPException(status_code=401, detail="Authentication failed")

router = APIRouter()
consultant_system = None

def init_consultant_system():
    """Initialize consultant system after database is available"""
    global consultant_system
    if db is not None:
        consultant_system = EnhancedConsultantSystem(db, llm_client)

logger = logging.getLogger(__name__)

class ChatMessage(BaseModel):
    message: str
    context: Optional[Dict] = None

class ConsultantResponse(BaseModel):
    response: str
    consultant_name: str
    follow_up_actions: List[Dict] = []
    conversation_id: str
    usage_info: Dict
    personalization_level: str

@router.get("/consultant/initialize")
async def initialize_consultant(current_user: User = Depends(get_current_user)):
    """Initialize or get user's personalized consultant"""
    try:
        user_data = {
            'user_id': current_user.id,
            'full_name': current_user.full_name,
            'email': current_user.email,
            'subscription_tier': current_user.subscription_tier
        }
        
        result = await consultant_system.initialize_user_consultant(current_user.id, user_data)
        
        return {
            'success': True,
            'consultant_active': True,
            'consultant_name': result['consultant_profile']['consultant_data']['name'],
            'consultant_type': result['consultant_profile']['consultant_type'],
            'welcome_message': result['welcome_message'],
            'capabilities': result['capabilities'],
            'subscription_tier': current_user.subscription_tier,
            'personalization_level': result['capabilities']['personalization_level']
        }
        
    except Exception as e:
        logger.error(f"Consultant initialization error: {e}")
        raise HTTPException(status_code=500, detail="Failed to initialize consultant")

@router.post("/consultant/chat")
async def chat_with_consultant(
    request: ChatMessage,
    current_user: User = Depends(get_current_user)
) -> ConsultantResponse:
    """Chat with personalized consultant with memory and learning"""
    try:
        # Add user context
        context = request.context or {}
        context.update({
            'user_id': current_user.id,
            'subscription_tier': current_user.subscription_tier,
            'user_name': current_user.full_name
        })
        
        # Handle conversation
        response = await consultant_system.handle_conversation(
            current_user.id, 
            request.message, 
            context
        )
        
        # Check for upgrade prompts
        if response.get('upgrade_prompt'):
            return ConsultantResponse(
                response=response['response'],
                consultant_name="System",
                follow_up_actions=[{
                    'text': 'Upgrade Subscription',
                    'action': 'upgrade',
                    'description': 'Get unlimited questions and advanced features'
                }],
                conversation_id="upgrade_prompt",
                usage_info={
                    'current_tier': response['current_tier'],
                    'daily_limit_reached': True
                },
                personalization_level="limited"
            )
        
        # Get consultant info
        consultant = await db.user_consultants.find_one({'user_id': current_user.id})
        
        return ConsultantResponse(
            response=response['message'],
            consultant_name=response.get('consultant_name', 'AI Consultant'),
            follow_up_actions=response.get('follow_up_actions', []),
            conversation_id=consultant['id'] if consultant else 'fallback',
            usage_info=await get_usage_info(current_user.id, consultant),
            personalization_level=response.get('personalization_level', 'basic')
        )
        
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail="Failed to process chat message")

@router.get("/consultant/profile")
async def get_consultant_profile(current_user: User = Depends(get_current_user)):
    """Get user's consultant profile and conversation history"""
    try:
        consultant = await db.user_consultants.find_one({'user_id': current_user.id})
        
        if not consultant:
            return {
                'consultant_active': False,
                'message': 'Your personal consultant is ready to be activated!',
                'activation_available': True
            }
        
        # Get recent conversation history (last 10 messages)
        recent_conversations = consultant.get('conversation_memory', [])[-10:]
        
        return {
            'consultant_active': True,
            'consultant_name': consultant['consultant_data']['name'],
            'consultant_type': consultant['consultant_type'],
            'subscription_tier': consultant['subscription_tier'],
            'capabilities': consultant['capabilities'],
            'user_profile': consultant['user_profile'],
            'recent_conversations': recent_conversations,
            'total_conversations': len(consultant.get('conversation_memory', [])),
            'last_active': consultant.get('last_active'),
            'personalization_insights': consultant.get('learned_preferences', {})
        }
        
    except Exception as e:
        logger.error(f"Profile fetch error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch consultant profile")

@router.post("/consultant/update-profile")
async def update_user_profile(
    profile_data: Dict,
    current_user: User = Depends(get_current_user)
):
    """Update user profile for better personalization"""
    try:
        # Validate and sanitize profile data
        allowed_fields = [
            'experience_level', 'business_goals', 'current_locations',
            'investment_budget', 'preferred_communication_style'
        ]
        
        update_data = {
            f'user_profile.{key}': value 
            for key, value in profile_data.items() 
            if key in allowed_fields
        }
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No valid profile fields provided")
        
        # Update consultant profile
        result = await db.user_consultants.update_one(
            {'user_id': current_user.id},
            {'$set': update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Consultant profile not found")
        
        return {
            'success': True,
            'message': 'Profile updated successfully',
            'updated_fields': list(update_data.keys())
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Profile update error: {e}")
        raise HTTPException(status_code=500, detail="Failed to update profile")

@router.get("/consultant/analytics")
async def get_consultant_analytics(current_user: User = Depends(get_current_user)):
    """Get analytics about consultant usage and personalization"""
    try:
        # Get usage statistics
        usage_stats = await db.consultant_usage.aggregate([
            {'$match': {'user_id': current_user.id}},
            {'$group': {
                '_id': '$interaction_type',
                'count': {'$sum': 1},
                'last_interaction': {'$max': '$timestamp'}
            }}
        ]).to_list(length=None)
        
        # Get consultant profile
        consultant = await db.user_consultants.find_one({'user_id': current_user.id})
        
        if not consultant:
            return {'analytics_available': False}
        
        # Calculate engagement metrics
        total_conversations = len(consultant.get('conversation_memory', []))
        days_active = (datetime.now() - consultant['created_at']).days + 1
        avg_daily_usage = total_conversations / days_active if days_active > 0 else 0
        
        return {
            'analytics_available': True,
            'total_conversations': total_conversations,
            'days_active': days_active,
            'avg_daily_usage': round(avg_daily_usage, 2),
            'usage_stats': usage_stats,
            'personalization_score': calculate_personalization_score(consultant),
            'subscription_tier': consultant['subscription_tier'],
            'capabilities_used': consultant['capabilities'],
            'learning_insights': len(consultant.get('learned_preferences', {}))
        }
        
    except Exception as e:
        logger.error(f"Analytics error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch analytics")

async def get_usage_info(user_id: str, consultant: Dict) -> Dict:
    """Get current usage information"""
    if not consultant:
        return {'usage_available': False}
    
    capabilities = consultant['capabilities']
    daily_limit = capabilities['daily_questions']
    
    if daily_limit == -1:
        return {
            'daily_questions_used': 0,
            'daily_limit': 'unlimited',
            'unlimited_access': True
        }
    
    # Count today's usage
    today = datetime.now().date()
    today_usage = sum(
        1 for entry in consultant.get('conversation_memory', [])
        if entry['timestamp'].date() == today
    )
    
    return {
        'daily_questions_used': today_usage,
        'daily_limit': daily_limit,
        'remaining_questions': max(0, daily_limit - today_usage),
        'unlimited_access': False
    }

def calculate_personalization_score(consultant: Dict) -> float:
    """Calculate how personalized the consultant has become"""
    score = 0.0
    
    user_profile = consultant.get('user_profile', {})
    
    # Experience level known
    if user_profile.get('experience_level') != 'unknown':
        score += 20
    
    # Business goals defined
    if user_profile.get('business_goals'):
        score += 25
    
    # Current locations known
    if user_profile.get('current_locations'):
        score += 20
    
    # Investment budget known
    if user_profile.get('investment_budget'):
        score += 15
    
    # Conversation history
    conversation_count = len(consultant.get('conversation_memory', []))
    if conversation_count > 5:
        score += 10
    if conversation_count > 20:
        score += 10
    
    return min(100.0, score)