import { OrderItemDto } from '@/models/order';
import { getFileUrl } from '@/api/client';
import { getItemTypeLabel, getSizeLabel } from '@/models/item';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface OrderItemsCardProps {
  items: OrderItemDto[];
  total: number;
}

export function OrderItemsCard({ items, total }: OrderItemsCardProps) {
  console.log(items);
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-medium">Order Items ({items.length})</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-4 p-3 border rounded-md">
              {item.item.image && (
                <div className="w-16 h-16 overflow-hidden rounded-md">
                  <img
                    src={`${getFileUrl(item.item.image)}`}
                    alt={item.item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h4 className="font-medium">{item.item.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {item.item.code} | Size: {getSizeLabel(item.item.size)} | Type: {getItemTypeLabel(item.item.type)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">LKR {item.item.price.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Qty: {item.pieces}</p>
                <p className="font-medium">Subtotal: LKR {item.subtotal.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-right">
          <p className="text-lg font-bold">Total: LKR {total.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
