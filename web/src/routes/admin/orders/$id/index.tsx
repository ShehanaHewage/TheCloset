import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/api';
import { Page } from '@/components/common/Page';
import { AppButton } from '@/components/common/AppButton';
import { ArrowLeftIcon, CheckIcon, TruckIcon, XIcon } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { OrderItemsCard } from '../-comps/OderItemCard';
import { getOderStatusLabel, OderStatus } from '@/models/order';
export const Route = createFileRoute('/admin/orders/$id/')({
  component: OrderDetailPage,
});

function OrderDetailPage() {
  const { id } = useParams({ from: '/admin/orders/$id/' });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['order', id],
    queryFn: () => api.orders.getOrderById(id),
  });

  const { mutate: updateOrderStatus, isPending: isUpdating } = useMutation({
    mutationFn: ({ status }: { status: 'placed' | 'processing' | 'delivered' | 'canceled' }) => {
      return api.orders.updateOrderStatus(id, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy h:mm a');
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

  const handleStatusChange = (newStatus: 'placed' | 'processing' | 'delivered' | 'canceled') => {
    updateOrderStatus({ status: newStatus });
  };

  return (
    <Page
      title="Order Details"
      description={order ? `Order #${order.trackingCode}` : 'Loading...'}
      isLoading={isLoading}
      containerClassName="max-w-6xl mx-auto my-10"
      actions={
        <div>
          <AppButton onClick={() => navigate({ to: '/admin/orders' })}>
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Orders
          </AppButton>
        </div>
      }
    >
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      {order && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">Order #{order.trackingCode}</h3>
                <p className="text-sm text-muted-foreground">Placed on {formatDate(order.createdAt)}</p>
              </div>
              <Badge className={getStatusColor(order.status)}>{getOderStatusLabel(order.status)}</Badge>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h4 className="font-medium mb-2">Customer Information</h4>
                  <p className="text-sm">User ID: {order.userId || 'Guest'}</p>
                  <p className="text-sm">Contact: {order.contactNumber}</p>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-2">Payment Information</h4>
                  <p className="text-sm">Method: {order.paymentMethod}</p>
                  <p className="text-sm">Total: LKR {order.total.toFixed(2)}</p>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h4 className="font-medium mb-2">Billing Address</h4>
                  <p className="text-sm">{order.billingAddress.street}</p>
                  <p className="text-sm">
                    {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipCode}
                  </p>
                  <p className="text-sm">{order.billingAddress.country}</p>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-2">Shipping Address</h4>
                  <p className="text-sm">{order.shippingAddress.street}</p>
                  <p className="text-sm">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                  <p className="text-sm">{order.shippingAddress.country}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <OrderItemsCard items={order.items} total={order.total} />

          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Order Actions</h3>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {order.status === 'placed' && (
                  <AppButton variant="outline" onClick={() => handleStatusChange('processing')} isLoading={isUpdating}>
                    <TruckIcon className="w-4 h-4 mr-2" />
                    Mark as Processing
                  </AppButton>
                )}
                {order.status === 'processing' && (
                  <AppButton variant="outline" onClick={() => handleStatusChange('delivered')} isLoading={isUpdating}>
                    <CheckIcon className="w-4 h-4 mr-2" />
                    Mark as Delivered
                  </AppButton>
                )}
                {(order.status === 'placed' || order.status === 'processing') && (
                  <AppButton
                    variant="outline"
                    className="text-red-500 border-red-200 hover:bg-red-50"
                    onClick={() => handleStatusChange('canceled')}
                    isLoading={isUpdating}
                  >
                    <XIcon className="w-4 h-4 mr-2" />
                    Cancel Order
                  </AppButton>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Page>
  );
}
