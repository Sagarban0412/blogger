"use client";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "technology",
    image: null,
  });

  const onChangeHandler = (event) => {
    const { name, value, files } = event.target;
    setFormData({
      ...formData,
      [name]: name === "image" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);
      if (formData.image) data.append("image", formData.image);

      const res = await fetch("/api/blogs", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to submit");
      }

      toast.success("Blog submitted successfully!");

      setFormData({
        title: "",
        description: "",
        category: "technology",
        image: null,
      });
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to submit blog");
    } finally {
      setIsSubmitted(false);
    }
  };

  return (
    <div className="min-h-[900px] flex items-center justify-center px-4 mt-[50px]">
      <form
        className="w-full max-w-[900px] bg-white shadow-xl rounded-2xl p-10 space-y-6"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Upload Blog Details
        </h1>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Title
          </label>
          <input
            type="text"
            placeholder="Enter blog title"
            className="w-full rounded-lg border border-gray-300 p-3 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-300"
            name="title"
            value={formData.title}
            onChange={onChangeHandler}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Description
          </label>
          <textarea
            placeholder="Write a short description..."
            name="description"
            value={formData.description}
            onChange={onChangeHandler}
            className="w-full rounded-lg border border-gray-300 p-3 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-300"
            rows={4}
            required
          />
        </div>

        {/* Category + Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Category
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 p-3 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-300"
              name="category"
              value={formData.category}
              onChange={onChangeHandler}
            >
              <option value="technology">Technology</option>
              <option value="startup">Startup</option>
              <option value="agriculture">Agriculture</option>
            </select>
          </div>

          {/* Image */}
          <div>
            <label
              htmlFor="upload"
              className="block text-sm font-semibold text-gray-600 mb-2"
            >
              Upload Thumbnail
            </label>
            <input
              type="file"
              id="upload"
              name="image"
              onChange={onChangeHandler}
              className="w-full cursor-pointer rounded-lg border border-gray-300 p-3 bg-gray-50 text-gray-700 hover:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-300"
              accept="image/*"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg shadow-md transition duration-300 ease-in-out"
          >
            {isSubmitted ? "Submitting..." : "Submit Blog"}
          </button>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Page;
