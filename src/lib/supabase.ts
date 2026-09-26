import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xmzjmnrnkkemmvmvmrme.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_chcPq8TgokaDisG1l8C85w_VvX72Nf5";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const defaultPortfolioData = {
  profile: {
    name: "Hodi Khodijah",
    title: "Information Systems Graduate | System Analyst | Software QA | Content Creator",
    location: "Meruya, West Jakarta",
    phone: "+62 857 7891 8137",
    email: "skhodijah369@gmail.com",
    headline: "Hey There, I'm Hodi",
    tagline: "I design, test, & document systems efficiently. And I love what I do.",
    heroQuote: "I build systems, test them, document them — and sometimes spend way too long editing TikToks.",
    aboutHeading: "Hi, I'm Hodi.",
    aboutParagraph1: "I'm an Information Systems graduate with experience in system analysis, software development, manual testing, technical documentation, and content creation.",
    aboutParagraph2: "During my internship at Sekretariat Jenderal DPR RI – Pustekinfo, I worked as a Full Stack Developer Intern. I worked on the migration of the DPR RI Public Complaints System from Zend to Laravel, developed backend features, worked with databases, and tested application features.",
    aboutParagraph3: "I also worked on HAGA Plus, a payroll and attendance management system, covering system analysis, database design, development, integration, and testing.",
    aboutParagraph4: "Outside technology, I work as a Content Creator, Content Writer, Content Planner, Speaker, and TikTok Affiliate, mainly creating beauty, makeup, skincare, and lifestyle content.",
    gpaUnpam: "3.78",
    gpaUndiksha: "3.95",
    brandCount: "35+",
    avatarUrl: "",
    linkedinUrl: "https://linkedin.com",
    githubUrl: "https://github.com",
  },
  projects: [
    {
      id: "1",
      title: "HAGA Plus",
      subtitle: "Payroll & Attendance SaaS App",
      bgColor: "bg-[#F4B41A] text-[#1B2430]",
      image: "/images/work/work-img-1.jpg",
      imageUrls: [] as string[],
      tags: ["PHP", "Laravel", "MySQL", "Tailwind CSS", "System Analysis", "QA"],
      description: "SaaS-based payroll and attendance management system covering employee attendance, payroll, subscriptions, notifications, and HR processes."
    },
    {
      id: "2",
      title: "Sistem Pengaduan DPR RI",
      subtitle: "Public Complaints Administration System",
      bgColor: "bg-[#1E6B65] text-white",
      image: "/images/work/work-img-2.jpg",
      imageUrls: [] as string[],
      tags: ["Laravel", "Zend Migration", "MySQL", "Blade", "QA Control"],
      description: "Web-based administration system for managing public complaints received by DPR RI, migrated from Zend framework to Laravel."
    },
    {
      id: "3",
      title: "Digital Content Creation",
      subtitle: "Beauty & Affiliate Campaigns",
      bgColor: "bg-[#E75A3C] text-white",
      image: "/images/work/work-img-3.jpg",
      imageUrls: [] as string[],
      tags: ["Scriptwriting", "CapCut", "TikTok Affiliate", "35+ Brands"],
      description: "Creative content strategy, product reviews, scriptwriting, video editing, and TikTok affiliate campaigns for 35+ top beauty brands."
    }
  ],
  experiences: [
    {
      id: "1",
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
      id: "2",
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
      id: "3",
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
  ],
  brands: [
    "Avoskin", "Scarlett", "Sea Makeup", "Dörskin", "Amaterasun", "Bio Beauty Lab",
    "Luxcrime", "Emina", "Pratista", "Somethinc", "Buy Me", "Glad2Glow", "Implora",
    "The Originote", "BASE", "Dazzle Me", "O.TWO.O", "Glowies Beauty", "ELFORMULA",
    "Reveline", "Brighty", "Pomeglow", "Finally Found You!", "Jiera", "Beauty of Joseon",
    "Pigeon Teens", "Wardah", "Metoo", "Azarine", "Carasun", "Tavi", "Facetology",
    "Cleora Beauty", "SKINTIFIC", "barenbliss", "SKIN1004"
  ]
};

// Helper: upload file to Supabase Storage, returns public URL or null
export async function uploadImageToSupabase(
  file: File,
  folder: "avatars" | "projects"
): Promise<string | null> {
  const ext = file.name.split(".").pop();
  const fileName = `${folder}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("portfolio-images")
    .upload(fileName, file, { upsert: true, contentType: file.type });

  if (error) {
    console.error("Upload error:", error.message);
    return null;
  }

  const { data } = supabase.storage
    .from("portfolio-images")
    .getPublicUrl(fileName);

  return data?.publicUrl ?? null;
}
