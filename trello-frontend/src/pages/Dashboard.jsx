// ============================================================
// Previous commented-out versions preserved below
// ============================================================

import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import useBoardStore from "../store/boardStore";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Common/Footer";
import { Trash2, User, Search, Plus, Users, Clock, LayoutGrid, Star, ChevronRight } from "lucide-react";

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
      const res = await API.post("/board/create", { title });
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
    e.stopPropagation();
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

  useEffect(() => {
    fetchBoards();
  }, []);

  const filteredBoards = boards?.filter(b =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Card gradient accents
  const accents = [
    "from-violet-500 via-purple-500 to-indigo-500",
    "from-cyan-400 via-sky-500 to-blue-500",
    "from-emerald-400 via-green-500 to-teal-500",
    "from-rose-400 via-pink-500 to-fuchsia-500",
    "from-amber-400 via-orange-400 to-red-400",
    "from-indigo-400 via-blue-500 to-cyan-400",
  ];

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0d14] text-white font-sans">

      {/* ─── NAVBAR ─── */}
      <header className="sticky top-0 z-50 flex justify-between items-center px-5 sm:px-8 py-3 bg-[#0a0d14]/90 backdrop-blur-xl border-b border-white/[0.06]">

        {/* Left: Logo + Search */}
        <div className="flex items-center gap-5 flex-1">
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
              <LayoutGrid className="w-4 h-4 text-white" />
            </div>
            <span className="text-[15px] font-bold text-white tracking-tight hidden sm:block">Trello</span>
          </div>

          <div className="hidden md:flex items-center relative max-w-xs w-full">
            <Search className="absolute left-3 h-3.5 w-3.5 text-gray-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search boards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07] text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.06] transition-all"
            />
          </div>
        </div>

        {/* Right: Create + Avatar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-md shadow-blue-600/20 hover:shadow-blue-500/30"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create</span>
          </button>

          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                {userInitial}
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-300">{user?.name || "User"}</span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-[#13181f]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl py-2 z-50">
                <div className="px-4 py-2.5 border-b border-white/[0.06]">
                  <p className="text-sm font-semibold text-white truncate">{user?.name || "User"}</p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email || ""}</p>
                </div>
                <div className="p-1.5 flex flex-col gap-0.5">
                  <button
                    onClick={() => { setShowUserMenu(false); navigate("/dashboard"); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-300 hover:bg-white/[0.05] hover:text-white rounded-xl transition-all text-left"
                  >
                    <User className="w-3.5 h-3.5 text-gray-500" />
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all text-left"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex flex-1">

        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 border-r border-white/[0.05] px-3 py-6 gap-1">
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-3 mb-2">Workspace</p>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.05] text-white text-sm font-semibold border border-white/[0.07]">
            <LayoutGrid className="w-4 h-4 text-blue-400" />
            Boards
          </button>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-white/[0.04] hover:text-gray-200 text-sm font-medium transition-all">
            <Users className="w-4 h-4" />
            Members
          </button>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-white/[0.04] hover:text-gray-200 text-sm font-medium transition-all">
            <Star className="w-4 h-4" />
            Starred
          </button>

          <div className="mt-auto pt-4 border-t border-white/[0.05]">
            <div className="px-3 py-2.5 rounded-xl bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border border-blue-500/20">
              <p className="text-xs font-bold text-blue-300 mb-0.5">Pro Workspace</p>
              <p className="text-[11px] text-gray-500">
                {boards?.length || 0} / ∞ boards
              </p>
            </div>
          </div>
        </aside>

        {/* Main workspace area */}
        <main className="flex-1 px-6 sm:px-8 py-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">

            {/* Page title */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  My Workspace
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {filteredBoards.length} board{filteredBoards.length !== 1 ? "s" : ""}
                  {searchQuery ? ` matching "${searchQuery}"` : ""}
                </p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="sm:hidden flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                New
              </button>
            </div>

            {/* Board grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

              {filteredBoards.map((b, index) => {
                const accent = accents[index % accents.length];
                const date = b.updatedAt
                  ? new Date(b.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })
                  : null;

                return (
                  <div
                    key={b._id}
                    onClick={() => navigate(`/board/${b._id}`)}
                    className="group relative rounded-2xl bg-[#13181f] border border-white/[0.07] hover:border-white/[0.14] cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.7)] flex flex-col"
                  >
                    {/* Gradient header */}
                    <div className={`h-20 bg-gradient-to-br ${accent} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#13181f] to-transparent" />
                    </div>

                    {/* Card body */}
                    <div className="px-4 pb-4 pt-1 flex flex-col flex-1">
                      <h3 className="font-bold text-[14px] text-white truncate mb-3 group-hover:text-blue-300 transition-colors">
                        {b.title}
                      </h3>

                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-1 text-[11px] text-gray-600">
                          <Clock className="w-3 h-3" />
                          <span>{date || "—"}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-gray-600">
                          <Users className="w-3 h-3" />
                          <span>{(b.members?.length || 0) + 1}</span>
                        </div>
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={(e) => handleDeleteBoard(e, b._id)}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/40 hover:bg-red-500/20 text-white/60 hover:text-red-400 opacity-0 group-hover:opacity-100 border border-transparent hover:border-red-500/30 transition-all duration-200"
                      title="Delete board"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}

              {/* Create new board tile */}
              <div
                onClick={() => setShowModal(true)}
                className="group relative rounded-2xl border-2 border-dashed border-white/[0.08] hover:border-blue-500/40 bg-white/[0.01] hover:bg-blue-500/[0.04] cursor-pointer transition-all duration-300 hover:-translate-y-1 flex flex-col items-center justify-center min-h-[120px] gap-2 px-4 py-8"
              >
                <div className="w-9 h-9 rounded-full border border-white/10 group-hover:border-blue-500/40 bg-white/[0.04] group-hover:bg-blue-500/10 flex items-center justify-center transition-all">
                  <Plus className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
                </div>
                <p className="text-sm font-semibold text-gray-500 group-hover:text-gray-300 transition-colors">
                  Create board
                </p>
              </div>

            </div>
          </div>
        </main>
      </div>

      {/* ─── CREATE BOARD MODAL ─── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="w-full max-w-sm bg-[#13181f] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden">
            {/* Modal accent top bar */}
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />

            <div className="p-6">
              <h2 className="text-lg font-bold text-white mb-1">Create a new board</h2>
              <p className="text-xs text-gray-500 mb-5">Give your board a name to get started.</p>

              <div className="mb-4">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Board name</label>
                <input
                  placeholder="e.g. Marketing Sprint"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateBoard()}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 transition-all"
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowModal(false); setTitle(""); }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateBoard}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 hover:shadow-blue-500/30 transition-all"
                >
                  Create Board
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── FOOTER ─── */}
      <Footer />
    </div>
  );
}