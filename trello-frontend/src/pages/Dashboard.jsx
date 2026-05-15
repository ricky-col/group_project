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

import { useEffect, useState } from "react";
import API from "../services/api";
import useBoardStore from "../store/boardStore";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Common/Footer";

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

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">

      {/* 🔥 NAVBAR */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-[#111111]">

        <div 
          onClick={() => navigate("/dashboard")} 
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
        >
          <img 
            src="https://cdn-icons-png.flaticon.com/512/6124/6124991.png" 
            alt="Logo" 
            className="w-7 h-7 invert" 
          />
          <h1 className="text-xl font-bold tracking-wide">
            TaskFlow
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-300">
            {user?.name || "User"}
          </span>

          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* 🔥 CONTENT */}
      <div className="p-6 min-h-[100vh]">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            Your Boards
          </h2>


        </div>

        {/* BOARDS GRID */}
        <div className="grid grid-cols-4 gap-6">

          {/* EXISTING BOARDS */}
          {boards?.map((b) => (
            <div
              key={b._id}
              onClick={() => navigate(`/board/${b._id}`)}
              className="bg-[#0f0f0f] border border-white/10 p-5 rounded-xl cursor-pointer
              hover:bg-[#1a1a1a] hover:border-white/30 transition"
            >
              <h3 className="text-lg font-semibold mb-2">
                {b.title}
              </h3>

              <p className="text-sm text-gray-400">
                Open board →
              </p>
            </div>
          ))}

          {/* ADD NEW BOARD CARD */}
          <div
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center border-2 border-dashed
            border-white/20 rounded-xl cursor-pointer hover:bg-[#0f0f0f] hover:border-white/40 transition"
          >
            <span className="text-gray-400">+ New Board</span>
          </div>

        </div>
      </div>

      {/* 🔥 MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

          <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-xl w-[350px] shadow-2xl">

            <h2 className="text-lg font-semibold mb-4 text-white">
              Create New Board
            </h2>

            <input
              placeholder="Board title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 mb-4 rounded bg-black border border-white/20 text-white placeholder-gray-500 outline-none focus:border-white/50 transition"
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-2 text-gray-400 hover:text-white transition"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateBoard}
                className="bg-white text-black px-4 py-2 rounded font-medium hover:bg-gray-200 transition"
              >
                Create
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