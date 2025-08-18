"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import BlogLists from "./BlogItems";

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get("/api/blogs?filter=my"); // axios automatically parses JSON
        setBlogs(res.data); // ✅ use res.data directly
        console.log(res.data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };
    fetchBlog();
  }, []);

  return (
    <div>
      <h1 className="font-bold text-3xl text-center">My Blogs</h1>
      <div className="flex mt-4">
        {blogs.map((blog, index) => (
          <div className="" key={index}>
            <BlogLists
              id={blog._id}
              image={blog.image}
              title={blog.title}
              description={blog.description}
              category={blog.category}
              author={blog.author?.userName || "Unknown"}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBlogs;
