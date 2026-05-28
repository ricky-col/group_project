import { useState } from "react";
import API from "../../services/api";
import useBoardStore from "../../store/boardStore";

export default function AddCard({ listId, boardId }) {
  const [title, setTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setCardsByList } = useBoardStore();

  const handleAdd = async () => {
    if (!title.trim()) return;

    try {
      setLoading(true);

      const res = await API.post("/card/create", {
        title,
        description: "",
        listId,
        boardId, //  IMPORTANT
      });

      //  UPDATE UI IMMEDIATELY (DIRECT STORE UPDATE)
      const newCard = res.data.payload;
      setCardsByList(listId, (prev = []) => {
        // Prevent duplicates if socket already added it
        if (prev.find((c) => c._id === newCard._id)) return prev;
        return [...prev, newCard];
      });

      setTitle("");
      setIsAdding(false);
    } catch (err) {
      console.log("CREATE ERROR:", err);
      const errorMsg = err.response?.data?.message || err.message;
      const status = err.response?.status;
      alert(`Failed to create card (${status || "Unknown Status"}): ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2" onPointerDown={(e) => e.stopPropagation()}>
      {isAdding ? (
        <div className="bg-[#1e293b] p-2 rounded-lg shadow-lg">
          <textarea
            autoFocus
            className="w-full p-2 bg-[#0f172a] text-white rounded outline-none border border-blue-500/50 focus:border-blue-500"
            placeholder="Enter a title for this card..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAdd();
              }
            }}
          />

          <div className="flex items-center gap-2 mt-2">
            <button 
              onClick={handleAdd} 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded font-medium transition"
            >
              {loading ? "Adding..." : "Add card"}
            </button>
            <button 
              onClick={() => {
                setIsAdding(false);
                setTitle("");
              }}
              className="text-gray-400 hover:text-white px-2 py-1.5 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsAdding(true)} 
          className="w-full text-left text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all flex items-center gap-2"
        >
          <span className="text-xl">+</span> Add a card
        </button>
      )}
    </div>
  );
}