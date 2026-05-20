// import { useEffect, useState } from "react";
// import API from "../services/api";
// import useBoardStore from "../store/boardStore";
// import { useNavigate } from "react-router-dom";

// export default function Dashboard() {
//   const { boards, setBoards } = useBoardStore();
//   const navigate = useNavigate();

// const userData = localStorage.getItem("user");

// const user = userData ? JSON.parse(userData) : null;
//   // 🔥 MODAL STATE
//   const [showModal, setShowModal] = useState(false);
//   const [title, setTitle] = useState("");

//   // 🔥 FETCH BOARDS
//   const fetchBoards = async () => {
//     try {
//       const res = await API.get("/board/get");
//       setBoards(res.data.payload);
//     } catch (err) {
//       console.log("FETCH ERROR:", err.response?.data || err);
//     }
//   };

//   // 🔥 CREATE BOARD
//   const handleCreateBoard = async () => {
//   try {
//     if (!title.trim()) {
//       alert("Enter board title");
//       return;
//     }

//     const res = await API.post("/board/create", {
//       title,
//       members: [],
//     });

//     console.log("CREATED:", res.data);

//     // ✅ IMPORTANT FIX
//     setBoards([...boards, res.data.board]);

//     // ✅ reset UI
//     setShowModal(false);
//     setTitle("");

//   } catch (err) {
//     console.log("CREATE ERROR:", err.response?.data || err);
//   }
// };

//   // 🔥 LOGOUT
//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     window.location.href = "/login";
//   };

//   useEffect(() => {
//     fetchBoards();
//   }, []);

//   return (
//     <div className="min-h-screen bg-[#0f172a] text-white">

//       {/* 🔥 NAVBAR */}
//       <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">

//         <h1 className="text-xl font-bold tracking-wide">
//           TaskFlow 🚀
//         </h1>

//         <div className="flex items-center gap-4">
//           <span className="text-sm text-gray-300">
//             {user?.name || "User"}
//           </span>

//           <button
//             onClick={handleLogout}
//             className="bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-600"
//           >
//             Logout
//           </button>
//         </div>
//       </div>

//       {/* 🔥 CONTENT */}
//       <div className="p-6">

//         {/* HEADER */}
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-semibold">Your Boards</h2>

//           <button
//             onClick={() => setShowModal(true)}
//             className="bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 rounded-lg hover:scale-105 transition"
//           >
//             + Create Board
//           </button>
//         </div>

//         {/* BOARDS GRID */}
//         <div className="grid grid-cols-4 gap-6">

//           {/* BOARDS */}
//           {boards?.map((b) => (
//             <div
//               key={b._id}
//               onClick={() => navigate(`/board/${b._id}`)}
//               className="bg-white/10 border border-white/10 p-5 rounded-xl cursor-pointer 
//               hover:bg-white/20 transition backdrop-blur-lg"
//             >
//               <h3 className="text-lg font-semibold mb-2">
//                 {b.title}
//               </h3>

//               <p className="text-sm text-gray-400">
//                 Open board →
//               </p>
//             </div>
//           ))}

//           {/* ADD NEW CARD */}
//           <div
//             onClick={() => setShowModal(true)}
//             className="flex items-center justify-center border-2 border-dashed 
//             border-white/20 rounded-xl cursor-pointer hover:bg-white/10"
//           >
//             <span className="text-gray-400">+ New Board</span>
//           </div>

//         </div>
//       </div>

//       {/* 🔥 MODAL */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

//           <div className="bg-[#1e293b] p-6 rounded-xl w-[350px] shadow-xl">

//             <h2 className="text-lg font-semibold mb-4">
//               Create New Board
//             </h2>

//             <input
//               placeholder="Board title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="w-full p-3 mb-4 rounded bg-white/10 border border-white/10"
//             />

//             <div className="flex justify-end gap-3">

//               <button
//                 onClick={() => setShowModal(false)}
//                 className="px-3 py-2 text-gray-400"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={handleCreateBoard}
//                 type="button"   // ✅ ADD THIS
//               >
//                 Create
//               </button> 


//             </div>
//           </div>

//         </div>
//       )}

//     </div>
//   );
// }

import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import useBoardStore from "../store/boardStore";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Common/Footer";
import { Trash2, User, Search } from "lucide-react";

