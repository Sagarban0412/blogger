import { cookies } from "next/headers";
import { AdminSidebar } from "../components/AdminSidebar";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

export default async function Layout({ children }) {
  // ✅ Get token from cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let userName = "Admin";

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      // Find user in DB
      const user = await User.findById(userId);
      userName = user?.userName || "Admin";
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <aside className="w-full md:w-64 text-white h-20 md:h-screen md:fixed z-50 ">
        <AdminSidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col ml-0 md:ml-64">
        {/* Header */}
        <header className="bg-white h-20 flex items-center justify-between px-4 shadow-md">
          <div className="flex items-center gap-3">
            <img
              src="https://imgs.search.brave.com/lK60KKTmb7rV3I6EAth6Ri1Au2pzFAefknipcqo8Kd0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMTIvQXZh/dGFyLVByb2ZpbGUt/UE5HLUltYWdlLUZp/bGUucG5n"
              alt="avatar"
              className="h-10 w-10 rounded-full border"
            />
            <p className="font-bold text-lg md:text-xl">{userName}</p>
          </div>
        </header>

        {/* Page Content */}
        <div className="bg-gray-100 flex-1 p-4 min-h-[calc(100vh-80px)]">
          {children}
        </div>
      </main>
    </div>
  );
}
