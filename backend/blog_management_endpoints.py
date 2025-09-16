"""
Blog Management System with SEO Optimization
Professional blog creation and management for LaundroTech platform
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

class BlogPostCreate(BaseModel):
    title: str = Field(..., description="Blog post title")
    content: str = Field(..., description="Blog post content (HTML/Markdown)")
    excerpt: str = Field(..., description="Blog post excerpt")
    category: str = Field(..., description="Blog category")
    tags: List[str] = Field(default_factory=list, description="Blog tags")
    featured_image: Optional[str] = Field(None, description="Featured image URL")
    seo_title: Optional[str] = Field(None, description="SEO optimized title")
    meta_description: Optional[str] = Field(None, description="Meta description for SEO")
    focus_keyphrase: str = Field(..., description="Primary SEO keyphrase")
    schema_markup: Optional[Dict[str, Any]] = Field(None, description="Structured data markup")
    status: str = Field(default="draft", description="Post status: draft, published, scheduled")
    scheduled_date: Optional[datetime] = Field(None, description="Scheduled publication date")

class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    featured_image: Optional[str] = None
    seo_title: Optional[str] = None
    meta_description: Optional[str] = None
    focus_keyphrase: Optional[str] = None
    schema_markup: Optional[Dict[str, Any]] = None
    status: Optional[str] = None
    scheduled_date: Optional[datetime] = None

class BlogPost(BaseModel):
    id: str
    title: str
    content: str
    excerpt: str
    category: str
    tags: List[str]
    featured_image: Optional[str]
    seo_title: Optional[str]
    meta_description: Optional[str]
    focus_keyphrase: str
    slug: str
    schema_markup: Optional[Dict[str, Any]]
    status: str
    views: int
    likes: int
    shares: int
    author_id: str
    author_name: str
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime]
    scheduled_date: Optional[datetime]
    seo_score: float
    readability_score: float

def create_blog_router():
    router = APIRouter(prefix="/blog", tags=["Blog Management"])

    def generate_slug(title: str) -> str:
        """Generate SEO-friendly slug from title"""
        slug = re.sub(r'[^\w\s-]', '', title.lower())
        slug = re.sub(r'[-\s]+', '-', slug)
        return slug.strip('-')

    def calculate_seo_score(post_data: dict) -> float:
        """Calculate SEO score based on various factors"""
        score = 0.0
        max_score = 100.0
        
        # Title optimization (20 points)
        title = post_data.get('title', '')
        focus_keyphrase = post_data.get('focus_keyphrase', '')
        
        if focus_keyphrase.lower() in title.lower():
            score += 20
        elif any(word in title.lower() for word in focus_keyphrase.lower().split()):
            score += 10
        
        # Meta description (15 points)
        meta_desc = post_data.get('meta_description', '')
        if meta_desc:
            if 120 <= len(meta_desc) <= 160:
                score += 15
            elif 80 <= len(meta_desc) <= 200:
                score += 10
            else:
                score += 5
        
        # Content length (15 points)
        content = post_data.get('content', '')
        content_length = len(content.replace('<', ' <').split())
        if content_length >= 1500:
            score += 15
        elif content_length >= 1000:
            score += 10
        elif content_length >= 500:
            score += 5
        
        # Focus keyphrase in content (20 points)
        if focus_keyphrase.lower() in content.lower():
            keyphrase_count = content.lower().count(focus_keyphrase.lower())
            content_word_count = len(content.split())
            density = (keyphrase_count / content_word_count) * 100
            
            if 0.5 <= density <= 2.5:  # Optimal density
                score += 20
            elif 0.1 <= density <= 4.0:  # Acceptable density
                score += 15
            else:
                score += 5
        
        # Excerpt optimization (10 points)
        excerpt = post_data.get('excerpt', '')
        if excerpt and focus_keyphrase.lower() in excerpt.lower():
            score += 10
        elif excerpt:
            score += 5
        
        # Featured image (10 points)
        if post_data.get('featured_image'):
            score += 10
        
        # Tags optimization (10 points)
        tags = post_data.get('tags', [])
        if tags:
            if any(focus_keyphrase.lower() in tag.lower() for tag in tags):
                score += 10
            else:
                score += 5
        
        return min(score, max_score)

    def calculate_readability_score(content: str) -> float:
        """Calculate readability score using simplified metrics"""
        if not content:
            return 0.0
        
        # Remove HTML tags for analysis
        clean_content = re.sub(r'<[^>]+>', '', content)
        
        sentences = len(re.findall(r'[.!?]+', clean_content))
        words = len(clean_content.split())
        
        if sentences == 0 or words == 0:
            return 0.0
        
        # Average words per sentence
        avg_words_per_sentence = words / sentences
        
        # Simplified readability score (inverse of complexity)
        if avg_words_per_sentence <= 15:
            return 90.0  # Very easy
        elif avg_words_per_sentence <= 20:
            return 80.0  # Easy
        elif avg_words_per_sentence <= 25:
            return 70.0  # Fair
        elif avg_words_per_sentence <= 30:
            return 60.0  # Difficult
        else:
            return 50.0  # Very difficult

    def generate_schema_markup(post_data: dict) -> dict:
        """Generate JSON-LD schema markup for blog post"""
        return {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post_data.get('seo_title') or post_data.get('title'),
            "description": post_data.get('meta_description') or post_data.get('excerpt'),
            "image": post_data.get('featured_image'),
            "author": {
                "@type": "Person",
                "name": post_data.get('author_name', 'LaundroTech Team')
            },
            "publisher": {
                "@type": "Organization",
                "name": "LaundroTech",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://laundrotech.com/logo.png"
                }
            },
            "datePublished": post_data.get('published_at', post_data.get('created_at')),
            "dateModified": post_data.get('updated_at'),
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": f"https://laundrotech.com/blog/{post_data.get('slug')}"
            }
        }

    @router.post("/create", response_model=BlogPost)
    async def create_blog_post(post_data: BlogPostCreate):
        """Create a new SEO-optimized blog post"""
        try:
            # Generate unique ID and slug
            post_id = str(uuid.uuid4())
            slug = generate_slug(post_data.title)
            
            # Check if slug already exists
            existing_post = await db.blog_posts.find_one({"slug": slug})
            if existing_post:
                slug = f"{slug}-{str(uuid.uuid4())[:8]}"
            
            # Prepare post data
            post_dict = post_data.dict()
            post_dict.update({
                "id": post_id,
                "slug": slug,
                "author_id": "admin",  # TODO: Get from current user
                "author_name": "LaundroTech Team",
                "views": 0,
                "likes": 0,
                "shares": 0,
                "created_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc),
                "published_at": datetime.now(timezone.utc) if post_data.status == "published" else None
            })
            
            # Calculate SEO and readability scores
            post_dict["seo_score"] = calculate_seo_score(post_dict)
            post_dict["readability_score"] = calculate_readability_score(post_data.content)
            
            # Generate schema markup if not provided
            if not post_dict.get("schema_markup"):
                post_dict["schema_markup"] = generate_schema_markup(post_dict)
            
            # Auto-generate SEO fields if not provided
            if not post_dict.get("seo_title"):
                post_dict["seo_title"] = f"{post_data.title} | LaundroTech Intelligence"
            
            if not post_dict.get("meta_description"):
                # Create meta description from excerpt or content
                desc_text = post_data.excerpt or post_data.content[:160]
                post_dict["meta_description"] = re.sub(r'<[^>]+>', '', desc_text)[:160]
            
            # Save to database
            await db.blog_posts.insert_one(post_dict)
            
            logger.info(f"Blog post created: {post_id} with SEO score: {post_dict['seo_score']}")
            return BlogPost(**post_dict)
            
        except Exception as e:
            logger.error(f"Error creating blog post: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to create blog post: {str(e)}")

    @router.get("/posts", response_model=List[BlogPost])
    async def get_blog_posts(
        status: str = Query("published", description="Filter by status"),
        category: Optional[str] = Query(None, description="Filter by category"),
        limit: int = Query(20, description="Number of posts to return"),
        skip: int = Query(0, description="Number of posts to skip")
    ):
        """Get blog posts with SEO data"""
        try:
            query = {}
            if status != "all":
                query["status"] = status
            if category:
                query["category"] = category
            
            posts = await db.blog_posts.find(query).sort("created_at", -1).skip(skip).limit(limit).to_list(None)
            
            # Remove MongoDB _id field
            for post in posts:
                if '_id' in post:
                    del post['_id']
            
            return [BlogPost(**post) for post in posts]
            
        except Exception as e:
            logger.error(f"Error fetching blog posts: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to fetch blog posts: {str(e)}")

    @router.get("/posts/{post_id}", response_model=BlogPost)
    async def get_blog_post(post_id: str):
        """Get a specific blog post by ID"""
        try:
            post = await db.blog_posts.find_one({"id": post_id})
            if not post:
                raise HTTPException(status_code=404, detail="Blog post not found")
            
            # Increment view count
            await db.blog_posts.update_one(
                {"id": post_id},
                {"$inc": {"views": 1}}
            )
            
            if '_id' in post:
                del post['_id']
            
            return BlogPost(**post)
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error fetching blog post {post_id}: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to fetch blog post: {str(e)}")

    @router.put("/posts/{post_id}", response_model=BlogPost)
    async def update_blog_post(post_id: str, update_data: BlogPostUpdate):
        """Update a blog post with SEO optimization"""
        try:
            existing_post = await db.blog_posts.find_one({"id": post_id})
            if not existing_post:
                raise HTTPException(status_code=404, detail="Blog post not found")
            
            # Prepare update data
            update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
            update_dict["updated_at"] = datetime.now(timezone.utc)
            
            # Update slug if title changed
            if "title" in update_dict:
                new_slug = generate_slug(update_dict["title"])
                # Check if new slug conflicts
                slug_conflict = await db.blog_posts.find_one({"slug": new_slug, "id": {"$ne": post_id}})
                if slug_conflict:
                    new_slug = f"{new_slug}-{str(uuid.uuid4())[:8]}"
                update_dict["slug"] = new_slug
            
            # Recalculate SEO score if relevant fields changed
            seo_fields = ['title', 'content', 'meta_description', 'focus_keyphrase', 'excerpt', 'tags']
            if any(field in update_dict for field in seo_fields):
                # Merge existing data with updates for score calculation
                merged_data = {**existing_post, **update_dict}
                update_dict["seo_score"] = calculate_seo_score(merged_data)
                
                if "content" in update_dict:
                    update_dict["readability_score"] = calculate_readability_score(update_dict["content"])
            
            # Update published_at if status changed to published
            if update_dict.get("status") == "published" and existing_post.get("status") != "published":
                update_dict["published_at"] = datetime.now(timezone.utc)
            
            # Update database
            await db.blog_posts.update_one(
                {"id": post_id},
                {"$set": update_dict}
            )
            
            # Get updated post
            updated_post = await db.blog_posts.find_one({"id": post_id})
            if '_id' in updated_post:
                del updated_post['_id']
            
            logger.info(f"Blog post updated: {post_id}")
            return BlogPost(**updated_post)
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error updating blog post {post_id}: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to update blog post: {str(e)}")

    @router.delete("/posts/{post_id}")
    async def delete_blog_post(post_id: str):
        """Delete a blog post"""
        try:
            result = await db.blog_posts.delete_one({"id": post_id})
            if result.deleted_count == 0:
                raise HTTPException(status_code=404, detail="Blog post not found")
            
            logger.info(f"Blog post deleted: {post_id}")
            return {"success": True, "message": "Blog post deleted successfully"}
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error deleting blog post {post_id}: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to delete blog post: {str(e)}")

    @router.get("/seo-analysis/{post_id}")
    async def get_seo_analysis(post_id: str):
        """Get detailed SEO analysis for a blog post"""
        try:
            post = await db.blog_posts.find_one({"id": post_id})
            if not post:
                raise HTTPException(status_code=404, detail="Blog post not found")
            
            analysis = {
                "overall_score": post.get("seo_score", 0),
                "readability_score": post.get("readability_score", 0),
                "recommendations": [],
                "technical_seo": {
                    "title_length": len(post.get("title", "")),
                    "meta_description_length": len(post.get("meta_description", "")),
                    "content_word_count": len(post.get("content", "").split()),
                    "focus_keyphrase_density": 0,
                    "schema_markup_present": bool(post.get("schema_markup"))
                }
            }
            
            # Generate specific recommendations
            if analysis["technical_seo"]["title_length"] > 60:
                analysis["recommendations"].append("Title is too long. Keep it under 60 characters for better SEO.")
            
            if analysis["technical_seo"]["meta_description_length"] < 120:
                analysis["recommendations"].append("Meta description is too short. Aim for 120-160 characters.")
            elif analysis["technical_seo"]["meta_description_length"] > 160:
                analysis["recommendations"].append("Meta description is too long. Keep it under 160 characters.")
            
            if analysis["technical_seo"]["content_word_count"] < 1000:
                analysis["recommendations"].append("Content is too short. Aim for at least 1000 words for better ranking.")
            
            return analysis
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error analyzing blog post SEO {post_id}: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to analyze blog post SEO: {str(e)}")

    return router