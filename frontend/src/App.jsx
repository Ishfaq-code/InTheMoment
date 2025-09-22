import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import Login from "./pages/Login";
import Main from "./pages/Main";
import { auth } from "./utils/firebase";
import DisplayNameForm from "./pages/DisplayNameForm";
import AlbumPage from "./pages/AlbumPage";


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <>
<Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/main" /> : <Login />}
        />
        <Route
          path="/main"
          element={user ? <Main /> : <Navigate to="/" />}
        />

        <Route
          path="/display-name"
          element={<DisplayNameForm />}
        />
         <Route path="/albums/:albumId" element={<AlbumPage />} />

      </Routes>
    </Router>    </>
  )
}

export default App
