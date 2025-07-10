import React from 'react';
import { FaInfoCircle, FaLightbulb, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import logo from "../../assets/portLogo.png";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.3,
    },
  },
};

const fadeScaleUp = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const listItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 120, damping: 12 },
  },
};

const animatedGradientText = {
  background: 'linear-gradient(270deg, #6366F1, #4F46E5, #818CF8, #6366F1)',
  backgroundSize: '600% 600%',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: 'gradientShift 12s ease infinite',
};

function About() {
  return (
    <main
      lang="en"
      role="main"
      className="min-h-screen relative px-6 py-16 max-w-4xl mx-auto text-gray-900 dark:text-gray-100 select-text"
      aria-labelledby="about-heading"
    >
      {/* Background */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 bg-gradient-to-tr from-indigo-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500"
      />
      <svg
        className="absolute top-[-10%] left-[-10%] w-96 h-96 opacity-20 pointer-events-none"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="200" cy="200" r="200" fill="#6366F1" />
      </svg>
      <svg
        className="absolute bottom-[-10%] right-[-10%] w-96 h-96 opacity-20 pointer-events-none"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="200" cy="200" r="200" fill="#4F46E5" />
      </svg>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          id="about-heading"
          className="text-3xl font-semibold mb-10 flex items-center gap-3 select-text"
          style={animatedGradientText}
          variants={fadeScaleUp}
        >
          <img src={logo} alt="Portfolink logo" className="w-24 h-24" />
          <FaInfoCircle className="w-7 h-7 text-indigo-700 dark:text-indigo-400" aria-hidden="true" />
          About Portfolink
        </motion.h1>

        <motion.section
          className="mb-10 max-w-prose text-gray-800 dark:text-gray-300"
          variants={fadeScaleUp}
          aria-labelledby="what-is-portfolink"
        >
          <h2 id="what-is-portfolink" className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-3">
            What is Portfolink?
          </h2>
          <p>
            Portfolink is a clean, powerful platform that lets you showcase your professional portfolio with clarity and impact.
            It’s designed for developers, designers, and creatives who want an elegant, easy-to-use online presence.
          </p>
        </motion.section>

        <motion.section
          className="mb-10 max-w-prose text-gray-800 dark:text-gray-300"
          variants={fadeScaleUp}
          aria-labelledby="why-portfolink"
        >
          <h2 id="why-portfolink" className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-3 flex items-center gap-2">
            <FaLightbulb className="w-5 h-5 text-indigo-500 dark:text-indigo-300" aria-hidden="true" />
            Why Portfolink?
          </h2>
          <p>
            Focused on performance, security, and user experience, Portfolink ensures your portfolio looks great and loads fast on any device.
            Its intuitive design means you can build and update your portfolio effortlessly.
          </p>
        </motion.section>

        <motion.section
          className="max-w-prose text-gray-700 dark:text-gray-300"
          variants={fadeScaleUp}
          aria-labelledby="key-features"
        >
          <h2 id="key-features" className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-4">
            Key Features
          </h2>
          <ul className="list-disc list-inside space-y-3">
            {[
              'Showcase projects with detailed descriptions and live links.',
              'Highlight your skills, experience, and achievements clearly.',
              'Export your portfolio as PDF, Word, or images for sharing.',
              'Receive real-time notifications and updates.',
              'Enjoy a modern, responsive interface built for ease and impact.',
            ].map((feature, i) => (
              <motion.li
                key={i}
                className="flex items-center gap-2 cursor-default hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors duration-300 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 rounded"
                variants={listItemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaCheckCircle className="text-indigo-500 dark:text-indigo-300 w-5 h-5 flex-shrink-0" aria-hidden="true" />
                {feature}
              </motion.li>
            ))}
          </ul>
        </motion.section>
      </motion.div>

      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50% }
            50% { background-position: 100% 50% }
            100% { background-position: 0% 50% }
          }
        `}
      </style>

      <footer className="text-center py-6 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-transparent border-t border-gray-200 dark:border-gray-700 mt-20">
        © 2025 <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Portfolink</span>. Built with purpose.
      </footer>
    </main>
  );
}

export default About;
