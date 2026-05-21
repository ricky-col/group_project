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
  const [sidebarView, setSidebarView] = useState("boards");
  const [starredBoardIds, setStarredBoardIds] = useState([]);
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);

  // close user menu on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchBoards = async () => {
    try {
      const res = await API.get("/board/get");
      setBoards(res.data.payload);
    } catch (err) {
      console.log("fetch error:", err.response?.data || err);
    }
  };

  const fetchStarred = async () => {
    try {
      const res = await API.get("/board/starred");
      setStarredBoardIds(res.data.starredBoardIds || []);
    } catch (err) {
      console.log("starred fetch error:", err.response?.data || err);
    }
  };

  const fetchMembers = async () => {
    setMembersLoading(true);
    try {
      const res = await API.get("/board/members");
      setMembers(res.data.members || []);
    } catch (err) {
      console.log("members fetch error:", err.response?.data || err);
    } finally {
      setMembersLoading(false);
    }
  };

  const handleToggleStar = async (e, boardId) => {
    e.stopPropagation();
    try {
      const res = await API.put(`/board/star/${boardId}`);
      setStarredBoardIds(res.data.starredBoardIds || []);
    } catch (err) {
      console.log("star toggle error:", err.response?.data || err);
    }
  };

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
      console.log("create error:", err.response?.data || err);
      alert(err.response?.data?.message || "Error creating board. Please try again.");
    }
  };

  const handleDeleteBoard = async (e, boardId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this board?")) return;
    try {
      await API.delete(`/board/delete/${boardId}`);
      setBoards(boards.filter((b) => b._id !== boardId));
    } catch (err) {
      console.log("delete error:", err.response?.data || err);
      alert("Failed to delete board");
    }
  };

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

  const handleSidebarClick = (view) => {
    setSidebarView(view);
    if (view === "members") fetchMembers();
  };

  useEffect(() => {
    fetchBoards();
    fetchStarred();
  }, []);

  const filteredBoards = boards?.filter(b =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // show only starred when that tab is active
  const displayedBoards = sidebarView === "starred"
    ? filteredBoards.filter(b => starredBoardIds.includes(b._id))
    : filteredBoards;

  const accents = [
    "bg-violet-500",
    "bg-sky-500",
    "bg-emerald-500",
    "bg-pink-500",
    "bg-orange-400",
    "bg-blue-500",
  ];

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  const getViewTitle = () => {
    if (sidebarView === "starred") return "Starred Boards";
    if (sidebarView === "members") return "Members";
    return "My Workspace";
  };

  const getViewSubtitle = () => {
    if (sidebarView === "members") return `${members.length} member${members.length !== 1 ? "s" : ""}`;
    const count = displayedBoards.length;
    return `${count} board${count !== 1 ? "s" : ""}${searchQuery ? ` matching "${searchQuery}"` : ""}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white font-sans">

      {/* navbar */}
      <header className="sticky top-0 z-50 flex justify-between items-center px-5 sm:px-8 py-3 bg-[#000000]/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="flex items-center gap-5 flex-1">
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
          >
            <img 
              src="https://cdn-icons-png.flaticon.com/512/6124/6124991.png" 
              alt="Logo" 
              className="w-7 h-7 invert" 
            />
            <span className="text-[15px] font-bold text-white tracking-tight hidden sm:block">TaskFlow</span>
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

        <div className="flex items-center gap-3">
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                {userInitial}
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-300">{user?.name || "User"}</span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl py-2 z-50">
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

      {/* main content */}
      <div className="flex flex-1">

        {/* sidebar */}
        <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 border-r border-white/[0.05] px-3 py-6 gap-1">
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-3 mb-2">Workspace</p>

          <button
            onClick={() => handleSidebarClick("boards")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              sidebarView === "boards"
                ? "bg-white/[0.05] text-white border border-white/[0.07]"
                : "text-gray-400 hover:bg-white/[0.04] hover:text-gray-200 border border-transparent"
            }`}
          >
            <LayoutGrid className={`w-4 h-4 ${sidebarView === "boards" ? "text-blue-400" : ""}`} />
            Boards
          </button>

          <button
            onClick={() => handleSidebarClick("members")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              sidebarView === "members"
                ? "bg-white/[0.05] text-white border border-white/[0.07]"
                : "text-gray-400 hover:bg-white/[0.04] hover:text-gray-200 border border-transparent"
            }`}
          >
            <Users className={`w-4 h-4 ${sidebarView === "members" ? "text-blue-400" : ""}`} />
            Members
          </button>

          <button
            onClick={() => handleSidebarClick("starred")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              sidebarView === "starred"
                ? "bg-white/[0.05] text-white border border-white/[0.07]"
                : "text-gray-400 hover:bg-white/[0.04] hover:text-gray-200 border border-transparent"
            }`}
          >
            <Star className={`w-4 h-4 ${sidebarView === "starred" ? "text-yellow-400" : ""}`} />
            Starred
            {starredBoardIds.length > 0 && (
              <span className="ml-auto text-[10px] font-bold bg-yellow-500/15 text-yellow-400 px-1.5 py-0.5 rounded-md">
                {starredBoardIds.length}
              </span>
            )}
          </button>
        </aside>

        {/* workspace area */}
        <main className="flex-1 px-6 sm:px-8 py-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">

            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  {getViewTitle()}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {getViewSubtitle()}
                </p>
              </div>
              {sidebarView !== "members" && (
                <button
                  onClick={() => setShowModal(true)}
                  className="sm:hidden flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New
                </button>
              )}
            </div>

            {/* members view */}
            {sidebarView === "members" && (
              <div className="space-y-3">
                {membersLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : members.length === 0 ? (
                  <div className="text-center py-20">
                    <Users className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No members found</p>
                  </div>
                ) : (
                  members.map((member) => (
                    <div
                      key={member._id}
                      className="rounded-2xl bg-[#0a0a0a] border border-white/[0.07] p-4 hover:border-white/[0.12] transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                          {member.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{member.name}</p>
                          <p className="text-xs text-gray-500 truncate">{member.email}</p>

                          <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {member.boards.map((board) => (
                              <span
                                key={board._id}
                                onClick={() => navigate(`/board/${board._id}`)}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[11px] text-gray-400 hover:text-blue-300 hover:border-blue-500/30 hover:bg-blue-500/[0.06] cursor-pointer transition-all"
                              >
                                <LayoutGrid className="w-2.5 h-2.5" />
                                {board.title}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* boards / starred view */}
            {sidebarView !== "members" && (
              <>
                {sidebarView === "starred" && displayedBoards.length === 0 && (
                  <div className="text-center py-20">
                    <Star className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm font-medium">No starred boards yet</p>
                    <p className="text-gray-600 text-xs mt-1">Click the star icon on a board to add it here</p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {displayedBoards.map((b, index) => {
                    const accent = accents[index % accents.length];
                    const date = b.updatedAt
                      ? new Date(b.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })
                      : null;
                    const isStarred = starredBoardIds.includes(b._id);

                    return (
                      <div
                        key={b._id}
                        onClick={() => navigate(`/board/${b._id}`)}
                        className="group relative rounded-2xl bg-[#0a0a0a] border border-white/[0.07] cursor-pointer overflow-hidden flex flex-col"
                      >
                        <div className={`h-20 ${accent} relative overflow-hidden`}>
                          <div className="absolute inset-0 bg-black/20" />
                        </div>

                        <div className="px-4 pb-4 pt-1 flex flex-col flex-1">
                          <h3 className="font-bold text-[14px] text-white truncate mb-3">
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

                        {/* star */}
                        <button
                          onClick={(e) => handleToggleStar(e, b._id)}
                          className={`absolute top-2.5 left-2.5 p-1.5 rounded-lg transition-all duration-200 ${
                            isStarred
                              ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 opacity-100"
                              : "bg-black/40 text-white/60 hover:text-yellow-400 border border-transparent hover:border-yellow-500/30 opacity-0 group-hover:opacity-100"
                          }`}
                          title={isStarred ? "Unstar board" : "Star board"}
                        >
                          <Star className={`w-3.5 h-3.5 ${isStarred ? "fill-yellow-400" : ""}`} />
                        </button>

                        {/* delete */}
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

                  {sidebarView === "boards" && (
                    <div
                      onClick={() => setShowModal(true)}
                      className="group relative rounded-2xl border-2 border-dashed border-white/[0.08] bg-white/[0.01] cursor-pointer flex flex-col items-center justify-center min-h-[120px] gap-2 px-4 py-8"
                    >
                      <div className="w-9 h-9 rounded-full border border-white/10 group-hover:border-blue-500/40 bg-white/[0.04] group-hover:bg-blue-500/10 flex items-center justify-center transition-all">
                        <Plus className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
                      </div>
                      <p className="text-sm font-semibold text-gray-500 group-hover:text-gray-300 transition-colors">
                        Create board
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* create board modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="w-full max-w-sm bg-[#0a0a0a] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden">
            <div className="h-1 w-full bg-blue-500" />

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

      <Footer />
    </div>
  );
}