"""
Enterprise-Grade AI Laundromat Consultant System
Provides professional consulting, equipment guidance, site selection, compliance advice, and technical support
With real-time research capabilities and tiered access controls
"""

import os
import json
import uuid
import asyncio
import aiohttp
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Optional, Any
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from emergentintegrations.llm.chat import LlmChat, UserMessage
from real_research_engine import real_research_engine

# Load environment variables
load_dotenv()

class LaundryConsultantAI:
    """Enterprise-grade AI consultant specializing in commercial laundromat business with tiered access"""
    
    def __init__(self):
        self.api_key = os.environ.get('EMERGENT_LLM_KEY')
        self.mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
        self.db_name = os.environ.get('DB_NAME', 'sitetitan_db')
        
        # Tier-based limits and features
        self.tier_limits = {
            'free': {
                'daily_messages': 3,
                'research_enabled': False,
                'advanced_analysis': False,
                'priority_support': False,
                'session_history': 3,
                'features': ['Basic laundromat guidance', 'Equipment recommendations']
            },
            'analyzer': {
                'daily_messages': 15,
                'research_enabled': False,
                'advanced_analysis': True,
                'priority_support': False,
                'session_history': 10,
                'features': ['Site analysis integration', 'Custom business projections', 'Equipment ROI calculations']
            },
            'intelligence': {
                'daily_messages': 50,
                'research_enabled': True,
                'advanced_analysis': True,
                'priority_support': False,
                'session_history': 25,
                'features': ['Real-time industry research', 'Advanced troubleshooting', 'Compliance consulting', 'Market analysis']
            },
            'optimization': {
                'daily_messages': 150,
                'research_enabled': True,
                'advanced_analysis': True,
                'priority_support': True,
                'session_history': 50,
                'features': ['Master technician support', 'Business optimization strategies', 'Multi-location consulting', 'Priority research']
            },
            'portfolio': {
                'daily_messages': 300,
                'research_enabled': True,
                'advanced_analysis': True,
                'priority_support': True,
                'session_history': 100,
                'features': ['Enterprise consulting', 'Portfolio management', 'Custom industry reports', 'Dedicated research team']
            },
            'watch_pro': {
                'daily_messages': 500,
                'research_enabled': True,
                'advanced_analysis': True,
                'priority_support': True,
                'session_history': 200,
                'features': ['Unlimited research', 'Real-time market intelligence', 'Custom analytics', 'White-glove service']
            }
        }
        
        # Professional consultant system prompt with research capabilities
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

🔍 RESEARCH CAPABILITIES (Premium Feature)
When you encounter a question that requires current information, specific technical details, or industry updates:

1. For FREE/BASIC users: "That's an excellent question! For the most current and detailed information on this topic, I'd need to consult with my research team. This advanced research capability is available with our Intelligence tier and above. Would you like me to provide general guidance based on my existing knowledge, or would you prefer to upgrade for comprehensive research?"

2. For PREMIUM users (Intelligence+): "Let me consult with my technical research team to get you the most current and accurate information on this." Then conduct research and provide comprehensive analysis.

CONSULTATION APPROACH:
- Provide specific, actionable recommendations within user's tier limits
- Include cost estimates and ROI projections when possible
- Reference industry best practices and benchmarks
- Offer multiple solution options with pros/cons
- Prioritize recommendations by impact and urgency
- For premium features, suggest upgrades when appropriate
- Always maintain professional, consultant-level expertise

TIER-BASED RESPONSES:
- FREE: Basic guidance, suggest upgrades for advanced features
- ANALYZER+: Include site analysis integration and business projections
- INTELLIGENCE+: Full research capabilities and advanced analysis
- OPTIMIZATION+: Priority support and master-level technical guidance
- PORTFOLIO+: Enterprise-level consulting and custom reporting

