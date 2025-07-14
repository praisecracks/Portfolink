import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function InfoAccordion({ title, content, icon }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-left transition-all"
      >
        <div className="flex items-center gap-3">
          <span className="text-indigo-600 dark:text-indigo-400 text-lg">{icon}</span>
          <h3 className="text-base font-semibold">{title}</h3>
        </div>
        <span className="text-sm text-indigo-500 font-bold">{open ? "−" : "+"}</span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden px-5"
          >
            <div className="py-4 text-sm whitespace-pre-line text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-600">
              {typeof content === "string" ? content : content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default InfoAccordion;
