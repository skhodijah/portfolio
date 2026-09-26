"use client";

import { useEffect, useState } from "react";
import { defaultPortfolioData, supabase } from "@/lib/supabase";
import Link from "next/link";

const SQL_SCHEMA_SCRIPT = `-- Supabase SQL Tables for Hodi Khodijah Portfolio
CREATE TABLE IF NOT EXISTS portfolio_content (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS & public policies for easy access
ALTER TABLE portfolio_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Portfolio" ON portfolio_content FOR SELECT USING (true);
CREATE POLICY "Public Insert Portfolio" ON portfolio_content FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Portfolio" ON portfolio_content FOR UPDATE USING (true);

CREATE POLICY "Public Insert Messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Select Messages" ON contact_messages FOR SELECT USING (true);
`;

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState<"profile" | "projects" | "experiences" | "brands" | "messages" | "sql">("profile");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Editable State
  const [profile, setProfile] = useState(defaultPortfolioData.profile);
  const [projects, setProjects] = useState(defaultPortfolioData.projects);
  const [experiences, setExperiences] = useState(defaultPortfolioData.experiences);
  const [brandsText, setBrandsText] = useState(defaultPortfolioData.brands.join(", "));
  const [messages, setMessages] = useState<any[]>([]);
  const [tableExists, setTableExists] = useState<boolean | null>(null);

  useEffect(() => {
    const authStatus = localStorage.getItem("hodi_admin_auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
    loadData();
  }, []);

  const loadData = async () => {
    // 1. Try loading local override
    const localContent = localStorage.getItem("hodi_portfolio_override");
    if (localContent) {
      try {
        const parsed = JSON.parse(localContent);
        if (parsed.profile) setProfile(parsed.profile);
        if (parsed.projects) setProjects(parsed.projects);
        if (parsed.experiences) setExperiences(parsed.experiences);
        if (parsed.brands) setBrandsText(parsed.brands.join(", "));
      } catch (e) {
        console.error("Local parse error", e);
      }
    }

    // 2. Fetch from Supabase
    try {
      const { data, error } = await supabase.from("portfolio_content").select("*").eq("id", "main").single();
      if (error) {
        setTableExists(false);
      } else if (data && data.data) {
        setTableExists(true);
        const content = data.data;
        if (content.profile) setProfile(content.profile);
        if (content.projects) setProjects(content.projects);
        if (content.experiences) setExperiences(content.experiences);
        if (content.brands) setBrandsText(content.brands.join(", "));
      }
    } catch (err) {
      setTableExists(false);
    }

    // 3. Fetch Contact Messages from Supabase
    try {
      const { data: msgData } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
      if (msgData) {
        setMessages(msgData);
      }
    } catch (err) {
      console.warn("Contact messages fetch notice", err);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "admin" || passcode === "hodi2026" || passcode === "123456") {
      setIsAuthenticated(true);
      localStorage.setItem("hodi_admin_auth", "true");
      setLoginError("");
    } else {
      setLoginError("Passcode salah! Gunakan 'admin' atau 'hodi2026'");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("hodi_admin_auth");
  };

  const handleSeedSupabase = async () => {
    setSaving(true);
    const brandsArray = brandsText.split(",").map((b) => b.trim()).filter(Boolean);
    const fullData = {
      profile,
      projects,
      experiences,
      brands: brandsArray,
    };

    try {
      const { error } = await supabase.from("portfolio_content").upsert({
        id: "main",
        data: fullData,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        setSaveStatus({
          type: "error",
          text: `Tabel belum ada di Supabase. Silakan jalankan Skrip SQL di tab "Supabase SQL Setup" terlebih dahulu di Supabase SQL Editor. Error: ${error.message}`,
        });
      } else {
        setTableExists(true);
        setSaveStatus({
          type: "success",
          text: "🎉 Berhasil melakukan Seed Data Awal ke Database Supabase!",
        });
      }
    } catch (err: any) {
      setSaveStatus({
        type: "error",
        text: "Error saat seeding: " + err.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setSaveStatus(null);

    const brandsArray = brandsText.split(",").map((b) => b.trim()).filter(Boolean);

    const fullData = {
      profile,
      projects,
      experiences,
      brands: brandsArray,
    };

    // Save to localStorage immediately
    localStorage.setItem("hodi_portfolio_override", JSON.stringify(fullData));

    // Save to Supabase
    try {
      const { error } = await supabase.from("portfolio_content").upsert({
        id: "main",
        data: fullData,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        setSaveStatus({
          type: "success",
          text: "Disimpan secara Lokal! (Jalankan skrip SQL di Tab 'Supabase SQL Setup' di Supabase SQL Editor agar tersimpan ke cloud).",
        });
      } else {
        setSaveStatus({
          type: "success",
          text: "Berhasil tersimpan & terkonfigurasi ke Supabase Cloud & Lokal!",
        });
      }
    } catch (e: any) {
      setSaveStatus({
        type: "success",
        text: "Tersimpan di Lokal Browser!",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF6EE] flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl border border-[#EAE5D9] shadow-xl max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <span className="font-script text-4xl font-bold text-[#1B2430]">Hodi</span>
            <h1 className="text-2xl font-extrabold text-[#1B2430]">Admin Panel Login</h1>
            <p className="text-xs text-[#556070]">Masukkan kata sandi untuk mengelola konten portofolio</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#1B2430] mb-2">Passcode</label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Masukkan passcode (e.g. admin)"
                className="w-full bg-[#FAF6EE] border border-[#EAE5D9] rounded-xl p-3 text-sm font-medium focus:border-[#1E6B65] focus:outline-none"
              />
            </div>

            {loginError && <p className="text-xs text-[#E75A3C] font-bold text-center">{loginError}</p>}

            <button
              type="submit"
              className="w-full bg-[#1B2430] text-white hover:bg-[#1E6B65] transition-colors py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Masuk Dashboard
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs font-bold text-[#556070] hover:text-[#E75A3C]">
              ← Kembali ke Website Utama
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1B2430] font-sans pb-24">
      {/* Header Admin */}
      <header className="bg-white border-b border-[#EAE5D9] sticky top-0 z-40 py-4 px-6 shadow-xs">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-script text-3xl font-bold text-[#1B2430]">Hodi</span>
            <span className="text-xs font-bold bg-[#1E6B65] text-white px-3 py-1 rounded-full uppercase">
              Supabase Admin Panel
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold">
            <button
              onClick={handleSeedSupabase}
              disabled={saving}
              className="bg-[#1E6B65] text-white hover:opacity-90 transition-all px-4 py-2.5 rounded-full cursor-pointer shadow-xs disabled:opacity-50"
            >
              🌱 Push Data ke Supabase
            </button>
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="bg-[#E75A3C] text-white hover:opacity-90 transition-all px-5 py-2.5 rounded-full cursor-pointer shadow-xs disabled:opacity-50"
            >
              {saving ? "Saving..." : "💾 Simpan Perubahan"}
            </button>
            <Link href="/" target="_blank" className="border border-[#1B2430] px-4 py-2 rounded-full hover:bg-[#1B2430] hover:text-white transition-colors">
              Lihat Website ↗
            </Link>
            <button onClick={handleLogout} className="text-[#556070] hover:text-[#E75A3C] cursor-pointer">
              Keluar
            </button>
          </div>
        </div>
      </header>

      {/* Save Status Notification */}
      {saveStatus && (
        <div className="max-w-6xl mx-auto px-6 pt-6">
          <div
            className={`p-4 rounded-2xl text-xs font-bold flex justify-between items-center ${
              saveStatus.type === "error"
                ? "bg-red-50 border border-red-200 text-red-800"
                : "bg-emerald-50 border border-emerald-200 text-emerald-800"
            }`}
          >
            <span>{saveStatus.text}</span>
            <button onClick={() => setSaveStatus(null)} className="font-bold">✕</button>
          </div>
        </div>
      )}

      {/* Tab Controls */}
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <div className="flex flex-wrap gap-2 border-b border-[#EAE5D9] pb-4">
          {[
            { id: "profile", label: "👤 Profile & Text" },
            { id: "projects", label: "🚀 Projects (" + projects.length + ")" },
            { id: "experiences", label: "💼 Work Experience" },
            { id: "brands", label: "🛍️ Brand Collaborations" },
            { id: "messages", label: "📩 Messages (" + messages.length + ")" },
            { id: "sql", label: "⚡ Supabase SQL Setup" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#1B2430] text-white shadow-sm"
                  : "bg-white text-[#556070] border border-[#EAE5D9] hover:text-[#1B2430]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: PROFILE & TEXT */}
        {activeTab === "profile" && (
          <div className="mt-8 bg-white p-8 rounded-3xl border border-[#EAE5D9] shadow-sm space-y-6">
            <h2 className="text-xl font-extrabold text-[#1B2430]">Kelola Informasi Utama & Teks</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-[#1B2430] mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-[#FAF6EE] border border-[#EAE5D9] rounded-xl p-3 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#1B2430] mb-2">Email Contact</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full bg-[#FAF6EE] border border-[#EAE5D9] rounded-xl p-3 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#1B2430] mb-2">Telepon / WhatsApp</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full bg-[#FAF6EE] border border-[#EAE5D9] rounded-xl p-3 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#1B2430] mb-2">Lokasi</label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="w-full bg-[#FAF6EE] border border-[#EAE5D9] rounded-xl p-3 text-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#EAE5D9]">
              <div>
                <label className="block text-xs font-bold uppercase text-[#1B2430] mb-2">Hero Headline Utama</label>
                <input
                  type="text"
                  value={profile.headline}
                  onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                  className="w-full bg-[#FAF6EE] border border-[#EAE5D9] rounded-xl p-3 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#1B2430] mb-2">Hero Tagline Deskripsi</label>
                <input
                  type="text"
                  value={profile.tagline}
                  onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                  className="w-full bg-[#FAF6EE] border border-[#EAE5D9] rounded-xl p-3 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#1B2430] mb-2">Quote Personal Hero</label>
                <textarea
                  rows={2}
                  value={profile.heroQuote}
                  onChange={(e) => setProfile({ ...profile, heroQuote: e.target.value })}
                  className="w-full bg-[#FAF6EE] border border-[#EAE5D9] rounded-xl p-3 text-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#EAE5D9]">
              <h3 className="text-sm font-bold uppercase text-[#1B2430]">Paragraf Section About Me</h3>

              <div>
                <label className="block text-xs font-bold text-[#556070] mb-1">Paragraf 1 (Pengenalan)</label>
                <textarea
                  rows={2}
                  value={profile.aboutParagraph1}
                  onChange={(e) => setProfile({ ...profile, aboutParagraph1: e.target.value })}
                  className="w-full bg-[#FAF6EE] border border-[#EAE5D9] rounded-xl p-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#556070] mb-1">Paragraf 2 (Pengalaman DPR RI)</label>
                <textarea
                  rows={2}
                  value={profile.aboutParagraph2}
                  onChange={(e) => setProfile({ ...profile, aboutParagraph2: e.target.value })}
                  className="w-full bg-[#FAF6EE] border border-[#EAE5D9] rounded-xl p-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#556070] mb-1">Paragraf 3 (HAGA Plus SaaS)</label>
                <textarea
                  rows={2}
                  value={profile.aboutParagraph3}
                  onChange={(e) => setProfile({ ...profile, aboutParagraph3: e.target.value })}
                  className="w-full bg-[#FAF6EE] border border-[#EAE5D9] rounded-xl p-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#556070] mb-1">Paragraf 4 (Content Creator)</label>
                <textarea
                  rows={2}
                  value={profile.aboutParagraph4}
                  onChange={(e) => setProfile({ ...profile, aboutParagraph4: e.target.value })}
                  className="w-full bg-[#FAF6EE] border border-[#EAE5D9] rounded-xl p-3 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#EAE5D9]">
              <div>
                <label className="block text-xs font-bold uppercase text-[#1B2430] mb-2">IPK Universitas Pamulang</label>
                <input
                  type="text"
                  value={profile.gpaUnpam}
                  onChange={(e) => setProfile({ ...profile, gpaUnpam: e.target.value })}
                  className="w-full bg-[#FAF6EE] border border-[#EAE5D9] rounded-xl p-3 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#1B2430] mb-2">IPK PMM 4 Undiksha</label>
                <input
                  type="text"
                  value={profile.gpaUndiksha}
                  onChange={(e) => setProfile({ ...profile, gpaUndiksha: e.target.value })}
                  className="w-full bg-[#FAF6EE] border border-[#EAE5D9] rounded-xl p-3 text-sm font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROJECTS */}
        {activeTab === "projects" && (
          <div className="mt-8 space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-[#EAE5D9]">
              <h2 className="text-xl font-extrabold text-[#1B2430]">Daftar Proyek Portofolio</h2>
              <button
                onClick={() =>
                  setProjects([
                    ...projects,
                    {
                      id: String(Date.now()),
                      title: "Proyek Baru",
                      subtitle: "Deskripsi singkat proyek",
                      bgColor: "bg-[#1E6B65] text-white",
                      image: "/images/work/work-img-1.jpg",
                      tags: ["Laravel", "PHP"],
                      description: "Deskripsi lengkap proyek baru...",
                    },
                  ])
                }
                className="bg-[#1E6B65] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase cursor-pointer"
              >
                + Tambah Proyek
              </button>
            </div>

            <div className="space-y-6">
              {projects.map((proj, idx) => (
                <div key={proj.id} className="bg-white p-6 rounded-3xl border border-[#EAE5D9] shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-[#EAE5D9] pb-3">
                    <span className="text-xs font-mono font-bold text-[#E75A3C]">PROJECT 0{idx + 1}</span>
                    <button
                      onClick={() => setProjects(projects.filter((p) => p.id !== proj.id))}
                      className="text-xs font-bold text-red-500 hover:underline cursor-pointer"
                    >
                      Hapus Proyek
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-[#1B2430] mb-1">Judul Proyek</label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => {
                          const updated = [...projects];
                          updated[idx].title = e.target.value;
                          setProjects(updated);
                        }}
                        className="w-full bg-[#FAF6EE] border border-[#EAE5D9] rounded-xl p-2.5 text-sm font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-[#1B2430] mb-1">Sub-Judul</label>
                      <input
                        type="text"
                        value={proj.subtitle}
                        onChange={(e) => {
                          const updated = [...projects];
                          updated[idx].subtitle = e.target.value;
                          setProjects(updated);
                        }}
                        className="w-full bg-[#FAF6EE] border border-[#EAE5D9] rounded-xl p-2.5 text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#1B2430] mb-1">Deskripsi Lengkap</label>
                    <textarea
                      rows={3}
                      value={proj.description}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[idx].description = e.target.value;
                        setProjects(updated);
                      }}
                      className="w-full bg-[#FAF6EE] border border-[#EAE5D9] rounded-xl p-2.5 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#1B2430] mb-1">Tags / Teknologi (pisahkan koma)</label>
                    <input
                      type="text"
                      value={proj.tags.join(", ")}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[idx].tags = e.target.value.split(",").map((t) => t.trim());
                        setProjects(updated);
                      }}
                      className="w-full bg-[#FAF6EE] border border-[#EAE5D9] rounded-xl p-2.5 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: WORK EXPERIENCES */}
        {activeTab === "experiences" && (
          <div className="mt-8 space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-[#EAE5D9]">
              <h2 className="text-xl font-extrabold text-[#1B2430]">Pengalaman Kerja</h2>
              <button
                onClick={() =>
                  setExperiences([
                    ...experiences,
                    {
                      id: String(Date.now()),
                      company: "Nama Perusahaan / Instansi",
                      location: "Lokasi",
                      period: "Periode",
                      role: "Posisi / Peran",
                      dotColor: "border-[#1E6B65] bg-[#1E6B65]",
                      bullets: ["Tugas & pencapaian 1", "Tugas 2"],
                    },
                  ])
                }
                className="bg-[#1E6B65] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase cursor-pointer"
              >
                + Tambah Pengalaman
              </button>
            </div>

            <div className="space-y-6">
              {experiences.map((exp, idx) => (
                <div key={exp.id} className="bg-white p-6 rounded-3xl border border-[#EAE5D9] shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-[#EAE5D9] pb-3">
                    <span className="text-xs font-mono font-bold text-[#1E6B65]">EXPERIENCE 0{idx + 1}</span>
                    <button
                      onClick={() => setExperiences(experiences.filter((e) => e.id !== exp.id))}
                      className="text-xs font-bold text-red-500 hover:underline cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-[#1B2430] mb-1">Perusahaan / Instansi</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => {
                          const updated = [...experiences];
                          updated[idx].company = e.target.value;
                          setExperiences(updated);
                        }}
                        className="w-full bg-[#FAF6EE] border border-[#EAE5D9] rounded-xl p-2.5 text-sm font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-[#1B2430] mb-1">Posisi / Role</label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => {
                          const updated = [...experiences];
                          updated[idx].role = e.target.value;
                          setExperiences(updated);
                        }}
                        className="w-full bg-[#FAF6EE] border border-[#EAE5D9] rounded-xl p-2.5 text-sm font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-[#1B2430] mb-1">Periode</label>
                      <input
                        type="text"
                        value={exp.period}
                        onChange={(e) => {
                          const updated = [...experiences];
                          updated[idx].period = e.target.value;
                          setExperiences(updated);
                        }}
                        className="w-full bg-[#FAF6EE] border border-[#EAE5D9] rounded-xl p-2.5 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#1B2430] mb-1">Detail Poin Tugas (pisahkan dengan baris baru)</label>
                    <textarea
                      rows={4}
                      value={exp.bullets.join("\n")}
                      onChange={(e) => {
                        const updated = [...experiences];
                        updated[idx].bullets = e.target.value.split("\n").filter(Boolean);
                        setExperiences(updated);
                      }}
                      className="w-full bg-[#FAF6EE] border border-[#EAE5D9] rounded-xl p-2.5 text-sm font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: BRANDS */}
        {activeTab === "brands" && (
          <div className="mt-8 bg-white p-8 rounded-3xl border border-[#EAE5D9] shadow-sm space-y-6">
            <h2 className="text-1xl font-extrabold text-[#1B2430]">Daftar 35+ Brand Partner Collaborations</h2>
            <p className="text-xs text-[#556070]">Pisahkan setiap nama brand dengan tanda koma (,)</p>

            <textarea
              rows={8}
              value={brandsText}
              onChange={(e) => setBrandsText(e.target.value)}
              className="w-full bg-[#FAF6EE] border border-[#EAE5D9] rounded-xl p-4 text-sm font-mono leading-relaxed"
            />
          </div>
        )}

        {/* TAB 5: CONTACT MESSAGES */}
        {activeTab === "messages" && (
          <div className="mt-8 space-y-6">
            <h2 className="text-xl font-extrabold text-[#1B2430]">Pesan Masuk dari Formulir Kontak</h2>

            {messages.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-[#EAE5D9] text-center text-sm text-[#556070]">
                Belum ada pesan masuk dari formulir kontak.
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div key={msg.id || idx} className="bg-white p-6 rounded-2xl border border-[#EAE5D9] space-y-2">
                    <div className="flex justify-between items-center text-xs text-[#556070]">
                      <span className="font-bold text-[#1B2430] text-sm">{msg.name}</span>
                      <span>{new Date(msg.created_at).toLocaleString("id-ID")}</span>
                    </div>
                    <p className="text-xs font-bold text-[#E75A3C]">{msg.email}</p>
                    <p className="text-sm text-[#1B2430] bg-[#FAF6EE] p-3 rounded-xl border border-[#EAE5D9]">
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: SUPABASE SQL SETUP */}
        {activeTab === "sql" && (
          <div className="mt-8 bg-white p-8 rounded-3xl border border-[#EAE5D9] space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-[#1B2430]">Cara Menyiapkan Tabel di Supabase (1 Menit)</h2>
              <p className="text-sm text-[#556070] mt-1 leading-relaxed">
                Database Supabase baru dibuat masih kosong (belum ada tabel `portfolio_content` & `contact_messages`).
                Salin skrip SQL di bawah ini dan jalankan di **Supabase Dashboard → SQL Editor → Run**:
              </p>
            </div>

            <div className="relative">
              <pre className="bg-[#1B2430] text-emerald-400 p-5 rounded-2xl text-xs font-mono overflow-x-auto">
                {SQL_SCHEMA_SCRIPT}
              </pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(SQL_SCHEMA_SCRIPT);
                  alert("Skrip SQL berhasil disalin ke clipboard! Buka SQL Editor di Supabase Dashboard lalu Paste dan Run.");
                }}
                className="absolute top-3 right-3 bg-[#1E6B65] text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer shadow-md hover:bg-[#E75A3C] transition-colors"
              >
                📋 Copy SQL Script
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
