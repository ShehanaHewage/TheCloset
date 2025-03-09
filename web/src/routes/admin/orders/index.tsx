import { orderQuerySchema, OrderDto, OrderQueryDto, OderStatus } from '@/models/order';
import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { useQuery } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/api';
import { Page } from '@/components/common/Page';
import { OrderCard } from './-comps/OrderCard';
import { useNavigate } from '@tanstack/react-router';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSearchParams } from '@/lib/useSearchParams';
import SelectOderStatus from '@/components/inputs/SelectOderStatus';
import AppPagination from '@/components/inputs/AppPagination';

export const Route = createFileRoute('/admin/orders/')({
  component: OrdersPage,
  validateSearch: zodValidator(orderQuerySchema),
});

function OrdersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { search, getQueryParam, getQueryParamSetter } = useSearchParams<OrderQueryDto>({
    route: Route,
    initialState: {
      page: 1,
      limit: 10,
      status: undefined,
    },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['orders', search],
    queryFn: () => api.orders.getAllOrders(search),
  });

  const { mutate: updateOrderStatus } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OderStatus }) => {
      return api.orders.updateOrderStatus(id, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const handleStatusChange = (order: OrderDto, newStatus: OderStatus) => {
    updateOrderStatus({ id: order.id, status: newStatus });
  };

  return (
    <Page
      title="Orders Management"
      description="View and manage customer orders"
      isLoading={isLoading}
      containerClassName="max-w-6xl mx-auto my-10"
      actions={
        <div className="flex gap-2">
          <SelectOderStatus value={getQueryParam('status')} onChange={getQueryParamSetter('status')} />
        </div>
      }
    >
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      {data?.items && data.items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.items.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onClick={(order) => navigate({ to: `/admin/orders/$id`, params: { id: order.id } })}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
          <AppPagination pagination={data.pagination} setPage={getQueryParamSetter('page')} />
        </>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No orders found.</p>
        </div>
      )}
    </Page>
  );
}
