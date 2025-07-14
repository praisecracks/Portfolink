import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { Menu, X } from 'react-feather';
import logo from '../../assets/portLogo.png';
import slide from '../../assets/slice.webp';
import BlogPage from '../Blog/BlogPage';

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 font-inter">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4 sm:px-8 relative">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group md:pl-2">
          <img
            src={logo}
            alt="Portfolink Logo"
            className="w-10 h-10 group-hover:rotate-12 transition-transform"
          />
          <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">
            Portfolink
          </span>
        </Link>

        {/* Centered Desktop Nav */}
        <nav className="hidden md:flex gap-10 absolute left-1/2 transform -translate-x-1/2">
          <ScrollLink
            to="hero"
            smooth={true}
            duration={500}
            offset={-80}
            className="cursor-pointer text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            Home
          </ScrollLink>
          <ScrollLink
            to="about"
            smooth={true}
            duration={500}
            offset={-80}
            className="cursor-pointer text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            About
          </ScrollLink>
          <ScrollLink
            to="blog"
            className="cursor-pointer text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            Info
          </ScrollLink>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex gap-3 text-sm items-center">
          <Link
            to="/login"
            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 shadow transition"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-gray-700 dark:text-gray-300"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-4 space-y-4 bg-white dark:bg-gray-900 text-sm">
          <ScrollLink
            to="hero"
            smooth={true}
            duration={500}
            offset={-80}
            onClick={() => setMenuOpen(false)}
            className="block cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Home
          </ScrollLink>
          <ScrollLink
            to="about"
            smooth={true}
            duration={500}
            offset={-80}
            onClick={() => setMenuOpen(false)}
            className="block cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            About
          </ScrollLink>
          <ScrollLink
            to="blog"
            onClick={() => setMenuOpen(false)}
            className="block cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Info
          </ScrollLink>

          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="block w-full text-center py-2 border rounded-md text-indigo-600 dark:text-white border-indigo-600 dark:border-white hover:bg-indigo-50 dark:hover:bg-gray-800 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            onClick={() => setMenuOpen(false)}
            className="block w-full text-center py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Get Started
          </Link>
        </div>
      )}
    </header>

      {/* Hero Section */}
      <section id="hero" style={{height: "90vh"}} className="flex flex-col-reverse md:flex-row items-center justify-between px-6 py-20 sm:px-12 max-w-7xl mx-auto">
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-md leading-tight">
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
          <div className="absolute -z-10 w-64 h-64 bg-indigo-200 blur-3xl rounded-full opacity-40 top-10 right-10 animate-pulse hidden md:block" />
          <img
            src={slide}
            alt="Tech Profile Preview"
            className="w-full max-w-md rounded-xl shadow-2xl border-2 border-indigo-100 dark:border-indigo-500 transition-all hover:scale-105 duration-300"
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 py-20 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-4xl font-extrabold mb-14 text-gray-900 dark:text-white leading-tight">
            Why Choose <span className="text-indigo-600 dark:text-indigo-400">Portfolink</span>?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            {[
              { icon: "🧩", title: "Unified Portfolio", desc: "All your work and info in one elegant link." },
              { icon: "⚡", title: "Quick Setup", desc: "Create and customize your profile in minutes." },
              { icon: "🔗", title: "Sharable Link", desc: "A sleek personal URL for recruiters & clients." },
              { icon: "📊", title: "Performance Stats", desc: "Track views, clicks, and engagement easily." },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-indigo-100 dark:border-gray-700 hover:border-indigo-500 transition-all group"
              >
                <div className="text-3xl mb-4 group-hover:scale-125 transition-transform">{item.icon}</div>
                <h4 className="font-bold text-lg text-indigo-700 dark:text-indigo-400 mb-2">{item.title}</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
<section id="blog">
      <BlogPage/>
</section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 pt-16 px-6 md:px-12">
        {/* Stats */}
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center text-gray-700 dark:text-gray-300">
          <div><p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">12,000+</p><p className="mt-1 text-sm">Profiles Created</p></div>
          <div><p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">3,200+</p><p className="mt-1 text-sm">Projects Uploaded</p></div>
          <div><p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">6,500+</p><p className="mt-1 text-sm">Links Shared</p></div>
          <div><p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">30+</p><p className="mt-1 text-sm">Companies Hiring</p></div>
        </div>

        {/* Info */}
        <div className="max-w-7xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 text-gray-700 dark:text-gray-300 pb-12">
          <div>
            <h2 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-2">Portfolink</h2>
            <p className="text-sm leading-relaxed">
              Portfolink is your personal tech portfolio hub. Designed for developers, designers, and creators to showcase their work professionally.
            </p>
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">© 2025 Portfolink. All rights reserved.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/blog" className="hover:text-indigo-600 dark:hover:text-indigo-400">Info</Link></li>
              <li><ScrollLink to="about" smooth={true} duration={500} offset={-80} className="cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400">About</ScrollLink></li>
              <li><Link to="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact Info</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: <a href="mailto:support@portfolink.com" className="hover:text-indigo-600 dark:hover:text-indigo-400">support@portfolink.com</a></li>
              <li>Phone: <a href="tel:+2347069991171" className="hover:text-indigo-600 dark:hover:text-indigo-400">+234 706 999 1171</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
