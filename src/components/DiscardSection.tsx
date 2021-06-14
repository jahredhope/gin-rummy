import { Box, Text } from "ink";
import React from "react";
import { CardComponent } from "./Card";
import { useGame } from "./context";

export function DiscardSection() {
  const { game } = useGame();
  return (
    <Box borderStyle="round">
      <Box flexDirection="column" minHeight={2}>
        <Box>
          <Text>Discard Pile</Text>
        </Box>
        <Box>
          {game.discardPile.map((c) => (
            <CardComponent key={`card-${c[0]}-${c[1]}`} card={c} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
