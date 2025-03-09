import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sizes } from '@/models/item';

export type SelectSizeProps = {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  emptyOption?: string;
};

const SelectSize = ({ value, onChange, disabled, className, emptyOption }: SelectSizeProps) => {
  const handleValueChange = (newValue: string) => {
    if (newValue === '-') {
      onChange?.('');
    } else {
      onChange?.(newValue);
    }
  };

  return (
    <Select value={value} onValueChange={handleValueChange} disabled={disabled}>
      <SelectTrigger className={cn('w-full', className)}>
        <SelectValue placeholder="Select size" />
      </SelectTrigger>
      <SelectContent>
        {emptyOption && <SelectItem value="-">{emptyOption}</SelectItem>}
        {sizes.map((size) => (
          <SelectItem key={size.value} value={size.value}>
            {size.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectSize;
