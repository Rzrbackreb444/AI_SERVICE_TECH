from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, Request, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from dotenv import load_dotenv
from pathlib import Path
import os
import logging
import uuid
import jwt
import hashlib
import httpx
import googlemaps
import redis
import json
import asyncio
from sklearn.ensemble import RandomForestRegressor
import numpy as np
import pandas as pd
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest
from email_service import email_service

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Redis connection
redis_client = redis.from_url(os.environ.get('REDIS_URL', 'redis://localhost:6379'))

# Google Maps client
gmaps = googlemaps.Client(key=os.environ['GOOGLE_MAPS_API_KEY'])

# Stripe setup
stripe_api_key = os.environ.get('STRIPE_API_KEY')

# FastAPI app setup
app = FastAPI(
    title="SiteAtlas - LaundroTech Intelligence Platform",
    description="LaundroTech Powered By SiteAtlas - The Complete Location Intelligence Platform",
    version="2.0.0"
)

# API Router
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()
JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALGORITHM = "HS256"

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Pricing Configuration
PRICING_TIERS = {
    "scout": {"name": "Location Scout", "price": 0.0, "type": "free"},
    "analyzer": {"name": "Location Analyzer", "price": 99.0, "type": "one_time"},
    "intelligence": {"name": "Location Intelligence", "price": 249.0, "type": "one_time"},
    "optimization": {"name": "SiteAtlas Optimization", "price": 499.0, "type": "one_time"},
    "portfolio": {"name": "SiteAtlas Portfolio", "price": 999.0, "type": "one_time"},
    "watch_pro": {"name": "SiteAtlas Watch Pro", "price": 199.0, "type": "subscription", "billing": "monthly"}
}

# Pydantic Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    full_name: str
    subscription_tier: str = "free"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    facebook_group_member: bool = False

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    facebook_group_member: bool = False

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class LocationRequest(BaseModel):
    address: str
    analysis_type: str
    additional_data: Optional[Dict[str, Any]] = {}

