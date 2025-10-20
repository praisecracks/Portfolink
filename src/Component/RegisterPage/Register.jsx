import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { auth, googleProvider, githubProvider, db } from '../../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  fetchSignInMethodsForEmail,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '../UI/ToastContext';
import registerart from '../../assets/img.png';
import logo from "../../assets/portLogo.png"

function Register() {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loadingProvider, setLoadingProvider] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required.';
    if (!formData.email.includes('@')) newErrors.email = 'Enter a valid email.';
    if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters.';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match.';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0)
      return setErrors(validationErrors);

    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      await setDoc(doc(db, 'users', res.user.uid), {
        uid: res.user.uid,
        name: formData.name,
        email: formData.email,
        provider: 'email/password',
        createdAt: new Date(),
      });
      toast.push('Account created successfully ✅', { type: 'info' });
      navigate('/login');
    } catch (err) {
        const codeMsg = err?.code ? `${err.code}` : err?.message || 'Unknown error';
        toast.push(`Error creating account: ${codeMsg}`, { type: 'error' });
        console.error('Register error:', err);
    }
  };

  const handleProviderLogin = async (providerName, providerObj) => {
    try {
      setLoadingProvider(providerName);
      const result = await signInWithPopup(auth, providerObj);
      const user = result.user;

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: user.displayName || `${providerName} User`,
        email: user.email,
        photoURL: user.photoURL || null,
        provider: user.providerData[0]?.providerId || providerName,
        createdAt: new Date(),
      });

  toast.push(`Signed in with ${providerName}`, { type: 'info' });
      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'auth/account-exists-with-different-credential') {
        const email = err.customData?.email;
        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods.includes('password')) {
          toast.push('This email is already registered. Try logging in with email/password.', { type: 'error' });
        } else if (methods.includes('google.com')) {
          toast.push('This email is already registered with Google. Try signing in with Google.', { type: 'error' });
        } else {
          toast.push('This email is already registered with another provider.', { type: 'error' });
        }
      } else {
        const codeMsg = err?.code ? `${err.code}` : err?.message || 'Unknown error';
        console.error('Provider sign-in error:', err);
        toast.push(`${providerName} sign-in failed: ${codeMsg}`, { type: 'error' });
      }
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-gray-200 font-inter overflow-hidden relative">

      {/* Left Side (Futuristic Content) */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 hidden md:flex flex-col items-center justify-center px-10 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(120,80,250,0.15)_0%,transparent_70%)]"></div>
        <motion.img
          src={registerart}
          alt="Creative workspace"
          className="w-3/4 max-w-lg object-contain mb-6 rounded-2xl opacity-90"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center max-w-md"
        >
          <div className='flex'>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent mb-3">
            Welcome to Portfolink
          </h1>
          <img src={logo} alt=""  className='h-10 w-10'/>
          </div>
          <p className="text-gray-400 leading-relaxed">
            Join a community of creators, freelancers, and developers building
            their personal brand online. Create a stunning portfolio, showcase
            your work, and connect with opportunities — all in one place.
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Ready to start your journey? Sign up now and let’s make your digital
            presence shine ✨
          </p>
        </motion.div>
      </motion.div>

      {/* Right Side (Form Section) */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="z-20 w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-md shadow-2xl border border-white/20"
        >
          <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
            Create Your Portfolink Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 focus:ring-2 focus:ring-indigo-500 outline-none text-white placeholder-gray-400"
              />
              {errors.name && (
                <p className="text-xs text-red-400 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 focus:ring-2 focus:ring-indigo-500 outline-none text-white placeholder-gray-400"
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 focus:ring-2 focus:ring-indigo-500 outline-none text-white placeholder-gray-400"
              />
              {errors.password && (
                <p className="text-xs text-red-400 mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="********"
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 focus:ring-2 focus:ring-indigo-500 outline-none text-white placeholder-gray-400"
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 text-white py-2 rounded-lg font-semibold hover:scale-[1.02] transition duration-300"
            >
              Create Account
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <hr className="flex-grow border-gray-500/30" />
            <span className="text-sm text-gray-400">OR</span>
            <hr className="flex-grow border-gray-500/30" />
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => handleProviderLogin('Google', googleProvider)}
              disabled={loadingProvider === 'Google'}
              className="flex items-center justify-center gap-2 border border-gray-500/30 bg-white/10 py-2 rounded-lg hover:bg-white/20 transition"
            >
              <FaGoogle className="text-red-400" />
              {loadingProvider === 'Google'
                ? 'Signing in...'
                : 'Sign up with Google'}
            </button>
            <button
              onClick={() => handleProviderLogin('GitHub', githubProvider)}
              disabled={loadingProvider === 'GitHub'}
              className="flex items-center justify-center gap-2 border border-gray-500/30 bg-white/10 py-2 rounded-lg hover:bg-white/20 transition"
            >
              <FaGithub className="text-gray-300" />
              {loadingProvider === 'GitHub'
                ? 'Signing in...'
                : 'Sign up with GitHub'}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:underline font-medium">
              Login
            </Link>
          </p>
        </motion.div>
      </div>

      <footer className="absolute bottom-4 text-xs text-gray-500 w-full text-center">
        © {new Date().getFullYear()} Portfolink. Crafted with ❤️ by Praisecrack.
      </footer>
    </div>
  );
}

export default Register;
