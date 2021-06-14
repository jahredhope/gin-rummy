import { Box, Text } from "ink";
import React from "react";
import { useGame } from "./context";
import { Player, TurnPrompt } from "./Player";

export function GameSummary() {
  const { game } = useGame();
  return (
    <>
      <Box justifyContent="space-between">
        <Text>{game.outcome ? "Game over" : `Turn ${game.turnCount}`}</Text>
        <Text>({game.deck.length} cards left)</Text>
      </Box>
      <Box justifyContent="space-between">
        <Text>
          Waiting for <Player playerIndex={game.nextTurn} /> to{" "}
          {game.nextAction === "draw" ? "draw" : "discard"}.
        </Text>
      </Box>
    </>
  );
}
