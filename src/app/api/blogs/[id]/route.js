import connectDB from "@/app/lib/mongodb";
import BlogModel from "@/app/models/blogModel";
import { NextResponse } from "next/server";
import cloudinary from "@/app/lib/cloudinary.js"; // import cloudinary config

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params; // ✅ extract id

    const formData = await request.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const file = formData.get("image");

    let imageUrl;

    // ✅ correct file check
    if (file && typeof file === "object") {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "blogs" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(buffer);
      });

      imageUrl = uploadResult.secure_url;
    }

    const updatedBlog = await BlogModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
        ...(imageUrl && { image: imageUrl }), // ✅ only update image if provided
      },
      { new: true }
    );

    if (!updatedBlog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 }); // ✅ added return
    }

    return NextResponse.json(updatedBlog);
  } catch (e) {
    console.error("Error updating blog:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}


export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const blog = await BlogModel.findById(id);

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (err) {
    console.error("Error fetching blog:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

//deleting code
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const deletedBlog = await BlogModel.findByIdAndDelete(id);

    if (!deletedBlog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error("Error deleting blog:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}