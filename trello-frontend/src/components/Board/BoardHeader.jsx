import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  Mail,
  History,
  Star,
  LogOut,
  Edit2,
  Check,
  X,
  Plus,
  ArrowLeft,
  ChevronDown,
  Plug,
  Zap,
  Filter,
  MoreHorizontal,
  UserPlus,
  Kanban
} from "lucide-react";
import API from "../../services/api";
import useAuthStore from "../../store/authStore";

export default function BoardHeader({ board, boardId, onBoardUpdate }) {
  const [showActivity, setShowActivity] = useState(false);
  const [activities, setActivities] = useState([]);
  const [email, setEmail] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [isStarred, setIsStarred] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [inviteStatus, setInviteStatus] = useState(null); // 'sending' | 'success' | 'error'
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showMembersMenu, setShowMembersMenu] = useState(false);
  const [showViewsMenu, setShowViewsMenu] = useState(false);
  const [showBoardMenu, setShowBoardMenu] = useState(false);

  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const userMenuRef = useRef(null);
  const shareMenuRef = useRef(null);
  const membersMenuRef = useRef(null);
  const viewsMenuRef = useRef(null);
  const boardMenuRef = useRef(null);

  // Sync title when board data changes
  useEffect(() => {
    if (board) {
      setNewTitle(board.title);
    }
  }, [board]);

  // Click outside to close menus
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
        setShowShareMenu(false);
      }
      if (membersMenuRef.current && !membersMenuRef.current.contains(event.target)) {
        setShowMembersMenu(false);
      }
      if (viewsMenuRef.current && !viewsMenuRef.current.contains(event.target)) {
        setShowViewsMenu(false);
      }
      if (boardMenuRef.current && !boardMenuRef.current.contains(event.target)) {
        setShowBoardMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openActivity = async () => {
    if (!boardId) return;
    try {
      const res = await API.get(`/activity/${boardId}`);
      setActivities(res.data.payload);
      setShowActivity(true);
    } catch (err) {
      console.error("Failed to fetch activity:", err);
    }
  };


  const handleInvite = async (e) => {
    e.preventDefault();
    if (!email) return;

    setInviteStatus("sending");
    try {
      await API.post("/board/invite", {
        email,
        boardId,
      });
      setInviteStatus("success");
      setEmail("");
      setTimeout(() => setInviteStatus(null), 3000);
      if (onBoardUpdate) onBoardUpdate();
    } catch (err) {
      console.error(err);
      setInviteStatus("error");
      alert("Failed to send invite: " + (err.response?.data?.message || "Unknown error"));
      setTimeout(() => setInviteStatus(null), 3000);
    }
  };

  const handleRenameSubmit = async () => {
    if (!newTitle.trim() || newTitle === board?.title) {
      setIsRenaming(false);
      return;
    }

    try {
      await API.put(`/board/${boardId}`, {
        title: newTitle.trim()
      });
      setIsRenaming(false);
      if (onBoardUpdate) onBoardUpdate();
    } catch (err) {
      console.error("Failed to rename board:", err);
      setNewTitle(board?.title || "");
      setIsRenaming(false);
    }
  };

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
      logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Helper to generate avatar color & initials
  const getAvatarInfo = (name) => {
    if (!name) return { initials: "?", color: "bg-gray-600" };
    const words = name.trim().split(" ");
    const initials = words.map(w => w[0]).join("").toUpperCase().slice(0, 2);

    // Curated sleek background colors
    const colors = [
      "bg-rose-500/80 text-rose-100 border-rose-400/30",
      "bg-emerald-500/80 text-emerald-100 border-emerald-400/30",
      "bg-sky-500/80 text-sky-100 border-sky-400/30",
      "bg-amber-500/80 text-amber-100 border-amber-400/30",
      "bg-indigo-500/80 text-indigo-100 border-indigo-400/30",
      "bg-violet-500/80 text-violet-100 border-violet-400/30",
      "bg-teal-500/80 text-teal-100 border-teal-400/30"
    ];

    const charSum = name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const color = colors[charSum % colors.length];

    return { initials, color };
  };

  const ownerAvatar = board?.owner ? getAvatarInfo(board.owner.name) : null;

  return (
    <>
      <header className="w-full relative z-[50] flex items-center justify-between px-2 sm:px-4 py-2 sm:py-2.5 bg-slate-900 border-b border-slate-800 text-slate-200 shadow-md">

        {/* LEFT: Board Title & Icons */}
        <div className="flex items-center gap-0.5 sm:gap-1 min-w-0">

          {/* Title Area */}
          <div className="flex items-center">
            {isRenaming ? (
              <div className="flex items-center gap-1 mr-2">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onBlur={handleRenameSubmit}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRenameSubmit();
                    if (e.key === "Escape") {
                      setNewTitle(board?.title || "");
                      setIsRenaming(false);
                    }
                  }}
                  autoFocus
                  className="px-3 py-1 rounded bg-[#0f172a] text-white border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium text-lg max-w-[200px]"
                />
                <button
                  onMouseDown={handleRenameSubmit}
                  className="p-1 hover:bg-white/10 rounded text-emerald-400"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onMouseDown={() => {
                    setNewTitle(board?.title || "");
                    setIsRenaming(false);
                  }}
                  className="p-1 hover:bg-white/10 rounded text-rose-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                className="flex items-center px-1.5 sm:px-2 py-1 hover:bg-white/20 rounded cursor-pointer transition-colors duration-150 mr-1 min-w-0"
                onClick={() => navigate("/dashboard")}
                title="Back to Dashboard"
              >
                <h1 className="font-bold text-sm sm:text-[18px] leading-tight text-white select-none truncate max-w-[100px] sm:max-w-[180px] md:max-w-xs">
                  {board?.title || "Loading Board..."}
                </h1>
              </div>
            )}
          </div>

          <div className="hidden sm:block relative" ref={viewsMenuRef}>
            <button
              onClick={() => setShowViewsMenu(!showViewsMenu)}
              className="p-1.5 hover:bg-white/20 rounded transition-colors duration-150 text-white"
            >
              <Kanban className="w-4 h-4" />
            </button>
            {showViewsMenu && (
              <div className="absolute left-0 mt-2.5 w-48 bg-white rounded-md shadow-2xl overflow-hidden py-2 text-gray-700 z-50">
                <div className="px-3 py-1.5 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Pro Views
                </div>
                <div className="px-3 py-2 text-sm text-gray-600">
                  Table, Calendar, and Timeline views are available in Premium.
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={boardMenuRef}>
            <button
              onClick={() => setShowBoardMenu(!showBoardMenu)}
              className="p-1.5 hover:bg-white/20 rounded transition-colors duration-150 text-white"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            {showBoardMenu && (
              <div className="absolute left-0 mt-2.5 w-48 bg-white rounded-md shadow-2xl overflow-hidden py-1.5 text-gray-700 z-50">
                <button
                  onClick={() => {
                    setShowBoardMenu(false);
                    setIsRenaming(true);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition"
                >
                  Rename Board
                </button>
                <button
                  onClick={() => setShowBoardMenu(false)}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition"
                >
                  Board Settings
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Actions & Avatar */}
        <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">

          {/* Action Icons */}
          <div className="flex items-center gap-0.5 sm:mr-2">
            <button
              onClick={() => setIsStarred(!isStarred)}
              className={`hidden sm:flex p-1.5 hover:bg-white/20 rounded transition-colors duration-150 ${isStarred ? "text-yellow-400" : "text-white"}`}
              title="Star Board"
            >
              <Star className={`w-4 h-4 ${isStarred ? "fill-yellow-400" : ""}`} />
            </button>

            {/* Members / Collaborators */}
            <div className="relative" ref={membersMenuRef}>
              <button
                onClick={() => setShowMembersMenu(!showMembersMenu)}
                className="p-1.5 hover:bg-white/20 rounded transition-colors duration-150 text-white"
                title="Board Members"
              >
                <Users className="w-4 h-4" />
              </button>

              {showMembersMenu && (
                <div className="absolute right-0 mt-2.5 w-64 bg-white rounded-md shadow-2xl overflow-hidden py-2 text-gray-700 z-50">
                  <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-semibold text-sm">Board Members</h3>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 font-medium">
                      {(board?.members?.length || 0) + (board?.owner ? 1 : 0)}
                    </span>
                  </div>

                  <div className="max-h-60 overflow-y-auto p-2 flex flex-col gap-1">
                    {/* Board Owner */}
                    {board?.owner && ownerAvatar && (
                      <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${ownerAvatar.color}`}>
                          {ownerAvatar.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {board.owner.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">Owner</p>
                        </div>
                      </div>
                    )}

                    {/* Other Members */}
                    {board?.members?.map((member) => {
                      const info = getAvatarInfo(member.name);
                      return (
                        <div key={member._id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${info.color}`}>
                            {info.initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {member.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">Member</p>
                          </div>
                        </div>
                      );
                    })}

                    {(!board?.members || board.members.length === 0) && !board?.owner && (
                      <div className="text-center py-4 text-sm text-gray-500">
                        No members found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Share & More */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Share */}
            <div className="relative" ref={shareMenuRef}>
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center gap-1 sm:gap-1.5 bg-[#dfe1e6] hover:bg-white text-[#172b4d] px-2 sm:px-3 py-1.5 rounded text-xs sm:text-sm font-medium transition-colors duration-150"
              >
                <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline sm:inline">Share</span>
              </button>

              {showShareMenu && (
                <div className="absolute right-0 mt-2.5 w-72 bg-white rounded-md shadow-2xl overflow-hidden py-3 px-4 text-gray-700 z-50">
                  <h3 className="font-semibold text-sm mb-3">Share Board</h3>
                  <form onSubmit={handleInvite} className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email address..."
                        className="w-full bg-gray-50 border border-gray-200 text-sm text-gray-800 rounded px-3 py-1.5 pl-9 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={inviteStatus === "sending"}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-1.5 text-sm font-medium transition disabled:opacity-50 min-w-[70px] flex justify-center items-center h-8"
                    >
                      {inviteStatus === "sending" ? (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : inviteStatus === "success" ? (
                        <Check className="w-4 h-4" />
                      ) : inviteStatus === "error" ? (
                        <X className="w-4 h-4" />
                      ) : (
                        "Invite"
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>

            <button
              onClick={openActivity}
              className="p-1.5 hover:bg-white/20 rounded transition-colors duration-150 text-white sm:mr-1"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Avatar / Account */}
          <div className="flex items-center ml-1 border-l border-white/20 pl-3">
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-7 h-7 rounded-full bg-red-500 hover:opacity-90 flex items-center justify-center text-xs font-semibold text-white relative transition-opacity duration-150"
              >
                {user?.name ? user.name[0].toUpperCase() : "U"}
                <div className="absolute -bottom-1 -right-1 bg-white p-[2px] rounded-full">
                  <Kanban className="w-2.5 h-2.5 text-blue-600" />
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2.5 w-56 bg-white rounded-md shadow-2xl overflow-hidden py-1.5 text-gray-700 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Account</p>
                    <p className="font-medium truncate text-sm mt-0.5">{user?.name || "User"}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email || ""}</p>
                  </div>

                  <button
                    onClick={() => navigate("/dashboard")}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition"
                  >
                    Dashboard
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </header>

      {/* 🔥 SLIDE-IN ACTIVITY DRAWER */}
      {showActivity && (
        <div className="fixed inset-0 z-[10000] flex">
          {/* Overlay */}
          <div
            className="flex-1 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowActivity(false)}
          />

          {/* Drawer Panel */}
          <div className="w-[380px] h-full bg-[#090d16]/95 backdrop-blur-2xl border-l border-white/10 p-6 text-white shadow-2xl flex flex-col">

            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-gray-300" />
                <h2 className="font-semibold text-lg">Activity History</h2>
              </div>
              <button
                onClick={() => setShowActivity(false)}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4">
              {activities.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 py-12">
                  <History className="w-12 h-12 text-gray-600 mb-3" />
                  <p className="text-sm">No activity logged for this board yet</p>
                </div>
              ) : (
                activities.map((act, i) => {
                  const avatar = getAvatarInfo(act.userId?.name);
                  return (
                    <div key={i} className="flex gap-3 text-sm p-3 rounded-lg bg-white/5 border border-white/5 transition hover:bg-white/10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${avatar.color}`}>
                        {avatar.initials}
                      </div>

                      <div className="flex-1">
                        <div>
                          <span className="font-semibold text-white">{act.userId?.name || "Unknown User"}</span>{" "}
                          <span className="text-gray-300">{act.action}</span>
                        </div>
                        <div className="text-[11px] text-gray-400 mt-1">
                          {new Date(act.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}