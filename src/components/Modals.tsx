/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, RotateCcw, Home, X, Trophy, Sparkles, Volume2, VolumeX, ShieldAlert, Award } from 'lucide-react';
import { DifficultyMode, ScoreState, ThemeConfig } from '../game/types';
import { DIFFICULTY_CONFIGS } from '../game/rules';

interface PauseModalProps {
  theme: ThemeConfig;
  isMuted: boolean;
  onResume: () => void;
  onRestart: () => void;
  onMainMenu: () => void;
  onToggleMute: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  theme,
  isMuted,
  onResume,
  onRestart,
  onMainMenu,
  onToggleMute,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-none">
      <div
        className="w-full max-w-sm rounded-lg p-6 shadow-2xl border-2 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-150"
        style={{
          backgroundColor: theme.casingBg,
          borderColor: theme.casingBorder,
          color: theme.textColor,
        }}
      >
        <span className="text-xl font-pixel uppercase tracking-widest mb-1 text-amber-400">
          PAUSED
        </span>
        <p className="text-xs text-neutral-400 mb-6">Match suspended</p>

        <div className="w-full flex flex-col gap-3">
          <button
            type="button"
            data-start="true"
            onClick={onResume}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-pixel text-xs transition-all shadow-md"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>RESUME (ESC / P)</span>
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded bg-neutral-800 hover:bg-neutral-700 active:scale-98 text-neutral-200 font-pixel text-xs transition-all border border-neutral-600/40"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESTART MATCH</span>
          </button>

          <button
            type="button"
            onClick={onMainMenu}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded bg-neutral-800 hover:bg-neutral-700 active:scale-98 text-neutral-200 font-pixel text-xs transition-all border border-neutral-600/40"
          >
            <Home className="w-4 h-4" />
            <span>MAIN MENU</span>
          </button>
        </div>

