import React from 'react';
import { Link } from 'react-router-dom';
import slide from "../../assets/slice.webp";
import logo from "../../assets/portLogo.png"


function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 font-inter">
      {/* Header */}
     <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md px-4 sm:px-6">
  <div className="flex justify-between items-center py-4 max-w-7xl mx-auto">
    {/* Logo + Brand */}
    <Link to="/" className="flex items-center gap-2 group">
      <img src={logo} alt="Portfolink Logo" className="w-10 h-10 transition-transform duration-200 group-hover:rotate-12" />
      <span className="text-2xl md:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">
        Portfolink
      </span>
    </Link>

    {/* Nav Links */}
    <nav className="space-x-4 text-sm md:text-base hidden sm:block">
      <Link
        to="/login"
        aria-label="Login to your Portfolink account"
        className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition relative group"
      >
        <span className="group-hover:underline underline-offset-4">Login</span>
      </Link>
      <Link
        to="/register"
        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md"
        aria-label="Start creating your portfolio"
      >
    
        Get Started
      </Link>
    </nav>
  </div>
</header>


      {/* Hero */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between px-4 sm:px-6 py-24 max-w-7xl mx-auto">
        <div className="w-full md:w-1/2 text-center md:text-left">
       <h2 className="text-4xl md:text-5xl font-extrabold leading-snug md:leading-tight mb-6 drop-shadow-[0_2px_16px_rgba(99,102,241,0.25)]">
        Create One Smart Link <br className="hidden md:block" /> for All Your Work
      </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
            Build your personal tech profile. Upload projects, add your resume, and share a beautiful link with recruiters and teams.
          </p>
          <Link
            to="/register"
            className="inline-block bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:from-indigo-700 hover:to-blue-700 transition"
          >
            Start Building Now
          </Link>
        </div>
        <div className="w-full md:w-1/2 mb-10 md:mb-0 flex justify-center relative">
          <div className="absolute -z-10 w-64 h-64 bg-indigo-200 blur-3xl rounded-full opacity-40 top-10 right-10 animate-pulse hidden md:block"></div>
          <img
            src={slide}
            alt="Tech Profile Preview"
            className="w-full max-w-md rounded-xl shadow-2xl border-2 border-indigo-100 dark:border-indigo-500 transition-all hover:scale-105 duration-300"
          />
        </div>
      </section>

      {/* Features */}
     <section className="relative bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 py-20 px-4 sm:px-6 overflow-hidden">
  <div className="max-w-6xl mx-auto text-center">
    <h3 className="text-4xl font-extrabold mb-14 text-gray-900 dark:text-white leading-tight">
      Why Choose <span className="text-indigo-600 dark:text-indigo-400">Portfolink</span>?
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
      {[
        {
          icon: "📁",
          title: "All-in-One Portfolio",
          desc: "Display your resume, GitHub, projects, and skills all in one clean profile."
        },
        {
          icon: "⚡",
          title: "Fast Setup",
          desc: "Create and customize your profile in minutes — no coding required."
        },
        {
          icon: "🌐",
          title: "Sharable Link",
          desc: "Get a sleek personal link to share with recruiters or on social media."
        },
        {
          icon: "📈",
          title: "Insights & Stats",
          desc: "Track views, engagement, and interest on your portfolio easily."
        }
      ].map((item, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-indigo-100 dark:border-gray-700 hover:border-indigo-500 hover:shadow-indigo-300 dark:hover:shadow-indigo-800 transition-all duration-300 group"
        >
          <div className="text-4xl mb-4 group-hover:scale-125 transition-transform">{item.icon}</div>
          <h4 className="font-bold text-xl text-indigo-700 dark:text-indigo-400 mb-2">{item.title}</h4>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
  <div className="absolute  -left-20 w-72 h-72 bg-indigo-100 dark:bg-indigo-900 rounded-full blur-3xl opacity-20 pointer-events-none" />
</section>


      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        © 2025 <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Portfolink</span>. Crafted with 💙 for creatives.
      </footer>
    </div>
  );
}

export default Home;
