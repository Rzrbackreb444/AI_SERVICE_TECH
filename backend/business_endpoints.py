"""
BUSINESS ENDPOINTS - Contact, Careers, Blog, Support Systems
Everything needed for business operations and scaling
"""

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from typing import Dict, List, Any, Optional
from datetime import datetime, timezone
import logging
import uuid
from motor.motor_asyncio import AsyncIOMotorClient
import os
from email_service import email_service

logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/siteatlas')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'sitetitan_db')]

def create_business_router() -> APIRouter:
    """Create business operations router"""
    router = APIRouter(prefix="/business", tags=["business"])
    
    @router.post("/contact/submit")
    async def submit_contact_form(
        contact_request: Dict[str, Any],
        background_tasks: BackgroundTasks
    ):
        """Submit contact form and send email to Nick"""
        try:
            # Validate required fields
            required_fields = ['name', 'email', 'inquiry_type', 'subject', 'message']
            for field in required_fields:
                if not contact_request.get(field):
                    raise HTTPException(status_code=400, detail=f"Field '{field}' is required")
            
            # Store contact submission in database
            contact_submission = {
                'id': str(uuid.uuid4()),
                'name': contact_request['name'],
                'email': contact_request['email'],
                'phone': contact_request.get('phone', ''),
                'company': contact_request.get('company', ''),
                'inquiry_type': contact_request['inquiry_type'],
                'subject': contact_request['subject'],
                'message': contact_request['message'],
                'preferred_contact': contact_request.get('preferred_contact', 'email'),
                'submitted_at': datetime.now(timezone.utc),
                'status': 'new',
                'responded': False
            }
            
            await db.contact_submissions.insert_one(contact_submission)
            
            # Send email notification to Nick
            background_tasks.add_task(
                send_contact_notification,
                contact_submission
            )
            
            return {
                'success': True,
                'message': 'Contact form submitted successfully',
                'submission_id': contact_submission['id']
            }
            
        except Exception as e:
            logger.error(f"Contact form submission error: {e}")
            raise HTTPException(status_code=500, detail="Failed to submit contact form")
    
    @router.get("/careers/jobs")
    async def get_job_openings():
        """Get current job openings"""
        try:
            jobs = await db.job_openings.find({'active': True}).to_list(length=None)
            
            # Convert ObjectId to string for JSON serialization
            for job in jobs:
                if '_id' in job:
                    job['_id'] = str(job['_id'])
            
            return {
                'jobs': jobs,
                'total_positions': len(jobs),
                'hiring_status': 'actively_hiring' if len(jobs) > 0 else 'not_hiring'
            }
            
        except Exception as e:
            logger.error(f"Get job openings error: {e}")
            return {'jobs': [], 'total_positions': 0, 'hiring_status': 'not_hiring'}
    
    @router.post("/careers/apply")
    async def submit_job_application(
        application_request: Dict[str, Any],
        background_tasks: BackgroundTasks
    ):
        """Submit job application"""
        try:
            # Validate required fields
            required_fields = ['name', 'email', 'phone', 'position', 'experience_years', 'cover_letter', 'why_laundrotech']
            for field in required_fields:
                if not application_request.get(field):
                    raise HTTPException(status_code=400, detail=f"Field '{field}' is required")
            
            # Store job application in database
            job_application = {
                'id': str(uuid.uuid4()),
                'job_id': application_request.get('job_id'),
                'name': application_request['name'],
                'email': application_request['email'],  
                'phone': application_request['phone'],
                'linkedin': application_request.get('linkedin', ''),
                'portfolio': application_request.get('portfolio', ''),
                'position': application_request['position'],
                'experience_years': application_request['experience_years'],
                'salary_expectation': application_request.get('salary_expectation', ''),
                'start_date': application_request.get('start_date', ''),
                'cover_letter': application_request['cover_letter'],
                'why_laundrotech': application_request['why_laundrotech'],
                'remote_preference': application_request.get('remote_preference', 'hybrid'),
                'submitted_at': datetime.now(timezone.utc),
                'status': 'submitted',
                'reviewed': False
            }
            
            await db.job_applications.insert_one(job_application)
            
            # Send email notification to Nick
            background_tasks.add_task(
                send_application_notification,
                job_application
            )
            
            return {
                'success': True,
                'message': 'Application submitted successfully',
                'application_id': job_application['id']
            }
            
        except Exception as e:
            logger.error(f"Job application submission error: {e}")
            raise HTTPException(status_code=500, detail="Failed to submit job application")
    
    @router.get("/careers/blog")
    async def get_career_blog_posts():
        """Get career and company blog posts"""
        try:
            posts = await db.blog_posts.find({
                'category': {'$in': ['careers', 'company', 'updates']},
                'published': True
            }).sort('created_at', -1).limit(10).to_list(length=10)
            
            # Convert ObjectId to string for JSON serialization
            for post in posts:
                if '_id' in post:
                    post['_id'] = str(post['_id'])
            
            return {
                'posts': posts,
                'total_posts': len(posts)
            }
            
        except Exception as e:
            logger.error(f"Get blog posts error: {e}")
            return {'posts': [], 'total_posts': 0}
    
    @router.post("/blog/create")
    async def create_blog_post(
        blog_request: Dict[str, Any]
    ):
        """Create new blog post (admin only - basic implementation)"""
        try:
            # In production, this would require admin authentication
            blog_post = {
                'id': str(uuid.uuid4()),
                'title': blog_request['title'],
                'excerpt': blog_request.get('excerpt', ''),
                'content': blog_request['content'],
                'author': blog_request.get('author', 'LaundroTech Team'),
                'category': blog_request.get('category', 'company'),
                'tags': blog_request.get('tags', []),
                'published': blog_request.get('published', False),
                'created_at': datetime.now(timezone.utc),
                'updated_at': datetime.now(timezone.utc)
            }
            
            await db.blog_posts.insert_one(blog_post)
            
            return {
                'success': True,
                'message': 'Blog post created successfully',
                'post_id': blog_post['id']
            }
            
        except Exception as e:
            logger.error(f"Blog post creation error: {e}")
            raise HTTPException(status_code=500, detail="Failed to create blog post")
    
    @router.post("/partnership/submit")
    async def submit_partnership_inquiry(
        partnership_request: Dict[str, Any],
        background_tasks: BackgroundTasks
    ):
        """Submit partnership inquiry"""
        try:
            # Store partnership inquiry
            partnership_inquiry = {
                'id': str(uuid.uuid4()),
                'company_name': partnership_request.get('company_name', ''),
                'contact_name': partnership_request['name'],
                'email': partnership_request['email'],
                'phone': partnership_request.get('phone', ''),
                'partnership_type': partnership_request.get('partnership_type', 'general'),
                'description': partnership_request['description'],
                'revenue_potential': partnership_request.get('revenue_potential', ''),
                'timeline': partnership_request.get('timeline', ''),
                'submitted_at': datetime.now(timezone.utc),
                'status': 'new'
            }
            
            await db.partnership_inquiries.insert_one(partnership_inquiry)
            
            # Send email notification to Nick
            background_tasks.add_task(
                send_partnership_notification,
                partnership_inquiry
            )
            
            return {
                'success': True,
                'message': 'Partnership inquiry submitted successfully',
                'inquiry_id': partnership_inquiry['id']
            }
            
        except Exception as e:
            logger.error(f"Partnership inquiry submission error: {e}")
            raise HTTPException(status_code=500, detail="Failed to submit partnership inquiry")
    
    @router.post("/support/ticket")
    async def create_support_ticket(
        support_request: Dict[str, Any],
        background_tasks: BackgroundTasks
    ):
        """Create support ticket"""
        try:
            # Store support ticket
            support_ticket = {
                'id': str(uuid.uuid4()),
                'ticket_number': f"LT-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:6].upper()}",
                'user_email': support_request['email'],
                'user_name': support_request.get('name', ''),
                'subject': support_request['subject'],
                'description': support_request['description'],
                'priority': support_request.get('priority', 'medium'),
                'category': support_request.get('category', 'technical'),
                'status': 'open',
                'created_at': datetime.now(timezone.utc),
                'updated_at': datetime.now(timezone.utc)
            }
            
            await db.support_tickets.insert_one(support_ticket)
            
            # Send email notification to Nick
            background_tasks.add_task(
                send_support_notification,
                support_ticket
            )
            
            return {
                'success': True,
                'message': 'Support ticket created successfully',
                'ticket_number': support_ticket['ticket_number'],
                'ticket_id': support_ticket['id']
            }
            
        except Exception as e:
            logger.error(f"Support ticket creation error: {e}")
            raise HTTPException(status_code=500, detail="Failed to create support ticket")
    
    return router