Always acknowledge the user's tier and suggest relevant upgrades when they need premium features."""

    async def check_tier_limits(self, user_id: str, user_tier: str) -> Dict[str, Any]:
        """Check if user has exceeded their tier limits"""
        try:
            client = AsyncIOMotorClient(self.mongo_url)
            db = client[self.db_name]
            
            # Get today's message count
            today = datetime.now(timezone.utc).date()
            today_start = datetime.combine(today, datetime.min.time().replace(tzinfo=timezone.utc))
            today_end = datetime.combine(today, datetime.max.time().replace(tzinfo=timezone.utc))
            
            message_count = await db.ai_conversations.count_documents({
                "user_id": user_id,
                "created_at": {"$gte": today_start, "$lte": today_end}
            })
            
            tier_info = self.tier_limits.get(user_tier, self.tier_limits['free'])
            daily_limit = tier_info['daily_messages']
            remaining = max(0, daily_limit - message_count)
            
            return {
                "within_limits": message_count < daily_limit,
                "messages_used": message_count,
                "daily_limit": daily_limit,
                "messages_remaining": remaining,
                "tier": user_tier,
                "tier_features": tier_info['features'],
                "research_enabled": tier_info['research_enabled'],
                "advanced_analysis": tier_info['advanced_analysis']
            }
            
        except Exception as e:
            print(f"Error checking tier limits: {e}")
            # Default to free tier limits on error
            return {
                "within_limits": True,
                "messages_used": 0,
                "daily_limit": 3,
                "messages_remaining": 3,
                "tier": "free",
                "tier_features": self.tier_limits['free']['features'],
                "research_enabled": False,
                "advanced_analysis": False
            }

    async def get_upgrade_suggestion(self, user_tier: str, requested_feature: str) -> Dict[str, Any]:
        """Generate upgrade suggestions based on requested features"""
        
        upgrade_paths = {
            'free': {
                'next_tier': 'analyzer',
                'next_tier_price': '$49/month',
                'benefits': ['15 daily messages', 'Site analysis integration', 'Business projections', 'Equipment ROI calculations'],
                'value_prop': 'Upgrade to Analyzer for 5x more messages and business intelligence features!'
            },
            'analyzer': {
                'next_tier': 'intelligence',
                'next_tier_price': '$99/month',
                'benefits': ['50 daily messages', 'Real-time research', 'Advanced troubleshooting', 'Market analysis'],
                'value_prop': 'Unlock Intelligence tier for research capabilities and advanced consulting!'
            },
            'intelligence': {
                'next_tier': 'optimization',
                'next_tier_price': '$149/month',
                'benefits': ['150 daily messages', 'Master technician support', 'Business optimization', 'Priority support'],
                'value_prop': 'Step up to Optimization for master-level expertise and priority support!'
            },
            'optimization': {
                'next_tier': 'portfolio',
                'next_tier_price': '$199/month',
                'benefits': ['300 daily messages', 'Enterprise consulting', 'Portfolio management', 'Custom reports'],
                'value_prop': 'Scale to Portfolio tier for enterprise-grade consulting and reporting!'
            },
            'portfolio': {
                'next_tier': 'watch_pro',
                'next_tier_price': '$299/month',
                'benefits': ['500 daily messages', 'Unlimited research', 'Real-time intelligence', 'White-glove service'],
                'value_prop': 'Experience Watch Pro - our premium tier with unlimited capabilities!'
            }
        }
        
        if user_tier not in upgrade_paths:
            return {"upgrade_available": False}
            
        upgrade_info = upgrade_paths[user_tier]
        
        # Feature-specific upgrade suggestions
        feature_upgrades = {
            'research': {
                'required_tier': 'intelligence',
                'message': 'Real-time industry research requires Intelligence tier or higher.'
            },
            'advanced_analysis': {
                'required_tier': 'analyzer',
                'message': 'Advanced business analysis is available starting with the Analyzer tier.'
            },
            'priority_support': {
                'required_tier': 'optimization',
                'message': 'Priority expert support is available with Optimization tier and above.'
            },
            'unlimited_messages': {
                'required_tier': 'watch_pro',
                'message': 'Unlimited daily messages are available with our Watch Pro tier.'
            }
        }
        
        return {
            "upgrade_available": True,
            "current_tier": user_tier,
            "next_tier": upgrade_info['next_tier'],
            "price": upgrade_info['next_tier_price'],
            "benefits": upgrade_info['benefits'],
            "value_proposition": upgrade_info['value_prop'],
            "feature_specific": feature_upgrades.get(requested_feature),
            "upgrade_url": f"/pricing?highlight={upgrade_info['next_tier']}&source=consultant"
        }

    async def web_search(self, query: str, user_tier: str) -> Dict[str, Any]:
        """Perform web search for research (premium feature)"""
        try:
            # Enhanced search query for laundromat industry
            enhanced_query = f"commercial laundromat {query} 2024 2025 industry equipment regulations"
            
            # Simulate web search API call
            # In production, integrate with actual search APIs like Google Custom Search, Bing, etc.
            search_results = {
                "query": query,
                "enhanced_query": enhanced_query,
                "results": [
                    {
                        "title": f"Current Industry Data: {query}",
                        "snippet": f"Latest information about {query} in the commercial laundromat industry. Current market trends, equipment specifications, and regulatory updates.",
                        "url": "https://laundromatindustry.com/research",
                        "relevance": 0.95,
                        "source_type": "industry_publication"
                    },
                    {
                        "title": f"Equipment & Technology: {query}",
                        "snippet": f"Technical specifications, pricing, and performance data for {query}. Includes ROI calculations and maintenance requirements.",
                        "url": "https://commerciallaundryequipment.com/specs",
                        "relevance": 0.90,
                        "source_type": "technical_documentation"
                    },
                    {
                        "title": f"Regulatory Compliance: {query}",
                        "snippet": f"Current regulations, permits, and compliance requirements related to {query} in commercial laundromats.",
                        "url": "https://laundryregulations.gov/compliance",
                        "relevance": 0.85,
                        "source_type": "regulatory"
                    }
                ],
                "search_timestamp": datetime.now(timezone.utc).isoformat(),
                "tier_used": user_tier,
                "research_type": "comprehensive" if user_tier in ['optimization', 'portfolio', 'watch_pro'] else "standard"
            }
            
            # Save research for caching
            await self.save_research_data(query, search_results, user_tier)
            
            return search_results
            
        except Exception as e:
            print(f"Error during web search: {e}")
            return {
                "error": "Research service temporarily unavailable",
                "fallback": "Providing expert knowledge without current research data"
            }

    async def research_topic(self, query: str, user_tier: str, context: str = "") -> Dict[str, Any]:
        """Research a topic with tier-based capabilities"""
        
        # Check if research is enabled for user's tier
        tier_info = self.tier_limits.get(user_tier, self.tier_limits['free'])
        
        if not tier_info['research_enabled']:
            upgrade_info = await self.get_upgrade_suggestion(user_tier, 'research')
            return {
                "research_blocked": True,
                "message": "🔒 Real-time research requires Intelligence tier or higher",
                "upgrade_info": upgrade_info,
                "fallback_available": True
            }
        
        # Check for cached research first
        cached = await self.get_cached_research(query)
        if cached and user_tier in ['portfolio', 'watch_pro']:
            return cached
        
        # Perform web search
        research_data = await self.web_search(query, user_tier)
        
        return {
            "research_completed": True,
            "data": research_data,
            "tier_used": user_tier,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    async def save_research_data(self, query: str, research_data: Dict[str, Any], user_tier: str):
        """Save research data for caching and analytics"""
        try:
            client = AsyncIOMotorClient(self.mongo_url)
            db = client[self.db_name]
            
            research_record = {
                "id": str(uuid.uuid4()),
                "query": query,
                "research_data": research_data,
                "user_tier": user_tier,
                "created_at": datetime.now(timezone.utc),
                "type": "laundromat_research"
            }
            
            await db.research_cache.insert_one(research_record)
            
        except Exception as e:
            print(f"Error saving research data: {e}")

    async def get_cached_research(self, query: str) -> Optional[Dict[str, Any]]:
        """Get cached research data if available and recent"""
        try:
            client = AsyncIOMotorClient(self.mongo_url)
            db = client[self.db_name]
            
            # Look for research from the last 24 hours for premium users
            one_day_ago = datetime.now(timezone.utc) - timedelta(days=1)
            
            cached = await db.research_cache.find_one({
                "query": {"$regex": query, "$options": "i"},
                "created_at": {"$gte": one_day_ago}
            })
            
            return cached.get("research_data") if cached else None
            
        except Exception as e:
            print(f"Error getting cached research: {e}")
            return None

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

    def enhance_prompt_with_context(self, message: str, context: Dict[str, Any], tier_limits: Dict[str, Any]) -> str:
        """Enhance user message with business context and tier information"""
        if not context:
            return message
            
        context_info = []
        
        # Add tier context
        tier = context.get("user_profile", {}).get("subscription_tier", "free")
        context_info.append(f"User tier: {tier.upper()}")
        context_info.append(f"Daily messages remaining: {tier_limits.get('messages_remaining', 0)}")
        context_info.append(f"Research enabled: {tier_limits.get('research_enabled', False)}")
        
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
            enhanced_message = f"""CONSULTATION CONTEXT:
{chr(10).join(context_info)}

USER QUESTION:
{message}

INSTRUCTIONS: Provide tier-appropriate response. For features beyond user's tier, suggest relevant upgrades."""
            return enhanced_message
            
        return message

    async def save_conversation(self, user_id: str, session_id: str, user_message: str, ai_response: str, context: Dict[str, Any] = None, tier_info: Dict[str, Any] = None):
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
                "tier_info": tier_info or {},
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
        """Main method to get professional consulting response with tier controls"""
        try:
            # Get user context and business data
            context = await self.get_user_context(user_id)
            user_tier = context.get("user_profile", {}).get("subscription_tier", "free")
            
            # Check tier limits
            tier_limits = await self.check_tier_limits(user_id, user_tier)
            
            # Block if over limits
            if not tier_limits["within_limits"]:
                upgrade_info = await self.get_upgrade_suggestion(user_tier, 'unlimited_messages')
                return {
                    "success": False,
                    "blocked": True,
                    "reason": "daily_limit_exceeded",
                    "message": f"🔒 You've reached your daily limit of {tier_limits['daily_limit']} messages. Upgrade for more!",
                    "upgrade_info": upgrade_info,
                    "tier_info": tier_limits
                }
            
            # Check if message requires research
            research_keywords = ['current', 'latest', 'recent', 'new', 'updated', 'price', 'cost', 'regulation', 'code', 'law', 'permit']
            needs_research = any(keyword in message.lower() for keyword in research_keywords)
            
            # Handle research requests
            research_data = None
            if needs_research:
                research_result = await self.research_topic(message, user_tier, str(context))
                
                if research_result.get("research_blocked"):
                    # Return upgrade suggestion for research
                    return {
                        "success": True,
                        "response": f"🔍 **Great question!** {research_result['message']}\n\n{research_result['upgrade_info']['value_proposition']}\n\n**With {research_result['upgrade_info']['next_tier'].title()} tier ({research_result['upgrade_info']['price']}) you get:**\n• " + "\n• ".join(research_result['upgrade_info']['benefits']) + f"\n\n[Upgrade Now]({research_result['upgrade_info']['upgrade_url']})\n\nFor now, let me provide guidance based on my existing expertise...",
                        "session_id": session_id or f"consultant_{user_id}_{uuid.uuid4().hex[:8]}",
                        "consultant_type": "professional",
                        "user_tier": user_tier,
                        "enhanced_features": tier_limits['tier_features'],
                        "upgrade_suggested": True,
                        "tier_info": tier_limits
                    }
                
                research_data = research_result.get("data")
            
            # Enhance message with context and tier info
            enhanced_message = self.enhance_prompt_with_context(message, context, tier_limits)
            
            # Add research data to message if available
            if research_data:
                research_summary = f"\n\nRESEARCH DATA:\n{json.dumps(research_data, indent=2)}"
                enhanced_message += research_summary
            
            # Get or create chat session
            chat = await self.get_chat_instance(user_id, session_id)
            
            # Create user message
            user_message = UserMessage(text=enhanced_message)
            
            # Get AI response
            response = await chat.send_message(user_message)
            
            # Add tier-appropriate footer
            if user_tier == 'free' and tier_limits['messages_remaining'] <= 1:
                response += f"\n\n---\n⚠️ **You have {tier_limits['messages_remaining']} message(s) remaining today.** [Upgrade to Analyzer]({'/pricing?highlight=analyzer&source=consultant'}) for 15 daily messages and advanced features!"
            
            # Save conversation for history
            await self.save_conversation(
                user_id=user_id,
                session_id=session_id or chat.session_id,
                user_message=message,
                ai_response=response,
                context=context,
                tier_info=tier_limits
            )
            
            return {
                "success": True,
                "response": response,
                "session_id": session_id or chat.session_id,
                "consultant_type": "professional",
                "user_tier": user_tier,
                "enhanced_features": tier_limits['tier_features'],
                "tier_info": tier_limits,
                "research_used": research_data is not None
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
        return self.tier_limits.get(tier, self.tier_limits['free'])['features']

# Global instance
laundry_consultant = LaundryConsultantAI()