import React, { useEffect, useRef, useState } from 'react'

const UploadPhoto = ({isOpen, onClose, setAlbum, albumId}) => {

    if(!isOpen) return null


    const fileInputRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);


    const [imageFile, setImageFile] = useState(null)
    const [audioFile, setAudioFile] = useState(null)
    
    const [preview, setPreview] = useState(null);
    const [recording, setRecording] = useState(false);
    const [audioURL, setAudioURL] = useState(null);


    const handleBoxClick = () => {
        fileInputRef.current.click();
    };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file)
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setPreview(imageURL);
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(!imageFile || !audioFile){
        alert("Must upload an image and a voice memo!")
        return
    }

    const formData = new FormData();
    formData.append("photo", imageFile)
    formData.append("audio", audioFile) // Giving a blob turn into mp3 in backend
    const res = await fetch(`http://localhost:8000/albums/${albumId}/memos`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setAlbum(data.data)

  }


  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioFile(audioBlob)
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error('Mic access error:', err);
      alert('Microphone access denied or unavailable.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };


  useEffect(() => {
    console.log(imageFile)
    console.log(audioFile)
  }, [imageFile, audioFile])


    
  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
        <div className="bg-[#00887A] pt-8 pr-16 pb-16 pl-16 w-6/12 mx-auto min-h-[80vh] shadow-md max-w-md relative">
        <h1 className="text-3xl mb-6 font-junge text-center text-white">Upload Photo</h1>
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          ✕
        </button>

        <div
          className="bg-[#D9D9D9] w-full max-w-[470px] h-[250px] mx-auto shadow-md flex items-center justify-center overflow-hidden mb-6 cursor-pointer hover:scale-[1.02] transition-transform"
          onClick={handleBoxClick}
        >
          {preview ? (
            <img src={preview} alt="Preview" className="object-cover w-full h-full" />
          ) : (
            <span className="text-5xl text-gray-500 scale-125">📷</span>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
    <div className="w-full max-w-[470px] mx-auto flex flex-row justify-center gap-4 mt-6"> 
         <button
            onClick={recording ? stopRecording : startRecording}
            className={`px-6 font-junge py-2 shadow ${
              recording ? 'bg-red-400 hover:bg-red-500' : 'bg-[#77A6F6] hover:bg-[#2f77f1]'
            } text-[#333] transition-colors duration-300`}
          >
            {recording ? 'Stop Recording' : 'Record Voice'}
          </button>
    </div>

    {audioURL && (
          <div className="w-full max-w-[470px] mx-auto mt-4">
            <audio controls src={audioURL} className="w-full" />
          </div>
        )}



     <div className="w-full max-w-[470px] mx-auto flex flex-col items-center gap-4 mt-6">
          <button
            onClick={handleSubmit}
            className="bg-[#FFCBBB] font-junge hover:bg-[#ffb3a1] text-[#333] px-6 py-2 shadow transition-colors duration-300"
          >
            Submit Entry
          </button>
        </div>

    </div>
    </div>
    

    

    
  )
}

export default UploadPhoto