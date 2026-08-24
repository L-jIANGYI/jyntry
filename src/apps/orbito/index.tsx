import { useState } from 'react';
import type { GameState, SetupState } from './types';
import Setup from './Setup';
import { createBoard, copyBoard, movePiece, placePiece, rotateBoard, checkWinner, getWinningLine } from './logic';
import BoardUI from './Board';

export default function Orbito() {
  const [setup, setSetup] = useState<SetupState | null>(null);
  const [game, setGame] = useState<GameState | null>(null);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [winningLine, setWinningLine] = useState<[number, number][] | null>(null);

  function handleStart(s: SetupState) {
    setSetup(s);
    setScore1(0);
    setScore2(0);
    setWinningLine(null);
    startNewGame(s.firstPlayer);
  }

  function handleRestart() {
    setSetup(null);
    setGame(null);
    setScore1(0);
    setScore2(0);
    setWinningLine(null);
  }

  function startNewGame(firstPlayer: 1 | 2) {
    setWinningLine(null);
    setGame({
      board: createBoard(),
      currentPlayer: firstPlayer,
      phase: 'move',
      selectedCell: null,
      winner: null,
      history: [],
    });
  }

  function handlePlayAgain() {
    if (!setup || !game) return;
    const next = game.winner === 1 ? 2 : 1;
    startNewGame(next);
  }

  function saveHistory(g: GameState): GameState {
    return { ...g, history: [...g.history, copyBoard(g.board)] };
  }

  function handleCellClick(row: number, col: number) {
    if (!game || game.winner) return;

    const { board, phase, currentPlayer, selectedCell } = game;

    if (phase === 'move' && row === -1 && col === -1) {
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
          const newBoard = movePiece(board, [sr, sc], [row, col]);
          setGame((g) =>
            g
              ? saveHistory({
                  ...g,
                  board: newBoard,
                  phase: 'place',
                  selectedCell: null,
                })
              : g
          );
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
      const newBoard = placePiece(board, row, col, currentPlayer);
      setGame((g) =>
        g
          ? saveHistory({
              ...g,
              board: newBoard,
              phase: 'orbit',
              selectedCell: null,
            })
          : g
      );
      return;
    }
  }

  function handleOrbit() {
    if (!game || game.phase !== 'orbit') return;

    const newBoard = rotateBoard(game.board);
    const winner = checkWinner(newBoard);
    const next = game.currentPlayer === 1 ? 2 : 1;

    if (winner === 1) setScore1((s) => s + 1);
    if (winner === 2) setScore2((s) => s + 1);

    if (winner) setWinningLine(getWinningLine(newBoard));

    setGame((g) =>
      g
        ? saveHistory({
            ...g,
            board: newBoard,
            winner,
            currentPlayer: winner ? g.currentPlayer : next,
            phase: 'move',
            selectedCell: null,
          })
        : g
    );
  }

  function handleUndo() {
    if (!game || game.history.length === 0) return;

    const prev = game.history[game.history.length - 1];
    const newHistory = game.history.slice(0, -1);

    let phase = game.phase;
    if (game.phase === 'orbit') phase = 'place';
    else if (game.phase === 'place') phase = 'move';
    else phase = 'orbit';

    setGame((g) =>
      g
        ? {
            ...g,
            board: prev,
            history: newHistory,
            phase,
            selectedCell: null,
            winner: null,
            currentPlayer: phase === 'move' ? (g.currentPlayer === 1 ? 2 : 1) : g.currentPlayer,
          }
        : g
    );
  }

  if (!setup || !game) {
    return <Setup onStart={handleStart} />;
  }

  return (
    <BoardUI
      board={game.board}
      phase={game.phase}
      currentPlayer={game.currentPlayer}
      selectedCell={game.selectedCell}
      winner={game.winner}
      winningLine={winningLine}
      onCellClick={handleCellClick}
      onOrbit={handleOrbit}
      onUndo={handleUndo}
      onNewGame={handlePlayAgain}
      onRestart={handleRestart}
      canUndo={game.history.length > 0}
      player1Name={setup.player1Name}
      player2Name={setup.player2Name}
      score1={score1}
      score2={score2}
    />
  );
}
