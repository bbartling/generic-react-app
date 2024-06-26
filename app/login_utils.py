import os
import logging
import hashlib
import jwt
import datetime
from aiohttp import web

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# Read admin credentials and JWT secret key from environment variables
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "password")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your_jwt_secret_key")

# Hash the admin password
USERS = {ADMIN_USERNAME: hashlib.sha256(ADMIN_PASSWORD.encode()).hexdigest()}

async def login(request):
    data = await request.json()
    username = data.get("username")
    password = data.get("password")
    provided_password_hash = hashlib.sha256(password.encode()).hexdigest()

    logging.debug(f"Login attempt: {username}")

    if USERS.get(username) == provided_password_hash:
        token = jwt.encode({
            "username": username,
            "role": "admin" if username == ADMIN_USERNAME else "user",
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, JWT_SECRET_KEY, algorithm="HS256")
        logging.debug(f"Login successful: {username}")
        return web.json_response({"status": "success", "token": token})
    else:
        logging.debug(f"Login failed: {username}")
        return web.json_response({"status": "failure", "message": "Invalid credentials"}, status=401)

async def create_user(request):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return web.json_response({"status": "failure", "message": "Unauthorized"}, status=401)

    try:
        token = auth_header.split(" ")[1]
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return web.json_response({"status": "failure", "message": "Unauthorized"}, status=401)

    if payload["role"] != "admin":
        return web.json_response({"status": "failure", "message": "Unauthorized"}, status=403)

    data = await request.json()
    username = data.get("username")
    password = data.get("password")

    if username in USERS:
        return web.json_response({"status": "failure", "message": "User already exists"}, status=400)

    USERS[username] = hashlib.sha256(password.encode()).hexdigest()
    return web.json_response({"status": "success", "message": "User created successfully"})

async def get_users(request):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return web.json_response({"status": "failure", "message": "Unauthorized"}, status=401)

    try:
        token = auth_header.split(" ")[1]
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return web.json_response({"status": "failure", "message": "Unauthorized"}, status=401)

    if payload["role"] != "admin":
        return web.json_response({"status": "failure", "message": "Unauthorized"}, status=403)

    users = [{"username": user} for user in USERS.keys()]
    return web.json_response({"status": "success", "users": users})

async def delete_user(request):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return web.json_response({"status": "failure", "message": "Unauthorized"}, status=401)

    try:
        token = auth_header.split(" ")[1]
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return web.json_response({"status": "failure", "message": "Unauthorized"}, status=401)

    if payload["role"] != "admin":
        return web.json_response({"status": "failure", "message": "Unauthorized"}, status=403)

    data = await request.json()
    username = data.get("username")

    if username not in USERS:
        return web.json_response({"status": "failure", "message": "User not found"}, status=404)

    if username == ADMIN_USERNAME:
        return web.json_response({"status": "failure", "message": "Cannot delete admin user"}, status=400)

    del USERS[username]
    return web.json_response({"status": "success", "message": "User deleted successfully"})

async def get_dashboard(request):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return web.json_response({"status": "failure", "message": "Unauthorized"}, status=401)

    try:
        token = auth_header.split(" ")[1]
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return web.json_response({"status": "failure", "message": "Unauthorized"}, status=401)

    logging.debug(f"Decoded JWT payload: {payload}")

    # Include financial data regardless of user role for testing
    data = {
        "total_users": len(USERS),
        "system_status": "All systems operational",
        "user_role": payload["role"],
        "financials": {
            "revenue": 100000,
            "expenses": 50000,
            "net_profit": 50000
        }
    }

    return web.json_response({"status": "success", "data": data})
