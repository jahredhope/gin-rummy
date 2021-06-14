import { Card } from "./cards";

type PlayerIndex = 0 | 1;

export type Ordered = { turn: number; player: PlayerIndex };
export type DrawAction = { type: "draw"; from: "discard" | "stock" | "pass" } & Ordered;
export type DiscardAction = { type: "discard"; card: Card; knock: Boolean } & Ordered;
export type Action = DrawAction | DiscardAction;

export interface TurnState {
  awaiting: "draw" | "discard";
  hand: Card[];
  discard: Card[];
  stockSize: number;
  turn: number;
  player: PlayerIndex;
  stockAllowed: boolean;
}
