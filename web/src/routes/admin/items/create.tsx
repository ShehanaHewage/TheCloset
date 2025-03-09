import { createFileRoute, useRouter } from '@tanstack/react-router';
import { ClothingItemForm } from './-comps/CloathingItemForm';
import { ClothingItemFormDto } from '@/models/item';
import { useMutation } from '@tanstack/react-query';
import api from '@/api/api';
import { useNavigate } from '@tanstack/react-router';
import { Page } from '@/components/common/Page';
import { AppButton } from '@/components/common/AppButton';
import { ArrowLeftIcon } from 'lucide-react';

export const Route = createFileRoute('/admin/items/create')({
  component: ClothingItemCreatePage,
});

function ClothingItemCreatePage() {
  const navigate = useNavigate();
  const router = useRouter();

  const { mutate: createItem, isPending } = useMutation({
    mutationFn: (data: ClothingItemFormDto) => {
      return api.clothingItems.create(data);
    },
    onSuccess: () => {
      navigate({ to: '/admin/items' });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <Page
      title="Create New Clothing Item"
      description="Create a new clothing item to add to the catalog"
      containerClassName="max-w-6xl mx-auto my-10"
      actions={
        <div>
          <AppButton onClick={() => router.history.back()}>
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back
          </AppButton>
        </div>
      }
    >
      <ClothingItemForm
        onSubmit={(formData, onFieldError) => {
          createItem(formData, {
            onError: (error) => {
              onFieldError?.('code', { message: error.message });
            },
          });
        }}
        isLoading={isPending}
        submitLabel="Create Item"
      />
    </Page>
  );
}
