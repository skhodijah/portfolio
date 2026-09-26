"use client";

import { usePortfolio } from "@/context/PortfolioContext";

const campaigns = [
  {
    role: "Beauty & Skincare Reviews",
    focus: "Product Demos & Honest Reviews",
    quote: "Creating high-converting short-form video scripts, product shooting, and authentic reviews for leading Asian beauty brands."
  },
  {
    role: "TikTok Affiliate Strategy",
    focus: "Content Planning & Conversions",
    quote: "Developing creative campaign ideas, directing aesthetic video content, writing captions, and analyzing sales performance."
  },
  {
    role: "Brand Collaborations",
    focus: "35+ Partner Campaigns",
    quote: "Successfully executing social media marketing campaigns for Avoskin, Somethinc, Wardah, SKINTIFIC, barenbliss, and more."
  }
];

const CreativeSection = () => {
  const { brands } = usePortfolio();

  return (
    <section id="beyond-tech" className="py-20 bg-[#FAF6EE] border-b border-[#EAE5D9]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#1B2430] tracking-tight">
            Brand Collaborations
          </h2>
          <p className="text-sm font-medium text-[#556070]">
            "When I'm not testing systems, I'm usually testing makeup & creating digital content."
          </p>
        </div>

        {/* Binjan-style Floating Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {campaigns.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-[#EAE5D9] shadow-md flex flex-col justify-between space-y-4"
            >
              <p className="text-sm text-[#556070] italic leading-relaxed">
                "{item.quote}"
              </p>
              <div className="border-t border-[#EAE5D9] pt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1E6B65] text-white flex items-center justify-center font-bold text-sm">
                  0{idx + 1}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#1B2430]">{item.role}</h4>
                  <p className="text-xs font-semibold text-[#E75A3C]">{item.focus}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Infinite Ticker Marquee for 35+ Brands */}
        <div className="space-y-4 overflow-hidden">
          <div className="flex justify-between items-center text-xs font-bold text-[#556070] uppercase tracking-wider">
            <span>Partnered Beauty Brands</span>
            <span>{brands.length}+ Brands</span>
          </div>

          <div className="relative overflow-hidden py-4 border-y border-[#EAE5D9] bg-white rounded-xl shadow-xs">
            <div className="animate-marquee whitespace-nowrap text-sm font-bold text-[#1B2430] flex items-center gap-8">
              {brands.map((brand, idx) => (
                <span key={idx} className="flex items-center gap-8">
                  <span className="hover:text-[#E75A3C] transition-colors">{brand}</span>
                  <span className="text-[#E75A3C]">•</span>
                </span>
              ))}
              {/* Duplicate for infinite loop */}
              {brands.map((brand, idx) => (
                <span key={`dup-${idx}`} className="flex items-center gap-8">
                  <span className="hover:text-[#E75A3C] transition-colors">{brand}</span>
                  <span className="text-[#E75A3C]">•</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreativeSection;
