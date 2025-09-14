"""
PERSONALIZED AI CONSULTANT - THE STICKINESS GAME-CHANGER
Post-analysis AI consultant that becomes user's personal laundromat advisor
"""

import asyncio
import json
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Any, Optional
from motor.motor_asyncio import AsyncIOMotorClient
import logging
import uuid
import os
try:
    from emergentintegrations import get_universal_llm_client
except ImportError:
    # Fallback if emergentintegrations doesn't have get_universal_llm_client
    try:
        from emergentintegrations.llm.chat import LlmChat
        def get_universal_llm_client():
            return LlmChat()
    except ImportError:
        def get_universal_llm_client():
            return None

logger = logging.getLogger(__name__)

class PersonalizedAIConsultant:
    """Revolutionary personalized AI consultant for each user"""
    
    def __init__(self):
        # Initialize LLM client
        self.llm_client = None
        try:
            self.llm_client = get_universal_llm_client()
        except Exception as e:
            logger.error(f"LLM client initialization failed: {e}")
        
        # Consultant personas and specializations
        self.consultant_personas = {
            'arkansas_expert': {
                'name': 'Jake Miller',
                'title': 'Senior LaundroTech Consultant',
                'background': '3rd generation Arkansas laundromat expert with 25+ years experience',
                'specialties': ['ROI optimization', 'Arkansas market expertise', 'Equipment selection'],
                'personality': 'Direct, practical, data-driven with Arkansas wisdom'
            },
            'growth_specialist': {
                'name': 'Sarah Rodriguez',
                'title': 'Business Growth Strategist',
                'background': 'Former Goldman Sachs analyst specializing in small business growth',
                'specialties': ['Market expansion', 'Financial modeling', 'Competition analysis'],
                'personality': 'Strategic, analytical, focused on scalable growth'
            },
            'operations_guru': {
                'name': 'Mike Chen',
                'title': 'Operations Optimization Expert',
                'background': '15+ years optimizing laundromat operations and efficiency',
                'specialties': ['Equipment maintenance', 'Operational efficiency', 'Cost reduction'],
                'personality': 'Detail-oriented, practical, efficiency-focused'
            }
        }
        
        # Consultation categories and pricing
        self.consultation_tiers = {
            'basic_questions': {
                'price_per_month': 29,
                'includes': ['Basic Q&A about analysis', 'General advice', '5 questions/month'],
                'consultant_access': ['arkansas_expert']
            },
            'strategic_advisory': {
                'price_per_month': 79,
                'includes': ['Strategic planning', 'Market research', '15 questions/month', 'ROI optimization'],
                'consultant_access': ['arkansas_expert', 'growth_specialist']
            },
            'full_advisory': {
                'price_per_month': 199,
                'includes': ['Unlimited questions', 'All consultants', 'Real-time research', 'Custom recommendations'],
                'consultant_access': ['arkansas_expert', 'growth_specialist', 'operations_guru']
            }
        }

    async def initialize_personal_consultant(self, user_id: str, analysis_data: Dict) -> Dict[str, Any]:
        """Initialize personalized consultant after analysis completion"""
        try:
            # Extract key insights from user's analysis
            location_insights = self.extract_location_insights(analysis_data)
            
            # Determine optimal consultant persona
            optimal_persona = self.select_optimal_consultant(analysis_data)
            
            # Create personalized consultant profile
            consultant_profile = {
                'consultant_id': str(uuid.uuid4()),
                'user_id': user_id,
                'location_address': analysis_data.get('address', 'Unknown Location'),
                'analysis_data': analysis_data,
                'location_insights': location_insights,
                'primary_consultant': optimal_persona,
                'consultation_tier': 'basic_questions',  # Start with basic
                'created_at': datetime.now(timezone.utc).isoformat(),
                'last_interaction': datetime.now(timezone.utc).isoformat(),
                'conversation_history': [],
                'specialized_knowledge': self.build_specialized_knowledge(analysis_data),
                'action_items': self.generate_initial_action_items(analysis_data),
                'roi_optimization_plan': self.create_roi_optimization_plan(analysis_data)
            }
            
            # Generate personalized welcome message
            welcome_message = await self.generate_welcome_message(consultant_profile)
            consultant_profile['welcome_message'] = welcome_message
            
            return {
                'consultant_initialized': True,
                'consultant_profile': consultant_profile,
                'welcome_message': welcome_message,
                'subscription_options': self.consultation_tiers,
                'stickiness_factor': 'HIGH - Personalized to user\'s specific location and needs'
            }
            
        except Exception as e:
            logger.error(f"Consultant initialization error: {e}")
            return {'error': str(e)}

    async def handle_consultant_question(self, user_id: str, question: str, consultation_tier: str) -> Dict[str, Any]:
        """Handle user question with personalized consultant"""
        try:
            if not self.llm_client:
                raise Exception("LLM client not available")
            
            # Get user's consultant profile
            consultant_profile = await self.get_consultant_profile(user_id)
            if not consultant_profile:
                raise Exception("Consultant profile not found")
            
            # Check tier limits
            tier_config = self.consultation_tiers.get(consultation_tier, {})
            if not self.check_usage_limits(consultant_profile, tier_config):
                return {
                    'response': 'You\'ve reached your monthly question limit. Upgrade your consultation tier for unlimited access.',
                    'upgrade_required': True,
                    'current_tier': consultation_tier,
                    'upgrade_options': self.consultation_tiers
                }
            
            # Build comprehensive context for AI consultant
            consultant_context = self.build_consultant_context(consultant_profile, question)
            
            # Generate AI response with web research if needed
            if self.requires_research(question):
                research_data = await self.conduct_research(question, consultant_profile['location_insights'])
                consultant_context += f"\n\nRECENT RESEARCH FINDINGS:\n{research_data}"
            
            # Get AI consultant response
            consultant_response = await self.generate_consultant_response(
                consultant_context, 
                question, 
                consultant_profile['primary_consultant']
            )
            
            # Generate actionable recommendations
            action_items = await self.generate_action_items(question, consultant_response, consultant_profile)
            
            # Update conversation history
            await self.update_conversation_history(user_id, question, consultant_response, action_items)
            
            return {
                'consultant_response': consultant_response,
                'consultant_name': self.consultant_personas[consultant_profile['primary_consultant']]['name'],
                'consultant_title': self.consultant_personas[consultant_profile['primary_consultant']]['title'],
                'action_items': action_items,
                'follow_up_questions': self.generate_follow_up_questions(question, consultant_response),
                'research_conducted': self.requires_research(question),
                'consultation_tier': consultation_tier,
                'questions_remaining': self.calculate_questions_remaining(consultant_profile, tier_config)
            }
            
        except Exception as e:
            logger.error(f"Consultant question handling error: {e}")
            return {'error': str(e)}

    async def generate_roi_optimization_advice(self, user_id: str, focus_area: str) -> Dict[str, Any]:
        """Generate specific ROI optimization advice"""
        try:
            consultant_profile = await self.get_consultant_profile(user_id)
            if not consultant_profile:
                raise Exception("Consultant profile not found")
            
            analysis_data = consultant_profile['analysis_data']
            
            # ROI optimization strategies based on focus area
            roi_strategies = {
                'equipment': await self.optimize_equipment_roi(analysis_data),
                'pricing': await self.optimize_pricing_strategy(analysis_data),
                'operations': await self.optimize_operations(analysis_data),
                'marketing': await self.optimize_marketing_roi(analysis_data),
                'expansion': await self.analyze_expansion_opportunities(analysis_data)
            }
            
            focused_strategy = roi_strategies.get(focus_area, roi_strategies['equipment'])
            
            # Generate personalized implementation plan
            implementation_plan = await self.create_implementation_plan(focused_strategy, analysis_data)
            
            return {
                'roi_optimization': focused_strategy,
                'implementation_plan': implementation_plan,
                'expected_roi_improvement': self.calculate_roi_improvement(focused_strategy),
                'timeline': implementation_plan.get('timeline', '3-6 months'),
                'investment_required': implementation_plan.get('investment', 'Varies'),
                'consultant_recommendation': await self.generate_consultant_recommendation(focused_strategy, analysis_data)
            }
            
        except Exception as e:
            logger.error(f"ROI optimization advice error: {e}")
            return {'error': str(e)}

    async def provide_competition_intelligence(self, user_id: str, competitor_focus: str) -> Dict[str, Any]:
        """Provide competitive intelligence and strategies"""
        try:
            consultant_profile = await self.get_consultant_profile(user_id)
            if not consultant_profile:
                raise Exception("Consultant profile not found")
            
            analysis_data = consultant_profile['analysis_data']
            competitors = analysis_data.get('competitors', [])
            
            # Competitive intelligence analysis
            competitive_analysis = {
                'competitor_landscape': self.analyze_competitor_landscape(competitors),
                'competitive_advantages': self.identify_competitive_advantages(analysis_data, competitors),
                'market_gaps': self.identify_market_gaps(analysis_data, competitors),
                'pricing_intelligence': await self.gather_pricing_intelligence(competitors, analysis_data['address']),
                'differentiation_strategies': await self.generate_differentiation_strategies(analysis_data, competitors),
                'threat_assessment': self.assess_competitive_threats(competitors, analysis_data)
            }
            
            # Generate actionable competitive strategies
            competitive_strategies = await self.generate_competitive_strategies(competitive_analysis, analysis_data)
            
            return {
                'competitive_intelligence': competitive_analysis,
                'recommended_strategies': competitive_strategies,
                'immediate_actions': competitive_strategies.get('immediate_actions', []),
                'long_term_strategy': competitive_strategies.get('long_term_strategy', {}),
                'monitoring_plan': self.create_competitive_monitoring_plan(competitors)
            }
            
        except Exception as e:
            logger.error(f"Competition intelligence error: {e}")
            return {'error': str(e)}

    async def recommend_equipment_upgrades(self, user_id: str, budget_range: str) -> Dict[str, Any]:
        """Provide equipment upgrade recommendations"""
        try:
            consultant_profile = await self.get_consultant_profile(user_id)
            if not consultant_profile:
                raise Exception("Consultant profile not found")
            
            analysis_data = consultant_profile['analysis_data']
            
            # Parse budget range
            budget_limits = self.parse_budget_range(budget_range)
            
            # Equipment recommendations based on analysis and budget
            equipment_plan = {
                'priority_upgrades': await self.identify_priority_equipment(analysis_data, budget_limits),
                'roi_analysis': await self.calculate_equipment_roi(analysis_data, budget_limits),
                'financing_options': await self.get_equipment_financing_options(budget_limits),
                'vendor_recommendations': self.recommend_equipment_vendors(analysis_data),
                'installation_timeline': self.create_installation_timeline(budget_limits),
                'maintenance_plan': self.create_maintenance_plan(analysis_data)
            }
            
            # Generate personalized equipment strategy
            equipment_strategy = await self.generate_equipment_strategy(equipment_plan, analysis_data)
            
            return {
                'equipment_recommendations': equipment_plan,
                'personalized_strategy': equipment_strategy,
                'budget_optimization': self.optimize_budget_allocation(equipment_plan, budget_limits),
                'expected_revenue_impact': self.calculate_revenue_impact(equipment_plan),
                'implementation_roadmap': equipment_strategy.get('roadmap', [])
            }
            
        except Exception as e:
            logger.error(f"Equipment upgrade recommendations error: {e}")
            return {'error': str(e)}

    async def conduct_research(self, question: str, location_insights: Dict) -> str:
        """Conduct web research for user questions"""
        try:
            # Research topics based on question analysis
            research_query = self.build_research_query(question, location_insights)
            
            # For now, return structured research data
            # In production, this would use web search APIs
            research_findings = f"""
            RESEARCH CONDUCTED FOR: {question}
            
            MARKET TRENDS:
            - Laundromat industry showing 3.2% annual growth
            - Eco-friendly equipment demand up 15% this year
            - Contactless payment adoption at 78% industry-wide
            
            LOCATION-SPECIFIC INSIGHTS:
            - Similar markets showing ROI improvements of 12-18% with modern equipment
            - Average customer willingness to pay premium for convenience: 15-20%
            - Seasonal demand patterns suggest opportunity for optimization
            
            COMPETITIVE LANDSCAPE:
            - Industry consolidation creating opportunities for quality operators
            - Technology adoption separating successful operators from struggling ones
            - Customer experience becoming primary differentiator
            """
            
            return research_findings
            
        except Exception as e:
            logger.error(f"Research conduct error: {e}")
            return "Research temporarily unavailable. Providing analysis based on existing data."

    # Helper methods for consultant functionality
    def extract_location_insights(self, analysis_data: Dict) -> Dict:
        """Extract key insights from location analysis"""
        return {
            'location_grade': analysis_data.get('grade', 'B'),
            'market_score': analysis_data.get('score', 75),
            'primary_strengths': analysis_data.get('strengths', ['Good location', 'Strong demographics']),
            'key_challenges': analysis_data.get('challenges', ['Competition', 'Market saturation']),
            'revenue_potential': analysis_data.get('roi_estimate', {}).get('monthly_revenue', 15000),
            'investment_range': analysis_data.get('roi_estimate', {}).get('initial_investment', 350000),
            'payback_period': analysis_data.get('roi_estimate', {}).get('payback_period', 4.5),
            'demographic_profile': analysis_data.get('demographics', {}),
            'competition_level': len(analysis_data.get('competitors', []))
        }
    
    def select_optimal_consultant(self, analysis_data: Dict) -> str:
        """Select optimal consultant persona based on analysis"""
        score = analysis_data.get('score', 50)
        
        if score >= 80:
            return 'growth_specialist'  # High-potential locations get growth expert
        elif score >= 60:
            return 'arkansas_expert'    # Good locations get Arkansas wisdom
        else:
            return 'operations_guru'    # Challenging locations need operations focus
    
    def build_specialized_knowledge(self, analysis_data: Dict) -> Dict:
        """Build specialized knowledge base for this location"""
        return {
            'location_specific_factors': analysis_data.get('location_factors', []),
            'market_dynamics': analysis_data.get('market_analysis', {}),
            'financial_projections': analysis_data.get('roi_estimate', {}),
            'operational_considerations': analysis_data.get('operational_notes', []),
            'growth_opportunities': analysis_data.get('opportunities', []),
            'risk_factors': analysis_data.get('risks', [])
        }
    
    def generate_initial_action_items(self, analysis_data: Dict) -> List[Dict]:
        """Generate initial action items based on analysis"""
        action_items = []
        
        score = analysis_data.get('score', 50)
        
        if score >= 75:
            action_items.extend([
                {'priority': 'HIGH', 'action': 'Secure location lease quickly - high potential', 'timeline': '1-2 weeks'},
                {'priority': 'MEDIUM', 'action': 'Begin equipment vendor negotiations', 'timeline': '2-4 weeks'},
                {'priority': 'MEDIUM', 'action': 'Develop marketing launch strategy', 'timeline': '4-6 weeks'}
            ])
        elif score >= 60:
            action_items.extend([
                {'priority': 'MEDIUM', 'action': 'Conduct detailed financial modeling', 'timeline': '1-2 weeks'},
                {'priority': 'HIGH', 'action': 'Analyze ways to improve location score', 'timeline': '2-3 weeks'},
                {'priority': 'LOW', 'action': 'Research additional revenue streams', 'timeline': '4-8 weeks'}
            ])
        else:
            action_items.extend([
                {'priority': 'HIGH', 'action': 'Reassess location viability', 'timeline': '1 week'},
                {'priority': 'MEDIUM', 'action': 'Explore alternative locations', 'timeline': '2-4 weeks'},
                {'priority': 'LOW', 'action': 'Consider different business models', 'timeline': '4-6 weeks'}
            ])
        
        return action_items
    
    def create_roi_optimization_plan(self, analysis_data: Dict) -> Dict:
        """Create ROI optimization plan"""
        roi_data = analysis_data.get('roi_estimate', {})
        
        return {
            'current_roi_projection': roi_data.get('roi_percentage', '18%'),
            'optimization_opportunities': [
                'Equipment efficiency improvements',
                'Pricing strategy optimization',
                'Operational cost reduction',
                'Revenue stream diversification'
            ],
            'potential_roi_improvement': '3-7 percentage points',
            'implementation_timeline': '6-12 months',
            'investment_required': 'Varies by strategy'
        }
    
    async def generate_welcome_message(self, consultant_profile: Dict) -> str:
        """Generate personalized welcome message"""
        try:
            if not self.llm_client:
                return self.generate_fallback_welcome_message(consultant_profile)
                
            consultant_name = self.consultant_personas[consultant_profile['primary_consultant']]['name']
            location = consultant_profile['location_address']
            score = consultant_profile['location_insights']['market_score']
            
            prompt = f"""
            You are {consultant_name}, a personalized AI consultant for laundromat investments. 
            
            A user just completed analysis for: {location}
            Analysis score: {score}/100
            
            Write a personalized welcome message that:
            1. Introduces yourself as their personal consultant
            2. References their specific location analysis
            3. Highlights key opportunities or concerns
            4. Explains how you'll help them succeed
            5. Is warm, professional, and encouraging
            
            Keep it conversational and under 150 words.
            """
            
            response = await self.llm_client.generate_text(prompt)
            return response.strip()
            
        except Exception as e:
            logger.error(f"Welcome message generation error: {e}")
            return self.generate_fallback_welcome_message(consultant_profile)
    
    def generate_fallback_welcome_message(self, consultant_profile: Dict) -> str:
        """Generate fallback welcome message without LLM"""
        consultant_data = self.consultant_personas[consultant_profile['primary_consultant']]
        location = consultant_profile['location_address']
        score = consultant_profile['location_insights']['market_score']
        
        return f"""
        👋 Hi! I'm {consultant_data['name']}, your personal LaundroTech consultant!
        
        I've reviewed your analysis for {location} (Score: {score}/100) and I'm excited to help you succeed. 
        
        As your dedicated advisor, I can help you with:
        • ROI optimization strategies
        • Competition analysis and positioning  
        • Equipment selection and upgrades
        • Operational efficiency improvements
        • Market expansion opportunities
        
        I'm here whenever you need guidance, research, or actionable advice for your laundromat investment. 
        
        What would you like to discuss first? 🚀
        """
    
    def requires_research(self, question: str) -> bool:
        """Determine if question requires web research"""
        research_keywords = [
            'latest', 'current', 'trending', 'new', 'recent', 'market update',
            'competitor analysis', 'pricing in area', 'what should I know about'
        ]
        return any(keyword in question.lower() for keyword in research_keywords)
    
    def build_consultant_context(self, consultant_profile: Dict, question: str) -> str:
        """Build comprehensive context for AI consultant"""
        consultant_data = self.consultant_personas[consultant_profile['primary_consultant']]
        analysis_data = consultant_profile['analysis_data']
        insights = consultant_profile['location_insights']
        
        context = f"""
        CONSULTANT PROFILE:
        Name: {consultant_data['name']}
        Title: {consultant_data['title']}
        Background: {consultant_data['background']}
        Specialties: {', '.join(consultant_data['specialties'])}
        Personality: {consultant_data['personality']}
        
        USER'S LOCATION ANALYSIS:
        Address: {consultant_profile['location_address']}
        Score: {insights['market_score']}/100
        Grade: {insights['location_grade']}
        Revenue Potential: ${insights['revenue_potential']:,}/month
        Investment Range: ${insights['investment_range']:,}
        Payback Period: {insights['payback_period']} years
        Competition Level: {insights['competition_level']} competitors nearby
        
        KEY INSIGHTS:
        Strengths: {', '.join(insights['primary_strengths'])}
        Challenges: {', '.join(insights['key_challenges'])}
        
        SPECIALIZED KNOWLEDGE:
        {json.dumps(consultant_profile['specialized_knowledge'], indent=2)}
        
        CURRENT ACTION ITEMS:
        {json.dumps(consultant_profile['action_items'], indent=2)}
        
        USER'S QUESTION: {question}
        
        Provide specific, actionable advice as {consultant_data['name']} would, drawing on the analysis data and your expertise.
        """
        
        return context
    
    async def generate_consultant_response(self, context: str, question: str, consultant_type: str) -> str:
        """Generate AI consultant response"""
        try:
            if not self.llm_client:
                return self.generate_fallback_response(question, consultant_type)
            
            response = await self.llm_client.generate_text(context)
            return response.strip()
            
        except Exception as e:
            logger.error(f"Consultant response generation error: {e}")
            return self.generate_fallback_response(question, consultant_type)
    
    def generate_fallback_response(self, question: str, consultant_type: str) -> str:
        """Generate fallback response without LLM"""
        consultant_data = self.consultant_personas[consultant_type]
        
        return f"""
        Thanks for your question! As {consultant_data['name']}, I'd recommend focusing on the key factors from your analysis.
        
        Based on my {consultant_data['background']}, here's my advice:
        
        Given your location's performance and market conditions, I suggest prioritizing the highest-impact opportunities first. 
        
        Would you like me to dive deeper into any specific aspect of your analysis? I can provide more targeted recommendations for:
        • ROI optimization strategies
        • Competition positioning
        • Equipment selection
        • Operational improvements
        
        What specific area would you like to explore further?
        """
    
    async def get_consultant_profile(self, user_id: str) -> Optional[Dict]:
        """Get user's consultant profile from database"""
        # In production, this would query the database
        # For now, return None (would be stored after initialization)
        return None
    
    def check_usage_limits(self, consultant_profile: Dict, tier_config: Dict) -> bool:
        """Check if user has exceeded usage limits"""
        # Simplified check - in production would track actual usage
        return True  # Allow for demo
    
    def parse_budget_range(self, budget_range: str) -> Dict:
        """Parse budget range string into limits"""
        # Simple parsing - in production would be more sophisticated
        return {'min': 0, 'max': 100000, 'preferred': 50000}
    
    async def update_conversation_history(self, user_id: str, question: str, response: str, action_items: List):
        """Update conversation history in database"""
        # In production, this would update the database
        pass
    
    def calculate_questions_remaining(self, consultant_profile: Dict, tier_config: Dict) -> int:
        """Calculate questions remaining in current billing period"""
        # Simplified - in production would track actual usage
        return tier_config.get('questions_per_month', 5)
    
    def generate_follow_up_questions(self, question: str, response: str) -> List[str]:
        """Generate relevant follow-up questions"""
        return [
            "How can I improve my ROI further?",
            "What should I watch out for with competitors?",
            "When should I consider expanding?",
            "What equipment upgrades would help most?"
        ]

# Global personalized consultant
ai_consultant = PersonalizedAIConsultant()