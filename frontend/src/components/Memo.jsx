import React, { useState } from 'react'
import EnlargedPhoto from './EnlargedPhoto'

const Memo = ({memo}) => {

  const [enlargePhoto, setEnlargePhoto] = useState(false)

  return (
    <>
    <div
            key={memo.id}
            className="flex flex-col items-center group">
            <div onClick={() => setEnlargePhoto(true)} className="w-40 h-40 relative overflow-hidden transition-transform duration-300 ease-in-out group-hover:-translate-y-3 group-hover:scale-105 cursor-pointer">
                <img
                    src={memo.photo}
                    alt="Photo"
                    className="object-cover w-full h-full rounded z-10"
                />
            </div>
            <audio controls src={memo.audio} className="mt-2" />
        </div>   

    <EnlargedPhoto imgLink={memo.photo} audiolink={memo.audio} isOpen={enlargePhoto}  onClose={() => setEnlargePhoto(false)} /> 
    </>
  
        
        
  )
}

export default Memo