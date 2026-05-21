import { useState } from "react";
import API from "../services/api";
import useAuthStore from "../store/authStore";
import Footer from "../components/Common/Footer";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { setUser } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });

      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);

      const inviteToken = localStorage.getItem("inviteToken");

      if (inviteToken) {
        navigate(`/invite/${inviteToken}`);
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.log(err);
      alert("Login failed: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* MAIN SPLIT-SCREEN CONTAINER */}
      <div className="flex-1 flex min-h-[100vh]">
        
        {/* LEFT PANEL: AUTH FORM */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-10 sm:px-20 lg:px-32 xl:px-40 relative">
          
          {/* Logo / Back to home */}
          <div 
            onClick={() => navigate("/")}
            className="absolute top-10 left-10 flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
          >
            <img 
              src="https://cdn-icons-png.flaticon.com/512/6124/6124991.png" 
              alt="Logo" 
              className="w-6 h-6 invert" 
            />
            <span className="font-bold tracking-wide text-lg">TaskFlow</span>
          </div>

          <div className="max-w-md w-full mx-auto">
            <h1 className="text-4xl font-bold mb-2">Welcome back</h1>
            <p className="text-gray-400 mb-10">Please enter your details to sign in.</p>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col">
                <label className="text-sm text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full p-3 rounded-lg bg-[#0a0a0a] text-white border border-white/10 focus:outline-none focus:border-white/40 transition"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-gray-400 mb-2">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full p-3 rounded-lg bg-[#0a0a0a] text-white border border-white/10 focus:outline-none focus:border-white/40 transition"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                onClick={handleLogin}
                className="w-full bg-white text-black font-semibold py-3 rounded-lg mt-4 hover:bg-gray-200 transition duration-200"
              >
                Sign In
              </button>
            </div>

            <p className="mt-8 text-center text-gray-400 text-sm">
              Don't have an account?{" "}
              <span
                className="text-white font-medium cursor-pointer hover:underline"
                onClick={() => navigate("/register")}
              >
                Sign up for free
              </span>
            </p>
          </div>
        </div>

        {/* RIGHT PANEL: IMAGE */}
        <div className="hidden lg:block lg:w-1/2 relative bg-[#111111] overflow-hidden">
          <div className="absolute inset-0 bg-black/20 z-10" />
          <img 
            src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg"
            alt="Professional Setup"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

      </div>

      <Footer />
    </div>
  );
}