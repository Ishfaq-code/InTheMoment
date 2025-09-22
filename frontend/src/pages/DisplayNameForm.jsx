import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { auth } from '../utils/firebase'

const DisplayNameForm = () => {
  const [name, setName] = useState("")
  const navigate = useNavigate();

  const saveDisplayName = async () => {
    const token = await auth.currentUser.getIdToken();  
    if(name){
    await fetch(`http://localhost:8000/users`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
    });
    navigate("/main")
  }
  else{
    alert("No name")
  }

  }

  return (
    <>
        <input onChange={(e) => setName(e.target.value)} />
        <button onClick={saveDisplayName}>Submit</button>
    </>
  )
 
}

export default DisplayNameForm