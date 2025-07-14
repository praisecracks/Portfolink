import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
  updateDoc,
  getDocs,
  where,
  limit,
  startAfter,
} from 'firebase/firestore';
import { FaTrash, FaCheckCircle, FaUserCircle, FaSearch } from 'react-icons/fa';
import { format } from 'date-fns';

function Messages() {
  const [messages, setMessages] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState('all');
  const [adminId, setAdminId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const PAGE_SIZE = 10;

  useEffect(() => {
    const fetchAdminUIDAndMessages = async () => {
      try {
        const adminQuery = query(collection(db, 'users'), where('role', '==', 'Admin'));
        const snapshot = await getDocs(adminQuery);

        const resolvedAdminId = !snapshot.empty
          ? snapshot.docs[0].id
          : 'msLzg2LxX7Rd3WKVwaqmhWl9KUk2'; // fallback admin UID

        setAdminId(resolvedAdminId);

        const inboxRef = collection(db, `messages/${resolvedAdminId}/inbox`);
        const baseQuery = query(inboxRef, orderBy('timestamp', 'desc'), limit(PAGE_SIZE));

        const unsubscribe = onSnapshot(baseQuery, (snapshot) => {
          const docs = snapshot.docs;
          const msgs = docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setMessages(msgs);
          setLastDoc(docs[docs.length - 1]);
          setHasMore(docs.length === PAGE_SIZE);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching admin messages:', error);
        setLoading(false);
      }
    };

    fetchAdminUIDAndMessages();
  }, []);

  const handleDelete = async (id) => {
    if (!adminId) return;
    await deleteDoc(doc(db, `messages/${adminId}/inbox`, id));
  };

  const handleMarkAsRead = async (id, read) => {
    if (!adminId) return;
    await updateDoc(doc(db, `messages/${adminId}/inbox`, id), { read: !read });
  };

  const loadMore = async () => {
    if (!adminId || !lastDoc) return;

    const inboxRef = collection(db, `messages/${adminId}/inbox`);
    const moreQuery = query(
      inboxRef,
      orderBy('timestamp', 'desc'),
      startAfter(lastDoc),
      limit(PAGE_SIZE)
    );

    const snapshot = await getDocs(moreQuery);
    const docs = snapshot.docs;
    const newMessages = docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    setMessages((prev) => [...prev, ...newMessages]);
    setLastDoc(docs[docs.length - 1]);
    setHasMore(docs.length === PAGE_SIZE);
  };

  useEffect(() => {
    let filteredMsgs = [...messages];

    if (filter === 'read') {
      filteredMsgs = filteredMsgs.filter((msg) => msg.read);
    } else if (filter === 'unread') {
      filteredMsgs = filteredMsgs.filter((msg) => !msg.read);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filteredMsgs = filteredMsgs.filter(
        (msg) =>
          (msg.name && msg.name.toLowerCase().includes(term)) ||
          (msg.email && msg.email.toLowerCase().includes(term))
      );
    }

    setFiltered(filteredMsgs);
  }, [filter, searchTerm, messages]);

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 max-w-5xl mx-auto dark:bg-gray-900 dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Inbox</h1>
        <span className="inline-flex items-center justify-center px-3 py-1 text-xs font-semibold bg-indigo-500 text-white rounded-full">
          {messages.length}
        </span>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="relative w-full sm:max-w-xs">
          <FaSearch className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded w-full outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          {['all', 'unread', 'read'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1 rounded border text-sm transition ${
                filter === type
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-400">Loading...</div>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No messages found.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-sm p-4 transition-all ${
                !msg.read ? 'border-l-4 border-indigo-500' : ''
              }`}
            >
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-400 text-indigo-700 dark:text-white flex items-center justify-center font-bold text-xl">
                  {msg.name ? msg.name[0].toUpperCase() : <FaUserCircle />}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p
                        className={`font-semibold text-gray-800 dark:text-white ${
                          !msg.read ? 'font-extrabold' : ''
                        }`}
                      >
                        {msg.name || 'Anonymous'}{' '}
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          ({msg.email || 'No email'})
                        </span>
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {msg.timestamp?.toDate
                          ? format(msg.timestamp.toDate(), 'PPpp')
                          : msg.timestamp || 'No timestamp'}
                      </p>
                      <p className="text-xs italic text-indigo-500 mt-2">
                        Source: {msg.source || 'Portfolio'}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleMarkAsRead(msg.id, msg.read)}
                        title={msg.read ? 'Mark as Unread' : 'Mark as Read'}
                        className="text-green-600 hover:text-green-800 dark:hover:text-green-400"
                      >
                        <FaCheckCircle size={18} />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(msg.id)}
                        title="Delete Message"
                        className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </div>

                  <hr className="my-3 border-gray-200 dark:border-gray-600" />

                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {msg.message || 'No content'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            className="px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Load More
          </button>
        </div>
      )}

      {/* Modal OUTSIDE LOOP */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-sm">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Confirm Delete
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this message?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleDelete(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Messages;
