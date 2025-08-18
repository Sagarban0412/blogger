// /app/api/users/route.js
export const runtime = "nodejs";

import connectDB from "@/app/lib/mongodb.js";
import User from "@/app/models/userModel.js";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function POST(request) {
  try {
    const { action, userName, email, password } = await request.json();

    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 });
    }

    await connectDB();

    // ---------------- SIGNUP ----------------
    if (action === "signup") {
      // Check if user/email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json({ error: "User already exists" }, { status: 400 });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const newUser = new User({ userName, email, password: hashedPassword });
      await newUser.save();

      // Generate JWT token
      const token = jwt.sign(
        { id: newUser._id, email: newUser.email },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Return response with cookie
      const response = NextResponse.json({
        message: "Signup successful",
        user: { userName: newUser.userName, email: newUser.email },
      });
      response.cookies.set("token", token, { httpOnly: true, path: "/" });
      return response;
    }

    // ---------------- SIGNIN ----------------
    if (action === "signin") {
      const user = await User.findOne({ email });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      const response = NextResponse.json({
        message: "Login successful",
        user: { userName: user.userName, email: user.email },
      });
      response.cookies.set("token", token, { httpOnly: true, path: "/" });
      return response;
    }

    // ---------------- INVALID ACTION ----------------
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error("User API Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
