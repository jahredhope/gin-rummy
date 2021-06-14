import { Hand } from "./hand";
import { DiscardAction, DrawAction, TurnState } from "./action";
import { getScore } from "./decks";

const getLast = <T>(arr: T[]): T => arr[arr.length - 1];

export function takeDrawTurn(state: TurnState): DrawAction {
  const hand = new Hand(state.hand);
  const scoreWithout = hand.score;
  hand.addCard(getLast(state.discard));
  hand.discard(hand.deadwood.length - 1);
  const scoreWithDiscard = hand.score;
  const from =
    state.stockAllowed && scoreWithout <= scoreWithDiscard
      ? "stock"
      : "discard";
  const action: DrawAction = {
    type: "draw",
    from,
    player: state.player,
    turn: state.turn,
  };
  return action;
}

export function takeDiscardTurn(state: TurnState): DiscardAction {
  const hand = new Hand(state.hand);
  const discarded = hand.discard(hand.cards.indexOf(getLast(hand.deadwood)));
  const expectedScore = getScore(hand.deadwood);
  const knock = expectedScore <= 10;
  const action: DiscardAction = {
    type: "discard",
    card: discarded,
    knock,
    player: state.player,
    turn: state.turn,
  };
  return action;
}
