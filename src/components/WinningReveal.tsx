import type { LotteryNumbers } from "../App";
import { Trophy } from "lucide-react";

type WinningRevealProps = {
  winningNumbers: LotteryNumbers;
  tickets: LotteryNumbers[];
  winAmounts: Record<string, number>;
};

function WinningReveal({
  winningNumbers,
  tickets,
  winAmounts,
}: WinningRevealProps) {
  const totalWinnings = Object.values(winAmounts).reduce(
    (sum, amount) => sum + amount,
    0,
  );
  const winningTickets = tickets.filter((ticket) => winAmounts[ticket.id] > 0);

  return (
    <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm">
      <h2 className="text-2xl font-semibold mb-4">Drawing Results</h2>

      <div className="mb-6">
        <h3 className="text-lg mb-2">Winning Numbers:</h3>
        <div className="flex gap-2">
          {winningNumbers.white.map((num, i) => (
            <div
              key={i}
              className="w-12 h-12 rounded-full bg-white text-blue-900 flex items-center justify-center font-bold text-xl"
            >
              {num}
            </div>
          ))}
          <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xl">
            {winningNumbers.powerball}
          </div>
        </div>
      </div>

      <div className="text-center">
        {totalWinnings > 0 ? (
          <div className="bg-green-600/20 p-4 rounded-lg">
            <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold mb-2">Congratulations!</p>
            <p className="text-xl mb-4">
              Total Winnings: ${totalWinnings.toLocaleString()}
            </p>
            <p className="text-lg">
              {winningTickets.length} winning{" "}
              {winningTickets.length === 1 ? "ticket" : "tickets"}
            </p>
          </div>
        ) : (
          <div className="bg-red-600/20 p-4 rounded-lg">
            <p className="text-xl">Better luck next time!</p>
            <p className="text-lg mt-2">No winning tickets this round</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default WinningReveal;

