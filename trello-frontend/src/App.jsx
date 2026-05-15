import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BoardPage from "./pages/BoardPage";
import InvitePage from "./pages/invitePages";
import Landing from "./pages/Landing";


import useAuthStore from "./store/authStore";
import { useEffect } from "react";

function App() {
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [setUser]);

  return (
    <BrowserRouter>
      <Routes>
        {/* <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
        /> */}
        <Route path="/" element={<Landing />} />

        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />

        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />

        <Route
          path="/board/:id"
          element={user ? <BoardPage /> : <Navigate to="/login" />}
        />

        <Route path="/invite/:token" element={<InvitePage />} />
        <Route path="/board/:id" element={<BoardPage />} />


      </Routes>

    </BrowserRouter>
  );
}


export default App;