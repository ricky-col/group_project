import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // ✅ IMPORTANT
import API from "../../services/api";
import useBoardStore from "../../store/boardStore";
import List from "../List/List";
import AddList from "../List/AddList";
import socket from "../../services/Socket";
// import { DndContext } from "@dnd-kit/core";
import BoardHeader from "./BoardHeader";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { arrayMove } from "@dnd-kit/sortable";
import Footer from "../Common/Footer";
import CardModal from "../Card/CardModal";

export default function Board() {
  const { id: boardId } = useParams(); // ✅ FIXED

  const { lists, setLists, cards, setCardsByList } = useBoardStore();
  const [board, setBoard] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  const fetchLists = async () => {
    try {
      const res = await API.get(`/list/get/${boardId}`);
      const fetchedLists = res.data.payload;
      setLists(fetchedLists);

      // Fetch cards for each list to ensure cards are in sync
      fetchedLists.forEach(async (list) => {
        try {
          const cardRes = await API.get(`/card/get/${list._id}`);
          setCardsByList(list._id, cardRes.data.payload);
        } catch (cardErr) {
          console.error(`Failed to fetch cards for list ${list._id}:`, cardErr);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchBoard = async () => {
    try {
      const res = await API.get(`/board/get/${boardId}`);
      setBoard(res.data.board);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!boardId) return; // ✅ safety

    fetchBoard();
    fetchLists();

    socket.emit("joinBoard", boardId);

    socket.on("cardCreated", (newCard) => {
      // ✅ ENSURE STRING ID
      const listId = String(newCard.listId);

      setCardsByList(listId, (prev = []) => {
        // ✅ PREVENT DUPLICATES (if AddCard already added it)
        if (prev.find((c) => c._id === newCard._id)) return prev;
        return [...prev, newCard];
      });
    });

    socket.on("cardUpdated", (updatedCard) => {
      setCardsByList(updatedCard.listId, (prev = []) =>
        prev.map((c) =>
          c._id === updatedCard._id ? updatedCard : c
        )
      );
    });

    socket.on("cardDeleted", (deletedCard) => {
      setCardsByList(deletedCard.listId, (prev = []) =>
        prev.filter((c) => c._id !== deletedCard._id)
      );
    });

    socket.on("cardMoved", () => {
      fetchLists();
    });

    socket.on("cardReordered", () => {
      fetchLists();
    });

    socket.on("listCreated", () => {
      fetchLists();
    });

    socket.on("listDeleted", () => {
      fetchLists();
    });

    socket.on("listUpdated", () => {
      fetchLists();
    });

    socket.on("listReordered", () => {
      fetchLists();
    });

    socket.on("boardUpdated", () => {
      fetchBoard();
    });

    return () => {
      socket.off("cardCreated");
      socket.off("cardUpdated");
      socket.off("cardDeleted");
      socket.off("cardMoved");
      socket.off("cardReordered");
      socket.off("listCreated");
      socket.off("listDeleted");
      socket.off("listUpdated");
      socket.off("listReordered");
      socket.off("boardUpdated");
    };
  }, [boardId]);

  // const handleDragEnd = async (event) => {
  //   const { active, over } = event;
  //   if (!over) return;

  //   const activeCard = active.data.current;
  //   if (!activeCard) return;

  //   const sourceListId = activeCard.listId;
  //   const targetListId =
  //     over.data?.current?.listId || over.id;

  //   if (sourceListId === targetListId) {
  //     const listCards = cards[sourceListId] || [];

  //     const oldIndex = listCards.findIndex(
  //       (c) => c._id === activeCard._id
  //     );

  //     const newIndex = over.data?.current
  //       ? listCards.findIndex(
  //           (c) => c._id === over.data.current._id
  //         )
  //       : listCards.length;

  //     if (oldIndex === -1) return;

  //     const updated = [...listCards];
  //     const [moved] = updated.splice(oldIndex, 1);
  //     updated.splice(newIndex, 0, moved);

  //     setCardsByList(sourceListId, updated);

  //     await API.put("/card/reorder", {
  //       cardId: activeCard._id,
  //       newPosition: newIndex,
  //     });
  //   } else {
  //     const sourceCards = cards[sourceListId] || [];
  //     const targetCards = cards[targetListId] || [];

  //     const movedCard = sourceCards.find(
  //       (c) => c._id === activeCard._id
  //     );

  //     if (!movedCard) return;

  //     const updatedSource = sourceCards.filter(
  //       (c) => c._id !== activeCard._id
  //     );

  //     const updatedTarget = [
  //       ...targetCards,
  //       { ...movedCard, listId: targetListId },
  //     ];

  //     setCardsByList(sourceListId, updatedSource);
  //     setCardsByList(targetListId, updatedTarget);

  //     await API.put("/card/move", {
  //       cardId: activeCard._id,
  //       newListId: targetListId,
  //       newPosition: targetCards.length,
  //     });
  //   }
  // };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    // ==========================
    // ✅ LIST DRAG LOGIC (NEW)
    // ==========================
    if (!active.data.current && !over.data?.current) {
      const oldIndex = lists.findIndex((l) => l._id === active.id);
      const newIndex = lists.findIndex((l) => l._id === over.id);

      if (oldIndex === -1 || newIndex === -1) return;

      if (oldIndex !== newIndex) {
        const newLists = arrayMove(lists, oldIndex, newIndex);
        setLists(newLists);

        API.put("/list/reorder", {
          listId: active.id,
          newPosition: newIndex,
        }).catch(err => console.error("Failed to reorder list:", err));
      }

      return; // 🔥 IMPORTANT (stop here for list drag)
    }

    // ==========================
    // ✅ CARD DRAG (YOUR EXISTING CODE)
    // ==========================
    const activeCard = active.data.current;
    if (!activeCard) return;

    const sourceListId = activeCard.listId;
    const targetListId =
      over.data?.current?.listId || over.id;

    // SAME LIST
    if (sourceListId === targetListId) {
      const listCards = cards[sourceListId] || [];

      const oldIndex = listCards.findIndex(
        (c) => c._id === activeCard._id
      );

      const newIndex = over.data?.current
        ? listCards.findIndex(
          (c) => c._id === over.data.current._id
        )
        : listCards.length;

      if (oldIndex === -1) return;

      const updated = [...listCards];
      const [moved] = updated.splice(oldIndex, 1);
      updated.splice(newIndex, 0, moved);

      setCardsByList(sourceListId, updated);

      await API.put("/card/reorder", {
        cardId: activeCard._id,
        newPosition: newIndex,
      });

    } else {
      // DIFFERENT LIST
      const sourceCards = cards[sourceListId] || [];
      const targetCards = cards[targetListId] || [];

      const movedCard = sourceCards.find(
        (c) => c._id === activeCard._id
      );

      if (!movedCard) return;

      const updatedSource = sourceCards.filter(
        (c) => c._id !== activeCard._id
      );

      const updatedTarget = [
        ...targetCards,
        { ...movedCard, listId: targetListId },
      ];

      setCardsByList(sourceListId, updatedSource);
      setCardsByList(targetListId, updatedTarget);

      await API.put("/card/move", {
        cardId: activeCard._id,
        newListId: targetListId,
        newPosition: targetCards.length,
      });
    }
  };
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-screen overflow-hidden">

        {/* ✅ HEADER */}
        <BoardHeader board={board} boardId={boardId} onBoardUpdate={fetchBoard} />

        {/* BOARD */}
        <div
          className="flex-1 flex items-start gap-4 sm:gap-6 p-4 sm:p-6 overflow-x-auto overflow-y-hidden bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/733174/pexels-photo-733174.jpeg')",
          }}
        >
          <SortableContext
            items={lists.map((l) => l._id)}
            strategy={horizontalListSortingStrategy}
          >
            {lists.map((list) => (
              <List
                key={list._id}
                list={list}
                boardId={boardId}
                onCardClick={(card) => setSelectedCard(card)}
              />
            ))}
          </SortableContext>

          <AddList boardId={boardId} />
        </div>

        {/* ✅ CARD MODAL (Moved to board level to fix positioning) */}
        <CardModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />

      </div>
    </DndContext>
  );
}