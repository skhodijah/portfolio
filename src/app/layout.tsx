import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Caveat } from "next/font/google";
import "./globals.css";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";

const sansFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const scriptFont = Caveat({
  subsets: ["latin"],
  variable: "--font-script",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hodi Khodijah — Information Systems × QA × Creative",
  description:
    "Personal portfolio of Hodi Khodijah — Information Systems graduate specializing in System Analysis, Software Quality Assurance, Full Stack Development, and Digital Content Creation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sansFont.variable} ${scriptFont.variable} scroll-smooth`}>
      <body className="bg-[#FAF6EE] text-[#1B2430] font-sans antialiased selection:bg-[#008080] selection:text-white">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
