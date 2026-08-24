import { useState } from 'react';
import type { SetupState } from './types';

interface Props {
  onStart: (setup: SetupState) => void;
}

export default function Setup({ onStart }: Props) {
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [firstPlayer, setFirstPlayer] = useState<1 | 2>(1);

  function handleStart() {
    onStart({
      player1Name: player1Name.trim() || 'Player 1',
      player2Name: player2Name.trim() || 'Player 2',
      firstPlayer,
    });
  }

  return (
    <div className="flex justify-center min-h-full">
      <div className="w-full max-w-sm flex flex-col gap-6 p-6 pt-10">
        <h2 className="text-white text-2xl font-bold">New Game</h2>

        {/* Player 1 */}
        <div className="flex flex-col gap-2">
          <label className="text-white/50 text-sm">Player 1 (⚪)</label>
          <input
            type="text"
            placeholder="Player 1"
            value={player1Name}
            onChange={(e) => setPlayer1Name(e.target.value)}
            className="bg-white/10 text-white placeholder:text-white/20 rounded-xl px-4 py-3
                       outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>

        {/* Player 2 */}
        <div className="flex flex-col gap-2">
          <label className="text-white/50 text-sm">Player 2 (⚫)</label>
          <input
            type="text"
            placeholder="Player 2"
            value={player2Name}
            onChange={(e) => setPlayer2Name(e.target.value)}
            className="bg-white/10 text-white placeholder:text-white/20 rounded-xl px-4 py-3
                       outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>

        {/* Who goes first */}
        <div className="flex flex-col gap-2">
          <label className="text-white/50 text-sm">Who goes first?</label>
          <div className="flex gap-2">
            {([1, 2] as const).map((p) => (
              <button
                key={p}
                onClick={() => setFirstPlayer(p)}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer border
                  ${firstPlayer === p ? 'bg-white text-black border-white' : 'bg-transparent text-white/60 border-white/20'}`}
              >
                {p === 1 ? player1Name.trim() || 'Player 1' : player2Name.trim() || 'Player 2'}
              </button>
            ))}
          </div>
        </div>

        {/* Start */}
        <button
          onClick={handleStart}
          className="mt-2 bg-white text-black font-semibold py-4 rounded-xl
                     hover:bg-white/90 active:scale-95 transition-all cursor-pointer"
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
