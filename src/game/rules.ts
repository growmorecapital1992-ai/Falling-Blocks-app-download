/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ActivePiece, DifficultyConfig, DifficultyMode, Position, TetriminoType } from './types';

export const BOARD_COLS = 10;
export const BOARD_ROWS = 20;

// All 7 Tetrimino Shapes mapped in 2D binary matrices
export const TETRIMINOS: Record<TetriminoType, number[][]> = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
};

// Numerical block indices for board matrix representation
export const BLOCK_IDS: Record<TetriminoType, number> = {
  I: 1,
  O: 2,
  T: 3,
  S: 4,
  Z: 5,
  J: 6,
  L: 7,
};

// Modern arcade colors for arcade theme mode
export const ARCADE_COLORS: Record<TetriminoType, string> = {
  I: '#06b6d4', // Cyan
  O: '#eab308', // Yellow
  T: '#a855f7', // Purple
  S: '#22c55e', // Green
  Z: '#ef4444', // Red
  J: '#3b82f6', // Blue
  L: '#f97316', // Orange
};

export const DIFFICULTY_CONFIGS: Record<DifficultyMode, DifficultyConfig> = {
  easy: {
    id: 'easy',
    name: 'Easy Mode',
    subtitle: 'Novice Brick',
    initialGravity: 1.2, // 1.2s per row
    speedUpPercent: 0.05, // 5% acceleration
    speedUpIntervalLines: 15, // every 15 lines
    lockDelay: 0.8, // 800ms
    bagType: 'merciful',
    hasGhostPiece: true,
    description: 'Merciful piece generator (O & I spawn 25% each, S & Z reduced to 15%), slower drop rate, and ghost assist.',
  },
  medium: {
    id: 'medium',
    name: 'Medium Mode',
    subtitle: 'Standard Classic',
    initialGravity: 0.8, // 0.8s per row
    speedUpPercent: 0.08, // 8% acceleration
    speedUpIntervalLines: 10, // every 10 lines
    lockDelay: 0.5, // 500ms
    bagType: 'sevenBag',
    hasGhostPiece: true,
    description: 'Authentic 7-bag randomizer (fair distribution of all 7 pieces), moderate arcade speed, standard lock delay.',
  },
  hard: {
    id: 'hard',
    name: 'Hard Mode',
    subtitle: 'Master Brick',
    initialGravity: 0.4, // 0.4s per row
    speedUpPercent: 0.15, // 15% aggressive acceleration
    speedUpIntervalLines: 8, // every 8 lines
    lockDelay: 0.25, // 250ms
    bagType: 'malicious',
    hasGhostPiece: true,
    description: 'Malicious bag (high S & Z spawns when stack height exceeds 10 rows, rare I-bars), intense gravity, and lightning lock delay.',
  },
};

/**
 * Creates an empty 10x20 game board matrix filled with 0s.
 */
export function createEmptyBoard(): number[][] {
  const board: number[][] = [];
  for (let r = 0; r < BOARD_ROWS; r++) {
    board.push(new Array(BOARD_COLS).fill(0));
  }
  return board;
}

/**
 * Rotates an N x N matrix 90 degrees clockwise.
 */
export function rotateMatrix(matrix: number[][]): number[][] {
  const n = matrix.length;
  const result: number[][] = [];
  for (let r = 0; r < n; r++) {
    result[r] = new Array(n).fill(0);
  }
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      result[c][n - 1 - r] = matrix[r][c];
    }
  }
  return result;
}

/**
 * Rotates an N x N matrix 90 degrees counter-clockwise.
 */
export function rotateMatrixCounterClockwise(matrix: number[][]): number[][] {
  const n = matrix.length;
  const result: number[][] = [];
  for (let r = 0; r < n; r++) {
    result[r] = new Array(n).fill(0);
  }
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      result[n - 1 - c][r] = matrix[r][c];
    }
  }
  return result;
}

/**
 * Checks whether a given piece configuration collides with the board bounds
 * or already locked blocks.
 */