# Background task functions for email notifications
async def send_contact_notification(contact_data: Dict):
    """Send contact form notification email to Nick"""
    try:
        subject = f"New Contact Form Submission: {contact_data['subject']}"
        
        email_content = f"""
        New contact form submission from LaundroTech website:
        
        Name: {contact_data['name']}
        Email: {contact_data['email']}
        Phone: {contact_data.get('phone', 'Not provided')}
        Company: {contact_data.get('company', 'Not provided')}
        Inquiry Type: {contact_data['inquiry_type']}
        Preferred Contact: {contact_data['preferred_contact']}
        
        Subject: {contact_data['subject']}
        
        Message:
        {contact_data['message']}
        
        Submitted: {contact_data['submitted_at']}
        Submission ID: {contact_data['id']}
        """
        
        # Send email using existing email service
        await email_service.send_email(
            to_email="nick@laundrotech.xyz",
            subject=subject,
            content=email_content,
            email_type="contact_form"
        )
        
    except Exception as e:
        logger.error(f"Contact notification email error: {e}")

async def send_application_notification(application_data: Dict):
    """Send job application notification email to Nick"""
    try:
        subject = f"New Job Application: {application_data['position']} - {application_data['name']}"
        
        email_content = f"""
        New job application submitted:
        
        Position: {application_data['position']}
        Applicant: {application_data['name']}
        Email: {application_data['email']}
        Phone: {application_data['phone']}
        LinkedIn: {application_data.get('linkedin', 'Not provided')}
        Portfolio: {application_data.get('portfolio', 'Not provided')}
        
        Experience: {application_data['experience_years']}
        Salary Expectation: {application_data.get('salary_expectation', 'Not provided')}
        Remote Preference: {application_data['remote_preference']}
        
        Cover Letter:
        {application_data['cover_letter']}
        
        Why LaundroTech:
        {application_data['why_laundrotech']}
        
        Submitted: {application_data['submitted_at']}
        Application ID: {application_data['id']}
        """
        
        await email_service.send_email(
            to_email="nick@laundrotech.xyz",
            subject=subject,
            content=email_content,
            email_type="job_application"
        )
        
    except Exception as e:
        logger.error(f"Application notification email error: {e}")

