"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const router = useRouter();

  return (
    <>
      <div className="flex justify-evenly items-center px-10 py-5">
        <h1 className="text-3xl italic font-bold"><Link href={'/'}>Blogger</Link></h1>
        <div className="w-[500px]"></div>
        <h1 className="font-bold text-3xl italic p-2 cursor-pointer shadow-gray-800 rounded-2xl hover:shadow-2xl">
         <Link href={'/login'}> Get Started {" "}</Link>
          <FontAwesomeIcon icon={faArrowRight} />
        </h1>
      </div>
    </>
  );
};

export default Header;
