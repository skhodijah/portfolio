"use client";

import { useEffect, useRef, useState } from "react";
import { defaultPortfolioData, supabase, uploadImageToSupabase } from "@/lib/supabase";
import Image from "next/image";
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

-- Storage bucket: run this in Supabase SQL Editor
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT DO NOTHING;

ALTER TABLE portfolio_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Portfolio" ON portfolio_content FOR SELECT USING (true);
CREATE POLICY "Public Insert Portfolio" ON portfolio_content FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Portfolio" ON portfolio_content FOR UPDATE USING (true);

CREATE POLICY "Public Insert Messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Select Messages" ON contact_messages FOR SELECT USING (true);

-- Storage policies
CREATE POLICY "Public Upload Images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio-images');
CREATE POLICY "Public Read Images" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-images');
CREATE POLICY "Public Update Images" ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio-images');
`;

// ---- Reusable Single Image Upload Widget ----
function ImageUploadBox({
  label,
  currentUrl,
  onUploaded,
  folder,
}: {
  label: string;
  currentUrl: string;
  onUploaded: (url: string) => void;
  folder: "avatars" | "projects";
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("File terlalu besar (maks 5MB)");
      return;
    }
    setError("");
    setUploading(true);
    const url = await uploadImageToSupabase(file, folder);
    if (url) {
      onUploaded(url);
    } else {
      setError("Upload gagal. Pastikan bucket 'portfolio-images' sudah dibuat di Supabase Storage.");
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold uppercase text-[#1B2430]">{label}</label>

      {currentUrl ? (
        <div className="relative w-full h-44 rounded-2xl overflow-hidden border-2 border-[#1E6B65] bg-[#FAF6EE]">
          <Image src={currentUrl} alt="Preview" fill className="object-cover" unoptimized />
          <button
            onClick={() => onUploaded("")}
            className="absolute top-2 right-2 bg-[#E75A3C] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow cursor-pointer"
          >
            Hapus
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="w-full h-44 rounded-2xl border-2 border-dashed border-[#EAE5D9] bg-[#FAF6EE] flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#1E6B65] transition-colors group"
        >
          <svg className="w-8 h-8 fill-[#EAE5D9] group-hover:fill-[#1E6B65] transition-colors" viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
          </svg>
          <span className="text-xs font-bold text-[#556070]">Klik untuk upload foto</span>
          <span className="text-[10px] text-[#556070]">PNG, JPG, WEBP — maks 5MB</span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full py-2.5 rounded-xl bg-[#1E6B65] text-white text-xs font-bold uppercase tracking-wider cursor-pointer disabled:opacity-50 hover:opacity-90 transition-opacity"
      >
        {uploading ? "Mengupload..." : currentUrl ? "Ganti Foto" : "Upload Foto"}
      </button>

      {error && <p className="text-xs text-[#E75A3C] font-bold">{error}</p>}
    </div>
  );
}

// ---- Multi Image Upload Widget for Projects (Carousel Support) ----
function MultiImageUploadBox({
  label,
  imageUrls = [],
  onChange,
}: {
  label: string;
  imageUrls: string[];
  onChange: (urls: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setError("");
    setUploading(true);

    const uploadedUrls: string[] = [];
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        setError(`File ${file.name} terlalu besar (>5MB), dilewati.`);
        continue;
      }
      const url = await uploadImageToSupabase(file, "projects");
      if (url) {
        uploadedUrls.push(url);
      }
    }

    if (uploadedUrls.length > 0) {
      onChange([...imageUrls, ...uploadedUrls]);
    } else if (!error) {
      setError("Gagal upload foto. Pastikan bucket 'portfolio-images' sudah aktif di Supabase.");
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeImage = (indexToRemove: number) => {
    onChange(imageUrls.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="block text-xs font-bold uppercase text-[#1B2430]">
          {label} ({imageUrls.length} Foto)
        </label>
        <span className="text-[11px] text-[#556070] font-medium">Bisa upload banyak foto sekaligus untuk Carousel</span>
      </div>

      {/* Grid Previews */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {imageUrls.map((url, idx) => (
          <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[#EAE5D9] bg-[#FAF6EE] group">
            <Image src={url} alt={`Project ${idx + 1}`} fill className="object-cover" unoptimized />
            <button
              onClick={() => removeImage(idx)}
              className="absolute top-1.5 right-1.5 bg-[#E75A3C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full opacity-90 hover:opacity-100 cursor-pointer shadow-xs"
            >
              Hapus
            </button>
            <div className="absolute bottom-1 left-1.5 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
              #{idx + 1}
            </div>
          </div>
        ))}

        {/* Add Button Box */}
        <div
          onClick={() => inputRef.current?.click()}
          className="aspect-[4/3] rounded-xl border-2 border-dashed border-[#EAE5D9] bg-[#FAF6EE] flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#1E6B65] hover:bg-white transition-all group"
        >
          <svg className="w-6 h-6 fill-[#556070] group-hover:fill-[#1E6B65] transition-colors" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          <span className="text-[11px] font-bold text-[#556070] group-hover:text-[#1E6B65]">+ Tambah Foto</span>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFilesChange}
        className="hidden"
      />

      {uploading && <p className="text-xs text-[#1E6B65] font-bold animate-pulse">Sedang mengupload foto-foto...</p>}
      {error && <p className="text-xs text-[#E75A3C] font-bold">{error}</p>}
    </div>
  );
}

// ---- Main Admin Page ----
export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState<"profile" | "projects" | "experiences" | "brands" | "messages" | "sql">("profile");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [profile, setProfile] = useState(defaultPortfolioData.profile);
  const [projects, setProjects] = useState(defaultPortfolioData.projects);
  const [experiences, setExperiences] = useState(defaultPortfolioData.experiences);
  const [brandsText, setBrandsText] = useState(defaultPortfolioData.brands.join(", "));
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (localStorage.getItem("hodi_admin_auth") === "true") setIsAuthenticated(true);
    loadData();
  }, []);

  const loadData = async () => {
    const local = localStorage.getItem("hodi_portfolio_override");
    if (local) {
      try {
        const p = JSON.parse(local);
        if (p.profile) setProfile(p.profile);
        if (p.projects) setProjects(p.projects);
        if (p.experiences) setExperiences(p.experiences);
        if (p.brands) setBrandsText(p.brands.join(", "));
      } catch {}
    }
    try {
      const { data } = await supabase.from("portfolio_content").select("*").eq("id", "main").single();
      if (data?.data) {
        const c = data.data;
        if (c.profile) setProfile(c.profile);
        if (c.projects) setProjects(c.projects);
        if (c.experiences) setExperiences(c.experiences);
        if (c.brands) setBrandsText(c.brands.join(", "));
      }
    } catch {}
    try {
      const { data: msgs } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
      if (msgs) setMessages(msgs);
    } catch {}
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (["admin", "hodi2026", "123456"].includes(passcode)) {
      setIsAuthenticated(true);
      localStorage.setItem("hodi_admin_auth", "true");
    } else {
      setLoginError("Passcode salah! Gunakan 'admin' atau 'hodi2026'");
    }
  };

  const buildFullData = () => ({
    profile,
    projects,
    experiences,
    brands: brandsText.split(",").map((b) => b.trim()).filter(Boolean),
  });

  const handleSaveAll = async () => {
    setSaving(true);
    setSaveStatus(null);
    const fullData = buildFullData();
    localStorage.setItem("hodi_portfolio_override", JSON.stringify(fullData));

    try {
      const { error } = await supabase.from("portfolio_content").upsert({
        id: "main",
        data: fullData,
        updated_at: new Date().toISOString(),
      });
      setSaveStatus({
        type: error ? "error" : "success",
        text: error
          ? `Tersimpan Lokal. Supabase: ${error.message} (jalankan SQL Setup dulu)`
          : "Berhasil disimpan ke Supabase Cloud & Lokal!",
      });
    } catch {
      setSaveStatus({ type: "success", text: "Tersimpan di Lokal Browser!" });
    } finally {
      setSaving(false);
    }
  };

  const handleSeedSupabase = async () => {
    setSaving(true);
    const fullData = buildFullData();
    try {
      const { error } = await supabase.from("portfolio_content").upsert({
        id: "main", data: fullData, updated_at: new Date().toISOString(),
      });
      setSaveStatus({
        type: error ? "error" : "success",
        text: error
          ? `Gagal seed: ${error.message} — Jalankan SQL Setup di Supabase SQL Editor dulu!`
          : "🎉 Seed Supabase berhasil! Data sudah masuk ke database.",
      });
    } catch (err: any) {
      setSaveStatus({ type: "error", text: "Error: " + err.message });
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
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Passcode (e.g. admin)"
              className="w-full bg-[#FAF6EE] border border-[#EAE5D9] rounded-xl p-3 text-sm font-medium focus:border-[#1E6B65] focus:outline-none"
            />
            {loginError && <p className="text-xs text-[#E75A3C] font-bold text-center">{loginError}</p>}
            <button type="submit" className="w-full bg-[#1B2430] text-white hover:bg-[#1E6B65] transition-colors py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer">
              Masuk Dashboard
            </button>
          </form>
          <div className="text-center">
            <Link href="/" className="text-xs font-bold text-[#556070] hover:text-[#E75A3C]">← Kembali ke Website</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1B2430] font-sans pb-24">
      {/* Header */}
      <header className="bg-white border-b border-[#EAE5D9] sticky top-0 z-40 py-4 px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-script text-3xl font-bold text-[#1B2430]">Hodi</span>
            <span className="text-xs font-bold bg-[#1E6B65] text-white px-3 py-1 rounded-full uppercase">Admin Panel</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold flex-wrap">
            <button onClick={handleSeedSupabase} disabled={saving} className="bg-[#1E6B65] text-white px-4 py-2.5 rounded-full cursor-pointer disabled:opacity-50 hover:opacity-90">
              🌱 Push ke Supabase
            </button>
            <button onClick={handleSaveAll} disabled={saving} className="bg-[#E75A3C] text-white px-5 py-2.5 rounded-full cursor-pointer disabled:opacity-50 hover:opacity-90">
              {saving ? "Saving..." : "💾 Simpan Perubahan"}
            </button>
            <Link href="/" target="_blank" className="border border-[#1B2430] px-4 py-2 rounded-full hover:bg-[#1B2430] hover:text-white transition-colors">
              Lihat Website ↗
            </Link>
            <button onClick={() => { setIsAuthenticated(false); localStorage.removeItem("hodi_admin_auth"); }} className="text-[#556070] hover:text-[#E75A3C] cursor-pointer">
              Keluar
            </button>
          </div>
        </div>
      </header>

      {saveStatus && (
        <div className="max-w-6xl mx-auto px-6 pt-6">
          <div className={`p-4 rounded-2xl text-xs font-bold flex justify-between items-center ${saveStatus.type === "error" ? "bg-red-50 border border-red-200 text-red-800" : "bg-emerald-50 border border-emerald-200 text-emerald-800"}`}>
            <span>{saveStatus.text}</span>
            <button onClick={() => setSaveStatus(null)}>✕</button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 pt-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-[#EAE5D9] pb-4">
          {[
            { id: "profile", label: "👤 Profile & Foto" },
            { id: "projects", label: `🚀 Projects (${projects.length})` },
            { id: "experiences", label: "💼 Experience" },
            { id: "brands", label: "🛍️ Brands" },
            { id: "messages", label: `📩 Messages (${messages.length})` },
            { id: "sql", label: "⚡ SQL Setup" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase cursor-pointer transition-all ${activeTab === tab.id ? "bg-[#1B2430] text-white" : "bg-white text-[#556070] border border-[#EAE5D9] hover:text-[#1B2430]"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB: PROFILE */}
        {activeTab === "profile" && (
          <div className="mt-8 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-[#EAE5D9] shadow-sm">
              <h2 className="text-lg font-extrabold text-[#1B2430] mb-6">Foto Profil (Hero Section)</h2>
              <div className="max-w-sm">
                <ImageUploadBox
                  label="Foto Profil / Avatar"
                  currentUrl={profile.avatarUrl || ""}
                  folder="avatars"
                  onUploaded={(url) => setProfile({ ...profile, avatarUrl: url })}
                />
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[#EAE5D9] shadow-sm space-y-6">
              <h2 className="text-lg font-extrabold text-[#1B2430]">Informasi & Teks</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { label: "Nama Lengkap", key: "name", type: "text" },
                  { label: "Email", key: "email", type: "email" },
                  { label: "Telepon / WhatsApp", key: "phone", type: "text" },
                  { label: "Lokasi", key: "location", type: "text" },
                  { label: "LinkedIn URL", key: "linkedinUrl", type: "url" },
                  { label: "GitHub URL", key: "githubUrl", type: "url" },
                ].map(({ label, key, type }) => (
                  <div key={key}>
                    <label className="block text-xs font-bold uppercase text-[#1B2430] mb-1">{label}</label>
                    <input
                      type={type}
                      value={(profile as any)[key] || ""}
                      onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                      className="w-full bg-[#FAF6EE] border border-[#EAE5D9] rounded-xl p-3 text-sm font-medium focus:border-[#1E6B65] focus:outline-none"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#EAE5D9] space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#1B2430] mb-1">Hero Headline</label>
                  <input type="text" value={profile.headline} onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                    className="w-full bg-[#FAF6EE] border border-[#EAE5D9] rounded-xl p-3 text-sm font-medium focus:border-[#1E6B65] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#1B2430] mb-1">Hero Tagline</label>
                  <input type="text" value={profile.tagline} onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                    className="w-full bg-[#FAF6EE] border border-[#EAE5D9] rounded-xl p-3 text-sm font-medium focus:border-[#1E6B65] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#1B2430] mb-1">Hero Quote</label>
                  <textarea rows={2} value={profile.heroQuote} onChange={(e) => setProfile({ ...profile, heroQuote: e.target.value })}
                    className="w-full bg-[#FAF6EE] border border-[#EAE5D9] rounded-xl p-3 text-sm focus:border-[#1E6B65] focus:outline-none" />
                </div>
              </div>

              <div className="pt-4 border-t border-[#EAE5D9] space-y-4">
                <h3 className="text-sm font-bold uppercase text-[#1B2430]">About Me Paragraphs</h3>
                {["aboutParagraph1", "aboutParagraph2", "aboutParagraph3", "aboutParagraph4"].map((key, i) => (
                  <div key={key}>
                    <label className="block text-xs font-bold text-[#556070] mb-1">Paragraf {i + 1}</label>
                    <textarea rows={2} value={(profile as any)[key]} onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                      className="w-full bg-[#FAF6EE] border border-[#EAE5D9] rounded-xl p-3 text-sm focus:border-[#1E6B65] focus:outline-none" />
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#EAE5D9] grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#1B2430] mb-1">IPK S1 (UNPAM)</label>
                  <input type="text" value={profile.gpaUnpam} onChange={(e) => setProfile({ ...profile, gpaUnpam: e.target.value })}
                    className="w-full bg-[#FAF6EE] border border-[#EAE5D9] rounded-xl p-3 text-sm font-bold focus:border-[#1E6B65] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#1B2430] mb-1">IPK PMM 4 (Undiksha)</label>
                  <input type="text" value={profile.gpaUndiksha} onChange={(e) => setProfile({ ...profile, gpaUndiksha: e.target.value })}
                    className="w-full bg-[#FAF6EE] border border-[#EAE5D9] rounded-xl p-3 text-sm font-bold focus:border-[#1E6B65] focus:outline-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: PROJECTS */}
        {activeTab === "projects" && (
          <div className="mt-8 space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-[#EAE5D9]">
              <h2 className="text-xl font-extrabold text-[#1B2430]">Proyek Portofolio</h2>
              <button
                onClick={() => setProjects([...projects, { id: String(Date.now()), title: "Proyek Baru", subtitle: "Deskripsi singkat", bgColor: "bg-[#1E6B65] text-white", image: "/images/work/work-img-1.jpg", imageUrls: [], tags: ["Laravel", "PHP"], description: "Deskripsi proyek..." }])}
                className="bg-[#1E6B65] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase cursor-pointer"
              >
                + Tambah Proyek
              </button>
            </div>

            <div className="space-y-6">
              {projects.map((proj, idx) => (
                <div key={proj.id} className="bg-white p-6 rounded-3xl border border-[#EAE5D9] shadow-sm space-y-5">
                  <div className="flex justify-between items-center border-b border-[#EAE5D9] pb-3">
                    <span className="text-xs font-mono font-bold text-[#E75A3C]">PROJECT 0{idx + 1}</span>
                    <button onClick={() => setProjects(projects.filter((p) => p.id !== proj.id))} className="text-xs font-bold text-red-500 hover:underline cursor-pointer">
                      Hapus Proyek
                    </button>
                  </div>

                  {/* Multi-Image Upload Widget */}
                  <MultiImageUploadBox
                    label="Galeri Foto Proyek (Carousel)"
                    imageUrls={(proj as any).imageUrls || []}
                    onChange={(urls) => {
                      const updated = [...projects];
                      updated[idx] = { ...updated[idx], imageUrls: urls };
                      setProjects(updated);
                    }}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-[#1B2430] mb-1">Judul Proyek</label>
                      <input type="text" value={proj.title}
                        onChange={(e) => { const u = [...projects]; u[idx] = { ...u[idx], title: e.target.value }; setProjects(u); }}
                        className="w-full bg-[#FAF6EE] border border-[#EAE5D9] rounded-xl p-2.5 text-sm font-bold focus:border-[#1E6B65] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-[#1B2430] mb-1">Sub-Judul</label>
                      <input type="text" value={proj.subtitle}
                        onChange={(e) => { const u = [...projects]; u[idx] = { ...u[idx], subtitle: e.target.value }; setProjects(u); }}
                        className="w-full bg-[#FAF6EE] border border-[#EAE5D9] rounded-xl p-2.5 text-sm font-medium focus:border-[#1E6B65] focus:outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#1B2430] mb-1">Deskripsi</label>
                    <textarea rows={3} value={proj.description}
                      onChange={(e) => { const u = [...projects]; u[idx] = { ...u[idx], description: e.target.value }; setProjects(u); }}
                      className="w-full bg-[#FAF6EE] border border-[#EAE5D9] rounded-xl p-2.5 text-sm focus:border-[#1E6B65] focus:outline-none" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#1B2430] mb-1">Tags (pisahkan koma)</label>
                    <input type="text" value={proj.tags.join(", ")}
                      onChange={(e) => { const u = [...projects]; u[idx] = { ...u[idx], tags: e.target.value.split(",").map((t) => t.trim()) }; setProjects(u); }}
                      className="w-full bg-[#FAF6EE] border border-[#EAE5D9] rounded-xl p-2.5 text-sm focus:border-[#1E6B65] focus:outline-none" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: EXPERIENCES */}
        {activeTab === "experiences" && (
          <div className="mt-8 space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-[#EAE5D9]">
              <h2 className="text-xl font-extrabold text-[#1B2430]">Pengalaman Kerja</h2>
              <button
                onClick={() => setExperiences([...experiences, { id: String(Date.now()), company: "Nama Instansi", location: "Lokasi", period: "Periode", role: "Posisi", dotColor: "border-[#1E6B65] bg-[#1E6B65]", bullets: ["Tugas 1", "Tugas 2"] }])}
                className="bg-[#1E6B65] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase cursor-pointer"
              >
                + Tambah
              </button>
            </div>

            <div className="space-y-6">
              {experiences.map((exp, idx) => (
                <div key={exp.id} className="bg-white p-6 rounded-3xl border border-[#EAE5D9] shadow-sm space-y-4">
                  <div className="flex justify-between border-b border-[#EAE5D9] pb-3">
                    <span className="text-xs font-mono font-bold text-[#1E6B65]">EXPERIENCE 0{idx + 1}</span>
                    <button onClick={() => setExperiences(experiences.filter((e) => e.id !== exp.id))} className="text-xs font-bold text-red-500 hover:underline cursor-pointer">Hapus</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { label: "Perusahaan / Instansi", key: "company" },
                      { label: "Posisi / Role", key: "role" },
                      { label: "Periode", key: "period" },
                    ].map(({ label, key }) => (
                      <div key={key}>
                        <label className="block text-xs font-bold uppercase text-[#1B2430] mb-1">{label}</label>
                        <input type="text" value={(exp as any)[key]}
                          onChange={(e) => { const u = [...experiences]; (u[idx] as any)[key] = e.target.value; setExperiences(u); }}
                          className="w-full bg-[#FAF6EE] border border-[#EAE5D9] rounded-xl p-2.5 text-sm focus:border-[#1E6B65] focus:outline-none" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#1B2430] mb-1">Detail Tugas (baris baru per poin)</label>
                    <textarea rows={4} value={exp.bullets.join("\n")}
                      onChange={(e) => { const u = [...experiences]; u[idx].bullets = e.target.value.split("\n").filter(Boolean); setExperiences(u); }}
                      className="w-full bg-[#FAF6EE] border border-[#EAE5D9] rounded-xl p-2.5 text-sm font-mono focus:border-[#1E6B65] focus:outline-none" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: BRANDS */}
        {activeTab === "brands" && (
          <div className="mt-8 bg-white p-8 rounded-3xl border border-[#EAE5D9] shadow-sm space-y-4">
            <h2 className="text-xl font-extrabold text-[#1B2430]">Brand Partner Collaborations</h2>
            <p className="text-xs text-[#556070]">Pisahkan setiap brand dengan koma (,)</p>
            <textarea rows={8} value={brandsText} onChange={(e) => setBrandsText(e.target.value)}
              className="w-full bg-[#FAF6EE] border border-[#EAE5D9] rounded-xl p-4 text-sm font-mono leading-relaxed focus:border-[#1E6B65] focus:outline-none" />
          </div>
        )}

        {/* TAB: MESSAGES */}
        {activeTab === "messages" && (
          <div className="mt-8 space-y-6">
            <h2 className="text-xl font-extrabold text-[#1B2430]">Pesan Masuk</h2>
            {messages.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-[#EAE5D9] text-center text-sm text-[#556070]">
                Belum ada pesan masuk.
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div key={msg.id || idx} className="bg-white p-6 rounded-2xl border border-[#EAE5D9] space-y-2">
                    <div className="flex justify-between text-xs text-[#556070]">
                      <span className="font-bold text-[#1B2430] text-sm">{msg.name}</span>
                      <span>{new Date(msg.created_at).toLocaleString("id-ID")}</span>
                    </div>
                    <p className="text-xs font-bold text-[#E75A3C]">{msg.email}</p>
                    <p className="text-sm bg-[#FAF6EE] p-3 rounded-xl border border-[#EAE5D9]">{msg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: SQL SETUP */}
        {activeTab === "sql" && (
          <div className="mt-8 bg-white p-8 rounded-3xl border border-[#EAE5D9] space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-[#1B2430]">Setup Supabase Database & Storage</h2>
              <p className="text-sm text-[#556070] mt-1 leading-relaxed">
                Jalankan skrip SQL ini di <strong>Supabase Dashboard → SQL Editor → Run</strong> untuk membuat tabel & storage bucket. Setelah itu, buka <strong>Storage → portfolio-images → Settings → Public</strong>.
              </p>
            </div>
            <div className="relative">
              <pre className="bg-[#1B2430] text-emerald-400 p-5 rounded-2xl text-xs font-mono overflow-x-auto">
                {SQL_SCHEMA_SCRIPT}
              </pre>
              <button
                onClick={() => { navigator.clipboard.writeText(SQL_SCHEMA_SCRIPT); alert("Disalin! Paste ke Supabase SQL Editor lalu klik Run."); }}
                className="absolute top-3 right-3 bg-[#1E6B65] text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer hover:bg-[#E75A3C] transition-colors"
              >
                📋 Copy SQL
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
