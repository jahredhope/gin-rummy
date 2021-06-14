import React from "react";
import { Text } from "ink";
import { Game } from "../game";
import { PlayerTwo } from "../utils";

export function Player({ playerIndex }: { playerIndex: number }) {
  return (
    <Text color={playerIndex === 0 ? "#22eeee" : "#ee2266"}>
      {playerIndex === 0 ? "Player One" : "Player Two"}
    </Text>
  );
}

export function TurnPrompt({ game }: { game?: Game }) {
  if (!game) {
    return null;
  }
  const nextTurnState = game.getNextTurnState();
  if (nextTurnState.player === PlayerTwo) {
    return <Text>Press enter to continue...</Text>;
  }
  if (nextTurnState.awaiting === "draw") {
    return <Text>Draw from (1)Stock (2)Discard (3)Pass</Text>;
  }
  if (nextTurnState.awaiting === "discard") {
    return <Text>Choose a card by position: 1 to -</Text>;
  }
  return null;
}
