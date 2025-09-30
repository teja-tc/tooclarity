"use client"; // only needed if you later add interactivity (optional)


import React from "react";

const Footer = () => {
  return (
    
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
