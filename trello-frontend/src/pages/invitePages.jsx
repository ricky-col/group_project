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

  const goToLogin = () => {
    localStorage.setItem("inviteToken", token);
    navigate("/login");
  };

  const handleAccept = async () => {
    const user = localStorage.getItem("user");
    
    // If they click Accept Invite but are not logged in, redirect them to login first
    if (!user) {
      goToLogin();
      return;
    }

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
      if (err.response?.status === 401) {
        goToLogin();
      }
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

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-6 bg-[#091e42] text-white">
      <div className="bg-white/10 p-8 rounded-lg shadow-xl backdrop-blur-md flex flex-col items-center border border-white/20">
        <h2 className="text-2xl font-bold mb-2">Board Invitation</h2>
        <p className="text-gray-300 mb-6 text-center max-w-sm">
          You've been invited to collaborate on a Trello board. Please login or accept the invite to join.
        </p>

        <div className="flex gap-4 w-full justify-center">
          <button 
            onClick={goToLogin} 
            className="bg-gray-700 hover:bg-gray-600 transition px-6 py-2 rounded font-medium shadow-md w-32"
          >
            Login
          </button>
          <button 
            onClick={handleAccept} 
            className="bg-blue-600 hover:bg-blue-500 transition px-6 py-2 rounded font-medium shadow-md w-36"
          >
            Accept Invite
          </button>
        </div>
      </div>
    </div>
  );
}