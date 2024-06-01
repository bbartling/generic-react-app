from aiohttp import web
import aiohttp_cors
from login_utils import login, create_user, get_users, delete_user, get_dashboard

async def index(request):
    return web.FileResponse('./frontend/build/index.html')

async def static(request):
    return web.FileResponse(f'./frontend/build{request.match_info["filename"]}')

app = web.Application()
cors = aiohttp_cors.setup(app, defaults={
    "*": aiohttp_cors.ResourceOptions(
        allow_credentials=True,
        expose_headers="*",
        allow_headers="*",
    )
})

cors.add(app.router.add_post("/login", login))
cors.add(app.router.add_post("/create_user", create_user))
cors.add(app.router.add_get("/get_users", get_users))
cors.add(app.router.add_post("/delete_user", delete_user))
cors.add(app.router.add_get("/dashboard", get_dashboard))
app.router.add_get('/', index)
app.router.add_get('/{filename:.*}', static)

if __name__ == "__main__":
    web.run_app(app, host="0.0.0.0", port=8000)
