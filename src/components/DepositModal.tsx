import { useState } from "react";
import { X } from "lucide-react";

type DepositModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: number) => void;
};

const DEPOSIT_OPTIONS = [10, 20, 50, 100];

function DepositModal({ isOpen, onClose, onDeposit }: DepositModalProps) {
  const [customAmount, setCustomAmount] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white text-gray-900 rounded-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Add Funds</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {DEPOSIT_OPTIONS.map((amount) => (
            <button
              key={amount}
              onClick={() => onDeposit(amount)}
              className="bg-blue-600 text-white py-3 px-4 rounded-lg text-lg font-semibold hover:bg-blue-700"
            >
              ${amount}
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <input
            type="number"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            placeholder="Custom amount"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
          />
          <button
            onClick={() => onDeposit(Number(customAmount))}
            disabled={!customAmount || Number(customAmount) <= 0}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default DepositModal;

