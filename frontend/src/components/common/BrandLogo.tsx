import React from 'react';
import Link from 'next/link';

interface LotusIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const LotusIcon: React.FC<LotusIconProps> = ({ className = '', size = 'md' }) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]} ${className}`}>
      {/* Official Sree Hari Realty Lotus Crest matching PDF Asset */}
      <svg
        viewBox="0 0 120 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full filter drop-shadow-sm select-none"
      >
        {/* Center Main Lotus Petal (Vibrant Magenta #D4145A / #D81B60) */}
        <path
          d="M60 4 C60 4 75 22 72 56 C68 71 60 78 60 78 C60 78 52 71 48 56 C45 22 60 4 60 4Z"
          fill="#D81B60"
        />

        {/* Inner Left Petal */}
        <path
          d="M60 38 C49 20 28 26 24 46 C20 62 38 73 54 77 C55 66 57 52 60 38Z"
          fill="#E91E63"
        />

        {/* Inner Right Petal */}
        <path
          d="M60 38 C71 20 92 26 96 46 C100 62 82 73 66 77 C65 66 63 52 60 38Z"
          fill="#E91E63"
        />

        {/* Outer Left Low Petal */}
        <path
          d="M44 54 C22 47 6 60 12 74 C17 83 36 84 48 80 C46 72 44 63 44 54Z"
          fill="#D81B60"
        />

        {/* Outer Right Low Petal */}
        <path
          d="M76 54 C98 47 114 60 108 74 C103 83 84 84 72 80 C74 72 76 63 76 54Z"
          fill="#D81B60"
        />

        {/* Base Curving Fresh Green Leaves (#6BB324 / #5CB826) */}
        <path
          d="M8 73 C26 86 52 83 60 78 C68 83 94 86 112 73 C98 90 70 91 60 86 C50 91 22 90 8 73Z"
          fill="#6BB324"
        />

        {/* Stylized White "S" Calligraphic Monogram in Central Petal */}
        <path
          d="M60 18 C54 18 49 22 49 27 C49 34 66 38 66 48 C66 56 58 61 50 59 C46 58 43 55 42 51 M58 48 C58 44 50 40 50 33 C50 28 55 25 60 25 C63 25 65 26 66 28"
          stroke="#FFFFFF"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="61" cy="18" r="2.2" fill="#FFFFFF" />
        <circle cx="43" cy="51" r="2.2" fill="#FFFFFF" />
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
  const titleSizes = {
    sm: 'text-base font-black tracking-tight',
    md: 'text-xl font-black tracking-tight',
    lg: 'text-2xl sm:text-3xl font-black tracking-tight',
  };

  const subTextSizes = {
    sm: 'text-[9px] tracking-widest font-black',
    md: 'text-[11px] tracking-widest font-black',
    lg: 'text-xs tracking-widest font-black',
  };

  if (iconOnly) {
    return <LotusIcon size={size} className={className} />;
  }

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 sm:gap-3 transition-opacity hover:opacity-95 group ${className}`}
    >
      {/* Official Sree Hari Realty Logo Lotus Crest */}
      <LotusIcon size={size} />

      {/* Official Logo Typography Matching Header (SREE HARI & REALTY PROMOTERS in Bold Red) */}
      <div className="flex flex-col justify-center select-none">
        <span
          className={`${titleSizes[size]} font-heading uppercase leading-none text-[#E52E3D] drop-shadow-sm`}
        >
          Sree Hari
        </span>
        <span
          className={`${subTextSizes[size]} uppercase leading-tight mt-0.5 text-[#E52E3D]`}
        >
          Realty Promoters
        </span>
      </div>
    </Link>
  );
};
