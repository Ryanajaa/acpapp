import json
from fastapi import APIRouter, HTTPException
from database import database

router = APIRouter()

async def clear_table(table_name: str):
    query = f"DELETE FROM {table_name}"
    await database.execute(query)

async def insert_data(table_name: str, data):
    # First, clear the existing data
    await clear_table(table_name)
    
    # Then insert new data
    query = f"""
    INSERT INTO {table_name} (title, price, rating, specs, images, url)
    VALUES (:title, :price, :rating, :specs, :images, :url)
    """
    await database.execute_many(query=query, values=data)

async def import_data():
    try:
        # Read JSON files
        with open('algoproject/compro_data/amazon.json', 'r') as f:
            amazon_data = json.load(f)
        with open('algoproject/compro_data/ebay.json', 'r') as f:
            ebay_data = json.load(f)
        with open('algoproject/compro_data/walmart.json', 'r') as f:
            walmart_data = json.load(f)

        # Prepare data for insertion
        def prepare_data(items):
            return [
                {
                    "title": item['title'],
                    "price": item['price'],
                    "rating": item['rating'],
                    "specs": json.dumps(item['specs']),
                    "images": item['images'],
                    "url": item['URL']
                }
                for item in items
            ]

        # Insert data into respective tables
        await insert_data("amazon_products", prepare_data(amazon_data))
        await insert_data("ebay_products", prepare_data(ebay_data))
        await insert_data("walmart_products", prepare_data(walmart_data))

        return {"message": "Data imported successfully"}
    except Exception as e:
        print(f"Error in import_data: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Keep this if you want to maintain the separate endpoint for data import
@router.post("/import-data")
async def import_data_endpoint():
    return await import_data()