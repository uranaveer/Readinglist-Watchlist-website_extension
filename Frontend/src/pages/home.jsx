import { Link } from "react-router-dom";
import React from 'react';

function Home() {
  return (
    <div className="bg-white text-black min-h-screen font-sans">
      {/* Header */}
      <header className="p-4 flex justify-between items-center border-b border-gray-200">
        <div className="flex justify-center items-center space-x-3">
          <img src="/Feedora.png" alt="Feedora Logo" className="w-10 h-10" />
          <h1 className="text-4xl font-extrabold mb-2 text-gray-900 tracking-tight">
            Feedora
          </h1>
        </div>
        <Link
          to="/login"
          className="bg-black text-white px-5 py-2 font-semibold rounded hover:bg-white hover:text-black border border-black transition active:scale-95"
        >
          Login
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center px-4 py-24 md:py-36">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">👁️‍🗨️Curate & share what you consume.</h1>
        <p className="text-lg md:text-xl max-w-2xl mb-6 leading-relaxed">
          Your mind, captured — automatically.
          <br />
          We log what you watch and read, use a local AI to summarize it, and let you showcase your learning journey.
        </p>
        <p className="text-gray-600 italic mb-10">No effort. Just your intellectual trace.</p>
        <Link
          to="/login"
          className="bg-black text-white text-lg px-8 py-3 font-semibold rounded-full hover:bg-white hover:text-black border border-black transition shadow-lg active:scale-95"
        >
          🚀 Login to Begin
        </Link>
      </main>

    </div>
  );
}

export default Home;