async def send_partnership_notification(partnership_data: Dict):
    """Send partnership inquiry notification email to Nick"""
    try:
        subject = f"Partnership Inquiry: {partnership_data.get('company_name', partnership_data['contact_name'])}"
        
        email_content = f"""
        New partnership inquiry:
        
        Company: {partnership_data.get('company_name', 'Not provided')}
        Contact: {partnership_data['contact_name']}
        Email: {partnership_data['email']}
        Phone: {partnership_data.get('phone', 'Not provided')}
        Partnership Type: {partnership_data['partnership_type']}
        
        Description:
        {partnership_data['description']}
        
        Revenue Potential: {partnership_data.get('revenue_potential', 'Not provided')}
        Timeline: {partnership_data.get('timeline', 'Not provided')}
        
        Submitted: {partnership_data['submitted_at']}
        Inquiry ID: {partnership_data['id']}
        """
        
        await email_service.send_email(
            to_email="nick@laundrotech.xyz",
            subject=subject,
            content=email_content,
            email_type="partnership_inquiry"
        )
        
    except Exception as e:
        logger.error(f"Partnership notification email error: {e}")

async def send_support_notification(support_data: Dict):
    """Send support ticket notification email to Nick"""
    try:
        subject = f"Support Ticket #{support_data['ticket_number']}: {support_data['subject']}"
        
        email_content = f"""
        New support ticket created:
        
        Ticket #: {support_data['ticket_number']}
        User: {support_data.get('user_name', 'Not provided')}
        Email: {support_data['user_email']}
        Priority: {support_data['priority']}
        Category: {support_data['category']}
        
        Subject: {support_data['subject']}
        
        Description:
        {support_data['description']}
        
        Created: {support_data['created_at']}
        Ticket ID: {support_data['id']}
        """
        
        await email_service.send_email(
            to_email="nick@laundrotech.xyz",
            subject=subject,
            content=email_content,
            email_type="support_ticket"
        )
        
    except Exception as e:
        logger.error(f"Support notification email error: {e}")

# Create the business router
business_router = create_business_router()