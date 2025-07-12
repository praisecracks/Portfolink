// FULL CODE IS TOO LONG FOR A SINGLE MESSAGE — SENDING IN 2 PARTS.
// THIS IS PART 1 (Top Half)
import { generateDescription } from "../../Utils/aiHelper";
import React, { useEffect, useState } from "react";
import {
  FaPlusCircle,
  FaTrash,
  FaEdit,
  FaExternalLinkAlt,
  FaTimes,
  FaHistory,
} from "react-icons/fa";
import { FaSpinner } from "react-icons/fa";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import axios from "axios";

function Projects() {
  const [generating, setGenerating] = useState(false);
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [pushHistory, setPushHistory] = useState([]);
  const [showPushHistory, setShowPushHistory] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageFile: null,
    imageURL: "",
    category: "",
    github: "",
    liveURL: "",
    tags: "",
  });

  const [sortOption, setSortOption] = useState("newest");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    const q = query(collection(db, "projects"), where("userId", "==", user.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects(items);
    });
    return () => unsub();
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid || !showPushHistory) return;
    const q = query(collection(db, "portfolio"), where("userId", "==", user.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPushHistory(items);
    });
    return () => unsub();
  }, [user?.uid, showPushHistory]);

  const openAddForm = () => {
    setFormData({
      title: "",
      description: "",
      imageFile: null,
      imageURL: "",
      category: "",
      github: "",
      liveURL: "",
      tags: "",
    });
    setEditId(null);
    setFormVisible(true);
  };

  const openEditForm = (project) => {
    setFormData({
      title: project.title,
      description: project.description,
      imageFile: null,
      imageURL: project.imageURL || "",
      category: project.category || "",
      github: project.github || "",
      liveURL: project.liveURL || "",
      tags: (project.tags || []).join(", "),
    });
    setEditId(project.id);
    setFormVisible(true);
  };

  const handleImageUpload = async (imageFile) => {
    const form = new FormData();
    form.append("image", imageFile);
    try {
      const res = await axios.post("https://portfolink-backend.onrender.com/upload", form);
      return res.data.imageUrl;
    } catch (error) {
      toast.error("Image upload failed");
      return "";
    }
  };

  const handleSubmit = async (e, push = false) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error("Title and description are required");
      return;
    }

    try {
      setLoading(true);
      let uploadedImageURL = formData.imageURL;

      if (formData.imageFile) {
        uploadedImageURL = await handleImageUpload(formData.imageFile);
        if (!uploadedImageURL) return;
      }

      const tags = formData.tags
        ? formData.tags.split(",").map((tag) => tag.trim().toLowerCase())
        : [];

      const data = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        github: formData.github,
        liveURL: formData.liveURL,
        tags,
        imageURL: uploadedImageURL,
        userId: user.uid,
        createdAt: serverTimestamp(),
        pushed: push,
      };

      if (editId) {
        await updateDoc(doc(db, "projects", editId), data);
        toast.success(push ? "Project pushed live!" : "Project updated");
        if (push) {
          await addDoc(collection(db, "portfolio"), {
            ...data,
            fromProjectId: editId,
          });
        }
      } else {
        if (push) {
          await addDoc(collection(db, "portfolio"), data);
        } else {
          await addDoc(collection(db, "projects"), data);
        }
        toast.success(push ? "Project pushed!" : "Project added");
      }

      setFormVisible(false);
      setEditId(null);
      setFormData({
        title: "",
        description: "",
        imageFile: null,
        imageURL: "",
        category: "",
        github: "",
        liveURL: "",
        tags: "",
      });
    } catch (err) {
      toast.error("Error saving project");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteDoc(doc(db, "projects", id));
      toast.success("Deleted!");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const filteredProjects = projects
    .filter((p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === "all" || p.category === categoryFilter)
    )
    .sort((a, b) => {
      if (sortOption === "newest") return b.createdAt?.seconds - a.createdAt?.seconds;
      if (sortOption === "title") return a.title.localeCompare(b.title);
      return 0;
    });

  const categories = ["all", ...new Set(projects.map((p) => p.category).filter(Boolean))];
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 dark:bg-gray-900">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-6 dark:bg-gray-900 dark:text-gray-300">
        <h1 className="text-2xl font-bold text-indigo-700 dark:bg-gray-900 dark:text-gray-400 ">📁 Manage Projects</h1>
      <div className="flex gap-2">
      <button
        onClick={() => setShowPushHistory(true)}
        className="flex items-center gap-2 text-sm px-4 py-2 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50 
                  dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-900"
      >
        <FaHistory /> Push History
      </button>
      <button
        onClick={openAddForm}
        className="flex items-center gap-2 text-sm bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 
                  dark:bg-indigo-500 dark:hover:bg-indigo-600"
      >
        <FaPlusCircle /> New Project
      </button>
    </div>

      </div>

     {!showPushHistory && (
  <>
    {/* Search, Filter, Sort */}
    <div className="grid md:grid-cols-3 gap-3 mb-6">
      <input
        type="text"
        placeholder="Search projects..."
        className="border px-3 py-2 rounded w-full bg-white text-gray-800 dark:bg-gray-800 dark:text-white dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        className="border px-3 py-2 rounded w-full bg-white text-gray-800 dark:bg-gray-800 dark:text-white dark:border-gray-700"
      >
        {categories.map((cat, i) => (
          <option key={i} value={cat}>
            {cat === "all" ? "All Categories" : cat}
          </option>
        ))}
      </select>
      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        className="border px-3 py-2 rounded w-full bg-white text-gray-800 dark:bg-gray-800 dark:text-white dark:border-gray-700"
      >
        <option value="newest">Sort: Newest</option>
        <option value="title">Sort: Title A-Z</option>
      </select>
    </div>

    {/* Projects Grid */}
    {filteredProjects.length === 0 ? (
      <p className="text-gray-500 dark:text-gray-400">No projects found.</p>
    ) : (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-sm overflow-hidden hover:shadow-md cursor-pointer relative transition"
          >
            {project.pushed && (
              <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                Live
              </span>
            )}
            {project.imageURL ? (
              <img
                src={project.imageURL}
                alt={project.title}
                className="w-full h-40 object-cover"
              />
            ) : (
              <div className="h-40 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold text-indigo-700 dark:text-indigo-400 truncate">
                {project.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                {project.description}
              </p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  {project.category || "Uncategorized"}
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditForm(project);
                    }}
                    className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(project.id);
                    }}
                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                  >
                    <FaTrash />
                  </button>
                  {project.liveURL && (
                    <a
                      href={project.liveURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      <FaExternalLinkAlt />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </>
)}


    {/* Push History */}
{showPushHistory && (
  <div className="mt-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold text-indigo-700 dark:text-indigo-400">🕓 Push History</h2>
      <button
        onClick={() => setShowPushHistory(false)}
        className="text-sm px-4 py-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white"
      >
        Back to Projects
      </button>
    </div>

    {pushHistory.length === 0 ? (
      <p className="text-gray-500 dark:text-gray-400">No push history found.</p>
    ) : (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pushHistory.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedProject(item)}
            className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition"
          >
            {item.imageURL ? (
              <img
                src={item.imageURL}
                alt={item.title}
                className="w-full h-40 object-cover"
              />
            ) : (
              <div className="h-40 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500">
                No Image
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold text-indigo-700 dark:text-indigo-400 truncate">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}


    {formVisible && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex justify-center items-center z-50"
    onClick={() => setFormVisible(false)}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-white dark:bg-gray-900 rounded-xl shadow-lg max-w-xl w-full p-6 relative text-gray-900 dark:text-gray-100 overflow-y-auto max-h-[90vh]"
    >
      <button
        onClick={() => setFormVisible(false)}
        className="absolute top-3 right-3 text-xl text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
      >
        <FaTimes />
      </button>
      <h2 className="text-lg font-semibold mb-4 text-indigo-700 dark:text-indigo-400">
        {editId ? "Edit Project" : "Add New Project"}
      </h2>

      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
      className="w-full border px-3 py-1 md:py-2 mb-3 rounded bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
        />

        <textarea
          placeholder="Description (Markdown supported)"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full border px-3 py-2 mb-3 rounded h-28 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
        />

        <button
          type="button"
          onClick={async () => {
            if (!formData.title?.trim()) {
              toast.error("Add a title first!");
              return;
            }

            setGenerating(true);
            try {
              const prompt = `
                You're an AI assistant inside a portfolio builder app called Portfolink.
                Your task is to generate a short, clean, resume-ready project description based on a title and optional tags.
                Respond only with the description. Do not mention Portfolink, the user, or yourself.
                Project Title: ${formData.title}
                Tags: ${formData.tags}
                Description:
              `.trim();

              const aiDesc = await generateDescription(prompt);
              if (!aiDesc || aiDesc.trim().length < 10) {
                throw new Error("Empty or weak AI response");
              }

              setFormData({ ...formData, description: aiDesc });
              toast.success("Description generated!");
            } catch (error) {
              console.error("AI Error:", error);
              toast.error("AI failed to generate description.");
            } finally {
              setGenerating(false);
            }
          }}
          className="text-sm text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 flex items-center gap-2 mb-3 disabled:opacity-50"
          disabled={generating}
        >
          {generating ? (
            <>
              <FaSpinner className="animate-spin" />
              Generating...
            </>
          ) : (
            "AI Generate Description"
          )}
        </button>






<input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imageURL: URL.createObjectURL(file), // for preview
      }));
    }
  }}
  className="w-full mb-3 text-sm file:mr-3 file:px-4 file:py-2 file:rounded file:border-0 file:text-white file:bg-indigo-600 hover:file:bg-indigo-700 dark:file:bg-indigo-500 dark:hover:file:bg-indigo-600"
/>

{formData.imageURL && (
  <div className="mb-3">
    <img
      src={formData.imageURL}
      alt="Preview"
      className="w-full h-40 object-cover rounded shadow"
    />
  </div>
)}

<input
  type="text"
  placeholder="Category"
  value={formData.category}
  onChange={(e) =>
    setFormData({ ...formData, category: e.target.value })
  }
  className="w-full border px-3 py-2 mb-3 rounded bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
/>

<input
  type="text"
  placeholder="GitHub URL"
  value={formData.github}
  onChange={(e) =>
    setFormData({ ...formData, github: e.target.value })
  }
  className="w-full border px-3 py-2 mb-3 rounded bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
/>

<input
  type="text"
  placeholder="Live URL"
  value={formData.liveURL}
  onChange={(e) =>
    setFormData({ ...formData, liveURL: e.target.value })
  }
  className="w-full border px-3 py-2 mb-3 rounded bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
/>

<input
  type="text"
  placeholder="Tags (comma separated)"
  value={formData.tags}
  onChange={(e) =>
    setFormData({ ...formData, tags: e.target.value })
  }
  className="w-full border px-3 py-2 mb-4 rounded bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
/>

<div className="flex justify-end gap-3">
  <button
    type="submit"
    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
  >
    {editId ? "Update" : "Add"}
  </button>
  <button
    type="button"
    onClick={(e) => handleSubmit(e, true)}
    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
  >
    Push Live
  </button>
</div>

            </form>
          </div>
        </div>
      )}

      {/* View Project Modal */}
     {selectedProject && (
  <div
    className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
    onClick={() => setSelectedProject(null)}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-white dark:bg-gray-900 p-6 rounded-xl max-w-2xl w-full relative shadow-md overflow-y-auto max-h-[90vh] text-gray-900 dark:text-gray-100"
    >
      <button
        onClick={() => setSelectedProject(null)}
        className="absolute top-4 right-4 text-xl text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
      >
        <FaTimes />
      </button>
      <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-400 mb-4">
        {selectedProject.title}
      </h2>

      {selectedProject.imageURL && (
        <img
          src={selectedProject.imageURL}
          alt={selectedProject.title}
          className="w-full h-60 object-cover rounded mb-4"
        />
      )}

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        className="prose dark:prose-invert max-w-none"
      >
        {selectedProject.description || "No description"}
      </ReactMarkdown>

      <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
        Category: {selectedProject.category || "N/A"}
      </p>

      {selectedProject.github && (
        <a
          href={selectedProject.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline mt-2 block"
        >
          GitHub Repo
        </a>
      )}

      {selectedProject.liveURL && (
        <a
          href={selectedProject.liveURL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-green-600 hover:underline mt-1 block"
        >
          View Live
        </a>
      )}
    </div>
  </div>
)}
</div>
  )};


export default Projects;
