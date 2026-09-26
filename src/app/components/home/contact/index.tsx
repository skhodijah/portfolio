"use client";

import { useState } from "react";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("https://formsubmit.co/ajax/skhodijah369@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
      }
    } catch (error) {
      console.error("Form submit error:", error);
    }
  };

  return (
    <section id="contact" className="py-24 bg-white border-b border-[#EAE5D9]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left Column: Big Headline & "saying hi" link */}
          <div className="lg:col-span-7 space-y-8">
            <h2 className="text-4xl sm:text-6xl font-extrabold text-[#1B2430] leading-[1.15] tracking-tight">
              Let’s make something<br />
              amazing together.
            </h2>

            <div>
              <p className="text-2xl font-bold text-[#1B2430]">
                Start by{" "}
                <a
                  href="mailto:skhodijah369@gmail.com"
                  className="text-[#E75A3C] border-b-2 border-[#E75A3C] hover:opacity-80 transition-opacity"
                >
                  saying hi
                </a>
              </p>
            </div>

            {/* Quick Contact Form */}
            <div className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
                <div>
                  <input
                    required
                    type="text"
                    placeholder="Your Name *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#FAF6EE] border border-[#EAE5D9] rounded-xl p-3.5 text-sm focus:border-[#1E6B65] focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    required
                    type="email"
                    placeholder="Your Email *"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#FAF6EE] border border-[#EAE5D9] rounded-xl p-3.5 text-sm focus:border-[#1E6B65] focus:outline-none"
                  />
                </div>
                <div>
                  <textarea
                    required
                    rows={3}
                    placeholder="Your Message *"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#FAF6EE] border border-[#EAE5D9] rounded-xl p-3.5 text-sm focus:border-[#1E6B65] focus:outline-none"
                  />
                </div>

                {submitted && (
                  <p className="text-xs font-bold text-[#1E6B65] p-2 bg-[#FAF6EE] rounded-lg">
                    ✓ Thank you! Your message has been sent to skhodijah369@gmail.com
                  </p>
                )}

                <button
                  type="submit"
                  className="bg-[#1B2430] text-white hover:bg-[#1E6B65] transition-colors font-bold text-xs uppercase tracking-wider px-7 py-3.5 rounded-full cursor-pointer"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Binjan Information Widget & Navigation */}
          <div className="lg:col-span-5 space-y-10 lg:pl-8">
            <div className="space-y-2">
              <h3 className="text-sm font-extrabold text-[#1B2430] uppercase tracking-wider">
                Information
              </h3>
              <p className="text-sm text-[#556070] font-medium">
                Meruya, West Jakarta, Indonesia
              </p>
              <div className="pt-2 text-sm font-bold text-[#1B2430] space-y-1">
                <p>
                  <a href="mailto:skhodijah369@gmail.com" className="hover:text-[#E75A3C]">
                    skhodijah369@gmail.com
                  </a>
                </p>
                <p>
                  <a href="tel:+6285778918137" className="hover:text-[#E75A3C]">
                    +62 857 7891 8137
                  </a>
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-[#EAE5D9]">
              <h4 className="text-xs font-bold text-[#556070] uppercase tracking-wider">
                Navigation
              </h4>
              <div className="flex flex-col gap-2 text-xs font-bold text-[#1B2430] uppercase">
                <a href="#services" className="hover:text-[#1E6B65] transition-colors">
                  ( SERVICES )
                </a>
                <a href="#projects" className="hover:text-[#1E6B65] transition-colors">
                  WORKS
                </a>
                <a href="#experience" className="hover:text-[#1E6B65] transition-colors">
                  EXPERIENCE
                </a>
                <a href="#beyond-tech" className="hover:text-[#1E6B65] transition-colors">
                  BEYOND TECH
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold text-[#1B2430] uppercase pt-2">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E75A3C]"
              >
                LinkedIn ↗
              </a>
              <span>/</span>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E75A3C]"
              >
                GitHub ↗
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
