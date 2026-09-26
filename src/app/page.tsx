import AboutMe from "./components/home/about-me";
import Contact from "./components/home/contact";
import CreativeSection from "./components/home/creative-section";
import EducationSkills from "./components/home/education-skills";
import ExperienceSec from "./components/home/experience-sec";
import HeroSection from "./components/home/hero-section";
import ContactBar from "./components/home/hero-section/contact-bar";
import LatestWork from "./components/home/latest-work";
import Expertise from "./components/home/what-i-do";

export default function Home() {
  return (
    <main className="overflow-hidden">
      <HeroSection />
      <ContactBar />
      <AboutMe />
      <Expertise />
      <LatestWork />
      <ExperienceSec />
      <EducationSkills />
      <CreativeSection />
      <Contact />
    </main>
  );
}