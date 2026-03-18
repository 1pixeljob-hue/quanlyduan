import { Check } from 'lucide-react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  indeterminate?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export function Checkbox({ checked, onChange, indeterminate = false, className = '', onClick }: CheckboxProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e);
    }
    // Toggle the checkbox state
    onChange(!checked);
  };

  return (
    <div className={`relative ${className}`} onClick={handleClick}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          e.stopPropagation();
          onChange(e.target.checked);
        }}
        className="peer sr-only"
        ref={(input) => {
          if (input) {
            input.indeterminate = indeterminate;
          }
        }}
      />
      <div className={`
        w-4 h-4 rounded border bg-white cursor-pointer
        transition-all duration-200
        peer-focus:ring-2 peer-focus:ring-offset-1 peer-focus:ring-gray-300
        ${checked || indeterminate 
          ? 'border-gray-600 bg-white' 
          : 'border-gray-300 hover:border-gray-400'
        }
      `}>
        {checked && !indeterminate && (
          <Check className="w-4 h-4 text-green-600 stroke-[3]" />
        )}
        {indeterminate && (
          <div className="w-2 h-0.5 bg-gray-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        )}
      </div>
    </div>
  );
}