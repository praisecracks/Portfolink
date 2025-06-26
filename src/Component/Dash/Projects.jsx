import React, { useEffect, useState } from "react";
import {
  FaPlusCircle,
  FaTrash,
  FaEdit,
  FaTimes,
  FaExternalLinkAlt,
} from "react-icons/fa";
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
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageFile: null,
    imageURL: "",
    category: "",
    github: "",
    liveSite: "",
    technologies: "",
  });
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const openAddForm = () => {
    setFormData({
      title: "",
      description: "",
      imageFile: null,
      imageURL: "",
      category: "",
      github: "",
      liveSite: "",
      technologies: "",
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
      liveSite: project.liveSite || "",
      technologies: project.technologies || "",
    });
    setEditId(project.id);
    setFormVisible(true);
  };

  const handleImageUpload = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const res = await axios.post("https://portfolink-backend.onrender.com/upload", formData);
      return res.data.imageUrl;
    } catch (error) {
      toast.error("Image upload failed");
      console.error("Upload error:", error);
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

      const projectData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        github: formData.github,
        liveSite: formData.liveSite,
        technologies: formData.technologies,
        imageURL: uploadedImageURL,
        userId: user.uid,
        createdAt: serverTimestamp(),
        pushed: push,
      };

      if (editId) {
        await updateDoc(doc(db, "projects", editId), projectData);
        toast.success(push ? "Project pushed live!" : "Project updated");

        if (push) {
          await addDoc(collection(db, "portfolio"), {
            ...projectData,
            fromProjectId: editId,
          });
        }
      } else {
        if (push) {
          await addDoc(collection(db, "portfolio"), projectData);
        } else {
          await addDoc(collection(db, "projects"), projectData);
        }
        toast.success(push ? "Project pushed live!" : "Project added");
      }

      if (push) {
        toast.info("✅ Project pushed!", {
          autoClose: 4000,
          icon: "🚀",
          onClick: () => {
            window.open(formData.liveSite || "#", "_blank");
          },
        });
      }

      setFormVisible(false);
      setFormData({
        title: "",
        description: "",
        imageFile: null,
        imageURL: "",
        category: "",
        github: "",
        liveSite: "",
        technologies: "",
      });
      setEditId(null);
    } catch (err) {
      toast.error("Error saving project");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteDoc(doc(db, "projects", id));
      toast.success("Project deleted");
    } catch (err) {
      toast.error("Error deleting project");
      console.error(err);
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-700">Projects</h1>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <FaPlusCircle />
          Add Project
        </button>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search projects..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-4 px-4 py-2 border rounded"
      />

      {/* FORM */}
      {formVisible && (
        <div className="bg-white rounded-xl p-6 shadow-md mb-6 border">
          <h2 className="text-xl font-bold text-indigo-600 mb-4">
            {editId ? "Edit Project" : "New Project"}
          </h2>
          <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
            <input type="text" placeholder="Project title" className="w-full px-4 py-2 border rounded" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            <textarea placeholder="Project description (supports markdown)" className="w-full px-4 py-2 border rounded h-32" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            <input type="text" placeholder="Project category" className="w-full px-4 py-2 border rounded" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
            <input type="text" placeholder="Technologies used" className="w-full px-4 py-2 border rounded" value={formData.technologies} onChange={(e) => setFormData({ ...formData, technologies: e.target.value })} />
            <input type="url" placeholder="GitHub URL" className="w-full px-4 py-2 border rounded" value={formData.github} onChange={(e) => setFormData({ ...formData, github: e.target.value })} />
            <input type="url" placeholder="Live site URL" className="w-full px-4 py-2 border rounded" value={formData.liveSite} onChange={(e) => setFormData({ ...formData, liveSite: e.target.value })} />
            <input type="file" accept="image/*" onChange={(e) => setFormData({ ...formData, imageFile: e.target.files[0] })} className="w-full px-4 py-2 border rounded" />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setFormVisible(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded">Cancel</button>
              <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
              <button type="button" onClick={(e) => handleSubmit(e, true)} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">{loading ? "Pushing..." : "Push Live"}</button>
            </div>
          </form>
        </div>
      )}

      {/* PROJECT CARDS */}
      {filteredProjects.length === 0 ? (
        <p className="text-gray-500">No project found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <div key={project.id} onClick={() => setSelectedProject(project)} className="bg-white rounded-xl shadow-md overflow-hidden group relative hover:shadow-xl cursor-pointer">
              {project.pushed && <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">Live</span>}
              {project.imageURL ? <img src={project.imageURL} alt={project.title} className="w-full h-48 object-cover" /> : <div className="bg-gray-200 w-full h-48 flex items-center justify-center text-gray-500 text-lg font-bold">No Image</div>}
              <div className="p-4 space-y-2">
                <p className="text-gray-800 text-sm line-clamp-2">{project.description}</p>
                <p className="text-xs text-indigo-600 font-medium">{project.category || "No category"}</p>
                {project.technologies && <p className="text-xs text-gray-600">Tech: {project.technologies}</p>}
                <div className="flex justify-end gap-3 text-lg">
                  <button onClick={(e) => { e.stopPropagation(); openEditForm(project); }} className="text-blue-500 hover:text-blue-700" title="Edit"><FaEdit /></button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(project.id, project.imagePath); }} className="text-red-500 hover:text-red-700" title="Delete"><FaTrash /></button>
                  {project.liveSite && (
                    <a href={project.liveSite} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:text-indigo-700" title="Live Site" onClick={(e) => e.stopPropagation()}>
                      <FaExternalLinkAlt />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50" onClick={() => setSelectedProject(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl p-6 max-w-2xl w-full relative shadow-lg overflow-y-auto max-h-[90vh]">
            <button onClick={() => setSelectedProject(null)} className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl"><FaTimes /></button>
            <h3 className="text-2xl font-semibold mb-3 text-indigo-700">{selectedProject.title}</h3>
            {selectedProject.imageURL && (
              <img src={selectedProject.imageURL} alt={selectedProject.title} className="w-full h-56 object-cover rounded mb-4" />
            )}
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                p: ({ node, ...props }) => <p className="text-gray-700 mb-2" {...props} />,
                h1: ({ node, ...props }) => <h1 className="text-xl font-bold" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-lg font-semibold" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc ml-5 mb-2" {...props} />,
                code: ({ node, inline, className, children, ...props }) => (
                  <code className={`bg-gray-100 px-1 rounded text-sm ${className || ""}`} {...props}>
                    {children}
                  </code>
                ),
              }}
            >
              {selectedProject.description || "No description"}
            </ReactMarkdown>
            <p className="text-sm text-indigo-500 mt-4">Category: {selectedProject.category || "N/A"}</p>
            {selectedProject.github && (
              <a href={selectedProject.github} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline mr-4">
                GitHub Repo
              </a>
            )}
            {selectedProject.liveSite && (
              <a href={selectedProject.liveSite} target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 hover:underline">
                View Live
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;
