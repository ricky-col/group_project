// // // import { create } from "zustand";

// // // const useBoardStore = create((set) => ({
// // //   lists: [],
// // //   cards: {},
// // //   boards: [], // ✅ ADD THIS

// // //   setBoards: (boards) => set({ boards }), // ✅ ADD THIS


// // //   // LISTS
// // //   setLists: (lists) => set({ lists }),

// // //   addList: (list) =>
// // //     set((state) => ({
// // //       lists: [...state.lists, list],
// // //     })),

// // //   // CARDS
// // // setCardsByList: (listId, newCards) =>
// // //   set((state) => ({
// // //     cards: {
// // //       ...state.cards,
// // //       [listId]:
// // //         typeof newCards === "function"
// // //           ? newCards(state.cards[listId] || [])
// // //           : newCards,
// // //     },
// // //   })),

// // //   addCard: (card) =>
// // //     set((state) => ({
// // //       cards: {
// // //         ...state.cards,
// // //         [card.listId]: [
// // //           ...(state.cards[card.listId] || []),
// // //           card,
// // //         ],
// // //       },
// // //     })),
// // // }));

// // // export default useBoardStore;






// // import { create } from "zustand";

// // const useBoardStore = create((set) => ({
// //   lists: [],
// //   cards: {},

// //   setLists: (lists) => set({ lists }),

// //   setCardsByList: (listId, updater) =>
// //     set((state) => {
// //       const current = state.cards[listId] || [];

// //       const updated =
// //         typeof updater === "function"
// //           ? updater(current)
// //           : updater;

// //       return {
// //         cards: {
// //           ...state.cards,
// //           [listId]: [...updated], // 🔥 IMPORTANT (new reference)
// //         },
// //       };
// //     }),

// //   addCard: (card) =>
// //     set((state) => {
// //       const listCards = state.cards[card.listId] || [];

// //       return {
// //         cards: {
// //           ...state.cards,
// //           [card.listId]: [...listCards, card],
// //         },
// //       };
// //     }),
// // }));

// // export default useBoardStore;


// import { create } from "zustand";

// const useBoardStore = create((set) => ({
//   lists: [],
//   cards: {},

//   setLists: (lists) => set({ lists }),

//   setCardsByList: (listId, updater) =>
//     set((state) => {
//       const current = state.cards[listId] || [];

//       const updated =
//         typeof updater === "function"
//           ? updater(current)
//           : updater;

//       return {
//         cards: {
//           ...state.cards,
//           [listId]: [...updated],
//         },
//       };
//     }),
// }));

// export default useBoardStore;

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