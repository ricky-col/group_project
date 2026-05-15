// import { useState, useEffect } from "react";
// import API from "../../services/api";
// import useBoardStore from "../../store/boardStore";

// export default function CardModal({ card, onClose }) {
//   const [description, setDescription] = useState("");
//   const [checklist, setChecklist] = useState([]);
//   const [newItem, setNewItem] = useState("");
//   const [activities, setActivities] = useState([]);
//   const [showActivity, setShowActivity] = useState(false);

//   const { cards, setCardsByList } = useBoardStore();

//   // ✅ SYNC CARD
//   useEffect(() => {
//     if (card) {
//       setDescription(card.description || "");
//       setChecklist(card.checklist || []);
//     }
//   }, [card]);

//   // ✅ FETCH ACTIVITY
//   useEffect(() => {
//     if (card) {
//       API.get(`/activity/card/${card._id}`)
//         .then((res) => setActivities(res.data.payload))
//         .catch((err) => console.log(err));
//     }
//   }, [card]);

//   if (!card) return null;

//   const completed = checklist.filter(i => i.completed).length;
//   const progress =
//     checklist.length === 0
//       ? 0
//       : (completed / checklist.length) * 100;

// const handleSave = async () => {
//   try {
//     await API.put(`/card/update/${card._id}`, {
//       description,
//       checklist,
//       boardId: card.boardId,
//     });

//     // ✅ UPDATE UI IMMEDIATELY
//     const listCards = cards[card.listId] || [];

//     const updated = listCards.map((c) =>
//       c._id === card._id
//         ? { ...c, description, checklist }
//         : c
//     );

//     setCardsByList(card.listId, updated);

//     onClose();
//   } catch (err) {
//     console.log(err);
//   }
// };

// const handleDelete = async () => {
//   try {
//     await API.delete(`/card/delete/${card._id}`, {
//       data: { boardId: card.boardId },
//     });

//     // ✅ UPDATE UI
//     const listCards = cards[card.listId] || [];

//     const updated = listCards.filter(
//       (c) => c._id !== card._id
//     );

//     setCardsByList(card.listId, updated);

//     onClose();
//   } catch (err) {
//     console.log(err);
//   }
// };

// const handleFileUpload = async (e) => {
//   const file = e.target.files[0];

//   const formData = new FormData();
//   formData.append("file", file);

//   await API.post(`/card/upload/${card._id}`, formData);

//   alert("Uploaded ✅");
// };

//   return (
//     <div className="fixed inset-0 z-[9999]">
//       {/* BACKDROP */}
//       <div
//         className="absolute inset-0 bg-black/60"
//         onClick={onClose}
//       ></div>

//       {/* MODAL */}
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
//         <div
//           className="bg-[#1e293b] w-[500px] p-4 rounded-xl text-white"
//           onMouseDown={(e) => e.stopPropagation()}
//           onClick={(e) => e.stopPropagation()}
//         >

//           {/* HEADER */}
//           <div className="flex justify-between mb-3">
//             <h2>{card.title}</h2>
//             <button onClick={onClose}>✕</button>
//           </div>

//           {/* PROGRESS */}
//           <div className="mb-3">
//             <div className="text-xs mb-1">
//               {completed} / {checklist.length}
//             </div>

//             <div className="w-full h-2 bg-gray-700 rounded">
//               <div
//                 className="h-2 bg-green-500"
//                 style={{ width: `${progress}%` }}
//               />
//             </div>
//           </div>

//           {/* DESCRIPTION */}
//           <textarea
//             onMouseDown={(e) => e.stopPropagation()}
//             className="w-full p-2 bg-[#020617] mb-3"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//           />

//           {/* CHECKLIST */}
//           {checklist.map((item, i) => (
//             <div key={i} className="flex gap-2 mb-2">

//               <div
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   const updated = [...checklist];
//                   updated[i].completed = !updated[i].completed;
//                   setChecklist(updated);
//                 }}
//                 className={`w-4 h-4 border ${
//                   item.completed ? "bg-green-500" : ""
//                 }`}
//               />

