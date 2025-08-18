"use client";

import Image from "next/image";
import Header from "@/app/components/Header";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const params = useParams();
  const id = params.id;
  

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get("/api/blogs"); // fetch all blogs
        setBlogs(res.data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };
    fetchBlog();
  }, []);

  const data = blogs.find((b) => b._id === id); // find after data is loaded

  if (!data) {
    return <p className="text-center mt-10">Blog not found</p>;
  }

  return (
    <>
      <Header />
      <div className="max-w-screen p-4">
        <div className="w-full h-[900px] flex flex-col justify-center items-center mt-[-200px] bg-gray-300">
          <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
          <p>Author: {data.author?.userName || "Unknown"}</p>
        </div>
        <div className="mt-[-300px] flex justify-center">
          <Image
            src={data.image}
            width={800}
            height={800}
            alt={data.title}
            className="object-cover"
          />
        </div>
        <div className="mt-3 flex flex-col justify-center items-center">
          <p className="italic">{data.category}</p>
          <p className="text-gray-700 text-2xl text-justify px-4 sm:px-10 md:px-40 mt-4">
            {data.description}
          </p>
        </div>
      </div>
    </>
  );
};

export default BlogPage;
