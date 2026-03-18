import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  color?: string;
  bgColor?: string;
  hexColor?: string; // Add support for hex colors
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Chọn...',
  label,
  required,
  className = ''
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const getOptionStyle = (option: SelectOption) => {
    if (option.hexColor) {
      return {
        backgroundColor: `${option.hexColor}15`,
        borderColor: option.hexColor,
        color: option.hexColor
      };
    }
    return {};
  };

  const getOptionClass = (option: SelectOption) => {
    if (option.hexColor) {
      return 'border-2';
    }
    return `${option.bgColor || 'bg-gray-100'} ${option.color || 'text-gray-800'}`;
  };

  return (
    <div className={className} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full h-11 px-4 border rounded-lg bg-white shadow-sm hover:shadow-md hover:border-[#4DBFAD] hover:bg-gradient-to-r hover:from-[#4DBFAD]/5 hover:to-[#2563B4]/5 focus:ring-2 focus:ring-[#4DBFAD] focus:border-transparent transition-all duration-200 flex items-center justify-between ${
            isOpen ? 'border-[#4DBFAD] ring-2 ring-[#4DBFAD] bg-gradient-to-r from-[#4DBFAD]/5 to-[#2563B4]/5' : 'border-gray-300'
          }`}
        >
          {selectedOption ? (
            <span
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getOptionClass(selectedOption)}`}
              style={getOptionStyle(selectedOption)}
            >
              {selectedOption.hexColor && (
                <span 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: selectedOption.hexColor }}
                ></span>
              )}
              {selectedOption.label}
            </span>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="py-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-[#4DBFAD]/10 hover:to-[#2563B4]/10 transition-all duration-150 ${
                    value === option.value ? 'bg-gradient-to-r from-[#4DBFAD]/5 to-[#2563B4]/5' : ''
                  }`}
                >
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getOptionClass(option)}`}
                    style={getOptionStyle(option)}
                  >
                    {option.hexColor && (
                      <span 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: option.hexColor }}
                      ></span>
                    )}
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
