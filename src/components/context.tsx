import React, { createContext, ReactNode, useContext, useState } from "react";
import { Card } from "../cards";
import { Game } from "../game";

// @ts-expect-error Allow erroneous default
const gameContext = createContext<{ game: Game; newGame: () => void }>(null);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [game, setGame] = useState(() => {
    return new Game();
  });

  return (
    <gameContext.Provider value={{ game, newGame: () => setGame(new Game()) }}>
      {children}
    </gameContext.Provider>
  );
};

export const useGame = () => {
  return useContext(gameContext);
};

const selectionContext = createContext<{
  selectedCard: Card | null;
  setCardSelection: (card: Card) => void;
  changeCardSelection: (direction: "left" | "right") => void;
  clearCardSelection: () => void;
} | null>(null);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const { game } = useGame();
  const [selectedCard, setSelectedCard] = useState<Card | null>(
    game.hands[0].cards[0]
  );

  return (
    <selectionContext.Provider
      value={{
        selectedCard: selectedCard || null,
        setCardSelection: (card: Card) => setSelectedCard(card),
        changeCardSelection: (direction: "left" | "right") => {
          const hand = game!.hands[0];
          let newIndex = 0;
          if (selectedCard) {
            const currentIndex = hand.cards.indexOf(selectedCard);
            if (currentIndex !== -1) {
              newIndex =
                (currentIndex +
                  (direction === "left" ? -1 : 1) +
                  hand.cards.length) %
                hand.cards.length;
            }
          }
          setSelectedCard(hand.cards[newIndex]);
        },
        clearCardSelection: () => {
          setSelectedCard(null);
        },
      }}
    >
      {children}
    </selectionContext.Provider>
  );
}

export const useCardSelection = () => {
  return useContext(selectionContext)!;
};
