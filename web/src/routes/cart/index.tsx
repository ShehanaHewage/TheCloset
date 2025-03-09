import { AppButton } from '@/components/common/AppButton';
import { Page } from '@/components/common/Page';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/stores/cartStore';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeftIcon, ShoppingBagIcon } from 'lucide-react';
import { CartItemCard } from './-comps/CartItemCard';

export const Route = createFileRoute('/cart/')({
  component: CartPage,
});

function CartPage() {
  const navigate = useNavigate();
  const { items, total, removeItem, updateQuantity } = useCartStore();

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
  };

  const handleCheckout = () => {
    navigate({ to: '/cart/checkout' });
  };

  return (
    <Page
      title="Shopping Cart"
      description={`${items.length} item${items.length !== 1 ? 's' : ''} in your cart`}
      containerClassName="max-w-6xl mx-auto"
      actions={
        <AppButton variant="ghost" onClick={() => navigate({ to: '/catalog' })}>
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Continue Shopping
        </AppButton>
      }
    >
      {items.length > 0 ? (
        <div className="space-y-8">
          <div className="space-y-4">
            {items.map((cartItem) => (
              <CartItemCard
                key={cartItem.item.id}
                cartItem={cartItem}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>

          <Separator />

          <div className="space-y-4">
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
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-lg">LKR {total}</span>
            </div>

            <div className="pt-4">
              <AppButton className="w-full" onClick={handleCheckout}>
                <ShoppingBagIcon className="h-4 w-4 mr-2" />
                Proceed to Checkout
              </AppButton>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <div className="flex justify-center mb-4">
            <ShoppingBagIcon className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
          <p className="text-muted-foreground mb-6">Looks like you haven't added any items to your cart yet.</p>
          <AppButton onClick={() => navigate({ to: '/catalog' })}>Continue Shopping</AppButton>
        </div>
      )}
    </Page>
  );
}
