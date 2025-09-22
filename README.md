
# In The Moment

In The Moment allows familes or friend-groups with distant members to connect through sharing 'Memos'. Users can create or join albums and share their experiences through photos with a voice note alongside it.

## Prerequisites
- Node v23; Other versions may work
- Python v3.12; Other versions may work
- Google Account to setup Firebase Suite

## Frontend
After cloning the repo using gitclone cd into your frontend directory and run `npm install` to install dependencies used in the frontend. Run `npm run dev` to start the frontend server with vite.

## Backend
After going into the backend directory run `pip install -r requirements.txt` to install all required backend directories. Create a `serviceaccountkey.json` file and paste your `firebaseadmin-sdk` file into here. Run `uvicorn main:app --reload` to start the FastAPI server
