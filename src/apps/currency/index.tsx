import CurrencyCard from './CurrencyCard';
import Dropdown from './DropDown';

export default function Currency() {
  return (
    <div className="min-h-full p-4 md:p-6">
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        {/* Top Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4 mx-2 md:mx-0">
          <img src="/" alt="" className="w-10 h-7 object-cover rounded-md flex-shrink-0" />

          {/* Dropdown */}
          <Dropdown></Dropdown>

          <div className="ml-auto">
            <input
              type="text"
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
