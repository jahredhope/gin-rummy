import React from "react";
import { Box, Text } from "ink";
import { Action } from "../action";
import { CardComponent } from "./Card";
import { Player } from "./Player";

const LOG_LENGTH = 4;

export function Log({ turns }: { turns: Action[] }) {
  return (
    <Box borderStyle="round" minHeight={LOG_LENGTH + 3} flexDirection="column">
      <Text>Log</Text>
      {turns.length !== 0
        ? turns
            .slice(-LOG_LENGTH)
            .map((turn, i) => (
              <LogEntry
                key={`action-${turn.turn}-${turn.type}`}
                action={turn}
              />
            ))
        : null}
    </Box>
  );
}

function LogEntry({ action }: { action: Action }) {
  if (action.type === "draw") {
    return (
      <Text>
        <Player playerIndex={action.player} /> drew from the {action.from} pile.
      </Text>
    );
  }
  return (
    <Text>
      <Player playerIndex={action.player} /> discarded{" "}
      <CardComponent card={action.card} />
      {action.knock ? ` and knocked` : ""}
    </Text>
  );
}
