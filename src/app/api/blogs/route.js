import connectDB from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import User from "@/app/models/userModel";
import path from "path";
import BlogModel from "@/app/models/blogModel";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

connectDB();

export async function GET(req) {
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
      // default: return all blogs
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

export async function POST(request) {
  try {
    const formData = await request.formData();
    const timestamp = Date.now();

    const image = formData.get("image");
    if (!image || !image.name) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    }

    const imageByteData = await image.arrayBuffer();
    const buffer = Buffer.from(imageByteData);

    // Ensure uploads folder exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    // Save file
    const fileName = `${timestamp}_${image.name}`;
    const filePath = path.join(uploadsDir, fileName);
    await writeFile(filePath, buffer);

    // Create full image URL
    const imageUrl = `${request.nextUrl.origin}/uploads/${fileName}`;
    console.log("Image uploaded:", imageUrl);

    //geting user id from cookies

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const category = formData.get("category");
    console.log(category);

    // Create blog document
    const blogData = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      author: userId,
      image: imageUrl,
    };
    
    await BlogModel.create(blogData);
    console.log("Blog saved in database");

    return NextResponse.json({ success: true, msg: "Blog added" });
  } catch (err) {
    console.error("POST Error:", err);
    return NextResponse.json(
      { error: "Failed to upload blog" },
      { status: 500 }
    );
  }
}
