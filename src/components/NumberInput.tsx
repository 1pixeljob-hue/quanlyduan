import React, { useRef } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface NumberInputProps {
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function NumberInput({
  value,
  onChange,
  placeholder,
  className = '',
  min,
  max,
  step = 1,
  disabled = false,
  icon
}: NumberInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleIncrement = () => {
    const currentValue = parseFloat(value.toString()) || 0;
    const newValue = currentValue + step;
    if (max === undefined || newValue <= max) {
      onChange(newValue.toString());
    }
  };

  const handleDecrement = () => {
    const currentValue = parseFloat(value.toString()) || 0;
    const newValue = currentValue - step;
    if (min === undefined || newValue >= min) {
      onChange(newValue.toString());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleIncrement();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleDecrement();
    }
  };

  return (
    <div className="number-input-wrapper w-full">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
          {icon}
        </div>
      )}
      <input
        ref={inputRef}
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={`number-input-with-controls ${className}`}
      />
      <div className="number-input-controls">
        <button
          type="button"
          className="number-input-btn"
          onClick={handleIncrement}
          disabled={disabled || (max !== undefined && parseFloat(value.toString()) >= max)}
          tabIndex={-1}
        >
          <ChevronUp />
        </button>
        <button
          type="button"
          className="number-input-btn"
          onClick={handleDecrement}
          disabled={disabled || (min !== undefined && parseFloat(value.toString()) <= min)}
          tabIndex={-1}
        >
          <ChevronDown />
        </button>
      </div>
    </div>
  );
}