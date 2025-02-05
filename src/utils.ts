import type { LotteryNumbers } from './App';

const POWERBALL_WINNINGS_TABLE: PowerballMatch[] = [
  {
    matches: 0,
    powerball: true,
    winnings: 4,
  },
  {
    matches: 1,
    powerball: true,
    winnings: 4,
  },
  {
    matches: 2,
    powerball: true,
    winnings: 7,
  },
  {
    matches: 3,
    powerball: false,
    winnings: 7,
  },
  {
    matches: 3,
    powerball: true,
    winnings: 100,
  },
  {
    matches: 4,
    powerball: false,
    winnings: 100,
  },
  {
    matches: 4,
    powerball: true,
    winnings: 50_000,
  },
  {
    matches: 5,
    powerball: false,
    winnings: 1_000_000,
  },
  {
    matches: 5,
    powerball: true,
    winnings: 2_000_000_000, // woah a billion dollars !!
  },
];

export function generateRandomNumbers(): {
  white: number[];
  powerball: number;
} {
  const white = new Set<number>();
  while (white.size < 5) {
    white.add(Math.floor(Math.random() * 69) + 1);
  }
  const powerball = Math.floor(Math.random() * 26) + 1;

  return {
    white: Array.from(white).sort((a, b) => a - b),
    powerball,
  };
}

export function checkWinnings(
  ticket: LotteryNumbers,
  winning: LotteryNumbers
): number {
  const whiteMatches = ticket.white.filter((num) =>
    winning.white.includes(num)
  ).length;
  const powerballMatch = ticket.powerball === winning.powerball;

  return determineWinner(
    POWERBALL_WINNINGS_TABLE,
    whiteMatches,
    powerballMatch
  );
}

type PowerballMatch = {
  matches: number;
  powerball: boolean;
  winnings: number;
};
function determineWinner(
  arr: PowerballMatch[],
  wb: number,
  pb: boolean
): number {
  if (wb <= 2 && !pb) return 0;
  if (!pb) {
    return Math.min(
      ...arr
        .filter(({ matches }) => matches === wb)
        .map(({ winnings }) => winnings)
    );
  }
  return arr.find(({ matches, powerball }) => matches === wb && powerball)
    .winnings;
}

if (import.meta.vitest) {
  const { it, describe, expect } = import.meta.vitest;

  describe('Utils — determineWinner', () => {
    it.each`
      whiteMatches | hasPowerball | expected
      ${0}         | ${false}     | ${0}
      ${2}         | ${false}     | ${0}
      ${0}         | ${true}      | ${4}
      ${0}         | ${true}      | ${4}
      ${1}         | ${true}      | ${4}
      ${2}         | ${true}      | ${7}
      ${3}         | ${false}     | ${7}
      ${3}         | ${true}      | ${100}
      ${4}         | ${false}     | ${100}
      ${4}         | ${true}      | ${50000}
      ${5}         | ${false}     | ${1000000}
      ${5}         | ${true}      | ${2000000000}
    `(
      'white balls: $whiteMatches \thas powerball: $hasPowerball \t winnings: $expected',
      ({
        whiteMatches,
        hasPowerball,
        expected,
      }: {
        whiteMatches: number;
        hasPowerball: boolean;
        expected: number;
      }) => {
        const result = determineWinner(
          POWERBALL_WINNINGS_TABLE,
          whiteMatches,
          hasPowerball
        );

        expect(result).toBe(expected);
      }
    );
  });
}
