import { getOderStatusLabel, OderStatus, OrderDto } from '@/models/order';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { format } from 'date-fns';
import { AppButton } from '@/components/common/AppButton';
import { EyeIcon } from 'lucide-react';

interface OrderCardProps {
  order: OrderDto;
  onClick?: (order: OrderDto) => void;
  onStatusChange?: (order: OrderDto, newStatus: 'placed' | 'processing' | 'delivered' | 'canceled') => void;
}

export function OrderCard({ order, onClick, onStatusChange }: OrderCardProps) {
  const handleClick = () => {
    onClick?.(order);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const getStatusColor = (status: OderStatus) => {
    switch (status) {
      case 'placed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg">{order.trackingCode}</h3>
            <p className="text-xs text-muted-foreground">Ordered on {formatDate(order.createdAt)}</p>
          </div>
          <Badge className={getStatusColor(order.status)}>{getOderStatusLabel(order.status)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="space-y-2">
          <div>
            <p className="text-sm font-medium">Items: {order.items.length}</p>
            <p className="text-sm font-medium">Total: LKR {order.total.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Contact: {order.contactNumber}</p>
            <p className="text-sm text-muted-foreground">
              Shipping: {order.shippingAddress.city}, {order.shippingAddress.country}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex gap-2">
          {onStatusChange && order.status !== 'delivered' && order.status !== 'canceled' && (
            <>
              {order.status === 'placed' && (
                <AppButton
                  size="sm"
                  variant="outline"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onStatusChange(order, 'processing');
                  }}
                >
                  Mark Processing
                </AppButton>
              )}
              {order.status === 'processing' && (
                <AppButton
                  size="sm"
                  variant="outline"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onStatusChange(order, 'delivered');
                  }}
                >
                  Mark Delivered
                </AppButton>
              )}
              <AppButton
                size="sm"
                variant="outline"
                className="text-red-500 border-red-200 hover:bg-red-50"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onStatusChange(order, 'canceled');
                }}
              >
                Cancel
              </AppButton>
            </>
          )}
        </div>
        <AppButton size="sm" onClick={handleClick}>
          <EyeIcon className="h-4 w-4 mr-1" /> View
        </AppButton>
      </CardFooter>
    </Card>
  );
}
