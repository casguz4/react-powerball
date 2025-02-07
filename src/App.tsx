import { useRef, useState } from "react";
import { Coins, Ticket, Play, RotateCcw, Trash2 } from "lucide-react";
import { generateRandomNumbers, checkWinnings } from "./powerball-winner";
import DepositModal from "./components/DepositModal";
import NumberSelector from "./components/NumberSelector";
import WinningReveal from "./components/WinningReveal";
import { Input } from "./components/ui/input";

export type LotteryNumbers = {
  white: number[];
  powerball: number;
  id: string; // Add unique identifier for each ticket
};

function makeDrawNumbers(lottery: LotteryNumbers) {
  const nameIterator = new Set([...lottery.white, lottery.powerball]).values();
  return () => {
    return nameIterator.next().value;
  };
}

const mock = makeDrawNumbers({ white: [], powerball: 0, id: "mock" });

function a(tickets, setWinAmounts, setBalance) {
  const newWinAmounts: Record<string, number> = {};
  let totalWinnings = 0;

  tickets.forEach((ticket) => {
    const prize = checkWinnings(ticket, drawn);
    newWinAmounts[ticket.id] = prize;
    totalWinnings += prize;
  });

  setWinAmounts(newWinAmounts);
  setBalance((prev) => prev + totalWinnings);
}
function App() {
  const [balance, setBalance] = useState(100);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [tickets, setTickets] = useState<LotteryNumbers[]>([]);
  const [isManualSelection, setIsManualSelection] = useState(false);
  const [winningNumbers, setWinningNumbers] = useState<LotteryNumbers | null>(
    null,
  );
  const [winAmounts, setWinAmounts] = useState<Record<string, number>>({});
  const [slowReveal, setSlowReveal] = useState(false);
  const [drawnNumbers, setDrawnNumbers] = useState<LotteryNumbers | null>(null);
  const [ticketsToBuy, setTicketsToBuy] = useState(1);
  const numberRef = useRef(mock);
  const inputRef = useRef(1);

  const buyTicket = (numbers: Omit<LotteryNumbers, "id">) => {
    if (balance < balance / (ticketsToBuy * 2)) {
      setShowDepositModal(true);
      return;
    }
    const newTicket = {
      ...numbers,
      id: crypto.randomUUID(),
    };
    setBalance((prev) => prev - 2);
    setTickets((prev) => [...prev, newTicket]);
    setWinningNumbers(null);
    setWinAmounts({});
  };

  const handleQuickPick = () => {
    buyTicket(generateRandomNumbers());
  };

  const drawNumber = () => {
    if (!drawnNumbers) {
      const drawn = {
        ...generateRandomNumbers(),
        id: "winning",
      };
      setDrawnNumbers(drawn);
      const getNumber = makeDrawNumbers(drawn);
      const n = getNumber();
      setWinningNumbers({
        white: [n!],
        powerball: "",
        id: "winning",
      } as unknown as LotteryNumbers);
      numberRef.current = getNumber;
      return;
    }
    const newNumber = numberRef.current();
    if (!newNumber) return;

    const white = [...winningNumbers.white];
    let powerball = "";
    if (white.length < 5) {
      white.push(newNumber);
    } else {
      powerball = newNumber;
    }

    setWinningNumbers({
      id: "winning",
      white,
      powerball,
    });
    a(tickets, setWinAmounts, setBalance);
  };

  const runLottery = () => {
    if (tickets.length === 0) return;
    const drawn =
      slowReveal && drawnNumbers
        ? drawnNumbers
        : { ...generateRandomNumbers(), id: "winning" };

    setWinningNumbers(drawn);

    a(tickets, setWinAmounts, setBalance);
  };

  const handleDeposit = (amount: number) => {
    setBalance((prev) => prev + amount);
    setShowDepositModal(false);
  };

  const removeTicket = (ticketId: string) => {
    setTickets((prev) => prev.filter((ticket) => ticket.id !== ticketId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Powerball Simulator</h1>
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
            <Coins className="text-yellow-400" />
            <span className="text-xl font-semibold">${balance.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm mb-8">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setIsManualSelection(false)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                !isManualSelection ? "bg-blue-600" : "bg-white/10"
              }`}
            >
              <RotateCcw size={20} />
              Quick Pick
            </button>
            <button
              onClick={() => setIsManualSelection(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                isManualSelection ? "bg-blue-600" : "bg-white/10"
              }`}
            >
              <Ticket size={20} />
              Pick Numbers
            </button>
          </div>

          {isManualSelection ? (
            <NumberSelector onSubmit={buyTicket} />
          ) : (
            <div className="flex justify-center">
              <Input
                value={ticketsToBuy}
                onChange={(value) => {
                  setTicketsToBuy(value);
                }}
              />
              <button
                onClick={handleQuickPick}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg flex items-center gap-2 text-lg font-semibold"
              >
                <Ticket />
                Buy Quick Pick Ticket ($2)
              </button>
            </div>
          )}
        </div>

        {tickets.length > 0 && (
          <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm mb-8">
            <input
              disabled={slowReveal && !!winningNumbers}
              onChange={() => {
                setSlowReveal(!slowReveal);
              }}
              id="one at a time"
              type="checkbox"
              name="slow_reveal"
            />
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Your Tickets</h2>
              <button
                onClick={slowReveal ? drawNumber : runLottery}
                className="max-w-[210px] w-full bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg flex align-center gap-2 text-lg font-semibold"
              >
                <Play />
                Draw {slowReveal ? "Number" : "Numbers"}
              </button>
            </div>
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between bg-white/5 p-4 rounded-lg"
                >
                  <div className="flex gap-2">
                    {ticket.white.map((num, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-white text-blue-900 flex items-center justify-center font-bold text-lg"
                      >
                        {num}
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-lg">
                      {ticket.powerball}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {winAmounts[ticket.id] > 0 && (
                      <span className="text-green-400 font-semibold">
                        +${winAmounts[ticket.id].toLocaleString()}
                      </span>
                    )}
                    <button
                      onClick={() => removeTicket(ticket.id)}
                      className="text-red-400 hover:text-red-300"
                      title="Remove ticket"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {winningNumbers && (
          <WinningReveal
            winningNumbers={winningNumbers}
            tickets={tickets}
            winAmounts={winAmounts}
          />
        )}

        <DepositModal
          isOpen={showDepositModal}
          onClose={() => setShowDepositModal(false)}
          onDeposit={handleDeposit}
        />
      </div>
    </div>
  );
}

export default App;
