"use client";

import { usePortfolio } from "@/context/PortfolioContext";

const AboutMe = () => {
  const { profile } = usePortfolio();

  return (
    <section id="about" className="py-20 border-b border-[#EAE5D9] bg-[#FAF6EE]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Section Header */}
          <div className="lg:col-span-4 space-y-2">
            <span className="text-xs font-mono text-[#556070] uppercase tracking-widest">
              01 / ABOUT ME
            </span>
            <h2 className="text-4xl font-extrabold tracking-tight text-[#1B2430]">
              About
            </h2>
            <p className="text-sm font-semibold text-[#E75A3C]">
              Information Systems × QA & Systems × Creative Media
            </p>
          </div>

          {/* Main Conversational Body */}
          <div className="lg:col-span-8 space-y-6 text-base sm:text-lg text-[#1B2430] leading-relaxed">
            <p className="font-semibold text-xl sm:text-2xl text-[#1B2430]">
              {profile.aboutHeading || "Hi, I'm Hodi."}
            </p>

            <p className="text-[#556070]">
              {profile.aboutParagraph1}
            </p>

            <p className="text-[#556070]">
              {profile.aboutParagraph2}
            </p>

            <p className="text-[#556070]">
              {profile.aboutParagraph3}
            </p>

            <div className="border-l-4 border-[#1E6B65] pl-5 py-1 text-[#1E6B65] font-bold text-base bg-white/60 p-4 rounded-r-xl">
              My current career interests are Manual QA, Software Testing, System Analysis, and Technical Documentation.
            </div>

            <p className="text-[#556070]">
              {profile.aboutParagraph4}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
