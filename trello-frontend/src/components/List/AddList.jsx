// import { useState } from "react";
// import API from "../../services/api";
// import useBoardStore from "../../store/boardStore";

// export default function AddList({ boardId }) {
//   const [title, setTitle] = useState("");
//   const { lists, setLists } = useBoardStore();

//   const handleAdd = async () => {
//     if (!title) return;

//     try {
//       const res = await API.post("/list/create", {
//         title,
//         boardId,
//       });

//     setLists((prev) => [...prev, res.data.payload]);
//     setTitle("");
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <div className="w-64 p-3 bg-gray-200">
//       <input
//         className="border p-2 w-full mb-2"
//         placeholder="New list"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//       />

//       <button
//         className="bg-blue-500 text-white w-full py-1"
//         onClick={handleAdd}
//       >
//         Add List
//       </button>
//     </div>
//   );
// }

import { useState } from "react";
import API from "../../services/api";
import useBoardStore from "../../store/boardStore";

export default function AddList({ boardId }) {
  const [title, setTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

const setLists = useBoardStore((state) => state.setLists);
const lists = useBoardStore((state) => state.lists);

const handleAdd = async () => {
  if (!title) return;

  try {
    const res = await API.post("/list/create", {
      title,
      boardId,
    });

    const newList = res.data.payload;

    //  UPDATE STATE CORRECTLY
    setLists([...lists, newList]);

    setTitle("");
    setIsAdding(false);

  } catch (err) {
    console.log(err);
  }
};

  return (
    <div className="w-full sm:w-[272px] flex-shrink-0">
      {isAdding ? (
        <div className="bg-black/70 backdrop-blur-md p-3 rounded-xl">
          <input
            className="w-full p-2 mb-2 rounded bg-[#020617] text-white text-sm outline-none"
            placeholder="Enter list title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="flex gap-2">
            <button
              className="bg-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-700"
              onClick={handleAdd}
            >
              Add list
            </button>

            <button
              className="text-white"
              onClick={() => setIsAdding(false)}
            >
              ✕
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full bg-white/10 text-white p-3 rounded-xl text-left hover:bg-white/20 transition"
        >
          + Add another list
        </button>
      )}
    </div>
  );
}