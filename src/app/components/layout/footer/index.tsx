import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#FAF6EE] py-8 border-t border-[#EAE5D9] no-print">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-[#556070]">
        <Link href="/" className="flex items-center gap-1">
          <span className="font-script text-2xl font-bold text-[#1B2430]">
            Hodi
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#E75A3C] mt-1" />
        </Link>

        <p>&copy; {new Date().getFullYear()} Hodi Khodijah. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
