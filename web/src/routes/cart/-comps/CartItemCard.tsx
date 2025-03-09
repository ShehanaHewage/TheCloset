import { getFileUrlPrefix } from '@/api/client';
import { AppButton } from '@/components/common/AppButton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CartItem } from '@/stores/cartStore';
import { MinusIcon, PlusIcon, TrashIcon, ExternalLinkIcon } from 'lucide-react';
import { getItemTypeLabel, getSizeLabel } from '@/models/item';
import { Link } from '@tanstack/react-router';

type CartItemCardProps = {
  cartItem: CartItem;
  onQuantityChange: (itemId: string, newQuantity: number) => void;
  onRemove: (itemId: string) => void;
};

export function CartItemCard({ cartItem, onQuantityChange, onRemove }: CartItemCardProps) {
  const imageUrl = cartItem.item.image ? `${getFileUrlPrefix()}${cartItem.item.image}` : '/placeholder-image.jpg';

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-32 h-32">
            <Link to="/catalog/$id" params={{ id: cartItem.item.id }}>
              <img
                src={imageUrl}
                alt={cartItem.item.title}
                className="w-full h-full object-cover hover:opacity-80 transition-opacity"
              />
            </Link>
          </div>
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <div className="flex justify-between">
                <Link to="/catalog/$id" params={{ id: cartItem.item.id }} className="hover:underline">
                  <h3 className="font-medium">{cartItem.item.title}</h3>
                </Link>
                <span className="font-bold">LKR {cartItem.item.price}</span>
              </div>
              <p className="text-xs text-muted-foreground">{cartItem.item.code}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  Size: {getSizeLabel(cartItem.item.size) || cartItem.item.size}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Type: {getItemTypeLabel(cartItem.item.type) || cartItem.item.type}
                </Badge>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-2">
                <AppButton
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onQuantityChange(cartItem.item.id, cartItem.pieces - 1)}
                  disabled={cartItem.pieces <= 1}
                >
                  <MinusIcon className="h-3 w-3" />
                </AppButton>
                <span className="w-8 text-center">{cartItem.pieces}</span>
                <AppButton
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onQuantityChange(cartItem.item.id, cartItem.pieces + 1)}
                >
                  <PlusIcon className="h-3 w-3" />
                </AppButton>
              </div>
              <div className="flex gap-2">
                <Link to="/catalog/$id" params={{ id: cartItem.item.id }}>
                  <AppButton variant="outline" size="sm">
                    <ExternalLinkIcon className="h-4 w-4 mr-1" />
                    View
                  </AppButton>
                </Link>
                <AppButton
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => onRemove(cartItem.item.id)}
                >
                  <TrashIcon className="h-4 w-4 mr-1" />
                  Remove
                </AppButton>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
