import { useEffect, useState } from 'react';
import CurrencyCard from './CurrencyCard';
import Dropdown from './DropDown';
import { fetchCurrencies, fetchRates } from './api';
import { DEFAULT_PINNED, getFlagUrl } from './data';

export default function Currency() {
  const [currencies, setCurrencies] = useState<Record<string, string>>({});
  const [base, setBase] = useState('EUR');
  const [amount, setAmount] = useState('1');
  const [rates, setRates] = useState<Record<string, number>>({});
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pinned, setPinned] = useState<string[]>(DEFAULT_PINNED);

  // fetch currency list once on mount
  useEffect(() => {
    fetchCurrencies()
      .then(setCurrencies)
      .catch(() => setError('Failed to load currencies.'));
  }, []);

  // fetch rates whenever base changes
  useEffect(() => {
    if (!base) return;
    setLoading(true);
    setError('');
    fetchRates(base)
      .then((result) => {
        setRates(result.rates);
        setDate(result.date);
      })
      .catch(() => setError('Failed to load rates.'))
      .finally(() => setLoading(false));
  }, [base]);

  function handleSelectBase(code: string) {
    setBase(code);
    setAmount('1');
  }

  function togglePin(code: string) {
    setPinned((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));
  }

  return (
    <div className="min-h-full p-4 md:p-6">
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        {/* Top Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4 mx-2 md:mx-0">
          <img src={getFlagUrl(base)} alt="" className="w-10 h-7 object-cover rounded-md flex-shrink-0" />

          {/* Dropdown */}
          <Dropdown selected={base} pinned={pinned} currencies={currencies} onSelect={handleSelectBase} onTogglePin={togglePin}></Dropdown>

          <div className="ml-auto">
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-32 bg-white/10 border border-white/15 rounded-xl text-white text-right text-xl font-light outline-none px-4 py-2 focus:border-white/30 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="1"
              min="0"
            />
          </div>
        </div>

        {/* CurrencyCard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <CurrencyCard></CurrencyCard>
        </div>
      </div>
    </div>
  );
}
