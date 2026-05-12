import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      {/* 🔥 NAVBAR */}
      <nav className="flex justify-between items-center px-10 py-6">
        <h1 className="text-xl font-semibold tracking-wide">TaskFlow</h1>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Sign In
          </button>

          <button
            onClick={() => navigate("/register")}
            className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* 🔥 HERO */}
      <div className="flex flex-col items-center justify-center text-center px-6 mt-20">

        <h1 className="text-5xl md:text-6xl font-bold leading-tight max-w-3xl">
          Manage your work
          <span className="text-blue-500"> visually & efficiently</span>
        </h1>

        <p className="text-gray-600 mt-6 max-w-xl text-lg">
          Organize tasks, collaborate with your team, and track progress —
          all in one powerful workspace.
        </p>

        <div className="flex gap-4 mt-8">
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Start for Free →
          </button>

          <button className="border border-gray-300 bg-white text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 hover:border-gray-400 shadow-sm transition">
            Live Demo
          </button>
        </div>
      </div>

      {/* 🔥 FLOATING BOARD MOCK */}
      <div className="flex justify-center mt-20 px-6">
        <div className="bg-white border border-gray-200 shadow-xl rounded-2xl p-6 animate-float w-full max-w-4xl">

          <div className="flex gap-4">

            <div className="bg-gray-100 p-4 rounded-xl w-1/3 min-h-[300px]">
              <p className="font-semibold mb-4 text-gray-700">To Do</p>
              <div className="bg-white p-3 rounded shadow-sm border border-gray-200 mb-3">Design UI</div>
              <div className="bg-white p-3 rounded shadow-sm border border-gray-200">Setup backend</div>
            </div>

            <div className="bg-gray-100 p-4 rounded-xl w-1/3 min-h-[300px]">
              <p className="font-semibold mb-4 text-gray-700">In Progress</p>
              <div className="bg-white p-3 rounded shadow-sm border border-gray-200">Auth system</div>
            </div>

            <div className="bg-gray-100 p-4 rounded-xl w-1/3 min-h-[300px]">
              <p className="font-semibold mb-4 text-gray-700">Done</p>
              <div className="bg-white p-3 rounded shadow-sm border border-gray-200 text-gray-500 line-through">Project setup</div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}