import { Text, useInput } from "ink";
import React, { useEffect, useState } from "react";
import { PlayerOne, PlayerTwo } from "../utils";
import { useCardSelection, useGame } from "./context";
import { takeDrawTurn, takeDiscardTurn } from "../computer-player";
import { Player, TurnPrompt } from "./Player";
import { CardComponent } from "./Card";
import { Hand } from "../hand";

export function InputSection({ forceRender }: { forceRender: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const [knocking, setKnocking] = useState(false);
  const [selectedAction, setSelectedAction] = useState<
    "pass" | "discard" | "stock" | null
  >(null);
  const { game, newGame } = useGame();
  const {
    changeCardSelection,
    selectedCard,
    setCardSelection,
    clearCardSelection,
  } = useCardSelection();

  const canKnock =
    new Hand([...game.hands[0].cards].filter((c) => c !== selectedCard))
      .score <= 10;

  useInput((input, key) => {
    const turnState = game.getNextTurnState();
    if (!game) {
      return;
    }
    if (key.ctrl && input === "r") {
      newGame();
      forceRender();
    }
    if (game.outcome && input === "y") {
      newGame();
      forceRender();
    }
    if (game.outcome) {
      return;
    }
    if (game.nextTurn === PlayerOne) {
      if (input === "k") {
        setKnocking(!knocking);
        return;
      }
      if (confirming) {
        if (!key.return) {
          setConfirming(false);
          setSelectedAction(null);
          return;
        }
      }
      if (game.nextAction === "discard") {
        if (key.leftArrow) {
          changeCardSelection("left");
          forceRender();
        }
        if (key.rightArrow) {
          changeCardSelection("right");
          forceRender();
        }
        if (key.return && selectedCard) {
          if (!confirming) {
            setConfirming(true);
          } else {
            game.handleAction({
              type: "discard",
              knock: knocking && canKnock,
              card: selectedCard,
              turn: turnState.turn,
              player: turnState.player,
            });
            clearCardSelection();
            setConfirming(false);
            setSelectedAction(null);
            forceRender();
          }
        }
      } else {
        try {
          const turnState = game.getNextTurnState();
          if (turnState.awaiting === "draw") {
            const drawFrom =
              game.stockAllowed && input === "s"
                ? "stock"
                : input === "d"
                ? "discard"
                : input === "p"
                ? "pass"
                : null;
            if (!confirming || !selectedAction) {
              if (!drawFrom) {
                return;
              }
              setSelectedAction(drawFrom);
              setConfirming(true);
            } else {
              game.handleAction({
                type: "draw",
                from: selectedAction,
                turn: turnState.turn,
                player: turnState.player,
              });
              setSelectedAction(null);
              setConfirming(false);
              if (game.hands[0].lastDraw) {
                setCardSelection(game.hands[0].lastDraw);
              }
            }
          }
        } catch (error) {
          console.error("Invalid input:", error.message);
        }
        forceRender();
      }
    }
  });

  function takeAITurn() {
    if (!game) {
      return;
    }
    if (game.nextTurn === PlayerTwo) {
      const turnState = game.getNextTurnState();
      if (turnState.awaiting === "draw") {
        game.handleAction(takeDrawTurn(turnState));
      } else {
        game.handleAction(takeDiscardTurn(turnState));
      }
      forceRender();
    }
  }
  useEffect(() => {
    setTimeout(() => {
      if (!game.outcome) {
        takeAITurn();
      }
    }, Math.random() * 500 + 200);
  }, [game.turnCount, game.nextAction, game]);
  if (game.outcome) {
    return (
      <>
        {game.outcome ? (
          <Text>
            <Player playerIndex={game.outcome.winner} />{" "}
            {game.outcome.gin
              ? "goes gin"
              : game.outcome.undercut
              ? "undercuts"
              : "knocks"}{" "}
            for {game.outcome.points} points!!!
          </Text>
        ) : null}
        <Text>Press "y" to start again.</Text>
      </>
    );
  }
  if (game.nextTurn === PlayerTwo) {
    return (
      <>
        <Text>
          <Player playerIndex={1} />
          's turn ...
        </Text>
      </>
    );
  }
  const promptForKnocking = canKnock ? (
    <Text>
      Your score will be low enough to knock.{" "}
      {knocking
        ? "Press K to cancel knocking"
        : "Press K to knock after discarding"}
    </Text>
  ) : null;
  if (game.nextAction === "draw") {
    return (
      <>
        <Text>Your turn. Draw a card.</Text>
        {confirming ? (
          <Text>
            Are you sure you want to{" "}
            {selectedAction === "pass"
              ? `pass`
              : `draw from ${selectedAction} pile`}
            ? (Press Enter to confirm. Any other key to return)
          </Text>
        ) : (
          <Text>
            Draw from the{game.stockAllowed ? " (s)tock pile" : ""}, (d)iscard
            pile, or (p)ass
          </Text>
        )}
      </>
    );
  }
  if (game.nextAction === "discard") {
    return (
      <>
        <Text>
          Your turn. Discard a card. Use arrow keys to change selection. Press
          Enter to proceed.
        </Text>
        {promptForKnocking}
        {confirming && selectedCard != null ? (
          <Text>
            Are you sure you want to discard
            <CardComponent card={selectedCard} />? (Press Enter to confirm. Any
            other key to return)
          </Text>
        ) : (
          <Text>
            Discard:{" "}
            {selectedCard != null ? (
              <CardComponent card={selectedCard} />
            ) : null}
          </Text>
        )}
      </>
    );
  }
  return (
    <>
      <TurnPrompt game={game} />
    </>
  );
}
