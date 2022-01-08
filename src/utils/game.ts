import { GamePhase, ServerGameState } from '@/types/game';

/**
 * Sets a new phase and prepares the game state for that phase
 */
export const gotoPhase = (state: ServerGameState, phase: GamePhase) => {
  // update phase and start time
  state.phase = phase;
  state.phaseStartTime = new Date().getTime();

  // extra preparations for specific phases
  switch (phase) {
    case 'ROUND_START': {
      state.round++; // increment round number
      state.table.answers = {}; // clear previous answers
      state.table.revealed = []; // hide all cards
    }
  }
};
