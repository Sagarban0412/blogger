"use client";
import React, { useEffect, useState } from "react";
import BlogItems from "./BlogItems";
import { blog_data } from "../assets/Blogdata";
import axios from "axios";

const Blogdata = () => {
  const [menu, setMenu] = useState("All");
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlog = async () => {
      const res = await axios.get("/api/blogs");
      setBlogs(res.data);
      console.log(res.data);
    };
    fetchBlog();
  }, []);

  return (
    <>
      <div className="flex justify-center items-center gap-10 my-10 cursor-pointer mt-[-80px]">
        <button
          onClick={() => setMenu("All")}
          className={
            menu === "All" ? "bg-black rounded-3xl p-2 text-white" : " "
          }
        >
          All
        </button>
        <button
          onClick={() => setMenu("technology")}
          className={
            menu === "technology" ? "bg-black rounded-3xl p-2 text-white" : " "
          }
        >
          Technology
        </button>
        <button
          onClick={() => setMenu("startup")}
          className={
            menu === "startup" ? "bg-black rounded-3xl p-2 text-white" : " "
          }
        >
          Startup
        </button>
        <button
          onClick={() => setMenu("agriculture")}
          className={
            menu === "agriculture" ? "bg-black rounded-3xl p-2 text-white" : " "
          }
        >
          Agriculture
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {blogs
          .filter((item) => (menu === "All" ? true : item.category === menu))
          .map((item, index) => (
            <BlogItems
              key={index}
              id={item._id}
              image={item.image}
              title={item.title}
              description={item.description}
              category={item.category}
              author={item.author?.userName || "Unknown"}
            />
          ))}
      </div>
    </>
  );
};

export default Blogdata;
