
import { useEffect, useState } from "react";
import API from "../../services/api";
import useBoardStore from "../../store/boardStore";
import AddCard from "../Card/AddCard";
import DraggableCard from "../Card/DraggableCard";
import { useDroppable } from "@dnd-kit/core";
import CardModal from "../Card/CardModal";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

export default function List({ list, boardId, onCardClick }) {
  // ✅ OPTIMIZED STORE USAGE
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
    data: {
      type: "List",
      listId: list._id,
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // ==========================
  // ✅ FETCH CARDS
  // ==========================
  const fetchCards = async () => {
    try {
      const res = await API.get(`/card/get/${list._id}`);
      setCardsByList(list._id, res.data.payload);
    } catch (err) {
      console.log(err);
    }
  };

  // ==========================
  // ✅ DELETE LIST
  // ==========================
  const handleDeleteList = async () => {
    if (listCards.length > 0) {
      alert("You cannot delete a list that still contains cards. Please move or delete the cards first.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this list?")) return;

    try {
      await API.delete(`/list/delete/${list._id}`);
      // ✅ FIXED (ZUSTAND SAFE UPDATE)
      const currentLists = useBoardStore.getState().lists;

      setLists(
        currentLists.filter((l) => l._id !== list._id)
      );

    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to delete list");
    }
  };

  // ==========================
  // ✅ LOAD CARDS
  // ==========================
  useEffect(() => {
    fetchCards();
  }, [list._id]);

  const listCards = cards[list._id] || [];

  return (
    <div
  ref={setNodeRef}
  style={style}
  {...attributes}
  {...listeners}
  className="bg-black/70 p-3 w-72 rounded-xl flex flex-col cursor-grab"
>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-gray-200">
          {list.title}
        </h3>

        {/* DELETE BUTTON */}
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={handleDeleteList}
          className="text-red-400 text-sm hover:text-red-600"
        >
          ✕
        </button>
      </div>

      {/* CARDS */}
      <div className="flex flex-col gap-2 min-h-[20px]">
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
      <AddCard listId={list._id} boardId={boardId} />
    </div>
  );
}
