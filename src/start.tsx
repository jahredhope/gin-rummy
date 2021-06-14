import React, { useState, useEffect, useMemo, useReducer, useRef } from "react";
import { Box, render, Spacer, Text, useFocus, useInput } from "ink";
import { drawHands, getMelds, getShuffledDeck, printDeck } from "./decks";
import { Card, getCardName } from "./cards";
import { Game, Hand } from "./game";

// function createGame() {
//   const discard: Card[] = [];
//   const deck = getShuffledDeck();
//   const [handOne, handTwo] = drawHands(deck);
//   // for (let i = 0; i < 10; i++) {
//   //   takeTurn(handOne, deck, discard);
//   //   takeTurn(handTwo, deck, discard);
//   // }
//   return { deck, discard, handOne: getMelds(handOne), handTwo: getMelds(handTwo) };
// }

const Card = ({ card }: { card: Card }) => {
  return <Text color={card[1] > 1 ? "red" : "#bbbbbb"}>&nbsp;{getCardName(card)}&nbsp;</Text>;
};

const colors = ["#332800", "#003333", "#330033"];
const Meld = ({ cards, colorIndex }: { cards: Card[]; colorIndex: number }) => {
  return (
    <Box>
      <Text backgroundColor={colors[colorIndex % colors.length]}>
        {cards.map((c) => (
          <Card key={`${c[0]}${c[1]}`} card={c} />
        ))}
      </Text>
    </Box>
  );
};

const HandComponent = ({ hand }: { hand: Hand }) => {
  const melds = [...hand.melds];
  return (
    <Box borderStyle="round" width="50%" flexDirection="column">
      <Box justifyContent="space-between" paddingBottom={1}>
        <Text>{hand.name}</Text>
        <Text>(Deadwood {hand.score})</Text>
      </Box>
      <Box paddingBottom={1}>
        {melds.length > 0 ? (
          addSpaceBetween(melds.map((s, i) => <Meld key={i} cards={s} colorIndex={i} />))
        ) : (
          <Text>&nbsp;</Text>
        )}
      </Box>
      <Box>
        {hand.deadwood.map((c) => (
          <Card key={`${c[0]}${c[1]}`} card={c} />
        ))}
      </Box>
    </Box>
  );
};

function addSpaceBetween(children: any[]) {
  if (children.length === 0) {
    return children;
  }
  const newChildren = [children[0]];
  for (let i = 1; i < children.length; i++) {
    newChildren.push(<Text key={`spacer-${i}`}>&nbsp;</Text>, children[i]);
  }
  return newChildren;
}

const App = () => {
  const [, forceRender] = useReducer((s) => s + 1, 0);
  let game = useRef<Game>();
  if (!game.current) {
    game.current = new Game();
  }
  const gameResult = game.current.gameState.result;
  useInput((input, key) => {
    if (gameResult !== "in-progress" && input === "y") {
      game.current = new Game();
      forceRender();
    }
    if (gameResult === "in-progress" && key.return) {
      game.current!.takeTurn();
      forceRender();
    }
  });

  return (
    <Box flexDirection="column">
      <Box justifyContent="space-between">
        <Text>Game: {game.current.gameState.result}</Text>
        <Text>({game.current.deck.length} cards left)</Text>
      </Box>
      <Box flexDirection="row" width="100%">
        <HandComponent hand={game.current.hands[0]} />
        <HandComponent hand={game.current.hands[1]} />
      </Box>
      <Box borderStyle="round">
        <Box flexDirection="column">
          <Box>
            <Text>Discard Pile</Text>
          </Box>
          <Box>
            {game.current.discardPile.map((c) => (
              <Card key={`${c[0]}${c[1]}`} card={c} />
            ))}
          </Box>
        </Box>
      </Box>
      {game.current.turns.length !== 0
        ? game.current.turns.map((turn) => (
            <Text key={turn.turn}>
              {turn.player} drew
              <Card card={turn.drew!} />
              and discarded
              <Card card={turn.discarded!} />
            </Text>
          ))
        : null}
      {gameResult !== "in-progress" ? (
        <Text>
          {game.current.gameState.winner} wins {game.current.gameState.points} points!!!
        </Text>
      ) : null}
      {gameResult !== "in-progress" ? <Text>Start again (y/N)?</Text> : <Text>Press enter to continue...</Text>}
    </Box>
  );
};

console.clear();
render(<App />);
