import { useNavigate } from "react-router-dom";
import Footer from "../components/Common/Footer";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">

      {/*  NAVBAR */}
      <nav className="flex justify-between items-center px-10 py-6 border-b border-white/10 bg-[#0a0a0a]">
        <div className="flex items-center gap-2">
          <img
            src="https://cdn-icons-png.flaticon.com/512/6124/6124991.png"
            alt="Logo"
            className="w-7 h-7 invert"
          />
          <h1 className="text-xl font-bold tracking-wide">TaskFlow</h1>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/login")}
            className="text-gray-400 hover:text-white font-medium transition"
          >
            Sign In
          </button>

          <button
            onClick={() => navigate("/register")}
            className="bg-white text-black px-5 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/*  MAIN CONTENT WRAPPER */}
      <div className="min-h-[100vh]">
        {/*  HERO */}
        <div className="flex flex-col items-center justify-center text-center px-6 mt-20">

          <h1 className="text-5xl md:text-6xl font-bold leading-tight max-w-3xl text-white">
            Manage your work
            <span className="text-gray-400 block mt-2">visually & efficiently</span>
          </h1>

          <p className="text-gray-400 mt-6 max-w-xl text-lg leading-relaxed">
            Organize tasks, collaborate with your team, and track progress —
            all in one powerful, distraction-free workspace.
          </p>

          <div className="flex gap-4 mt-10">
            <button
              onClick={() => navigate("/login")}
              className="bg-white text-black font-semibold px-8 py-3 rounded-lg hover:bg-gray-200 transition shadow-lg"
            >
              Start for Free →
            </button>


          </div>
        </div>

      </div>

      {/*  FOOTER */}
      <Footer />
    </div>
  );
}