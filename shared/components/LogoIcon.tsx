import React from 'react';

interface LogoIconProps {
  className?: string;
  size?: number;
}

const LogoIcon: React.FC<LogoIconProps> = ({ className = "w-10 h-10", size }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={size ? { width: size, height: size } : {}}>
      <span className="text-xl font-black text-[#0F172A] dark:text-white relative z-10" style={size ? { fontSize: size * 0.5 } : {}}>A</span>
      <svg className="absolute w-full h-full" viewBox="0 0 100 100">
        <ellipse cx="50" cy="50" rx="45" ry="18" fill="none" stroke="#94A3B8" strokeWidth="2" transform="rotate(-30 50 50)" />
        <ellipse cx="50" cy="50" rx="45" ry="18" fill="none" stroke="#0F172A" className="dark:stroke-white" strokeWidth="3" transform="rotate(30 50 50)" />
      </svg>
    </div>
  );
};

export default LogoIcon;
