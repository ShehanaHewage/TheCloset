import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { itemTypes } from '@/models/item';

export type SelectItemTypeProps = {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  emptyOption?: string;
};

const SelectItemType = ({ value, onChange, disabled, className, emptyOption }: SelectItemTypeProps) => {
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
        <SelectValue placeholder="Select item type" />
      </SelectTrigger>
      <SelectContent>
        {emptyOption && <SelectItem value="-">{emptyOption}</SelectItem>}
        {itemTypes.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectItemType;