class LocationAnalysis(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    address: str
    analysis_type: str
    grade: str
    score: float
    demographics: Dict[str, Any]
    competitors: List[Dict[str, Any]]
    roi_estimate: Dict[str, Any]
    recommendations: List[str]
    hybrid_opportunities: Optional[Dict[str, Any]] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class PaymentTransaction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    session_id: str
    payment_provider: str  # "stripe" or "paypal"
    tier: str
    amount: float
    currency: str = "usd"
    paypal_discount: bool = False
    payment_status: str = "pending"
    metadata: Dict[str, Any]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class CheckoutRequest(BaseModel):
    tier: str
    payment_method: str = "stripe"  # "stripe" or "paypal"
    success_url: Optional[str] = None
    cancel_url: Optional[str] = None

class MonitoringAlert(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    location_id: str
    alert_type: str
    message: str
    severity: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Authentication functions
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hashlib.sha256(plain_password.encode()).hexdigest() == hashed_password

def get_password_hash(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    user = await db.users.find_one({"id": user_id})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return User(**user)

# Payment Services
class PaymentService:
    def __init__(self):
        self.stripe_checkout = None
        if stripe_api_key:
            self.stripe_checkout = StripeCheckout(
                api_key=stripe_api_key,
                webhook_url=""  # Will be set per request
            )
    
    async def create_stripe_checkout(self, user: User, tier: str, host_url: str) -> Dict[str, Any]:
        """Create Stripe checkout session"""
        if not self.stripe_checkout:
            raise HTTPException(status_code=500, detail="Stripe not configured")
        
        tier_config = PRICING_TIERS.get(tier)
        if not tier_config:
            raise HTTPException(status_code=400, detail="Invalid tier")
        
        if tier_config["price"] == 0:
            raise HTTPException(status_code=400, detail="Cannot create payment for free tier")
        
        # Set webhook URL
        webhook_url = f"{host_url}/api/webhook/stripe"
        self.stripe_checkout.webhook_url = webhook_url
        
        # Create checkout session
        success_url = f"{host_url}/payment/success?session_id={{CHECKOUT_SESSION_ID}}"
        cancel_url = f"{host_url}/payment/cancel"
        
        metadata = {
            "user_id": user.id,
            "tier": tier,
            "facebook_member": str(user.facebook_group_member)
        }
        
        checkout_request = CheckoutSessionRequest(
            amount=tier_config["price"],
            currency="usd",
            success_url=success_url,
            cancel_url=cancel_url,
            metadata=metadata
        )
        
        session = await self.stripe_checkout.create_checkout_session(checkout_request)
        
        # Create payment transaction record
        transaction = PaymentTransaction(
            user_id=user.id,
            session_id=session.session_id,
            payment_provider="stripe",
            tier=tier,
            amount=tier_config["price"],
            currency="usd",
            paypal_discount=False,
            payment_status="pending",
            metadata=metadata
        )
        
        await db.payment_transactions.insert_one(transaction.dict())
        
        return {
            "checkout_url": session.url,
            "session_id": session.session_id,
            "amount": tier_config["price"]
        }
    
    async def create_paypal_checkout(self, user: User, tier: str, host_url: str) -> Dict[str, Any]:
        """Create PayPal checkout with 5% discount"""
        tier_config = PRICING_TIERS.get(tier)
        if not tier_config:
            raise HTTPException(status_code=400, detail="Invalid tier")
        
        if tier_config["price"] == 0:
            raise HTTPException(status_code=400, detail="Cannot create payment for free tier")
        
        # Apply 5% PayPal discount
        original_price = tier_config["price"]
        discounted_price = original_price * 0.95
        
        # For now, return PayPal configuration (actual PayPal SDK integration would go here)
        transaction_id = str(uuid.uuid4())
        
        # Create payment transaction record
        transaction = PaymentTransaction(
            user_id=user.id,
            session_id=transaction_id,
            payment_provider="paypal",
            tier=tier,
            amount=discounted_price,
            currency="usd",
            paypal_discount=True,
            payment_status="pending",
            metadata={
                "user_id": user.id,
                "tier": tier,
                "original_price": original_price,
                "discount_applied": original_price - discounted_price,
                "facebook_member": str(user.facebook_group_member)
            }
        )
        
        await db.payment_transactions.insert_one(transaction.dict())
        
        return {
            "transaction_id": transaction_id,
            "amount": discounted_price,
            "original_price": original_price,
            "discount": original_price - discounted_price,
            "paypal_config": {
                "currency": "USD",
                "intent": "CAPTURE"
            }
        }
    
    async def upgrade_user_tier(self, user_id: str, tier: str):
        """Upgrade user's subscription tier"""
        await db.users.update_one(
            {"id": user_id},
            {"$set": {"subscription_tier": tier}}
        )

# Initialize payment service
payment_service = PaymentService()

# API Integration Services (existing code continues...)
class DataIntegrationService:
    def __init__(self):
        self.google_maps_key = os.environ['GOOGLE_MAPS_API_KEY']
        self.attom_key = os.environ['ATTOM_API_KEY']
        self.census_key = os.environ['CENSUS_API_KEY']
        self.mapbox_token = os.environ['MAPBOX_TOKEN']
    
    async def get_census_data(self, lat: float, lng: float) -> Dict[str, Any]:
        """Get census demographic data for location"""
        try:
            async with httpx.AsyncClient() as client:
                # Get census tract for coordinates
                tract_url = f"https://geocoding.geo.census.gov/geocoder/geographies/coordinates"
                params = {
                    'x': lng,
                    'y': lat,
                    'benchmark': 'Public_AR_Current',
                    'vintage': 'Current_Current',
                    'format': 'json'
                }
                response = await client.get(tract_url, params=params)
                tract_data = response.json()
                
                # Extract census tract info
                tract_info = tract_data['result']['geographies']['Census Tracts'][0]
                state = tract_info['STATE']
                county = tract_info['COUNTY']
                tract = tract_info['TRACT']
                
                # Get demographic data
                demo_url = f"https://api.census.gov/data/2021/acs/acs5"
                demo_params = {
                    'get': 'NAME,B01003_001E,B19013_001E,B25003_002E,B25003_003E,B08303_001E',
                    'for': f'tract:{tract}',
                    'in': f'state:{state} county:{county}',
                    'key': self.census_key
                }
                demo_response = await client.get(demo_url, params=demo_params)
                demo_data = demo_response.json()
                
                if len(demo_data) > 1:
                    data = demo_data[1]  # Skip header row
                    return {
                        'population': int(data[1]) if data[1] and data[1] != '-666666666' else 0,
                        'median_income': int(data[2]) if data[2] and data[2] != '-666666666' else 0,
                        'owner_occupied_housing': int(data[3]) if data[3] and data[3] != '-666666666' else 0,
                        'renter_occupied_housing': int(data[4]) if data[4] and data[4] != '-666666666' else 0,
                        'total_housing': int(data[5]) if data[5] and data[5] != '-666666666' else 0,
                        'location': f"{lat},{lng}"
                    }
                return {}
        except Exception as e:
            logger.error(f"Census API error: {e}")
            return {}

    async def get_google_places_data(self, lat: float, lng: float, radius: int = 1600) -> List[Dict[str, Any]]:
        """Get competitor laundromats from Google Places"""
        try:
            # Search for laundromats
            places_result = gmaps.places_nearby(
                location=(lat, lng),
                radius=radius,
                type='laundry'
            )
            
            competitors = []
            for place in places_result.get('results', []):
                competitor = {
                    'name': place.get('name', 'Unknown'),
                    'rating': place.get('rating', 0),
                    'price_level': place.get('price_level', 0),
                    'user_ratings_total': place.get('user_ratings_total', 0),
                    'vicinity': place.get('vicinity', ''),
                    'place_id': place.get('place_id', ''),
                    'location': place.get('geometry', {}).get('location', {}),
                    'business_status': place.get('business_status', 'UNKNOWN')
                }
                competitors.append(competitor)
            
            return competitors
        except Exception as e:
            logger.error(f"Google Places API error: {e}")
            return []

    async def get_attom_property_data(self, address: str) -> Dict[str, Any]:
        """Get property data from ATTOM Data API"""
        try:
            async with httpx.AsyncClient() as client:
                headers = {
                    'apikey': self.attom_key,
                    'Accept': 'application/json'
                }
                
                # Property details endpoint
                url = "https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/detail"
                params = {
                    'address1': address,
                    'format': 'json'
                }
                
                response = await client.get(url, headers=headers, params=params)
                if response.status_code == 200:
                    data = response.json()
                    if 'property' in data and len(data['property']) > 0:
                        prop = data['property'][0]
                        return {
                            'estimated_value': prop.get('assessment', {}).get('assessed', {}).get('assdttlvalue', 0),
                            'property_type': prop.get('summary', {}).get('proptype', 'Unknown'),
                            'year_built': prop.get('summary', {}).get('yearbuilt', 0),
                            'lot_size': prop.get('lot', {}).get('lotsize1', 0),
                            'building_size': prop.get('building', {}).get('size', {}).get('bldgsize', 0)
                        }
                return {}
        except Exception as e:
            logger.error(f"ATTOM API error: {e}")
            return {}

# ML Analysis Service (existing code continues with SiteAtlas branding...)
class LocationAnalysisEngine:
    def __init__(self):
        self.data_service = DataIntegrationService()
        # Initialize ML model (in production, this would be pre-trained)
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self._train_dummy_model()
    
    def _train_dummy_model(self):
        """Train a dummy model with sample data for demonstration"""
        # In production, this would use historical data
        X_dummy = np.random.rand(1000, 10)  # 10 features
        y_dummy = np.random.rand(1000) * 100  # Revenue scores 0-100
        self.model.fit(X_dummy, y_dummy)
    
    async def analyze_location(self, address: str, analysis_type: str) -> LocationAnalysis:
        """Comprehensive location analysis powered by SiteAtlas"""
        try:
            # Geocode address
            geocode_result = gmaps.geocode(address)
            if not geocode_result:
                raise HTTPException(status_code=400, detail="Address not found")
            
            location = geocode_result[0]['geometry']['location']
            lat, lng = location['lat'], location['lng']
            
            # Gather data based on analysis type
            census_data = await self.data_service.get_census_data(lat, lng)
            competitors = await self.data_service.get_google_places_data(lat, lng)
            
            # Enhanced data for premium tiers
            property_data = {}
            if analysis_type in ['intelligence', 'optimization', 'portfolio']:
                property_data = await self.data_service.get_attom_property_data(address)
            
            # Calculate location score using ML model
            features = self._extract_features(census_data, competitors, property_data)
            score = self.model.predict([features])[0]
            grade = self._score_to_grade(score)
            
            # Generate tier-specific recommendations
            recommendations = self._generate_recommendations(analysis_type, census_data, competitors, score)
            
            # ROI estimation
            roi_estimate = self._calculate_roi(analysis_type, census_data, competitors, score)
            
            # Hybrid business opportunities (for premium tiers)
            hybrid_opportunities = None
            if analysis_type in ['optimization', 'portfolio']:
                hybrid_opportunities = self._analyze_hybrid_opportunities(census_data, competitors)
            
            return LocationAnalysis(
                user_id="",  # Will be set by endpoint
                address=address,
                analysis_type=analysis_type,
                grade=grade,
                score=score,
                demographics=census_data,
                competitors=competitors,
                roi_estimate=roi_estimate,
                recommendations=recommendations,
                hybrid_opportunities=hybrid_opportunities
            )
            
        except Exception as e:
            logger.error(f"Location analysis error: {e}")
            raise HTTPException(status_code=500, detail="Analysis failed")
    
    def _extract_features(self, census_data: Dict, competitors: List, property_data: Dict) -> List[float]:
        """Extract ML features from location data"""
        features = [
            census_data.get('population', 0) / 10000,  # Normalized population
            census_data.get('median_income', 0) / 100000,  # Normalized income
            len(competitors),  # Competitor count
            sum([c.get('rating', 0) for c in competitors]) / max(len(competitors), 1),  # Avg competitor rating
            census_data.get('renter_occupied_housing', 0) / max(census_data.get('total_housing', 1), 1),  # Renter ratio
            property_data.get('estimated_value', 0) / 1000000,  # Property value
            property_data.get('lot_size', 0) / 10000,  # Lot size
            1.0 if any('24' in c.get('name', '').lower() for c in competitors) else 0.0,  # 24hr competition
            len([c for c in competitors if c.get('rating', 0) > 4.0]),  # High-rated competitors
            census_data.get('population', 0) / max(len(competitors), 1)  # Population per competitor
        ]
        return features
    
    def _score_to_grade(self, score: float) -> str:
        """Convert numerical score to letter grade"""
        if score >= 90: return "A+"
        elif score >= 85: return "A"
        elif score >= 80: return "A-"
        elif score >= 75: return "B+"
        elif score >= 70: return "B"
        elif score >= 65: return "B-"
        elif score >= 60: return "C+"
        elif score >= 55: return "C"
        elif score >= 50: return "C-"
        elif score >= 45: return "D+"
        elif score >= 40: return "D"
        else: return "F"
    
    def _generate_recommendations(self, analysis_type: str, census_data: Dict, competitors: List, score: float) -> List[str]:
        """Generate tier-specific recommendations"""
        recommendations = []
        
        if analysis_type == "scout":
            recommendations = [
                "Upgrade to Location Analyzer for detailed SiteAtlas intelligence",
                "Consider competitor density in final decision",
                "Demographics suggest potential for success"
            ]
        elif analysis_type == "analyzer":
            if census_data.get('median_income', 0) > 75000:
                recommendations.append("High-income area ideal for premium services")
            if len(competitors) < 3:
                recommendations.append("Low competition creates opportunity")
            recommendations.append("Upgrade to Intelligence tier for competitive strategies")
        elif analysis_type in ["intelligence", "optimization", "portfolio"]:
            recommendations.extend([
                "Implement dynamic pricing based on demographic analysis",
                "Focus on renter population marketing campaigns",
                "Consider 24/7 operations if competitors don't offer",
                "Premium wash-fold services recommended for this market"
            ])
            
        return recommendations
    
    def _calculate_roi(self, analysis_type: str, census_data: Dict, competitors: List, score: float) -> Dict[str, Any]:
        """Calculate ROI estimates based on analysis type"""
        base_monthly = max(5000, census_data.get('population', 0) * 0.1 * (score / 10))
        
        roi = {
            "estimated_monthly_revenue": base_monthly,
            "confidence_level": "Medium" if analysis_type == "scout" else "High"
        }
        
        if analysis_type != "scout":
            roi.update({
                "estimated_startup_cost": 350000,
                "break_even_months": max(12, int(350000 / base_monthly)),
                "annual_roi_percentage": (base_monthly * 12 - 350000) / 350000 * 100 if base_monthly > 0 else 0
            })
            
        return roi
    
    def _analyze_hybrid_opportunities(self, census_data: Dict, competitors: List) -> Dict[str, Any]:
        """Analyze hybrid business opportunities"""
        return {
            "coffee_shop": {
                "viability": "High" if census_data.get('median_income', 0) > 60000 else "Medium",
                "estimated_additional_revenue": 2500,
                "synergy_score": 8.5
            },
            "car_wash": {
                "viability": "High",
                "estimated_additional_revenue": 4000,
                "synergy_score": 9.0
            },
            "barber_shop": {
                "viability": "Medium",
                "estimated_additional_revenue": 3000,
                "synergy_score": 7.0
            },
            "tattoo_studio": {
                "viability": "Medium" if census_data.get('median_income', 0) > 70000 else "Low",
                "estimated_additional_revenue": 5000,
                "synergy_score": 6.5
            }
        }

# Initialize analysis engine
analysis_engine = LocationAnalysisEngine()

# API Endpoints
@api_router.post("/auth/register")
async def register(user_data: UserCreate, background_tasks: BackgroundTasks):
    """Register new user"""
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        facebook_group_member=user_data.facebook_group_member
    )
    
    user_dict = user.dict()
    user_dict['password'] = hashed_password
    
    await db.users.insert_one(user_dict)
    
    # Send welcome email
    background_tasks.add_task(
        email_service.send_welcome_email,
        user.email,
        user.full_name,
        user.facebook_group_member
    )
    
    # Create access token
    access_token = create_access_token(data={"sub": user.id})
    
    return {"access_token": access_token, "token_type": "bearer", "user": user}

@api_router.post("/auth/login")
async def login(login_data: UserLogin):
    """User login"""
    user_doc = await db.users.find_one({"email": login_data.email})
    if not user_doc or not verify_password(login_data.password, user_doc['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user = User(**user_doc)
    access_token = create_access_token(data={"sub": user.id})
    
    return {"access_token": access_token, "token_type": "bearer", "user": user}

@api_router.get("/pricing")
async def get_pricing_tiers():
    """Get SiteAtlas pricing tiers"""
    return {
        "tiers": PRICING_TIERS,
        "paypal_discount": 0.05  # 5% discount for PayPal payments
    }

@api_router.post("/payments/checkout")
async def create_checkout(
    request: CheckoutRequest,
    http_request: Request,
    current_user: User = Depends(get_current_user)
):
    """Create payment checkout session"""
    host_url = str(http_request.base_url).rstrip('/')
    
    if request.payment_method == "paypal":
        return await payment_service.create_paypal_checkout(current_user, request.tier, host_url)
    else:
        return await payment_service.create_stripe_checkout(current_user, request.tier, host_url)

@api_router.get("/payments/status/{session_id}")
async def get_payment_status(session_id: str, current_user: User = Depends(get_current_user)):
    """Get payment status"""
    transaction = await db.payment_transactions.find_one({"session_id": session_id, "user_id": current_user.id})
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    if transaction["payment_provider"] == "stripe" and payment_service.stripe_checkout:
        try:
            status = await payment_service.stripe_checkout.get_checkout_status(session_id)
            
            # Update transaction status
            if status.payment_status == "paid" and transaction["payment_status"] != "completed":
                await db.payment_transactions.update_one(
                    {"session_id": session_id},
                    {"$set": {"payment_status": "completed", "updated_at": datetime.utcnow()}}
                )
                
                # Upgrade user tier
                await payment_service.upgrade_user_tier(current_user.id, transaction["tier"])
                
                return {"status": "completed", "tier": transaction["tier"]}
            
            return {"status": status.payment_status, "tier": transaction["tier"]}
        except Exception as e:
            logger.error(f"Error checking payment status: {e}")
            return {"status": "error", "message": "Failed to check payment status"}
    
    return {"status": transaction["payment_status"], "tier": transaction["tier"]}

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhooks"""
    if not payment_service.stripe_checkout:
        raise HTTPException(status_code=500, detail="Stripe not configured")
    
    body = await request.body()
    signature = request.headers.get("Stripe-Signature")
    
    try:
        webhook_response = await payment_service.stripe_checkout.handle_webhook(body, signature)
        
        if webhook_response.event_type == "checkout.session.completed":
            # Update transaction and upgrade user
            transaction = await db.payment_transactions.find_one({"session_id": webhook_response.session_id})
            if transaction and transaction["payment_status"] != "completed":
                await db.payment_transactions.update_one(
                    {"session_id": webhook_response.session_id},
                    {"$set": {"payment_status": "completed", "updated_at": datetime.utcnow()}}
                )
                
                # Upgrade user tier
                await payment_service.upgrade_user_tier(transaction["user_id"], transaction["tier"])
                
                # Send confirmation email
                user = await db.users.find_one({"id": transaction["user_id"]})
                if user:
                    await email_service.send_tier_upgrade_email(
                        user["email"], user["full_name"], transaction["tier"]
                    )
        
        return {"status": "success"}
    except Exception as e:
        logger.error(f"Webhook error: {e}")
        raise HTTPException(status_code=400, detail="Webhook processing failed")

@api_router.post("/analyze")
async def analyze_location(
    request: LocationRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user)
):
    """Analyze a location with SiteAtlas intelligence"""
    
    # Verify user has access to requested analysis type
    tier_access = {
        'free': ['scout'],
        'analyzer': ['scout', 'analyzer'],
        'intelligence': ['scout', 'analyzer', 'intelligence'],
        'optimization': ['scout', 'analyzer', 'intelligence', 'optimization'],
        'portfolio': ['scout', 'analyzer', 'intelligence', 'optimization', 'portfolio'],
        'watch_pro': ['scout', 'analyzer', 'intelligence', 'optimization', 'portfolio']
    }
    
    if request.analysis_type not in tier_access.get(current_user.subscription_tier, ['scout']):
        raise HTTPException(status_code=403, detail="Upgrade subscription to access this analysis type")
    
    # Perform analysis
    analysis = await analysis_engine.analyze_location(request.address, request.analysis_type)
    analysis.user_id = current_user.id
    
    # Save analysis to database
    analysis_dict = analysis.dict()
    await db.analyses.insert_one(analysis_dict)
    
    # Send analysis complete email
    background_tasks.add_task(
        email_service.send_analysis_complete_email,
        current_user.email,
        current_user.full_name,
        analysis_dict
    )
    
    return analysis

@api_router.get("/analyses")
async def get_user_analyses(current_user: User = Depends(get_current_user)):
    """Get user's previous analyses"""
    analyses = await db.analyses.find({"user_id": current_user.id}).sort("created_at", -1).to_list(50)
    return [LocationAnalysis(**analysis) for analysis in analyses]

@api_router.get("/dashboard/stats")
async def get_dashboard_stats(current_user: User = Depends(get_current_user)):
    """Get dashboard statistics"""
    total_analyses = await db.analyses.count_documents({"user_id": current_user.id})
    
    # Recent analyses
    recent_analyses = await db.analyses.find(
        {"user_id": current_user.id}
    ).sort("created_at", -1).limit(5).to_list(5)
    
    # Calculate average score
    avg_score = 0
    if recent_analyses:
        avg_score = sum([a['score'] for a in recent_analyses]) / len(recent_analyses)
    
    return {
        "total_analyses": total_analyses,
        "average_score": round(avg_score, 1),
        "subscription_tier": current_user.subscription_tier,
        "recent_analyses": [LocationAnalysis(**a) for a in recent_analyses]
    }

@api_router.get("/")
async def root():
    """API root endpoint"""
    return {
        "message": "SiteAtlas - LaundroTech Intelligence Platform API",
        "tagline": "LaundroTech Powered By SiteAtlas",
        "version": "2.0.0",
        "features": [
            "Location Intelligence Analysis",
            "6-Tier Subscription Model", 
            "Hybrid Business Analysis",
            "Real-time Market Monitoring",
            "AI-Powered Recommendations",
            "PayPal & Stripe Payments"
        ]
    }

# Include router in main app
app.include_router(api_router)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()