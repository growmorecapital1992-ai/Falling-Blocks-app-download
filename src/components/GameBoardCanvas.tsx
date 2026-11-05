/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { BOARD_COLS, BOARD_ROWS, calculateGhostPosition } from '../game/rules';
import { JEWEL_PALETTES } from '../game/theme';
import { ActivePiece, TetriminoType, ThemeConfig } from '../game/types';

interface GameBoardCanvasProps {
  board: number[][];
  activePiece: ActivePiece | null;
  theme: ThemeConfig;
  clearingRows: number[];
  shakeIntensity: number;
  isHardDropping?: boolean;
}

export const GameBoardCanvas: React.FC<GameBoardCanvasProps> = ({
  board,
  activePiece,
  theme,
  clearingRows,
  shakeIntensity,
  isHardDropping = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions & High-DPI support
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const cellSize = width / BOARD_COLS;

    // Apply screen shake if active
    ctx.save();
    if (shakeIntensity > 0) {
      const offsetX = (Math.random() - 0.5) * shakeIntensity * 6;
      const offsetY = (Math.random() - 0.5) * shakeIntensity * 6;
      ctx.translate(offsetX, offsetY);
    }

    // 1. Draw Sleek Modern Matrix Screen Background
    ctx.fillStyle = theme.screenBg;
    ctx.fillRect(0, 0, width, height);

    // Subtle ambient radial glow on matrix center
    if (theme.isColorMode) {
      const radGlow = ctx.createRadialGradient(
        width / 2, height / 2, 20,
        width / 2, height / 2, width * 0.7
      );
      radGlow.addColorStop(0, 'rgba(56, 189, 248, 0.06)');
      radGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radGlow;
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Draw Ambient Grid Cells & Pips
    ctx.strokeStyle = theme.gridLineColor;
    ctx.lineWidth = 1;

    for (let r = 0; r < BOARD_ROWS; r++) {
      for (let c = 0; c < BOARD_COLS; c++) {
        const x = c * cellSize;
        const y = r * cellSize;
        
        // Faint outline of empty cell
        ctx.strokeRect(x + 1, y + 1, cellSize - 2, cellSize - 2);

        // Faint center dot in cells
        ctx.fillStyle = theme.emptyCellColor;
        ctx.fillRect(x + cellSize * 0.42, y + cellSize * 0.42, cellSize * 0.16, cellSize * 0.16);
      }
    }

    // Helper: Draw rounded rectangle
    const drawRoundRect = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      w: number,
      h: number,
      radius: number
    ) => {
      const r = Math.min(radius, w / 2, h / 2);
      context.beginPath();
      context.moveTo(x + r, y);
      context.lineTo(x + w - r, y);
      context.quadraticCurveTo(x + w, y, x + w, y + r);
      context.lineTo(x + w, y + h - r);
      context.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      context.lineTo(x + r, y + h);
      context.quadraticCurveTo(x, y + h, x, y + h - r);
      context.lineTo(x, y + r);
      context.quadraticCurveTo(x, y, x + r, y);
      context.closePath();
    };

    // Helper: draw single jewel brick or vintage LCD brick on canvas
    const drawBrick = (
      pixelX: number,
      pixelY: number,
      typeOrColorId: number | TetriminoType,
      isGhost: boolean = false,
      isClearing: boolean = false
    ) => {
      const pad = 1.5;
      const x = pixelX + pad;
      const y = pixelY + pad;
      const w = cellSize - pad * 2;
      const h = cellSize - pad * 2;
      const radius = theme.isColorMode ? 3.5 : 0;

      // Clearing Flash animation
      if (isClearing) {
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 12;
        drawRoundRect(ctx, x, y, w, h, radius);
        ctx.fill();
        ctx.restore();
        return;
      }

      // Determine palette
      let type: TetriminoType = 'I';
      if (typeof typeOrColorId === 'number' && typeOrColorId > 0) {
        const typeKeys: TetriminoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
        type = typeKeys[typeOrColorId - 1] || 'I';
      } else if (typeof typeOrColorId === 'string') {
        type = typeOrColorId;
      }
      const palette = JEWEL_PALETTES[type] || JEWEL_PALETTES.I;

      // Ghost Piece Rendering on Canvas
      if (isGhost) {
        ctx.save();
        if (theme.isColorMode) {
          ctx.strokeStyle = palette.border;
          ctx.lineWidth = 1.5;
          ctx.fillStyle = palette.glow.replace('0.45', '0.08');
          drawRoundRect(ctx, x + 0.5, y + 0.5, w - 1, h - 1, radius);
          ctx.fill();
          ctx.stroke();

          // Center pip
          ctx.fillStyle = palette.border;
          ctx.fillRect(x + w * 0.38, y + h * 0.38, w * 0.24, h * 0.24);
        } else {
          ctx.strokeStyle = theme.ghostBlockColor;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x + 1, y + 1, w - 2, h - 2);
          ctx.fillStyle = theme.emptyCellColor;
          ctx.fillRect(x + w * 0.3, y + h * 0.3, w * 0.4, h * 0.4);
        }
        ctx.restore();
        return;
      }

      // Solid Locked Block Rendering
      if (theme.isColorMode) {
        ctx.save();

        const grad = ctx.createLinearGradient(x, y, x, y + h);
        grad.addColorStop(0, palette.top);
        grad.addColorStop(1, palette.bottom);

        ctx.fillStyle = grad;
        drawRoundRect(ctx, x, y, w, h, radius);
        ctx.fill();

        // Top/Left Glass Bevel Highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x + radius, y + 1);
        ctx.lineTo(x + w - radius, y + 1);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x + 1, y + radius);
        ctx.lineTo(x + 1, y + h - radius);
        ctx.stroke();

        // Bottom/Right Shadow
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.moveTo(x + radius, y + h - 1);
        ctx.lineTo(x + w - radius, y + h - 1);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x + w - 1, y + radius);
        ctx.lineTo(x + w - 1, y + h - radius);
        ctx.stroke();

        // Inner jewel facet core
        ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.fillRect(x + 4, y + 4, w - 8, 2);

        ctx.restore();
      } else {
        // Classic LCD handheld dual-inset block
        ctx.fillStyle = theme.activeBlockColor;
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = theme.screenBg;
        ctx.fillRect(x + 2.5, y + 2.5, w - 5, h - 5);
        ctx.fillStyle = theme.activeBlockColor;
        ctx.fillRect(x + 4, y + 4, w - 8, h - 8);
      }
    };

    // 3. Draw Locked Blocks on the Board
    for (let r = 0; r < BOARD_ROWS; r++) {
      const isClearing = clearingRows.includes(r);
      for (let c = 0; c < BOARD_COLS; c++) {
        const val = board[r][c];
        if (val !== 0) {
          drawBrick(c * cellSize, r * cellSize, val, false, isClearing);
        }
      }
    }

    // 4. Draw Ghost Piece (Shows predicted landing while active piece descends)
    if (activePiece && clearingRows.length === 0) {
      const ghost = calculateGhostPosition(activePiece, board);
      if (ghost.y > activePiece.y) {
        for (let r = 0; r < activePiece.matrix.length; r++) {
          for (let c = 0; c < activePiece.matrix[r].length; c++) {
            if (activePiece.matrix[r][c] !== 0) {
              const bx = (ghost.x + c) * cellSize;
              const by = (ghost.y + r) * cellSize;
              if (ghost.y + r >= 0 && ghost.y + r < BOARD_ROWS && ghost.x + c >= 0 && ghost.x + c < BOARD_COLS) {
                drawBrick(bx, by, activePiece.type, true, false);
              }
            }
          }
        }
      }
    }

    ctx.restore();
  }, [board, activePiece, theme, clearingRows, shakeIntensity]);

  const activePalette = activePiece ? JEWEL_PALETTES[activePiece.type] || JEWEL_PALETTES.I : null;

  return (
    <div
      className="relative w-full h-full flex items-center justify-center p-2 rounded-xl transition-all duration-300 overflow-hidden"
      style={{
        backgroundColor: theme.screenBg,
        boxShadow: theme.lcdShadow,
        border: `1px solid ${theme.isColorMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.2)'}`,
      }}
    >
      <canvas
        ref={canvasRef}
        data-testid="game-board-canvas"
        className="w-full h-full block touch-none"
        style={{ aspectRatio: '10 / 20' }}
      />

      {/* 5. Active Piece CSS Transition Layer: Smooth Sliding Movement Between Grid Rows */}
      {activePiece && clearingRows.length === 0 && (
        <div
          className="absolute inset-2 pointer-events-none overflow-hidden"
          style={{ aspectRatio: '10 / 20' }}
        >
          {/* Active Piece Container with Hardware-Accelerated CSS Transition */}
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              transform: `translate3d(${activePiece.x * 10}%, ${activePiece.y * 5}%, 0)`,
              transition: isHardDropping
                ? 'none'
                : 'transform 110ms cubic-bezier(0.25, 1, 0.5, 1)',
              willChange: 'transform',
            }}
          >
            {activePiece.matrix.map((row, rIdx) =>
              row.map((cell, cIdx) => {
                if (cell === 0) return null;

                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className="absolute"
                    style={{
                      left: `${cIdx * 10}%`,
                      top: `${rIdx * 5}%`,
                      width: '10%',
                      height: '5%',
                      padding: '1.5px',
                    }}
                  >
                    {theme.isColorMode && activePalette ? (
                      <div
                        className="w-full h-full rounded-[3.5px] relative overflow-hidden"
                        style={{
                          background: `linear-gradient(to bottom, ${activePalette.top}, ${activePalette.bottom})`,
                          boxShadow: `0 0 10px ${activePalette.glow}`,
                          border: `1px solid ${activePalette.border}99`,
                        }}
                      >
                        {/* Top glass bevel highlight */}
                        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-white/60" />
                        {/* Side shine */}
                        <div className="absolute inset-y-0 left-0 w-[1.5px] bg-white/40" />
                        {/* Inner facet */}
                        <div className="absolute inset-x-1 top-1 h-[1.5px] bg-white/25" />
                      </div>
                    ) : (
                      <div
                        className="w-full h-full relative"
                        style={{ backgroundColor: theme.activeBlockColor }}
                      >
                        <div
                          className="absolute inset-[2.5px]"
                          style={{ backgroundColor: theme.screenBg }}
                        >
                          <div
                            className="absolute inset-[1.5px]"
                            style={{ backgroundColor: theme.activeBlockColor }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Subtle modern reflection / glass vignette */}
      <div className="absolute inset-0 pointer-events-none rounded-xl screen-glare opacity-50" />
    </div>
  );
};
