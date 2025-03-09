import { api } from '@/api/api';
import { Page } from '@/components/common/Page';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { CatalogItemCard } from './-comps/CatalogItemCard';
import { useCartStore } from '@/stores/cartStore';
import { Badge } from '@/components/ui/badge';
import { ShoppingCartIcon } from 'lucide-react';
import { toast } from 'sonner';
import { ClothingItemDto, ClothingItemQueryDto, clothingItemQuerySchema } from '@/models/item';
import { zodValidator } from '@tanstack/zod-adapter';
import { useSearchParams } from '@/lib/useSearchParams';
import LabeledContainer from '@/components/common/LabeledContainer';
import { DebouncedInput } from '@/components/inputs/DebouncedInput';
import SelectSize from '@/components/inputs/SelectSize';
import SelectItemType from '@/components/inputs/SelectItemType';
import AppPagination from '@/components/inputs/AppPagination';
import SelectStockStatus from '@/components/inputs/SelectStockStatus';

export const Route = createFileRoute('/catalog/')({
  component: CatalogPage,
  validateSearch: zodValidator(clothingItemQuerySchema),
});

function CatalogPage() {
  const navigate = useNavigate();
  const { addItem, itemCount } = useCartStore();
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
    queryKey: ['catalog-items', search],
    queryFn: () => api.clothingItems.getAll(search),
  });

  const handleAddToCart = (item: ClothingItemDto) => {
    addItem(item, 1);
    toast.success(`${item.title} added to cart`);
  };

  return (
    <Page
      title="Clothing Catalog"
      description="Browse our collection of clothing items"
      containerClassName="max-w-6xl mx-auto my-10"
      isLoading={isLoading}
      actions={
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate({ to: '/cart' })}>
            <ShoppingCartIcon className="w-5 h-5" />
            {itemCount > 0 && (
              <Badge variant="default" className="rounded-full px-2">
                {itemCount}
              </Badge>
            )}
          </div>
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
            <CatalogItemCard
              key={item.id}
              item={item}
              onClick={(item) => navigate({ to: '/catalog/$id', params: { id: item.id } })}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No items found</p>
        </div>
      )}
      <AppPagination pagination={page?.pagination} setPage={getQueryParamSetter('page')} />
    </Page>
  );
}
