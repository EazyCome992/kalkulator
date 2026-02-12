
import React, { useState, useEffect, useCallback } from 'react';
import { Operation, CalculationResult } from '../types';

interface CalculatorProps {
  onResult: (result: CalculationResult) => void;
}

const Calculator: React.FC<CalculatorProps> = ({ onResult }) => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<Operation>(null);
  const [isWaitingForOperand, setIsWaitingForOperand] = useState(false);

  const calculate = useCallback((first: number, second: number, op: Operation): number => {
    switch (op) {
      case '+': return first + second;
      case '-': return first - second;
      case '*': return first * second;
      case '/': return second !== 0 ? first / second : NaN;
      case '%': return first % second;
      default: return second;
    }
  }, []);

  const handleDigit = useCallback((digit: string) => {
    if (isWaitingForOperand) {
      setDisplay(digit);
      setIsWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  }, [display, isWaitingForOperand]);

  const handleOperator = useCallback((nextOperator: Operation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(display);
    } else if (operation) {
      const currentValue = previousValue || '0';
      const result = calculate(parseFloat(currentValue), inputValue, operation);
      const resultStr = String(Number(result.toFixed(8)));
      setDisplay(resultStr);
      setPreviousValue(resultStr);
      
      onResult({
        expression: `${currentValue} ${operation} ${inputValue}`,
        result: resultStr,
        timestamp: Date.now()
      });
    }

    setIsWaitingForOperand(true);
    setOperation(nextOperator);
  }, [display, operation, previousValue, calculate, onResult]);

  const handleEquals = useCallback(() => {
    const inputValue = parseFloat(display);
    
    if (previousValue !== null && operation) {
      const currentValue = previousValue || '0';
      const result = calculate(parseFloat(currentValue), inputValue, operation);
      const resultStr = String(Number(result.toFixed(8)));
      
      onResult({
        expression: `${currentValue} ${operation} ${inputValue}`,
        result: resultStr,
        timestamp: Date.now()
      });

      setDisplay(resultStr);
      setPreviousValue(null);
      setOperation(null);
      setIsWaitingForOperand(true);
    }
  }, [display, operation, previousValue, calculate, onResult]);

  const clearAll = useCallback(() => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setIsWaitingForOperand(false);
  }, []);

  const handleBackspace = useCallback(() => {
    if (display.length === 1) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  }, [display]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') handleDigit(e.key);
      if (e.key === '.') handleDigit('.');
      if (e.key === '+') handleOperator('+');
      if (e.key === '-') handleOperator('-');
      if (e.key === '*') handleOperator('*');
      if (e.key === '/') handleOperator('/');
      if (e.key === '%') handleOperator('%');
      if (e.key === 'Enter' || e.key === '=') handleEquals();
      if (e.key === 'Backspace') handleBackspace();
      if (e.key === 'Escape') clearAll();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit, handleOperator, handleEquals, handleBackspace, clearAll]);

  const Button = ({ label, onClick, className = '', variant = 'digit' }: { label: string | React.ReactNode, onClick: () => void, className?: string, variant?: 'digit' | 'operator' | 'action' | 'equal' }) => {
    const variants = {
      digit: 'bg-slate-700/50 hover:bg-slate-600/70 text-slate-200',
      operator: 'bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 font-bold',
      action: 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 font-medium',
      equal: 'bg-gradient-to-br from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white shadow-lg shadow-indigo-500/20'
    };

    return (
      <button
        onClick={onClick}
        className={`h-14 md:h-16 flex items-center justify-center rounded-xl text-lg transition-all active:scale-95 border border-transparent active:border-slate-500/30 ${variants[variant]} ${className}`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="bg-slate-800 p-6 rounded-3xl shadow-2xl border border-slate-700/50 w-full max-w-[360px]">
      {/* Display */}
      <div className="bg-slate-900 rounded-2xl p-6 mb-6 text-right shadow-inner border border-slate-800 relative overflow-hidden">
        <div className="absolute top-2 left-4 flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></div>
        </div>
        <div className="h-6 text-slate-500 text-sm font-mono overflow-hidden whitespace-nowrap">
          {previousValue && operation ? `${previousValue} ${operation}` : ''}
        </div>
        <div className="text-4xl font-bold font-mono text-white tracking-tight overflow-hidden text-ellipsis">
          {display}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-3">
        <Button variant="action" label="AC" onClick={clearAll} />
        <Button variant="action" label={<i className="fas fa-backspace text-sm"></i>} onClick={handleBackspace} />
        <Button variant="operator" label="%" onClick={() => handleOperator('%')} />
        <Button variant="operator" label="÷" onClick={() => handleOperator('/')} />

        <Button label="7" onClick={() => handleDigit('7')} />
        <Button label="8" onClick={() => handleDigit('8')} />
        <Button label="9" onClick={() => handleDigit('9')} />
        <Button variant="operator" label="×" onClick={() => handleOperator('*')} />

        <Button label="4" onClick={() => handleDigit('4')} />
        <Button label="5" onClick={() => handleDigit('5')} />
        <Button label="6" onClick={() => handleDigit('6')} />
        <Button variant="operator" label="-" onClick={() => handleOperator('-')} />

        <Button label="1" onClick={() => handleDigit('1')} />
        <Button label="2" onClick={() => handleDigit('2')} />
        <Button label="3" onClick={() => handleDigit('3')} />
        <Button variant="operator" label="+" onClick={() => handleOperator('+')} />

        <Button label="0" onClick={() => handleDigit('0')} className="col-span-2" />
        <Button label="." onClick={() => handleDigit('.')} />
        <Button variant="equal" label="=" onClick={handleEquals} />
      </div>
    </div>
  );
};

export default Calculator;
