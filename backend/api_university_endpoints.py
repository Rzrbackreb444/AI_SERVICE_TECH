"""
API University - Intelligence Marketplace Platform
Today's Build: Core workflow builder and marketplace
"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime
from typing import Dict, Any, List
import logging
import os
import uuid
import json
from motor.motor_asyncio import AsyncIOMotorClient

logger = logging.getLogger(__name__)

# Database connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'sitetitan_db')]

# Security
security = HTTPBearer()

class User:
    def __init__(self, **data):
        for key, value in data.items():
            setattr(self, key, value)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    """Get current user from JWT token"""
    import jwt
    try:
        JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key')
        JWT_ALGORITHM = 'HS256'
        
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

def create_api_university_router():
    """Create API University router"""
    router = APIRouter(prefix="/api-university", tags=["api-university"])
    
    @router.post("/workflows")
    async def create_workflow(
        workflow_data: Dict[str, Any],
        current_user: User = Depends(get_current_user)
    ):
        """Create a new intelligence workflow"""
        try:
            workflow_id = str(uuid.uuid4())
            
            workflow = {
                "id": workflow_id,
                "user_id": current_user.id,
                "name": workflow_data.get("name"),
                "description": workflow_data.get("description"),
                "category": workflow_data.get("category", "general"),
                "workflow_config": workflow_data.get("workflow_config", {}),
                "apis_used": workflow_data.get("apis_used", []),
                "price": workflow_data.get("price", 0),
                "is_published": False,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "sales_count": 0,
                "revenue_generated": 0.0
            }
            
            await db.api_workflows.insert_one(workflow)
            
            return {
                "success": True,
                "workflow_id": workflow_id,
                "message": "Workflow created successfully"
            }
            
        except Exception as e:
            logger.error(f"Error creating workflow: {e}")
            raise HTTPException(status_code=500, detail="Failed to create workflow")
    
    @router.get("/workflows")
    async def get_user_workflows(current_user: User = Depends(get_current_user)):
        """Get all workflows created by user"""
        try:
            workflows = await db.api_workflows.find({"user_id": current_user.id}).to_list(None)
            
            return {
                "success": True,
                "workflows": workflows,
                "total_count": len(workflows)
            }
            
        except Exception as e:
            logger.error(f"Error fetching workflows: {e}")
            raise HTTPException(status_code=500, detail="Failed to fetch workflows")
    
    @router.get("/marketplace")
    async def get_marketplace_workflows(
        category: str = None,
        min_price: float = None,
        max_price: float = None,
        limit: int = 50
    ):
        """Get published workflows from marketplace"""
        try:
            query = {"is_published": True}
            
            if category:
                query["category"] = category
            if min_price is not None:
                query["price"] = {"$gte": min_price}
            if max_price is not None:
                if "price" in query:
                    query["price"]["$lte"] = max_price
                else:
                    query["price"] = {"$lte": max_price}
            
            workflows = await db.api_workflows.find(query).limit(limit).to_list(limit)
            
            # Remove sensitive workflow config from public listing
            for workflow in workflows:
                workflow.pop("workflow_config", None)
            
            return {
                "success": True,
                "workflows": workflows,
                "total_count": len(workflows)
            }
            
        except Exception as e:
            logger.error(f"Error fetching marketplace: {e}")
            raise HTTPException(status_code=500, detail="Failed to fetch marketplace")
    
    @router.post("/workflows/{workflow_id}/publish")
    async def publish_workflow(
        workflow_id: str,
        current_user: User = Depends(get_current_user)
    ):
        """Publish workflow to marketplace"""
        try:
            workflow = await db.api_workflows.find_one({
                "id": workflow_id,
                "user_id": current_user.id
            })
            
            if not workflow:
                raise HTTPException(status_code=404, detail="Workflow not found")
            
            # Update workflow to published
            await db.api_workflows.update_one(
                {"id": workflow_id, "user_id": current_user.id},
                {"$set": {"is_published": True, "updated_at": datetime.utcnow()}}
            )
            
            return {
                "success": True,
                "message": "Workflow published to marketplace"
            }
            
        except Exception as e:
            logger.error(f"Error publishing workflow: {e}")
            raise HTTPException(status_code=500, detail="Failed to publish workflow")
    
    @router.post("/workflows/{workflow_id}/purchase")
    async def purchase_workflow(
        workflow_id: str,
        current_user: User = Depends(get_current_user)
    ):
        """Purchase workflow from marketplace"""
        try:
            workflow = await db.api_workflows.find_one({
                "id": workflow_id,
                "is_published": True
            })
            
            if not workflow:
                raise HTTPException(status_code=404, detail="Workflow not found")
            
            # Check if user already owns this workflow
            existing_purchase = await db.workflow_purchases.find_one({
                "workflow_id": workflow_id,
                "buyer_id": current_user.id
            })
            
            if existing_purchase:
                raise HTTPException(status_code=400, detail="Workflow already purchased")
            
            # Create purchase record
            purchase_id = str(uuid.uuid4())
            purchase = {
                "id": purchase_id,
                "workflow_id": workflow_id,
                "buyer_id": current_user.id,
                "seller_id": workflow["user_id"],
                "price_paid": workflow["price"],
                "platform_fee": workflow["price"] * 0.30,  # 30% platform fee
                "seller_earnings": workflow["price"] * 0.70,  # 70% to seller
                "purchase_date": datetime.utcnow(),
                "status": "completed"
            }
            
            await db.workflow_purchases.insert_one(purchase)
            
            # Update workflow sales stats
            await db.api_workflows.update_one(
                {"id": workflow_id},
                {
                    "$inc": {
                        "sales_count": 1,
                        "revenue_generated": workflow["price"]
                    }
                }
            )
            
            return {
                "success": True,
                "purchase_id": purchase_id,
                "workflow_config": workflow["workflow_config"],
                "message": "Workflow purchased successfully"
            }
            
        except Exception as e:
            logger.error(f"Error purchasing workflow: {e}")
            raise HTTPException(status_code=500, detail="Failed to purchase workflow")
    
    @router.get("/earnings")
    async def get_user_earnings(current_user: User = Depends(get_current_user)):
        """Get user's earnings from workflow sales"""
        try:
            # Get all purchases of user's workflows
            purchases = await db.workflow_purchases.find({
                "seller_id": current_user.id
            }).to_list(None)
            
            total_earnings = sum(p.get("seller_earnings", 0) for p in purchases)
            total_sales = len(purchases)
            
            return {
                "success": True,
                "total_earnings": total_earnings,
                "total_sales": total_sales,
                "recent_purchases": purchases[-10:] if purchases else []
            }
            
        except Exception as e:
            logger.error(f"Error fetching earnings: {e}")
            raise HTTPException(status_code=500, detail="Failed to fetch earnings")
    
    @router.post("/execute-workflow")
    async def execute_workflow(
        execution_data: Dict[str, Any],
        current_user: User = Depends(get_current_user)
    ):
        """Execute a workflow with provided inputs"""
        try:
            workflow_id = execution_data.get("workflow_id")
            inputs = execution_data.get("inputs", {})
            
            # Check if user owns this workflow
            purchase = await db.workflow_purchases.find_one({
                "workflow_id": workflow_id,
                "buyer_id": current_user.id
            })
            
            if not purchase:
                raise HTTPException(status_code=403, detail="Workflow not owned")
            
            # Get workflow config
            workflow = await db.api_workflows.find_one({"id": workflow_id})
            if not workflow:
                raise HTTPException(status_code=404, detail="Workflow not found")
            
            # TODO: Execute the actual workflow with API calls
            # For now, return mock execution result
            execution_id = str(uuid.uuid4())
            
            # Log execution
            execution_log = {
                "id": execution_id,
                "workflow_id": workflow_id,
                "executor_id": current_user.id,
                "inputs": inputs,
                "status": "completed",
                "result": {"mock": "This would contain actual API results"},
                "api_cost": 0.15,  # Mock API cost
                "execution_time": datetime.utcnow()
            }
            
            await db.workflow_executions.insert_one(execution_log)
            
            return {
                "success": True,
                "execution_id": execution_id,
                "result": execution_log["result"],
                "message": "Workflow executed successfully"
            }
            
        except Exception as e:
            logger.error(f"Error executing workflow: {e}")
            raise HTTPException(status_code=500, detail="Failed to execute workflow")
    
    return router