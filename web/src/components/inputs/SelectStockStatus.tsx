import { Button } from '@/components/ui/button';

export type SelectStockStatusProps = {
  value: boolean | undefined;
  onChange: (value: boolean | undefined) => void;
};

export default function SelectStockStatus({ value, onChange }: SelectStockStatusProps) {
  return (
    <div className="flex items-center h-9">
      <Button
        variant={value === undefined ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange(undefined)}
        className="px-3 h-full w-10"
      >
        All
      </Button>
      <Button
        variant={value === true ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange(true)}
        className="px-3 h-full w-10"
      >
        S
      </Button>
      <Button
        variant={value === false ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange(false)}
        className="px-3 h-full w-10"
      >
        N
      </Button>
    </div>
  );
}
