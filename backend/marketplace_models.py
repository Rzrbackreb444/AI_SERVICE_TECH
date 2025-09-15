"""
LaundroTech Marketplace - Enterprise Data Models
Professional marketplace platform for laundromat transactions
"""

from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from enum import Enum
from pydantic import BaseModel, validator, Field
from decimal import Decimal
import uuid

class ListingStatus(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    UNDER_CONTRACT = "under_contract"
    SOLD = "sold"
    EXPIRED = "expired"
    WITHDRAWN = "withdrawn"

class ListingType(str, Enum):
    BUSINESS_ONLY = "business_only"
    REAL_ESTATE_ONLY = "real_estate_only"
    BUSINESS_AND_REAL_ESTATE = "business_and_real_estate"
    EQUIPMENT_ONLY = "equipment_only"

class PropertyType(str, Enum):
    COIN_LAUNDRY = "coin_laundry"
    FULL_SERVICE = "full_service"  # wash/dry/fold
    HYBRID = "hybrid"  # coin + services
    COMMERCIAL_LAUNDRY = "commercial_laundry"  # B2B
    LAUNDROMAT_CHAIN = "laundromat_chain"

class TransactionType(str, Enum):
    CASH = "cash"
    FINANCING = "financing"
    OWNER_FINANCING = "owner_financing"
    LEASE_TO_OWN = "lease_to_own" 
    PARTNERSHIP = "partnership"

class UserRole(str, Enum):
    BUYER = "buyer"
    SELLER = "seller"
    BROKER = "broker"
    INVESTOR = "investor"
    ADMIN = "admin"

# Core Models
class Address(BaseModel):
    street: str
    city: str
    state: str
    zip_code: str
    county: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    
    @validator('zip_code')
    def validate_zip(cls, v):
        if len(v) not in [5, 10]:  # 12345 or 12345-6789
            raise ValueError('Invalid ZIP code format')
        return v

class Equipment(BaseModel):
    washers: List[Dict[str, Any]] = []  # brand, capacity, age, condition
    dryers: List[Dict[str, Any]] = []
    other_equipment: List[Dict[str, Any]] = []  # folders, carts, change machines
    total_machines: int = 0
    average_age: Optional[float] = None
    replacement_value: Optional[Decimal] = None
    
class Financials(BaseModel):
    asking_price: Decimal
    annual_revenue: Optional[Decimal] = None
    monthly_revenue: Optional[Decimal] = None
    annual_expenses: Optional[Decimal] = None
    net_income: Optional[Decimal] = None
    cash_flow: Optional[Decimal] = None
    ebitda: Optional[Decimal] = None
    
    # Transaction details
    down_payment_required: Optional[Decimal] = None
    financing_available: bool = False
    owner_financing_terms: Optional[str] = None
    
    # Property specifics
    monthly_rent: Optional[Decimal] = None
    lease_years_remaining: Optional[int] = None
    property_taxes: Optional[Decimal] = None
    utilities_cost: Optional[Decimal] = None

class MarketAnalysis(BaseModel):
    """AI-generated market intelligence for each listing"""
    market_score: Optional[int] = Field(None, ge=1, le=100)
    competition_density: Optional[str] = None  # low, medium, high
    demographic_score: Optional[int] = Field(None, ge=1, le=100)
    growth_potential: Optional[str] = None  # poor, fair, good, excellent
    risk_factors: List[str] = []
    opportunities: List[str] = []
    comparable_sales: List[Dict[str, Any]] = []
    
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    phone: Optional[str] = None
    role: UserRole
    verified: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    # Profile information
    investment_experience: Optional[str] = None  # beginner, intermediate, expert
    investment_capacity: Optional[str] = None  # <500k, 500k-1M, 1M+
    preferred_markets: List[str] = []
    
    # Broker-specific fields
    license_number: Optional[str] = None
    brokerage_name: Optional[str] = None
    commission_rate: Optional[float] = None

class Listing(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    listing_type: ListingType
    property_type: PropertyType
    status: ListingStatus = ListingStatus.DRAFT
    
    # Location
    address: Address
    
    # Financial details
    financials: Financials
    
    # Physical details
    square_footage: Optional[int] = None
    equipment: Equipment
    parking_spaces: Optional[int] = None
    
    # Business details
    years_established: Optional[int] = None
    hours_of_operation: Optional[str] = None
    employee_count: Optional[int] = None
    customer_demographics: Optional[Dict[str, Any]] = {}
    
    # Media
    photos: List[str] = []  # URLs to photos
    virtual_tour_url: Optional[str] = None
    floor_plan_url: Optional[str] = None
    
    # Market intelligence
    market_analysis: Optional[MarketAnalysis] = None
    
    # Listing management
    seller_id: str
    broker_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    expires_at: Optional[datetime] = None
    
    # Engagement tracking
    view_count: int = 0
    inquiry_count: int = 0
    favorite_count: int = 0
    
    # Premium features
    featured: bool = False
    verified: bool = False
    professional_photos: bool = False

class Inquiry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    listing_id: str
    buyer_id: str
    seller_id: str
    broker_id: Optional[str] = None
    
    subject: str
    message: str
    buyer_contact_info: Dict[str, str]
    
    # Qualification
    financing_preapproved: bool = False
    cash_buyer: bool = False
    investment_timeline: Optional[str] = None  # immediate, 30days, 60days, 90days+
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    responded_at: Optional[datetime] = None
    
class Offer(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    listing_id: str
    buyer_id: str
    seller_id: str
    broker_id: Optional[str] = None
    
    offer_price: Decimal
    down_payment: Optional[Decimal] = None
    financing_contingency: bool = True
    inspection_period_days: int = 14
    closing_days: int = 30
    
    terms_and_conditions: str
    expiration_date: datetime
    
    status: str = "pending"  # pending, accepted, rejected, countered
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    responded_at: Optional[datetime] = None

class Transaction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    listing_id: str
    buyer_id: str
    seller_id: str
    broker_id: Optional[str] = None
    
    accepted_offer_id: str
    sale_price: Decimal
    transaction_type: TransactionType
    
    # Timeline
    contract_date: datetime
    estimated_closing: datetime
    actual_closing: Optional[datetime] = None
    
    # Due diligence
    inspection_completed: bool = False
    financing_approved: bool = False
    documents_received: List[str] = []  # P&L, lease, equipment list, etc.
    
    # Commission tracking
    total_commission: Optional[Decimal] = None
    platform_fee: Optional[Decimal] = None
    broker_commission: Optional[Decimal] = None
    
    status: str = "under_contract"  # under_contract, closed, cancelled
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SavedListing(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    listing_id: str
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SearchAlert(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    name: str
    
    # Search criteria
    location_filter: Optional[Dict[str, Any]] = {}  # states, radius, etc.
    price_range: Optional[Dict[str, Decimal]] = {}  # min_price, max_price
    property_type_filter: List[PropertyType] = []
    revenue_range: Optional[Dict[str, Decimal]] = {}
    
    active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_notification: Optional[datetime] = None

class MarketReport(BaseModel):
    """Monthly/Quarterly market intelligence reports"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    period: str  # "Q4 2024", "December 2024"
    
    # Market statistics
    total_listings: int
    average_sale_price: Decimal
    median_days_on_market: int
    price_per_sqft_avg: Optional[Decimal] = None
    
    # Geographic breakdown
    market_by_state: Dict[str, Dict[str, Any]] = {}
    
    # Trends
    price_trend: str  # "increasing", "stable", "decreasing"
    volume_trend: str
    hot_markets: List[str] = []
    
    report_url: Optional[str] = None  # PDF report
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Response Models for API
class ListingResponse(BaseModel):
    listing: Listing
    is_favorited: bool = False
    inquiry_sent: bool = False
    view_count: int = 0

class SearchResults(BaseModel):
    listings: List[ListingResponse]
    total_count: int
    page: int
    per_page: int
    filters_applied: Dict[str, Any]
    suggested_filters: Dict[str, Any] = {}

class MarketStats(BaseModel):
    total_active_listings: int
    average_price: Decimal
    median_price: Decimal
    average_revenue: Optional[Decimal] = None
    average_days_on_market: int
    new_listings_this_month: int
    price_trend_30_days: float  # percentage change