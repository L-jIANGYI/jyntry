import { useState } from 'react';
import type { GameState, SetupState } from './types';
import Setup from './Setup';

export default function Orbito() {
  const [setup, setSetup] = useState<SetupState | null>(null);
  const [game, setGame] = useState<GameState | null>(null);

  function handleStart(s: SetupState) {
    setSetup(s);
  }

  if (!setup || !game) {
    return <Setup onStart={handleStart} />;
  }
}
