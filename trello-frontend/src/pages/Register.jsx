// // // import { useState } from "react";
// // // import API from "../services/api";
// // // import { useNavigate } from "react-router-dom";

// // // export default function Register() {
// // //   const [name, setName] = useState("");
// // //   const [email, setEmail] = useState("");
// // //   const [password, setPassword] = useState("");

// // //   const navigate = useNavigate();

// // //   const handleRegister = async () => {
// // //     try {
// // //       await API.post("/auth/register", {
// // //         name,
// // //         email,
// // //         password,
// // //       });

// // //       alert("Registered ✅");
// // //       navigate("/login");

// // //     } catch (err) {
// // //       console.log(err);
// // //     }
// // //   };

// // //   return (
// // //     <div className="h-screen flex flex-col items-center justify-center gap-3 bg-black text-white">

// // //       <h2 className="text-xl">Register</h2>

// // //       <input
// // //         placeholder="Name"
// // //         value={name}
// // //         onChange={(e) => setName(e.target.value)}
// // //         className="p-2 bg-[#020617]"
// // //       />

// // //       <input
// // //         placeholder="Email"
// // //         value={email}
// // //         onChange={(e) => setEmail(e.target.value)}
// // //         className="p-2 bg-[#020617]"
// // //       />

// // //       <input
// // //         type="password"
// // //         placeholder="Password"
// // //         value={password}
// // //         onChange={(e) => setPassword(e.target.value)}
// // //         className="p-2 bg-[#020617]"
// // //       />

// // //       <button
// // //         onClick={handleRegister}
// // //         className="bg-blue-600 px-4 py-2"
// // //       >
// // //         Register
// // //       </button>

// // //     </div>
// // //   );
// // // }


// // import { useState } from "react";
// // import API from "../services/api";

// // export default function Register() {
// //   const [name, setName] = useState("");
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [loading, setLoading] = useState(false);

// //   const handleRegister = async () => {
// //     try {
// //       setLoading(true);
// //       await API.post("/auth/register", {
// //         name,
// //         email,
// //         password,
// //       });

// //       alert("Registered successfully ✅");
// //       setLoading(false);

// //       window.location.href = "/login";

// //     } catch (err) {
// //       console.log("REGISTER ERROR:", err.response?.data || err);
// //     }
// //   };

// //   return (
// //     <div className="h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-500">

// //       {/* CARD */}
// //       <div className="bg-white p-8 rounded-2xl shadow-2xl w-[350px]">

// //         <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
// //           Create Account 🚀
// //         </h2>

// //         {/* NAME */}
// //         <input
// //           id="name"
// //           name="name"
// //           placeholder="Full Name"
// //           className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
// //           onChange={(e) => setName(e.target.value)}
// //         />

// //         {/* EMAIL */}
// //         <input
// //           id="email"
// //           name="email"
// //           type="email"
// //           placeholder="Email"
// //           className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
// //           onChange={(e) => setEmail(e.target.value)}
// //         />

// //         {/* PASSWORD */}
// //         <input
// //           id="password"
// //           name="password"
// //           type="password"
// //           placeholder="Password"
// //           className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
// //           onChange={(e) => setPassword(e.target.value)}
// //         />

// //         {/* BUTTON */}
// //         <button
// //           onClick={handleRegister}
// //           className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
// //         >
// //           Register
// //         </button>

// //         <button disabled={loading}>
// //   {loading ? "Loading..." : "Register"}
// // </button>

// //         {/* FOOTER */}
// //         <p className="text-center mt-4 text-gray-600">
// //           Already have an account?{" "}
// //           <span
// //             className="text-blue-600 cursor-pointer"
// //             onClick={() => (window.location.href = "/login")}
// //           >
// //             Login
// //           </span>
// //         </p>

// //       </div>
// //     </div>
// //   );
// // }

// import { useState } from "react";
// import API from "../services/api";

// export default function Register() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleRegister = async () => {
//     try {
//       await API.post("/auth/register", {
//         name,
//         email,
//         password,
//       });

//       alert("Account created ✅");
//       window.location.href = "/login";

//     } catch (err) {
//       console.log("REGISTER ERROR:", err.response?.data || err);
//     }
//   };

//   return (
//     <div className="h-screen flex items-center justify-center bg-gray-100">

//       {/* CARD */}
//       <div className="bg-white w-[400px] p-8 rounded-xl shadow-md text-center">

//         {/* TITLE */}
//         <h1 className="text-2xl font-bold text-blue-600 mb-2">
//           TaskFlow
//         </h1>

//         <p className="text-sm text-gray-600 mb-6">
//           System Design Level Task Management App
//         </p>

//         {/* NAME */}
//         <input
//           placeholder="Full Name"
//           className="w-full border p-3 rounded mb-3 focus:outline-blue-500"
//           onChange={(e) => setName(e.target.value)}
//         />

//         {/* EMAIL */}
//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full border p-3 rounded mb-3 focus:outline-blue-500"
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         {/* PASSWORD */}
//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full border p-3 rounded mb-4 focus:outline-blue-500"
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         {/* BUTTON */}
//         <button
//           onClick={handleRegister}
//           className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
//         >
//           Sign up
//         </button>

//         {/* LINK */}
//         <p className="mt-4 text-sm text-gray-600">
//           Already have an account?{" "}
//           <span
//             className="text-blue-600 cursor-pointer"
//             onClick={() => (window.location.href = "/login")}
//           >
//             Log in
//           </span>
//         </p>

//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import API from "../services/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
      });

      window.location.href = "/login";
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#0f172a]">

      {/* GLOW */}
      <div className="absolute w-[500px] h-[500px] bg-pink-600 blur-[120px] opacity-30 rounded-full top-[-100px] right-[-100px]" />
      <div className="absolute w-[500px] h-[500px] bg-blue-600 blur-[120px] opacity-30 rounded-full bottom-[-100px] left-[-100px]" />

      {/* CARD */}
      <div className="relative bg-white/10 backdrop-blur-xl border border-white/10 
      p-10 rounded-2xl shadow-2xl w-[380px] text-center">

        <div className="text-3xl font-bold text-white mb-2">
          TaskFlow
        </div>

        <p className="text-gray-300 text-sm mb-6">
          System Design Level Task Management App
        </p>

        <input
          placeholder="Full Name"
          className="w-full p-3 mb-3 rounded-lg bg-white/10 text-white border border-white/10"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-3 rounded-lg bg-white/10 text-white border border-white/10"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded-lg bg-white/10 text-white border border-white/10"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-gradient-to-r from-pink-500 to-blue-500 
          text-white py-3 rounded-lg font-semibold hover:scale-[1.02]"
        >
          Create account
        </button>

        <p className="mt-5 text-gray-400 text-sm">
          Already have an account?{" "}
          <span
            className="text-white cursor-pointer hover:underline"
            onClick={() => (window.location.href = "/login")}
          >
            Sign in
          </span>
        </p>

      </div>
    </div>
  );
}