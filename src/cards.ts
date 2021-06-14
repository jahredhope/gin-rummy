export type Rank = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export enum Suit {
  "spade" = 0,
  "club" = 1,
  "diamond" = 2,
  "heart" = 3,
}
export type Card = [Rank, Suit];

export const altSuitNames = ["S", "C", "D", "H"];
export const suitNames = ["♠", "♣", "♦", "♥"];
export const rankNames = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

export const getSuitName = (s: Suit) => suitNames[s];
export const getRankName = (r: Rank) => rankNames[r];
export const getCardName = (c: Card) => `${getRankName(c[0])}${getSuitName(c[1])}`;
