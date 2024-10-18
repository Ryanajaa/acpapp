from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from database import *
from data_import import import_data  # Import the function from data_import.py

router = APIRouter()

class SearchQuery(BaseModel):
    searchQuery: str
    userId: Optional[int]

@router.post("/search/")
async def search_keyword(query: SearchQuery):
    try:
        print(f"Received search query: {query.searchQuery} from user: {query.userId}")
        
        # Import data before performing the search
        try:
            import_result = await import_data()
            print("Data import result:", import_result)
        except Exception as import_error:
            print(f"Error during data import: {str(import_error)}")
            import_result = {"message": "Data import failed"}
        
        # Log the search query
        try:
            await log_search(query.userId, query.searchQuery)
        except Exception as log_error:
            print(f"Error logging search: {str(log_error)}")
        
        # Perform the actual search here
        results = await perform_search(query.searchQuery)
        
        print("Returning results:", results)
        return {
            "message": "Search query received",
            "keyword": query.searchQuery,
            "results": results,
            "import_result": import_result
        }
    except Exception as e:
        print(f"Error in search_keyword: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

async def perform_search(search_query: str):
    try:
        query = """
        SELECT 
            combined.title, 
            combined.price, 
            combined.rating, 
            combined.specs, 
            combined.images, 
            combined.url,
            CASE 
                WHEN a.title IS NOT NULL THEN 'Amazon'
                WHEN e.title IS NOT NULL THEN 'eBay'
                WHEN w.title IS NOT NULL THEN 'Walmart'
            END AS source
        FROM (
            SELECT title, price, rating, specs, images, url FROM amazon_products WHERE title ILIKE :search_query
            UNION ALL
            SELECT title, price, rating, specs, images, url FROM ebay_products WHERE title ILIKE :search_query
            UNION ALL
            SELECT title, price, rating, specs, images, url FROM walmart_products WHERE title ILIKE :search_query
        ) AS combined
        LEFT JOIN amazon_products a ON combined.title = a.title AND combined.url = a.url
        LEFT JOIN ebay_products e ON combined.title = e.title AND combined.url = e.url
        LEFT JOIN walmart_products w ON combined.title = w.title AND combined.url = w.url
        """
        values = {"search_query": f"%{search_query}%"}
        results = await database.fetch_all(query=query, values=values)
        return [dict(result) for result in results]
    except Exception as e:
        print(f"Error in perform_search: {str(e)}")
        return []