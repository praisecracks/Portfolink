import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { Menu, X } from 'react-feather';
import { motion } from 'framer-motion';
import logo from '../../assets/portLogo.png';
import slide from '../../assets/slice.webp';
import BlogPage from '../Blog/BlogPage';

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll listener for progress bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = Math.max(1, document.body.scrollHeight - window.innerHeight);
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Floating elements positions
  const floatingIcons = ['⚡', '🛠️', '💻', '📊', '🧩'];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-inter relative overflow-x-hidden">
      {/* Futuristic Scroll Line (vertical) */}
      <div className="fixed top-0 left-6 h-full w-1 z-50 flex flex-col items-center">
        <div className="w-1 bg-gray-700 rounded-full h-full relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 rounded-full"
            style={{ height: `${scrollProgress}%` }}
            initial={{ height: 0 }}
            animate={{ height: `${scrollProgress}%` }}
            transition={{ ease: 'easeOut', duration: 0.2 }}
          />
        </div>
        {/* Optional glowing dot */}
        <motion.div
          className="mt-1 w-3 h-3 bg-indigo-400 rounded-full shadow-lg"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4 sm:px-8 relative">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group md:pl-2">
            <img
              src={logo}
              alt="Portfolink Logo"
              className="w-10 h-10 group-hover:rotate-12 transition-transform"
            />
            <span className="text-xl font-extrabold text-indigo-400 tracking-tight">
              <i>Portfolink</i>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-2 absolute left-1/2 transform -translate-x-1/2">
            {['hero', 'about', 'blog'].map((section, idx) => (
              <ScrollLink
                key={idx}
                to={section}
                smooth={true}
                duration={500}
                offset={-80}
                className="cursor-pointer hover:text-indigo-400 transition hover:bg-indigo-700 hover:bg-opacity-20 px-4 py-2 rounded"
              >
                {section === 'blog' ? 'Info' : section.charAt(0).toUpperCase() + section.slice(1)}
              </ScrollLink>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex gap-3 items-center">
            <Link
              to="/login"
              className="text-gray-300 hover:text-indigo-400 transition"
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
            className="md:hidden text-gray-300"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="md:hidden px-6 pb-4 space-y-4 bg-gray-900 text-sm">
            {['hero', 'about', 'blog'].map((section, idx) => (
              <ScrollLink
                key={idx}
                to={section}
                smooth={true}
                duration={500}
                offset={-80}
                onClick={() => setMenuOpen(false)}
                className="block cursor-pointer hover:text-indigo-400"
              >
                {section === 'blog' ? 'Info' : section.charAt(0).toUpperCase() + section.slice(1)}
              </ScrollLink>
            ))}
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-center py-2 border rounded-md text-indigo-400 border-indigo-400 hover:bg-indigo-800 transition"
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
      <section
        id="hero"
        style={{ height: '90vh' }}
        className="flex flex-col-reverse md:flex-row items-center justify-between px-6 py-20 sm:px-12 max-w-7xl mx-auto relative overflow-hidden"
      >
        {/* Hero Text */}
        <motion.div
          className="w-full md:w-1/2 text-center md:text-left z-10"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight drop-shadow-lg">
            Create One Smart Link <br className="hidden md:block" /> for All Your Work
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Build your personal tech profile. Upload projects, add your resume, and share a beautiful link with recruiters and teams.
          </p>
          <Link
            to="/register"
            className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition"
          >
            Start Building Now!
          </Link>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          className="w-full md:w-1/2 mb-10 md:mb-0 flex justify-center relative"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="absolute -z-20 w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-30 animate-pulse top-10 right-10" />
          <div className="absolute -z-10 w-64 h-64 bg-purple-500 rounded-full blur-2xl opacity-20 animate-pulse top-20 left-10" />
          <img
            src={slide}
            alt="Tech Profile Preview"
            className="w-full max-w-md rounded-xl shadow-2xl border-2 border-indigo-400 transition-all"
          />
          {/* Floating Icons */}

        </motion.div>
      </section>

      {/* Features Section */}
      <motion.section
        id="about"
        className="bg-gray-900 py-20 px-6 sm:px-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-4xl font-extrabold mb-14 text-indigo-400 leading-tight">
            Why Choose <span className="text-purple-400">Portfolink</span>?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            {[
              { icon: '🧩', title: 'Unified Portfolio', desc: 'All your work and info in one elegant link.' },
              { icon: '⚡', title: 'Quick Setup', desc: 'Create and customize your profile in minutes.' },
              { icon: '🔗', title: 'Sharable Link', desc: 'A sleek personal URL for recruiters & clients.' },
              { icon: '📊', title: 'Performance Stats', desc: 'Track views, clicks, and engagement easily.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 hover:border-indigo-400 transition-all group"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl mb-4">{item.icon}</div>
                <h4 className="font-bold text-lg text-indigo-400 mb-2">{item.title}</h4>
                <p className="text-gray-300 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Blog Section */}
      <motion.section
        id="blog"
        className="bg-gray-900 py-20 px-6 sm:px-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <BlogPage />
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-700 pt-16 px-6 md:px-12 text-gray-300">
        {/* Stats */}
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-2xl font-bold text-indigo-400">6,000+</p>
            <p className="mt-1 text-sm">Profiles Created</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-indigo-400">1,200+</p>
            <p className="mt-1 text-sm">Projects Uploaded</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-indigo-400">3,500+</p>
            <p className="mt-1 text-sm">Links Shared</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-indigo-400">30+</p>
            <p className="mt-1 text-sm">Companies Hiring</p>
          </div>
        </div>

        {/* Info */}
        <div className="max-w-7xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 pb-12">
          <div>
            <h2 className="text-xl font-semibold text-indigo-400 mb-2">Portfolink</h2>
            <p className="text-sm leading-relaxed">
              Portfolink is your personal tech portfolio hub. Designed for developers, designers, and creators to showcase their work professionally.
            </p>
            <p className="mt-4 text-xs text-gray-500">© 2025 Portfolink. All rights reserved.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <ScrollLink to="blog" smooth={true} duration={500} offset={-80} className="cursor-pointer hover:text-indigo-400">
                  Info
                </ScrollLink>
              </li>
              <li>
                <ScrollLink to="about" smooth={true} duration={500} offset={-80} className="cursor-pointer hover:text-indigo-400">
                  About
                </ScrollLink>
              </li>
              <li>
                <ScrollLink to="contact" smooth={true} duration={500} offset={-80} className="cursor-pointer hover:text-indigo-400">
                  Contact
                </ScrollLink>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact Info</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: <a href="mailto:support@portfolink.com" className="hover:text-indigo-400">support@portfolink.com</a></li>
              <li>Phone: <a href="tel:+2347069991171" className="hover:text-indigo-400">+234 706 999 1171</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
