/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Play, HelpCircle, Volume2, VolumeX, Palette, Check, Smartphone, Download, Share2 } from 'lucide-react';
import { DifficultyMode, ScoreState, ThemeConfig } from '../game/types';
import { DIFFICULTY_CONFIGS } from '../game/rules';
import { THEMES } from '../game/theme';
import { RulesModal, InstallModal, ShareModal } from './Modals';

interface TitleScreenProps {
  scoreState: ScoreState;
  difficulty: DifficultyMode;
  theme: ThemeConfig;
  isMuted: boolean;
  onStartGame: () => void;
  onSelectDifficulty: (mode: DifficultyMode) => void;
  onSelectTheme: (themeId: string) => void;
  onToggleMute: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  scoreState,
  difficulty,
  theme,
  isMuted,
  onStartGame,
  onSelectDifficulty,
  onSelectTheme,
  onToggleMute,
}) => {
  const [showRules, setShowRules] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const isColor = theme.isColorMode;

  return (
    <div
      className="relative w-full h-full min-h-screen flex flex-col items-center justify-between p-4 sm:p-6 overflow-y-auto select-none transition-colors duration-300"
      style={{
        backgroundColor: theme.screenBg,
        color: theme.textColor,
        background: isColor
          ? 'radial-gradient(circle at 50% 18%, rgba(6, 182, 212, 0.12) 0%, rgba(15, 23, 42, 0) 65%), radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.08) 0%, rgba(15, 23, 42, 0) 50%), #06090f'
          : theme.screenBg,
      }}
    >
      {/* Top Status Bar: High Score, Last Score, Mute & Themes */}
      <div
        className="w-full max-w-lg flex items-center justify-between pt-2 px-2 text-xs font-pixel border-b pb-3 transition-colors"
        style={{ borderColor: isColor ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.15)' }}
      >
        <div className="flex flex-col text-left">
          <span className="text-[9px] uppercase opacity-70">HIGH SCORE</span>
          <span className="text-sm font-bold tabular-nums" style={{ color: isColor ? '#38bdf8' : 'inherit' }}>
            {scoreState.highScore > 0 ? scoreState.highScore.toLocaleString() : '000,000'}
          </span>
        </div>

        <div className="flex flex-col text-right">
          <span className="text-[9px] uppercase opacity-70">LAST SCORE</span>
          <span className="text-sm font-bold tabular-nums" style={{ color: isColor ? '#f59e0b' : 'inherit' }}>
            {scoreState.lastScore > 0 ? scoreState.lastScore.toLocaleString() : '---'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleMute}
            className="p-1.5 rounded-lg hover:bg-white/10 active:scale-95 transition-all text-neutral-300 border border-transparent hover:border-white/10"
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            type="button"
            onClick={() => setShowThemePicker(!showThemePicker)}
            className="p-1.5 rounded-lg hover:bg-white/10 active:scale-95 transition-all text-neutral-300 border border-transparent hover:border-white/10"
            title="Change Visual Theme"
            aria-label="Change Visual Theme"
          >
            <Palette className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* Theme Picker Dropdown Overlay */}
      {showThemePicker && (
        <div className="w-full max-w-sm mt-2 p-3.5 rounded-xl bg-neutral-900/95 text-white z-20 shadow-2xl border border-white/15 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-150">
          <div className="text-[10px] font-pixel text-cyan-400 mb-2 uppercase tracking-wider">SELECT VISUAL PALETTE:</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {THEMES.map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  onSelectTheme(t.id);
                  setShowThemePicker(false);
                }}
                className={`flex items-center justify-between p-2.5 rounded-lg text-left transition-all border ${
                  theme.id === t.id ? 'border-cyan-400 bg-cyan-950/40 font-bold text-cyan-200' : 'border-white/10 hover:bg-white/5 text-neutral-300'
                }`}
              >
                <span>{t.name}</span>
                {theme.id === t.id && <Check className="w-3.5 h-3.5 text-cyan-400" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hero Showcase Centerpiece with App Logo & Title */}
      <div className="w-full max-w-md my-auto flex flex-col items-center text-center py-3">
        {/* Official App Logo Icon */}
        <div className="relative mb-3 group">
          <img
            src="/app-logo.svg"
            alt="Falling Blocks Official App Logo - By Ayush Kumar"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl shadow-2xl ring-2 ring-cyan-400/60 object-cover bg-neutral-950 transition-transform group-hover:scale-105"
          />
          <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded bg-cyan-950 text-[8px] font-pixel text-cyan-300 border border-cyan-400/60 shadow">
            v1.0
          </div>
        </div>

        {/* Bespoke Inline SVG Logo */}
        <div className="w-full max-w-sm mb-3 filter drop-shadow-xl">
          <svg viewBox="0 0 340 120" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="titleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>
              <linearGradient id="jewelTPiece" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#7e22ce" />
              </linearGradient>
            </defs>

            {/* Frame Outline */}
            <rect
              x="5"
              y="5"
              width="330"
              height="110"
              rx="12"
              fill={isColor ? "rgba(15, 23, 42, 0.6)" : "none"}
              stroke={isColor ? "rgba(56, 189, 248, 0.4)" : "currentColor"}
              strokeWidth={isColor ? "1.5" : "3"}
              opacity={isColor ? "1" : "0.4"}
            />
            <rect
              x="9"
              y="9"
              width="322"
              height="102"
              rx="8"
              fill="none"
              stroke={isColor ? "rgba(255, 255, 255, 0.08)" : "currentColor"}
              strokeWidth="1"
              strokeDasharray="4 2"
              opacity="0.3"
            />

            {/* Decorative foundation bricks */}
            <g opacity={isColor ? "0.85" : "0.75"}>
              {/* Left group */}
              <rect x="25" y="90" width="12" height="12" rx="2" fill={isColor ? "#0284c7" : "currentColor"} />
              <rect x="39" y="90" width="12" height="12" rx="2" fill={isColor ? "#0284c7" : "currentColor"} />
              <rect x="53" y="90" width="12" height="12" rx="2" fill={isColor ? "#d97706" : "currentColor"} />
              <rect x="67" y="90" width="12" height="12" rx="2" fill={isColor ? "#d97706" : "currentColor"} />
              <rect x="81" y="90" width="12" height="12" rx="2" fill={isColor ? "#15803d" : "currentColor"} />
              <rect x="81" y="76" width="12" height="12" rx="2" fill={isColor ? "#15803d" : "currentColor"} />

              {/* Right group */}
              <rect x="235" y="90" width="12" height="12" rx="2" fill={isColor ? "#b91c1c" : "currentColor"} />
              <rect x="249" y="90" width="12" height="12" rx="2" fill={isColor ? "#b91c1c" : "currentColor"} />
              <rect x="263" y="90" width="12" height="12" rx="2" fill={isColor ? "#1d4ed8" : "currentColor"} />
              <rect x="277" y="90" width="12" height="12" rx="2" fill={isColor ? "#1d4ed8" : "currentColor"} />
              <rect x="291" y="90" width="12" height="12" rx="2" fill={isColor ? "#c2410c" : "currentColor"} />
              <rect x="235" y="76" width="12" height="12" rx="2" fill={isColor ? "#c2410c" : "currentColor"} />
            </g>

            {/* Animated Descending T-Piece */}
            <g className="animate-bounce">
              <rect x="157" y="66" width="12" height="12" rx="2" fill={isColor ? "url(#jewelTPiece)" : "currentColor"} />
              <rect x="171" y="66" width="12" height="12" rx="2" fill={isColor ? "url(#jewelTPiece)" : "currentColor"} />
              <rect x="185" y="66" width="12" height="12" rx="2" fill={isColor ? "url(#jewelTPiece)" : "currentColor"} />
              <rect x="171" y="80" width="12" height="12" rx="2" fill={isColor ? "url(#jewelTPiece)" : "currentColor"} />
            </g>

            {/* Main Typography */}
            <text
              x="170"
              y="38"
              textAnchor="middle"
              className="font-pixel text-[24px] font-bold tracking-wider"
              fill={isColor ? "url(#titleGrad)" : "currentColor"}
            >
              FALLING BLOCKS
            </text>

            <text
              x="170"
              y="56"
              textAnchor="middle"
              className="font-pixel text-[11px] font-semibold tracking-widest uppercase opacity-85"
              fill={isColor ? "#94a3b8" : "currentColor"}
            >
              CLASSIC BRICK EDITION
            </text>
          </svg>
        </div>

        {/* Primary Interactive CTA: Start Game */}
        <div className="w-full max-w-xs flex flex-col gap-3 my-2">
          <button
            type="button"
            data-start="true"
            onClick={onStartGame}
            className="w-full py-3.5 px-6 rounded-xl font-pixel text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-xl border"
            style={{
              backgroundColor: isColor ? '#0891b2' : theme.accentColor,
              color: '#ffffff',
              borderColor: isColor ? 'rgba(56, 189, 248, 0.5)' : 'rgba(0, 0, 0, 0.2)',
              boxShadow: isColor ? '0 10px 25px -5px rgba(6, 182, 212, 0.4)' : '0 4px 10px rgba(0, 0, 0, 0.2)',
            }}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>START GAME</span>
          </button>

          {/* Difficulty Mode Selector */}
          <div className="w-full mt-2 flex flex-col items-center">
            <span className="text-[10px] font-pixel uppercase tracking-widest opacity-70 mb-1.5">
              DIFFICULTY:
            </span>
            <div
              className="w-full grid grid-cols-3 gap-1.5 p-1.5 rounded-xl border transition-all"
              style={{
                backgroundColor: isColor ? 'rgba(15, 23, 42, 0.7)' : 'rgba(0, 0, 0, 0.15)',
                borderColor: isColor ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              }}
            >
              {(['easy', 'medium', 'hard'] as DifficultyMode[]).map(mode => {
                const isSelected = difficulty === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => onSelectDifficulty(mode)}
                    className={`py-1.5 px-1 rounded-lg text-center transition-all ${
                      isSelected
                        ? isColor
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/40 shadow-sm'
                          : 'bg-black/40 font-bold text-white shadow-sm'
                        : 'opacity-70 hover:opacity-100 hover:bg-white/5'
                    }`}
                  >
                    <div className="text-[10px] font-pixel capitalize">{mode}</div>
                    <div className="text-[8px] opacity-75 font-sans leading-tight">
                      {mode === 'easy' ? 'Novice' : mode === 'medium' ? 'Classic' : 'Chaos'}
                    </div>
                  </button>
                );
              })}
            </div>
            {/* Dynamic difficulty description */}
            <p className="text-[10px] font-sans text-center mt-2 px-2 opacity-80 leading-snug">
              {DIFFICULTY_CONFIGS[difficulty].description}
            </p>
          </div>

          {/* Download & Install App CTA */}
          <button
            type="button"
            onClick={() => setShowInstallModal(true)}
            className="w-full py-3 px-4 rounded-xl font-pixel text-xs uppercase tracking-wide flex items-center justify-between border transition-all active:scale-98 shadow-xl"
            style={{
              backgroundColor: isColor ? 'rgba(16, 185, 129, 0.18)' : 'rgba(0, 0, 0, 0.25)',
              borderColor: isColor ? 'rgba(52, 211, 153, 0.5)' : 'rgba(0, 0, 0, 0.3)',
              color: isColor ? '#34d399' : 'inherit',
            }}
          >
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-400 animate-bounce" />
              <span>DOWNLOAD APP (2.0 MB)</span>
            </div>
            <span className="text-[9px] font-sans font-bold px-2 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-emerald-200">
              OFFLINE READY
            </span>
          </button>

          {/* Secondary CTA: How to Play */}
          <button
            type="button"
            onClick={() => setShowRules(true)}
            className="w-full py-2.5 px-4 rounded-xl font-pixel text-[11px] uppercase tracking-wide flex items-center justify-center gap-2 border transition-all active:scale-98"
            style={{
              backgroundColor: isColor ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.1)',
              borderColor: isColor ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              color: isColor ? '#cbd5e1' : 'inherit',
            }}
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>HOW TO PLAY / RULES</span>
          </button>

          {/* Creator Profile Badge */}
          <div
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl border shadow-lg mt-1 transition-all"
            style={{
              backgroundColor: isColor ? 'rgba(15, 23, 42, 0.65)' : 'rgba(0, 0, 0, 0.15)',
              borderColor: isColor ? 'rgba(56, 189, 248, 0.25)' : 'rgba(0, 0, 0, 0.15)',
            }}
          >
            <div className="relative shrink-0">
              <img
                src="/assets/aistudio/creator_ayush_kumar_74687dae.png"
                alt="Ayush Kumar - Creator"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-cyan-400/60 shadow-md"
              />
              <div
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-neutral-900"
                title="Active Developer"
              />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white font-sans tracking-tight">Ayush Kumar</span>
                <span className="text-[9px] font-pixel text-cyan-300 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-500/40">CREATOR</span>
              </div>
              <span className="text-[10px] text-neutral-400 font-sans">Lead Architect & Developer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Flat borderless control hint line */}
      <div
        className="w-full max-w-lg text-center pb-2 text-[11px] font-sans opacity-70 border-t pt-3"
        style={{ borderColor: isColor ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.15)' }}
      >
        <span>WASD / Arrows Move · Space Hard Drop · W / Up Rotate · C Hold · Esc Pause · M Mute</span>
      </div>

      {/* Rules Modal */}
      {showRules && (
        <RulesModal theme={theme} onClose={() => setShowRules(false)} />
      )}

      {/* Install App & APK Modal */}
      {showInstallModal && (
        <InstallModal
          theme={theme}
          deferredPrompt={deferredPrompt}
          onClose={() => setShowInstallModal(false)}
        />
      )}
    </div>
  );
};
