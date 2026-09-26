const serviceCards = [
  {
    icon: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M20 3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h3l-1 2v1h12v-1l-1-2h3c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 13H4V5h16v11z"/>
      </svg>
    ),
    bgIcon: "bg-[#1E6B65]",
    title: "System Analysis",
    count: "UML, ERD & Workflows",
    items: "Requirements Analysis, Business Process Analysis, UML, Flowchart, ERD, System Workflow"
  },
  {
    icon: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    ),
    bgIcon: "bg-[#F4B41A]",
    title: "Software QA & Testing",
    count: "Manual & Functional QC",
    items: "Manual Testing, Functional Testing, Integration Testing, Test Case, Test Scenario, Bug Identification"
  },
  {
    icon: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
      </svg>
    ),
    bgIcon: "bg-[#E75A3C]",
    title: "Full Stack Development",
    count: "PHP, Laravel & SQL",
    items: "PHP, Laravel, MySQL, SQL, HTML, CSS, JavaScript, Tailwind CSS, Bootstrap, Odoo, WordPress"
  },
  {
    icon: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H9l2 4H8L6 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
      </svg>
    ),
    bgIcon: "bg-[#5D4E8C]",
    title: "Content Creation",
    count: "35+ Brand Campaigns",
    items: "Content Planning, Scriptwriting, CapCut Editing, Product Reviews, TikTok Affiliate, Social Media"
  }
];

const WhatIDo = () => {
  return (
    <section id="services" className="py-20 bg-white border-b border-[#EAE5D9]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Stack of White Rounded Floating Cards with Clean SVG Icons */}
          <div className="lg:col-span-5 space-y-4">
            {serviceCards.map((card, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-[#EAE5D9] shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-5"
              >
                <div className={`w-14 h-14 rounded-2xl ${card.bgIcon} text-white flex items-center justify-center flex-shrink-0 shadow-xs`}>
                  {card.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1B2430]">
                    {card.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#E75A3C]">
                    {card.count}
                  </p>
                  <p className="text-xs text-[#556070] mt-1 line-clamp-1">
                    {card.items}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Section Headline & Description & Big Stats */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-[#1B2430] tracking-tight">
                What do I help?
              </h2>
            </div>

            <div className="space-y-4 text-base text-[#556070] leading-relaxed">
              <p>
                I help organizations and businesses design, analyze, and test robust software systems to ensure flawless digital performance.
              </p>
              <p>
                From gathering system requirements, constructing UML/ERD models, migrating complex backend architectures to Laravel, to executing thorough manual and functional testing routines.
              </p>
            </div>

            {/* Bottom Binjan-style Big Stats */}
            <div className="pt-6 border-t border-[#EAE5D9] grid grid-cols-3 gap-6">
              <div>
                <h3 className="text-4xl font-extrabold text-[#1B2430]">3.78+</h3>
                <p className="text-xs font-bold text-[#556070] uppercase mt-1">S1 Systems GPA</p>
              </div>
              <div>
                <h3 className="text-4xl font-extrabold text-[#1B2430]">3.95+</h3>
                <p className="text-xs font-bold text-[#556070] uppercase mt-1">PMM 4 GPA</p>
              </div>
              <div>
                <h3 className="text-4xl font-extrabold text-[#1B2430]">35+</h3>
                <p className="text-xs font-bold text-[#556070] uppercase mt-1">Brand Campaigns</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhatIDo;
