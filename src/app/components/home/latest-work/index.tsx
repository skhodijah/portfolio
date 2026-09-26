"use client";

import { getImgPath } from "@/utils/image";
import Image from "next/image";
import { usePortfolio } from "@/context/PortfolioContext";

const LatestWork = () => {
  const { projects } = usePortfolio();

  return (
    <section id="projects" className="py-20 bg-white border-b border-[#EAE5D9]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
          <div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#1B2430] tracking-tight">
              My Latest Works
            </h2>
            <p className="text-sm text-[#556070] font-medium mt-2">
              Perfect solution for digital experience
            </p>
          </div>
          <a
            href="#contact"
            className="text-sm font-bold text-[#E75A3C] hover:underline flex items-center gap-1"
          >
            <span>Explore More Works</span>
            <span>→</span>
          </a>
        </div>

        {/* Binjan-style Big Colorful Rounded Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <div
              key={project.id || idx}
              className={`rounded-3xl p-6 ${project.bgColor || "bg-[#1E6B65] text-white"} shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col justify-between overflow-hidden relative group`}
            >
              <div className="space-y-2 z-10">
                <h3 className="text-2xl font-extrabold tracking-tight">
                  {project.title}
                </h3>
                <p className="text-xs font-semibold opacity-90">
                  {project.subtitle}
                </p>
              </div>

              {/* Preview Image Card */}
              <div className="my-6 aspect-[4/3] rounded-2xl overflow-hidden border-2 border-white/40 shadow-md relative z-10 bg-white">
                <Image
                  src={getImgPath(project.image || "/images/work/work-img-1.jpg")}
                  alt={project.title}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="space-y-3 z-10">
                <p className="text-xs leading-relaxed opacity-90 line-clamp-2">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] font-bold bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestWork;
