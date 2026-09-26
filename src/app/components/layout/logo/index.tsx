import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
        HK
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-lg text-black leading-none group-hover:text-primary transition-colors">
          HODI KHODIJAH
        </span>
        <span className="text-xs text-secondary font-medium tracking-wide">
          System Analyst & QA
        </span>
      </div>
    </Link>
  );
};

export default Logo;
