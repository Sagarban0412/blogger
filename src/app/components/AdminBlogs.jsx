"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get("/api/blogs?filter=my");
        setBlogs(res.data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };
    fetchBlog();
  }, []);

  // Delete blog
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      await axios.delete(`/api/blogs/${id}`);
      setBlogs(blogs.filter((blog) => blog._id !== id));
    } catch (err) {
      console.error("Error deleting blog:", err);
    }
  };

  // Navigate to edit page
  const handleEdit = (id) => {
    router.push(`/dashboard/edit/${id}`);
  };

  return (
    <div className="p-6">
      <h1 className="font-bold text-3xl text-center mb-6 sm:text-xl">My Blogs</h1>
      <table className="w-full table-auto border-collapse border border-gray-400">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">#</th>
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog, index) => (
            <tr key={blog._id} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{blog.title}</td>
              <td className="border px-4 py-2">{blog.description}</td>
              <td className="border px-4 py-2">{blog.category}</td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  onClick={() => handleEdit(blog._id)}
                  className="px-4 py-2 rounded-2xl bg-blue-500 text-white"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="px-4 py-2 rounded-2xl bg-red-500 text-white"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBlogs;
