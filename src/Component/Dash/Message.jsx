import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';
import { FaTrash, FaCheckCircle } from 'react-icons/fa';

function Messages() {
  const [messages, setMessages] = useState([]);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, `messages/${currentUser.uid}/inbox`),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleDelete = async (id) => {
    if (!currentUser) return;

    await deleteDoc(doc(db, `messages/${currentUser.uid}/inbox`, id));
  };

  const handleMarkAsRead = async (id, read) => {
    if (!currentUser) return;

    const msgRef = doc(db, `messages/${currentUser.uid}/inbox`, id);
    await updateDoc(msgRef, { read: !read });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 mb-6">
        Inbox
        <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-semibold leading-none text-white bg-indigo-500 rounded-full">
          {messages.length}
        </span>
      </h1>

      {messages.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No messages yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`relative transition-all duration-200 bg-white dark:bg-gray-800 shadow-md rounded-md p-4  ${
                msg.read
                  ? ' dark:border-gray-700'
                  : 'border-indigo-400 ring-2 ring-indigo-300 dark:ring-indigo-500'
              } hover:scale-[1.01] hover:shadow-lg`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">
                    {msg.name || 'Anonymous'}{' '}
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({msg.email || 'No email'})
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {msg.timestamp || 'No timestamp'}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleMarkAsRead(msg.id, msg.read)}
                    title={msg.read ? 'Mark as Unread' : 'Mark as Read'}
                    className="text-green-600 hover:text-green-800 dark:hover:text-green-400"
                  >
                    <FaCheckCircle size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    title="Delete Message"
                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                  >
                    <FaTrash size={18} />
                  </button>
                </div>
              </div>

              <hr className="my-2 border-gray-300 dark:border-gray-600" />

              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {msg.message || 'No content'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Messages;
