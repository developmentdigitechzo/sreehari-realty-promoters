import React from 'react';
import Link from 'next/link';

interface LotusIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const LotusIcon: React.FC<LotusIconProps> = ({ className = '', size = 'md' }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  return (
    <div className={`relative flex items-center justify-center ${iconSizes[size]} ${className}`}>
      <svg viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
        {/* Center Lotus Petal */}
        <path
          d="M50 5 C50 5 62 25 60 55 C55 70 50 78 50 78 C50 78 45 70 40 55 C38 25 50 5 50 5Z"
          fill="#108474"
        />
        {/* Left Petal */}
        <path
          d="M50 35 C42 20 22 25 18 45 C15 60 30 72 45 76 C46 65 48 50 50 35Z"
          fill="#149b88"
        />
        {/* Right Petal */}
        <path
          d="M50 35 C58 20 78 25 82 45 C85 60 70 72 55 76 C54 65 52 50 50 35Z"
          fill="#149b88"
        />
        {/* Outer Left Petal */}
        <path
          d="M38 52 C20 46 8 58 12 72 C16 80 32 82 42 78 C40 70 38 60 38 52Z"
          fill="#2dd4bf"
        />
        {/* Outer Right Petal */}
        <path
          d="M62 52 C80 46 92 58 88 72 C84 80 68 82 58 78 C60 70 62 60 62 52Z"
          fill="#2dd4bf"
        />
        {/* Base Green / Accessory Leaves */}
        <path
          d="M10 75 C25 85 45 82 50 78 C55 82 75 85 90 75 C80 88 58 89 50 85 C42 89 20 88 10 75Z"
          fill="#0c6a5d"
        />
        {/* Inner S-Monogram Stylized Accent */}
        <path
          d="M50 24 C46 24 43 27 43 30 C43 35 55 37 55 44 C55 49 50 52 46 51"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

interface BrandLogoProps {
  className?: string;
  isLight?: boolean;
  size?: 'sm' | 'md' | 'lg';
  iconOnly?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  isLight = false,
  size = 'md',
  iconOnly = false,
}) => {
  const textSizes = {
    sm: 'text-base font-bold tracking-tight',
    md: 'text-xl font-extrabold tracking-tight',
    lg: 'text-2xl font-black tracking-tight',
  };

  const subTextSizes = {
    sm: 'text-[9px] tracking-wider',
    md: 'text-[11px] tracking-widest',
    lg: 'text-xs tracking-widest',
  };

  if (iconOnly) {
    return <LotusIcon size={size} className={className} />;
  }

  return (
    <Link href="/" className={`inline-flex items-center gap-3 transition-opacity hover:opacity-95 ${className}`}>
      {/* Brand Lotus Vector Icon */}
      <LotusIcon size={size} />

      {/* Brand Text */}
      <div className="flex flex-col">
        <span
          className={`${textSizes[size]} leading-none ${
            isLight ? 'text-white' : 'text-slate-900'
          } font-heading uppercase`}
        >
          Sree Hari
        </span>
        <span
          className={`${subTextSizes[size]} font-semibold leading-tight mt-0.5 uppercase ${
            isLight ? 'text-emerald-300' : 'text-[#108474] font-bold'
          }`}
        >
          Realty Promoters
        </span>
      </div>
    </Link>
  );
};
