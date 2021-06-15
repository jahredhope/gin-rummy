import { getDeckFromString } from "./decks";
import { Hand } from "./hand";

const testCases = {
  sequenceFromFirstInSuit: "2♦  2♥  3♠  4♣  5♣  6♠  6♣  8♦  9♣  J♥  Q♠",
  noMelds: "A♣  2♦  3♦  5♣  7♠  7♥  9♣  J♠  Q♣  K♠",
  jackSet: "A♥  3♦  6♥  8♣  8♦  9♠  10♣   J♠  J♣  J♦",
  diamondSequence: " A♣  2♦  3♦  6♠  6♦  8♥   10♦  J♦  Q♦  K♦",
  allHearts: "A♥  2♥  3♥  4♥  5♥  6♥  7♥  8♥  9♥  10♥",
  overlappingMelds1: "AH 2H 3H 4H AS 2S AD 2D AC 2C",
  overlappingMelds2: "AH 2H 3H 4H 5H 2S AD 2D AC 2C",
  singleOverlap: "3H 4H 5H 7H 8H 9H 6D 6H 6C 6S",
};

const table = [
  {
    testName: "noMelds",
    testString: testCases.noMelds,
    expectedMelds: 0,
    expectedDeadwood: 10,
    expectedPoints: 64,
  },
  {
    testName: "sequenceFromFirstInSuit",
    testString: testCases.sequenceFromFirstInSuit,
    expectedMelds: 1,
    expectedDeadwood: 8,
    expectedPoints: 50,
  },
  {
    testName: "jackSet",
    testString: testCases.jackSet,
    expectedMelds: 1,
    expectedDeadwood: 7,
    expectedPoints: 45,
  },
  {
    testName: "diamondSequence",
    testString: testCases.diamondSequence,
    expectedMelds: 1,
    expectedDeadwood: 6,
    expectedPoints: 26,
  },
  {
    testName: "allHearts",
    testString: testCases.allHearts,
    expectedMelds: 1,
    expectedDeadwood: 0,
    expectedPoints: 0,
  },
  {
    testName: "overlappingMelds1",
    testString: testCases.overlappingMelds1,
    expectedMelds: 2,
    expectedDeadwood: 2,
    expectedPoints: 7,
  },
  {
    testName: "overlappingMelds2",
    testString: testCases.overlappingMelds2,
    expectedMelds: 1,
    expectedDeadwood: 5,
    expectedPoints: 8,
  },
  {
    testName: "singleOverlap",
    testString: testCases.singleOverlap,
    expectedMelds: 1,
    expectedDeadwood: 3,
    expectedPoints: 18,
  },
];

describe("Hand", () => {
  it.each(table)(
    "$testName should have $expectedMelds melds, $expectedDeadwood deadwood worth $expectedPoints points",
    ({
      testName,
      testString,
      expectedPoints,
      expectedDeadwood,
      expectedMelds,
    }) => {
      const cards = getDeckFromString(testString);
      const hand = new Hand(cards);
      expect(hand.melds).toHaveLength(expectedMelds);
      expect(hand.deadwood).toHaveLength(expectedDeadwood);
      expect(hand.score).toEqual(expectedPoints);
    }
  );
});
