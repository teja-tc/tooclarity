"use client"; // only needed if you later add interactivity (optional)

import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    // <footer className="bg-[#FBF9F5] w-full max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8 font-montserrat">
    //   <div className="flex flex-col lg:flex-row lg:justify-between w-full gap-8 lg:gap-0">
    //     {/* Left Section: Logo + Tagline + Social Icons */}
    //     <div className="flex flex-col justify-start lg:max-w-xs">
    //       <div>
    //         <Image
    //           src="/Too%20Clarity.png"
    //           alt="Too Clarity Logo"
    //           width={160}
    //           height={40}
    //           className="h-8 sm:h-[40px] w-auto"
    //         />
    //         <p className="mt-3 sm:mt-2 text-[#6B7280] text-sm sm:text-[16px] leading-6 sm:leading-[24px] font-medium">
    //           Connecting Institutions with Future Students.
    //         </p>
    //         {/* Social Icons */}
    //         <div className="flex space-x-3 sm:space-x-[16px] mt-4">
    //           <a href="#" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
    //             <Image src="/twitter.png" alt="X" width={32} height={32} className="w-8 h-8 sm:w-10 sm:h-10" />
    //           </a>
    //           <a
    //             href="https://www.instagram.com/tooclarity/?__pwa=1"
    //             target="_blank"
    //             rel="noopener noreferrer"
    //             className="hover:opacity-80 transition-opacity"
    //           >
    //             <Image src="/instagram.png" alt="Instagram" width={32} height={32} className="w-8 h-8 sm:w-10 sm:h-10" />
    //           </a>
    //           <a href="#" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
    //             <Image src="/youtube.png" alt="YouTube" width={32} height={32} className="w-8 h-8 sm:w-10 sm:h-10" />
    //           </a>
    //           <a
    //             href="https://www.linkedin.com/company/tooclarity/posts/?feedView=all"
    //             target="_blank"
    //             rel="noopener noreferrer"
    //             className="hover:opacity-80 transition-opacity"
    //           >
    //             <Image src="/linkedin.png" alt="LinkedIn" width={32} height={32} className="w-8 h-8 sm:w-10 sm:h-10" />
    //           </a>
    //         </div>
    //       </div>
    //     </div>

    //     {/* Right Section: Links */}
    //     <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 flex-1 lg:max-w-3xl">
    //       {/* For Institutions */}
    //       <div className="flex flex-col gap-3 sm:gap-4">
    //         <h4 className="font-medium text-sm sm:text-[16px] leading-6 sm:leading-[24px] text-gray-900">
    //           For Institutions
    //         </h4>
    //         <ul className="flex flex-col gap-2 sm:gap-[8px] text-xs sm:text-[14px] leading-5 sm:leading-[24px] font-medium text-[#6B7280]">
    //           <li className="hover:text-blue-600 cursor-pointer transition-colors">How it Works</li>
    //           <li className="hover:text-blue-600 cursor-pointer transition-colors">Features</li>
    //           <li className="hover:text-blue-600 cursor-pointer transition-colors">Pricing</li>
    //           <li className="hover:text-blue-600 cursor-pointer transition-colors">Success Stories</li>
    //         </ul>
    //       </div>

    //       {/* Company */}
    //       <div className="flex flex-col gap-3 sm:gap-4">
    //         <h4 className="font-medium text-sm sm:text-[16px] leading-6 sm:leading-[24px] text-gray-900">Company</h4>
    //         <ul className="flex flex-col gap-2 sm:gap-[8px] text-xs sm:text-[14px] leading-5 sm:leading-[24px] font-medium text-[#6B7280]">
    //           <li className="hover:text-blue-600 cursor-pointer transition-colors">About Us</li>
    //           <li className="hover:text-blue-600 cursor-pointer transition-colors">Privacy Policy</li>
    //           <li className="hover:text-blue-600 cursor-pointer transition-colors">Terms of Service</li>
    //         </ul>
    //       </div>

    //       {/* Support */}
    //       <div className="flex flex-col gap-3 sm:gap-4">
    //         <h4 className="font-medium text-sm sm:text-[16px] leading-6 sm:leading-[24px] text-gray-900">Support</h4>
    //         <ul className="flex flex-col gap-2 sm:gap-[8px] text-xs sm:text-[14px] leading-5 sm:leading-[24px] font-medium text-[#6B7280]">
    //           <li className="hover:text-blue-600 cursor-pointer transition-colors">Blog</li>
    //           <li className="hover:text-blue-600 cursor-pointer transition-colors">Help Center</li>
    //           <li className="hover:text-blue-600 cursor-pointer transition-colors">Schedule a Demo</li>
    //         </ul>
    //       </div>

    //       {/* Contact */}
    //       <div className="flex flex-col gap-3 sm:gap-4 col-span-2 sm:col-span-1">
    //         <h4 className="font-medium text-sm sm:text-[16px] leading-6 sm:leading-[24px] text-gray-900">Contact</h4>
    //         <ul className="flex flex-col gap-2 sm:gap-[8px] text-xs sm:text-[14px] leading-5 sm:leading-[24px] font-medium text-[#6B7280]">
    //           <li className="flex items-start gap-2">
    //             <span className="text-sm">📧</span> 
    //             <span className="break-all">tooclarity0@gmail.com</span>
    //           </li>
    //           <li className="flex items-center gap-2">
    //             <span className="text-sm">📞</span> 
    //             <span>+91 9391160205</span>
    //           </li>
    //           <li className="flex items-start gap-2">
    //             <span className="text-sm">📍</span> 
    //             <span>Tarnaka, Secunderabad, 500007</span>
    //           </li>
    //         </ul>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Copyright */}
    //   <div className="w-full bg-[#FBF9F5] mt-6 sm:mt-8 pt-6 sm:pt-4 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 text-xs sm:text-[14px] leading-5 sm:leading-[24px] text-[#6B7280]">
    //     <p className="text-center sm:text-left">
    //       Copyright © {new Date().getFullYear()} Too Clarity. All rights reserved.
    //     </p>
    //     <p className="text-center sm:text-right">Empowering Educational Growth.</p>
    //   </div>
    // </footer>
    <footer className="bg-blue-800 text-white py-12 px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
        <div>
          <h4 className="font-bold mb-4">For Institutions</h4>
          <ul className="space-y-2">
            <li>How it Works</li>
            <li>Features</li>
            <li>Pricing</li>
            <li>Success Stories</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Company</h4>
          <ul className="space-y-2">
            <li>About Us</li>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Support</h4>
          <ul className="space-y-2">
            <li>Blog</li>
            <li>Help Center</li>
            <li>Schedule a Demo</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Contact</h4>
          <p>Email: tooclarity0@gmail.com</p>
          <p>Phone: +91 9391160205</p>
          <p>Tarnaka, Secunderabad, 500007</p>
        </div>
      </div>

    <section
      className= "overflow-hidden w-[1440px]  h-[659px]  mx-auto  flex  flex-col  items-center  justify-center  pb-[20px]  opacity-100  relative"
