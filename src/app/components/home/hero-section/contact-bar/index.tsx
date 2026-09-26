"use client";

import { usePortfolio } from "@/context/PortfolioContext";

const ContactBar = () => {
  const { profile } = usePortfolio();

  const phoneHref = profile.phone
    ? `tel:${profile.phone.replace(/[^\d+]/g, "")}`
    : "tel:+6285778918137";

  return (
    <div className="border-b border-[#EAE5D9] bg-[#FAF6EE] py-3.5 no-print">
      <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-[#556070]">
        <div className="flex flex-wrap items-center gap-6">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-[#1E6B65] fill-current" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            {profile.location || "Meruya, West Jakarta"}
          </span>

          <span className="text-[#EAE5D9]">•</span>

          <a
            href={phoneHref}
            className="flex items-center gap-1.5 hover:text-[#1B2430] transition-colors"
          >
            <svg className="w-3.5 h-3.5 text-[#E75A3C] fill-current" viewBox="0 0 24 24">
              <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.27c1.21.49 2.53.76 3.88.76a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.35.27 2.67.76 3.88a1 1 0 01-.27 1.11l-2.37 2.4z"/>
            </svg>
            {profile.phone || "+62 857 7891 8137"}
          </a>

          <span className="text-[#EAE5D9]">•</span>

          <a
            href={`mailto:${profile.email || "skhodijah369@gmail.com"}`}
            className="flex items-center gap-1.5 hover:text-[#1B2430] transition-colors"
          >
            <svg className="w-3.5 h-3.5 text-[#1E6B65] fill-current" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            {profile.email || "skhodijah369@gmail.com"}
          </a>
        </div>

        <div className="flex items-center gap-4 uppercase font-bold text-[#1B2430]">
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#E75A3C] transition-colors"
          >
            LinkedIn ↗
          </a>
          <span className="text-[#EAE5D9]">/</span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#E75A3C] transition-colors"
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactBar;
