import React, { useEffect, useReducer, useRef } from "react";
import { Box, Text, useInput } from "ink";
import { Game } from "../game";
import { takeDrawTurn, takeDiscardTurn } from "../computer-player";
import { CardComponent, HandComponent } from "./Card";
import { Player, TurnPrompt } from "./Player";
import { Log } from "./Log";
import { PlayerOne, PlayerTwo } from "../utils";
import { humanInput } from "./humanInput";

export const App = () => {
  const [, forceRender] = useReducer((s) => s + 1, 0);
  let gameRef = useRef<Game>();
  if (!gameRef.current) {
    gameRef.current = new Game();
  }

  function takeAITurn() {
    if (!gameRef.current) {
      return;
    }
    if (gameRef.current.nextTurn === PlayerTwo) {
      const turnState = gameRef.current.getNextTurnState();
      if (turnState.awaiting === "draw") {
        gameRef.current.handleAction(takeDrawTurn(turnState));
      } else {
        gameRef.current.handleAction(takeDiscardTurn(turnState));
      }
      forceRender();
    }
  }

  useInput((input, key) => {
    if (!gameRef.current) {
      return;
    }
    if (gameRef.current.outcome && input === "y") {
      gameRef.current = new Game();
      forceRender();
    }
    if (gameRef.current.outcome) {
      return;
    }
    if (gameRef.current.nextTurn === PlayerOne) {
      humanInput(gameRef.current, input, key);
      forceRender();
    }
  });

  useEffect(() => {
    takeAITurn(), [gameRef.current?.turnCount, gameRef.current?.nextAction];
  });

  return (
    <Box flexDirection="column">
      <Box justifyContent="space-between">
        <Text>
          {gameRef.current.outcome
            ? "Game over"
            : `Turn ${gameRef.current.turnCount}`}
        </Text>
        <Text>({gameRef.current.deck.length} cards left)</Text>
      </Box>
      <Box justifyContent="space-between">
        <Text>
          Current player: <Player playerIndex={gameRef.current.nextTurn} />
        </Text>
        <Text>
          Waiting for:{" "}
          {gameRef.current.nextAction === "draw" ? "Draw" : "Discard"}
        </Text>
      </Box>
      <Box flexDirection="row" width="100%">
        <HandComponent
          hand={gameRef.current.hands[0]}
          playerIndex={0}
          hidden={false}
        />
        <HandComponent
          hand={gameRef.current.hands[1]}
          playerIndex={1}
          hidden={gameRef.current.outcome ? false : true}
        />
      </Box>
      <Box borderStyle="round">
        <Box flexDirection="column" minHeight={2}>
          <Box>
            <Text>Discard Pile</Text>
          </Box>
          <Box>
            {gameRef.current.discardPile.map((c) => (
              <CardComponent key={`card-${c[0]}-${c[1]}`} card={c} />
            ))}
          </Box>
        </Box>
      </Box>
      <Log turns={gameRef.current.turns} />
      {gameRef.current.outcome ? (
        <Text>
          <Player playerIndex={gameRef.current.outcome.winner} /> wins with{" "}
          {gameRef.current.outcome.points} points!!!
        </Text>
      ) : null}
      {gameRef.current.outcome ? (
        <Text>Start again (y/N)?</Text>
      ) : (
        <TurnPrompt game={gameRef.current} />
      )}
    </Box>
  );
};
