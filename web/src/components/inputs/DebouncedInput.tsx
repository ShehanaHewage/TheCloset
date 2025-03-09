import React, { useEffect, useState } from 'react';
import { Input } from '../ui/input';

export type DebouncedInputProps = {
  value?: string;
  onChange?: (value: string) => void;
  debounce?: number;
  placeholder?: string;
};

export const DebouncedInput = React.forwardRef<HTMLInputElement, DebouncedInputProps>(
  ({ value: initialValue, onChange, debounce = 700, ...props }, ref) => {
    const [inputValue, setInputValue] = useState(initialValue ?? '');

    useEffect(() => {
      setInputValue(initialValue ?? '');
    }, [initialValue]);

    useEffect(() => {
      const handler = setTimeout(() => {
        if (inputValue !== initialValue) {
          onChange?.(inputValue);
        }
      }, debounce);

      return () => clearTimeout(handler);
    }, [inputValue, initialValue, debounce, onChange]);

    return (
      <Input
        {...props}
        ref={ref}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={props.placeholder}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onChange?.(inputValue);
          }
        }}
      />
    );
  },
);

DebouncedInput.displayName = 'DebouncedInput';
