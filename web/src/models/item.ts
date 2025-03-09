import { z } from 'zod';

export const clothingItemFormSchema = z.object({
  code: z.string().min(1, 'Item code is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  stock: z.number().int().nonnegative('Stock cannot be negative'),
  type: z.string().min(1, 'Type is required'),
  size: z.string().min(1, 'Size is required'),
  image: z.string().optional(),
});

export type ClothingItemFormDto = z.infer<typeof clothingItemFormSchema>;

export const clothingItemQuerySchema = z.object({
  code: z.string().optional(),
  type: z.string().optional(),
  size: z.string().optional(),
  title: z.string().optional(),
  startPrice: z.coerce.number().optional(),
  endPrice: z.coerce.number().optional(),
  stockStatus: z.boolean().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export type ClothingItemQueryDto = z.infer<typeof clothingItemQuerySchema>;

export const clothingItemUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  stock: z.number().int().nonnegative('Stock cannot be negative'),
  type: z.string().min(1, 'Type is required'),
  size: z.string().min(1, 'Size is required'),
  image: z.string().optional(),
});

export type ClothingItemUpdateDto = z.infer<typeof clothingItemUpdateSchema>;

export type ClothingItemDto = {
  id: string;
  code: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  type: string;
  size: string;
  image: string;
  createdAt: string;
  updatedAt: string;
};

export type Size = {
  value: string;
  label: string;
};

export const sizes: Size[] = [
  { value: 'xs', label: 'XS' },
  { value: 's', label: 'S' },
  { value: 'm', label: 'M' },
  { value: 'l', label: 'L' },
  { value: 'xl', label: 'XL' },
  { value: '2xl', label: '2XL' },
  { value: '3xl', label: '3XL' },
  { value: '4xl', label: '4XL' },
  { value: 'onesize', label: 'One Size' },
];

export function getSizeLabel(size: string) {
  return sizes.find((s) => s.value === size)?.label;
}

export type ItemType = {
  value: string;
  label: string;
};

export const itemTypes: ItemType[] = [
  { value: 'tshirt', label: 'T-Shirt' },
  { value: 'shirt', label: 'Shirt' },
  { value: 'jeans', label: 'Jeans' },
  { value: 'trousers', label: 'Trousers' },
  { value: 'shorts', label: 'Shorts' },
  { value: 'jacket', label: 'Jacket' },
  { value: 'coat', label: 'Coat' },
  { value: 'blazer', label: 'Blazer' },
  { value: 'sweater', label: 'Sweater' },
  { value: 'hoodie', label: 'Hoodie' },
  { value: 'skirt', label: 'Skirt' },
  { value: 'dress', label: 'Dress' },
  { value: 'blouse', label: 'Blouse' },
  { value: 'leggings', label: 'Leggings' },
  { value: 'suit', label: 'Suit' },
  { value: 'vest', label: 'Vest' },
  { value: 'overalls', label: 'Overalls' },
  { value: 'jumpsuit', label: 'Jumpsuit' },
  { value: 'tanktop', label: 'Tank Top' },
  { value: 'cardigan', label: 'Cardigan' },
  { value: 'pajamas', label: 'Pajamas' },
  { value: 'tracksuit', label: 'Tracksuit' },
  { value: 'swimsuit', label: 'Swimsuit' },
  { value: 'kimono', label: 'Kimono' },
  { value: 'saree', label: 'Saree' },
];

export function getItemTypeLabel(type: string) {
  return itemTypes.find((t) => t.value === type)?.label;
}
