import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import api from '@/api/api';
import { Page } from '@/components/common/Page';
import { AppButton } from '@/components/common/AppButton';
import { getFileUrlPrefix } from '@/api/client';
import { Badge } from '@/components/ui/badge';
import { getItemTypeLabel, getSizeLabel } from '@/models/item';
import { ArrowLeftIcon, PencilIcon } from 'lucide-react';

export const Route = createFileRoute('/admin/items/$id/')({
  component: CloathingItemPage,
});

function CloathingItemPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const router = useRouter();

  const { data: item, isLoading } = useQuery({
    queryKey: ['item', id],
    queryFn: () => api.clothingItems.getById(id),
  });

  return (
    <Page
      title={item?.title || 'Item Details'}
      description={item?.code || ''}
      containerClassName="max-w-6xl mx-auto my-10"
      isLoading={isLoading}
      actions={
        <div className="flex gap-2">
          <AppButton onClick={() => router.history.back()}>
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back
          </AppButton>
          {item && (
            <AppButton variant="outline" onClick={() => navigate({ to: `/admin/items/$id/edit`, params: { id } })}>
              <PencilIcon className="w-4 h-4 mr-2" />
              Edit Item
            </AppButton>
          )}
        </div>
      }
    >
      {item && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square overflow-hidden rounded-lg border">
            <img
              src={item.image ? `${getFileUrlPrefix()}${item.image}` : '/placeholder-image.jpg'}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold">{item.title}</h2>
              <p className="text-sm text-muted-foreground">{item.code}</p>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant={item.stock > 0 ? 'default' : 'destructive'}>
                {item.stock > 0 ? `In Stock: ${item.stock}` : 'Out of Stock'}
              </Badge>
              <Badge variant="outline">{getItemTypeLabel(item.type)}</Badge>
              <Badge variant="outline">{getSizeLabel(item.size)}</Badge>
            </div>

            <div>
              <h3 className="text-xl font-semibold">Price</h3>
              <p className="text-2xl font-bold">LKR {item.price}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">Description</h3>
              <p className="text-gray-700 mt-2">{item.description || 'No description available'}</p>
            </div>

            <div className="pt-4">
              <AppButton onClick={() => navigate({ to: `/admin/items/$id/edit`, params: { id } })}>
                <PencilIcon className="w-4 h-4 mr-2" />
                Edit Item
              </AppButton>
            </div>
          </div>
        </div>
      )}
    </Page>
  );
}
