from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from ..models.product import Product, ProductCreate, ProductUpdate
from motor.motor_asyncio import AsyncIOMotorDatabase
from ..database import get_database
from datetime import datetime

router = APIRouter(prefix="/products", tags=["products"])

@router.get("/", response_model=List[Product])
async def get_products(
    category: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = "rating",
    limit: int = Query(default=50, le=100)
):
    db = get_database()
    
    # Build query
    query = {}
    if category and category != "all":
        query["category"] = {"$regex": category, "$options": "i"}
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"seller": {"$regex": search, "$options": "i"}}
        ]
    
    # Build sort
    sort_options = {
        "rating": ("rating", -1),
        "price_low": ("price", 1),
        "price_high": ("price", -1),
        "name": ("name", 1)
    }
    sort_field, sort_order = sort_options.get(sort_by, ("rating", -1))
    
    products = await db.products.find(query).sort(sort_field, sort_order).limit(limit).to_list(limit)
    return [Product(**product) for product in products]

@router.get("/{product_id}", response_model=Product)
async def get_product(product_id: str):
    db = get_database()
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return Product(**product)

@router.post("/", response_model=Product)
async def create_product(product: ProductCreate):
    db = get_database()
    product_dict = product.dict()
    new_product = Product(**product_dict)
    await db.products.insert_one(new_product.dict())
    return new_product

@router.put("/{product_id}", response_model=Product)
async def update_product(product_id: str, product_update: ProductUpdate):
    db = get_database()
    update_data = {k: v for k, v in product_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.products.update_one(
        {"id": product_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    updated_product = await db.products.find_one({"id": product_id})
    return Product(**updated_product)

@router.delete("/{product_id}")
async def delete_product(product_id: str):
    db = get_database()
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}

@router.post("/{product_id}/purchase")
async def purchase_product(product_id: str):
    db = get_database()
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if not product.get("in_stock", True):
        raise HTTPException(status_code=400, detail="Product out of stock")
    
    return {"message": "Product purchased successfully", "product_id": product_id}