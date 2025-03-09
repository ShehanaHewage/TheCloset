import { ClothingItemDto, getItemTypeLabel, getSizeLabel } from '@/models/item';
import { getFileUrlPrefix } from '@/api/client';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PencilIcon } from 'lucide-react';
import { AppButton } from '@/components/common/AppButton';

interface ClothingItemCardProps {
  item: ClothingItemDto;
  onClick?: (item: ClothingItemDto) => void;
  onEdit?: (item: ClothingItemDto) => void;
}

export function ClothingItemCard({ item, onClick, onEdit }: ClothingItemCardProps) {
  const imageUrl = item.image ? `${getFileUrlPrefix()}${item.image}` : '/placeholder-image.jpg';

  const handleClick = () => {
    onClick?.(item);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(item);
  };

  return (
    <Card
      className="overflow-hidden transition-all hover:shadow-md cursor-pointer flex flex-col justify-between"
      onClick={handleClick}
    >
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
      <CardFooter className="px-4 pt-0 flex justify-between items-center">
        <span className="font-bold">LKR {item.price}</span>
        {onEdit && (
          <AppButton size="sm" onClick={handleEditClick} className="px-1">
            <PencilIcon className="h-4 w-4" /> Edit
          </AppButton>
        )}
      </CardFooter>
    </Card>
  );
}
