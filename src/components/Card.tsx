import React from "react";
import { Box, Text } from "ink";
import { Card, getCardName } from "../cards";
import { Hand } from "../hand";
import { Player } from "./Player";

export const CardComponent = ({ card }: { card: Card }) => {
  return <Text color={card[1] > 1 ? "red" : "#bbbbbb"}>&nbsp;{getCardName(card)}&nbsp;</Text>;
};

const colors = ["#332800", "#003333", "#330033"];
export const Meld = ({ cards, colorIndex }: { cards: Card[]; colorIndex: number }) => {
  return (
    <Box>
      <Text backgroundColor={colors[colorIndex % colors.length]}>
        {cards.map((c, i) => (
          <CardComponent key={`meld-card-${c[0]}-${c[1]}-${i}`} card={c} />
        ))}
      </Text>
    </Box>
  );
};

export const HandComponent = ({
  hand,
  playerIndex,
  hidden,
  showMelds,
}: {
  hand: Hand;
  playerIndex: number;
  hidden: boolean;
  showMelds: boolean;
}) => {
  const melds = [...hand.melds];
  return (
    <Box borderStyle="round" width="50%" flexDirection="column" minHeight={5}>
      <Box justifyContent="space-between" paddingBottom={1}>
        <Player playerIndex={playerIndex} />
        <Text>{!hidden ? `(Deadwood ${hand.score})` : null}</Text>
      </Box>
      <Box paddingBottom={1}>
        {!hidden && showMelds && melds.length > 0 ? (
          addSpaceBetween(melds.map((s, i) => <Meld key={`hand-comp-meld-${i}`} cards={s} colorIndex={i} />))
        ) : (
          <Text>&nbsp;</Text>
        )}
      </Box>
      <Box>
        {!hidden
          ? (showMelds ? hand.deadwood : hand.cards).map((c, i) => (
              <CardComponent key={`dead-${c[0]}-${c[1]}-${i}`} card={c} />
            ))
          : null}
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
