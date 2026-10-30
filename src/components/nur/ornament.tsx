import { useId } from "react";

export function SunsetMosque({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  const sky = `${id}sky`;
  const sun = `${id}sun`;
  return (
    <svg viewBox="0 0 360 320" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0B3D2E" />
          <stop offset="48%" stopColor="#14382c" />
          <stop offset="70%" stopColor="#7a3d2e" />
          <stop offset="86%" stopColor="#d4893a" />
          <stop offset="100%" stopColor="#f0c56a" />
        </linearGradient>
        <radialGradient id={sun} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff6d4" />
          <stop offset="42%" stopColor="#f2c14b" />
          <stop offset="100%" stopColor="#f2c14b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="360" height="320" fill={`url(#${sky})`} />
      <circle cx="188" cy="232" r="58" fill={`url(#${sun})`} />
      <circle cx="188" cy="232" r="20" fill="#fff4c8" />
      <g transform="translate(0 214) scale(1 1.5)">
        <path
          fill="#071410"
          d="M0 70h360V56h-28v-6h-10V34l-7-8V16h-5v10l-7 8v16h-14V40c0-16-12-26-26-26s-26 10-26 26v10h-18V34l-9-12V12h-5v10l-9 12v16h-16v-8c0-18-14-30-32-30S116 30 116 48v2H86V38H72V18h-5v20H54v18H36V58H0V70z"
        />
      </g>
    </svg>
  );
}

export function CrescentStar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="1.4" opacity="0.75" />
      <path
        fill="currentColor"
        d="M38 12.5c-11 1.8-18.5 11-18.5 20.2S27 51.2 38 52.8C25.2 50.2 16 41.4 16 32.7S25.2 15.1 38 12.5z"
      />
      <g transform="translate(46 18)" fill="currentColor">
        <rect x="-4.2" y="-4.2" width="8.4" height="8.4" transform="rotate(45)" />
        <rect x="-4.2" y="-4.2" width="8.4" height="8.4" />
      </g>
    </svg>
  );
}
