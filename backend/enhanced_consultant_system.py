"""
Enhanced AI Consultant System - 2025 Enterprise Grade
- Real conversation memory
- Profile-based personalization 
- Subscription tier awareness
- Dynamic learning from user interactions
"""

import asyncio
import json
import uuid
from datetime import datetime, timezone
from typing import Dict, List, Any, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
import logging

logger = logging.getLogger(__name__)

class EnhancedConsultantSystem:
    def __init__(self, db: AsyncIOMotorDatabase, llm_client=None):
        self.db = db
        self.llm_client = llm_client
        
        # Subscription tiers and their capabilities
        self.tier_capabilities = {
            'free': {
                'daily_questions': 3,
                'memory_depth': 5,  # remembers last 5 conversations
                'features': ['basic_analysis', 'general_advice'],
                'personalization_level': 'basic'
            },
            'professional': {
                'daily_questions': 20,
                'memory_depth': 50,
                'features': ['advanced_analysis', 'competitor_intel', 'roi_optimization'],
                'personalization_level': 'advanced'
            },
            'enterprise': {
                'daily_questions': -1,  # unlimited
                'memory_depth': -1,  # unlimited
                'features': ['all'],
                'personalization_level': 'premium'
            }
        }
        
        # Consultant personas
        self.consultant_personas = {
            'general': {
                'name': 'Alex Thompson',
                'expertise': 'General laundromat consulting',
                'personality': 'friendly, analytical, supportive'
            },
            'investment': {
                'name': 'Sarah Chen',
                'expertise': 'Investment analysis and ROI optimization',
                'personality': 'data-driven, strategic, detail-oriented'
            },
            'operations': {
                'name': 'Mike Rodriguez',
                'expertise': 'Day-to-day operations and efficiency',
                'personality': 'practical, experienced, solution-focused'
            }
        }

    async def initialize_user_consultant(self, user_id: str, user_data: Dict) -> Dict[str, Any]:
        """Initialize or get user's personalized consultant"""
        try:
            # Check if user already has consultant profile
            consultant = await self.db.user_consultants.find_one({'user_id': user_id})
            
            if consultant:
                # Update last active
                await self.db.user_consultants.update_one(
                    {'user_id': user_id},
                    {'$set': {'last_active': datetime.now(timezone.utc)}}
                )
                return consultant
            
            # Create new consultant profile
            subscription_tier = user_data.get('subscription_tier', 'free')
            
            # Determine best consultant persona based on user profile
            consultant_type = self.determine_consultant_persona(user_data)
            
            consultant_profile = {
                'id': str(uuid.uuid4()),
                'user_id': user_id,
                'consultant_type': consultant_type,
                'consultant_data': self.consultant_personas[consultant_type],
                'subscription_tier': subscription_tier,
                'capabilities': self.tier_capabilities[subscription_tier],
                'user_profile': {
                    'name': user_data.get('full_name', 'User'),
                    'email': user_data.get('email'),
                    'experience_level': 'unknown',  # will be determined through conversation
                    'business_goals': [],
                    'current_locations': [],
                    'investment_budget': None,
                    'preferred_communication_style': 'professional'
                },
                'conversation_memory': [],
                'learned_preferences': {},
                'created_at': datetime.now(timezone.utc),
                'last_active': datetime.now(timezone.utc)
            }
            
            await self.db.user_consultants.insert_one(consultant_profile)
            
            # Create welcome message
            welcome_message = await self.generate_personalized_welcome(consultant_profile)
            
            return {
                'consultant_profile': consultant_profile,
                'welcome_message': welcome_message,
                'capabilities': self.tier_capabilities[subscription_tier]
            }
            
        except Exception as e:
            logger.error(f"Error initializing consultant: {e}")
            return self.get_fallback_consultant()

    def determine_consultant_persona(self, user_data: Dict) -> str:
        """Determine which consultant persona fits the user best"""
        # For now, start with general consultant
        # Later can be enhanced with user onboarding questions
        return 'general'

    async def handle_conversation(self, user_id: str, message: str, context: Dict = None) -> Dict[str, Any]:
        """Handle a conversation with memory and personalization"""
        try:
            # Get user's consultant profile
            consultant = await self.db.user_consultants.find_one({'user_id': user_id})
            if not consultant:
                init_result = await self.initialize_user_consultant(user_id, context or {})
                consultant = init_result['consultant_profile']
            
            # Check usage limits
            if not await self.check_usage_limits(consultant):
                return {
                    'response': "You've reached your daily question limit. Upgrade your subscription for unlimited access!",
                    'upgrade_prompt': True,
                    'current_tier': consultant['subscription_tier']
                }
            
            # Add message to conversation memory
            conversation_entry = {
                'id': str(uuid.uuid4()),
                'timestamp': datetime.now(timezone.utc),
                'user_message': message,
                'context': context or {}
            }
            
            # Generate response with full context
            response = await self.generate_contextual_response(consultant, message, conversation_entry)
            
            # Update conversation memory
            conversation_entry['bot_response'] = response['message']
            await self.update_conversation_memory(consultant, conversation_entry)
            
            # Learn from this interaction
            await self.learn_from_interaction(consultant, message, response)
            
            # Update usage tracking
            await self.track_usage(consultant)
            
            return response
            
        except Exception as e:
            logger.error(f"Error in conversation: {e}")
            return {
                'response': "I'm having trouble processing your request right now. Please try again.",
                'error': True
            }

    async def generate_contextual_response(self, consultant: Dict, message: str, current_entry: Dict) -> Dict[str, Any]:
        """Generate response using conversation history and user profile"""
        try:
            if not self.llm_client:
                return {'message': self.get_fallback_response(message)}
            
            # Build context from conversation history
            memory_context = await self.build_memory_context(consultant)
            user_profile = consultant['user_profile']
            consultant_data = consultant['consultant_data']
            
            # Build comprehensive prompt
            prompt = f"""
You are {consultant_data['name']}, a personalized AI consultant for laundromat investments and operations.

CONSULTANT PERSONALITY: {consultant_data['personality']}
YOUR EXPERTISE: {consultant_data['expertise']}

USER PROFILE:
- Name: {user_profile['name']}
- Experience Level: {user_profile['experience_level']}
- Business Goals: {', '.join(user_profile['business_goals']) if user_profile['business_goals'] else 'Not yet defined'}
- Subscription Tier: {consultant['subscription_tier']}

CONVERSATION HISTORY:
{memory_context}

CURRENT MESSAGE: {message}

INSTRUCTIONS:
1. Respond as {consultant_data['name']} with your personality and expertise
2. Reference relevant conversation history when appropriate
3. Ask follow-up questions to better understand their business
4. Provide actionable, specific advice
5. If they're asking about features beyond their subscription tier, mention upgrades naturally
6. Keep response conversational but professional
7. Focus on building long-term relationship

Respond in under 200 words:
"""
            
            response_text = await self.llm_client.generate_text(prompt)
            
            # Determine if follow-up questions or actions are needed
            follow_up_actions = self.suggest_follow_up_actions(message, consultant)
            
            return {
                'message': response_text.strip(),
                'consultant_name': consultant_data['name'],
                'follow_up_actions': follow_up_actions,
                'personalization_used': True
            }
            
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            return {'message': self.get_fallback_response(message)}

    async def build_memory_context(self, consultant: Dict) -> str:
        """Build conversation context from memory"""
        memory = consultant.get('conversation_memory', [])
        if not memory:
            return "This is the start of our conversation."
        
        # Get recent conversations based on tier limits
        memory_limit = consultant['capabilities']['memory_depth']
        if memory_limit > 0:
            recent_memory = memory[-memory_limit:]
        else:
            recent_memory = memory
        
        context_parts = []
        for entry in recent_memory[-5:]:  # Last 5 for context
            context_parts.append(f"User: {entry['user_message']}")
            context_parts.append(f"You: {entry['bot_response']}")
        
        return "\n".join(context_parts)

    def suggest_follow_up_actions(self, message: str, consultant: Dict) -> List[Dict]:
        """Suggest relevant follow-up actions based on the conversation"""
        actions = []
        
        # Analyze message for intent
        message_lower = message.lower()
        
        if any(word in message_lower for word in ['location', 'address', 'area', 'analyze']):
            actions.append({
                'text': 'Analyze Location',
                'action': 'location_analysis',
                'description': 'Get detailed analysis for a specific location'
            })
        
        if any(word in message_lower for word in ['competition', 'competitor', 'market']):
            actions.append({
                'text': 'Competition Intel',
                'action': 'competition_analysis',
                'description': 'Analyze local competition'
            })
        
        if any(word in message_lower for word in ['roi', 'profit', 'return', 'investment']):
            actions.append({
                'text': 'ROI Calculator',
                'action': 'roi_calculation',
                'description': 'Calculate potential returns'
            })
        
        return actions[:3]  # Max 3 suggestions

    async def update_conversation_memory(self, consultant: Dict, entry: Dict):
        """Update conversation memory with new entry"""
        memory_limit = consultant['capabilities']['memory_depth']
        
        # Add to memory
        await self.db.user_consultants.update_one(
            {'user_id': consultant['user_id']},
            {
                '$push': {'conversation_memory': entry},
                '$set': {'last_active': datetime.now(timezone.utc)}
            }
        )
        
        # Trim memory if needed
        if memory_limit > 0:
            await self.db.user_consultants.update_one(
                {'user_id': consultant['user_id']},
                {
                    '$push': {
                        'conversation_memory': {
                            '$each': [],
                            '$slice': -memory_limit
                        }
                    }
                }
            )

    async def learn_from_interaction(self, consultant: Dict, message: str, response: Dict):
        """Learn from user interaction to improve personalization"""
        # Extract insights from conversation
        insights = {}
        
        message_lower = message.lower()
        
        # Learn about experience level
        if 'first time' in message_lower or 'new to' in message_lower:
            insights['experience_level'] = 'beginner'
        elif 'experienced' in message_lower or 'been doing' in message_lower:
            insights['experience_level'] = 'experienced'
        
        # Learn about goals
        if 'want to' in message_lower or 'looking to' in message_lower:
            # Extract goals (simplified)
            if 'buy' in message_lower or 'purchase' in message_lower:
                insights['business_goals'] = ['acquisition']
            elif 'improve' in message_lower or 'optimize' in message_lower:
                insights['business_goals'] = ['optimization']
        
        # Update learned preferences
        if insights:
            await self.db.user_consultants.update_one(
                {'user_id': consultant['user_id']},
                {
                    '$set': {
                        f'user_profile.{key}': value 
                        for key, value in insights.items()
                    }
                }
            )

    async def check_usage_limits(self, consultant: Dict) -> bool:
        """Check if user is within usage limits"""
        capabilities = consultant['capabilities']
        daily_limit = capabilities['daily_questions']
        
        if daily_limit == -1:  # Unlimited
            return True
        
        # Count today's questions
        today = datetime.now(timezone.utc).date()
        today_count = sum(
            1 for entry in consultant.get('conversation_memory', [])
            if entry['timestamp'].date() == today
        )
        
        return today_count < daily_limit

    async def track_usage(self, consultant: Dict):
        """Track usage for analytics"""
        await self.db.consultant_usage.insert_one({
            'user_id': consultant['user_id'],
            'consultant_type': consultant['consultant_type'],
            'subscription_tier': consultant['subscription_tier'],
            'timestamp': datetime.now(timezone.utc),
            'interaction_type': 'question'
        })

    def get_fallback_consultant(self) -> Dict:
        """Fallback consultant when initialization fails"""
        return {
            'consultant_profile': {
                'consultant_type': 'general',
                'consultant_data': self.consultant_personas['general'],
                'subscription_tier': 'free',
                'capabilities': self.tier_capabilities['free']
            },
            'welcome_message': "Hi! I'm your LaundroTech consultant. How can I help you today?",
            'error': True
        }

    def get_fallback_response(self, message: str) -> str:
        """Fallback response when LLM is unavailable"""
        if any(word in message.lower() for word in ['location', 'analyze', 'address']):
            return "I'd be happy to help you analyze a location! Please share the address and I'll provide insights on market potential, competition, and investment viability."
        elif any(word in message.lower() for word in ['roi', 'profit', 'return']):
            return "ROI analysis is crucial for laundromat investments. Typical returns range from 15-35% annually. I can help you calculate potential returns for specific locations if you provide more details."
        else:
            return "I'm here to help with your laundromat investment and operations questions. What specific aspect would you like to discuss?"

    async def generate_personalized_welcome(self, consultant_profile: Dict) -> str:
        """Generate personalized welcome message"""
        user_name = consultant_profile['user_profile']['name']
        consultant_name = consultant_profile['consultant_data']['name']
        tier = consultant_profile['subscription_tier']
        
        if self.llm_client:
            try:
                prompt = f"""
Generate a warm, personalized welcome message for a laundromat consultant AI.

Consultant: {consultant_name}
User: {user_name}
Subscription: {tier}

The message should:
1. Introduce yourself as their personal consultant
2. Mention their subscription benefits
3. Ask an engaging question to start the conversation
4. Be warm and professional

Keep it under 100 words.
"""
                response = await self.llm_client.generate_text(prompt)
                return response.strip()
            except:
                pass
        
        # Fallback welcome
        return f"Hi {user_name}! I'm {consultant_name}, your personal LaundroTech consultant. I'm here to help you make smart laundromat investment decisions and optimize your operations. What brings you here today - are you exploring new investment opportunities or looking to improve an existing business?"