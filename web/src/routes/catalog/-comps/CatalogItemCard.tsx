import { ClothingItemDto, getItemTypeLabel, getSizeLabel } from '@/models/item';
import { getFileUrlPrefix } from '@/api/client';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCartIcon } from 'lucide-react';
import { AppButton } from '@/components/common/AppButton';

interface CatalogItemCardProps {
  item: ClothingItemDto;
  onClick?: (item: ClothingItemDto) => void;
  onAddToCart?: (item: ClothingItemDto) => void;
}

export function CatalogItemCard({ item, onClick, onAddToCart }: CatalogItemCardProps) {
  const imageUrl = item.image ? `${getFileUrlPrefix()}${item.image}` : '/placeholder-image.jpg';

  const handleClick = () => {
    onClick?.(item);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(item);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md cursor-pointer" onClick={handleClick}>
      <div className="aspect-square overflow-hidden">
        <img src={imageUrl} alt={item.title} className="w-full h-full object-cover" />
      </div>
      <CardHeader className="p-4 pb-2">
        <h3 className="font-medium text-lg line-clamp-2">{item.title}</h3>
        <div className="flex justify-between items-start">
          <p className="text-xs text-muted-foreground">{item.code}</p>
          <Badge variant={item.stock > 0 ? 'default' : 'destructive'}>
            {item.stock > 0 ? `In Stock: ${item.stock}` : 'Out of Stock'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2">{item.description || 'No description available'}</p>
        <div className="flex gap-2 mt-2">
          <Badge variant="outline">{getItemTypeLabel(item.type)}</Badge>
          <Badge variant="outline">{getSizeLabel(item.size)}</Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <span className="font-bold">LKR {item.price}</span>
        {onAddToCart && item.stock > 0 && (
          <AppButton size="sm" onClick={handleAddToCartClick} className="px-2">
            <ShoppingCartIcon className="h-4 w-4 mr-1" /> Add to Cart
          </AppButton>
        )}
        {item.stock <= 0 && <span className="text-sm text-destructive">Out of Stock</span>}
      </CardFooter>
    </Card>
  );
}
