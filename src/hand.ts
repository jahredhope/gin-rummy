import { Card } from "./cards";
import { getSets, getSequences, getScore, getAllMelds } from "./decks";

export class Hand {
  constructor(cards: Card[]) {
    this._cards = cards;
  }
  public lastDraw: Card | null = null;
  public lastDiscard: Card | null = null;
  private _cards: Card[];
  private _melds: Card[][] | null = null;
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
    this._melds = null;
    this._deadwood = null;
    this._score = null;
  }
  get melds(): Card[][] {
    if (this._melds === null) {
      this._melds = getAllMelds(this.cards);
    }
    return this._melds;
  }
  get deadwood() {
    if (this._deadwood === null) {
      this._deadwood = this.cards.filter(
        (c) => !this.melds.some((s) => s.includes(c))
      );
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
