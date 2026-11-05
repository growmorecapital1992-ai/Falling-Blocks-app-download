import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');
const imgPath = path.join(publicDir, 'assets/aistudio/creator_ayush_kumar_74687dae.png');
let imgBase64 = '';
if (fs.existsSync(imgPath)) {
  imgBase64 = 'data:image/png;base64,' + fs.readFileSync(imgPath).toString('base64');
}

const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#0a101d"/>
      <stop offset="50%" stopColor="#050811"/>
      <stop offset="100%" stopColor="#020408"/>
    </linearGradient>

    <!-- Neon Glow Filter -->
    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <!-- Block Gradients -->
    <linearGradient id="cyanBlock" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#38bdf8"/>
      <stop offset="100%" stopColor="#0284c7"/>
    </linearGradient>

    <linearGradient id="purpleBlock" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#c084fc"/>
      <stop offset="100%" stopColor="#7e22ce"/>
    </linearGradient>

    <linearGradient id="amberBlock" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#fbbf24"/>
      <stop offset="100%" stopColor="#d97706"/>
    </linearGradient>

    <linearGradient id="emeraldBlock" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#34d399"/>
      <stop offset="100%" stopColor="#059669"/>
    </linearGradient>

    <linearGradient id="roseBlock" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#f43f5e"/>
      <stop offset="100%" stopColor="#be123c"/>
    </linearGradient>

    <!-- Border Ring Gradient -->
    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#06b6d4"/>
      <stop offset="50%" stopColor="#8b5cf6"/>
      <stop offset="100%" stopColor="#3b82f6"/>
    </linearGradient>
  </defs>

  <!-- App Icon Squircle Background -->
  <rect x="8" y="8" width="496" height="496" rx="108" fill="url(#bgGrad)" stroke="url(#ringGrad)" stroke-width="12"/>

  <!-- Subtle Matrix Grid -->
  <g opacity="0.12" stroke="#38bdf8" stroke-width="1.5">
    <line x1="96" y1="48" x2="96" y2="464"/>
    <line x1="160" y1="48" x2="160" y2="464"/>
    <line x1="224" y1="48" x2="224" y2="464"/>
    <line x1="288" y1="48" x2="288" y2="464"/>
    <line x1="352" y1="48" x2="352" y2="464"/>
    <line x1="416" y1="48" x2="416" y2="464"/>
    <line x1="48" y1="96" x2="464" y2="96"/>
    <line x1="48" y1="160" x2="464" y2="160"/>
    <line x1="48" y1="224" x2="464" y2="224"/>
    <line x1="48" y1="288" x2="464" y2="288"/>
    <line x1="48" y1="352" x2="464" y2="352"/>
    <line x1="48" y1="416" x2="464" y2="416"/>
  </g>

  <!-- Foundation Bricks at bottom -->
  <g filter="url(#neonGlow)">
    <!-- Bottom row -->
    <rect x="76" y="340" width="56" height="56" rx="8" fill="url(#cyanBlock)" stroke="#7dd3fc" stroke-width="2"/>
    <rect x="136" y="340" width="56" height="56" rx="8" fill="url(#cyanBlock)" stroke="#7dd3fc" stroke-width="2"/>
    <rect x="196" y="340" width="56" height="56" rx="8" fill="url(#amberBlock)" stroke="#fde68a" stroke-width="2"/>
    <rect x="256" y="340" width="56" height="56" rx="8" fill="url(#amberBlock)" stroke="#fde68a" stroke-width="2"/>
    <rect x="316" y="340" width="56" height="56" rx="8" fill="url(#emeraldBlock)" stroke="#a7f3d0" stroke-width="2"/>
    <rect x="376" y="340" width="56" height="56" rx="8" fill="url(#emeraldBlock)" stroke="#a7f3d0" stroke-width="2"/>

    <!-- Row above -->
    <rect x="76" y="280" width="56" height="56" rx="8" fill="url(#roseBlock)" stroke="#fecdd3" stroke-width="2"/>
    <rect x="136" y="280" width="56" height="56" rx="8" fill="url(#roseBlock)" stroke="#fecdd3" stroke-width="2"/>
    <rect x="376" y="280" width="56" height="56" rx="8" fill="url(#emeraldBlock)" stroke="#a7f3d0" stroke-width="2"/>
  </g>

  <!-- Descending Purple T-Tetrimino -->
  <g filter="url(#neonGlow)">
    <rect x="196" y="160" width="56" height="56" rx="8" fill="url(#purpleBlock)" stroke="#e9d5ff" stroke-width="2.5"/>
    <rect x="256" y="160" width="56" height="56" rx="8" fill="url(#purpleBlock)" stroke="#e9d5ff" stroke-width="2.5"/>
    <rect x="316" y="160" width="56" height="56" rx="8" fill="url(#purpleBlock)" stroke="#e9d5ff" stroke-width="2.5"/>
    <rect x="256" y="220" width="56" height="56" rx="8" fill="url(#purpleBlock)" stroke="#e9d5ff" stroke-width="2.5"/>
  </g>

  <!-- Glowing Top Title Badge -->
  <rect x="80" y="52" width="352" height="64" rx="16" fill="#030712" stroke="#38bdf8" stroke-width="3" opacity="0.95"/>
  <text x="256" y="93" text-anchor="middle" font-family="'Press Start 2P', monospace, sans-serif" font-size="21" font-weight="bold" fill="#38bdf8" letter-spacing="1.5">
    FALLING BLOCKS
  </text>
  <text x="256" y="110" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="bold" fill="#94a3b8" letter-spacing="4">
    CLASSIC BRICK EDITION
  </text>

  <!-- Bottom Developer Attribution Ribbon with Ayush Photo -->
  <g transform="translate(68, 412)">
    <rect x="0" y="0" width="376" height="68" rx="20" fill="#0f172a" stroke="#06b6d4" stroke-width="2.5" opacity="0.95"/>

    <!-- Creator Avatar Inset -->
    <g transform="translate(14, 10)">
      <clipPath id="avatarClip">
        <circle cx="24" cy="24" r="24"/>
      </clipPath>
      <circle cx="24" cy="24" r="26" fill="#06b6d4"/>
      <image href="${imgBase64}" x="0" y="0" width="48" height="48" clip-path="url(#avatarClip)" preserveAspectRatio="xMidYMid slice"/>
      <circle cx="40" cy="40" r="6" fill="#10b981" stroke="#0f172a" stroke-width="2"/>
    </g>

    <!-- Name & Title -->
    <text x="74" y="30" font-family="sans-serif" font-size="16" font-weight="800" fill="#ffffff">
      Ayush Kumar
    </text>
    <rect x="186" y="17" width="62" height="17" rx="4" fill="#0891b2"/>
    <text x="217" y="29" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="bold" fill="#ffffff" letter-spacing="1">
      CREATOR
    </text>
    <text x="74" y="48" font-family="sans-serif" font-size="11" font-weight="500" fill="#94a3b8">
      Lead Game Architect & Publisher
    </text>
  </g>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'app-logo.svg'), logoSvg, 'utf-8');
console.log('App Logo SVG generated at public/app-logo.svg');
