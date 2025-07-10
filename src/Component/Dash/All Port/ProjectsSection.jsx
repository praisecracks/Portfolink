import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";
import { FiImage } from "react-icons/fi";

function ProjectsSection({ userId }) {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [category, setCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  const categories = ["All", "Web", "Mobile", "Design"];

  useEffect(() => {
    if (!userId) return;

    setIsLoading(true);
    const q = query(collection(db, "portfolio"), where("userId", "==", userId));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(data);
        setFilteredProjects(data);
        setIsLoading(false);
      },
      (err) => {
        console.error("Error fetching projects:", err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    if (category === "All") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(
        projects.filter((p) => p.tags?.includes(category.toLowerCase()))
      );
    }
  }, [category, projects]);

  return (
    <section className="max-w-6xl mx-auto  transition-all">
       <p className="text-gray-500 text-sm italic text-center mb-10"> This Update by default</p>
      <h2 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 mb-8 text-center">
        Projects
      </h2>

      <div className="flex justify-center gap-2 mb-6 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded transition font-semibold ${
              category === cat
                ? "bg-indigo-600 text-white dark:bg-indigo-500"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-600/30"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <div className="w-10 h-10 border-4 border-indigo-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No projects found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-gray-900 rounded-lg shadow hover:shadow-lg transition p-4"
            >
              {project.imageURL ? (
                <img
                  src={project.imageURL}
                  alt={project.title}
                  className="rounded-md object-cover h-40 w-full mb-3"
                />
              ) : (
                <div className="h-40 bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-md mb-3">
                  <FiImage className="text-3xl text-gray-400 dark:text-gray-600" />
                </div>
              )}
              <h3 className="text-lg font-bold text-indigo-700 dark:text-indigo-300">{project.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 line-clamp-2">
                {project.description}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {project.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-white text-xs font-medium px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default ProjectsSection;
