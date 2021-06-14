import { Box } from "ink";
import React from "react";
import { HandComponent } from "./Card";
import { useGame } from "./context";

export function MultiHandDisplay() {
  const { game } = useGame();
  return (
    <Box flexDirection="row" width="100%">
      <HandComponent hand={game.hands[0]} playerIndex={0} hidden={false} />
      <HandComponent
        hand={game.hands[1]}
        playerIndex={1}
        hidden={game.outcome ? false : true}
      />
    </Box>
  );
}
