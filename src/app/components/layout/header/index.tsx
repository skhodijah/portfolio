"use client";

import Link from "next/link";
import { useState } from "react";

const Header = () => {
  const [activeTab, setActiveTab] = useState("services");

  const navLinks = [
    { id: "services", label: "SERVICES", href: "#services" },
    { id: "works", label: "WORKS", href: "#projects" },
    { id: "experience", label: "EXPERIENCE", href: "#experience" },
    { id: "beyond-tech", label: "BEYOND TECH", href: "#beyond-tech" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FAF6EE]/90 backdrop-blur-md py-4 border-b border-[#EAE5D9]/60 no-print">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Binjan-style Script Logo */}
        <Link href="/" className="flex items-center gap-1.5">
          <span className="font-script text-3xl font-bold text-[#1B2430] tracking-wide">
            Hodi
          </span>
          <span className="w-2 h-2 rounded-full bg-[#E75A3C] mt-2" />
        </Link>

        {/* Middle Navigation with Pill Outline on Active Item */}
        <nav className="hidden md:flex items-center gap-4 text-xs font-bold tracking-wider text-[#1B2430]">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={() => setActiveTab(link.id)}
              className={`px-4 py-1.5 transition-all ${
                activeTab === link.id
                  ? "border border-[#1E6B65] text-[#1E6B65] rounded-full font-extrabold"
                  : "hover:text-[#1E6B65]"
              }`}
            >
              {activeTab === link.id ? `( ${link.label} )` : link.label}
            </a>
          ))}
        </nav>

        {/* Right Phone Contact Widget */}
        <div className="flex items-center gap-3">
          <a
            href="tel:+6285778918137"
            className="hidden sm:inline-block text-xs font-bold tracking-wide text-[#1B2430] hover:text-[#E75A3C] transition-colors"
          >
            +62 857 7891 8137
          </a>
          <a
            href="tel:+6285778918137"
            className="w-9 h-9 rounded-full bg-white border border-[#EAE5D9] shadow-xs flex items-center justify-center text-[#1B2430] hover:bg-[#1E6B65] hover:text-white hover:border-[#1E6B65] transition-all"
            aria-label="Call Hodi"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.27c1.21.49 2.53.76 3.88.76a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.35.27 2.67.76 3.88a1 1 0 01-.27 1.11l-2.37 2.4z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
