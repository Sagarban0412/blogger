import { cookies } from "next/headers";
import { AdminSidebar } from "../components/AdminSidebar";
import jwt from 'jsonwebtoken'
import BlogModel from "../models/blogModel";
import User from "../models/userModel";

export default  async function Layout({ children }) {
  //✅ Await cookies()
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
   
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    const userId = decoded.id;

    //finding user by user id
    const user = await User.findById(userId)
    const userName = user.userName;
    console.log(userName);
    
    
  return (
    <>
      <div className="flex">
        <AdminSidebar />
        <div className="flex flex-1 flex-col mr-4 w-auto">
          <div className=" bg-white h-20 flex flex-col items-end justify-center">
            <img
              src="https://imgs.search.brave.com/lK60KKTmb7rV3I6EAth6Ri1Au2pzFAefknipcqo8Kd0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMTIvQXZh/dGFyLVByb2ZpbGUt/UE5HLUltYWdlLUZp/bGUucG5n"
              alt="avatar"
              className="h-10 w-10 rounded-full border"
            />
            <p className="font-bold text-xl">{userName}</p>
          </div>
          <div className="w-auto min-h-[calc(100vh-80px)] bg-gray-100 p-4">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
