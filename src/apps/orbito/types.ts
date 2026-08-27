export type Cell = 0 | 1 | 2; // 0 = empty, 1 = player1, 2 = player2

export type Board = Cell[][]; // 4x4

export type Phase = 'move' | 'place' | 'orbit' | 'overtime';

export interface Player {
  id: 1 | 2;
  name: string;
}

export interface GameState {
  board: Board;
  currentPlayer: 1 | 2;
  phase: Phase;
  selectedCell: [number, number] | null; // for move phase: which opponent piece is selected
  winner: 1 | 2 | null;
  isDraw: boolean;
  overtimeLeft: number;
}

export interface SetupState {
  player1Name: string;
  player2Name: string;
  firstPlayer: 1 | 2;
}
