import React from "react";
import Image from "next/image";
import Link from "next/link";
// adjust path

const BlogLists = ({ id, image, title, description, category, author }) => {
  return (
    <div className=" shadow-gray-600 hover:shadow-2xl rounded-lg cursor-pointer">
        <div className="max-w-[534px] sm:max-w-[534px]  rounded-lg p-4">
          <div className=" h-64 relative rounded overflow-hidden mb-4">
            <Image
              src={image || "/placeholder.jpg"}
              alt={title || ""}
              fill
              className="object-cover rounded"
            />
          </div>
          <h1 className="text-sm text-gray-500 mt-2">{category}</h1>
          <h3 className="font-bold text-lg mt-1">{title}</h3>
          <p className="tracking-tight text-gray-700 mt-2 line-clamp-3">
            {description}
          </p>
          <p className="text-xs text-gray-400 mt-2">By {author}</p>
          <button className="mt-3 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
            <Link href={`/blogs/${id}`}>Read more</Link>
          </button>
        </div>
    </div>
  );
};

export default BlogLists;
