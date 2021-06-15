import React, { useContext, useReducer, useState } from "react";
import { Box } from "ink";
import { PlayerHand } from "./Card";
import { LogSection } from "./LogSection";
import { DiscardSection } from "./DiscardSection";
import { StockSection } from "./StockSection";
import { GameSummary } from "./GameSummary";
import { MultiHandDisplay } from "./MultiHandDisplay";
import { InputSection } from "./InputSection";
import { WelcomePage } from "./WelcomePage";
import {
  ConfigProvider,
  GameProvider,
  SelectionProvider,
  useConfig,
  useGame,
} from "./context";

const GameContent = () => {
  const { game } = useGame();
  const [, forceRender] = useReducer((s) => s + 1, 0);
  const { cheatMode } = useConfig();
  return (
    <Box flexDirection="column">
      <GameSummary />
      {game.outcome || cheatMode ? <MultiHandDisplay /> : null}
      {!game.outcome || cheatMode ? <PlayerHand /> : null}
      {cheatMode ? <StockSection /> : null}
      <DiscardSection />
      <LogSection />
      <InputSection forceRender={forceRender} />
    </Box>
  );
};

export const App = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  return (
    <ConfigProvider>
      <GameProvider>
        <SelectionProvider>
          {showWelcome ? (
            <WelcomePage onReady={() => setShowWelcome(false)} />
          ) : (
            <GameContent />
          )}
        </SelectionProvider>
      </GameProvider>
    </ConfigProvider>
  );
};
