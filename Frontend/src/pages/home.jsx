import { Link } from "react-router-dom";
import React from 'react';

function Home() {
  return (
    <div className="bg-white text-black min-h-screen font-sans">
      {/* Header */}
      <header className="p-4 flex justify-between items-center border-b border-gray-200">
        <div className="text-xl font-bold">MindTrace</div>
        <Link
          to="/login"
          className="bg-black text-white px-5 py-2 font-semibold rounded hover:bg-white hover:text-black border border-black transition"
        >
          Login
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center px-4 py-24 md:py-36">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">👁️‍🗨️ Track. Summarize. Share.</h1>
        <p className="text-lg md:text-xl max-w-2xl mb-6 leading-relaxed">
          Your mind, captured — automatically.
          <br />
          We log what you watch and read, use a local AI to summarize it, and let you showcase your learning journey.
        </p>
        <p className="text-gray-600 italic mb-10">No effort. Just your intellectual trace.</p>
        <Link
          to="/login"
          className="bg-black text-white text-lg px-8 py-3 font-semibold rounded-full hover:bg-white hover:text-black border border-black transition shadow-lg"
        >
          🚀 Login to Begin
        </Link>
      </main>

      {/* Why This Matters Section */}
      <section className="px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-12">📚 Why This Matters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
          <div className="flex items-start space-x-4">
            <span className="text-2xl">🧠</span>
            <p className="text-lg">Build your second brain passively.</p>
          </div>
          <div className="flex items-start space-x-4">
            <span className="text-2xl">✨</span>
            <p className="text-lg">Let AI summarize your consumed content.</p>
          </div>
          <div className="flex items-start space-x-4">
            <span className="text-2xl">👥</span>
            <p className="text-lg">Share your intellectual journey with friends.</p>
          </div>
          <div className="flex items-start space-x-4">
            <span className="text-2xl">🧩</span>
            <p className="text-lg">Browser extension supported — seamless tracking.</p>
          </div>
        </div>
      </section>

      {/* Mock Profile Preview */}
      <section className="px-6 py-20">
        <div className="max-w-xl mx-auto border border-gray-300 p-6 rounded-lg shadow-sm">
          <div className="font-semibold text-xl mb-4">User: <span className="text-gray-700">@johndoe</span></div>
          <div className="space-y-3 text-sm">
            <div className="border border-gray-200 p-3 rounded">📰 The Rise of LLMs – 2 min summary</div>
            <div className="border border-gray-200 p-3 rounded">▶️ Why Netflix Algorithms Win</div>
            <div className="border border-gray-200 p-3 rounded">📘 Atomic Habits – Notes</div>
          </div>
          <p className="text-gray-500 mt-4 italic">“Your feed, but distilled.”</p>
        </div>
        <div className="text-center mt-10">
          <Link
            to="/login"
            className="bg-black text-white text-lg px-8 py-3 font-semibold rounded-full hover:bg-white hover:text-black border border-black transition"
          >
            👉 Ready to Start? Login Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 text-center py-5 text-sm text-gray-600">
        Made with 🖤 for thinkers — <a href="#" className="underline">GitHub</a> | <a href="#" className="underline">Docs</a>
      </footer>
    </div>
  );
}

export default Home;
