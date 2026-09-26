"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { defaultPortfolioData, supabase } from "@/lib/supabase";

interface PortfolioContextType {
  profile: typeof defaultPortfolioData.profile;
  projects: typeof defaultPortfolioData.projects;
  experiences: typeof defaultPortfolioData.experiences;
  brands: string[];
  loading: boolean;
  refreshData: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType>({
  profile: defaultPortfolioData.profile,
  projects: defaultPortfolioData.projects,
  experiences: defaultPortfolioData.experiences,
  brands: defaultPortfolioData.brands,
  loading: true,
  refreshData: async () => {},
});

export const PortfolioProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState(defaultPortfolioData.profile);
  const [projects, setProjects] = useState(defaultPortfolioData.projects);
  const [experiences, setExperiences] = useState(defaultPortfolioData.experiences);
  const [brands, setBrands] = useState(defaultPortfolioData.brands);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    // 1. Try reading local storage override
    if (typeof window !== "undefined") {
      const local = localStorage.getItem("hodi_portfolio_override");
      if (local) {
        try {
          const parsed = JSON.parse(local);
          if (parsed.profile) setProfile(parsed.profile);
          if (parsed.projects) setProjects(parsed.projects);
          if (parsed.experiences) setExperiences(parsed.experiences);
          if (parsed.brands) setBrands(parsed.brands);
        } catch (e) {
          console.error("Parse error", e);
        }
      }
    }

    // 2. Fetch from Supabase
    try {
      const { data, error } = await supabase.from("portfolio_content").select("*").eq("id", "main").single();
      if (data && data.data) {
        const content = data.data;
        if (content.profile) setProfile(content.profile);
        if (content.projects) setProjects(content.projects);
        if (content.experiences) setExperiences(content.experiences);
        if (content.brands) setBrands(content.brands);
      }
    } catch (err) {
      console.warn("Supabase fetch notice in context:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Listen to storage events if changed in another tab (like /admin)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "hodi_portfolio_override") {
        loadData();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        profile,
        projects,
        experiences,
        brands,
        loading,
        refreshData: loadData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);
