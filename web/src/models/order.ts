import { z } from 'zod';

export const orderItemSchema = z.object({
  item: z.object({
    id: z.string(),
    code: z.string(),
    title: z.string(),
    price: z.number(),
    size: z.string(),
    type: z.string(),
    image: z.string().optional(),
  }),
  pieces: z.number().int().positive('Quantity must be positive'),
  subtotal: z.number().positive('Subtotal must be positive'),
});

export type OrderItemDto = z.infer<typeof orderItemSchema>;

export const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  country: z.string().min(1, 'Country is required'),
});

export type AddressDto = z.infer<typeof addressSchema>;

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
  contactNumber: z.string().min(1, 'Contact number is required'),
  billingAddress: addressSchema,
  shippingAddress: addressSchema,
  userId: z.string().optional(),
});

export type CreateOrderDto = z.infer<typeof createOrderSchema>;

export type UpdateOrderStatusDto = {
  status: OderStatus;
};

export const orderQuerySchema = z.object({
  status: z.enum(['placed', 'processing', 'delivered', 'canceled']).optional(),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
});

export type OrderQueryDto = z.infer<typeof orderQuerySchema>;
export type OderStatus = z.infer<typeof orderQuerySchema>['status'];

export function getOderStatusLabel(status: OderStatus) {
  switch (status) {
    case 'placed':
      return 'Placed';
    case 'processing':
      return 'Processing';
    case 'delivered':
      return 'Delivered';
    case 'canceled':
      return 'Canceled';
    default:
      return 'All';
  }
}

export type OrderDto = {
  id: string;
  trackingCode: string;
  status: OderStatus;
  paymentMethod: string;
  items: OrderItemDto[];
  total: number;
  contactNumber: string;
  billingAddress: AddressDto;
  shippingAddress: AddressDto;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
};
