import React from 'react'

const EnlargedPhoto = ({imgLink, audiolink, isOpen, onClose}) => {

  if(!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <div className="relative bg-white rounded-2xl shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col items-center">
        <button
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            onClick={onClose}
            >
            ✕
            </button>
        {/* Picture */}
        <img
            src={imgLink}
            alt="Sample"
            className="rounded-2xl shadow-lg mb-8 max-w-full "
        />

        {/* Audio Player */}
        <audio controls src={audiolink} className="w-full max-w-xl h-14" />
        </div>
    </div>

  )
}

export default EnlargedPhoto