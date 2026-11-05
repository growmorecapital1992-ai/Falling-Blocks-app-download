/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivePiece,
  DifficultyMode,
  GameState,
  ScoreState,
  TetriminoType,
  ThemeConfig,
} from './game/types';
import {
  BOARD_COLS,
  BOARD_ROWS,
  calculateDropInterval,
  calculateHardDropBonus,
  calculateLevel,
  calculateLineClearPoints,
  calculateSoftDropBonus,
  checkCollision,
  clearFullLines,
  createNewPiece,
  DIFFICULTY_CONFIGS,
  generateNextPiece,
  getMaxStackHeight,
  isTopOut,
  lockPieceToBoard,
  tryRotateWithKicks,
  createEmptyBoard,
} from './game/rules';
import { sound } from './game/sound';
import { getSavedTheme, saveTheme, THEMES } from './game/theme';
import { GameBoardCanvas } from './components/GameBoardCanvas';
import { PiecePreview } from './components/PiecePreview';
import { TactileControls } from './components/TactileControls';
import { TitleScreen } from './components/TitleScreen';
import { GameOverModal, PauseModal } from './components/Modals';
import { HelpCircle, Palette, Pause, Volume2, VolumeX, RefreshCw } from 'lucide-react';

export default function App() {
  // Game State Machine
  const [gameState, setGameState] = useState<GameState>('title');
  const [difficulty, setDifficulty] = useState<DifficultyMode>('medium');
  const [theme, setTheme] = useState<ThemeConfig>(getSavedTheme);
  const [isMuted, setIsMuted] = useState<boolean>(sound.isMuted());

  // Game Board & Pieces
  const [board, setBoard] = useState<number[][]>(createEmptyBoard);
  const [activePiece, setActivePiece] = useState<ActivePiece | null>(null);
  const [nextPieceType, setNextPieceType] = useState<TetriminoType>('T');
  const [holdPieceType, setHoldPieceType] = useState<TetriminoType | null>(null);
  const [canHold, setCanHold] = useState<boolean>(true);

  // Line Clear Animation state
  const [clearingRows, setClearingRows] = useState<number[]>([]);
  const [shakeIntensity, setShakeIntensity] = useState<number>(0);
  const [isHardDropping, setIsHardDropping] = useState<boolean>(false);

  // Scores
  const [scoreState, setScoreState] = useState<ScoreState>(() => {
    let savedHigh = 0;
    try {
      savedHigh = parseInt(localStorage.getItem('falling_blocks_highscore') || '0', 10) || 0;
    } catch {}
    return {
      score: 0,
      highScore: savedHigh,
      lastScore: 0,
      lines: 0,
      level: 1,
      singles: 0,
      doubles: 0,
      triples: 0,
      tetrises: 0,
    };
  });
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);

  // Engine Refs
  const bagRef = useRef<TetriminoType[]>([]);
  const lastDropTimeRef = useRef<number>(0);
  const lockTimerRef = useRef<number | null>(null);
  const isLockingRef = useRef<boolean>(false);
  const keysPressedRef = useRef<Set<string>>(new Set());
  const animationFrameRef = useRef<number | null>(null);
  const activePieceRef = useRef<ActivePiece | null>(null);
  const boardRef = useRef<number[][]>(board);
  const gameStateRef = useRef<GameState>(gameState);
  const difficultyRef = useRef<DifficultyMode>(difficulty);
  const scoreStateRef = useRef<ScoreState>(scoreState);

  // Keep refs synchronized
  useEffect(() => {
    activePieceRef.current = activePiece;
  }, [activePiece]);

  useEffect(() => {
    boardRef.current = board;
  }, [board]);

  useEffect(() => {
    gameStateRef.current = gameState;
    document.body.dataset.state = gameState;
  }, [gameState]);

  useEffect(() => {
    difficultyRef.current = difficulty;
  }, [difficulty]);

  useEffect(() => {
    scoreStateRef.current = scoreState;
  }, [scoreState]);

  // Support ?autostart=1
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        startGame();
      }
    } catch {}
  }, []);

  // Update theme helper
  const handleSelectTheme = (themeId: string) => {
    const found = THEMES.find(t => t.id === themeId);
    if (found) {
      setTheme(found);
      saveTheme(found.id);
    }
  };

  const handleToggleMute = () => {
    const nowMuted = sound.toggleMute();
    setIsMuted(nowMuted);
  };

  // Sound & Screen Shake trigger
  const triggerShake = (intensity: number) => {
    setShakeIntensity(intensity);
    setTimeout(() => {
      setShakeIntensity(0);
    }, 180);
  };

  // Spawn Piece Routine
  const spawnPiece = useCallback((forcedType?: TetriminoType) => {
    const stackHeight = getMaxStackHeight(boardRef.current);
    const typeToSpawn = forcedType || nextPieceType;
    const nextType = generateNextPiece(difficultyRef.current, stackHeight, bagRef);
    setNextPieceType(nextType);

    const newPiece = createNewPiece(typeToSpawn);

    // Check Top-out Game Over
    if (isTopOut(newPiece, boardRef.current)) {
      handleGameOver();
      return;
    }

    setActivePiece(newPiece);
    activePieceRef.current = newPiece;
    setCanHold(true);
    isLockingRef.current = false;
    lastDropTimeRef.current = performance.now();
  }, [nextPieceType]);

  // Start new game
  const startGame = useCallback(() => {
    sound.playButton();
    const freshBoard = createEmptyBoard();
    setBoard(freshBoard);
    boardRef.current = freshBoard;
    bagRef.current = [];

    const firstType = generateNextPiece(difficultyRef.current, 0, bagRef);
    const secondType = generateNextPiece(difficultyRef.current, 0, bagRef);
    setNextPieceType(secondType);

    const initialPiece = createNewPiece(firstType);
    setActivePiece(initialPiece);
    activePieceRef.current = initialPiece;
    setHoldPieceType(null);
    setCanHold(true);
    setClearingRows([]);
    setIsNewHighScore(false);

    setScoreState(prev => ({
      ...prev,
      score: 0,
      lines: 0,
      level: 1,
      singles: 0,
      doubles: 0,
      triples: 0,
      tetrises: 0,
    }));

    setGameState('playing');
    lastDropTimeRef.current = performance.now();
  }, []);

  // Game Over Handler
  const handleGameOver = useCallback(() => {
    sound.playGameOver();
    const currentScore = scoreStateRef.current.score;
    const currentHigh = scoreStateRef.current.highScore;
    const isNew = currentScore > currentHigh;

    if (isNew) {
      try {
        localStorage.setItem('falling_blocks_highscore', String(currentScore));
      } catch {}
      setIsNewHighScore(true);
    }

    setScoreState(prev => ({
      ...prev,
      lastScore: currentScore,
      highScore: isNew ? currentScore : prev.highScore,
    }));

    setGameState('gameover');
  }, []);

  // Lock Current Piece to Board
  const lockPiece = useCallback(() => {
    const piece = activePieceRef.current;
    if (!piece) return;

    sound.playDrop();
    const lockedBoard = lockPieceToBoard(piece, boardRef.current);
    boardRef.current = lockedBoard;
    setActivePiece(null);
    activePieceRef.current = null;

    // Line clearing logic
    const { clearedLines, clearedRowIndices, newBoard } = clearFullLines(lockedBoard);

    if (clearedLines > 0) {
      // Trigger line clear visual flash & sound
      setClearingRows(clearedRowIndices);
      if (clearedLines >= 4) {
        sound.playTetris();
        triggerShake(2.5);
      } else {
        sound.playLineClear(clearedLines);
        triggerShake(1.2);
      }

      // Add scores according to Section 5 GDD formula
      const prevScore = scoreStateRef.current;
      const points = calculateLineClearPoints(clearedLines, prevScore.level);
      const newLines = prevScore.lines + clearedLines;
      const newLevel = calculateLevel(newLines, difficultyRef.current);
      const levelUp = newLevel > prevScore.level;

      if (levelUp) {
        setTimeout(() => sound.playLevelUp(), 200);
      }

      const updatedScore = prevScore.score + points;
      const isNewHigh = updatedScore > prevScore.highScore;

      setScoreState(prev => ({
        ...prev,
        score: updatedScore,
        highScore: isNewHigh ? updatedScore : prev.highScore,
        lines: newLines,
        level: newLevel,
        singles: prev.singles + (clearedLines === 1 ? 1 : 0),
        doubles: prev.doubles + (clearedLines === 2 ? 1 : 0),
        triples: prev.triples + (clearedLines === 3 ? 1 : 0),
        tetrises: prev.tetrises + (clearedLines === 4 ? 1 : 0),
      }));

      // Short 120ms pause for flash animation before clearing
      setTimeout(() => {
        setBoard(newBoard);
        boardRef.current = newBoard;
        setClearingRows([]);
        spawnPiece();
      }, 120);
    } else {
      setBoard(lockedBoard);
      spawnPiece();
    }
  }, [spawnPiece]);


  // Player Actions: Move, Rotate, Drops, Hold
  const moveLeft = useCallback(() => {
    const piece = activePieceRef.current;
    if (!piece || gameStateRef.current !== 'playing') return;
    if (!checkCollision(piece.matrix, { x: piece.x - 1, y: piece.y }, boardRef.current)) {
      sound.playMove();
      const updated = { ...piece, x: piece.x - 1, visualY: piece.visualY ?? piece.y };
      activePieceRef.current = updated;
      setActivePiece(updated);
    }
  }, []);

  const moveRight = useCallback(() => {
    const piece = activePieceRef.current;
    if (!piece || gameStateRef.current !== 'playing') return;
    if (!checkCollision(piece.matrix, { x: piece.x + 1, y: piece.y }, boardRef.current)) {
      sound.playMove();
      const updated = { ...piece, x: piece.x + 1, visualY: piece.visualY ?? piece.y };
      activePieceRef.current = updated;
      setActivePiece(updated);
    }
  }, []);

  const rotateCW = useCallback(() => {
    const piece = activePieceRef.current;
    if (!piece || gameStateRef.current !== 'playing') return;
    const { rotated, piece: newPiece } = tryRotateWithKicks(piece, boardRef.current, 'cw');
    if (rotated) {
      sound.playRotate();
      const updated = { ...newPiece, visualY: piece.visualY ?? piece.y };
      activePieceRef.current = updated;
      setActivePiece(updated);
    }
  }, []);

  const softDrop = useCallback(() => {
    const piece = activePieceRef.current;
    if (!piece || gameStateRef.current !== 'playing') return;

    if (!checkCollision(piece.matrix, { x: piece.x, y: piece.y + 1 }, boardRef.current)) {
      sound.playSoftDrop();
      const nextY = piece.y + 1;
      const updated = { ...piece, y: nextY, visualY: nextY };
      activePieceRef.current = updated;
      setActivePiece(updated);
      lastDropTimeRef.current = performance.now();
      // Add +1 pt soft drop bonus
      setScoreState(prev => ({
        ...prev,
        score: prev.score + calculateSoftDropBonus(1),
      }));
    } else {
      lockPiece();
    }
  }, [lockPiece]);

  const hardDrop = useCallback(() => {
    const piece = activePieceRef.current;
    if (!piece || gameStateRef.current !== 'playing') return;

    let dropY = piece.y;
    while (!checkCollision(piece.matrix, { x: piece.x, y: dropY + 1 }, boardRef.current)) {
      dropY++;
    }

    const cellsTraversed = dropY - piece.y;
    const bonus = calculateHardDropBonus(cellsTraversed);

    sound.playHardDrop();
    triggerShake(1.6);
    setIsHardDropping(true);
    setTimeout(() => setIsHardDropping(false), 80);

    setScoreState(prev => ({
      ...prev,
      score: prev.score + bonus,
    }));

    activePieceRef.current = { ...piece, y: dropY, visualY: dropY };
    setActivePiece({ ...piece, y: dropY, visualY: dropY });
    lockPiece();
  }, [lockPiece]);

  const holdPiece = useCallback(() => {
    const piece = activePieceRef.current;
    if (!piece || !canHold || gameStateRef.current !== 'playing') return;

    sound.playHold();
    setCanHold(false);

    if (holdPieceType === null) {
      setHoldPieceType(piece.type);
      spawnPiece();
    } else {
      const typeToSwap = holdPieceType;
      setHoldPieceType(piece.type);
      const swappedPiece = createNewPiece(typeToSwap);
      setActivePiece(swappedPiece);
      activePieceRef.current = swappedPiece;
    }
  }, [canHold, holdPieceType, spawnPiece]);

  // Main 60fps Game Loop with Buttery-Smooth Continuous Gliding Fall
  useEffect(() => {
    let lastFrameTime = performance.now();

    const tick = (now: number) => {
      const rawDt = (now - lastFrameTime) / 1000;
      const dt = Math.min(rawDt, 0.05); // clamp delta time to prevent tunneling
      lastFrameTime = now;

      if (gameStateRef.current === 'playing' && activePieceRef.current && clearingRows.length === 0) {
        const dropIntervalSec = calculateDropInterval(scoreStateRef.current.level, difficultyRef.current);
        const piece = activePieceRef.current;

        const willCollideBelow = checkCollision(
          piece.matrix,
          { x: piece.x, y: piece.y + 1 },
          boardRef.current
        );

        if (willCollideBelow) {
          // Lock delay handling: align visual position to integer grid row
          if (piece.visualY !== piece.y) {
            activePieceRef.current = { ...piece, visualY: piece.y };
            setActivePiece(activePieceRef.current);
          }

          const config = DIFFICULTY_CONFIGS[difficultyRef.current];
          if (!isLockingRef.current) {
            isLockingRef.current = true;
            lockTimerRef.current = now;
          } else if (lockTimerRef.current && now - lockTimerRef.current >= config.lockDelay * 1000) {
            lockPiece();
          }
        } else {
          isLockingRef.current = false;
          // Smooth continuous descent rate in rows per second
          const speed = 1 / dropIntervalSec;
          const currentVisual = piece.visualY !== undefined ? piece.visualY : piece.y;
          const nextVisual = currentVisual + dt * speed;

          if (nextVisual >= piece.y + 1) {
            const nextIntY = piece.y + 1;
            if (!checkCollision(piece.matrix, { x: piece.x, y: nextIntY }, boardRef.current)) {
              activePieceRef.current = {
                ...piece,
                y: nextIntY,
                visualY: nextVisual,
              };
              setActivePiece(activePieceRef.current);
            } else {
              // Reached bottom / obstacle
              activePieceRef.current = {
                ...piece,
                y: piece.y,
                visualY: piece.y,
              };
              setActivePiece(activePieceRef.current);
              isLockingRef.current = true;
              lockTimerRef.current = now;
            }
          } else {
            // Smoothly glide through the current row
            activePieceRef.current = {
              ...piece,
              visualY: nextVisual,
            };
            setActivePiece(activePieceRef.current);
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [clearingRows.length, lockPiece]);

  // Global Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling on arrows/space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }

      // Title screen shortcut: Enter or Space starts game
      if (gameStateRef.current === 'title') {
        if (e.code === 'Enter' || e.code === 'Space') {
          startGame();
          return;
        }
      }

      // Game over screen shortcut: Enter or Space restarts
      if (gameStateRef.current === 'gameover') {
        if (e.code === 'Enter' || e.code === 'Space') {
          startGame();
          return;
        }
      }

      // Mute toggle (M)
      if (e.code === 'KeyM') {
        handleToggleMute();
        return;
      }

      // Pause toggle (P / Esc)
      if (e.code === 'KeyP' || e.code === 'Escape') {
        if (gameStateRef.current === 'playing') {
          setGameState('paused');
        } else if (gameStateRef.current === 'paused') {
          setGameState('playing');
        }
        return;
      }

      if (gameStateRef.current !== 'playing') return;

      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          moveLeft();
          break;
        case 'ArrowRight':
        case 'KeyD':
          moveRight();
          break;
        case 'ArrowDown':
        case 'KeyS':
          softDrop();
          break;
        case 'ArrowUp':
        case 'KeyW':
        case 'KeyX':
          rotateCW();
          break;
        case 'Space':
          hardDrop();
          break;
        case 'KeyC':
        case 'ShiftLeft':
        case 'ShiftRight':
          holdPiece();
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressedRef.current.delete(e.code);
    };

    const handleBlur = () => {
      keysPressedRef.current.clear();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [hardDrop, holdPiece, moveLeft, moveRight, rotateCW, softDrop, startGame]);

  return (
    <div
      className="relative w-screen h-screen flex flex-col items-center justify-center overflow-hidden font-sans select-none"
      style={{
        background: 'radial-gradient(circle at 50% 15%, rgba(6, 182, 212, 0.09) 0%, rgba(15, 23, 42, 0) 60%), radial-gradient(circle at 85% 85%, rgba(168, 85, 247, 0.07) 0%, rgba(15, 23, 42, 0) 50%), #06090f',
      }}
    >
      {/* 1. Title Screen View */}
      {gameState === 'title' && (
        <TitleScreen
          scoreState={scoreState}
          difficulty={difficulty}
          theme={theme}
          isMuted={isMuted}
          onStartGame={startGame}
          onSelectDifficulty={setDifficulty}
          onSelectTheme={handleSelectTheme}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* 2. Active Playing View: Sleek Modern Arcade / Classy Console */}
      {gameState !== 'title' && (
        <main
          className="relative w-full max-w-xl h-full max-h-[96vh] flex flex-col items-center justify-between p-3 sm:p-5 rounded-2xl shadow-2xl border transition-all duration-300"
          style={{
            backgroundColor: theme.casingBg,
            borderColor: theme.isColorMode ? 'rgba(255, 255, 255, 0.12)' : theme.casingBorder,
            color: theme.textColor,
            boxShadow: theme.isColorMode
              ? '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(6, 182, 212, 0.12)'
              : '0 20px 40px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Top Classy Arcade Header Bar */}
          <header className="w-full flex items-center justify-between pb-2.5 border-b px-1" style={{ borderColor: theme.isColorMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.15)' }}>
            <div className="flex items-center gap-2.5">
              <img
                src="/assets/aistudio/creator_ayush_kumar_74687dae.png"
                alt="Ayush Kumar"
                className="w-6 h-6 rounded-full object-cover ring-1 ring-cyan-400/60 shadow-sm"
                title="Created by Ayush Kumar"
              />
              <span className="font-pixel text-xs tracking-wider font-bold" style={{ color: theme.isColorMode ? '#38bdf8' : 'inherit' }}>
                FALLING BLOCKS
              </span>
              <span className="text-[10px] font-pixel opacity-75 uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10">
                {difficulty}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setGameState('paused')}
                className="p-1.5 rounded-lg hover:bg-white/10 active:scale-95 transition-all text-neutral-300"
                title="Pause Match (Esc / P)"
                aria-label="Pause match"
              >
                <Pause className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleToggleMute}
                className="p-1.5 rounded-lg hover:bg-white/10 active:scale-95 transition-all"
                title={isMuted ? "Unmute Audio (M)" : "Mute Audio (M)"}
                aria-label={isMuted ? "Unmute audio" : "Mute audio"}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>

              <button
                type="button"
                onClick={startGame}
                className="p-1.5 rounded-lg hover:bg-white/10 active:scale-95 transition-all text-neutral-300"
                title="Restart Match"
                aria-label="Restart match"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Central Playfield Stage & Sidebars */}
          <div className="w-full flex-1 flex items-center justify-center gap-3 sm:gap-5 my-1.5 min-h-0">
            {/* Left Sidebar: Hold Piece, Level & Lines */}
            <aside className="flex flex-col gap-3 justify-center items-center w-20 shrink-0">
              <PiecePreview
                type={holdPieceType}
                label="HOLD"
                theme={theme}
                dimmed={!canHold}
              />

              <div
                className="w-full p-2.5 rounded-xl flex flex-col items-center border select-none transition-all duration-300"
                style={{
                  backgroundColor: theme.screenBg,
                  boxShadow: theme.lcdShadow,
                  borderColor: theme.isColorMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.15)',
                }}
              >
                <span className="text-[9px] font-pixel uppercase opacity-75">LEVEL</span>
                <span className="text-base font-pixel font-bold tabular-nums text-emerald-400">
                  {scoreState.level}
                </span>
              </div>

              <div
                className="w-full p-2.5 rounded-xl flex flex-col items-center border select-none transition-all duration-300"
                style={{
                  backgroundColor: theme.screenBg,
                  boxShadow: theme.lcdShadow,
                  borderColor: theme.isColorMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.15)',
                }}
              >
                <span className="text-[9px] font-pixel uppercase opacity-75">LINES</span>
                <span className="text-base font-pixel font-bold tabular-nums text-cyan-400">
                  {scoreState.lines}
                </span>
              </div>
            </aside>

            {/* Central 10x20 Game Board */}
            <div className="h-full flex items-center justify-center max-w-[280px] sm:max-w-[310px] w-full">
              <GameBoardCanvas
                board={board}
                activePiece={activePiece}
                theme={theme}
                clearingRows={clearingRows}
                shakeIntensity={shakeIntensity}
                isHardDropping={isHardDropping}
              />
            </div>

            {/* Right Sidebar: Next Piece, Score & High Score */}
            <aside className="flex flex-col gap-3 justify-center items-center w-20 shrink-0">
              <PiecePreview
                type={nextPieceType}
                label="NEXT"
                theme={theme}
              />

              <div
                className="w-full p-2.5 rounded-xl flex flex-col items-center border select-none text-center transition-all duration-300"
                style={{
                  backgroundColor: theme.screenBg,
                  boxShadow: theme.lcdShadow,
                  borderColor: theme.isColorMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.15)',
                }}
              >
                <span className="text-[9px] font-pixel uppercase opacity-75">SCORE</span>
                <span className="text-xs font-pixel font-bold tabular-nums truncate w-full text-amber-400">
                  {scoreState.score.toLocaleString()}
                </span>
              </div>

              <div
                className="w-full p-2.5 rounded-xl flex flex-col items-center border select-none text-center transition-all duration-300"
                style={{
                  backgroundColor: theme.screenBg,
                  boxShadow: theme.lcdShadow,
                  borderColor: theme.isColorMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.15)',
                }}
              >
                <span className="text-[9px] font-pixel uppercase opacity-75">HIGH</span>
                <span className="text-xs font-pixel font-bold tabular-nums truncate w-full text-violet-300">
                  {scoreState.highScore.toLocaleString()}
                </span>
              </div>
            </aside>
          </div>

          {/* Bottom Tactile Physical Controls Bar */}
          <footer className="w-full">
            <TactileControls
              theme={theme}
              isMuted={isMuted}
              onMoveLeft={moveLeft}
              onMoveRight={moveRight}
              onSoftDrop={softDrop}
              onRotateCW={rotateCW}
              onHardDrop={hardDrop}
              onHold={holdPiece}
              onTogglePause={() => setGameState(s => s === 'playing' ? 'paused' : 'playing')}
              onToggleMute={handleToggleMute}
            />
          </footer>
        </main>
      )}

      {/* 3. Pause Modal */}
      {gameState === 'paused' && (
        <PauseModal
          theme={theme}
          isMuted={isMuted}
          onResume={() => setGameState('playing')}
          onRestart={startGame}
          onMainMenu={() => setGameState('title')}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* 4. Game Over Modal */}
      {gameState === 'gameover' && (
        <GameOverModal
          scoreState={scoreState}
          difficulty={difficulty}
          theme={theme}
          isNewHigh={isNewHighScore}
          onRestart={startGame}
          onMainMenu={() => setGameState('title')}
        />
      )}
    </div>
  );
}
