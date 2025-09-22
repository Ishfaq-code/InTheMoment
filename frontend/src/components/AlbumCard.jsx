import React from 'react'
import { useNavigate } from 'react-router'
import Lock from '../assets/images/Lock.png'
import photo1 from '../assets/images/photo1.jpg'
import photo2 from '../assets/images/photo2.jpg'
import photo3 from '../assets/images/photo3.jpg'
import photo4 from '../assets/images/photo4.jpg'

const AlbumCard = ({album}) => {
  const navigate = useNavigate()

  const randomImage = () => {
    const images = [photo1, photo2, photo3, photo4];
    const idx = Math.floor(Math.random() * images.length);
    return images[idx];
  }


  return (
    <>
     <div
        key={album.id}
        onClick={() => navigate(`/albums/${album.id}`)}
        className="flex flex-col items-center cursor-pointer group"
      >
      <div className="w-40 h-40 relative overflow-hidden shadow-2xl transition-transform duration-300 ease-in-out group-hover:-translate-y-3 group-hover:scale-105"
        style={{ boxShadow: '0 8px 32px 0 rgba(10, 10, 10, 0.7)' }}>
           <img
              src={randomImage()}
              className="object-cover w-full h-full rounded z-10"
              style={{ transform: 'perspective(400px) rotateY(-12deg)' }}
            />
      </div>
        <p className="mt-2 font-junge">{album.name}</p>
    </div>

    </>
 
  )
}

export default AlbumCard