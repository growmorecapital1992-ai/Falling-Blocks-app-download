/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, RotateCw, Zap, Archive, Pause, Volume2, VolumeX } from 'lucide-react';
import { ThemeConfig } from '../game/types';

interface TactileControlsProps {
  theme: ThemeConfig;
  isMuted: boolean;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onSoftDrop: () => void;
  onRotateCW: () => void;
  onHardDrop: () => void;
  onHold: () => void;
  onTogglePause: () => void;
  onToggleMute: () => void;
}

export const TactileControls: React.FC<TactileControlsProps> = ({
  theme,
  isMuted,
  onMoveLeft,
  onMoveRight,
  onSoftDrop,
  onRotateCW,
  onHardDrop,
  onHold,
  onTogglePause,
  onToggleMute,
}) => {
  const repeatTimerRef = useRef<number | null>(null);

  const startRepeat = (action: () => void) => {
    action();
    stopRepeat();
    repeatTimerRef.current = window.setTimeout(() => {
      repeatTimerRef.current = window.setInterval(action, 80);
    }, 220);
  };

  const stopRepeat = () => {
    if (repeatTimerRef.current !== null) {
      clearInterval(repeatTimerRef.current);
      clearTimeout(repeatTimerRef.current);
      repeatTimerRef.current = null;
    }
  };

  return (
    <div className="w-full flex flex-col items-center select-none pt-2 pb-1 gap-2">
      {/* Small Utility Pills: Pause & Sound */}
      <div className="flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={onTogglePause}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-black/40 hover:bg-black/60 active:scale-95 transition-all text-neutral-300 shadow-sm border border-white/10"
          aria-label="Pause game"
        >
          <Pause className="w-3.5 h-3.5" />
          <span>Pause</span>
        </button>

        <button
          type="button"
          onClick={onToggleMute}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-black/40 hover:bg-black/60 active:scale-95 transition-all text-neutral-300 shadow-sm border border-white/10"
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          <span>{isMuted ? 'Muted' : 'Sound'}</span>
        </button>
      </div>

      {/* Main Handheld Controls Row: D-Pad (Left) and Action Buttons (Right) */}
      <div className="w-full max-w-md flex items-center justify-between px-3 mt-1">
        {/* Cross D-Pad */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* D-Pad Background cross shape */}
          <div className="absolute w-10 h-28 bg-neutral-900 rounded-sm shadow-md border border-neutral-700/60" />
          <div className="absolute h-10 w-28 bg-neutral-900 rounded-sm shadow-md border border-neutral-700/60" />
          <div className="absolute w-8 h-8 rounded-full bg-neutral-950/80 pointer-events-none" />

          {/* Up (Rotate) */}
          <button
            type="button"
            className="absolute top-1 w-9 h-9 flex items-center justify-center text-neutral-300 active:bg-neutral-800 active:scale-95 rounded-t-sm z-10 transition-transform"
            onClick={onRotateCW}
            aria-label="Rotate piece"
          >
            <ArrowUp className="w-5 h-5" />
          </button>

          {/* Down (Soft Drop) */}
          <button
            type="button"
            className="absolute bottom-1 w-9 h-9 flex items-center justify-center text-neutral-300 active:bg-neutral-800 active:scale-95 rounded-b-sm z-10 transition-transform"
            onPointerDown={() => startRepeat(onSoftDrop)}
            onPointerUp={stopRepeat}
            onPointerLeave={stopRepeat}
            aria-label="Soft drop"
          >
            <ArrowDown className="w-5 h-5" />
          </button>

          {/* Left */}
          <button
            type="button"
            className="absolute left-1 w-9 h-9 flex items-center justify-center text-neutral-300 active:bg-neutral-800 active:scale-95 rounded-l-sm z-10 transition-transform"
            onPointerDown={() => startRepeat(onMoveLeft)}
            onPointerUp={stopRepeat}
            onPointerLeave={stopRepeat}
            aria-label="Move left"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Right */}
          <button
            type="button"
            className="absolute right-1 w-9 h-9 flex items-center justify-center text-neutral-300 active:bg-neutral-800 active:scale-95 rounded-r-sm z-10 transition-transform"
            onPointerDown={() => startRepeat(onMoveRight)}
            onPointerUp={stopRepeat}
            onPointerLeave={stopRepeat}
            aria-label="Move right"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons: Hold, Hard Drop, Rotate */}
        <div className="flex items-center gap-3">
          {/* Small Hold Button */}
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={onHold}
              className="w-11 h-11 rounded-full bg-neutral-700 active:bg-neutral-600 active:scale-90 text-neutral-200 flex items-center justify-center shadow-lg border border-neutral-500/40 transition-transform"
              aria-label="Hold piece"
            >
              <Archive className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-pixel text-neutral-400 mt-1 uppercase">Hold</span>
          </div>

          {/* Hard Drop Button (B) */}
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={onHardDrop}
              className="w-13 h-13 rounded-full bg-amber-600 active:bg-amber-500 active:scale-90 text-white flex items-center justify-center shadow-lg border border-amber-400/50 transition-transform"
              aria-label="Hard drop"
            >
              <Zap className="w-5 h-5 fill-current" />
            </button>
            <span className="text-[10px] font-pixel text-neutral-400 mt-1 uppercase">Drop</span>
          </div>

          {/* Rotate Button (A - Big red primary) */}
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={onRotateCW}
              className="w-15 h-15 rounded-full active:scale-90 text-white flex items-center justify-center shadow-xl border-2 border-white/20 transition-transform"
              style={{ backgroundColor: theme.accentColor }}
              aria-label="Rotate piece"
            >
              <RotateCw className="w-6 h-6 stroke-[2.5]" />
            </button>
            <span className="text-[10px] font-pixel text-neutral-400 mt-1 uppercase">Rotate</span>
          </div>
        </div>
      </div>
    </div>
  );
};
