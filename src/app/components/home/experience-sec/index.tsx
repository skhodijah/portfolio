const experiences = [
  {
    company: "Sekretariat Jenderal DPR RI – Pustekinfo",
    location: "Jakarta, Indonesia",
    period: "April 2025 – July 2025",
    role: "Full Stack Developer Intern",
    dotColor: "border-[#1E6B65] bg-[#1E6B65]",
    bullets: [
      "Laravel/PHP web development for DPR RI internal systems",
      "System migration of Public Complaints Administration System from Zend framework to Laravel",
      "Backend CRUD modules & database management using MySQL and DBeaver",
      "Functional testing, integration testing, and quality control for DPR RI website and PARSA chatbot",
      "Created and maintained comprehensive technical and testing documentation"
    ]
  },
  {
    company: "SaaS Platform Project (HAGA Plus)",
    location: "Remote / Project Lead",
    period: "January 2025 – March 2025",
    role: "System Analyst & Developer Lead",
    dotColor: "border-[#E75A3C] bg-[#E75A3C]",
    bullets: [
      "System analysis, business process analysis, and ERD system modeling",
      "Backend development for payroll, attendance, and subscription modules",
      "Functional & integration testing, bug identification, and user guide creation"
    ]
  },
  {
    company: "Self-Employed / Media Campaigns",
    location: "Jakarta, Indonesia",
    period: "April 2024 – Present",
    role: "Content Creator & TikTok Affiliate",
    dotColor: "border-[#F4B41A] bg-[#F4B41A]",
    bullets: [
      "Content planning, scriptwriting, shooting, and video editing (CapCut, Canva)",
      "Executed beauty, makeup, skincare, and lifestyle product reviews",
      "TikTok Affiliate campaigns & brand collaborations with 35+ top beauty brands"
    ]
  }
];

const ExperienceSec = () => {
  return (
    <section id="experience" className="py-20 bg-[#FAF6EE] border-b border-[#EAE5D9]">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-[#1B2430] tracking-tight mb-16 text-center">
          My Work Experience
        </h2>

        <div className="space-y-12 relative">
          {/* Vertical Dashed Center Line (Desktop) */}
          <div className="hidden md:block absolute left-[30%] top-4 bottom-4 w-px border-l-2 border-dashed border-[#1E6B65]/40" />

          {experiences.map((exp, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start relative"
            >
              {/* Left Column: Company & Period */}
              <div className="md:col-span-3 md:text-right space-y-1">
                <h3 className="font-extrabold text-lg text-[#1B2430]">
                  {exp.company}
                </h3>
                <p className="text-xs font-semibold text-[#556070]">
                  {exp.period}
                </p>
                <p className="text-xs text-[#556070]/80">
                  {exp.location}
                </p>
              </div>

              {/* Center Column: Dashed Timeline Node (Desktop) */}
              <div className="hidden md:flex md:col-span-1 justify-center relative z-10 pt-1">
                <div className={`w-5 h-5 rounded-full border-2 bg-white flex items-center justify-center ${exp.dotColor}`}>
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              </div>

              {/* Right Column: Position & Bullets */}
              <div className="md:col-span-8 bg-white p-6 rounded-2xl border border-[#EAE5D9] shadow-sm">
                <h4 className="text-xl font-bold text-[#1B2430] mb-3">
                  {exp.role}
                </h4>
                <ul className="space-y-2 text-sm text-[#556070] leading-relaxed">
                  {exp.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E75A3C] mt-2 flex-shrink-0" />
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