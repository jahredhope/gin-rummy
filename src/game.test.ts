import { getCardName } from "./cards";
import { getDeckFromString, getMelds, getShuffledDeck, printDeck } from "./decks";
import { playGame } from "./game";

describe("game", () => {
  test("should have player 1 win", () => {
    const deck = getDeckFromString(
      "K♣ A♥ 5♣ A♦ 8♣ A♣ 7♦ K♠ J♦ K♦ 6♦ K♥ 9♦ 9♥ 6♥ J♣ 8♠ 6♠ 10♣ 10♠ 3♦ 3♣ 2♥ 9♣ 2♣ J♥ 7♠ Q♣ 3♥ 3♠ J♠ 5♠ 5♦ 6♣ 7♣ 2♠ 4♣ 2♦ 4♥ 10♥ 8♥ 7♥ 4♠ Q♥ Q♠ 5♥ A♠ 9♠ Q♦ 10♦ 8♦ 4♦"
    );
    expect(playGame(deck)).toEqual(1);
  });

  test("should have player 2 win", () => {
    const deck = getDeckFromString(
      "8♥ 4♦ 3♦ 3♠ 10♠ 4♠ A♦ Q♦ 4♥ 5♦ A♠ A♣ K♣ 10♥ 6♠ 6♥ 7♣ 10♦ 4♣ K♠ 7♠ 9♠ J♣ 2♠ 3♣ 8♦ 6♣ 5♣ 10♣ K♦ 9♥ 7♥ 2♦ 6♦ J♦ 3♥ 9♦ 2♣ J♠ Q♣ K♥ J♥ Q♠ Q♥ 5♥ 8♣ 2♥ A♥ 9♣ 5♠ 8♠ 7♦"
    );
    expect(playGame(deck)).toEqual(-1);
  });
});

describe("hand", () => {
  test("all one sequence", () => {
    const hand = getDeckFromString("KH QH JH 10H 9H 8H");
    const res = getMelds(hand);
    expect(res.sequences).toHaveLength(1);
    expect(res.sequences[0]).toHaveLength(hand.length);
  });
  test("all sets", () => {
    const hand = getDeckFromString("5S 5H 5C 5D 7S 7H 7C 7D");
    const res = getMelds(hand);
    expect(res.sets).toHaveLength(2);
    expect(res.sets[0]).toHaveLength(4);
    expect(res.sets[1]).toHaveLength(4);
  });

  const tests: Array<[string, unknown]> = [
    [
      "7♥ 7♠ K♥ Q♦ 3♠ 2♠ 5♥ 5♦ 8♥ 9♦",
      {
        sequences: [],
        sets: [],
        unmatched: "2♠ 3♠ 5♦ 5♥ 7♠ 7♥ 8♥ 9♦ Q♦ K♥",
      },
    ],
    [
      "6♥ J♠ K♦ 3♣ 5♥ 7♥ 3♥ 9♥ A♥ A♦",
      {
        sequences: ["5♥ 6♥ 7♥"],
        sets: [],
        unmatched: "A♦ A♥ 3♣ 3♥ 9♥ J♠ K♦",
      },
    ],
    [
      "10♣ K♠ 8♣ A♦ 8♦ 8♥ 4♠ 10♦ 7♠ 9♠",
      {
        sequences: [],
        sets: ["8♣ 8♦ 8♥"],
        unmatched: "A♦ 4♠ 7♠ 9♠ 10♣ 10♦ K♠",
      },
    ],
  ];

  test.each(tests)("hands %#", (input: string, expectedResult: unknown) => {
    const hand = getDeckFromString(input);
    const res: any = getMelds(hand);
    res.sequences = res.sequences.map(printDeck);
    res.sets = res.sets.map(printDeck);
    res.unmatched = printDeck(res.unmatched);
    expect(res).toEqual(expectedResult);
  });
});
