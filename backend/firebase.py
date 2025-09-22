# app/firebase_auth.py
import uuid
import firebase_admin
from firebase_admin import credentials, auth, firestore, storage
from fastapi import Header, HTTPException


cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred, {"storageBucket": "in-the-moment-6c324.firebasestorage.app"})

db = firestore.client()
bucket = storage.bucket()


def verify_token(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        print("Invalid authorization heade")
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    id_token = authorization.split(" ")[1]
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token  # contains uid, email, name, etc.
    except Exception as e:
        print("Invalid Token")
        raise HTTPException(status_code=401, detail="Invalid token")

def user_exists(user):
    uid = user["uid"]
    doc = db.collection("users").document(uid).get()
    print(doc)
    print(doc.exists)
    return doc.exists

async def create_user(req, user):
    uid = user["uid"]
    email = user.get("email")

    body = await req.json()
    display_name = body.get("name") or "John"

    user_ref = db.collection("users").document(uid)
    user_ref.set({
        "uid": uid,
        "email": email,
        "displayName": display_name,
        "albums": []
    }, merge=True)

async def get_user(user):
    uid = user["uid"]
    doc = db.collection("users").document(uid).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="User not found")
    
    return_user = doc.to_dict()
    print(return_user)

    return return_user


async def create_album(req, user):
    body = await req.json()
    password = body.get('password')
    name = body.get('name')

    uid = user['uid']
    album_id = str(uuid.uuid4())

    album_ref = db.collection("albums").document(album_id)
    album_ref.set({
        "id": album_id,
        "name": name,
        "owner": uid,
        "users": [uid],
        "memos": [],
        "password": password  
    })

     # Add album to user
    user_ref = db.collection("users").document(uid)
    user_ref.update({
        "albums": firestore.ArrayUnion([album_id])
    })

    return_user = db.collection("users").document(uid).get().to_dict()
    return return_user

async def join_album(req, user):
    body = await req.json()
    password = body.get('password')
    
    uid = user['uid']
     # Find album with matching password
    albums_ref = db.collection("albums")
    query = albums_ref.where("password", "==", password).limit(1)
    results = query.get()

    if not results:
        raise HTTPException(status_code=404, detail="Album not found or incorrect password")

    album_doc = results[0]
    album_id = album_doc.id

    # Add user to album's users list
    album_ref = db.collection("albums").document(album_id)
    album_ref.update({
        "users": firestore.ArrayUnion([uid])
    })

    # Add album to user's albums list
    user_ref = db.collection("users").document(uid)
    user_ref.update({
        "albums": firestore.ArrayUnion([album_id])
    })

    return_user = db.collection("users").document(uid).get().to_dict()
    return return_user
   


async def fetch_albums(user_id):
    user_ref = db.collection("users").document(user_id)
    user_doc = user_ref.get()
  
    if not user_doc.exists:
        raise HTTPException(status_code=404, detail="User not found")

    user_data = user_doc.to_dict()
    album_ids = user_data.get("albums", [])
    albums = []

    for album_id in album_ids:
        album_ref = db.collection("albums").document(album_id)
        album_doc = album_ref.get()
        if album_doc.exists:
            album = album_doc.to_dict()
            album["id"] = album_doc.id
            albums.append(album)

    return albums

def get_album(album_id):
    album_ref = db.collection("albums").document(album_id)
    album_doc = album_ref.get()

    if not album_doc.exists:
        raise HTTPException(status_code=404, detail="Album not found")

    album_data = album_doc.to_dict()
    album_data["id"] = album_doc.id
    return album_data


async def upload_memo(album_id, photo, audio):
    album_ref = db.collection("albums").document(album_id)
    album_doc = album_ref.get()
    if not album_doc.exists:
        raise HTTPException(status_code=404, detail="Album not found")
    
    memo_id = str(uuid.uuid4())


     # Upload photo
    photo_blob = bucket.blob(f"memos/{album_id}/{memo_id}_photo_{photo.filename}")
    photo_blob.upload_from_file(photo.file, content_type=photo.content_type)
    photo_blob.make_public()   # 👈 make file publicly accessible
    photo_url = photo_blob.public_url  # permanent URL    
    
 # Upload audio as-is (WebM/Opus)
    audio_blob = bucket.blob(f"memos/{album_id}/{memo_id}_audio_{audio.filename}")
    audio_blob.upload_from_file(audio.file, content_type=audio.content_type)
    audio_blob.make_public()
    audio_url = audio_blob.public_url
    
    # Store memo in Firestore
    memo_data = {
        "id": memo_id,
        "photo": photo_url,
        "audio": audio_url
    }
    album_ref.update({
        "memos": firestore.ArrayUnion([memo_data])
    })

    new_album_ref = db.collection("albums").document(album_id)
    new_album_doc = new_album_ref.get()

    return new_album_doc.to_dict()




    
    

