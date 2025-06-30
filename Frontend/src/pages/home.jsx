import { Link } from "react-router-dom";
import React from 'react';

function Home() {
  return (
    <div className="bg-white text-black min-h-screen font-sans">
      {/* Header */}
      <header className="p-5 flex justify-between items-center border-b border-gray-200 shadow-sm sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <img src="/Feedora.png" alt="Feedora Logo" className="w-12 h-12 rounded" />
          <span className="text-2xl font-bold tracking-tight">Feedora</span>
        </div>
        <Link
          to="/login"
          className="px-5 py-2 rounded-full border border-black font-semibold text-black hover:bg-black hover:text-white transition active:scale-95"
        >
          Login
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center text-center px-4 py-12 md:py-20 bg-gradient-to-b from-white to-gray-50">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
          👁️‍🗨️ Curate & share what you consume.
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mb-6 text-gray-700">
          Automatically track what you watch and read, summarize it with local AI, and build your knowledge footprint — effortlessly.
        </p>
        <p className="text-gray-500 italic mb-8">Your mind, captured. No effort required.</p>
        <Link
          to="/login"
          className="bg-black text-white text-lg px-8 py-3 font-semibold rounded-full hover:bg-white hover:text-black border border-black transition shadow-md active:scale-95"
        >
          🚀 Get Started
        </Link>
      </main>

      {/* About Extension Section */}
      <section className="flex flex-col md:flex-row items-center justify-center gap-10 px-4 py-12 border-t border-gray-200 bg-white">
        <div className="relative flex-shrink-0">
          <div className="absolute -inset-4 rounded-full bg-gray-100 blur-xl opacity-50"></div>
          <img
            src="/extension.png"
            alt="Extension Preview"
            className="relative w-72 h-auto rounded shadow-md z-10"
          />
        </div>
        <div className="max-w-xl text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">🧩 The Feedora Extension</h2>
          <p className="text-lg md:text-xl mb-4 text-gray-700 leading-relaxed">
            Install the Feedora browser extension to seamlessly capture everything you explore online. Summaries are generated on your device, keeping your data secure and fully private.
          </p>
          <p className="text-gray-500 italic">Your data, your control — no third-party tracking.</p>
        </div>
      </section>

      {/* Find Source Section */}
      <section className="px-4 py-12 bg-gray-50 text-center border-t border-gray-200">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">🔗 Find the Source & Extension</h2>
        <p className="text-lg text-gray-700 mb-4">
          You can find the full source code and browser extension anytime on GitHub:
        </p>
        <a
          href="https://github.com/uranaveer/Readinglist-Watchlist-website_extension"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-black border border-black transition active:scale-95"
        >
          Visit on GitHub
        </a>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm py-6 border-t border-gray-200">
        &copy; {new Date().getFullYear()} Feedora. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;