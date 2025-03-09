import { api } from '@/api/api';
import { AppButton } from '@/components/common/AppButton';
import { Page } from '@/components/common/Page';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { ClothingItemCard } from './-comps/CloathingItemCard';
import { zodValidator } from '@tanstack/zod-adapter';
import { ClothingItemQueryDto, clothingItemQuerySchema } from '@/models/item';
import { useSearchParams } from '@/lib/useSearchParams';
import SelectItemType from '@/components/inputs/SelectItemType';
import LabeledContainer from '@/components/common/LabeledContainer';
import SelectSize from '@/components/inputs/SelectSize';
import { DebouncedInput } from '@/components/inputs/DebouncedInput';
import AppPagination from '@/components/inputs/AppPagination';
import SelectStockStatus from '@/components/inputs/SelectStockStatus';

export const Route = createFileRoute('/admin/items/')({
  component: CloathingItemsPage,
  validateSearch: zodValidator(clothingItemQuerySchema),
});

function CloathingItemsPage() {
  const navigate = useNavigate();
  const { search, getQueryParam, getQueryParamSetter } = useSearchParams<ClothingItemQueryDto>({
    route: Route,
    initialState: {
      page: 1,
      limit: 12,
      size: '',
      title: '',
      type: '',
      stockStatus: undefined,
    },
  });

  const { data: page, isLoading } = useQuery({
    queryKey: ['items', search],
    queryFn: () => api.clothingItems.getAll(search),
  });

  return (
    <Page
      title="Items Catalog"
      description="Manage your items catalog"
      containerClassName="max-w-6xl mx-auto my-10"
      isLoading={isLoading}
      actions={
        <div>
          <AppButton onClick={() => navigate({ to: '/admin/items/create' })}>
            <PlusIcon className="w-4 h-4" />
            Add Item
          </AppButton>
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
        <LabeledContainer label="Search">
          <DebouncedInput
            value={getQueryParam('title')}
            onChange={getQueryParamSetter('title')}
            placeholder="Search items..."
          />
        </LabeledContainer>
        <LabeledContainer label="Size">
          <SelectSize value={getQueryParam('size')} onChange={getQueryParamSetter('size')} emptyOption="All" />
        </LabeledContainer>
        <LabeledContainer label="Type">
          <SelectItemType value={getQueryParam('type')} onChange={getQueryParamSetter('type')} emptyOption="All" />
        </LabeledContainer>
        <LabeledContainer label="Stock Status">
          <SelectStockStatus value={getQueryParam('stockStatus')} onChange={getQueryParamSetter('stockStatus')} />
        </LabeledContainer>
      </div>
      {page?.items && page.items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {page.items.map((item) => (
            <ClothingItemCard
              key={item.id}
              item={item}
              onClick={(item) => navigate({ to: `/admin/items/$id`, params: { id: item.id } })}
              onEdit={(item) => navigate({ to: `/admin/items/$id/edit`, params: { id: item.id } })}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No items found. Add your first item to get started.</p>
        </div>
      )}
      <AppPagination pagination={page?.pagination} setPage={getQueryParamSetter('page')} />
    </Page>
  );
}
