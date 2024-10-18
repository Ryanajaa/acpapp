# routes/products.py
from fastapi import APIRouter, HTTPException
from database import database, log_product
from pydantic import BaseModel
from data_import import import_data

router = APIRouter()

class UserID(BaseModel):
    user_id: int

@router.get("/products")
async def get_all_products():
    try:
        try:
            import_result = await import_data()
            print("Data import result:", import_result)
        except Exception as import_error:
            print(f"Error during data import: {str(import_error)}")
            import_result = {"message": "Data import failed"}

        query = """
        SELECT * FROM (
            SELECT title, price, rating, specs, images, url, 'Amazon' as source FROM amazon_products
            UNION ALL
            SELECT title, price, rating, specs, images, url, 'eBay' as source FROM ebay_products
            UNION ALL
            SELECT title, price, rating, specs, images, url, 'Walmart' as source FROM walmart_products
        ) AS all_products
        LIMIT 100  -- Adjust this limit as needed
        """
        results = await database.fetch_all(query)
        return {"products": [dict(result) for result in results]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.post("/log-product-view")
async def log_product_view(user: UserID):
    try:
        await log_product(user.user_id)
        return {"message": "Product view logged successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))