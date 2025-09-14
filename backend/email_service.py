import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, From, To, Subject, HtmlContent, PlainTextContent
from typing import Optional
import logging
from datetime import datetime
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        self.api_key = os.environ.get('SENDGRID_API_KEY')
        self.sender_email = os.environ.get('SENDER_EMAIL', 'nick@laundrotech.xyz')
        self.sg = SendGridAPIClient(api_key=self.api_key) if self.api_key else None
    
    async def send_welcome_email(self, user_email: str, user_name: str, facebook_member: bool = False):
        """Send welcome email to new users"""
        if not self.sg:
            logger.warning("SendGrid not configured, skipping email")
            return False
        
        facebook_bonus = """
        <div style="background: linear-gradient(135deg, #3B82F6, #06B6D4); padding: 20px; border-radius: 12px; margin: 20px 0;">
            <h3 style="color: white; margin: 0 0 10px 0;">🎉 Facebook Group Member Benefits Activated!</h3>
            <ul style="color: white; margin: 0; padding-left: 20px;">
                <li>30% discount on your first premium analysis</li>
                <li>Early access to new AI features</li>
                <li>Exclusive community case studies</li>
                <li>Monthly expert AMA sessions</li>
                <li>$50 credit for each qualified referral</li>
            </ul>
        </div>
        """ if facebook_member else ""
        
        html_content = f"""
        <html>
        <head>
            <style>
                body {{ font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ text-align: center; padding: 30px 0; background: linear-gradient(135deg, #0F172A, #1E3A8A); border-radius: 12px; }}
                .logo {{ max-width: 120px; height: auto; }}
                .title {{ color: white; font-size: 32px; font-weight: bold; margin: 20px 0 10px 0; }}
                .subtitle {{ color: #94A3B8; font-size: 18px; margin: 0; }}
                .content {{ padding: 30px 0; }}
                .feature-grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0; }}
                .feature {{ background: #F8FAFC; padding: 20px; border-radius: 8px; border-left: 4px solid #06B6D4; }}
                .cta {{ text-align: center; margin: 40px 0; }}
                .button {{ display: inline-block; background: linear-gradient(135deg, #06B6D4, #10B981); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; }}
                .footer {{ text-align: center; padding-top: 30px; border-top: 1px solid #E2E8F0; color: #64748B; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="https://customer-assets.emergentagent.com/job_laundrosight/artifacts/68vqd4wq_Logo%2C%20Transparent.png" alt="SiteAtlas Logo" class="logo">
                    <h1 class="title">Welcome to SiteAtlas</h1>
                    <p class="subtitle">LaundroTech Powered By Service Titan</p>
                </div>
                
                <div class="content">
                    <h2>Welcome {user_name}! 🚀</h2>
                    <p>You've just joined the world's most advanced laundromat intelligence platform, trusted by over 67,000 professionals worldwide.</p>
                    
                    {facebook_bonus}
                    
                    <h3>Your AI-Powered Journey Starts Now:</h3>
                    <div class="feature-grid">
                        <div class="feature">
                            <h4>🎯 Free Location Scout</h4>
                            <p>Get instant AI-powered location grades and competitor analysis</p>
                        </div>
                        <div class="feature">
                            <h4>📊 Real-Time Intelligence</h4>
                            <p>Access demographic data, traffic patterns, and ROI estimates</p>
                        </div>
                        <div class="feature">
                            <h4>🧠 Machine Learning Insights</h4>
                            <p>Advanced algorithms analyze 47+ data points for precision accuracy</p>
                        </div>
                        <div class="feature">
                            <h4>🏢 Hybrid Business Matrix</h4>
                            <p>Discover coffee shops, car washes, and other revenue opportunities</p>
                        </div>
                    </div>
                    
                    <div class="cta">
                        <a href="https://siteanalytics.preview.emergentagent.com/analyze" class="button">
                            Start Your First AI Analysis
                        </a>
                    </div>
                    
                    <p><strong>Pro Tip:</strong> Start with our free Location Scout to experience the power of our AI, then upgrade to unlock advanced competitive intelligence and revenue optimization strategies.</p>
                </div>
                
                <div class="footer">
                    <p>Questions? Reply to this email or contact our support team.</p>
                    <p>SiteAtlas - Turning Location Data Into Million-Dollar Intelligence</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        try:
            message = Mail(
                from_email=From(self.sender_email, "SiteAtlas Intelligence"),
                to_emails=To(user_email),
                subject=Subject(f"Welcome to SiteAtlas, {user_name}! Your AI Journey Begins 🚀"),
                html_content=HtmlContent(html_content)
            )
            
            response = self.sg.send(message)
            logger.info(f"Welcome email sent to {user_email}, status: {response.status_code}")
            return response.status_code == 202
            
        except Exception as e:
            logger.error(f"Failed to send welcome email to {user_email}: {str(e)}")
            return False
    
    async def send_analysis_complete_email(self, user_email: str, user_name: str, analysis_data: dict):
        """Send email when analysis is complete"""
        if not self.sg:
            logger.warning("SendGrid not configured, skipping email")
            return False
        
        html_content = f"""
        <html>
        <head>
            <style>
                body {{ font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ text-align: center; padding: 20px 0; background: linear-gradient(135deg, #0F172A, #1E3A8A); border-radius: 12px; }}
                .results {{ background: #F8FAFC; padding: 30px; border-radius: 12px; margin: 20px 0; }}
                .grade {{ font-size: 48px; font-weight: bold; text-align: center; margin: 20px 0; }}
                .grade-a {{ color: #10B981; }}
                .grade-b {{ color: #3B82F6; }}
                .grade-c {{ color: #F59E0B; }}
                .grade-d {{ color: #EF4444; }}
                .grade-f {{ color: #DC2626; }}
                .stats {{ display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }}
                .stat {{ text-align: center; padding: 15px; background: white; border-radius: 8px; }}
                .cta {{ text-align: center; margin: 30px 0; }}
                .button {{ display: inline-block; background: linear-gradient(135deg, #06B6D4, #10B981); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="https://customer-assets.emergentagent.com/job_laundrosight/artifacts/68vqd4wq_Logo%2C%20Transparent.png" alt="SiteAtlas Logo" style="max-width: 80px;">
                    <h1 style="color: white; margin: 15px 0 5px 0;">Analysis Complete!</h1>
                    <p style="color: #94A3B8; margin: 0;">Your AI intelligence report is ready</p>
                </div>
                
                <div class="results">
                    <h2>📍 {analysis_data.get('address', 'Location Analysis')}</h2>
                    <div class="grade grade-{analysis_data.get('grade', 'C')[0].lower()}">{analysis_data.get('grade', 'C')}</div>
                    <p style="text-align: center; font-size: 18px; color: #64748B;">AI Confidence Score: {analysis_data.get('score', 0):.1f}/100</p>
                    
                    <div class="stats">
                        <div class="stat">
                            <h4>Population</h4>
                            <p style="font-size: 20px; font-weight: bold; color: #06B6D4;">{analysis_data.get('demographics', {}).get('population', 'N/A') if isinstance(analysis_data.get('demographics', {}).get('population', 'N/A'), str) else f"{analysis_data.get('demographics', {}).get('population', 0):,}"}</p>
                        </div>
                        <div class="stat">
                            <h4>Competitors</h4>
                            <p style="font-size: 20px; font-weight: bold; color: #06B6D4;">{len(analysis_data.get('competitors', []))}</p>
                        </div>
                        <div class="stat">
                            <h4>Est. Monthly Revenue</h4>
                            <p style="font-size: 20px; font-weight: bold; color: #10B981;">${analysis_data.get('roi_estimate', {}).get('estimated_monthly_revenue', 0):,}</p>
                        </div>
                        <div class="stat">
                            <h4>Analysis Type</h4>
                            <p style="font-size: 16px; font-weight: bold; color: #8B5CF6; text-transform: capitalize;">{analysis_data.get('analysis_type', 'Scout')}</p>
                        </div>
                    </div>
                    
                    <div class="cta">
                        <a href="https://siteanalytics.preview.emergentagent.com/history" class="button">
                            View Full Analysis Report
                        </a>
                    </div>
                </div>
                
                <p>Your analysis includes competitive intelligence, demographic insights, and AI-powered recommendations to maximize your investment potential.</p>
                
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E2E8F0; color: #64748B;">
                    <p>SiteAtlas - Turning Location Data Into Million-Dollar Intelligence</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        try:
            message = Mail(
                from_email=From(self.sender_email, "SiteAtlas Intelligence"),
                to_emails=To(user_email),
                subject=Subject(f"🎯 Your {analysis_data.get('address', 'Location')} Analysis is Ready - Grade: {analysis_data.get('grade', 'C')}"),
                html_content=HtmlContent(html_content)
            )
            
            response = self.sg.send(message)
            logger.info(f"Analysis complete email sent to {user_email}, status: {response.status_code}")
            return response.status_code == 202
            
        except Exception as e:
            logger.error(f"Failed to send analysis email to {user_email}: {str(e)}")
            return False
    
    async def send_badge_activation_email(self, user_email: str, user_name: str, badge_name: str, offer_type: str):
        """Send badge activation confirmation email to nick@laundryguys.net"""
        if not self.sg:
            logger.warning("SendGrid not configured, skipping email")
            return False
        
        # Always send to nick@laundryguys.net for badge activations
        notification_email = "nick@laundryguys.net"
        
        # Badge-specific content
        badge_details = {
            "verified_seller": {
                "icon": "✅",
                "color": "#10B981",
                "benefits": ["Verified seller badge display", "Enhanced credibility", "Priority listing visibility"]
            },
            "vendor_partner": {
                "icon": "🤝",
                "color": "#3B82F6", 
                "benefits": ["Vendor partner badge display", "Premium listing features", "Direct messaging priority"]
            },
            "verified_funder": {
                "icon": "💰",
                "color": "#8B5CF6",
                "benefits": ["Verified funder badge display", "Investment opportunity access", "Exclusive funding alerts"]
            },
            "featured_post": {
                "icon": "📌",
                "color": "#F59E0B",
                "benefits": ["Post pinned to top", "Maximum visibility", "Enhanced engagement"]
            },
            "logo_placement": {
                "icon": "🏢",
                "color": "#EF4444",
                "benefits": ["Logo on group cover", "Pinned promotional shoutout", "Brand visibility"]
            },
            "sponsored_ama": {
                "icon": "🎤",
                "color": "#EC4899",
                "benefits": ["Hosted AMA session", "Community engagement", "Thought leadership positioning"]
            }
        }
        
        badge_info = badge_details.get(offer_type, {
            "icon": "🎯",
            "color": "#06B6D4",
            "benefits": ["Premium feature access"]
        })
        
        benefits_html = "".join([f"<li>{benefit}</li>" for benefit in badge_info["benefits"]])
        
        html_content = f"""
        <html>
        <head>
            <style>
                body {{ font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ text-align: center; padding: 30px 0; background: linear-gradient(135deg, #0F172A, #1E3A8A); border-radius: 12px; }}
                .badge-alert {{ background: linear-gradient(135deg, {badge_info["color"]}, #06B6D4); padding: 25px; border-radius: 12px; margin: 20px 0; text-align: center; }}
                .user-info {{ background: #F8FAFC; padding: 20px; border-radius: 8px; margin: 20px 0; }}
                .activation-steps {{ background: #FEF9E7; padding: 20px; border-radius: 8px; border-left: 4px solid #F59E0B; margin: 20px 0; }}
                .benefits {{ background: #F0FDF4; padding: 20px; border-radius: 8px; margin: 20px 0; }}
                .footer {{ text-align: center; padding-top: 30px; border-top: 1px solid #E2E8F0; color: #64748B; }}
                .badge-icon {{ font-size: 48px; margin: 10px 0; }}
                ul {{ padding-left: 20px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="https://customer-assets.emergentagent.com/job_laundrosight/artifacts/68vqd4wq_Logo%2C%20Transparent.png" alt="LaundroTech Logo" style="max-width: 100px;">
                    <h1 style="color: white; margin: 15px 0 5px 0;">Badge Activation Alert</h1>
                    <p style="color: #94A3B8; margin: 0;">Facebook Group Monetization System</p>
                </div>
                
                <div class="badge-alert">
                    <div class="badge-icon">{badge_info["icon"]}</div>
                    <h2 style="color: white; margin: 10px 0;">{badge_name} Activated!</h2>
                    <p style="color: white; font-size: 18px; margin: 0;">A new badge subscription has been activated</p>
                </div>
                
                <div class="user-info">
                    <h3>User Details:</h3>
                    <ul>
                        <li><strong>Name:</strong> {user_name}</li>
                        <li><strong>Email:</strong> {user_email}</li>
                        <li><strong>Badge Type:</strong> {badge_name}</li>
                        <li><strong>Offer Type:</strong> {offer_type}</li>
                        <li><strong>Activation Time:</strong> {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} UTC</li>
                    </ul>
                </div>
                
                <div class="benefits">
                    <h3>🎯 Badge Benefits Activated:</h3>
                    <ul>
                        {benefits_html}
                    </ul>
                </div>
                
                <div class="activation-steps">
                    <h3>⚡ Required Actions:</h3>
                    <ol>
                        <li><strong>Add Badge to User Profile:</strong> Update {user_name}'s Facebook profile with {badge_info["icon"]} {badge_name}</li>
                        <li><strong>Update Group Settings:</strong> Grant appropriate permissions and visibility features</li>
                        <li><strong>Send Welcome Message:</strong> Contact user with activation confirmation and next steps</li>
                        <li><strong>Monitor Subscription:</strong> Set up tracking for monthly renewal on this subscription</li>
                    </ol>
                </div>
                
                <div style="background: #FEF2F2; padding: 20px; border-radius: 8px; border-left: 4px solid #EF4444; margin: 20px 0;">
                    <h3 style="color: #DC2626;">🚨 Immediate Action Required</h3>
                    <p>This badge activation requires manual setup in the Facebook group. Please complete the activation steps within 24 hours to ensure user satisfaction.</p>
                </div>
                
                <div class="footer">
                    <p>LaundroTech Badge Management System</p>
                    <p>Automated notification sent at {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} UTC</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        try:
            message = Mail(
                from_email=From(self.sender_email, "LaundroTech Badge System"),
                to_emails=To(notification_email),
                subject=Subject(f"🚨 Badge Activated: {badge_name} for {user_name} ({offer_type})"),
                html_content=HtmlContent(html_content)
            )
            
            response = self.sg.send(message)
            logger.info(f"Badge activation email sent to {notification_email} for user {user_email}, status: {response.status_code}")
            return response.status_code == 202
            
        except Exception as e:
            logger.error(f"Failed to send badge activation email to {notification_email}: {str(e)}")
            return False
    
    async def send_cancellation_email(self, user_email: str, user_name: str, offer_type: str):
        """Send subscription cancellation confirmation email"""
        if not self.sg:
            logger.warning("SendGrid not configured, skipping email")
            return False
        
        # Badge-specific content
        badge_details = {
            "verified_seller": {"name": "Verified Seller Badge", "icon": "✅"},
            "vendor_partner": {"name": "Vendor Partner Badge", "icon": "🤝"},
            "verified_funder": {"name": "Verified Funder Badge", "icon": "💰"},
            "featured_post": {"name": "Featured Post", "icon": "📌"},
            "logo_placement": {"name": "Logo Placement", "icon": "🏢"},
            "sponsored_ama": {"name": "Sponsored AMA", "icon": "🎤"}
        }
        
        badge_info = badge_details.get(offer_type, {"name": "Badge", "icon": "🎯"})
        
        html_content = f"""
        <html>
        <head>
            <style>
                body {{ font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ text-align: center; padding: 30px 0; background: linear-gradient(135deg, #0F172A, #1E3A8A); border-radius: 12px; }}
                .cancellation-notice {{ background: #FEF2F2; padding: 25px; border-radius: 12px; margin: 20px 0; text-align: center; border-left: 4px solid #EF4444; }}
                .next-steps {{ background: #F0FDF4; padding: 20px; border-radius: 8px; margin: 20px 0; }}
                .footer {{ text-align: center; padding-top: 30px; border-top: 1px solid #E2E8F0; color: #64748B; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="https://customer-assets.emergentagent.com/job_laundrosight/artifacts/68vqd4wq_Logo%2C%20Transparent.png" alt="LaundroTech Logo" style="max-width: 100px;">
                    <h1 style="color: white; margin: 15px 0 5px 0;">Subscription Cancelled</h1>
                    <p style="color: #94A3B8; margin: 0;">LaundroTech Badge Management</p>
                </div>
                
                <div class="cancellation-notice">
                    <div style="font-size: 48px; margin: 10px 0;">{badge_info["icon"]}</div>
                    <h2 style="color: #DC2626; margin: 10px 0;">Subscription Cancelled</h2>
                    <p style="color: #374151; font-size: 18px; margin: 0;">Your {badge_info["name"]} subscription has been successfully cancelled</p>
                </div>
                
                <div style="background: #F8FAFC; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>Cancellation Details:</h3>
                    <ul>
                        <li><strong>Member:</strong> {user_name}</li>
                        <li><strong>Email:</strong> {user_email}</li>
                        <li><strong>Badge:</strong> {badge_info["name"]}</li>
                        <li><strong>Cancelled:</strong> {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} UTC</li>
                    </ul>
                </div>
                
                <div class="next-steps">
                    <h3>✅ What Happens Next:</h3>
                    <ul>
                        <li>Your badge access will remain active until your current billing period ends</li>
                        <li>You will not be charged for future billing cycles</li>
                        <li>You can reactivate your subscription anytime through your dashboard</li>
                        <li>Your account and community access remain active</li>
                    </ul>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <h3 style="color: #1F2937;">Want to Come Back?</h3>
                    <p style="color: #6B7280; margin-bottom: 20px;">You can reactivate your badge subscription anytime with just one click</p>
                    <a href="https://siteanalytics.preview.emergentagent.com/facebook-group" style="display: inline-block; background: linear-gradient(135deg, #3B82F6, #06B6D4); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                        Reactivate Subscription
                    </a>
                </div>
                
                <div class="footer">
                    <p>Questions about your cancellation? Contact us at <a href="mailto:nick@laundrotech.xyz" style="color: #3B82F6;">nick@laundrotech.xyz</a></p>
                    <p>LaundroTech Badge Management System</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        try:
            message = Mail(
                from_email=From(self.sender_email, "LaundroTech Support"),
                to_emails=To(user_email),
                subject=Subject(f"Subscription Cancelled: {badge_info['name']} - We're Sorry to See You Go"),
                html_content=HtmlContent(html_content)
            )
            
            response = self.sg.send(message)
            logger.info(f"Cancellation email sent to {user_email}, status: {response.status_code}")
            return response.status_code == 202
            
        except Exception as e:
            logger.error(f"Failed to send cancellation email to {user_email}: {str(e)}")
            return False
    
    async def send_support_notification(self, user_email: str, user_name: str, subject: str, message: str, category: str, priority: str):
        """Send support request notification"""
        if not self.sg:
            logger.warning("SendGrid not configured, skipping email")
            return False
        
        priority_colors = {
            "low": "#10B981",
            "medium": "#F59E0B", 
            "high": "#EF4444",
            "urgent": "#DC2626"
        }
        
        priority_color = priority_colors.get(priority, "#F59E0B")
        notification_email = "nick@laundrotech.xyz"
        
        html_content = f"""
        <html>
        <head>
            <style>
                body {{ font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ text-align: center; padding: 30px 0; background: linear-gradient(135deg, #0F172A, #1E3A8A); border-radius: 12px; }}
                .priority-badge {{ display: inline-block; background: {priority_color}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; }}
                .ticket-info {{ background: #F8FAFC; padding: 20px; border-radius: 8px; margin: 20px 0; }}
                .message-content {{ background: #FFF; padding: 20px; border-radius: 8px; border-left: 4px solid #3B82F6; margin: 20px 0; }}
                .footer {{ text-align: center; padding-top: 30px; border-top: 1px solid #E2E8F0; color: #64748B; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="https://customer-assets.emergentagent.com/job_laundrosight/artifacts/68vqd4wq_Logo%2C%20Transparent.png" alt="LaundroTech Logo" style="max-width: 100px;">
                    <h1 style="color: white; margin: 15px 0 5px 0;">🎫 New Support Request</h1>
                    <p style="color: #94A3B8; margin: 0;">Priority: <span class="priority-badge">{priority}</span></p>
                </div>
                
                <div class="ticket-info">
                    <h2 style="color: #1F2937; margin-top: 0;">Request Details</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; color: #6B7280; font-weight: bold;">Name:</td>
                            <td style="padding: 8px 0; color: #1F2937;">{user_name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6B7280; font-weight: bold;">Email:</td>
                            <td style="padding: 8px 0; color: #1F2937;">{user_email}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6B7280; font-weight: bold;">Category:</td>
                            <td style="padding: 8px 0; color: #1F2937; text-transform: capitalize;">{category}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6B7280; font-weight: bold;">Subject:</td>
                            <td style="padding: 8px 0; color: #1F2937; font-weight: bold;">{subject}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6B7280; font-weight: bold;">Submitted:</td>
                            <td style="padding: 8px 0; color: #1F2937;">{datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} UTC</td>
                        </tr>
                    </table>
                </div>
                
                <div class="message-content">
                    <h3 style="color: #1F2937; margin-top: 0;">📝 Message:</h3>
                    <p style="color: #374151; white-space: pre-line; line-height: 1.6;">{message}</p>
                </div>
                
                <div style="background: #FEF9E7; padding: 20px; border-radius: 8px; border-left: 4px solid #F59E0B; margin: 20px 0;">
                    <h3 style="color: #92400E; margin-top: 0;">⚡ Action Required</h3>
                    <p style="color: #92400E;">Please respond to this support request within 24 hours.</p>
                    <p style="color: #92400E; margin-bottom: 0;">
                        <strong>Reply directly to:</strong> {user_email}
                    </p>
                </div>
                
                <div class="footer">
                    <p>LaundroTech Support System</p>
                    <p>This is an automated notification from the customer support system</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Send to support team
        try:
            message = Mail(
                from_email=From(self.sender_email, "LaundroTech Support System"),
                to_emails=To(notification_email),
                subject=Subject(f"🎫 Support Request: {subject} ({priority.upper()} priority)"),
                html_content=HtmlContent(html_content)
            )
            
            response = self.sg.send(message)
            
            # Send confirmation to user
            user_confirmation = f"""
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ text-align: center; padding: 30px 0; background: linear-gradient(135deg, #0F172A, #1E3A8A); border-radius: 12px; }}
                    .content {{ background: #F8FAFC; padding: 20px; border-radius: 8px; margin: 20px 0; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="https://customer-assets.emergentagent.com/job_laundrosight/artifacts/68vqd4wq_Logo%2C%20Transparent.png" alt="LaundroTech Logo" style="max-width: 100px;">
                        <h1 style="color: white; margin: 15px 0 5px 0;">✅ Support Request Received</h1>
                        <p style="color: #94A3B8; margin: 0;">We'll get back to you soon</p>
                    </div>
                    
                    <div class="content">
                        <h2>Hi {user_name},</h2>
                        <p>Thank you for contacting LaundroTech support. We've received your request about "<strong>{subject}</strong>" and will respond within 24 hours.</p>
                        
                        <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #3B82F6;">
                            <h4 style="margin-top: 0;">Your Request Summary:</h4>
                            <p><strong>Category:</strong> {category.title()}</p>
                            <p><strong>Priority:</strong> {priority.title()}</p>
                            <p><strong>Message:</strong></p>
                            <p style="color: #6B7280; font-style: italic;">{message[:200]}{'...' if len(message) > 200 else ''}</p>
                        </div>
                        
                        <p>In the meantime, you might find answers in our <a href="https://siteanalytics.preview.emergentagent.com/support" style="color: #3B82F6;">FAQ section</a>.</p>
                        
                        <p>Best regards,<br>LaundroTech Support Team</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            user_message = Mail(
                from_email=From(self.sender_email, "LaundroTech Support"),
                to_emails=To(user_email),
                subject=Subject(f"Support Request Received: {subject}"),
                html_content=HtmlContent(user_confirmation)
            )
            
            self.sg.send(user_message)
            
            logger.info(f"Support notification sent for {user_email}, status: {response.status_code}")
            return response.status_code == 202
            
        except Exception as e:
            logger.error(f"Failed to send support notification: {str(e)}")
            return False
    
    async def send_security_notification(self, user_email: str, user_name: str, subject: str, message: str):
        """Send security notification email"""
        if not self.sg:
            logger.warning("SendGrid not configured, skipping email")
            return False
        
        html_content = f"""
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ text-align: center; padding: 30px 0; background: linear-gradient(135deg, #0F172A, #1E3A8A); border-radius: 12px; }}
                .content {{ background: #F8FAFC; padding: 20px; border-radius: 8px; margin: 20px 0; }}
                .security-alert {{ background: #FEF2F2; border-left: 4px solid #EF4444; padding: 15px; margin: 20px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="https://customer-assets.emergentagent.com/job_laundrosight/artifacts/68vqd4wq_Logo%2C%20Transparent.png" alt="LaundroTech Logo" style="max-width: 100px;">
                    <h1 style="color: white; margin: 15px 0 5px 0;">🔒 Security Alert</h1>
                    <p style="color: #94A3B8; margin: 0;">LaundroTech Security Team</p>
                </div>
                
                <div class="content">
                    <h2>Hi {user_name},</h2>
                    <div class="security-alert">
                        <h3 style="color: #DC2626; margin-top: 0;">{subject}</h3>
                        <p style="color: #374151;">{message}</p>
                    </div>
                    <p>If this was you, no further action is needed. If you didn't initiate this action, please contact our support team immediately.</p>
                    <p>Best regards,<br>LaundroTech Security Team</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        try:
            message = Mail(
                from_email=From(self.sender_email, "LaundroTech Security"),
                to_emails=To(user_email),
                subject=Subject(f"🔒 Security Alert: {subject}"),
                html_content=HtmlContent(html_content)
            )
            
            response = self.sg.send(message)
            logger.info(f"Security notification sent to {user_email}, status: {response.status_code}")
            return response.status_code == 202
            
        except Exception as e:
            logger.error(f"Failed to send security notification to {user_email}: {str(e)}")
            return False
    
    async def send_custom_email(self, user_email: str, user_name: str, subject: str, html_content: str):
        """Send custom HTML email"""
        if not self.sg:
            logger.warning("SendGrid not configured, skipping email")
            return False
        
        try:
            message = Mail(
                from_email=From(self.sender_email, "LaundroTech"),
                to_emails=To(user_email),
                subject=Subject(subject),
                html_content=HtmlContent(html_content)
            )
            
            response = self.sg.send(message)
            logger.info(f"Custom email sent to {user_email}, status: {response.status_code}")
            return response.status_code == 202
            
        except Exception as e:
            logger.error(f"Failed to send custom email to {user_email}: {str(e)}")
            return False

# Global email service instance
email_service = EmailService()