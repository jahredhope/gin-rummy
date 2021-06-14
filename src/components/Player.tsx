import React from "react";
import { Text } from "ink";

export function Player({ playerIndex }: { playerIndex: number }) {
  return (
    <Text color={playerIndex === 0 ? "#22eeee" : "#ee2266"}>{playerIndex === 0 ? "Player One" : "Player Two"}</Text>
  );
}
