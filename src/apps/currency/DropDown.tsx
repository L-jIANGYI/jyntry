import { useState } from 'react';
import { getFlagUrl, MAX_PINNED } from './utils/data';

interface Props {
  selected: string;
  pinned: string[];
  currencies: Record<string, string>;
  onSelect: (code: string) => void;
  onTogglePin: (code: string) => void;
}

export default function Dropdown({ selected, pinned, currencies, onSelect, onTogglePin }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = Object.entries(currencies).filter(([code, name]) => {
    const q = query.toLowerCase();
    return code.toLowerCase().includes(q) || name.toLowerCase().includes(q);
  });

  function handleSelect(code: string) {
    onSelect(code);
    setOpen(false);
    setQuery('');
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 bg-white/10 hover:bg-white/15 transition-colors rounded-xl px-3 py-2 cursor-pointer border-none"
      >
        <span className="text-white font-medium text-sm">{selected}</span>
        <span className="text-white/40 text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => {
              setOpen(false);
              setQuery('');
            }}
          ></div>

          <div className="absolute left-0 top-full mt-2 z-20 w-72 bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-3 border-b border-white/10">
              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                className="w-full bg-white/5 text-white placeholder:text-white/20 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-white/20"
              />
            </div>

            <div className="overflow-y-auto max-h-64">
              {filtered.map(([code, name]) => {
                const isPinned = pinned.includes(code);
                const atLimit = pinned.length >= MAX_PINNED && !isPinned;

                return (
                  <div key={code} className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors">
                    <button
                      onClick={() => handleSelect(code)}
                      className="flex items-center gap-3 flex-1 cursor-pointer bg-transparent border-none text-left"
                    >
                      <img src={getFlagUrl(code)} alt={code} className="w-7 h-5 object-cover rounded-sm flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium">{code}</p>
                        <p className="text-white/40 text-xs truncate">{name}</p>
                      </div>
                    </button>

                    <button
                      onClick={() => onTogglePin(code)}
                      disabled={atLimit}
                      title={atLimit ? `Max ${MAX_PINNED} currencies` : isPinned ? 'Remove' : 'Pin'}
                      className={`flex-shrink-0 text-lg cursor-pointer bg-transparent border-none transition-opacity
                        ${atLimit ? 'opacity-20 cursor-not-allowed' : 'opacity-60 hover:opacity-100'}`}
                    >
                      {isPinned ? '★' : '☆'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="px-4 py-2 border-t border-white/10">
              <p className="text-white/30 text-xs">
                {pinned.length} / {MAX_PINNED} pinned
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
