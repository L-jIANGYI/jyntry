import type { Board, Cell } from './types';

// Create empty 4x4 board
export function createBoard(): Board {
  return Array.from({ length: 4 }, () => Array(4).fill(0) as Cell[]);
}

// Deep copy board
export function copyBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

// Clockwise orbit path (indices in order)
// Outer ring -> inner ring
const ORBIT_PATH_OUTER: [number, number][] = [
  [0, 0],
  [0, 1],
  [0, 2],
  [0, 3],
  [1, 3],
  [2, 3],
  [3, 3],
  [3, 2],
  [3, 1],
  [3, 0],
  [2, 0],
  [1, 0],
];

const ORBIT_PATH_INNER: [number, number][] = [
  [1, 1],
  [1, 2],
  [2, 2],
  [2, 1],
];

// Rotate all pieces clockwise by one step along their orbit ring
export function rotateBoard(board: Board): Board {
  const next = createBoard();

  function rotatePath(path: [number, number][]) {
    const len = path.length;
    for (let i = 0; i < len; i++) {
      const [r, c] = path[i];
      const [nr, nc] = path[(i + 1) % len]; // clockwise: current moves to next
      next[nr][nc] = board[r][c];
    }
  }

  rotatePath(ORBIT_PATH_OUTER);
  rotatePath(ORBIT_PATH_INNER);

  return next;
}

// Get valid adjacent empty cells for a given cell (up/down/left/right)
export function getAdjacentEmpty(board: Board, row: number, col: number): [number, number][] {
  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  const result: [number, number][] = [];

  for (const [dr, dc] of dirs) {
    const nr = row + dr;
    const nc = col + dc;
    if (nr >= 0 && nr < 4 && nc >= 0 && nc < 4 && board[nr][nc] === 0) {
      result.push([nr, nc]);
    }
  }

  return result;
}

// Check if a player has won (4 in a row: horizontal, vertical, diagonal)
export function checkWinner(board: Board): 1 | 2 | null {
  const lines: [number, number][][] = [];

  // Rows and columns
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

  // Diagonals
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

  for (const line of lines) {
    const values = line.map(([r, c]) => board[r][c]);
    if (values[0] !== 0 && values.every((v) => v === values[0])) {
      return values[0] as 1 | 2;
    }
  }

  return null;
}

// Move an opponent's piece to an adjacent empty cell
export function movePiece(board: Board, from: [number, number], to: [number, number]): Board {
  const next = copyBoard(board);
  next[to[0]][to[1]] = next[from[0]][from[1]];
  next[from[0]][from[1]] = 0;
  return next;
}

// Place a piece on the board
export function placePiece(board: Board, row: number, col: number, player: 1 | 2): Board {
  const next = copyBoard(board);
  next[row][col] = player;
  return next;
}

export function getWinningLine(board: Board): [number, number][] | null {
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

  for (const line of lines) {
    const values = line.map(([r, c]) => board[r][c]);
    if (values[0] !== 0 && values.every((v) => v === values[0])) {
      return line;
    }
  }

  return null;
}
