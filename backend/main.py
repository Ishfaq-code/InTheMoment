# app/main.py
from fastapi import FastAPI, Depends, Request, UploadFile, File
from firebase import  verify_token, user_exists, create_user, get_user, create_album, fetch_albums, get_album, upload_memo, join_album
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Vite and Create React App default ports
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)

@app.get("/protected")
async def protected(user=Depends(verify_token)):
    exist = user_exists(user)
    print(exist)
    return{"exists": exist}

@app.post("/users")
async def post_user_db(req: Request, user=Depends(verify_token)):
    await create_user(req, user)
    return{"message": "User succesfully created"}


@app.get("/get-user")
async def get_user_db(user=Depends(verify_token)):
    db_user = await get_user(user)
    return({"data": db_user})

@app.post("/create-album")
async def create_album_route(req: Request, user=Depends(verify_token)):
    updated_user = await create_album(req, user)
    return({"data": updated_user})

@app.post("/join-album")
async def join_album_route(req: Request, user=Depends(verify_token)):
    updated_user = await join_album(req, user)
    return ({"data": updated_user})

@app.get("/fetch-user-albums")
async def fetch_user_albums(user=Depends(verify_token)):
    id = user["uid"]
    ret = await fetch_albums(id)
    return({"data": ret})




@app.get("/albums/{album_id}")
async def fetch_album(album_id):
    album = get_album(album_id)
    return({"data": album})


@app.post("/albums/{album_id}/memos")
async def upload_memo_db(album_id: str, photo: UploadFile = File(...), audio: UploadFile = File(...)):
    album = await upload_memo(album_id, photo, audio)
    return({"data": album})