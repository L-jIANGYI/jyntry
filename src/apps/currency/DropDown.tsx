import { useState } from 'react';

export default function Dropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 bg-white/10 hover:bg-white/15 transition-colors rounded-xl px-3 py-2 cursor-pointer border-none"
      >
        <span className="text-white font-medium text-sm"></span>
        <span className="text-white/40 text-xs"></span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => {
              setOpen(false);
            }}
          ></div>

          <div className="absolute left-0 top-full mt-2 z-20 w-72 bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-3 border-b border-white/10">
              <input
                type="text"
                placeholder="Search..."
                autoFocus
                className="w-full bg-white/5 text-white placeholder:text-white/20 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-white/20"
              />
            </div>

            <div className="overflow-y-auto max-h-64"></div>

            <div className="px-4 py-2 border-t border-white/10">
              <p className="text-white/30 text-xs">12 / 12</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
