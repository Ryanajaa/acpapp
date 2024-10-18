from typing import Union
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from database import *

from fastapi.middleware.cors import CORSMiddleware
from routes.users import router as users_router
from routes.search import router as search_router
from data_import import router as data_import_router
from routes import dashboard, products


app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow requests from Next.js
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router, prefix="/api")
app.include_router(search_router, prefix="/api")
app.include_router(data_import_router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(products.router, prefix="/api")

@app.on_event("startup")
async def startup():
	await connect_db()

@app.on_event("shutdown")
async def shutdown():
	await disconnect_db()