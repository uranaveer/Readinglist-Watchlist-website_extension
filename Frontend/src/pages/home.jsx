import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-200 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        Welcome to Your Media Hub
      </h1>
      <p className="text-lg text-gray-600 mb-8 text-center">
        Keep track of your favorite books and shows with ease.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <div className="bg-white shadow-lg rounded-2xl p-6 hover:scale-105 transition-transform">
          <h2 className="text-2xl font-semibold text-blue-700 mb-2">📚 Reading List</h2>
          <p className="text-gray-600">
            Organize and manage the books you want to read or have read.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 hover:scale-105 transition-transform">
          <h2 className="text-2xl font-semibold text-purple-700 mb-2">🎬 Watching List</h2>
          <p className="text-gray-600">
            Keep track of movies, series, and YouTube content.
          </p>
        </div>
      </div>

      <Link
        to="/login"
        className="bg-blue-600 text-white px-6 py-3 rounded-full shadow hover:bg-blue-700 transition"
      >
        Get Started → Login
      </Link>
    </div>
  );
}

export default Home;
