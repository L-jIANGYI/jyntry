import { getAdjacentEmpty } from './logic';
import type { Board, Cell, Phase } from './types';

interface Props {
  board: Board;
  phase: Phase;
  currentPlayer: 1 | 2;
  selectedCell: [number, number] | null;
  winner: 1 | 2 | null;
  isDraw: boolean;
  overtimeLeft: number;
  winningLine: [number, number][] | null;
  onCellClick: (row: number, col: number) => void;
  onOrbit: () => void;
  onUndo: () => void;
  onNewGame: () => void;
  onRestart: () => void;
  canUndo: boolean;
  player1Name: string;
  player2Name: string;
  score1: number;
  score2: number;
}

export default function BoardUI({
  board,
  phase,
  currentPlayer,
  selectedCell,
  winner,
  isDraw,
  overtimeLeft,
  winningLine,
  onCellClick,
  onOrbit,
  onUndo,
  onNewGame,
  onRestart,
  canUndo,
  player1Name,
  player2Name,
  score1,
  score2,
}: Props) {
  const validMoves: Set<string> = new Set();
  if (phase === 'move' && selectedCell) {
    const [r, c] = selectedCell;
    getAdjacentEmpty(board, r, c).forEach(([nr, nc]) => {
      validMoves.add(`${nr}-${nc}`);
    });
  }

  const winningCells = new Set(winningLine?.map(([r, c]) => `${r}-${c}`) ?? []);
  const gameOver = !!winner || isDraw;

  function getCellStyle(row: number, col: number, value: Cell): string {
    const key = `${row}-${col}`;
    const isSelected = selectedCell?.[0] === row && selectedCell?.[1] === col;
    const isValidTarget = validMoves.has(key);
    const isOpponent = value !== 0 && value !== currentPlayer;
    const isWinning = winningCells.has(key);

    const base = 'w-full aspect-square rounded-full flex items-center justify-center transition-all duration-150';

    if (isWinning) return base + ' scale-110 animate-pulse ' + getPieceColor(value);
    if (isSelected) return base + ' ring-4 ring-yellow-400 scale-110 ' + getPieceColor(value);
    if (isValidTarget) return base + ' ring-2 ring-yellow-300/80 bg-yellow-300/20 cursor-pointer scale-105';
    if (value === 0) {
      if (phase === 'place') return base + ' bg-black/20 hover:bg-black/40 cursor-pointer';
      return base + ' bg-black/20';
    }
    if (phase === 'move' && isOpponent && !selectedCell) {
      return base + ' cursor-pointer hover:scale-110 ' + getPieceColor(value);
    }
    return base + ' ' + getPieceColor(value);
  }

  function getPieceColor(value: Cell): string {
    if (value === 1) return 'bg-white shadow-lg shadow-black/40';
    if (value === 2) return 'bg-gray-900 ring-2 ring-white/60 shadow-lg shadow-black/60';
    return '';
  }

  function getPhaseLabel(): string {
    if (gameOver) return '';
    switch (phase) {
      case 'move':
        return selectedCell ? 'Select an adjacent empty cell' : 'Move an opponent piece (or skip)';
      case 'place':
        return 'Place your piece';
      case 'orbit':
        return 'Press Orbit to rotate the board';
      case 'overtime':
        return `Overtime — ${overtimeLeft} orbit${overtimeLeft !== 1 ? 's' : ''} remaining`;
    }
  }

  return (
    <div className="flex justify-center min-h-full">
      <div className="w-full max-w-sm flex flex-col gap-4 p-4">
        {/* Score + player info */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2 px-2 py-1">
              <div className="w-3 h-3 rounded-full bg-white shadow" />
              <span className="text-white text-sm">{player1Name}</span>
              <span className="text-white/50 text-sm font-mono">{score1}</span>
            </div>
            <div className={`h-0.5 rounded-full bg-blue-400 transition-all duration-300 ${currentPlayer === 1 && !gameOver ? 'w-full' : 'w-0'}`} />
          </div>

          <button onClick={onRestart} className="text-white/30 hover:text-white/60 text-xs transition-colors cursor-pointer">
            ↺ Restart
          </button>

          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 px-2 py-1">
              <span className="text-white/50 text-sm font-mono">{score2}</span>
              <span className="text-white text-sm">{player2Name}</span>
              <div className="w-3 h-3 rounded-full bg-gray-900 ring-2 ring-white/60" />
            </div>
            <div className={`h-0.5 rounded-full bg-blue-400 transition-all duration-300 ${currentPlayer === 2 && !gameOver ? 'w-full' : 'w-0'}`} />
          </div>
        </div>

        {/* Phase label */}
        {!gameOver && <p className="text-white/50 text-xs text-center">{getPhaseLabel()}</p>}

        {/* Winner banner */}
        {winner && (
          <div className="bg-yellow-400/20 border border-yellow-400/40 rounded-2xl py-3 text-center">
            <p className="text-yellow-300 text-lg font-semibold">🎉 {winner === 1 ? player1Name : player2Name} wins!</p>
          </div>
        )}

        {/* Draw banner */}
        {isDraw && (
          <div className="bg-white/10 border border-white/20 rounded-2xl py-3 text-center">
            <p className="text-white text-lg font-semibold">🤝 It's a draw!</p>
          </div>
        )}

        {/* Board */}
        <div className="rounded-3xl p-3 shadow-xl" style={{ background: '#b33a2a' }}>
          <div className="grid grid-cols-4 gap-2 relative">
            <div
              className="absolute border-2 border-black/30 rounded-xl pointer-events-none"
              style={{ top: 'calc(25%)', left: 'calc(25%)', width: 'calc(50%)', height: 'calc(50%)' }}
            />
            {board.map((row, r) =>
              row.map((cell, c) => (
                <div key={`${r}-${c}`} onClick={() => !gameOver && onCellClick(r, c)} className="aspect-square">
                  <div className={getCellStyle(r, c, cell)}>{cell === 0 && <div className="w-2 h-2 rounded-full bg-black/20" />}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          {phase === 'move' && !gameOver && (
            <button
              onClick={() => onCellClick(-1, -1)}
              className="flex-1 bg-white/10 hover:bg-white/20 active:scale-95 transition-all rounded-xl py-3 text-white/70 text-sm cursor-pointer"
            >
              Skip
            </button>
          )}

          {(phase === 'orbit' || phase === 'overtime') && !gameOver && (
            <button
              onClick={onOrbit}
              className="flex-1 active:scale-95 transition-all rounded-xl py-3 text-white font-semibold cursor-pointer shadow-lg"
              style={{ background: '#8a2a1a' }}
            >
              {phase === 'overtime' ? `🔄 Orbit (${overtimeLeft} left)` : '🔄 Orbit'}
            </button>
          )}

          {gameOver && (
            <button
              onClick={onNewGame}
              className="flex-1 bg-white text-black font-semibold py-3 rounded-xl hover:bg-white/90 active:scale-95 transition-all cursor-pointer"
            >
              Play Again
            </button>
          )}

          {!gameOver && (
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="bg-white/10 hover:bg-white/20 active:scale-95 transition-all rounded-xl py-3 px-4 text-white/70 text-sm cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ↩ Undo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
