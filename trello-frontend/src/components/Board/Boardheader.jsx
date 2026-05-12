// import { useState } from "react";
// import API from "../../services/api";

// export default function BoardHeader({ title, boardId }) {
//   const [showActivity, setShowActivity] = useState(false);
//   const [activities, setActivities] = useState([]);
//   const [email, setEmail] = useState("");

//   const openActivity = async () => {
//     if (!boardId) return; // ✅ FIX

//     try {
//       const res = await API.get(`/activity/${boardId}`);
//       setActivities(res.data.payload);
//       setShowActivity(true);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleInvite = async () => {
//   try {
//     await API.post("/board/invite", {
//       email,
//       boardId,
//     });

//     alert("Invite sent ✅");
//     setEmail("");
//   } catch (err) {
//     console.log(err);
//   }
// };

//   return (
//     <>
//       <div className="w-full flex items-center justify-between px-6 py-3 bg-black/50 backdrop-blur-md text-white border-b border-white/10">

//         {/* LEFT */}
//         <div className="flex items-center gap-3">
//           <h2 className="font-semibold text-lg">
//             {title || "Board"}
//           </h2>

//           <button className="text-gray-400 hover:text-white">
//             ⭐
//           </button>
//         </div>

//         {/* CENTER */}
//         <button
//           onClick={openActivity}
//           className="text-sm text-gray-400 hover:text-white"
//         >
//           Activity
//         </button>

//         {/* RIGHT */}
//         <div className="flex items-center gap-3">
//           <button className="bg-white/10 px-3 py-1 rounded">
//             Share
//           </button>

//           <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
//             R
//           </div>
//         </div>
//       </div>

//       {/* 🔥 DRAWER */}
//       {showActivity && (
//         <div className="fixed inset-0 z-[9999] flex">

//           {/* OVERLAY */}
//           <div
//             className="flex-1 bg-black/50"
//             onClick={() => setShowActivity(false)}
//           />

//           {/* PANEL */}
//           <div className="w-[350px] bg-[#0f172a] p-4 text-white overflow-y-auto">

//             <div className="flex justify-between mb-4">
//               <h2>Activity</h2>
//               <button onClick={() => setShowActivity(false)}>✕</button>
//             </div>

//             {activities.length === 0 ? (
//               <p className="text-gray-400">No activity</p>
//             ) : (
//               activities.map((act, i) => (
//                 <div key={i} className="mb-3 border-b pb-2">
//                   <div>
//                     <b>{act.userId?.name}</b> {act.action}
//                   </div>
//                   <div className="text-xs text-gray-400">
//                     {new Date(act.createdAt).toLocaleString()}
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       )}
//     </>
//   );
// }


import { useState } from "react";
import API from "../../services/api";

export default function BoardHeader({ title, boardId }) {
  const [showActivity, setShowActivity] = useState(false);
  const [activities, setActivities] = useState([]);
  const [email, setEmail] = useState("");

  const openActivity = async () => {
    if (!boardId) return;

    try {
      const res = await API.get(`/activity/${boardId}`);
      setActivities(res.data.payload);
      setShowActivity(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleInvite = async () => {
    if (!email) return;

    try {
      await API.post("/board/invite", {
        email,
        boardId,
      });

      alert("Invite sent ✅");
      setEmail("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="w-full flex items-center justify-between px-6 py-3 bg-black/50 backdrop-blur-md text-white border-b border-white/10">

        {/* LEFT */}
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-lg">
            {title || "Board"}
          </h2>

          <button className="text-gray-400 hover:text-white">
            ⭐
          </button>
        </div>

        {/* CENTER */}
        <button
          onClick={openActivity}
          className="text-sm text-gray-400 hover:text-white"
        >
          Activity
        </button>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {/* 🔥 INVITE UI */}
          <div className="flex gap-2 items-center">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Invite email"
              className="px-2 py-1 rounded bg-black text-white text-sm border border-white/10"
            />

            <button
              onClick={handleInvite}
              className="bg-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-700"
            >
              Invite
            </button>
          </div>

          {/* SHARE */}
          <button className="bg-white/10 px-3 py-1 rounded hover:bg-white/20 text-sm">
            Share
          </button>

          {/* USER ICON */}
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-sm font-semibold">
            R
          </div>
        </div>
      </div>

      {/* 🔥 ACTIVITY DRAWER */}
      {showActivity && (
        <div className="fixed inset-0 z-[9999] flex">

          {/* OVERLAY */}
          <div
            className="flex-1 bg-black/50"
            onClick={() => setShowActivity(false)}
          />

          {/* PANEL */}
          <div className="w-[350px] bg-[#0f172a] p-4 text-white overflow-y-auto">

            <div className="flex justify-between mb-4">
              <h2>Activity</h2>
              <button onClick={() => setShowActivity(false)}>✕</button>
            </div>

            {activities.length === 0 ? (
              <p className="text-gray-400">No activity</p>
            ) : (
              activities.map((act, i) => (
                <div key={i} className="mb-3 border-b pb-2">
                  <div>
                    <b>{act.userId?.name}</b> {act.action}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(act.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}