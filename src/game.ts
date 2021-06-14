import { trace } from "./log";
import { Card, getCardName } from "./cards";
import { sortByRank, getMelds, getScore, drawHands, getShuffledDeck, printDeck, getSequences, getSets } from "./decks";

export function takeTurn(hand: Card[], deck: Card[], discard: Card[]) {
  trace("Old Hand", printDeck(hand));
  const newCard = deck.pop()!;
  hand.push(newCard);

  const afterDraw = getMelds(hand);
  if (afterDraw.unmatched.length === 0) {
    return "gin";
  }
  const removed = hand.splice(hand.indexOf(afterDraw.unmatched[0]), 1);
  discard.push(...removed);

  trace("Draw", getCardName(newCard), " => ", "Discard", getCardName(removed[0]));

  trace("New Hand", printDeck(hand));

  const afterDiscard = getMelds(hand);
  if (getScore(afterDiscard.unmatched) <= 10) {
    trace("Unmatched score", getScore(afterDiscard.unmatched), "with", printDeck(afterDiscard.unmatched));
    return "knock";
  }
  return undefined;
}

function printAll(name: string, arr: Card[]) {
  trace(name, `(${arr.length})`);
  trace("Hand  ", sortByRank(arr).map(getCardName).join(" "));
  const { sets, sequences, unmatched } = getMelds(arr);
  if (sets.length) {
    trace("Sets", sets.map((s) => s.map(getCardName).join(" ")).join(" | "));
  } else {
    ("No Sets");
  }
  if (sequences.length) {
    trace("Sequences", sequences.map((s) => s.map(getCardName).join(" ")).join(" | "));
  } else {
    ("No Sequences");
  }
  trace("Unmatched", unmatched.map(getCardName).join(" "));
  trace("Score", getScore(unmatched));
  return getScore(unmatched);
}

export function playGame(deck?: Card[], playerCount = 2, handSize = 10) {
  deck ||= getShuffledDeck();
  const discard: Card[] = [];
  trace("Dealing...");
  const [handOne, handTwo] = drawHands(deck, handSize, playerCount);
  for (let i = 0; i < 1000; i++) {
    if (deck.length < 1) {
      trace("Deck runs out");
      break;
    }
    trace("\n --- Turn: Player 1 ---");
    if (takeTurn(handOne, deck, discard)) {
      trace("Player 1 knocks");
      break;
    }
    trace("\n --- Turn: Player 2 ---");
    if (takeTurn(handTwo, deck, discard)) {
      trace("Player 2 knocks");
      break;
    }
    if (i > 100) {
      trace("Ending game manually");
      break;
    }
  }

  trace("\n----- ----- -----\n");

  const PlayerOneScore = printAll("Player One", handOne);

  trace("\n----- ----- -----\n");

  const PlayerTwoScore = printAll("Player Two", handTwo);

  trace("\n----- ----- -----\n");

  if (PlayerOneScore > PlayerTwoScore) {
    trace("Player One Wins!!!");
    return 1;
  } else if (PlayerTwoScore > PlayerOneScore) {
    trace("Player Two Wins!!!");
    return -1;
  } else {
    trace("It's a draw!!!");
    return 0;
  }
}
type HandState = "in-progress" | "knock" | "gin";
export class Hand {
  constructor(name: string, cards: Card[]) {
    this.name = name;
    this._cards = cards;
  }
  public name: string;
  public state: HandState = "in-progress";
  public lastDraw: Card | null = null;
  public lastDiscard: Card | null = null;
  private _cards: Card[];
  private _sets: Card[][] | null = null;
  private _sequences: Card[][] | null = null;
  private _score: number | null = null;
  private _deadwood: Card[] | null = null;
  get cards() {
    return this._cards;
  }
  addCard(card: Card) {
    this.clearCache();
    this.lastDraw = card;
    this._cards.push(card);
  }
  discard(index: number) {
    this.clearCache();
    const toDiscard = this._cards.splice(index, 1)[0];
    this.lastDiscard = toDiscard;
    return toDiscard;
  }
  private clearCache() {
    this._sets = null;
    this._sequences = null;
    this._deadwood = null;
    this._score = null;
  }
  private get sets() {
    if (this._sets === null) {
      this._sets = getSets(this.cards);
    }
    return this._sets;
  }
  private get sequences() {
    if (this._sequences === null) {
      this._sequences = getSequences(this.cards);
    }
    return this._sequences;
  }
  get melds() {
    return [...this.sets, ...this.sequences];
  }
  get deadwood() {
    if (this._deadwood === null) {
      this._deadwood = this.cards.filter((c) => !this.melds.some((s) => s.includes(c)));
    }
    return this._deadwood;
  }
  get score() {
    if (this._score === null) {
      this._score = getScore(this.deadwood);
    }
    return this._score;
  }
}

interface TurnLogEntry {
  turn: number;
  player: string;
  discarded: Card;
  drew: Card;
}
export class Game {
  constructor() {
    this.deck = getShuffledDeck();
    this.discardPile = [this.deck.pop()!];
    const [handOne, handTwo] = drawHands(this.deck);
    this.hands = [new Hand("Player One", handOne), new Hand("Player Two", handTwo)];
    this.nextTurn = Math.random() > 0.5 ? Players.PlayerOne : Players.PlayerTwo;
  }
  public turnCount = 0;
  public turns: TurnLogEntry[] = [];
  private nextTurn: Players.PlayerOne | Players.PlayerTwo;
  hands: [Hand, Hand];
  deck: Card[];
  discardPile: Card[];
  takeAITurn() {
    const hand = this.hands[this.nextTurn];
    let newCard: Card | undefined;
    if (Math.random() > 0.3) {
      newCard = this.deck.pop();
    } else {
      newCard = this.discardPile.pop();
    }
    if (!newCard) {
      return "game-over";
    }
    hand.addCard(newCard);

    if (hand.deadwood.length === 0) {
      hand.state = "gin";
      return "gin";
    }
    const toDiscard = hand.deadwood[hand.deadwood.length - 1];
    const removed = hand.discard(hand.cards.indexOf(toDiscard));
    this.discardPile.push(removed);

    if (getScore(hand.deadwood) <= 10) {
      hand.state = "knock";
      return "knock";
    }

    return undefined;
  }
  takeTurn() {
    const result = this.takeAITurn();

    this.turnCount++;
    const hand = this.hands[this.nextTurn];
    this.turns.push({
      turn: this.turnCount,
      player: hand.name,
      discarded: hand.lastDiscard!,
      drew: hand.lastDraw!,
    });
    this.nextTurn = this.nextTurn === Players.PlayerOne ? Players.PlayerTwo : Players.PlayerOne;
    return result;
  }
  get lastTurn() {
    if (this.turns.length === 0) {
      return null;
    }
    return this.turns[this.turns.length - 1];
  }
  get gameState(): { result: HandState; winner?: string; points?: number } {
    for (let playerIndex = 0; playerIndex < 2; playerIndex++) {
      if (this.hands[playerIndex].state === "gin" || this.hands[playerIndex].state === "knock") {
        return {
          result: this.hands[playerIndex].state,
          winner: this.hands[playerIndex].name,
          points:
            this.hands[playerIndex === 0 ? 1 : 0].score -
            this.hands[playerIndex].score +
            (this.hands[playerIndex].state === "gin" ? 20 : 0),
        };
      }
    }
    return {
      result: "in-progress",
    };
  }
}

export enum Players {
  PlayerOne,
  PlayerTwo,
}
