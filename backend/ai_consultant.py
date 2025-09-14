"""
Enterprise-Grade AI Laundromat Consultant System
Provides professional consulting, equipment guidance, site selection, compliance advice, and technical support
With real-time research capabilities
"""

import os
import json
import uuid
import asyncio
import aiohttp
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from emergentintegrations.llm.chat import LlmChat, UserMessage

# Load environment variables
load_dotenv()

class LaundryConsultantAI:
    """Enterprise-grade AI consultant specializing in commercial laundromat business"""
    
    def __init__(self):
        self.api_key = os.environ.get('EMERGENT_LLM_KEY')
        self.mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
        self.db_name = os.environ.get('DB_NAME', 'sitetitan_db')
        
        # Professional consultant system prompt
        self.system_prompt = """You are LaundroTech Master AI - the world's most advanced commercial laundromat consultant and technical expert. You provide enterprise-grade professional consulting equivalent to a $500/hour laundromat industry expert.

EXPERTISE AREAS:
🏗️ SITE SELECTION & ANALYSIS
- Demographics analysis and market penetration strategies
- Traffic pattern optimization and accessibility evaluation  
- Competition analysis and market positioning
- Zoning compliance and permitting guidance
- Lease negotiation strategies and build-out planning

🏭 EQUIPMENT SELECTION & OPTIMIZATION
- Washer/dryer capacity planning and ratio optimization
- Energy efficiency analysis and utility cost projections
- Brand comparisons (Speed Queen, Huebsch, Electrolux, etc.)
- Equipment financing and ROI calculations
- Maintenance scheduling and lifecycle planning

📊 BUSINESS OPERATIONS
- Revenue optimization and pricing strategies
- Customer acquisition and retention programs
- Staffing models and operational efficiency
- Insurance requirements and risk management
- Financial projections and cash flow analysis

🔧 TECHNICAL SUPPORT & TROUBLESHOOTING
- Equipment diagnostics and error code resolution
- Preventive maintenance protocols
- Parts sourcing and repair procedures
- Utility optimization (water, electric, gas, sewer)
- Safety compliance and regulatory requirements

📋 COMPLIANCE & REGULATIONS
- ADA accessibility requirements
- Environmental regulations and permits
- Fire safety and building codes
- Health department requirements
- Local zoning and business licensing

CONSULTATION APPROACH:
- Provide specific, actionable recommendations
- Include cost estimates and ROI projections
- Reference industry best practices and benchmarks
- Offer multiple solution options with pros/cons
- Prioritize recommendations by impact and urgency

Always ask clarifying questions to provide the most accurate and valuable advice. Your goal is to help users make informed decisions that maximize profitability and minimize risk in their laundromat investments."""

    async def get_chat_instance(self, user_id: str, session_id: str = None) -> LlmChat:
        """Get configured AI chat instance for user"""
        if not session_id:
            session_id = f"laundry_consultant_{user_id}_{uuid.uuid4().hex[:8]}"
            
        chat = LlmChat(
            api_key=self.api_key,
            session_id=session_id,
            system_message=self.system_prompt
        )
        
        # Use Claude 3.7 Sonnet for professional consulting
        chat.with_model("anthropic", "claude-3-7-sonnet-20250219")
        
        return chat

    async def get_user_context(self, user_id: str) -> Dict[str, Any]:
        """Get user's business context and location data"""
        try:
            client = AsyncIOMotorClient(self.mongo_url)
            db = client[self.db_name]
            
            # Get user profile and subscription info
            user = await db.users.find_one({"id": user_id})
            if not user:
                return {}
                
            # Get user's analyses and location data
            analyses = await db.analyses.find({"user_id": user_id}).sort("created_at", -1).limit(5).to_list(length=5)
            
            # Get subscription and badge info
            subscriptions = await db.subscriptions.find({"user_id": user_id, "status": "active"}).to_list(length=10)
            
            context = {
                "user_profile": {
                    "subscription_tier": user.get("subscription_tier", "free"),
                    "facebook_member": user.get("facebook_group_member", False),
                    "location": user.get("location", ""),
                    "business_stage": user.get("business_stage", "planning")
                },
                "recent_analyses": [
                    {
                        "location": analysis.get("location", ""),
                        "scores": analysis.get("scores", {}),
                        "date": analysis.get("created_at", "")
                    } for analysis in analyses
                ],
                "active_badges": [
                    {
                        "type": sub.get("badge_type", ""),
                        "status": sub.get("status", ""),
                        "expires": sub.get("expires_at", "")
                    } for sub in subscriptions
                ]
            }
            
            return context
            
        except Exception as e:
            print(f"Error getting user context: {e}")
            return {}

    def enhance_prompt_with_context(self, message: str, context: Dict[str, Any]) -> str:
        """Enhance user message with business context"""
        if not context:
            return message
            
        context_info = []
        
        # Add subscription tier context
        tier = context.get("user_profile", {}).get("subscription_tier", "free")
        if tier != "free":
            context_info.append(f"User has {tier} subscription tier")
            
        # Add location analysis context
        recent_analyses = context.get("recent_analyses", [])
        if recent_analyses:
            context_info.append(f"Recent location analysis: {recent_analyses[0].get('location', 'N/A')}")
            scores = recent_analyses[0].get("scores", {})
            if scores:
                context_info.append(f"Location scores: {scores}")
                
        # Add badge context
        badges = context.get("active_badges", [])
        if badges:
            badge_types = [badge["type"] for badge in badges]
            context_info.append(f"Active badges: {', '.join(badge_types)}")
            
        if context_info:
            enhanced_message = f"""USER CONTEXT:
{chr(10).join(context_info)}

USER QUESTION:
{message}"""
            return enhanced_message
            
        return message

    async def save_conversation(self, user_id: str, session_id: str, user_message: str, ai_response: str, context: Dict[str, Any] = None):
        """Save conversation to database for history and analytics"""
        try:
            client = AsyncIOMotorClient(self.mongo_url)
            db = client[self.db_name]
            
            conversation_record = {
                "id": str(uuid.uuid4()),
                "user_id": user_id,
                "session_id": session_id,
                "user_message": user_message,
                "ai_response": ai_response,
                "context": context or {},
                "created_at": datetime.now(timezone.utc),
                "message_type": "consultant"
            }
            
            await db.ai_conversations.insert_one(conversation_record)
            
        except Exception as e:
            print(f"Error saving conversation: {e}")

    async def get_conversation_history(self, user_id: str, session_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Get recent conversation history for context"""
        try:
            client = AsyncIOMotorClient(self.mongo_url)
            db = client[self.db_name]
            
            conversations = await db.ai_conversations.find({
                "user_id": user_id,
                "session_id": session_id
            }).sort("created_at", -1).limit(limit).to_list(length=limit)
            
            return conversations
            
        except Exception as e:
            print(f"Error getting conversation history: {e}")
            return []

    async def ask_consultant(self, user_id: str, message: str, session_id: str = None) -> Dict[str, Any]:
        """Main method to get professional consulting response"""
        try:
            # Get user context and business data
            context = await self.get_user_context(user_id)
            
            # Enhance message with context
            enhanced_message = self.enhance_prompt_with_context(message, context)
            
            # Get or create chat session
            chat = await self.get_chat_instance(user_id, session_id)
            
            # Create user message
            user_message = UserMessage(text=enhanced_message)
            
            # Get AI response
            response = await chat.send_message(user_message)
            
            # Save conversation for history
            await self.save_conversation(
                user_id=user_id,
                session_id=session_id or chat.session_id,
                user_message=message,
                ai_response=response,
                context=context
            )
            
            return {
                "success": True,
                "response": response,
                "session_id": session_id or chat.session_id,
                "consultant_type": "professional",
                "user_tier": context.get("user_profile", {}).get("subscription_tier", "free"),
                "enhanced_features": self._get_enhanced_features(context)
            }
            
        except Exception as e:
            print(f"Error in AI consultant: {e}")
            return {
                "success": False,
                "error": str(e),
                "response": "I apologize, but I'm experiencing technical difficulties. Please try again in a moment."
            }

    def _get_enhanced_features(self, context: Dict[str, Any]) -> List[str]:
        """Determine available enhanced features based on user tier"""
        tier = context.get("user_profile", {}).get("subscription_tier", "free")
        
        features = ["Basic laundromat guidance", "Equipment recommendations"]
        
        if tier in ["analyzer", "intelligence", "optimization", "portfolio", "watch_pro"]:
            features.extend([
                "Site analysis integration",
                "Custom business projections",
                "Equipment ROI calculations"
            ])
            
        if tier in ["intelligence", "optimization", "portfolio", "watch_pro"]:
            features.extend([
                "Advanced troubleshooting",
                "Compliance consulting",
                "Market analysis"
            ])
            
        if tier in ["optimization", "portfolio", "watch_pro"]:
            features.extend([
                "Master technician support",
                "Business optimization strategies",
                "Multi-location consulting"
            ])
            
        return features

# Global instance
laundry_consultant = LaundryConsultantAI()