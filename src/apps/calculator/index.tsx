import { useState } from 'react';

type Operator = '+' | '-' | '×' | '÷' | null;

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState<string | null>(null);
  const [operator, setOperator] = useState<Operator>(null);
  const [waitingForNext, setWaitingForNext] = useState(false);

  function inputDigit(digit: string) {
    if (waitingForNext) {
      setDisplay(digit);
      setWaitingForNext(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  }

  function inputDecimal() {
    if (waitingForNext) {
      setDisplay('0.');
      setWaitingForNext(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  }

  function handleOperator(op: Operator) {
    const current = parseFloat(display);

    if (prev !== null && !waitingForNext) {
      const result = calculate(parseFloat(prev), current, operator);
      setDisplay(String(result));
      setPrev(String(result));
    } else {
      setPrev(display);
    }

    setOperator(op);
    setWaitingForNext(true);
  }

  function calculate(a: number, b: number, op: Operator): number {
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '×':
        return a * b;
      case '÷':
        return b !== 0 ? a / b : 0;
      default:
        return b;
    }
  }

  function handleEquals() {
    if (prev === null || operator === null) return;
    const result = calculate(parseFloat(prev), parseFloat(display), operator);
    setDisplay(String(result));
    setPrev(null);
    setOperator(null);
    setWaitingForNext(true);
  }

  function handleClear() {
    setDisplay('0');
    setPrev(null);
    setOperator(null);
    setWaitingForNext(false);
  }

  const buttons = [
    ['C', '+/-', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '='],
  ];

  function handleButton(btn: string) {
    if (btn >= '0' && btn <= '9') return inputDigit(btn);
    if (btn === '.') return inputDecimal();
    if (btn === 'C') return handleClear();
    if (btn === '=') return handleEquals();
    if (btn === '+/-') return setDisplay(String(parseFloat(display) * -1));
    if (btn === '%') return setDisplay(String(parseFloat(display) / 100));
    handleOperator(btn as Operator);
  }

  function btnStyle(btn: string) {
    if (['÷', '×', '-', '+', '='].includes(btn)) return 'bg-orange-500 hover:bg-orange-400 text-white';
    if (['C', '+/-', '%'].includes(btn)) return 'bg-white/20 hover:bg-white/30 text-white';
    return 'bg-white/10 hover:bg-white/20 text-white';
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-full py-8 px-4">
      <div className="w-full max-w-xs bg-black/40 rounded-3xl p-4 flex flex-col gap-3">
        {/* Display */}
        <div className="text-right px-2 py-4">
          <div className="text-white/40 text-sm h-5">{prev && operator ? `${prev} ${operator}` : ''}</div>
          <div className="text-white text-5xl font-light tracking-tight truncate">{display}</div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          {buttons.map((row, i) => (
            <div key={i} className="flex gap-2">
              {row.map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleButton(btn)}
                  className={`
                    flex-1 rounded-full py-4 text-xl font-medium
                    transition-all duration-100 active:scale-95 cursor-pointer
                    ${btn === '0' ? 'flex-[2]' : ''}
                    ${btnStyle(btn)}
                  `}
                >
                  {btn}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
