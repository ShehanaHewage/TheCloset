import { OderStatus } from '@/models/order';
import { Badge } from '../ui/badge';

export type SelectOderStatusProps = {
  value: OderStatus;
  onChange: (value: OderStatus) => void;
};

export default function SelectOderStatus({ value, onChange }: SelectOderStatusProps) {
  return (
    <div className="flex gap-1">
      <Badge
        variant={value === undefined ? 'default' : 'outline'}
        className="cursor-pointer"
        onClick={() => onChange(undefined)}
      >
        All
      </Badge>
      <Badge
        variant={value === 'placed' ? 'default' : 'outline'}
        className="cursor-pointer"
        onClick={() => onChange('placed')}
      >
        Placed
      </Badge>
      <Badge
        variant={value === 'processing' ? 'default' : 'outline'}
        className="cursor-pointer"
        onClick={() => onChange('processing')}
      >
        Processing
      </Badge>
      <Badge
        variant={value === 'delivered' ? 'default' : 'outline'}
        className="cursor-pointer"
        onClick={() => onChange('delivered')}
      >
        Delivered
      </Badge>
      <Badge
        variant={value === 'canceled' ? 'default' : 'outline'}
        className="cursor-pointer"
        onClick={() => onChange('canceled')}
      >
        Canceled
      </Badge>
    </div>
  );
}
