import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-[0.675rem] select-none transition-all hover:opacity-90 duration-200 cursor-pointer ${className}`}>
      {/* Logo Icon: Perfect Purple Circle with White Checkmark (Matching the uploaded image) */}
      <div className="shrink-0 w-[29px] h-[29px] md:w-[36px] md:h-[36px] lg:w-[40px] lg:h-[40px]">
        <svg 
          viewBox="0 0 40 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <circle cx="20" cy="20" r="20" fill="#4f46e5" />
          <path 
            d="M11 20L17 26L29 14" 
            stroke="white" 
            strokeWidth="4.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      </div>
      
      {/* Logo Text: Matching colors and bold typography from the image */}
      <div className="flex items-baseline font-bold tracking-tight leading-none">
        <span className="text-[18px] md:text-[21.6px] lg:text-[27px] text-slate-800">Kritik</span>
        <span className="text-[18px] md:text-[21.6px] lg:text-[27px] text-blue-600">Soru</span>
        <span className="text-[18px] md:text-[21.6px] lg:text-[27px] text-slate-800">.com</span>
      </div>
    </div>
  );
};

export default Logo;