import { create } from "zustand";

const useBoardStore = create((set) => ({
  boards: [],

  lists: [],
  cards: {},

  setBoards: (boards) => set({ boards }),

  setLists: (lists) => set({ lists }),

  addList: (list) =>
  set((state) => ({
    lists: [...state.lists, list]
  })),

  setCardsByList: (listId, updater) =>
    set((state) => {
      const current = state.cards[listId] || [];

      const updated =
        typeof updater === "function"
          ? updater(current)
          : updater;

      return {
        cards: {
          ...state.cards,
          [listId]: [...updated],
        },
      };
    }),
}));

export default useBoardStore;