export default function Dashboard() {
  const { logout } = useAuthStore();
  const { boards, setBoards } = useBoardStore();
  const navigate = useNavigate();

  // ✅ SAFE USER PARSE (NO CRASH)
  let user = null;
  try {
    const data = localStorage.getItem("user");
    user = data && data !== "undefined" ? JSON.parse(data) : null;
  } catch (err) {
    console.log("JSON parse error:", err);
  }

  // 🔥 STATE
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ==========================
  // ✅ FETCH BOARDS
  // ==========================
  const fetchBoards = async () => {
    try {
      const res = await API.get("/board/get");
      setBoards(res.data.payload);
    } catch (err) {
      console.log("FETCH ERROR:", err.response?.data || err);
    }
  };

  // ==========================
  // ✅ CREATE BOARD
  // ==========================
  const handleCreateBoard = async () => {
    try {
      if (!title.trim()) {
        alert("Enter board title");
        return;
      }

      const res = await API.post("/board/create", {
        title,
      });

      // ✅ UPDATE UI
      setBoards([...boards, res.data.board]);

      setShowModal(false);
      setTitle("");
    } catch (err) {
      console.log("CREATE ERROR:", err.response?.data || err);
    }
  };

  // ==========================
  // ✅ DELETE BOARD
  // ==========================
  const handleDeleteBoard = async (e, boardId) => {
    e.stopPropagation(); // Prevent card click
    if (!window.confirm("Are you sure you want to delete this board?")) return;

    try {
      await API.delete(`/board/delete/${boardId}`);
      setBoards(boards.filter((b) => b._id !== boardId));
    } catch (err) {
      console.log("DELETE ERROR:", err.response?.data || err);
      alert("Failed to delete board");
    }
  };

  // ==========================
  // ✅ LOGOUT
  // ==========================
  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (err) {
      console.log("Logout error:", err);
    }
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    logout();
    navigate("/login");
  };

  // ==========================
  // ✅ LOAD DATA
  // ==========================
  useEffect(() => {
    fetchBoards();
  }, []);

  const filteredBoards = boards?.filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase())) || [];

  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-sans">

      {/* 🔥 NAVBAR */}
      <header className="sticky top-0 z-40 flex justify-between items-center px-4 sm:px-6 py-2 bg-black border-b border-[#3a3f45] text-slate-200 shadow-sm">

        <div className="flex items-center gap-4 flex-1">
          <div 
            onClick={() => navigate("/")} 
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="bg-blue-600 p-1 rounded-sm group-hover:bg-blue-500 transition-colors">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/6124/6124991.png" 
                alt="Logo" 
                className="w-5 h-5 invert" 
              />
            </div>
            <h1 className="text-xl font-bold tracking-wide text-white">
              Trello
            </h1>
          </div>

          {/* SEARCH BAR */}
          <div className="hidden md:flex items-center relative max-w-sm w-full ml-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search boards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-9 pr-3 py-1.5 border border-[#3a3f45] rounded bg-[#22272b] text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-white focus:text-gray-900 focus:border-white sm:text-sm transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="relative" ref={userMenuRef}>
            <div 
              className="flex items-center gap-2 cursor-pointer hover:bg-white/10 p-1.5 rounded-md transition-colors"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white shadow-inner overflow-hidden border border-white/20">
                <User className="w-5 h-5 text-gray-300" />
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-200">
                {user?.name || "User"}
              </span>
            </div>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-[#111111] border border-white/10 rounded-md shadow-xl py-1 z-50">
                <div className="px-4 py-2 border-b border-white/10">
                  <p className="text-sm font-medium text-white">{user?.name || "User"}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email || "user@example.com"}</p>
                </div>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    // Add profile details navigation here if needed
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  Profile Details
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10 hover:text-red-300 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 🔥 CONTENT */}
      <div 
        className="relative flex-1 p-6 sm:p-10 min-h-[100vh] bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: "linear-gradient(to bottom right, rgba(15, 23, 42, 0.9), rgba(0, 0, 0, 0.95)), url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')",
        }}
      >
        <div className="max-w-7xl mx-auto w-full">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-300 mb-2 uppercase tracking-wide">
                Your Workspaces
              </h2>
            </div>
          </div>

          {/* BOARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

            {/* EXISTING BOARDS */}
            {filteredBoards.map((b, index) => {
              const bgOptions = [
                "url('https://images.unsplash.com/photo-1542273917363-3b1817f69a5d?q=80&w=600')",
                "linear-gradient(to right, #8e2de2, #4a00e0)",
                "linear-gradient(to right, #00c6ff, #0072ff)",
                "url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600')",
                "linear-gradient(to bottom right, #ff9966, #ff5e62)"
              ];
              const bg = bgOptions[index % bgOptions.length];

              return (
                <div
                  key={b._id}
                  onClick={() => navigate(`/board/${b._id}`)}
                  className="relative group rounded-lg cursor-pointer overflow-hidden flex flex-col h-28 w-full hover:brightness-110 transition-all shadow-sm"
                >
                  <div 
                    className="flex-1 bg-cover bg-center"
                    style={{ background: bg }}
                  ></div>
                  <div className="h-[36px] bg-[#22272b] px-3 py-1 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-300 truncate">
                      {b.title}
                    </h3>
                  </div>

                  <button
                    onClick={(e) => handleDeleteBoard(e, b._id)}
                    className="absolute top-2 right-2 text-white/80 hover:text-red-400 opacity-0 group-hover:opacity-100 bg-black/40 hover:bg-black/70 p-1.5 rounded transition-all duration-200"
                    title="Delete Board"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}

            {/* ADD NEW BOARD CARD */}
            <div
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center h-28 w-full bg-[#22272b] hover:bg-[#2c333a] rounded-lg cursor-pointer transition-colors shadow-sm"
            >
              <span className="text-gray-300 text-sm font-medium">Create new board</span>
            </div>

          </div>
        </div>
      </div>

      {/* 🔥 MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">

          <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl w-[90vw] max-w-[420px] shadow-2xl animate-in zoom-in-95 duration-200">

            <h2 className="text-2xl font-bold mb-6 text-white text-center">
              Create a New Board
            </h2>

            <input
              placeholder="E.g., Marketing Campaign"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-4 mb-6 rounded-xl bg-black/50 border border-slate-600 text-white placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              autoFocus
            />

            <div className="flex gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 px-4 rounded-xl text-gray-400 font-medium hover:bg-slate-800 hover:text-white transition-all"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateBoard}
                className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all"
              >
                Create Board
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔥 FOOTER */}
      <Footer />
    </div>
  );
}