        <div className="mt-5 pt-4 border-t border-white/10 w-full flex items-center justify-between text-xs text-neutral-400">
          <span>Audio:</span>
          <button
            type="button"
            onClick={onToggleMute}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-black/40 hover:bg-black/60 text-neutral-300"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span>{isMuted ? 'Muted' : 'Sound ON'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface GameOverModalProps {
  scoreState: ScoreState;
  difficulty: DifficultyMode;
  theme: ThemeConfig;
  isNewHigh: boolean;
  onRestart: () => void;
  onMainMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  scoreState,
  difficulty,
  theme,
  isNewHigh,
  onRestart,
  onMainMenu,
}) => {
  const diffConfig = DIFFICULTY_CONFIGS[difficulty];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
      <div
        className="w-full max-w-md rounded-lg p-6 shadow-2xl border-2 flex flex-col items-center animate-in fade-in zoom-in-95 duration-200"
        style={{
          backgroundColor: theme.casingBg,
          borderColor: theme.casingBorder,
          color: theme.textColor,
        }}
      >
        <div className="w-full flex items-center justify-center gap-2 text-red-500 mb-1">
          <ShieldAlert className="w-6 h-6 animate-pulse" />
          <h2 className="text-2xl font-pixel uppercase tracking-wider text-red-500">
            GAME OVER
          </h2>
        </div>

        <p className="text-xs text-neutral-400 mb-4">Ceiling Top-Out Reached</p>

        {isNewHigh && (
          <div className="w-full mb-4 py-2 px-3 rounded bg-amber-500/20 border border-amber-500/50 flex items-center justify-center gap-2 text-amber-300 text-xs font-pixel">
            <Trophy className="w-4 h-4 fill-current text-amber-400 animate-bounce" />
            <span>NEW HIGH SCORE!</span>
          </div>
        )}

        {/* Score Summary Box */}
        <div
          className="w-full rounded p-4 mb-4 border border-black/30 shadow-inner flex flex-col gap-2"
          style={{ backgroundColor: theme.screenBg }}
        >
          <div className="flex justify-between items-baseline border-b border-black/10 pb-1.5">
            <span className="text-[11px] font-pixel uppercase opacity-75">FINAL SCORE:</span>
            <span className="text-xl font-pixel font-bold tabular-nums">
              {scoreState.score.toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs pt-1">
            <div className="flex flex-col">
              <span className="text-[10px] font-pixel opacity-70">HIGH SCORE:</span>
              <span className="font-pixel tabular-nums text-sm font-semibold">
                {scoreState.highScore.toLocaleString()}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] font-pixel opacity-70">LINES CLEARED:</span>
              <span className="font-pixel tabular-nums text-sm font-semibold">
                {scoreState.lines}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] font-pixel opacity-70">LEVEL REACHED:</span>
              <span className="font-pixel tabular-nums text-sm font-semibold">
                LEVEL {scoreState.level}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] font-pixel opacity-70">DIFFICULTY:</span>
              <span className="font-pixel text-[11px] font-semibold uppercase text-amber-400">
                {diffConfig.name}
              </span>
            </div>
          </div>

          {/* Clears breakdown */}
          <div className="mt-2 pt-2 border-t border-black/10 flex justify-around text-[10px] font-pixel opacity-80">
            <div>1x: {scoreState.singles}</div>
            <div>2x: {scoreState.doubles}</div>
            <div>3x: {scoreState.triples}</div>
            <div className="text-cyan-400 font-bold">Tetris: {scoreState.tetrises}</div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            type="button"
            data-start="true"
            onClick={onRestart}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-pixel text-xs transition-all shadow-lg"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>PLAY AGAIN (ENTER / SPACE)</span>
          </button>

          <button
            type="button"
            onClick={onMainMenu}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded bg-neutral-800 hover:bg-neutral-700 active:scale-98 text-neutral-200 font-pixel text-xs transition-all border border-neutral-600/40"
          >
            <Home className="w-4 h-4" />
            <span>RETURN TO MAIN MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface RulesModalProps {
  theme: ThemeConfig;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ theme, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div
        className="w-full max-w-xl max-h-[88vh] overflow-y-auto rounded-lg p-6 shadow-2xl border-2 flex flex-col animate-in fade-in zoom-in-95 duration-150"
        style={{
          backgroundColor: theme.casingBg,
          borderColor: theme.casingBorder,
          color: theme.textColor,
        }}
      >
        <div className="flex items-center justify-between pb-3 border-b border-black/20 mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-pixel uppercase tracking-wide">
              HOW TO PLAY & OFFICIAL RULES
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-black/20 text-neutral-400 hover:text-white transition-colors"
            aria-label="Close rules"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs font-sans text-neutral-300">
          {/* Section 1 */}
          <div className="p-3 rounded bg-black/30 border border-white/5">
            <h3 className="font-pixel text-[11px] text-amber-400 mb-1">
              1. OBJECTIVE & GAMEPLAY
            </h3>
            <p className="leading-relaxed">
              Geometric shapes (Tetriminos) descend onto a 10x20 grid matrix.
              Manipulate, rotate, and position the blocks horizontally and vertically to form
              unbroken horizontal rows. Full rows disintegrate, awarding massive points!
              Prevent blocks from stacking to the ceiling ("Top-Out").
            </p>
          </div>

          {/* Section 2: Multi-line scoring table */}
          <div className="p-3 rounded bg-black/30 border border-white/5">
            <h3 className="font-pixel text-[11px] text-amber-400 mb-2">
              2. EXPONENTIAL MULTI-ROW SCORING
            </h3>
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="p-2 rounded bg-black/40">
                <div className="font-bold text-neutral-100">Single (1 Row)</div>
                <div className="text-emerald-400">100 × Level</div>
              </div>
              <div className="p-2 rounded bg-black/40">
                <div className="font-bold text-neutral-100">Double (2 Rows)</div>
                <div className="text-emerald-400">300 × Level (3x single!)</div>
              </div>
              <div className="p-2 rounded bg-black/40">
                <div className="font-bold text-neutral-100">Triple (3 Rows)</div>
                <div className="text-emerald-400">600 × Level</div>
              </div>
              <div className="p-2 rounded bg-black/40 border border-cyan-500/40">
                <div className="font-bold text-cyan-300">TETRIS (4 Rows)</div>
                <div className="text-cyan-400 font-bold">1200 × Level (Massive!)</div>
              </div>
            </div>
            <div className="mt-2 text-[10px] text-neutral-400">
              Bonus Points: Soft Drop gives +1 pt per cell. Hard Drop gives +2 pts per cell.
            </div>
          </div>

          {/* Section 3: Difficulty modes */}
          <div className="p-3 rounded bg-black/30 border border-white/5">
            <h3 className="font-pixel text-[11px] text-amber-400 mb-2">
              3. ADVANCED DIFFICULTY & BLOCK BAG RNG
            </h3>
            <ul className="space-y-1.5 list-disc list-inside text-neutral-300">
              <li>
                <strong className="text-emerald-300">Easy (Novice Brick):</strong> 1.2s drop, 5% speed ramp every 15 lines. Merciful Bag boosts Square (25%) and Long Bar (25%) while reducing tricky S & Z shapes (15% total).
              </li>
              <li>
                <strong className="text-blue-300">Medium (Standard Classic):</strong> 0.8s drop, 8% speed ramp every 10 lines. Fair 7-Bag algorithm ensures all 7 shapes appear every 7 drops with zero dry spells.
              </li>
              <li>
                <strong className="text-red-400">Hard (Master Brick):</strong> 0.4s drop, 15% speed ramp every 8 lines. Malicious Bag spawns 30% S & Z pieces when stack exceeds 10 rows! Lightning 250ms lock delay.
              </li>
            </ul>
          </div>

          {/* Section 4: Controls */}
          <div className="p-3 rounded bg-black/30 border border-white/5">
            <h3 className="font-pixel text-[11px] text-amber-400 mb-2">
              4. KEYBOARD & TOUCH CONTROLS
            </h3>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div><kbd className="px-1.5 py-0.5 rounded bg-black/60 text-amber-300 font-mono">A / ←</kbd> Move Left</div>
              <div><kbd className="px-1.5 py-0.5 rounded bg-black/60 text-amber-300 font-mono">D / →</kbd> Move Right</div>
              <div><kbd className="px-1.5 py-0.5 rounded bg-black/60 text-amber-300 font-mono">S / ↓</kbd> Soft Drop (+1 pt/cell)</div>
              <div><kbd className="px-1.5 py-0.5 rounded bg-black/60 text-amber-300 font-mono">W / ↑ / X</kbd> Rotate Clockwise</div>
              <div><kbd className="px-1.5 py-0.5 rounded bg-black/60 text-amber-300 font-mono">Space</kbd> Hard Drop (Instant)</div>
              <div><kbd className="px-1.5 py-0.5 rounded bg-black/60 text-amber-300 font-mono">C / Shift</kbd> Hold Piece</div>
              <div><kbd className="px-1.5 py-0.5 rounded bg-black/60 text-amber-300 font-mono">P / Esc</kbd> Pause Match</div>
              <div><kbd className="px-1.5 py-0.5 rounded bg-black/60 text-amber-300 font-mono">M</kbd> Mute / Unmute Sound</div>
            </div>
          </div>

          {/* Section 5: Creator Credits */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/40 via-neutral-900 to-purple-950/30 border border-cyan-500/30 flex items-center gap-4">
            <img
              src="/assets/aistudio/creator_ayush_kumar_74687dae.png"
              alt="Ayush Kumar - Creator & Lead Architect"
              className="w-16 h-16 rounded-xl object-cover ring-2 ring-cyan-400/60 shadow-lg shrink-0"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-bold text-sm text-white">Ayush Kumar</span>
                <span className="text-[9px] font-pixel text-cyan-300 bg-cyan-500/20 px-1.5 py-0.5 rounded border border-cyan-400/30">CREATOR</span>
              </div>
              <p className="text-[11px] text-cyan-200/90 font-medium">Lead Architect & Game Designer</p>
              <p className="text-[10px] text-neutral-400 mt-1 leading-snug">
                Crafted with passion for classic retro brick games and modern arcade puzzle mechanics.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-black/20 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-5 rounded bg-neutral-800 hover:bg-neutral-700 text-white font-pixel text-xs transition-colors"
          >
            GOT IT!
          </button>
        </div>
      </div>
    </div>
  );
};

