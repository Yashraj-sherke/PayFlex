import type { SVGProps } from 'react';

export function PayFlexBagIcon({ className = 'h-10 w-10', ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Back Handle (leaning right) */}
      <path
        d="M 52 46 C 45 18 52 8 66 8 C 77 8 83 20 83 41"
        stroke="#22474b"
        strokeWidth="4.8"
        strokeLinecap="round"
        fill="none"
      />

      {/* Front Handle (leaning right) */}
      <path
        d="M 39 49 C 33 22 40 11 53 11 C 65 11 70 23 70 44"
        stroke="#275055"
        strokeWidth="4.8"
        strokeLinecap="round"
        fill="none"
      />

      {/* 3D Side Shadow Face (Right Wedge) */}
      <polygon
        points="84,41 101,92 73,107"
        fill="#1a373b"
      />

      {/* Front Bag Face (Wide angled trapezoid) */}
      <polygon
        points="28,49 84,41 73,107 14,94"
        fill="#264e53"
      />

      {/* Top Rim Highlight */}
      <line
        x1="28"
        y1="49"
        x2="84"
        y2="41"
        stroke="#396c72"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Bottom fold line */}
      <line
        x1="14"
        y1="94"
        x2="73"
        y2="107"
        stroke="#1e3e41"
        strokeWidth="2"
      />

      {/* ── 3 Bold Brush Strokes ── */}
      {/* 1. Top Stroke (Warm Cream / Soft Gold) */}
      <g>
        <path
          d="M 28 62 C 34 60.5 50 59 66 57.5 C 72 57 76 56 79 57 C 77 58.5 73 59.5 66 60.5 C 50 62.5 35 64 28 65 C 26 65 26 62 28 62 Z"
          fill="#faecd6"
        />
        {/* Brush Bristle Streaks */}
        <path d="M 77 56.5 C 80 56 83 55.5 85 55.8 C 83 56.8 80 57.2 78 57.5 Z" fill="#faecd6" />
        <path d="M 75 58.5 C 78 58.2 81 58 83 58.5 C 80 59.2 77 59.5 75 59.5 Z" fill="#faecd6" />
      </g>

      {/* 2. Middle Stroke (Warm Mango Peach) */}
      <g>
        <path
          d="M 27 68 C 33 66.5 49 65 65 63.5 C 72 63 77 62 80 63 C 78 64.8 73 66 65 67 C 49 69 34 70.5 27 71.5 C 25 71.5 25 68 27 68 Z"
          fill="#fca566"
        />
        {/* Brush Bristle Streaks */}
        <path d="M 78 62.5 C 81 62 84 61.5 86 62 C 84 63 80 63.5 78 63.8 Z" fill="#fca566" />
        <path d="M 76 65 C 79 64.5 82 64.5 84 65.2 C 81 66 78 66.2 76 66 Z" fill="#fca566" />
      </g>

      {/* 3. Bottom Stroke (Vibrant Coral Red) */}
      <g>
        <path
          d="M 25 75 C 32 73.5 48 72 63 70.5 C 70 70 75 69 78 70.2 C 76 72 71 73 63 74 C 47 76 33 77.5 25 78.5 C 23 78.5 23 75 25 75 Z"
          fill="#ea583b"
        />
        {/* Brush Bristle Streaks */}
        <path d="M 76 69.5 C 79 69 82 68.5 84 69 C 82 70 78 70.5 76 70.8 Z" fill="#ea583b" />
        <path d="M 74 72 C 77 71.5 80 71.5 82 72.2 C 79 73 76 73.2 74 73 Z" fill="#ea583b" />
      </g>
    </svg>
  );
}

export function PayFlexLogo({
  size = 'md',
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const heights = {
    sm: 'h-8',
    md: 'h-11',
    lg: 'h-14',
  };

  return (
    <img
      src="/payflex-logo.png"
      alt="PayFlex"
      className={`${heights[size]} w-auto max-w-none object-contain transition-transform duration-200 group-hover:scale-105 select-none ${className}`}
      loading="eager"
    />
  );
}
