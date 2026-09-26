const educationList = [
  {
    school: "Universitas Pamulang",
    degree: "Bachelor of Information Systems",
    period: "September 2022 — August 2026",
    gpa: "GPA 3.78 / 4.00"
  },
  {
    school: "Universitas Pendidikan Ganesha",
    degree: "Pertukaran Mahasiswa Merdeka (PMM 4)",
    period: "2024",
    gpa: "GPA 3.95 / 4.00"
  }
];

const certifications = [
  {
    title: "Programming Competency Certification",
    issuer: "BNSP",
    year: "2026"
  },
  {
    title: "Full Stack Developer Internship",
    issuer: "Sekretariat Jenderal DPR RI Pustekinfo",
    year: "2025"
  }
];

const skillCategories = [
  {
    category: "System & QA",
    items: [
      "System Analysis", "Requirements Analysis", "Business Process Analysis",
      "UML", "Flowchart", "ERD", "Manual Testing", "Functional Testing",
      "Integration Testing", "Regression Testing", "Retesting", "Test Case",
      "Test Scenario", "Bug Reporting", "Quality Control"
    ]
  },
  {
    category: "Development",
    items: [
      "PHP", "Laravel", "MySQL", "SQL", "HTML", "CSS", "JavaScript",
      "Tailwind CSS", "Bootstrap", "Odoo", "WordPress"
    ]
  },
  {
    category: "Tools",
    items: [
      "Draw.io", "DBeaver", "Laragon", "GitHub", "Microsoft Excel",
      "Google Sheets", "Microsoft Office"
    ]
  },
  {
    category: "Creative",
    items: ["Canva", "CapCut"]
  },
  {
    category: "Soft Skills",
    items: [
      "Analytical Thinking", "Problem Solving", "Attention to Detail",
      "Communication", "Stakeholder Coordination", "Teamwork",
      "Adaptability", "Creativity", "Time Management"
    ]
  }
];

const EducationSkills = () => {
  return (
    <section id="education" className="py-20 border-b border-[#E5E0D8]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="pb-12 border-b border-[#E5E0D8] space-y-2">
          <span className="text-xs font-mono text-[#5A5A5A] uppercase tracking-widest">
            05 / ACADEMIC & SKILLS
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-[#1A1A1A]">
            Education & Skills
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12">
          {/* Education & Certifications Left Column */}
          <div className="lg:col-span-5 space-y-10">
            {/* Education */}
            <div className="space-y-6">
              <h3 className="text-xs font-mono uppercase text-[#1A1A1A] font-bold tracking-wider border-b border-[#1A1A1A] pb-2">
                Education
              </h3>
              <div className="space-y-6">
                {educationList.map((edu, idx) => (
                  <div key={idx} className="space-y-1">
                    <h4 className="font-bold text-lg text-[#1A1A1A]">
                      {edu.school}
                    </h4>
                    <p className="text-sm font-medium text-[#2C4A6F]">
                      {edu.degree}
                    </p>
                    <div className="flex justify-between items-center text-xs font-mono text-[#5A5A5A] pt-1">
                      <span>{edu.period}</span>
                      <span className="font-bold text-[#C86D51]">{edu.gpa}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="space-y-6">
              <h3 className="text-xs font-mono uppercase text-[#1A1A1A] font-bold tracking-wider border-b border-[#1A1A1A] pb-2">
                Certifications
              </h3>
              <div className="space-y-4">
                {certifications.map((cert, idx) => (
                  <div key={idx} className="flex justify-between items-start text-sm">
                    <div>
                      <p className="font-semibold text-[#1A1A1A]">{cert.title}</p>
                      <p className="text-xs text-[#5A5A5A]">{cert.issuer}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#2C4A6F]">
                      {cert.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skills & Tools Right Column (Clean Editorial Text List) */}
          <div className="lg:col-span-7 space-y-8">
            <h3 className="text-xs font-mono uppercase text-[#1A1A1A] font-bold tracking-wider border-b border-[#1A1A1A] pb-2">
              Skills & Technical Inventory
            </h3>

            <div className="space-y-6">
              {skillCategories.map((group) => (
                <div key={group.category} className="space-y-2">
                  <span className="text-xs font-mono font-bold text-[#C86D51] uppercase">
                    {group.category}
                  </span>
                  <p className="text-sm text-[#333333] leading-relaxed">
                    {group.items.join(" • ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationSkills;