//               <span
//                 className={
//                   item.completed ? "line-through" : ""
//                 }
//               >
//                 {item.text}
//               </span>
//             </div>
//           ))}

//           {/* ADD ITEM */}
//           <div className="flex gap-2 mt-2">
//             <input
//               onMouseDown={(e) => e.stopPropagation()}
//               value={newItem}
//               onChange={(e) => setNewItem(e.target.value)}
//               className="flex-1 p-2 bg-[#020617]"
//             />

//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 if (!newItem) return;

//                 setChecklist([
//                   ...checklist,
//                   { text: newItem, completed: false },
//                 ]);

//                 setNewItem("");
//               }}
//               className="bg-blue-600 px-3"
//             >
//               Add
//             </button>
//           </div>

//           {/* SAVE */}
// <button
//   onClick={handleSave}
//   className="mt-4 bg-blue-600 px-4 py-1"
// >
//   Save
// </button>

// {/* 🔥 DELETE */}
// <button
//   onClick={handleDelete}
//   className="mt-2 bg-red-600 px-4 py-1"
// >
//   Delete
// </button>

//           {/* 🔥 ACTIVITY */}
//           <div className="mt-4">
//             <h3 className="text-sm mb-2">Activity</h3>

//             {activities.map((act, i) => (
//               <div key={i} className="text-xs text-gray-400">
//                 {act.userId?.name} {act.action}
//               </div>
//             ))}
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import API from "../../services/api";
import useBoardStore from "../../store/boardStore";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export default function CardModal({ card, onClose }) {
  const [description, setDescription] = useState("");
  const [checklist, setChecklist] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [activities, setActivities] = useState([]);
  const [dueDate, setDueDate] = useState("");
  const [labels, setLabels] = useState([]);

  const { cards, setCardsByList } = useBoardStore();

  // ✅ SYNC CARD
  useEffect(() => {
    if (card) {
      setDescription(card.description || "");
      setChecklist(card.checklist || []);
      setDueDate(card.dueDate || "");
      setLabels(card.labels || []);
    }
  }, [card]);

  // ✅ FETCH ACTIVITY
  useEffect(() => {
    if (card) {
      API.get(`/activity/card/${card._id}`)
        .then((res) => setActivities(res.data.payload))
        .catch((err) => console.log(err));
    }
  }, [card]);

  if (!card) return null;

  const completed = checklist.filter(i => i.completed).length;
  const progress =
    checklist.length === 0
      ? 0
      : (completed / checklist.length) * 100;

  // ✅ SAVE (UPDATE CARD)
  const handleSave = async () => {
    try {
      await API.put(`/card/update/${card._id}`, {
        description,
        checklist,
        dueDate,
        labels,
        boardId: card.boardId,
      });

      // ✅ UPDATE UI
      const listCards = cards[card.listId] || [];

      const updated = listCards.map((c) =>
        c._id === card._id
          ? { ...c, description, checklist, dueDate, labels }
          : c
      );

      setCardsByList(card.listId, updated);

      onClose();
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ DELETE CARD
  const handleDelete = async () => {
    try {
      await API.delete(`/card/delete/${card._id}`, {
        data: { boardId: card.boardId },
      });

      const listCards = cards[card.listId] || [];

      const updated = listCards.filter(
        (c) => c._id !== card._id
      );

      setCardsByList(card.listId, updated);

      onClose();
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ FILE UPLOAD
  const handleFileUpload = async (e) => {
    try {
      const file = e.target.files[0];

      const formData = new FormData();
      formData.append("file", file);

      const res = await API.post(
        `/card/upload/${card._id}`,
        formData
      );

      const updatedCard = res.data;

      // ✅ UPDATE UI
      const listCards = cards[card.listId] || [];

      const updated = listCards.map((c) =>
        c._id === card._id ? updatedCard : c
      );

      setCardsByList(card.listId, updated);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9999]" 
      onPointerDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      onKeyUp={(e) => e.stopPropagation()}
    >

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      ></div>

      {/* MODAL */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className="bg-[#1e293b] w-[550px] p-6 rounded-xl text-white shadow-2xl border border-white/10"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >

          {/* HEADER */}
          <div className="flex justify-between mb-3">
            <h2>{card.title}</h2>
            <button onClick={onClose}>✕</button>
          </div>

          {/* LABELS UI */}
          <div className="mb-3 flex flex-wrap gap-2 items-center" onPointerDown={(e) => e.stopPropagation()}>
             {labels.map((lbl, idx) => (
                <div key={idx} className="w-8 h-2 rounded-full" style={{backgroundColor: lbl}}></div>
             ))}
             <div className="flex gap-1 ml-2 border-l border-gray-600 pl-2">
               {["#ef4444", "#eab308", "#22c55e", "#3b82f6", "#a855f7"].map(color => (
                  <button key={color} onClick={() => {
                     setLabels(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color])
                  }} className={`w-5 h-5 rounded-full border border-black ${labels.includes(color) ? 'ring-2 ring-white' : ''}`} style={{backgroundColor: color}} />
               ))}
             </div>
          </div>

          {/* DUE DATE UI */}
          <div className="mb-4 flex items-center gap-2 text-sm text-gray-300" onPointerDown={(e) => e.stopPropagation()}>
            <span>Due Date:</span>
            <input 
              type="date" 
              className="bg-[#020617] p-1 rounded outline-none border border-gray-600 focus:border-blue-500" 
              value={dueDate ? new Date(dueDate).toISOString().split('T')[0] : ""}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {/* PROGRESS */}
          <div className="mb-3">
            <div className="text-xs mb-1">
              {completed} / {checklist.length}
            </div>

            <div className="w-full h-2 bg-gray-700 rounded">
              <div
                className="h-2 bg-green-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="mb-3 text-black" onMouseDown={(e) => e.stopPropagation()}>
            <ReactQuill 
              theme="snow"
              value={description}
              onChange={setDescription}
              className="bg-white rounded"
            />
          </div>

          {/* CHECKLIST */}
          {checklist.map((item, i) => (
            <div key={i} className="flex gap-2 mb-2">

              <div
                onClick={(e) => {
                  e.stopPropagation();
                  const updated = [...checklist];
                  updated[i].completed = !updated[i].completed;
                  setChecklist(updated);
                }}
                className={`w-4 h-4 border ${
                  item.completed ? "bg-green-500" : ""
                }`}
              />

              <span
                className={
                  item.completed ? "line-through" : ""
                }
              >
                {item.text}
              </span>
            </div>
          ))}

          {/* ADD ITEM */}
          <div className="flex gap-2 mt-2">
            <input
              onMouseDown={(e) => e.stopPropagation()}
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              className="flex-1 p-2 bg-[#020617]"
            />

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!newItem) return;

                setChecklist([
                  ...checklist,
                  { text: newItem, completed: false },
                ]);

                setNewItem("");
              }}
              className="bg-blue-600 px-3"
            >
              Add
            </button>
          </div>

          {/* SAVE */}
          <button
            onClick={handleSave}
            className="mt-4 bg-blue-600 px-4 py-1"
          >
            Save
          </button>

          {/* DELETE */}
          <button
            onClick={handleDelete}
            className="mt-2 bg-red-600 px-4 py-1"
          >
            Delete
          </button>

          {/* 🔥 ATTACHMENTS */}
          <div className="mt-4">
            <h3 className="text-sm mb-2">Attachments</h3>

            <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-4 rounded-lg shadow-md transition inline-block">
              Choose File
              <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>

            <div className="mt-2 flex flex-col gap-1">
              {card.attachments?.map((file, i) => (
                <a
                  key={i}
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 text-xs underline border border-blue-400 px-2 py-1"
                >
                  📎 {file.name}
                </a>
              ))}
            </div>
          </div>

          {/* ACTIVITY */}
          <div className="mt-4">
            <h3 className="text-sm mb-2">Activity</h3>

            {activities.map((act, i) => (
              <div key={i} className="text-xs text-gray-400">
                {act.userId?.name} {act.action}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}