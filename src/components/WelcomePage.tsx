import { Box, Text, useInput } from "ink";
import React from "react";

export function WelcomePage({ onReady }: { onReady: () => void }) {
  useInput((input, key) => {
    if (key.return) {
      onReady();
    }
  });
  return (
    <>
      <Box
        borderStyle="round"
        flexDirection="column"
        alignItems="center"
        padding={1}
      >
        <Box paddingBottom={1}>
          <Text bold={true}>Welcome to a CLI based game of Gin Rummy</Text>
        </Box>
        <Text>
          If you aren't familiar with Gin Rummy you may want to search the
          internet for some rules.
        </Text>
        <Text>
          Once you're all caught up on the rules follow the prompts to get
          started.
        </Text>
        <Text>Press Ctrl + r to restart the game at any time.</Text>
      </Box>
      <Text>Press the Enter key to continue.</Text>
    </>
  );
}
