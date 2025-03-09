import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';

export type ItemCodeInputProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
};

export function ItemCodeInput({
  value,
  onChange,
  disabled = false,
  placeholder = 'Enter item code',
  className = '',
}: ItemCodeInputProps) {
  const generateItemCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    onChange(result);
  };

  return (
    <div className="relative">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        disabled={disabled}
        placeholder={placeholder}
        className={`pr-10 ${className}`}
        maxLength={8}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full px-3 py-2 text-gray-500 hover:text-gray-700"
        onClick={generateItemCode}
        disabled={disabled}
      >
        <Wand2 size={16} />
      </Button>
    </div>
  );
}
