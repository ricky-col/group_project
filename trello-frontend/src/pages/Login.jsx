// // import { useState } from "react";
// // import API from "../services/api";
// // import { useNavigate } from "react-router-dom";
// // import useAuthStore from "../store/authStore";
// // import { useEffect } from "react";


// // export default function Login() {
// //   const navigate = useNavigate();
// //   const setUser = useAuthStore((state) => state.setUser);

// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");

// // const handleLogin = async () => {
// //   try {
// //     const res = await API.post("/auth/login", {
// //       email,
// //       password,
// //     });

// //     localStorage.setItem("user", JSON.stringify(res.data.user));

// //     const inviteToken = localStorage.getItem("inviteToken");

// //     if (inviteToken) {
// //       window.location.href = `/invite/${inviteToken}`;
// //     } else {
// //       window.location.href = "/dashboard";
// //     }

// //   } catch (err) {
// //     console.log("LOGIN ERROR:", err.response?.data || err);
// //   }
// // };

// // useEffect(() => {
// //   const user = localStorage.getItem("user");

// //   if (user) {
// // window.location.href = "/dashboard";  }
// // }, []);

// //   return (
// //     <div className="h-screen flex items-center justify-center">
// //       <div className="p-6 bg-white shadow rounded">
// //         <h2 className="text-xl mb-4">Login</h2>

// //         <input
// //           className="border p-2 mb-2 w-full"
// //           placeholder="Email"
// //           onChange={(e) => setEmail(e.target.value)}
// //         />

// //         <input
// //           className="border p-2 mb-2 w-full"
// //           type="password"
// //           placeholder="Password"
// //           onChange={(e) => setPassword(e.target.value)}
// //         />

// // <button
// //   type="button"   // ✅ ADD THIS
// //   className="bg-blue-500 text-white px-4 py-2 w-full"
// //   onClick={handleLogin}
// // >
// //   Login
// // </button>

// //         <p className="mt-3 text-center">
// //           Don't have an account?{" "}
// //           <button
// //             onClick={() => navigate("/register")}
// //             className="text-blue-600"
// //           >
// //             Register
// //           </button>
// //         </p>

// //       </div>
// //     </div>
// //   );
// // }


// import { useState } from "react";
// import API from "../services/api";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = async () => {
//     try {
//       const res = await API.post("/auth/login", {
//         email,
//         password,
//       });

//       localStorage.setItem("user", JSON.stringify(res.data.user));

//       const inviteToken = localStorage.getItem("inviteToken");

//       if (inviteToken) {
//         window.location.href = `/invite/${inviteToken}`;
//       } else {
//         window.location.href = "/dashboard";
//       }

//     } catch (err) {
//       console.log("LOGIN ERROR:", err.response?.data || err);
//     }
//   };

//   return (
//     <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">

//       {/* CARD */}
//       <div className="bg-white p-8 rounded-2xl shadow-2xl w-[350px]">

//         {/* TITLE */}
//         <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
//           Welcome Back 👋
//         </h2>

//         {/* EMAIL */}
//         <input
//           id="email"
//           name="email"
//           type="email"
//           placeholder="Enter your email"
//           className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         {/* PASSWORD */}
//         <input
//           id="password"
//           name="password"
//           type="password"
//           placeholder="Enter your password"
//           className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         {/* BUTTON */}
//         <button
//           onClick={handleLogin}
//           className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200"
//         >
//           Login
//         </button>

//         {/* FOOTER */}
//         <p className="text-center mt-4 text-gray-600">
//           Don't have an account?{" "}
//           <span
//             className="text-blue-600 cursor-pointer"
//             onClick={() => (window.location.href = "/register")}
//           >
//             Register
//           </span>
//         </p>

//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import API from "../services/api";
import useAuthStore from "../store/authStore";

export default function Login() {
  const { setUser } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });

      // localStorage.setItem("user", JSON.stringify(res.data.user));
      // localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);


      const inviteToken = localStorage.getItem("inviteToken");

      if (inviteToken) {
        window.location.href = `/invite/${inviteToken}`;
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#0f172a]">

      {/* BACKGROUND GLOW */}
      <div className="absolute w-[500px] h-[500px] bg-purple-600 blur-[120px] opacity-30 rounded-full top-[-100px] left-[-100px]" />
      <div className="absolute w-[500px] h-[500px] bg-blue-600 blur-[120px] opacity-30 rounded-full bottom-[-100px] right-[-100px]" />

      {/* CARD */}
      <div className="relative bg-white/10 backdrop-blur-xl border border-white/10 
      p-10 rounded-2xl shadow-2xl w-[380px] text-center">

        {/* LOGO */}
        <div className="text-3xl font-bold text-white mb-2 tracking-wide">
          TaskFlow
        </div>

        {/* SUBTITLE */}
        <p className="text-gray-300 text-sm mb-6">
          System Design Level Task Management App
        </p>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-3 rounded-lg bg-white/10 text-white 
          placeholder-gray-400 border border-white/10 
          focus:outline-none focus:ring-2 focus:ring-purple-500"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded-lg bg-white/10 text-white 
          placeholder-gray-400 border border-white/10 
          focus:outline-none focus:ring-2 focus:ring-purple-500"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 
          text-white py-3 rounded-lg font-semibold 
          hover:scale-[1.02] transition-all duration-200"
        >
          Sign in
        </button>

        {/* FOOTER */}
        <p className="mt-5 text-gray-400 text-sm">
          Don’t have an account?{" "}
          <span
            className="text-white cursor-pointer hover:underline"
            onClick={() => (window.location.href = "/register")}
          >
            Create account
          </span>
        </p>

      </div>
    </div>
  );
}