>
      {/* Logo (OO) */}
      <h1 className="font-goodly font-semibold text-[234.66px] leading-[100%] tracking-[0px]">
        <img
          src="/OO.png"
          alt="Too Clarity Logo"
          className="mx-auto block w-auto h-[220.66px]"
        />
      </h1>

      {/* Title: TOO CLARITY */}
      <h1 className="overflow-hidden font-[600] text-[232.66px] leading-[100%] tracking-[0px] mt-2">
        TOO CLARITY
      </h1>
<footer className="w-[339px] h-[88px] mx-auto flex flex-col items-center justify-center opacity-100">
  {/* Social Icons Row */}
  <br />
  <br />
  <div className="flex items-center justify-between w-full gap-[24px] mb-4">
    <img src="/x.png" alt="X" className="h-[40px] object-contain" />
    <img src="/instagram_02.png" alt="Instagram" className="h-[40px] object-contain" />
    <img src="/linked.png" alt="LinkedIn" className="h-[40px] object-contain" />
    <img src="/yt.png" alt="YouTube" className="h-[40px] object-contain" />
  </div>

  {/* Footer Text */}
  <div className="text-center text-sm text-white/60">
    Copyright © 2025 Too Clarity. All rights reserved.
  </div>
</footer>


    </section>


    </footer>
  );
};

export default Footer; 
