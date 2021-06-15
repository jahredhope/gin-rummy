import React, { ReactNode } from "react";
import { Box, Text, useFocus, useInput } from "ink";
import { Card, getCardName } from "../cards";
import { Hand } from "../hand";
import { Player } from "./Player";
import { useCardSelection, useGame } from "./context";

export const CardComponent = ({
  card,
  highlightSelected,
}: {
  card: Card;
  highlightSelected?: boolean;
}) => {
  if (!card) {
    console.error("Not sure how, but no card was passed");
    return null;
  }
  const { selectedCard } = useCardSelection();
  const isFocused = highlightSelected && card === selectedCard;
  return (
    <Text
      bold={isFocused}
      color={
        card[1] > 1
          ? isFocused
            ? "#ff0000"
            : "#ee2222"
          : isFocused
          ? "#f2f2f2"
          : "#dddddd"
      }
    >
      &nbsp;
      <Text
        // backgroundColor={isFocused ? "#444444" : undefined}
        underline={isFocused}
      >
        {getCardName(card)}
      </Text>
      &nbsp;
    </Text>
  );
};

const colors = ["#241808", "#081d1d", "#1d081d"];
export const Meld = ({
  children,
  colorIndex,
}: {
  children: ReactNode;
  colorIndex: number;
}) => {
  return (
    <Box>
      <Text backgroundColor={colors[colorIndex % colors.length]}>
        {children}
      </Text>
    </Box>
  );
};

export const PlayerHand = () => {
  const { game } = useGame();
  const hand = game.hands[0];
  const melds = [...hand.melds];
  if (hand.deadwood.length) {
    melds.unshift(hand.deadwood);
  }
  return (
    <Box borderStyle="round" width="100%" flexDirection="column" minHeight={5}>
      <Box justifyContent="space-between" paddingBottom={1}>
        <Player playerIndex={0} />
      </Box>
      <Box>
        {melds.length > 0 ? (
          addSpaceBetween(
            melds.map((s, i) => (
              <Meld key={`hand-comp-meld-${i}`} colorIndex={i}>
                {s.map((c, i) => (
                  <CardComponent
                    key={`meld-card-${c[0]}-${c[1]}-${i}`}
                    card={c}
                    highlightSelected={true}
                  />
                ))}
              </Meld>
            ))
          )
        ) : (
          <Text>&nbsp;</Text>
        )}
      </Box>
    </Box>
  );
};

export const HandComponent = ({
  hand,
  playerIndex,
  hidden,
}: {
  hand: Hand;
  playerIndex: number;
  hidden: boolean;
}) => {
  const melds = [...hand.melds];
  if (hand.deadwood.length) {
    melds.unshift(hand.deadwood);
  }
  return (
    <Box borderStyle="round" width="50%" flexDirection="column" minHeight={5}>
      <Box justifyContent="space-between" paddingBottom={1}>
        <Player playerIndex={playerIndex} />
        <Text>{!hidden ? `(Deadwood ${hand.score})` : null}</Text>
      </Box>
      <Box paddingBottom={1}>
        {!hidden && melds.length > 0 ? (
          addSpaceBetween(
            melds.map((s, i) => (
              <Meld key={`hand-comp-meld-${i}`} colorIndex={i}>
                {s.map((c, i) => (
                  <CardComponent
                    key={`meld-card-${c[0]}-${c[1]}-${i}`}
                    card={c}
                  />
                ))}
              </Meld>
            ))
          )
        ) : (
          <Text>&nbsp;</Text>
        )}
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
