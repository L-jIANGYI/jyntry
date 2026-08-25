import { useState } from 'react';
import type { GameState, SetupState } from './types';
import Setup from './Setup';
import { createBoard, copyBoard, movePiece, placePiece, rotateBoard, getWinningLine } from './logic';
import BoardUI from './Board';

interface HistoryEntry {
  board: ReturnType<typeof createBoard>;
  currentPlayer: 1 | 2;
  phase: GameState['phase'];
}

function checkWinnerForPlayer(board: ReturnType<typeof createBoard>, player: 1 | 2): boolean {
  const lines: [number, number][][] = [];
  for (let i = 0; i < 4; i++) {
    lines.push([
      [i, 0],
      [i, 1],
      [i, 2],
      [i, 3],
    ]);
    lines.push([
      [0, i],
      [1, i],
      [2, i],
      [3, i],
    ]);
  }
  lines.push([
    [0, 0],
    [1, 1],
    [2, 2],
    [3, 3],
  ]);
  lines.push([
    [0, 3],
    [1, 2],
    [2, 1],
    [3, 0],
  ]);
  return lines.some((line) => line.every(([r, c]) => board[r][c] === player));
}

export default function Orbito() {
  const [setup, setSetup] = useState<SetupState | null>(null);
  const [game, setGame] = useState<GameState | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [winningLine, setWinningLine] = useState<[number, number][] | null>(null);

  function handleStart(s: SetupState) {
    setSetup(s);
    setScore1(0);
    setScore2(0);
    setWinningLine(null);
    setHistory([]);
    startNewGame(s.firstPlayer);
  }

  function handleRestart() {
    setSetup(null);
    setGame(null);
    setScore1(0);
    setScore2(0);
    setWinningLine(null);
    setHistory([]);
  }

  function startNewGame(firstPlayer: 1 | 2) {
    setWinningLine(null);
    setHistory([]);
    setGame({
      board: createBoard(),
      currentPlayer: firstPlayer,
      phase: 'place',
      selectedCell: null,
      winner: null,
      isDraw: false,
      overtimeLeft: 0,
      history: [],
    });
  }

  function handlePlayAgain() {
    if (!setup || !game) return;
    const next = game.winner === 2 ? 1 : game.winner === 1 ? 2 : game.currentPlayer;
    startNewGame(next);
  }

  function pushHistory(g: GameState) {
    setHistory((h) => [...h, { board: copyBoard(g.board), currentPlayer: g.currentPlayer, phase: g.phase }]);
  }

  function handleCellClick(row: number, col: number) {
    if (!game || game.winner || game.isDraw) return;
    const { board, phase, currentPlayer, selectedCell } = game;

    // Skip move phase
    if (phase === 'move' && row === -1 && col === -1) {
      pushHistory(game);
      setGame((g) => (g ? { ...g, phase: 'place', selectedCell: null } : g));
      return;
    }

    if (phase === 'move') {
      const cell = board[row][col];
      const opponent = currentPlayer === 1 ? 2 : 1;

      if (selectedCell) {
        const [sr, sc] = selectedCell;
        if (sr === row && sc === col) {
          setGame((g) => (g ? { ...g, selectedCell: null } : g));
          return;
        }
        const valid = Math.abs(sr - row) + Math.abs(sc - col) === 1 && board[row][col] === 0;
        if (valid) {
          pushHistory(game);
          const newBoard = movePiece(board, [sr, sc], [row, col]);
          setGame((g) => (g ? { ...g, board: newBoard, phase: 'place', selectedCell: null } : g));
          return;
        }
        if (cell === opponent) {
          setGame((g) => (g ? { ...g, selectedCell: [row, col] } : g));
          return;
        }
        setGame((g) => (g ? { ...g, selectedCell: null } : g));
        return;
      }

      if (cell === opponent) {
        setGame((g) => (g ? { ...g, selectedCell: [row, col] } : g));
      }
      return;
    }

    if (phase === 'place') {
      if (board[row][col] !== 0) return;
      pushHistory(game);
      const newBoard = placePiece(board, row, col, currentPlayer);
      setGame((g) => (g ? { ...g, board: newBoard, phase: 'orbit', selectedCell: null } : g));
    }
  }

  function handleOrbit() {
    if (!game) return;
    if (game.phase !== 'orbit' && game.phase !== 'overtime') return;

    pushHistory(game);
    const newBoard = rotateBoard(game.board);
    const next = game.currentPlayer === 1 ? 2 : 1;

    const p1wins = checkWinnerForPlayer(newBoard, 1);
    const p2wins = checkWinnerForPlayer(newBoard, 2);

    // Both players line up simultaneously → draw
    if (p1wins && p2wins) {
      setWinningLine(null);
      setGame((g) =>
        g
          ? {
              ...g,
              board: newBoard,
              winner: null,
              isDraw: true,
              phase: 'move',
              selectedCell: null,
            }
          : g
      );
      return;
    }

    const winner = p1wins ? 1 : p2wins ? 2 : null;

    if (winner) {
      if (winner === 1) setScore1((s) => s + 1);
      if (winner === 2) setScore2((s) => s + 1);
      setWinningLine(getWinningLine(newBoard));
      setGame((g) =>
        g
          ? {
              ...g,
              board: newBoard,
              winner,
              isDraw: false,
              phase: 'move',
              selectedCell: null,
            }
          : g
      );
      return;
    }

    // Overtime orbit used up → draw
    if (game.phase === 'overtime') {
      const remaining = game.overtimeLeft - 1;
      if (remaining <= 0) {
        setGame((g) =>
          g
            ? {
                ...g,
                board: newBoard,
                winner: null,
                isDraw: true,
                overtimeLeft: 0,
                phase: 'move',
                selectedCell: null,
              }
            : g
        );
      } else {
        setGame((g) =>
          g
            ? {
                ...g,
                board: newBoard,
                currentPlayer: next,
                overtimeLeft: remaining,
                phase: 'overtime',
                selectedCell: null,
              }
            : g
        );
      }
      return;
    }

    // Check if board is full after normal orbit → enter overtime
    const isBoardFull = newBoard.every((row) => row.every((cell) => cell !== 0));
    if (isBoardFull) {
      setGame((g) =>
        g
          ? {
              ...g,
              board: newBoard,
              currentPlayer: next,
              overtimeLeft: 5,
              phase: 'overtime',
              selectedCell: null,
            }
          : g
      );
      return;
    }

    // Normal next turn
    setGame((g) =>
      g
        ? {
            ...g,
            board: newBoard,
            currentPlayer: next,
            phase: 'move',
            selectedCell: null,
          }
        : g
    );
  }

  function handleUndo() {
    if (!game || history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setWinningLine(null);
    setGame((g) =>
      g
        ? {
            ...g,
            board: prev.board,
            currentPlayer: prev.currentPlayer,
            phase: prev.phase,
            selectedCell: null,
            winner: null,
            isDraw: false,
          }
        : g
    );
  }

  if (!setup || !game) return <Setup onStart={handleStart} />;

  return (
    <BoardUI
      board={game.board}
      phase={game.phase}
      currentPlayer={game.currentPlayer}
      selectedCell={game.selectedCell}
      winner={game.winner}
      isDraw={game.isDraw}
      overtimeLeft={game.overtimeLeft}
      winningLine={winningLine}
      onCellClick={handleCellClick}
      onOrbit={handleOrbit}
      onUndo={handleUndo}
      onNewGame={handlePlayAgain}
      onRestart={handleRestart}
      canUndo={history.length > 0}
      player1Name={setup.player1Name}
      player2Name={setup.player2Name}
      score1={score1}
      score2={score2}
    />
  );
}
