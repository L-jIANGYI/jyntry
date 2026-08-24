import { useState } from 'react';
import relationship from 'relationship-ts';

type Sex = 0 | 1;
type Mode = 'normal' | 'reverse';

const RELATIONS = ['爸爸', '妈妈', '丈夫', '妻子', '哥哥', '弟弟', '姐姐', '妹妹', '儿子', '女儿'];

export default function Relationship() {
  const [chain, setChain] = useState<string[]>([]);
  const [sex, setSex] = useState<Sex>(1);
  const [mode, setMode] = useState<Mode>('normal');

  const text = chain.join('的');

  const result: string[] = text ? (relationship({ text, sex, reverse: mode === 'reverse' }) ?? []) : [];

  function addRelation(rel: string) {
    setChain((prev) => [...prev, rel]);
  }

  function removeLast() {
    setChain((prev) => prev.slice(0, -1));
  }

  function reset() {
    setChain([]);
    setMode('normal');
  }

  // Format display
  const displayText = chain.length > 0 ? '我的' + chain.join('的') : '';

  return (
    <div className="flex justify-center min-h-full">
      <div className="w-full max-w-sm flex flex-col p-4 gap-3">
        {/* Result display */}
        <div className="bg-white/5 rounded-2xl p-4 min-h-32 flex flex-col justify-between">
          {/* Input chain */}
          <p className="text-white/40 text-sm text-right">{displayText || ' '}</p>

          {/* Result */}
          <div className="text-right">
            {result.length > 0 ? (
              <>
                <p className="text-white/50 text-sm">{mode === 'normal' ? '我称呼Ta' : 'Ta称呼我'}</p>
                <p className="text-white text-4xl font-light mt-1">{result.join(' / ')}</p>
              </>
            ) : text ? (
              <p className="text-white/30 text-2xl">未知</p>
            ) : (
              <p className="text-white/20 text-base">点击下方开始输入</p>
            )}
          </div>
        </div>

        {/* Sex selector */}
        <div className="flex items-center gap-2">
          <p className="text-white/40 text-sm">我的性别：</p>
          {(
            [
              ['男', 1],
              ['女', 0],
            ] as [string, Sex][]
          ).map(([label, val]) => (
            <button
              key={val}
              onClick={() => setSex(val)}
              className={`px-4 py-1 rounded-full text-sm transition-colors cursor-pointer border
                ${sex === val ? 'bg-white text-black border-white' : 'bg-transparent text-white/60 border-white/20'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Relation buttons grid */}
        <div className="grid grid-cols-4 gap-2">
          {RELATIONS.map((rel) => (
            <button
              key={rel}
              onClick={() => addRelation(rel)}
              className="bg-white/10 hover:bg-white/20 active:scale-95 transition-all
                         rounded-2xl py-4 text-white text-lg font-medium cursor-pointer"
            >
              {rel}
            </button>
          ))}

          {/* Cross-check */}
          <button
            onClick={() => setMode((m) => (m === 'normal' ? 'reverse' : 'normal'))}
            className={`rounded-2xl py-4 text-base font-medium cursor-pointer
                       active:scale-95 transition-all border
                       ${mode === 'reverse' ? 'bg-blue-500 text-white border-blue-500' : 'bg-transparent text-white/70 border-white/20'}`}
          >
            互查
          </button>

          {/* Backspace */}
          <button
            onClick={removeLast}
            disabled={chain.length === 0}
            className="bg-blue-500/80 hover:bg-blue-500 active:scale-95 transition-all
                       rounded-2xl py-4 text-white text-lg cursor-pointer
                       disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ⌫
          </button>

          {/* AC */}
          <button
            onClick={reset}
            disabled={chain.length === 0}
            className="bg-white/20 hover:bg-white/30 active:scale-95 transition-all
                       rounded-2xl py-4 text-white text-sm font-medium cursor-pointer
                       disabled:opacity-30 disabled:cursor-not-allowed col-span-2"
          >
            AC
          </button>
        </div>
      </div>
    </div>
  );
}
