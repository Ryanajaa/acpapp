from fastapi import APIRouter, HTTPException
from database import database, log_dashboard  # Import your database connection
from pydantic import BaseModel
from typing import List, Dict
from datetime import datetime, timedelta

router = APIRouter()

class UserID(BaseModel):
    user_id: int

@router.get("/latest-log-id")
async def get_latest_log_id():
    try:
        query = "SELECT MAX(log_id) as latest_log_id FROM logs"
        result = await database.fetch_one(query)
        return {"latest_log_id": result['latest_log_id'] if result['latest_log_id'] else 0}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/log-dashboard-view")
async def log_dashboard_view(user: UserID):
    try:
        await log_dashboard(user.user_id)
        return {"message": "Dashboard view logged successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))