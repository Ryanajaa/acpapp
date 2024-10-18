from databases import Database
import json, time

POSTGRES_USER = "temp"
POSTGRES_PASSWORD = "temp"
POSTGRES_DB = "advcompro"
POSTGRES_HOST = "db"

DATABASE_URL = f'postgresql+asyncpg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}/{POSTGRES_DB}'

database = Database(DATABASE_URL)

async def connect_db():
	await database.connect()
	print("Database connected")

async def disconnect_db():
	await database.disconnect()
	print("Database disconnected")

# Function to insert a new user into the users table
async def insert_user(username: str, password_hash: str, email: str):
	query = """
	INSERT INTO users (username, password_hash, email)
	VALUES (:username, :password_hash, :email)
	RETURNING user_id, username, password_hash, email, created_at
	"""
	values = {"username": username, "password_hash": password_hash, "email": email}
	return await database.fetch_one(query=query, values=values)

# Function to select a user by user_id from the users table
async def get_user(username: str):
	query = "SELECT * FROM users WHERE username = :username"
	return await database.fetch_one(query=query, values={"username": username})

# Function to select a user by user_id from the users table
async def get_user_by_id(user_id: int):
    query = "SELECT * FROM users WHERE user_id = :user_id"
    return await database.fetch_one(query=query, values={"user_id": user_id})

# Function to select a user by email from the users table
async def get_user_by_email(email: str,password_hash:str):
	query = "SELECT * FROM users WHERE email = :email and password_hash = :password_hash"
	return await database.fetch_one(query=query, values={"email": email,"password_hash": password_hash})

# Function to update a user in the users table
async def update_user(user_id: int, username: str, password_hash: str, email: str):
	query = """
	UPDATE users
	SET username = :username, password_hash = :password_hash, email = :email
	WHERE user_id = :user_id
	RETURNING user_id, username, password_hash, email, created_at
	"""
	values = {"user_id": user_id, "username": username, "password_hash": password_hash, "email": email}
	return await database.fetch_one(query=query, values=values)

# Function to delete a user from the users table
async def delete_user(user_id: int):
	query = "DELETE FROM users WHERE user_id = :user_id RETURNING *"
	return await database.fetch_one(query=query, values={"user_id": user_id})

async def log_login(user_id: int):
    query = """
    INSERT INTO logs (user_id, action, details)
    VALUES (:user_id, 'login', 'User logged in')
    """
    values = {"user_id": user_id}
    await database.execute(query=query, values=values)
	
async def log_product(user_id: int):
    query = """
    INSERT INTO logs (user_id, action, details)
    VALUES (:user_id, 'product', 'Viewed all products')
    """
    values = {"user_id": user_id}
    await database.execute(query=query, values=values)

async def log_dashboard(user_id: int):
    query = """
    INSERT INTO logs (user_id, action, details)
    VALUES (:user_id, 'dashboard', 'Viewed dashboard statistics')
    """
    values = {"user_id": user_id}
    await database.execute(query=query, values=values)

async def log_search(user_id: int, search_query: str):
    query = """
    INSERT INTO logs (user_id, action, details)
    VALUES (:user_id, 'search', :search_query)
    """
    values = {"user_id": user_id, "search_query": search_query}
    await database.execute(query=query, values=values)

async def should_log_search(user_id: int, search_query: str):
    query = """
    SELECT created_at FROM logs
    WHERE user_id = :user_id AND action = 'search' AND details = :search_query
    ORDER BY created_at DESC LIMIT 1
    """
    values = {"user_id": user_id, "search_query": search_query}
    last_search = await database.fetch_one(query=query, values=values)
    
    if last_search:
        time_diff = time.time() - last_search['created_at'].timestamp()
        return time_diff > 5  # Only log if more than 5 seconds have passed
    return True