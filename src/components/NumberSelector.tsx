import React, { useState } from 'react';
import type { LotteryNumbers } from '../App';

type NumberSelectorProps = {
  onSubmit: (numbers: LotteryNumbers) => void;
};

function NumberSelector({ onSubmit }: NumberSelectorProps) {
  const [selectedWhite, setSelectedWhite] = useState<number[]>([]);
  const [selectedPowerball, setSelectedPowerball] = useState<number | null>(null);

  const handleWhiteNumberClick = (num: number) => {
    if (selectedWhite.includes(num)) {
      setSelectedWhite(prev => prev.filter(n => n !== num));
    } else if (selectedWhite.length < 5) {
      setSelectedWhite(prev => [...prev, num].sort((a, b) => a - b));
    }
  };

  const handleSubmit = () => {
    if (selectedWhite.length === 5 && selectedPowerball !== null) {
      onSubmit({
        white: selectedWhite,
        powerball: selectedPowerball
      });
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Select 5 White Numbers (1-69)</h3>
        <div className="grid grid-cols-10 gap-2">
          {Array.from({ length: 69 }, (_, i) => i + 1).map(num => (
            <button
              key={num}
              onClick={() => handleWhiteNumberClick(num)}
              className={`w-10 h-10 rounded-full ${
                selectedWhite.includes(num)
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 hover:bg-white/20'
              } flex items-center justify-center font-semibold`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Select Powerball Number (1-26)</h3>
        <div className="grid grid-cols-10 gap-2">
          {Array.from({ length: 26 }, (_, i) => i + 1).map(num => (
            <button
              key={num}
              onClick={() => setSelectedPowerball(num)}
              className={`w-10 h-10 rounded-full ${
                selectedPowerball === num
                  ? 'bg-red-600 text-white'
                  : 'bg-white/10 hover:bg-white/20'
              } flex items-center justify-center font-semibold`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={selectedWhite.length !== 5 || selectedPowerball === null}
        className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:hover:bg-green-600 px-6 py-3 rounded-lg text-lg font-semibold w-full"
      >
        Buy Ticket ($2)
      </button>
    </div>
  );
}

export default NumberSelector;