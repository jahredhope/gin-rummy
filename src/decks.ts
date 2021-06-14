import { randomInt } from "crypto";

import {
  Card,
  Rank,
  Suit,
  rankNames,
  suitNames,
  altSuitNames,
  getCardName,
} from "./cards";

const USE_CRYPTO = false;

export function sortByRank(arr: Card[]) {
  return arr.sort((a, b) => a[1] + 4 * a[0] - (b[1] + 4 * b[0]));
}

export function shuffleDeck(arr: Card[]) {
  for (let i = 0; i < arr.length; i++) {
    const j = USE_CRYPTO
      ? randomInt(arr.length)
      : Math.floor(Math.random() * arr.length);
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

export function getDeck(): Card[] {
  const d: Card[] = [];

  for (let r: Rank = 0; r < 13; r++) {
    for (let s: Suit = 0; s < 4; s++) {
      d.push([r as Rank, s as Suit]);
    }
  }
  return d;
}

export function printDeck(deck: Card[]) {
  return sortByRank(deck).map(getCardName).join(" ");
}

export function getDeckFromString(str: string): Card[] {
  const result = str.split(/[ ,]+/).map((n) => {
    return [
      rankNames.indexOf(n.slice(0, -1)),
      -1 * suitNames.indexOf(n.slice(-1)) * altSuitNames.indexOf(n.slice(-1)),
    ];
  }) as Card[];
  return result;
}

export function getShuffledDeck() {
  const deck = getDeck();
  shuffleDeck(deck);
  shuffleDeck(deck);
  shuffleDeck(deck);
  return deck;
}

export function drawHands(
  deck: Card[],
  handSize: number = 10,
  handCount: number = 2
) {
  const hands: Card[][] = [];
  for (let h = 0; h < handCount; h++) {
    hands.push([]);
  }
  for (let c = 0; c < handSize; c++) {
    for (let h = 0; h < handCount; h++) {
      if (deck.length < 1) {
        throw new Error("Out of cards");
      }
      const drawnCard = deck.pop();
      hands[h].push(drawnCard!);
    }
  }
  return hands;
}

export function getSequences(hand: Card[]) {
  const sequences: Card[][] = [];
  const byRank = sortByRank(hand);

  const bySuits: Card[][] = [[], [], [], []];

  for (let i = 0; i < hand.length; i++) {
    bySuits[byRank[i][1]].push(byRank[i]);
  }

  for (let s = 0; s < 4; s++) {
    const cards = bySuits[s];
    const minForMeld = 3;
    let count = 1;
    let lastValue = byRank[0][0];
    for (let i = 1; i <= cards.length; i++) {
      if (cards[i] && cards[i][0] === lastValue + 1) {
        count++;
        lastValue = cards[i][0];
      } else {
        if (count >= minForMeld) {
          const found = cards.slice(i - count, i);
          sequences.push(found);
        }
        count = 1;
        lastValue = cards[i]?.[0];
      }
    }
  }
  return sequences;
}
export function getSets(hand: Card[]) {
  const sets: Card[][] = [];
  const byRank = sortByRank(hand);

  const minForMeld = 3;
  let sameCount = 1;
  let lastValue = byRank[0][0];
  for (let i = 1; i <= byRank.length; i++) {
    if (byRank[i]?.[0] === lastValue) {
      sameCount++;
    } else {
      if (sameCount >= minForMeld) {
        const foundSet = byRank.slice(i - sameCount, i);
        sets.push(foundSet);
      }
      sameCount = 1;
      lastValue = byRank[i]?.[0];
    }
  }
  return sets;
}
export function getMelds(hand: Card[]) {
  const sets = getSets(hand);
  const sequences = getSequences(hand);
  return {
    sets,
    sequences,
    unmatched: hand.filter(
      (c) =>
        !sets.some((s) => s.includes(c)) &&
        !sequences.some((s) => s.includes(c))
    ),
  };
}

export function getScore(cards: Card[]) {
  let score = 0;
  for (const card of cards) {
    score += Math.min(card[0], 9) + 1;
  }
  return score;
}
