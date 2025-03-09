import { api } from '@/api/api';
import { getFileUrlPrefix } from '@/api/client';
import { AppButton } from '@/components/common/AppButton';
import { Page } from '@/components/common/Page';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getItemTypeLabel, getSizeLabel } from '@/models/item';
import { useCartStore } from '@/stores/cartStore';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { ArrowLeftIcon, MinusIcon, PlusIcon, ShoppingCartIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/catalog/$id')({
  component: CatalogItemDetailPage,
});

function CatalogItemDetailPage() {
  const { id } = Route.useParams();
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  const { data: item, isLoading } = useQuery({
    queryKey: ['item', id],
    queryFn: () => api.clothingItems.getById(id),
  });

  const handleAddToCart = () => {
    if (item) {
      addItem(item, quantity);
      toast.success(`${item.title} added to cart`);
    }
  };

  const incrementQuantity = () => {
    if (item && quantity < item.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const imageUrl = item?.image ? `${getFileUrlPrefix()}${item.image}` : '/placeholder-image.jpg';

  return (
    <Page
      title={item?.title || 'Item Details'}
      description={item?.code || ''}
      containerClassName="max-w-6xl mx-auto my-10"
      isLoading={isLoading}
      actions={
        <AppButton onClick={() => router.history.back()}>
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back
        </AppButton>
      }
    >
      {item && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="overflow-hidden rounded-lg">
            <img src={imageUrl} alt={item.title} className="w-full h-auto object-cover" />
          </div>

          <Card className="p-6">
            <h1 className="text-2xl font-bold">{item.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{item.code}</p>

            <div className="flex gap-2 mt-4">
              <Badge variant="outline">{getItemTypeLabel(item.type)}</Badge>
              <Badge variant="outline">{getSizeLabel(item.size)}</Badge>
              <Badge variant={item.stock > 0 ? 'default' : 'destructive'}>
                {item.stock > 0 ? `In Stock: ${item.stock}` : 'Out of Stock'}
              </Badge>
            </div>

            <Separator className="my-4" />

            <div className="mt-4">
              <h3 className="font-medium">Description</h3>
              <p className="mt-2 text-muted-foreground">{item.description || 'No description available'}</p>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between items-center mt-4">
              <span className="text-2xl font-bold">LKR {item.price}</span>
            </div>

            {item.stock > 0 ? (
              <div className="mt-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm font-medium">Quantity:</span>
                  <div className="flex items-center">
                    <AppButton variant="outline" size="icon" onClick={decrementQuantity} disabled={quantity <= 1}>
                      <MinusIcon className="h-4 w-4" />
                    </AppButton>
                    <span className="w-10 text-center">{quantity}</span>
                    <AppButton
                      variant="outline"
                      size="icon"
                      onClick={incrementQuantity}
                      disabled={quantity >= item.stock}
                    >
                      <PlusIcon className="h-4 w-4" />
                    </AppButton>
                  </div>
                </div>

                <AppButton className="w-full" onClick={handleAddToCart}>
                  <ShoppingCartIcon className="h-4 w-4 mr-2" />
                  Add to Cart
                </AppButton>
              </div>
            ) : (
              <div className="mt-6">
                <p className="text-destructive font-medium">This item is currently out of stock.</p>
              </div>
            )}
          </Card>
        </div>
      )}
    </Page>
  );
}
