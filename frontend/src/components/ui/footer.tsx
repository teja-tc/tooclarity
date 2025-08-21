"use client"; // only needed if you later add interactivity (optional)

import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#FBF9F5] w-full h-[286px] font-montserrat">
      <div className="max-w-[1280px] mx-auto py-8 px-8 flex justify-between">
        {/* Left Section: Logo + Tagline + Social Icons */}
        <div className="flex flex-col justify-start">
          <div>
            <Image
              src="/Too%20Clarity.png"
              alt="Too Clarity Logo"
              width={160}
              height={40}
              className="h-[40px] w-auto"
            />
            <p className="mt-2 text-[#6B7280] text-[16px] leading-[24px] font-medium max-w-[240px]">
              Connecting Institutions with Future Students.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-[16px] mt-4">
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Image src="/twitter.png" alt="X" width={40} height={40} />
              </a>
              <a
                href="https://www.instagram.com/tooclarity/?__pwa=1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image src="/instagram.png" alt="Instagram" width={40} height={40} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Image src="/youtube.png" alt="YouTube" width={40} height={40} />
              </a>
              <a
                href="https://www.linkedin.com/company/tooclarity/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image src="/linkedin.png" alt="LinkedIn" width={40} height={40} />
              </a>
            </div>
          </div>
        </div>

        {/* Right Section: Links */}
        <div className="flex gap-[40px] w-[812px] h-[172px]">
          {/* For Institutions */}
          <div className="w-[150px] h-[172px] flex flex-col gap-[16px]">
            <h4 className="font-medium text-[16px] leading-[24px]">
              For Institutions
            </h4>
            <ul className="flex flex-col gap-[8px] text-[14px] leading-[24px] font-medium text-[#6B7280]">
              <li>How it Works</li>
              <li>Features</li>
              <li>Pricing</li>
              <li>Success Stories</li>
            </ul>
          </div>

          {/* Company */}
          <div className="w-[150px] h-[172px] flex flex-col gap-[16px]">
            <h4 className="font-medium text-[16px] leading-[24px]">Company</h4>
            <ul className="flex flex-col gap-[8px] text-[14px] leading-[24px] font-medium text-[#6B7280]">
              <li>About Us</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>

          {/* Support */}
          <div className="w-[150px] h-[172px] flex flex-col gap-[16px]">
            <h4 className="font-medium text-[16px] leading-[24px]">Support</h4>
            <ul className="flex flex-col gap-[8px] text-[14px] leading-[24px] font-medium text-[#6B7280]">
              <li>Blog</li>
              <li>Help Center</li>
              <li>Schedule a Demo</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="w-[150px] h-[172px] flex flex-col gap-[16px]">
            <h4 className="font-medium text-[16px] leading-[24px]">Contact</h4>
            <ul className="flex flex-col gap-[8px] text-[14px] leading-[24px] font-medium text-[#6B7280]">
              <li className="flex items-center gap-2">
                <span>📧</span> tooclarity0@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span> +91 9391160205
              </li>
              <li className="flex items-center gap-2">
                <span>📍</span> Tarnaka, Secunderabad, 500007
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
   <div className="w-full bg-[#FBF9F5] flex justify-between items-center text-[14px] leading-[24px] text-[#6B7280] px-8">
    <p>
      Copyright © {new Date().getFullYear()} Too Clarity. All rights reserved.
    </p>
    <p>Empowering Educational Growth.</p>
  </div>
    </footer>
  );
};

export default Footer; 
