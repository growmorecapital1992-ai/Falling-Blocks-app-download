/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TETRIMINOS } from '../game/rules';
import { JEWEL_PALETTES } from '../game/theme';
import { TetriminoType, ThemeConfig } from '../game/types';

interface PiecePreviewProps {
  type: TetriminoType | null;
  label: string;
  theme: ThemeConfig;
  dimmed?: boolean;
}

export const PiecePreview: React.FC<PiecePreviewProps> = ({
  type,
  label,
  theme,
  dimmed = false,
}) => {
  const matrix = type ? TETRIMINOS[type] : null;
  const palette = type ? JEWEL_PALETTES[type] : null;

  return (
    <div
      className="flex flex-col items-center p-2.5 rounded-xl border select-none transition-all duration-300 w-full"
      style={{
        backgroundColor: theme.screenBg,
        boxShadow: theme.lcdShadow,
        borderColor: theme.isColorMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.15)',
      }}
    >
      <span
        className="text-[9px] tracking-widest font-bold mb-1.5 font-pixel uppercase opacity-85"
        style={{ color: theme.textColor }}
      >
        {label}
      </span>
      <div className="w-16 h-12 flex items-center justify-center relative">
        {matrix ? (
          <div
            className={`grid gap-[2.5px] transition-opacity duration-150 ${dimmed ? 'opacity-30' : 'opacity-100'}`}
            style={{
              gridTemplateColumns: `repeat(${matrix[0].length}, minmax(0, 1fr))`,
            }}
          >
            {matrix.map((row, rIdx) =>
              row.map((cell, cIdx) => {
                if (cell === 0) {
                  return <div key={`${rIdx}-${cIdx}`} className="w-3.5 h-3.5" />;
                }

                if (theme.isColorMode && palette) {
                  return (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      className="w-3.5 h-3.5 rounded-[2.5px] relative overflow-hidden shadow-sm"
                      style={{
                        background: `linear-gradient(to bottom, ${palette.top}, ${palette.bottom})`,
                        border: `1px solid ${palette.border}66`,
                      }}
                    >
                      <div className="absolute inset-x-0 top-0 h-[1px] bg-white/50" />
                    </div>
                  );
                }

                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className="w-3.5 h-3.5 relative"
                    style={{ backgroundColor: theme.activeBlockColor }}
                  >
                    <div
                      className="absolute inset-[2px]"
                      style={{ backgroundColor: theme.screenBg }}
                    >
                      <div
                        className="absolute inset-[1px]"
                        style={{ backgroundColor: theme.activeBlockColor }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div
            className="text-[10px] font-pixel opacity-30"
            style={{ color: theme.textColor }}
          >
            ---
          </div>
        )}
      </div>
    </div>
  );
};
