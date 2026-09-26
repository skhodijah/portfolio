const AboutMe = () => {
  return (
    <section id="about" className="py-20 border-b border-[#E5E0D8]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Section Header */}
          <div className="lg:col-span-4 space-y-2">
            <span className="text-xs font-mono text-[#5A5A5A] uppercase tracking-widest">
              01 / ABOUT
            </span>
            <h2 className="text-4xl font-bold tracking-tight text-[#1A1A1A]">
              About
            </h2>
            <p className="text-sm font-serif-italic text-[#C86D51]">
              Information Systems × QA & Systems × Creative Media
            </p>
          </div>

          {/* Main Conversational Body */}
          <div className="lg:col-span-8 space-y-6 text-base sm:text-lg text-[#1A1A1A] leading-relaxed">
            <p className="font-semibold text-xl sm:text-2xl text-[#1A1A1A]">
              Hi, I'm Hodi.
            </p>

            <p className="text-[#333333]">
              I'm an Information Systems graduate with experience in system analysis, software development, manual testing, technical documentation, and content creation.
            </p>

            <p className="text-[#333333]">
              During my internship at <strong className="font-semibold text-[#1A1A1A]">Sekretariat Jenderal DPR RI – Pustekinfo</strong>, I worked as a Full Stack Developer Intern. I worked on the migration of the DPR RI Public Complaints System from Zend to Laravel, developed backend features, worked with databases, and tested application features.
            </p>

            <p className="text-[#333333]">
              I also worked on <strong className="font-semibold text-[#1A1A1A]">HAGA Plus</strong>, a payroll and attendance management system, covering system analysis, database design, development, integration, and testing.
            </p>

            <div className="border-l-2 border-[#2C4A6F] pl-5 py-1 text-[#2C4A6F] font-medium text-base">
              My current career interests are Manual QA, Software Testing, System Analysis, and Technical Documentation.
            </div>

            <p className="text-[#333333]">
              Outside technology, I work as a Content Creator, Content Writer, Content Planner, Speaker, and TikTok Affiliate, mainly creating beauty, makeup, skincare, and lifestyle content.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
