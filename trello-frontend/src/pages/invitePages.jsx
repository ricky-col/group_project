// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect } from "react";
// import API from "../services/api";

// export default function InvitePage() {
//   const { token } = useParams();
//   const navigate = useNavigate();

//   const handleAccept = async () => {
//     try {
//       await API.post("/accept-invite", { token });

//       localStorage.removeItem("inviteToken");

//       alert("Joined board ✅");

//       window.location.href = "/dashboard";

//     } catch (err) {
//       console.log("ERROR:", err.response?.data || err);
//     }
//   };

//   useEffect(() => {
//     const user = localStorage.getItem("user");

//     if (user && token) {
//       handleAccept();
//     }
//   }, [token]);

//   const goToLogin = () => {
//     localStorage.setItem("inviteToken", token);
//     navigate("/login");
//   };

//   return (
//     <div className="h-screen flex flex-col items-center justify-center gap-4">

//       <h2 className="text-white text-lg">
//         Please login to join this board
//       </h2>

//       <button onClick={goToLogin} className="bg-gray-600 px-4 py-2 text-white">
//         Login
//       </button>

//       <button onClick={handleAccept} className="bg-blue-600 px-4 py-2 text-white">
//         Accept Invite
//       </button>

//     </div>
//   );
// }





import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import API from "../services/api";

export default function InvitePage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const hasRun = useRef(false);

  const handleAccept = async () => {
    try {
      console.log("Calling accept API...");

      await API.post("/board/accept-invite", { token });

      localStorage.removeItem("inviteToken");

      window.location.href = "/dashboard";

    } catch (err) {
      const msg = err.response?.data?.message;

      // ✅ IMPORTANT: handle already-used invite
      if (msg === "Invalid invite") {
        localStorage.removeItem("inviteToken");
        window.location.href = "/dashboard";
        return;
      }

      console.log("API ERROR:", err);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");

    // ✅ RUN ONLY ONCE
    if (user && token && !hasRun.current) {
      hasRun.current = true;
      handleAccept();
    }
  }, []);

  const goToLogin = () => {
    localStorage.setItem("inviteToken", token);
    navigate("/login");
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <h2>Please login to join this board</h2>

      <button onClick={goToLogin}>Login</button>
      <button onClick={handleAccept}>Accept Invite</button>
    </div>
  );
}