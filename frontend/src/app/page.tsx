"use client";
import Link from "next/link";
import { useState } from "react";
import { Button,buttonVariants } from "@/components/ui/button";
export default function LandingPage() {
  return (
    <main className="font-montserrat text-gray-800 animate-fadeIn" style={{ backgroundColor: '#FBF9F5' }}>
      {/* Navbar */}
<nav
  className="fixed top-0 left-1/2 transform -translate-x-1/2 flex justify-between items-center bg-[#FBF9F5] z-50"
  style={{
    width: '1440px',
    height: '80px',
    paddingLeft: '80px',
    paddingRight: '80px',
  }}
>
  <div className="transition-transform duration-300 hover:scale-110 font-montserrat">
    <img src="/Too%20Clarity.png" alt="Too Clarity Logo" className="h-7 w-auto" />
  </div>

<div className="flex gap-6 font-montserrat">

<Button variant="Tooclarity" size={"lg"}>Log In</Button>
  <Link
    href="/signup"
    className="w-26 h-12 px-4 py-3 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors duration-200 cursor-pointer inline-block font-semibold text-[18px] leading-[100%] tracking-[0%]">
    Sign up
  </Link>
</div>
</nav>
<br />
<br />
<br />
<br />
<br />
<br />
      {/* Hero */}
      <section className="text-center py-16 px-4 animate-fadeIn">
<h1 className="font-sora font-semibold text-[48px] leading-[100%] tracking-[0] text-center">
  Unlock Your{" "}
  <span className="text-blue-700 font-sora font-semibold text-[48px] leading-[100%] tracking-[0] text-center">
    Institution&apos;s
  </span>
  <br />
  <span className="text-blue-700 font-sora font-semibold text-[45px] leading-[100%] tracking-[0] text-center">
    Global Reach
  </span>
</h1>
<br />
<p
  className="font-montserrat font-medium text-[16px] leading-[24px] tracking-[1px] text-center text-[#697282] w-[659px] h-[48px] opacity-90 mx-auto"
  style={{ transform: "rotate(0deg)" }}
>
  Connect directly with students actively seeking quality education with
  a verified and transparent marketplace.
</p>

<br />
<div className="flex justify-center">
  <button
    className="relative w-[160px] h-[48px] rounded-[12px] bg-blue-700 text-white font-montserrat font-medium text-[18px] leading-[100%] tracking-[0] text-center flex items-center justify-center overflow-hidden"
    style={{ transform: "rotate(0deg)" }}
  >
    <span className="relative z-10">Get Started</span>
    {/* Stronger shimmer overlay */}
    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-50 animate-shimmer"></span>
  </button>
</div>

<style jsx>{`
@keyframes shimmer {
  0% {
    transform: translateX(-150%);
  }
  100% {
    transform: translateX(150%);
  }
}
.animate-shimmer {
  animation: shimmer 3s infinite;
}
`}</style>
        <p className="text-gray-500 mt-3 text-sm font-montserrat">
          0% listing fee for the first 2 months.
        </p>
      </section>

      {/* Why Partner */}
      <section className="text-center py-10 px-4">
  <section className="text-center py-0 px-4">
    <h1 className="font-sora font-semibold text-[48px] mb-6">
      Why should you partner with
      <br />
      <span className="text-blue-700">Too Clarity?</span>
    </h1>
  </section>

  <section className="flex justify-between max-w-[1162px] h-[235px] mx-auto py-10 px-4">
  {[
    {
      title: "Get Discovered",
      desc: "Showcase your institution to qualified audiences searching for courses just like yours.",
      logo: "/get%20discovered.png"
    },
    {
      title: "Drive Growth",
      desc: "Engage directly with applicants and manage leads via an analytics dashboard.",
      logo: "/Drive%20Growth.png"
    },
    {
      title: "Optimize Budget",
      desc: "Reduce wasted marketing spend by focusing on high-quality applicants.",
      logo: "/Optimise%20Budget.png"
    }
  ].map((item, idx) => (
    <div
      key={idx}
      className="flex flex-col items-center"
      style={{
        width: '350px',
        height: '194px',
        gap: '16px',
        borderRadius: '8px',
        padding: '12px',
        opacity: 1
      }}
    >
      <img
        src={item.logo}
        alt={item.title + ' logo'}
        className="w-[70px] h-[70px] object-contain"
      />
      <h3
        className="text-center w-[326px] h-[24px] mb-2 font-semibold"
        style={{
          fontFamily: 'Montserrat',
          fontWeight: 540,
          fontSize: '20px',
          lineHeight: '24px',
          letterSpacing: '0px'
        }}
      >
        {item.title}
      </h3>
      <p
        className="text-[#697282]"
        style={{
          fontFamily: 'Montserrat',
          fontWeight: 400,
          fontSize: '14px',
          lineHeight: '24px',
          letterSpacing: '0px',
          margin: 0,
          overflowWrap: 'break-word'
        }}
      >
        {item.desc}
      </p>
    </div>
  ))}
</section>
</section>

{/* How Simple */}
<section className="text-center py-16 px-4 bg-[#FBF9F5]">
  <h1
    className="font-sora font-semibold"
    style={{ fontSize: '48px', fontWeight: 600, marginBottom: '3rem' }}
  >
    How simple is it to <span className="text-blue-700">connect</span>
  </h1>

  <section className="flex justify-between max-w-[1162px] h-[235px] mx-auto py-10 px-4">
    {[
      {
        title: "Create Profile",
        desc: "Get started in minutes with our guided setup and unique showcase of prospective students.",
        logo: "/Create%20Profile.png"
      },
      {
        title: "Showcase Programs",
        desc: "Easily list courses with rich details, including requirements and benefits.",
        logo: "/Show%20programs.png"
      },
      {
        title: "Track Results",
        desc: "Monitor performance and metrics for all your campaigns in one place.",
        logo: "/Track%20results.png"
      }
    ].map((item, idx) => (
      <div
        key={idx}
        className="flex flex-col items-center"
        style={{
          width: '350px',
          height: '194px',
          gap: '16px',
          borderRadius: '8px',
          padding: '12px',
          opacity: 1
        }}
      >
        <img
          src={item.logo}
          alt={item.title + ' logo'}
          className="w-[70px] h-[70px] object-contain"
        />
        <h3
          className="text-center w-[326px] h-[24px] mb-2 font-semibold"
          style={{
            fontFamily: 'Montserrat',
            fontWeight: 540,
            fontSize: '20px',
            lineHeight: '24px',
            letterSpacing: '0px'
          }}
        >
          {item.title}
        </h3>
        <p
          className="text-[#697282]"
          style={{
            fontFamily: 'Montserrat',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '24px',
            letterSpacing: '0px',
            margin: 0,
            overflowWrap: 'break-word'
          }}
        >
          {item.desc}
        </p>
      </div>
    ))}
  </section>
</section>

      {/* FAQ */}
<section className="max-w-3xl mx-auto py-16 px-4">
  <h1
    className="font-sora font-semibold text-center mb-8"
    style={{ fontSize: "48px", fontWeight: 600 }}
  >
    Frequently Asked <span className="text-blue-700">Questions</span>
  </h1>

  <div className="space-y-4 font-montserrat flex flex-col items-center">
    {[
      {
        question: "How long does registration take?",
        answer:
          "Our registration is designed to be quick. You can complete the initial set within 5–7 minutes.",
      },
      {
        question: "Can the Admin role be changed later?",
        answer:
          "Yes, you can change the Admin role in the settings at any time.",
      },
      {
        question: "Is this platform free?",
        answer:
          "We offer both free and premium plans depending on your needs.",
      },
      {
        question: "What information do I need?",
        answer:
          "You’ll need basic company details, an email address, and a secure password to get started.",
      },
      {
        question: "Can I add multiple team users?",
        answer:
          "Yes, you can invite and manage multiple team members from your dashboard.",
      },
    ].map((item, idx) => (
      <details
        key={idx}
        className="transition-all duration-300 w-[630px] rounded-[30px] overflow-hidden cursor-pointer group outline-none focus:outline-none"
        style={{
          background: "#F5F4F4",
          borderWidth: "1px",
          borderStyle: "solid",
          borderImageSource:
            "linear-gradient(360deg, rgba(245, 244, 244, 0.05) 0%, rgba(231, 230, 230, 0.0550481) 10.1%, rgba(213, 212, 212, 0.0612981) 22.6%, rgba(198, 197, 197, 0.0668269) 33.65%, rgba(185, 185, 185, 0.0711538) 42.31%, rgba(169, 169, 169, 0.0769231) 53.85%, rgba(148, 148, 148, 0.084375) 68.75%, rgba(124, 124, 124, 0.0929487) 86.38%, rgba(104, 104, 104, 0.1) 100%)",
          borderImageSlice: 1,
          boxShadow:
            "0px 6px 6px 0px #68686808 inset, 0px 3px 3px 0px #68686803 inset, 0px 9px 9px 0px #00000008",
        }}
      >
        <summary
          className="px-3 py-4 font-medium transition-colors duration-300 rounded-[30px] outline-none focus:outline-none
            group-[&:not([open])]:hover:bg-blue-700 
            group-[&:not([open])]:hover:text-white"
        >
          {item.question}
        </summary>
        <div className="px-3 pb-4 pt-2 text-gray-600">
          {item.answer}
        </div>
      </details>
    ))}
  </div>
</section>

      {/* Footer */}
  <footer className="bg-[#FBF9F5] w-[1280px] h-[286px] mx-auto py-8 px-8 font-montserrat">
  <div className="flex justify-between w-full h-[238px]">
    {/* Left Section: Logo + Tagline + Social Icons */}
    <div className="flex flex-col justify-start">
      <div>
        <img
          src="/Too%20Clarity.png"
          alt="Too Clarity Logo"
          className="h-[40px] w-auto"
        />
        <p className="mt-2 text-[#6B7280] text-[16px] leading-[24px] font-medium max-w-[240px]">
          Connecting Institutions with Future Students.
        </p>
        {/* Social Icons placed just below the tagline */}
        <div className="flex space-x-[16px] mt-4">
          <a href="#" target="_blank" rel="noopener noreferrer">
            <img src="/twitter.png" alt="X" className="h-[40px] w-[40px]" />
          </a>
          <a href="https://www.instagram.com/tooclarity/?__pwa=1" target="_blank" rel="noopener noreferrer">
            <img src="/instagram.png" alt="Instagram" className="h-[40px] w-[40px]" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <img src="/youtube.png" alt="YouTube" className="h-[40px] w-[40px]" />
          </a>
          <a href="https://www.linkedin.com/company/tooclarity/posts/?feedView=all" target="_blank" rel="noopener noreferrer">
            <img src="/linkedin.png" alt="LinkedIn" className="h-[40px] w-[40px]" />
          </a>
        </div>
      </div>
    </div>

    {/* Right Section: Links */}
    <div className="flex gap-[40px] w-[812px] h-[172px]">
      {/* For Institutions */}
      <div className="w-[150px] h-[172px] flex flex-col gap-[16px]">
        <h4 className="font-medium text-[16px] leading-[24px]">For Institutions</h4>
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

  {/* Copyright - full width same background */}
  <div className="w-full bg-[#FBF9F5] mt-4 flex justify-between items-center text-[14px] leading-[24px] text-[#6B7280]">
    <p>Copyright © {new Date().getFullYear()} Too Clarity. All rights reserved.</p>
    <p>Empowering Educational Growth.</p>
  </div>
</footer>
    </main>
  );
}
