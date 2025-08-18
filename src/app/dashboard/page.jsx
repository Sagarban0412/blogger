import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {AdminSidebar} from "../components/AdminSidebar.jsx";
import Blogdata from "../components/Blogdata.jsx";
import AdminBlogs from "../components/AdminBlogs.jsx";
import connectDB from "../lib/mongodb.js";

const JWT_SECRET = process.env.JWT_SECRET;

export default async function DashboardPage() {
  await connectDB();

  // ✅ Await cookies()
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/login"); // redirect if no token

  try {
    jwt.verify(token, JWT_SECRET);
  } catch {
    redirect("/login"); // redirect if token invalid
  }

  return (
    <>
     <AdminBlogs/>
    </>
  );
}
