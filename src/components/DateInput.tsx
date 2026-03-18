import { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { isValidVNDate, toISODateString, isoToVNDate } from '../utils/dateFormat';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface DateInputProps {
  value: string; // ISO format (yyyy-mm-dd)
  onChange: (value: string) => void; // Returns ISO format
  label?: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
}

export function DateInput({ value, onChange, label, required, className = '', placeholder = 'dd/mm/yyyy' }: DateInputProps) {
  const [displayValue, setDisplayValue] = useState('');
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const isManualInput = useRef(false);

  useEffect(() => {
    // Only update display value if not manually inputting
    if (!isManualInput.current) {
      if (value) {
        setDisplayValue(isoToVNDate(value));
      } else {
        setDisplayValue('');
      }
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    isManualInput.current = true;
    let inputValue = e.target.value;
    
    // Remove non-numeric characters except /
    inputValue = inputValue.replace(/[^\d/]/g, '');
    
    // Auto-format as user types
    if (inputValue.length === 2 && displayValue.length === 1) {
      inputValue += '/';
    } else if (inputValue.length === 5 && displayValue.length === 4) {
      inputValue += '/';
    }
    
    // Limit length
    if (inputValue.length <= 10) {
      setDisplayValue(inputValue);
      setError('');
    }
  };

  const validateAndSave = () => {
    if (!displayValue) {
      setError('');
      onChange('');
      isManualInput.current = false;
      return;
    }

    // Validate format
    if (!isValidVNDate(displayValue)) {
      setError('Định dạng không hợp lệ (dd/mm/yyyy)');
      return;
    }

    setError('');
    
    // Convert dd/mm/yyyy to ISO format using the utility function
    try {
      const isoDate = toISODateString(displayValue);
      onChange(isoDate);
      // Update display value to ensure proper formatting
      setDisplayValue(isoToVNDate(isoDate));
      isManualInput.current = false;
    } catch (err) {
      setError('Ngày không hợp lệ');
    }
  };

  const handleBlur = () => {
    validateAndSave();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      validateAndSave();
      (e.target as HTMLInputElement).blur();
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    isManualInput.current = true;
    e.target.select();
  };

  // Handle calendar date selection
  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      isManualInput.current = false;
      const isoDate = toISODateString(date);
      onChange(isoDate);
      setDisplayValue(isoToVNDate(isoDate));
      setError('');
      setIsOpen(false); // Close popover after selection
    }
  };

  // Handle Clear button
  const handleClear = () => {
    isManualInput.current = false;
    onChange('');
    setDisplayValue('');
    setError('');
    setIsOpen(false);
  };

  // Handle Today button
  const handleToday = () => {
    isManualInput.current = false;
    const today = new Date();
    const isoDate = toISODateString(today);
    onChange(isoDate);
    setDisplayValue(isoToVNDate(isoDate));
    setError('');
    setIsOpen(false);
  };

  // Convert ISO date string to Date object for Calendar component
  const selectedDate = value ? new Date(value) : undefined;

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-[#4DBFAD] focus:border-transparent ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          maxLength={10}
        />
        
        {/* Calendar icon with popover */}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#4DBFAD] transition-colors"
              title="Chọn ngày từ lịch"
            >
              <CalendarIcon className="w-5 h-5" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white border-gray-200 shadow-lg" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleCalendarSelect}
              onClear={handleClear}
              onToday={handleToday}
              initialFocus
              className="rounded-lg"
            />
          </PopoverContent>
        </Popover>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}