import { Key } from "ink";
import { Game } from "../game";

export function humanInput(game: Game, input: string, key: Key) {
  try {
    const turnState = game.getNextTurnState();
    if (turnState.awaiting === "draw") {
      const drawFrom = input === "1" ? "stock" : input === "2" ? "discard" : input === "3" ? "pass" : null;
      if (!drawFrom) {
        return;
      }
      game.handleAction({
        type: "draw",
        from: drawFrom,
        turn: turnState.turn,
        player: turnState.player,
      });
    }
    if (turnState.awaiting === "discard") {
      let selectedIndex = parseInt(input) - 1;
      if (selectedIndex === -1) {
        selectedIndex = 9;
      }
      if (isNaN(selectedIndex)) {
        selectedIndex = 10;
      }
      game.handleAction({
        type: "discard",
        knock: key.ctrl,
        card: turnState.hand[selectedIndex],
        turn: turnState.turn,
        player: turnState.player,
      });
    }
  } catch (error) {
    console.error("Invalid input", error);
  }
}
