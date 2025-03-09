import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router';
import { ClothingItemForm } from '../-comps/CloathingItemForm';
import { ClothingItemFormDto, ClothingItemUpdateDto } from '@/models/item';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/api/api';
import { Page } from '@/components/common/Page';
import { AppButton } from '@/components/common/AppButton';
import { ArrowLeftIcon } from 'lucide-react';

export const Route = createFileRoute('/admin/items/$id/edit')({
  component: CloathingItemEditPage,
});

function CloathingItemEditPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const router = useRouter();

  const { data: item, isLoading: isLoadingItem } = useQuery({
    queryKey: ['item', id],
    queryFn: () => api.clothingItems.getById(id),
  });

  // Update mutation
  const { mutate: updateItem, isPending: isUpdating } = useMutation({
    mutationFn: (data: ClothingItemFormDto) => {
      const updateData: ClothingItemUpdateDto = {
        title: data.title,
        description: data.description || '',
        price: data.price,
        stock: data.stock,
        type: data.type,
        size: data.size,
        image: data.image,
      };

      return api.clothingItems.update(id, updateData);
    },
    onSuccess: () => {
      navigate({ to: '/admin/items' });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const isLoading = isLoadingItem || isUpdating;

  return (
    <Page
      title="Edit Clothing Item"
      description="Update the details of this clothing item"
      containerClassName="max-w-6xl mx-auto my-10"
      isLoading={isLoadingItem}
      actions={
        <div>
          <AppButton onClick={() => router.history.back()}>
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back
          </AppButton>
        </div>
      }
    >
      {item && (
        <ClothingItemForm
          initialData={{
            code: item.code,
            title: item.title,
            description: item.description,
            price: item.price,
            stock: item.stock,
            type: item.type,
            size: item.size,
            image: item.image,
          }}
          onSubmit={(formData, onFieldError) => {
            const dataWithOriginalCode = {
              ...formData,
              code: item.code,
            };
            updateItem(dataWithOriginalCode, {
              onError: (error) => {
                onFieldError?.('title', { message: error.message });
              },
            });
          }}
          isLoading={isLoading}
          submitLabel="Update Item"
        />
      )}
    </Page>
  );
}
