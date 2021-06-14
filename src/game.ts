import { Card } from "./cards";
import { Hand } from "./hand";
import { drawHands, getShuffledDeck } from "./decks";
import { Action, DiscardAction, DrawAction, TurnState } from "./action";
import { otherPlayer, PlayerIndex, PlayerOne, PlayerTwo, expect } from "./utils";

export class Game {
  constructor() {
    this.deck = getShuffledDeck();
    this.discardPile = [this.deck.pop()!];
    const [handOne, handTwo] = drawHands(this.deck);
    this.hands = [new Hand(handOne), new Hand(handTwo)];
    this.nextTurn = Math.random() > 0.5 ? PlayerOne : PlayerTwo;
  }
  public turnCount = 1;
  public turns: Action[] = [];
  nextTurn: PlayerIndex;
  nextAction: "draw" | "discard" = "draw";
  private stockAllowed = false;
  hands: [Hand, Hand];
  deck: Card[];
  discardPile: Card[];
  outcome?: {
    winner: PlayerIndex;
    points: number;
  };
  getNextTurnState(): TurnState {
    return {
      awaiting: this.nextAction,
      turn: this.turnCount,
      player: this.nextTurn,
      hand: [...this.hands[this.nextTurn].cards],
      discard: this.discardPile,
      stockAllowed: this.stockAllowed,
      stockSize: this.deck.length,
    };
  }
  handleAction(turn: Action) {
    if (this.outcome) {
      throw new Error("Attempted to take a turn after game has ended");
    }
    this.turns.push(turn);
    if (turn.type === "discard") {
      this.handleDiscardAction(turn);
    }
    if (turn.type === "draw") {
      this.handleDrawAction(turn);
    }
  }
  private handleDrawAction(turn: DrawAction) {
    expect("Turn count", turn.turn, this.turnCount);
    expect("Turn player", turn.player, this.nextTurn);
    let newCard: Card | undefined;
    if (turn.from === "pass") {
      this.handleEndTurn();
      return;
    }
    this.stockAllowed = true;
    if (turn.from === "stock") {
      newCard = this.deck.pop();
    } else if (turn.from === "discard") {
      newCard = this.discardPile.pop();
    }
    this.hands[turn.player].addCard(newCard!);
    this.nextAction = "discard";
  }
  private handleDiscardAction(turn: DiscardAction) {
    expect("Turn count", turn.turn, this.turnCount);
    expect("Turn player", turn.player, this.nextTurn);
    const hand = this.hands[turn.player];
    const indexToDiscard = hand.cards.indexOf(turn.card);
    if (indexToDiscard === -1) {
      throw new Error(`Attempted to discard a card not in hand. Card ${turn.card}`);
    }
    const discardedCard = hand.discard(indexToDiscard);
    this.discardPile.push(discardedCard);
    if (turn.knock) {
      if (this.hands[turn.player].score > 10) {
        throw new Error(`Attempted to knock with score greater than 10. Score ${this.hands[turn.player].score}`);
      }
      this.handleKnock(turn);
    }
    this.handleEndTurn();
  }
  handleEndTurn() {
    this.turnCount++;
    this.nextTurn = otherPlayer(this.nextTurn);
    this.nextAction = "draw";
  }
  handleKnock(turn: DiscardAction) {
    let player1Score = this.hands[0].score;
    let player2Score = this.hands[1].score;

    let undercut = false;

    // Score difference
    // Negative: Player one had a lower score
    // Positive: Player two had a lower score
    const scoreDifference = player1Score - player2Score;
    let score = Math.abs(scoreDifference);
    if (this.hands[turn.player].score === 0) {
      // Gin
      score += 20;
    } else if (
      scoreDifference === 0 ||
      (scoreDifference > 0 && turn.player === PlayerOne) ||
      (scoreDifference < 0 && turn.player === PlayerTwo)
    ) {
      // Undercut
      undercut = true;
      score += 10;
    }
    this.outcome = {
      winner: undercut ? otherPlayer(turn.player) : turn.player,
      points: score,
    };
  }
}
