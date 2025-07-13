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
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 text-center mb-8">
        Portfolio Projects
      </h2>

      {/* Category Filter */}
      <div className="flex justify-center flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full transition font-semibold text-sm ${
              category === cat
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-600/30"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Project Cards */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-10 h-10 border-4 border-indigo-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No projects found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700"
            >
              {project.imageURL ? (
                <img
                  src={project.imageURL}
                  alt={project.title}
                  className="rounded-t-md object-cover h-40 w-full"
                />
              ) : (
                <div className="h-40 bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-t-md">
                  <FiImage className="text-4xl text-gray-400 dark:text-gray-600" />
                </div>
              )}

              <div className="p-4">
                <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-1">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                  {project.description}
                </p>

                {/* Tags */}
                {project.tags?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-white text-xs font-medium px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default ProjectsSection;
