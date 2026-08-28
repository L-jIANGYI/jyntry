export default function CurrencyCard() {
  return (
    <button className="w-full flex items-center gap-3 rounded-2xl p-4 transition-all cursor-pointer border text-left bg-white/15 border-white/40">
      <img src="/" alt="" className="w-8 h-6 object-cover rounded-sm flex-shrink-0" />

      <div className="flex-1 min-w-0">
        <p className="text-white font-medium text-sm">EUR</p>
        <p className="text-white/40 text-xs truncate">Europe</p>
      </div>

      <div className="text-right mr-2">
        <p className="font-medium text-base text-white">123,12</p>
        <p className="text-white/30 text-xs">per 1 CNY</p>
      </div>

      <button className="text-white/20 hover:text-white/60 transition-colors cursor-pointer bg-transparent border-none text-lg flex-shrink-0 p-1 -mr-1">
        ×
      </button>
    </button>
  );
}
