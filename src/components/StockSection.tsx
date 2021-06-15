import { Box, Text } from "ink";
import React from "react";
import { CardComponent } from "./Card";
import { useConfig, useGame } from "./context";

export function StockSection() {
  const { game } = useGame();
  const { cheatMode } = useConfig();
  const hide = !game.outcome && !cheatMode;
  return (
    <Box borderStyle="round">
      <Box flexDirection="column" minHeight={2}>
        <Box>
          <Text>Stock Pile</Text>
        </Box>
        <Box>
          {game.deck.map((c) =>
            hide ? (
              <Text>?</Text>
            ) : (
              <CardComponent key={`card-${c[0]}-${c[1]}`} card={c} />
            )
          )}
        </Box>
      </Box>
    </Box>
  );
}