interface InstallModalProps {
  theme: ThemeConfig;
  onClose: () => void;
  deferredPrompt: any;
  onInstallSuccess?: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({
  theme,
  onClose,
  deferredPrompt,
  onInstallSuccess,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          if (onInstallSuccess) onInstallSuccess();
          onClose();
        }
      } catch (err) {
        console.error('Install prompt failed', err);
      }
    }
  };

  const appUrl = typeof window !== 'undefined' ? window.location.href : 'https://ais-pre-7vwladmnzuutjukbjdxugg-668004188355.asia-northeast1.run.app';

  const copyLink = () => {
    try {
      navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg rounded-2xl p-5 sm:p-6 shadow-2xl border-2 flex flex-col max-h-[92vh] overflow-hidden"
        style={{
          backgroundColor: theme.casingBg,
          borderColor: theme.casingBorder,
          color: theme.textColor,
        }}
      >
        {/* Header with Official App Logo */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img
              src="/app-logo.svg"
              alt="Falling Blocks Official App Logo"
              className="w-12 h-12 rounded-xl border border-cyan-400/50 shadow-md object-cover bg-neutral-900 shrink-0"
            />
            <div>
              <h2 className="text-sm sm:text-base font-pixel uppercase tracking-wide text-cyan-400">
                FALLING BLOCKS APP
              </h2>
              <p className="text-[10px] text-neutral-400 font-sans">
                Official App Package · Created by Ayush Kumar
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto space-y-4 py-3 pr-1 text-xs font-sans">
          {/* Direct Download Standalone App File Button */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/70 via-cyan-950/60 to-blue-950/70 border border-emerald-400/50 shadow-xl flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="font-pixel text-[11px] text-emerald-300 uppercase tracking-wide flex items-center gap-1.5">
                <span>⚡</span> OFFLINE GAME APP FILE
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200 border border-emerald-500/30">
                2.0 MB
              </span>
            </div>
            <p className="text-neutral-300 text-[11px] leading-snug">
              Yeh 1 single file me poora game hai. Download karke apne phone me offline khelein ya direct WhatsApp pe dosto ko bhejein!
            </p>
            <a
              href="/Falling-Blocks-Ayush-Kumar.html"
              download="Falling-Blocks-Ayush-Kumar.html"
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold font-pixel text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98 text-center"
            >
              <span>📥 DOWNLOAD APP FILE (2.0 MB)</span>
            </a>
          </div>

          {/* App Specifications Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30">
              <div className="text-[9px] uppercase font-pixel text-cyan-300">File Size</div>
              <div className="text-sm font-bold text-white mt-0.5">2.0 MB</div>
              <div className="text-[9px] text-cyan-200/70">Ultra Light</div>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
              <div className="text-[9px] uppercase font-pixel text-emerald-300">Speed</div>
              <div className="text-sm font-bold text-white mt-0.5">60 FPS</div>
              <div className="text-[9px] text-emerald-200/70">Smooth Play</div>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30">
              <div className="text-[9px] uppercase font-pixel text-purple-300">Offline</div>
              <div className="text-sm font-bold text-white mt-0.5">100% Ready</div>
              <div className="text-[9px] text-purple-200/70">No Internet Req.</div>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30">
              <div className="text-[9px] uppercase font-pixel text-amber-300">Publisher</div>
              <div className="text-sm font-bold text-white mt-0.5 truncate">Ayush Kumar</div>
              <div className="text-[9px] text-amber-200/70">Official Dev</div>
            </div>
          </div>

          {/* Direct Install CTA (if browser supports native install) */}
          {deferredPrompt && (
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-900/60 to-blue-900/60 border border-cyan-400/50 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-center sm:text-left">
                <div className="font-bold text-white text-xs">Direct Install Ready!</div>
                <div className="text-[10px] text-cyan-200">Tap below to add icon straight to your phone's home screen.</div>
              </div>
              <button
                type="button"
                onClick={handleNativeInstall}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs uppercase font-pixel tracking-wide shrink-0 transition-transform active:scale-95 shadow"
              >
                📥 Install Now
              </button>
            </div>
          )}

          {/* Method 1: Android & Mobile Home Screen */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center text-[10px]">1</span>
              <span className="font-bold text-white text-xs">Phone me direct Install kaise karein (Without Play Store)</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-neutral-300 text-[11px] leading-relaxed">
              <li>Apne phone me Chrome ya Safari browser me yeh game open karein.</li>
              <li>Chrome me upar 3-dots (<strong className="text-white">⋮</strong>) dabayein aur <span className="text-cyan-300 font-semibold">'Install app'</span> ya <span className="text-cyan-300 font-semibold">'Add to Home screen'</span> chunein.</li>
              <li>iPhone (Safari) par neeche <span className="text-cyan-300 font-semibold">'Share icon'</span> dabayein fir <span className="text-cyan-300 font-semibold">'Add to Home Screen'</span> select karein.</li>
              <li>App aapke phone ke app drawer me Ayush Kumar ke icon ke saath install ho jayegi!</li>
            </ol>
          </div>

          {/* Method 2: Create Standalone Android APK */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-[10px]">2</span>
              <span className="font-bold text-white text-xs">WhatsApp pe share karne ke liye Android APK (.apk) banana</span>
            </div>
            <p className="text-neutral-300 text-[11px] leading-relaxed">
              Agar aap dosto ko direct <strong>.APK</strong> file bhejna chahte hain:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-neutral-300 text-[11px]">
              <li><strong className="text-cyan-300">PWABuilder</strong> (pwabuilder.com) website open karein.</li>
              <li>Wahan apni game ki link paste karein aur Start dabayein.</li>
              <li><strong className="text-emerald-300">'Package for Android'</strong> dabayein — aapko 1 click me ready <strong>.apk</strong> file mil jayegi!</li>
            </ol>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                readOnly
                value={appUrl}
                className="w-full text-[10px] font-mono bg-black/60 border border-white/10 rounded px-2 py-1.5 text-neutral-300 select-all"
              />
              <button
                type="button"
                onClick={copyLink}
                className="shrink-0 px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[10px] transition-all"
              >
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>

          {/* Method 3: GitHub & Zip source code explanation */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 font-bold flex items-center justify-center text-[10px]">3</span>
              <span className="font-bold text-white text-xs">GitHub Zip (~1.6 MB) me kya hai?</span>
            </div>
            <p className="text-neutral-300 text-[11px] leading-relaxed">
              GitHub par hamesha clean <strong>Source Code</strong> hota hai (isiliye yeh sirf ~1.6 MB ka hai!). Computer par chalane ke liye:
            </p>
            <div className="p-2 rounded bg-black/60 font-mono text-[10px] text-cyan-300 border border-white/10">
              1. Unzip the file<br />
              2. npm install<br />
              3. npm run dev
            </div>
            <p className="text-[10px] text-neutral-400">
              Isko free me 24/7 online live rakhne ke liye aap GitHub repo ko direct <strong>Vercel</strong> ya <strong>Netlify</strong> se connect kar sakte hain!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-[10px] text-neutral-400">Created by Ayush Kumar</span>
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-pixel text-xs transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};

interface ShareModalProps {
  theme: ThemeConfig;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ theme, onClose }) => {
  const [copied, setCopied] = React.useState(false);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://ais-dev-7vwladmnzuutjukbjdxugg-668004188355.asia-northeast1.run.app';

  const shareText = `🕹️ Falling Blocks: Classic Brick Edition!\nVintage retro handheld arcade game created and published by Ayush Kumar.\nPlay now: ${currentUrl}`;

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Falling Blocks - By Ayush Kumar',
          text: 'Play Falling Blocks: Classic Brick Edition created by Ayush Kumar! 🕹️',
          url: currentUrl,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleWhatsAppShare();
    }
  };

  const handleWhatsAppShare = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
  };

  const copyShareLink = () => {
    try {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-md rounded-2xl p-5 shadow-2xl border-2 flex flex-col max-h-[90vh] overflow-hidden"
        style={{
          backgroundColor: theme.casingBg,
          borderColor: theme.casingBorder,
          color: theme.textColor,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📤</span>
            <div>
              <h2 className="text-sm sm:text-base font-pixel uppercase tracking-wide text-cyan-400">
                SHARE GAME WITH FRIENDS
              </h2>
              <p className="text-[10px] text-neutral-400 font-sans">
                Falling Blocks · By Ayush Kumar
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto space-y-3.5 py-3 pr-1 text-xs font-sans">
          {/* Quick WhatsApp Share Button */}
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2.5 shadow-lg active:scale-98 transition-all"
          >
            <span className="text-lg">💬</span>
            <span>SHARE DIRECTLY ON WHATSAPP</span>
          </button>

          {/* Native Mobile Share Sheet */}
          <button
            type="button"
            onClick={handleNativeShare}
            className="w-full py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all"
          >
            <span>📱</span>
            <span>OPEN PHONE SHARE MENU</span>
          </button>

          {/* Download Offline File to send on WhatsApp */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2">
            <div className="font-bold text-white text-xs flex items-center gap-2">
              <span className="text-emerald-400">📁</span>
              <span>Dosto ko WhatsApp pe Game File bhejna (Zero Login!)</span>
            </div>
            <p className="text-[11px] text-neutral-300 leading-snug">
              Yeh 2.0 MB ki offline file download karke direct WhatsApp par dost ko bhej dein. Dost file par tap karega aur game turant bina kisi email ke start ho jayegi!
            </p>
            <a
              href="/Falling-Blocks-Ayush-Kumar.html"
              download="Falling-Blocks-Ayush-Kumar.html"
              className="w-full py-2 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-cyan-300 font-semibold text-[11px] flex items-center justify-center gap-2 border border-white/10 transition-colors text-center"
            >
              <span>📥 Download 2.0 MB File to Send</span>
            </a>
          </div>

          {/* How to Publish on AI Studio */}
          <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 space-y-2">
            <div className="font-bold text-cyan-300 text-xs flex items-center gap-2">
              <span>🔓</span>
              <span>AI Studio se Public Link kaise kholen?</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-neutral-300 leading-relaxed">
              <li>Screen ke upar daayein kone (Top-Right) me <strong className="text-white">"Share"</strong> button par tap karein.</li>
              <li>Wahan <strong className="text-cyan-300">"Publish"</strong> (Make Public) par click karein.</li>
              <li>Google ka security lock hat jayega aur link sabke liye khul jayegi!</li>
            </ol>
          </div>

          {/* Copy Link Input */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] text-neutral-400 uppercase font-pixel tracking-wider">GAME LINK:</span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="w-full text-[10px] font-mono bg-black/60 border border-white/10 rounded px-2.5 py-2 text-neutral-300 select-all"
              />
              <button
                type="button"
                onClick={copyShareLink}
                className="shrink-0 px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition-colors"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-[10px] text-neutral-400">Ayush Kumar Game Engine</span>
          <button
            type="button"
            onClick={onClose}
            className="py-1.5 px-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-pixel text-xs transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};

