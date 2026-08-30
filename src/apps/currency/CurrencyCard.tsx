import { formatRate, getFlagUrl } from './utils/data';

interface Props {
  code: string;
  name: string;
  rate: number;
  amount: number;
  base: string;
  isBase: boolean;
  onSelect: (code: string) => void;
  onRemove: (code: string) => void;
}

export default function CurrencyCard({ code, name, rate, amount, base, isBase, onSelect, onRemove }: Props) {
  const converted = formatRate(code, rate * amount);

  return (
    <div
      onClick={() => onSelect(code)}
      className={`w-full flex items-center gap-3 rounded-2xl p-4 transition-all cursor-pointer border text-left
        ${isBase ? 'bg-white/15 border-white/40' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
    >
      <img src={getFlagUrl(code)} alt={code} className="w-8 h-6 object-cover rounded-sm flex-shrink-0" />

      <div className="flex-1 min-w-0">
        <p className="text-white font-medium text-sm">{code}</p>
        <p className="text-white/40 text-xs truncate">{name}</p>
      </div>

      <div className="text-right mr-2">
        <p className={`font-medium text-base ${isBase ? 'text-white' : 'text-white/80'}`}>{converted}</p>
        <p className="text-white/30 text-xs">
          per {amount} {base}
        </p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(code);
        }}
        className="text-white/20 hover:text-white/60 transition-colors cursor-pointer bg-transparent border-none text-lg flex-shrink-0 p-1 -mr-1"
        aria-label={`Remove ${code}`}
      >
        ×
      </button>
    </div>
  );
}
