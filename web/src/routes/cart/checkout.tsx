import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Page } from '@/components/common/Page';
import { AppButton } from '@/components/common/AppButton';
import { ArrowLeftIcon, ShoppingBagIcon } from 'lucide-react';
import { CheckoutForm } from './-comps/CheckoutForm';
import { useCartStore } from '@/stores/cartStore';
import { useMutation } from '@tanstack/react-query';
import { CreateOrderDto } from '@/models/order';
import api from '@/api/api';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export const Route = createFileRoute('/cart/checkout')({
  component: CheckoutPage,
});

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCartStore();

  const { mutate: placeOrder, isPending } = useMutation({
    mutationFn: (data: CreateOrderDto) => {
      return api.orders.create(data);
    },
    onSuccess: (response) => {
      toast.success('Order Placed Successfully!', {
        description: `Your order has been placed with tracking code: ${response.trackingCode}`,
      });

      clearCart();

      navigate({ to: '/catalog' });
    },
    onError: (error) => {
      console.error(error);
      toast.error('Error', {
        description: 'There was an error placing your order. Please try again.',
      });
    },
  });

  if (items.length === 0) {
    navigate({ to: '/cart' });
    return null;
  }

  return (
    <Page
      title="Checkout"
      description="Complete your order"
      containerClassName="max-w-6xl mx-auto"
      actions={
        <AppButton variant="ghost" onClick={() => navigate({ to: '/cart' })}>
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Cart
        </AppButton>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <CheckoutForm onSubmit={(formData) => placeOrder(formData)} isLoading={isPending} />
        </div>

        <div className="md:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.item.id} className="flex justify-between text-sm">
                  <span>
                    {item.item.title} x {item.pieces}
                  </span>
                  <span>LKR {item.subtotal}</span>
                </div>
              ))}

              <Separator />

              <div className="flex justify-between">
                <span className="font-medium">Subtotal</span>
                <span>LKR {total}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Shipping</span>
                <span>Calculated at checkout</span>
              </div>

              <Separator />

              <div className="flex justify-between">
                <span className="font-bold">Total</span>
                <span className="font-bold">LKR {total}</span>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-center">
                <ShoppingBagIcon className="h-5 w-5 mr-2" />
                <span>
                  {items.length} item{items.length !== 1 ? 's' : ''} in cart
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
