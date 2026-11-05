/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateLineClearPoints,
  calculateSoftDropBonus,
  calculateHardDropBonus,
  calculateLevel,
  calculateDropInterval,
  createEmptyBoard,
  rotateMatrix,
  checkCollision,
  tryRotateWithKicks,
  calculateGhostPosition,
  clearFullLines,
  lockPieceToBoard,
  createNewPiece,
  isTopOut,
  generateNextPiece,
  BOARD_COLS,
  BOARD_ROWS,
  TETRIMINOS,
} from './rules';
import { TetriminoType } from './types';

test('Line clear scoring matches GDD Section 5 formulas', () => {
  // Single: 100 * Level
  assert.equal(calculateLineClearPoints(1, 1), 100);
  assert.equal(calculateLineClearPoints(1, 4), 400);

  // Double: 300 * Level
  assert.equal(calculateLineClearPoints(2, 1), 300);
  assert.equal(calculateLineClearPoints(2, 4), 1200);

  // Triple: 600 * Level
  assert.equal(calculateLineClearPoints(3, 1), 600);
  assert.equal(calculateLineClearPoints(3, 4), 2400);

  // Tetris (4 rows): 1200 * Level
  assert.equal(calculateLineClearPoints(4, 1), 1200);
  assert.equal(calculateLineClearPoints(4, 4), 4800);

  // 0 lines awards 0 points
  assert.equal(calculateLineClearPoints(0, 5), 0);
});

test('Manual action bonus points (Soft drop and Hard drop)', () => {
  // Soft drop: +1 per cell
  assert.equal(calculateSoftDropBonus(12), 12);
  assert.equal(calculateSoftDropBonus(0), 0);

  // Hard drop: +2 per cell
  assert.equal(calculateHardDropBonus(15), 30);
  assert.equal(calculateHardDropBonus(5), 10);
});

test('Level progression by difficulty thresholds', () => {
  // Easy mode: advances every 15 lines
  assert.equal(calculateLevel(0, 'easy'), 1);
  assert.equal(calculateLevel(14, 'easy'), 1);
  assert.equal(calculateLevel(15, 'easy'), 2);
  assert.equal(calculateLevel(30, 'easy'), 3);

  // Medium mode: advances every 10 lines
  assert.equal(calculateLevel(0, 'medium'), 1);
  assert.equal(calculateLevel(9, 'medium'), 1);
  assert.equal(calculateLevel(10, 'medium'), 2);
  assert.equal(calculateLevel(29, 'medium'), 3);

  // Hard mode: advances every 8 lines
  assert.equal(calculateLevel(0, 'hard'), 1);
  assert.equal(calculateLevel(7, 'hard'), 1);
  assert.equal(calculateLevel(8, 'hard'), 2);
  assert.equal(calculateLevel(16, 'hard'), 3);
});

test('Gravity accelerates with levels and respects minimum clamp', () => {
  const easyLvl1 = calculateDropInterval(1, 'easy');
  const easyLvl2 = calculateDropInterval(2, 'easy');
  assert.ok(easyLvl2 < easyLvl1, 'Gravity should accelerate as level increases');
  assert.ok(easyLvl2 > 0.05, 'Interval should stay above safety clamp');

  const hardLvl10 = calculateDropInterval(10, 'hard');
  assert.ok(hardLvl10 >= 0.05, 'Interval should be clamped at minimum');
});

test('Matrix rotation rotates 90 degrees clockwise and cycles 4 times', () => {
  const tMatrix = [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ];

  const r1 = rotateMatrix(tMatrix);
  assert.deepEqual(r1, [
    [0, 1, 0],
    [0, 1, 1],
    [0, 1, 0],
  ]);

  const r2 = rotateMatrix(r1);
  const r3 = rotateMatrix(r2);
  const r4 = rotateMatrix(r3);
  assert.deepEqual(r4, tMatrix, '4 rotations should return to original');
});

test('Collision detection enforces boundaries and obstacles', () => {
  const board = createEmptyBoard();
  const piece = createNewPiece('T');

  // Center top should be valid
  assert.equal(checkCollision(piece.matrix, { x: 3, y: 0 }, board), false);

  // Left wall collision
  assert.equal(checkCollision(piece.matrix, { x: -2, y: 0 }, board), true);

  // Right wall collision
  assert.equal(checkCollision(piece.matrix, { x: 9, y: 0 }, board), true);

  // Floor collision (row 19 is bottom, so piece at y=19 will exceed row 20)
  assert.equal(checkCollision(piece.matrix, { x: 3, y: 19 }, board), true);

  // Block collision with placed brick
  board[10][4] = 1; // place a locked block
  // piece at x:3, y:9 will overlap cell [10][4] because T-block has block at [1][1] (3+1=4, 9+1=10)
  assert.equal(checkCollision(piece.matrix, { x: 3, y: 9 }, board), true);
});

test('Wall kick shifts piece away from boundaries when rotating', () => {
  const board = createEmptyBoard();
  const iPiece = createNewPiece('I');
  // At x = 8, rotating clockwise will place the vertical bar's column at index 8+2 = 10, colliding with right boundary
  iPiece.x = 8;
  iPiece.y = 5;

  const result = tryRotateWithKicks(iPiece, board, 'cw');
  assert.equal(result.rotated, true, 'Rotation should succeed with kick');
  assert.ok(result.piece.x < 8, 'Piece should kick inward away from the wall');
});

test('Ghost position calculation raycasts to correct floor', () => {
  const board = createEmptyBoard();
  const piece = createNewPiece('O'); // 2x2
  piece.x = 4;
  piece.y = 0;

  const ghost = calculateGhostPosition(piece, board);
  // Bottom row is 19. 2x2 piece top-left at y=18 spans rows 18 and 19.
  assert.equal(ghost.x, 4);
  assert.equal(ghost.y, 18);
});

test('Line clearing removes full rows and updates board correctly', () => {
  const board = createEmptyBoard();
  // Fill row 19 completely
  for (let c = 0; c < BOARD_COLS; c++) {
    board[19][c] = 1;
  }
  // Fill row 18 except for 1 cell
  for (let c = 0; c < BOARD_COLS - 1; c++) {
    board[18][c] = 2;
  }

  const result = clearFullLines(board);
  assert.equal(result.clearedLines, 1);
  assert.deepEqual(result.clearedRowIndices, [19]);
  // Row 18 should have fallen to row 19
  assert.equal(result.newBoard[19][0], 2);
  assert.equal(result.newBoard[19][BOARD_COLS - 1], 0);
  // Row 0 should be empty
  assert.equal(result.newBoard[0][0], 0);
});

test('Top-out detection identifies ceiling obstruction', () => {
  const board = createEmptyBoard();
  // Fill ceiling spawn area
  board[0][4] = 1;
  const piece = createNewPiece('T'); // spawns with center at x:3 or x:4
  assert.equal(isTopOut(piece, board), true);
});

test('7-bag generator yields all 7 unique pieces before repeating', () => {
  const bagRef = { current: [] as TetriminoType[] };
  const pieces: TetriminoType[] = [];
  for (let i = 0; i < 7; i++) {
    pieces.push(generateNextPiece('medium', 0, bagRef));
  }
  const unique = new Set(pieces);
  assert.equal(unique.size, 7, '7-bag must contain all 7 distinct tetriminos');
});
