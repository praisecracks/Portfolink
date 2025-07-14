import React from "react";
import BlogCard from "./BlogCard";

function BlogList({ infoSections }) {
  return (
    <div className="grid gap-8 max-w-4xl mx-auto">
      {infoSections.map((info) => (
        <BlogCard key={info.id} title={info.title} description={info.description} />
      ))}
    </div>
  );
}

export default BlogList;
