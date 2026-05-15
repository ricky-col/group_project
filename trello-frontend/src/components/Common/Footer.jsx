import { useNavigate } from "react-router-dom";

export default function Footer({ isTransparent = false }) {
  const navigate = useNavigate();

  return (
    <footer 
      className={`w-full text-gray-400 text-sm py-8 px-6 border-t shrink-0 z-50 ${
        isTransparent 
          ? "bg-black/80 backdrop-blur-md border-white/10" 
          : "bg-[#0a0a0a] border-white/10"
      }`}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Left / Branding */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 mb-2 cursor-pointer hover:opacity-80 transition"
          >
            <img 
              src="https://cdn-icons-png.flaticon.com/512/6124/6124991.png" 
              alt="Logo" 
              className="w-5 h-5 invert" 
            />
            <span className="text-white font-bold tracking-wide text-lg">TaskFlow</span>
          </div>
          <p className="text-xs text-gray-500">The ultimate visual task management app.</p>
        </div>

        {/* Center / Links */}
        <div className="flex gap-6 text-xs font-medium">
          <a href="#" className="hover:text-white transition">About</a>
          <a href="#" className="hover:text-white transition">Privacy Policy</a>
          <a href="#" className="hover:text-white transition">Terms of Service</a>
          <a href="#" className="hover:text-white transition">Contact Support</a>
        </div>

        {/* Right / Copyright */}
        <div className="text-xs text-gray-500">
          TaskFlow © {new Date().getFullYear()}. All rights reserved.
        </div>
        
      </div>
    </footer>
  );
}
