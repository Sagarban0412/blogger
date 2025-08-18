// app/api/blogs/route.js
import connectDB from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import BlogModel from "@/app/models/blogModel";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET: Fetch blogs (all or "my")
export async function GET(req) {
  await connectDB();
  try {
    const url = new URL(req.url);
    const filter = url.searchParams.get("filter"); // "all" or "my"

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    let userId;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    }

    let blogs;

    if (filter === "my") {
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      blogs = await BlogModel.find({ author: userId })
        .sort({ date: -1 })
        .populate("author", "userName");
    } else {
      blogs = await BlogModel.find({})
        .sort({ date: -1 })
        .populate("author", "userName");
    }

    return NextResponse.json(blogs);
  } catch (err) {
    console.error("GET Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST: Create a new blog with image upload
export async function POST(request) {
  await connectDB();
  try {
    const formData = await request.formData();

    // Get user ID from JWT cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Get the uploaded image from form
    const image = formData.get("image");
    let imageUrl = "";
    if (image) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload image to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      imageUrl = uploadResult.secure_url;
    } else {
      // Fallback placeholder image
      imageUrl =
        "https://plus.unsplash.com/premium_photo-1706800283398-e2a5591c5fa0?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
    }

    // Create blog document
    const blogData = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      author: userId,
      image: imageUrl,
    };

    await BlogModel.create(blogData);
    console.log("✅ Blog saved in database with Cloudinary image");

    return NextResponse.json({ success: true, msg: "Blog added" });
  } catch (err) {
    console.error("POST Error:", err);
    return NextResponse.json(
      { error: "Failed to upload blog" },
      { status: 500 }
    );
  }
}
