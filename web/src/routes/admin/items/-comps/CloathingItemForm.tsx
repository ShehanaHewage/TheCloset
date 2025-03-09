import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { clothingItemFormSchema, ClothingItemFormDto } from '@/models/item';
import { SubmitFn } from '@/models/common';
import { ItemCodeInput } from '@/components/inputs/ItemCodeInput';
import { AppButton } from '@/components/common/AppButton';
import ImageInput from '@/components/inputs/ImageInput';
import { getFileUrlPrefix } from '@/api/client';
import SelectItemType from '@/components/inputs/SelectItemType';
import SelectSize from '@/components/inputs/SelectSize';
export type ClothingItemFormProps = {
  onSubmit?: SubmitFn<ClothingItemFormDto>;
  isLoading?: boolean;
  initialData?: Partial<ClothingItemFormDto>;
  submitLabel?: string;
};

export function ClothingItemForm(props: ClothingItemFormProps) {
  const form = useForm<ClothingItemFormDto>({
    resolver: zodResolver(clothingItemFormSchema),
    defaultValues: {
      code: props.initialData?.code || '',
      title: props.initialData?.title || '',
      description: props.initialData?.description || '',
      price: props.initialData?.price || 0,
      stock: props.initialData?.stock || 0,
      type: props.initialData?.type || '',
      size: props.initialData?.size || '',
      image: props.initialData?.image || '',
    },
  });

  function onSubmit(data: ClothingItemFormDto) {
    props.onSubmit?.(data, form.setError);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Item Code</FormLabel>
              <FormControl>
                <ItemCodeInput
                  value={field.value}
                  onChange={field.onChange}
                  disabled={props.isLoading || !!props.initialData?.code}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter item title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter item description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter price"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Stock</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter stock quantity"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Type</FormLabel>
                <FormControl>
                  <SelectItemType value={field.value} onChange={field.onChange} disabled={props.isLoading} />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Size</FormLabel>
                <FormControl>
                  <SelectSize value={field.value} onChange={field.onChange} disabled={props.isLoading} />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Image URL</FormLabel>
              <FormControl>
                <ImageInput
                  {...field}
                  className="bg-white border-gray-300 text-black placeholder:text-gray-400"
                  pathPrefix={getFileUrlPrefix()}
                />
              </FormControl>
              <FormDescription className="text-gray-500">Provide a URL to the item's image</FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <hr />
        <AppButton type="submit" isLoading={props.isLoading}>
          {props.submitLabel || 'Save Item'}
        </AppButton>
      </form>
    </Form>
  );
}
