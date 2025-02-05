import type { LotteryNumbers } from "./App";

// Powerball prize table
// if (whiteMatches === 5 && powerballMatch) return 2_000_000_000; // Jackpot (estimated)
// if (whiteMatches === 5) return 1_000_000;
// if (whiteMatches === 4 && powerballMatch) return 50_000;
// if (whiteMatches === 4) return 100;
// if (whiteMatches === 3 && powerballMatch) return 100;
// if (whiteMatches === 3) return 7;
// if (whiteMatches === 2 && powerballMatch) return 7;
// if (whiteMatches === 1 && powerballMatch) return 4;
// if (powerballMatch) return 4;
// return 0;
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
    winnings: 1_000_000_000, // woah a billion dollars !!
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
  winning: LotteryNumbers,
): number {
  const whiteMatches = ticket.white.filter((num) =>
    winning.white.includes(num),
  ).length;
  const powerballMatch = ticket.powerball === winning.powerball;

  return determineWinner(
    POWERBALL_WINNINGS_TABLE,
    whiteMatches,
    powerballMatch,
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
  pb: boolean,
): number {
  if (wb <= 2 && !pb) return 0;
  if (!pb) {
    return Math.min(
      ...arr
        .filter(({ matches }) => matches === wb)
        .map(({ winnings }) => winnings),
    );
  }
  return arr.find(({ matches, powerball }) => matches === wb && powerball == pb)
    ?.winnings!;
}