export function checkCollision(
  matrix: number[][],
  pos: Position,
  board: number[][]
): boolean {
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (matrix[r][c] !== 0) {
        const boardX = pos.x + c;
        const boardY = pos.y + r;

        // Check horizontal boundaries
        if (boardX < 0 || boardX >= BOARD_COLS) {
          return true;
        }

        // Check bottom boundary
        if (boardY >= BOARD_ROWS) {
          return true;
        }

        // Check already locked blocks (ignore above ceiling boardY < 0)
        if (boardY >= 0 && board[boardY][boardX] !== 0) {
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * Wall kick tests for rotating pieces near walls or locked blocks.
 * Standard Super Rotation System (SRS) style translation offsets.
 */
export function tryRotateWithKicks(
  piece: ActivePiece,
  board: number[][],
  direction: 'cw' | 'ccw' = 'cw'
): { rotated: boolean; piece: ActivePiece } {
  const newMatrix = direction === 'cw' 
    ? rotateMatrix(piece.matrix) 
    : rotateMatrixCounterClockwise(piece.matrix);
  const nextRotation = (direction === 'cw' ? piece.rotation + 1 : piece.rotation + 3) % 4;

  // Offsets to test: [dx, dy]
  // 1. Basic test: no shift
  // 2. Shift left 1, right 1
  // 3. Shift left 2, right 2 (crucial for long I-bar against wall)
  // 4. Floor kick up 1
  const kickOffsets: [number, number][] = [
    [0, 0],
    [-1, 0],
    [1, 0],
    [-2, 0],
    [2, 0],
    [0, -1],
    [-1, -1],
    [1, -1],
  ];

  for (const [dx, dy] of kickOffsets) {
    const testPos: Position = { x: piece.x + dx, y: piece.y + dy };
    if (!checkCollision(newMatrix, testPos, board)) {
      return {
        rotated: true,
        piece: {
          ...piece,
          matrix: newMatrix,
          x: testPos.x,
          y: testPos.y,
          rotation: nextRotation,
        },
      };
    }
  }

  // Rotation failed collision with all kicks
  return { rotated: false, piece };
}

/**
 * Calculates the landing position (ghost piece) by raycasting downward.
 */
export function calculateGhostPosition(piece: ActivePiece, board: number[][]): Position {
  let ghostY = piece.y;
  while (!checkCollision(piece.matrix, { x: piece.x, y: ghostY + 1 }, board)) {
    ghostY++;
  }
  return { x: piece.x, y: ghostY };
}

/**
 * Locks the active piece onto the board matrix and returns the updated board.
 */
export function lockPieceToBoard(piece: ActivePiece, board: number[][]): number[][] {
  const newBoard = board.map(row => [...row]);
  const blockId = BLOCK_IDS[piece.type];

  for (let r = 0; r < piece.matrix.length; r++) {
    for (let c = 0; c < piece.matrix[r].length; c++) {
      if (piece.matrix[r][c] !== 0) {
        const by = piece.y + r;
        const bx = piece.x + c;
        if (by >= 0 && by < BOARD_ROWS && bx >= 0 && bx < BOARD_COLS) {
          newBoard[by][bx] = blockId;
        }
      }
    }
  }

  return newBoard;
}

/**
 * Scans the board for filled lines, clears them, drops remaining lines,
 * and returns the cleared rows count and updated board.
 */
export function clearFullLines(board: number[][]): {
  clearedLines: number;
  clearedRowIndices: number[];
  newBoard: number[][];
} {
  const clearedRowIndices: number[] = [];
  const remainingRows: number[][] = [];

  for (let r = 0; r < BOARD_ROWS; r++) {
    const isFull = board[r].every(cell => cell !== 0);
    if (isFull) {
      clearedRowIndices.push(r);
    } else {
      remainingRows.push([...board[r]]);
    }
  }

  const clearedLines = clearedRowIndices.length;
  if (clearedLines === 0) {
    return { clearedLines: 0, clearedRowIndices: [], newBoard: board };
  }

  // Prepend empty rows at top
  const newBoard: number[][] = [];
  for (let i = 0; i < clearedLines; i++) {
    newBoard.push(new Array(BOARD_COLS).fill(0));
  }
  newBoard.push(...remainingRows);

  return { clearedLines, clearedRowIndices, newBoard };
}

/**
 * Calculates current maximum stack height on the board.
 */
export function getMaxStackHeight(board: number[][]): number {
  for (let r = 0; r < BOARD_ROWS; r++) {
    if (board[r].some(cell => cell !== 0)) {
      return BOARD_ROWS - r;
    }
  }
  return 0;
}

/**
 * Official scoring math as specified in Section 5 of GDD:
 * 1 Line Clear: 100 * Level
 * 2 Lines Clear: 300 * Level
 * 3 Lines Clear: 600 * Level
 * 4 Lines Clear (Tetris): 1200 * Level
 */
export function calculateLineClearPoints(linesCleared: number, level: number): number {
  if (linesCleared <= 0) return 0;
  const baseMap: Record<number, number> = {
    1: 100,
    2: 300,
    3: 600,
    4: 1200,
  };
  const base = baseMap[linesCleared] || (linesCleared * 300);
  return base * Math.max(1, level);
}

/**
 * Soft drop bonus: +1 point per grid cell descended.
 */
export function calculateSoftDropBonus(cells: number): number {
  return Math.max(0, cells) * 1;
}

/**
 * Hard drop bonus: +2 points per grid cell traversed.
 */
export function calculateHardDropBonus(cells: number): number {
  return Math.max(0, cells) * 2;
}

/**
 * Level progression based on total lines cleared and difficulty settings.
 * Easy: increases level every 15 lines.
 * Medium: increases level every 10 lines.
 * Hard: increases level every 8 lines.
 */
export function calculateLevel(totalLines: number, difficulty: DifficultyMode): number {
  const config = DIFFICULTY_CONFIGS[difficulty];
  return Math.floor(totalLines / config.speedUpIntervalLines) + 1;
}

/**
 * Calculates current drop interval (gravity) based on difficulty and level.
 */
export function calculateDropInterval(level: number, difficulty: DifficultyMode): number {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const levelOffset = Math.max(0, level - 1);
  const factor = Math.pow(1 - config.speedUpPercent, levelOffset);
  // Clamp minimum interval to 0.05s (50ms) so game remains playable and never drops to 0
  return Math.max(0.05, config.initialGravity * factor);
}

/**
 * Checks whether newly spawned piece has collided with existing blocks (Top-out).
 */
export function isTopOut(piece: ActivePiece, board: number[][]): boolean {
  return checkCollision(piece.matrix, { x: piece.x, y: piece.y }, board);
}

/**
 * Spawns an initial piece positioned at top-center of the board.
 */
export function createNewPiece(type: TetriminoType): ActivePiece {
  const matrix = TETRIMINOS[type].map(row => [...row]);
  // Center horizontally: column 3 or 4
  const startX = Math.floor((BOARD_COLS - matrix[0].length) / 2);
  const startY = 0;
  return {
    type,
    matrix,
    x: startX,
    y: startY,
    visualY: startY,
    rotation: 0,
  };
}

/**
 * Block generation algorithms based on chosen difficulty:
 * - Easy: "Merciful Bag" (O: 25%, I: 25%, T/J/L: 35%, S/Z: 15%)
 * - Medium: "True Random 7-Bag" (equal 14.28% each, all 7 shuffled before reload)
 * - Hard: "Malicious Bag" (when stack height > 10, S/Z boosted to 30%, I reduced)
 */
export function generateNextPiece(
  difficulty: DifficultyMode,
  stackHeight: number,
  bagRef: { current: TetriminoType[] }
): TetriminoType {
  const config = DIFFICULTY_CONFIGS[difficulty];

  if (config.bagType === 'sevenBag') {
    if (bagRef.current.length === 0) {
      const all: TetriminoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
      // Fisher-Yates shuffle
      for (let i = all.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [all[i], all[j]] = [all[j], all[i]];
      }
      bagRef.current = all;
    }
    return bagRef.current.pop()!;
  }

  if (config.bagType === 'merciful') {
    // Merciful weights:
    // O: 25% (0.25)
    // I: 25% (0.25)
    // T: 12%
    // J: 11.5%
    // L: 11.5%
    // S: 7.5%
    // Z: 7.5%
    const rand = Math.random();
    if (rand < 0.25) return 'O';
    if (rand < 0.50) return 'I';
    if (rand < 0.62) return 'T';
    if (rand < 0.735) return 'J';
    if (rand < 0.85) return 'L';
    if (rand < 0.925) return 'S';
    return 'Z';
  }

  // Malicious Bag (Hard Mode):
  // If stackHeight > 10:
  // S & Z boosted to 30% combined (15% each)
  // I reduced to 8%
  // O, T, J, L distributed among remainder (62%)
  const isHighDanger = stackHeight >= 10;
  const rand = Math.random();

  if (isHighDanger) {
    if (rand < 0.16) return 'S';
    if (rand < 0.32) return 'Z';
    if (rand < 0.40) return 'I'; // only 8% chance!
    if (rand < 0.55) return 'O';
    if (rand < 0.70) return 'T';
    if (rand < 0.85) return 'J';
    return 'L';
  } else {
    // Normal 7-bag with slight bias towards variety
    if (bagRef.current.length === 0) {
      const all: TetriminoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
      for (let i = all.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [all[i], all[j]] = [all[j], all[i]];
      }
      bagRef.current = all;
    }
    return bagRef.current.pop()!;
  }
}
