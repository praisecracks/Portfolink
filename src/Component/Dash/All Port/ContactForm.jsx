import React, { useState } from "react";
import { db } from "../../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function ContactForm({ userId }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isValid = () => {
    return form.name && form.email && form.message;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid()) {
      setStatus("Please fill out all fields.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, `messages/${userId}/inbox`), {
        name: form.name,
        email: form.email,
        message: form.message,
        createdAt: serverTimestamp(),
      });

      setForm({ name: "", email: "", message: "" });
      setStatus("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto ">
    <p className="text-gray-500 text-sm italic text-center mb-10"> This Update by default</p>
      <h2 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 mb-6 text-center">Contact Me</h2>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md space-y-5 transition-all">
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-200 mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800 dark:text-white"
            placeholder="Your Name"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-200 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800 dark:text-white"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-200 mb-1">Message</label>
          <textarea
            name="message"
            rows="4"
            value={form.message}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800 dark:text-white"
            placeholder="Tell me what you need..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>

        {status && (
          <p
            className={`text-sm text-center font-medium mt-3 ${
              status.includes("success")
                ? "text-green-600 dark:text-green-400"
                : "text-red-500 dark:text-red-400"
            }`}
          >
            {status}
          </p>
        )}
      </form>
    </section>
  );
}

export default ContactForm;
