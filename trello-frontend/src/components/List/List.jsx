import { useEffect } from "react";
import API from "../../services/api";
import useBoardStore from "../../store/boardStore";
import AddCard from "../Card/AddCard";
import DraggableCard from "../Card/DraggableCard";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { X, GripVertical } from "lucide-react";

export default function List({ list, boardId, onCardClick }) {
  const cards = useBoardStore((state) => state.cards);
  const setCardsByList = useBoardStore((state) => state.setCardsByList);
  const setLists = useBoardStore((state) => state.setLists);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list._id,
    data: { type: "List", listId: list._id },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.45 : 1,
  };

  const fetchCards = async () => {
    try {
      const res = await API.get(`/card/get/${list._id}`);
      setCardsByList(list._id, res.data.payload);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteList = async () => {
    if (listCards.length > 0) {
      alert("Cannot delete a list that still has cards.");
      return;
    }
    if (!window.confirm("Delete this list?")) return;
    try {
      await API.delete(`/list/delete/${list._id}`);
      const currentLists = useBoardStore.getState().lists;
      setLists(currentLists.filter((l) => l._id !== list._id));
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to delete list");
    }
  };

  useEffect(() => {
    fetchCards();
  }, [list._id]);

  const listCards = cards[list._id] || [];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        w-full sm:w-[272px] flex-shrink-0 flex flex-col rounded-2xl
        bg-[#161b27]/85 backdrop-blur-2xl
        border border-white/[0.08]
        shadow-[0_4px_24px_rgba(0,0,0,0.45)]
        transition-all duration-200
        ${isDragging ? "ring-1 ring-blue-500/40 shadow-blue-900/30 scale-[0.98]" : ""}
      `}
    >
      {/* HEADER */}
      <div
        {...attributes}
        {...listeners}
        className="flex items-center justify-between px-3.5 pt-3.5 pb-2 cursor-grab active:cursor-grabbing group select-none"
      >
        <div className="flex items-center gap-2 min-w-0">
          <GripVertical className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-400 transition-colors flex-shrink-0" />
          <h3 className="font-bold text-[13px] text-gray-100 truncate tracking-wide">
            {list.title}
          </h3>
          <span className="text-[10px] font-bold text-gray-500 bg-white/[0.05] px-1.5 py-0.5 rounded-full border border-white/[0.07] flex-shrink-0 min-w-[18px] text-center">
            {listCards.length}
          </span>
        </div>

        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={handleDeleteList}
          className="p-1 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0 border border-transparent hover:border-red-500/20"
          title="Delete list"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Divider */}
      <div className="mx-3.5 h-px bg-white/[0.05] mb-2" />

      {/* CARDS */}
      <div className="flex flex-col gap-1.5 px-2.5 min-h-[12px] flex-1">
        <SortableContext
          items={listCards.map((c) => c._id)}
          strategy={verticalListSortingStrategy}
        >
          {listCards.map((card) => (
            <DraggableCard
              key={card._id}
              card={card}
              onClick={() => onCardClick(card)}
            />
          ))}
        </SortableContext>
      </div>

      {/* ADD CARD */}
      <div className="px-2.5 pb-2.5 pt-1.5">
        <AddCard listId={list._id} boardId={boardId} />
      </div>
    </div>
  );
}
