import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { AppButton } from '@/components/common/AppButton';
import { createOrderSchema, CreateOrderDto } from '@/models/order';
import { SubmitFn } from '@/models/common';
import { useCartStore } from '@/stores/cartStore';
import { useState } from 'react';
import { z } from 'zod';

const checkoutFormSchema = createOrderSchema.extend({
  sameAsBilling: z.boolean().default(false),
});

type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

export type CheckoutFormProps = {
  onSubmit?: SubmitFn<CreateOrderDto>;
  isLoading?: boolean;
};

export function CheckoutForm({ onSubmit, isLoading }: CheckoutFormProps) {
  const { items } = useCartStore();
  const [sameAsBilling, setSameAsBilling] = useState(false);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      items: items,
      contactNumber: '',
      billingAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
      shippingAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
      sameAsBilling: false,
    },
  });

  function handleSubmit(data: CheckoutFormData) {
    const orderData: CreateOrderDto = {
      items: data.items,
      contactNumber: data.contactNumber,
      billingAddress: data.billingAddress,
      shippingAddress: data.sameAsBilling ? data.billingAddress : data.shippingAddress,
      userId: data.userId,
    };

    onSubmit?.(orderData, form.setError);
  }

  const handleSameAsBillingChange = (checked: boolean) => {
    setSameAsBilling(checked);
    form.setValue('sameAsBilling', checked);

    if (checked) {
      const billingAddress = form.getValues('billingAddress');
      form.setValue('shippingAddress', billingAddress);
    }
  };

  const renderAddressFields = (prefix: 'billingAddress' | 'shippingAddress', disabled: boolean = false) => {
    return (
      <div className="space-y-4">
        <FormField
          control={form.control}
          name={`${prefix}.street`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St" {...field} disabled={disabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name={`${prefix}.city`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="City" {...field} disabled={disabled} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`${prefix}.state`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>State/Province</FormLabel>
                <FormControl>
                  <Input placeholder="State" {...field} disabled={disabled} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name={`${prefix}.zipCode`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip/Postal Code</FormLabel>
                <FormControl>
                  <Input placeholder="Zip Code" {...field} disabled={disabled} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`${prefix}.country`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="Country" {...field} disabled={disabled} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <FormField
            control={form.control}
            name="contactNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Number</FormLabel>
                <FormControl>
                  <Input placeholder="Phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Billing Address</h2>
          {renderAddressFields('billingAddress')}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Shipping Address</h2>
          <div>
            <FormField
              control={form.control}
              name="sameAsBilling"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start space-x-3 rounded-md">
                  <FormControl>
                    <div className="flex items-center space-x-4 w-full">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          handleSameAsBillingChange(checked as boolean);
                        }}
                      />
                      <FormLabel>Shipping address same as billing</FormLabel>
                    </div>
                  </FormControl>
                  <FormDescription>
                    If checked, the shipping address will be the same as the billing address
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
          {renderAddressFields('shippingAddress', sameAsBilling)}
        </div>

        <div className="pt-4">
          <AppButton type="submit" className="w-full" isLoading={isLoading}>
            Place Order
          </AppButton>
        </div>
      </form>
    </Form>
  );
}
