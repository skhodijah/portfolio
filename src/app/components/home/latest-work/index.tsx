"use client";

import { getImgPath } from "@/utils/image";
import Image from "next/image";
import { useState } from "react";
import { usePortfolio } from "@/context/PortfolioContext";

// ---- Per-card Carousel ----
function ProjectCarousel({
  images,
  fallback,
  title,
}: {
  images: string[];
  fallback: string;
  title: string;
}) {
  const [current, setCurrent] = useState(0);
  const allImages = images.length > 0 ? images : [fallback];
  const total = allImages.length;

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((c) => (c - 1 + total) % total);
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((c) => (c + 1) % total);
  };

  return (
    <div className="relative my-6 aspect-[4/3] rounded-2xl overflow-hidden border-2 border-white/40 shadow-md bg-white z-10 group/carousel">
      {/* Images */}
      {allImages.map((src, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-500 ${idx === current ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <Image
            src={src}
            alt={`${title} ${idx + 1}`}
            fill
            className="object-cover"
            unoptimized={src.startsWith("http")}
          />
        </div>
      ))}

      {/* Prev / Next arrows — only if multiple images */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity cursor-pointer z-20 hover:bg-black/70"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity cursor-pointer z-20 hover:bg-black/70"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-20">
            {allImages.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setCurrent(idx); }}
                className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${idx === current ? "bg-white scale-125" : "bg-white/50"}`}
              />
            ))}
          </div>

          {/* Counter badge */}
          <div className="absolute top-2 right-2 bg-black/40 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-20">
            {current + 1}/{total}
          </div>
        </>
      )}
    </div>
  );
}

// ---- Main Section ----
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project, idx) => {
            const imageUrls: string[] = (project as any).imageUrls ?? [];
            const fallback = getImgPath((project as any).image || "/images/work/work-img-1.jpg");

            return (
              <div
                key={project.id || idx}
                className={`rounded-3xl p-6 ${project.bgColor || "bg-[#1E6B65] text-white"} shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col justify-between overflow-hidden relative`}
              >
                <div className="space-y-2 z-10">
                  <h3 className="text-2xl font-extrabold tracking-tight">{project.title}</h3>
                  <p className="text-xs font-semibold opacity-90">{project.subtitle}</p>
                </div>

                <ProjectCarousel
                  images={imageUrls}
                  fallback={fallback}
                  title={project.title}
                />

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
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LatestWork;
