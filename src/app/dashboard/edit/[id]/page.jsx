"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditBlogPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "technology",
    image: null,
  });
  const [currentImage, setCurrentImage] = useState("");

  // Fetch blog data on mount
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/api/blogs/${id}`);
        const blog = res.data;
        setFormData({
          title: blog.title,
          description: blog.description,
          category: blog.category,
          image: null,
        });
        setCurrentImage(blog.image || "");
      } catch (err) {
        console.error(err);
        toast.error("Failed to load blog data");
      }
    };
    fetchBlog();
  }, [id]);

  // Handle form input changes
  const onChangeHandler = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: name === "image" ? files[0] : value,
    });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dataToSend = new FormData();
      dataToSend.append("title", formData.title);
      dataToSend.append("description", formData.description);
      dataToSend.append("category", formData.category);
      if (formData.image) dataToSend.append("image", formData.image);

      await axios.put(`/api/blogs/${id}`, dataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Blog updated successfully!");
      router.push("/dashboard"); // redirect after update
    } catch (err) {
      console.error(err);
      toast.error("Failed to update blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[900px] flex items-center justify-center px-4 mt-[50px]">
      <form
        className="w-full max-w-[900px] bg-white shadow-xl rounded-2xl p-10 space-y-6"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Update Blog Details
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
            {currentImage && (
              <img
                src={
                  formData.image
                    ? URL.createObjectURL(formData.image)
                    : currentImage
                }
                alt="Preview"
                className="mt-2 w-40 h-40 object-cover rounded-lg"
              />
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg shadow-md transition duration-300 ease-in-out"
          >
            {isSubmitting ? "Submitting..." : "Update Blog"}
          </button>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default EditBlogPage;
