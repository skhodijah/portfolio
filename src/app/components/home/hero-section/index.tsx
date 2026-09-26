import { getImgPath } from "@/utils/image";
import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="relative bg-[#FAF6EE] pt-12 pb-20 overflow-hidden border-b border-[#EAE5D9]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">

          {/* Left Column: Big Headline & Email & Stat */}
          <div className="lg:col-span-5 space-y-8 z-10">
            <div>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-[#1B2430] leading-[1.1] tracking-tight">
                Hey There,<br />
                I’m Hodi
              </h1>
            </div>

            <div>
              <a
                href="mailto:skhodijah369@gmail.com"
                className="inline-block font-bold text-sm text-[#E75A3C] border-b-2 border-[#E75A3C] hover:opacity-80 transition-opacity"
              >
                skhodijah369@gmail.com
              </a>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <span className="text-5xl font-extrabold text-[#1B2430]">04</span>
              <div className="text-xs font-bold text-[#556070] uppercase leading-tight tracking-wider">
                CORE DOMAINS OF<br />EXPERTISE & TECH
              </div>
            </div>
          </div>

          {/* Center Column: Portrait Image with Teal Brush Splash Background */}
          <div className="lg:col-span-4 flex justify-center relative my-6 lg:my-0">
            {/* Teal Paint Brush Stroke SVG Background */}
            <div className="absolute inset-0 flex items-center justify-center -z-0 transform scale-125">
              <svg
                viewBox="0 0 500 500"
                className="w-[380px] h-[380px] fill-[#1E6B65] opacity-90"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M413,293Q396,336,370.5,373.5Q345,411,297.5,429Q250,447,202,429.5Q154,412,118.5,377Q83,342,67,296Q51,250,68.5,203.5Q86,157,120,121Q154,85,202,70Q250,55,297.5,71.5Q345,88,379.5,123.5Q414,159,422,204.5Q430,250,413,293Z" />
              </svg>
            </div>

            {/* Subject Profile Image */}
            <div className="relative z-10 w-[280px] h-[340px] sm:w-[320px] sm:h-[390px] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
              <Image
                src={getImgPath("/images/home/banner/banner-img.png")}
                alt="Hodi Khodijah"
                width={320}
                height={390}
                className="w-full h-full object-cover filter contrast-[1.03]"
              />
            </div>

            {/* Binjan-style Circular Stamp Badge */}
            <div className="absolute -bottom-4 right-0 lg:-right-6 z-20 bg-white p-3 rounded-full shadow-lg border border-[#EAE5D9] flex items-center justify-center w-28 h-28 text-center">
              <div className="relative w-full h-full flex items-center justify-center">
                <svg className="w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                  <path
                    id="circlePath"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    fill="none"
                  />
                  <text className="text-[9.5px] font-bold uppercase tracking-widest fill-[#1B2430]">
                    <textPath href="#circlePath">
                      • HODI KHODIJAH • SYSTEM ANALYST & QA
                    </textPath>
                  </text>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-[#1E6B65]">
                  SK
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Top Quote / Supporting Text */}
          <div className="lg:col-span-3 lg:text-right space-y-4">
            <p className="text-base sm:text-lg text-[#1B2430] font-medium leading-relaxed">
              I design, test, & document systems efficiently. And I love what I do.
            </p>
            <div className="text-xs font-semibold text-[#556070] italic">
              Information Systems S1 (3.78 GPA) • BNSP Certified
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
