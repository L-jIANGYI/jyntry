import { useEffect, useState } from 'react';
import CurrencyCard from './CurrencyCard';
import Dropdown from './DropDown';
import { fetchCurrencies, fetchRates } from './utils/api';
import { DEFAULT_PINNED, getFlagUrl } from './utils/data';

const STORAGE_KEY = 'currency:pinned';

function loadPinned(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_PINNED;
  } catch {
    return DEFAULT_PINNED;
  }
}

function savePinned(pinned: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pinned));
}

export default function Currency() {
  const [currencies, setCurrencies] = useState<Record<string, string>>({});
  const [base, setBase] = useState('EUR');
  const [amount, setAmount] = useState('1');
  const [rates, setRates] = useState<Record<string, number>>({});
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pinned, setPinned] = useState<string[]>(loadPinned);

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
      // eslint-disable-next-line react-hooks/exhaustive-deps
      .finally(() => setLoading(false));
  }, [base]);

  function handleSelectBase(code: string) {
    setBase(code);
    setAmount('1');
  }

  function togglePin(code: string) {
    setPinned((prev) => {
      const next = prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code];
      savePinned(next);
      return next;
    });
  }

  function handleCardClick(code: string) {
    setBase(code);
    setAmount('1');
  }

  function removePin(code: string) {
    setPinned((prev) => {
      const next = prev.filter((c) => c !== code);
      savePinned(next);
      return next;
    });
  }

  const numAmount = parseFloat(amount) || 0;

  return (
    <div className="min-h-full p-4 md:p-6">
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        {/* Top Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4 mx-2 md:mx-0">
          <img src={getFlagUrl(base)} alt="" className="w-10 h-7 object-cover rounded-md flex-shrink-0" />

          {/* Dropdown */}
          <Dropdown selected={base} pinned={pinned} currencies={currencies} onSelect={handleSelectBase} onTogglePin={togglePin} />

          <div className="ml-auto">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-32 bg-white/10 border border-white/15 rounded-xl text-white text-right text-xl font-light outline-none px-4 py-2 focus:border-white/30 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="1"
              min="0"
            />
          </div>
        </div>

        {loading && <p className="text-white/40 text-sm text-center py-8">Loading...</p>}
        {error && <p className="text-red-400 text-sm text-center py-4">{error}</p>}

        {/* CurrencyCard */}
        {!loading && !error && (
          <>
            {pinned.length === 0 ? (
              <p className="text-white/20 text-sm text-center py-8">Open the dropdown to pin currencies</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {pinned.map((code) => (
                  <CurrencyCard
                    key={code}
                    code={code}
                    name={currencies[code] ?? code}
                    rate={rates[code] ?? 0}
                    amount={numAmount}
                    base={base}
                    isBase={code === base}
                    onSelect={handleCardClick}
                    onRemove={removePin}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {date && <p className="text-white/20 text-xs text-center pb-2">Updated {date} · Rates by Frankfurter / ECB</p>}
      </div>
    </div>
  );
}
