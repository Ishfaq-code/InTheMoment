import React, { use, useEffect, useState } from 'react'
import { auth } from '../utils/firebase'
import AlbumCard from '../components/AlbumCard'
import Modal from '../components/Modal'
import Lock from '../assets/images/Lock.png'


const Main = () => {
  const [albums, setAlbums] = useState([])
  const [user, setUser] = useState()
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);


  const [newAlbumName, setNewAlbumName] = useState("")
  const [albumPassword, setAlbumPassword] = useState("")

  const [open, setOpen] = useState(false)

  const getUser = async () => {
    const token = await auth.currentUser.getIdToken();  
    try{
      const new_user = await fetch(`http://localhost:8000/get-user`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
      })

      if(new_user){
        const new_user_json = await new_user.json()
        setUser(new_user_json.data)
      }
    }
    catch(error){
      console.log(error)
    }
    
  }


  const createNewAlbum = async (e) => {
    e.preventDefault();
    const token = await auth.currentUser.getIdToken();  
    try{
      if(newAlbumName && albumPassword){
          const name = newAlbumName
          const password = albumPassword

          const upadted_user = await fetch("http://localhost:8000/create-album", {
          method: "POST",
          headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, password }),
        })

        if(upadted_user){
          const updated_user_json = await upadted_user.json()
          setUser(updated_user_json.data)
        }

      }
   
    }
    catch(error){
      console.log(error)
    }

  }

  const getAllAlbums  = async (e = null) => {
    if(e){
      e.preventDefault();
    }
    const token = await auth.currentUser.getIdToken();  
    try{
      if(user?.albums?.length > 0){
        const resposne  = await fetch("http://localhost:8000/fetch-user-albums", {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
          })

          if(resposne){
            const data = await resposne.json()
            setAlbums(data.data)
          }
        }
    }
    catch(error){
      console.log(error)
    }  
  }


const joinAlbum = async (e) => {
  e.preventDefault();
  const token = await auth.currentUser.getIdToken();  
  const password = albumPassword

  if(!password){
    alert("Wrong password!")
    return;
  }

  const response = await fetch("http://localhost:8000/join-album", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ password }),
  });

  if(response){
    const data = await response.json();
    setUser(data.data)
  }

  
  
  }

  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
    if(user){
      getAllAlbums()
    }
  }, [user])

  useEffect(() => {
    console.log(albums)
  }, [albums])



  return (
    <div className="min-h-screen bg-[#FFFAF0] flex flex-col items-start p-6 relative">
      {/* Logo */}
        <div className="bg-[#DDE7F7] px-3 py-4 mb-4 relative z-20" style={{ marginBottom: '-2.25rem' }}>
          <h1 className="text-4xl font-junge">In the Moment</h1>
        </div>

      <div className="bg-[#FFCBBB] pt-12 pr-16 pb-16 pl-16 w-full mx-auto min-h-[92vh] relative z-10" style={{ borderRadius: '0.75rem' }}>
        <button
            onClick={() => setOpen(!open)}
            className="absolute top-4 right-8 text-5xl font-bold focus:outline-none z-30"
          >
            +
          </button>
          {/* Dropdown Menu */}
          {open && (
            <div className="absolute top-15 right-15 bg-white border border-gray-400 p-2 w-40 z-40">
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  setOpen(false);
                  setIsCreateOpen(true)
                }}
              >
                Create Album
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  setOpen(false);
                  setIsJoinOpen(true)
                }}
              >
                Join Album
              </button>
            </div>
          )}
           {/* Albums available or No Albums message */}
        {(() => {
          let mainContent;
          if (albums.length === 0) {
            mainContent = (
              <div className="flex items-center justify-center w-full h-full" style={{ minHeight: '24rem', minHeight: 'calc(80vh - 4rem)' }}>
                <span className="text-6xl font-junge text-gray-600 text-center">You Have No Albums</span>
              </div>
            );
          } else {
            mainContent = (
              <div className="grid grid-cols-4 gap-8 mt-12" style={{ height: '18rem' }}>
                {albums.map((album) => (
                   <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            );
          }
          return mainContent;
        })()}

      </div>
      
      

        

    

    

      {/* Create Album Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create Album"
      >
        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Album Name"
            className="border rounded-lg p-2 bg-white"
            value={newAlbumName}
            onChange={(e) => setNewAlbumName(e.target.value)}
          />
          <input
            type="password"
            placeholder="Album Password"
            className="border rounded-lg p-2 bg-white"
            value={albumPassword}
            onChange={(e) => setAlbumPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-[#FFCBBB] text-white px-4 py-2 rounded-lg hover:bg-[#f7b5a1]"
            onClick={createNewAlbum}
          >
            Create
          </button>
        </form>
      </Modal>

      {/* Join Album Modal */}
      <Modal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        title="Join Album"
      >
        <form className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Album Password"
            value={albumPassword}
            onChange={(e) => setAlbumPassword(e.target.value)}
            className="border rounded-lg p-2 bg-white"
          />
          <button
            type="submit"
            className="bg-[#FFCBBB] text-white px-4 py-2 rounded-lg hover:bg-[#f7b5a1]"
            onClick={joinAlbum}
         >
            Join
          </button>
        </form>
      </Modal>
    </div>
     
  )
}

export default Main