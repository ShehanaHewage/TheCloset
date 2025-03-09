import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Link } from '@tanstack/react-router';
import { loginFormSchema } from '@/models/user';
import { SubmitFn } from '@/models/common';

type LoginFormValues = z.infer<typeof loginFormSchema>;

export type LoginFormProps = {
  onSubmit?: SubmitFn<LoginFormValues>;
  isLoading?: boolean;
};

export function LoginForm(props: LoginFormProps) {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  function onSubmit(data: LoginFormValues) {
    props.onSubmit?.(data, form.setError);
  }

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl border border-gray-200">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-black">Welcome Back</h1>
        <p className="text-gray-600">Sign in to your account</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your username"
                    {...field}
                    className="bg-white border-gray-300 text-black placeholder:text-gray-400"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                    className="bg-white border-gray-300 text-black placeholder:text-gray-400"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <span className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer">Forgot password?</span>
          </div>

          <Button type="submit" className="w-full bg-neutral-800 hover:bg-neutral-700 text-white border-0 shadow-md">
            Sign In
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link
          to="/auth/register"
          className="font-medium text-blue-600 hover:text-blue-800 underline decoration-1 underline-offset-2"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}
