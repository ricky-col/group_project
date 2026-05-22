import { useState } from "react";
import API from "../services/api";
import Footer from "../components/Common/Footer";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).");
      return;
    }

    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
      });

      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      setError(msg);
      console.log(err);
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
            <h1 className="text-4xl font-bold mb-2">Create an account</h1>
            <p className="text-gray-400 mb-10">Start managing your tasks effectively.</p>

            {error && (
              <div className="mb-6 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-5">
              <div className="flex flex-col">
                <label className="text-sm text-gray-400 mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full p-3 rounded-lg bg-[#0a0a0a] text-white border border-white/10 focus:outline-none focus:border-white/40 transition"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

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
                  placeholder="Create a password"
                  className="w-full p-3 rounded-lg bg-[#0a0a0a] text-white border border-white/10 focus:outline-none focus:border-white/40 transition"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                onClick={handleRegister}
                className="w-full bg-white text-black font-semibold py-3 rounded-lg mt-4 hover:bg-gray-200 transition duration-200"
              >
                Sign Up
              </button>
            </div>

            <p className="mt-8 text-center text-gray-400 text-sm">
              Already have an account?{" "}
              <span
                className="text-white font-medium cursor-pointer hover:underline"
                onClick={() => navigate("/login")}
              >
                Sign in
              </span>
            </p>
          </div>
        </div>

        {/* RIGHT PANEL: IMAGE */}
        <div className="hidden lg:block lg:w-1/2 relative bg-[#111111] overflow-hidden">
          <div className="absolute inset-0 bg-black/30 z-10" />
          <img 
            src=""
            alt="Team Collaboration"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

      </div>

      <Footer />
    </div>
  );
}