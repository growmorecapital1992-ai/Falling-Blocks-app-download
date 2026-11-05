/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TetriminoType, ThemeConfig } from './types';

export const JEWEL_PALETTES: Record<TetriminoType, { top: string; bottom: string; glow: string; border: string }> = {
  I: { top: '#38bdf8', bottom: '#0284c7', glow: 'rgba(56, 189, 248, 0.45)', border: '#7dd3fc' }, // Sky Cyan
  O: { top: '#fde047', bottom: '#d97706', glow: 'rgba(250, 204, 21, 0.45)', border: '#fef08a' }, // Radiant Gold
  T: { top: '#c084fc', bottom: '#7e22ce', glow: 'rgba(192, 132, 252, 0.45)', border: '#e9d5ff' }, // Royal Amethyst
  S: { top: '#4ade80', bottom: '#15803d', glow: 'rgba(74, 222, 128, 0.45)', border: '#86efac' }, // Electric Emerald
  Z: { top: '#f87171', bottom: '#b91c1c', glow: 'rgba(248, 113, 113, 0.45)', border: '#fca5a5' }, // Crimson Ruby
  J: { top: '#60a5fa', bottom: '#1d4ed8', glow: 'rgba(96, 165, 250, 0.45)', border: '#93c5fd' }, // Sapphire Cobalt
  L: { top: '#fb923c', bottom: '#c2410c', glow: 'rgba(251, 146, 60, 0.45)', border: '#fdba74' }, // Sunset Amber
};

export const THEMES: ThemeConfig[] = [
  {
    id: 'obsidian-luxe',
    name: 'Obsidian Jewel (Classy)',
    screenBg: '#090d16',
    gridLineColor: 'rgba(255, 255, 255, 0.06)',
    emptyCellColor: 'rgba(255, 255, 255, 0.02)',
    activeBlockColor: '#38bdf8',
    ghostBlockColor: 'rgba(56, 189, 248, 0.25)',
    casingBg: '#111827',
    casingBorder: '#1f293d',
    accentColor: '#06b6d4',
    textColor: '#f8fafc',
    lcdShadow: 'inset 0 3px 20px rgba(0, 0, 0, 0.9), 0 0 45px rgba(6, 182, 212, 0.1)',
    isColorMode: true,
  },
  {
    id: 'cyber-neon',
    name: 'Cyberpunk Neon',
    screenBg: '#080512',
    gridLineColor: 'rgba(217, 70, 239, 0.12)',
    emptyCellColor: 'rgba(217, 70, 239, 0.03)',
    activeBlockColor: '#d946ef',
    ghostBlockColor: 'rgba(217, 70, 239, 0.28)',
    casingBg: '#130d24',
    casingBorder: '#281a4a',
    accentColor: '#f43f5e',
    textColor: '#fdf4ff',
    lcdShadow: 'inset 0 3px 20px rgba(0, 0, 0, 0.9), 0 0 45px rgba(217, 70, 239, 0.15)',
    isColorMode: true,
  },
  {
    id: 'amber-phosphor',
    name: 'Royal Amber',
    screenBg: '#160e03',
    gridLineColor: 'rgba(255, 170, 0, 0.12)',
    emptyCellColor: 'rgba(255, 170, 0, 0.04)',
    activeBlockColor: '#ffaa00',
    ghostBlockColor: 'rgba(255, 170, 0, 0.28)',
    casingBg: '#241a10',
    casingBorder: '#3d2b1a',
    accentColor: '#f59e0b',
    textColor: '#fed7aa',
    lcdShadow: 'inset 0 2px 14px rgba(0, 0, 0, 0.85)',
    isColorMode: false,
  },
  {
    id: 'classic-lcd',
    name: 'Vintage 90s Handheld',
    screenBg: '#8e996f',
    gridLineColor: 'rgba(50, 60, 40, 0.15)',
    emptyCellColor: 'rgba(50, 60, 40, 0.08)',
    activeBlockColor: '#1d2616',
    ghostBlockColor: 'rgba(29, 38, 22, 0.28)',
    casingBg: '#cfd4bc',
    casingBorder: '#a2a98f',
    accentColor: '#d64234',
    textColor: '#1a2214',
    lcdShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.35)',
    isColorMode: false,
  },
];

export function getSavedTheme(): ThemeConfig {
  try {
    const saved = localStorage.getItem('falling_blocks_theme');
    if (saved) {
      const found = THEMES.find(t => t.id === saved);
      if (found) return found;
    }
  } catch {}
  return THEMES[0]; // Obsidian Jewel default
}

export function saveTheme(themeId: string) {
  try {
    localStorage.setItem('falling_blocks_theme', themeId);
  } catch {}
}
