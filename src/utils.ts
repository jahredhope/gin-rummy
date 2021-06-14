export function expect<T>(name: string, actual: T, expected: T) {
  if (actual !== expected) {
    throw new Error(
      `${name} does not match. Expected ${expected}. Received ${actual}`
    );
  }
}
export function otherPlayer(player: PlayerIndex): PlayerIndex {
  return Number(!player) as PlayerIndex;
}

export type PlayerIndex = 0 | 1;
export const PlayerOne = 0;
export const PlayerTwo = 1;
