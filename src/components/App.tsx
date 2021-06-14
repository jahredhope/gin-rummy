import React, { useReducer, useState } from "react";
import { Box } from "ink";
import { PlayerHand } from "./Card";
import { LogSection } from "./Log";
import { DiscardSection } from "./DiscardSection";
import { GameSummary } from "./GameSummary";
import { MultiHandDisplay } from "./MultiHandDisplay";
import { InputSection } from "./InputSection";
import { WelcomePage } from "./WelcomePage";
import {
  GameProvider,
  SelectionProvider,
  useCardSelection,
  useGame,
} from "./context";

const GameContent = () => {
  const { game } = useGame();
  const [, forceRender] = useReducer((s) => s + 1, 0);
  return (
    <Box flexDirection="column">
      <GameSummary />
      {game.outcome ? (
        <MultiHandDisplay />
      ) : (
        <PlayerHand hand={game.hands[0]} playerIndex={0} />
      )}
      <DiscardSection />
      <LogSection />
      <InputSection forceRender={forceRender} />
    </Box>
  );
};

export const App = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  return (
    <GameProvider>
      <SelectionProvider>
        {showWelcome ? (
          <WelcomePage onReady={() => setShowWelcome(false)} />
        ) : (
          <GameContent />
        )}
      </SelectionProvider>
    </GameProvider>
  );
};
