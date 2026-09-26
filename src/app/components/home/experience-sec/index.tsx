"use client";

import { usePortfolio } from "@/context/PortfolioContext";

const ExperienceSec = () => {
  const { experiences } = usePortfolio();

  return (
    <section id="experience" className="py-20 bg-[#FAF6EE] border-b border-[#EAE5D9]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 gap-4">
          <div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#1B2430] tracking-tight">
              My Work Experience
            </h2>
            <p className="text-sm text-[#556070] font-medium mt-2">
              System analysis, software testing & digital media execution
            </p>
          </div>
          <a
            href="mailto:skhodijah369@gmail.com"
            className="text-xs font-bold uppercase tracking-wider text-[#1E6B65] hover:underline flex items-center gap-1 bg-white px-4 py-2 rounded-full border border-[#EAE5D9] shadow-xs"
          >
            <span>Download Resume (PDF)</span>
          </a>
        </div>

        {/* Binjan 3-Column Dashed Timeline */}
        <div className="space-y-12 relative">
          {experiences.map((exp, idx) => (
            <div key={exp.id || idx} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start relative group">

              {/* Left Column: Instansi / Perusahaan & Period */}
              <div className="md:col-span-4 space-y-1 md:text-right pr-2">
                <h3 className="text-xl font-extrabold text-[#1B2430]">
                  {exp.company}
                </h3>
                <p className="text-xs font-semibold text-[#556070]">
                  {exp.location}
                </p>
                <div className="inline-block mt-2 text-xs font-bold bg-white text-[#1E6B65] px-3 py-1 rounded-full border border-[#EAE5D9]">
                  {exp.period}
                </div>
              </div>

              {/* Center Column: Colored Node Circle with Vertical Line */}
              <div className="hidden md:flex md:col-span-1 justify-center relative self-stretch">
                <div className="w-4 h-4 rounded-full border-4 border-[#1E6B65] bg-[#1E6B65] z-10 my-1 shadow-xs group-hover:scale-125 transition-transform" />
                {idx !== experiences.length - 1 && (
                  <div className="absolute top-4 bottom-0 w-[2px] border-l-2 border-dashed border-[#1E6B65]/40" />
                )}
              </div>

              {/* Right Column: Position & Detail Card */}
              <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-[#EAE5D9] shadow-md hover:shadow-lg transition-shadow">
                <h4 className="text-lg font-bold text-[#1B2430]">
                  {exp.role}
                </h4>
                <ul className="mt-3 space-y-2 text-xs text-[#556070] font-medium leading-relaxed">
                  {exp.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2">
                      <span className="text-[#E75A3C] font-bold">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSec;