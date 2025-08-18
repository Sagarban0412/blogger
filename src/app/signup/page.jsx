"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Page = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("/api/users", {
        action: "signup",
        userName,
        email,
        password,
      });

      alert(res.data.message || "User registered successfully!");
      router.push("/login");
      console.log("Response:", res.data);
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Something went wrong!");
    }
  };

  return (
    <div className="w-screen h-screen bg-black">
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
            Sign up to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="userName"
                className="block text-sm font-medium text-gray-100"
              >
                UserName
              </label>
              <input
                id="userName"
                type="text"
                required
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-white placeholder:text-gray-500 focus:outline-indigo-500 sm:text-sm"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-100"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-white placeholder:text-gray-500 focus:outline-indigo-500 sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-100"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-white placeholder:text-gray-500 focus:outline-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-100"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-white placeholder:text-gray-500 focus:outline-indigo-500 sm:text-sm"
              />
            </div>

            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-400"
            >
              Sign up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
