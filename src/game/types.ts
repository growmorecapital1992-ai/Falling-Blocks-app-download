/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TetriminoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export type DifficultyMode = 'easy' | 'medium' | 'hard';

export type GameState = 'title' | 'playing' | 'paused' | 'gameover';

export interface Position {
  x: number;
  y: number;
}

export interface ActivePiece {
  type: TetriminoType;
  matrix: number[][];
  x: number;
  y: number;
  visualY?: number; // Continuous floating-point vertical position for 60fps smooth glide
  rotation: number; // 0, 1, 2, 3 (0, 90, 180, 270)
}

export interface DifficultyConfig {
  id: DifficultyMode;
  name: string;
  subtitle: string;
  initialGravity: number; // seconds per row drop
  speedUpPercent: number; // e.g. 0.05 = 5%
  speedUpIntervalLines: number; // e.g. 15 lines
  lockDelay: number; // seconds
  bagType: 'merciful' | 'sevenBag' | 'malicious';
  hasGhostPiece: boolean;
  description: string;
}

export interface ScoreState {
  score: number;
  highScore: number;
  lastScore: number;
  lines: number;
  level: number;
  singles: number;
  doubles: number;
  triples: number;
  tetrises: number;
}

export interface ThemeConfig {
  id: string;
  name: string;
  screenBg: string;
  gridLineColor: string;
  emptyCellColor: string;
  activeBlockColor: string;
  ghostBlockColor: string;
  casingBg: string;
  casingBorder: string;
  accentColor: string;
  textColor: string;
  lcdShadow: string;
  isColorMode?: boolean;
}
