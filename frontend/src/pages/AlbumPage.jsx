import React, { useEffect, useState } from 'react'
import { useParams } from "react-router";
import Memo from '../components/Memo';
import UploadPhoto from '../components/UploadPhoto';
import EnlargedPhoto from '../components/EnlargedPhoto';

const AlbumPage = () => {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);
  const [isOpen, setIsOpen] = useState()
  
const fetchAlbum = async () => {
      const res = await fetch(`http://localhost:8000/albums/${albumId}`);
      const data = await res.json();
      setAlbum(data.data);
};

useEffect(() => {
    if(albumId && !album){
        fetchAlbum();
    }
}, [albumId])


const getMainContent = () => {
  let mainContent;
  if(!album){
    return
  }

  if(album.memos.length == 0){
     mainContent = (
            <div className="flex items-center justify-center w-full h-full" style={{ minHeight: '24rem', minHeight: 'calc(80vh - 4rem)' }}>
                <span className="text-6xl font-junge text-gray-600 text-center">No Photos</span>
            </div>
        );
  }
  else {
    mainContent = ( <div className="grid grid-cols-4 gap-16 mt-12" style={{ height: '18rem' }}> {album.memos.map((memo) => (
        <Memo key={memo.id} memo={memo} />
      ))}
      </div>
    )

  }

  return mainContent

}
  
const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("photo", e.target.photo.files[0]);
    formData.append("audio", e.target.audio.files[0]);
    console.log("Testing")

    const res = await fetch(`http://localhost:8000/albums/${albumId}/memos`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setAlbum(data.data)
}
  
  
  if (!album) return <p>Loading...</p>;

  return (
  <div className="min-h-screen bg-[#FFFAF0] flex flex-col items-start p-6 relative">
    {/* Logo */}
      <div className="bg-[#DDE7F7] px-3 py-4 mb-4 relative z-20" style={{ marginBottom: '-2.25rem' }}>
          <h1 className="text-4xl font-junge">{album.name}</h1>
      </div>

     <div className="bg-[#FFCBBB] pt-12 pr-16 pb-16 pl-16 w-full mx-auto min-h-[92vh] relative z-10" style={{ borderRadius: '0.75rem' }}>
                <button
                    onClick={() => setIsOpen(true)}
                    className="absolute top-4 right-8 text-5xl font-bold focus:outline-none z-30"
                >
                    +
                </button>
                {getMainContent()}
      
        
        <UploadPhoto 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        setAlbum={setAlbum} 
        albumId={albumId}
        />


      </div>
    </div>
  )
}

export default AlbumPage