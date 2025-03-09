import { createFileRoute, Link } from '@tanstack/react-router';
import { RegisterForm } from './-comps/RegisterForm';
import { RegisterFormDto } from '@/models/user';
import { useMutation } from '@tanstack/react-query';
import api from '@/api/api';
import { useNavigate } from '@tanstack/react-router';
export const Route = createFileRoute('/auth/register')({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();

  const { mutate: register, isPending } = useMutation({
    mutationFn: (data: RegisterFormDto) => {
      return api.users.register(data);
    },
    onSuccess: (data) => {
      console.log(data);
      navigate({ to: '/auth/login' });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <div className="min-h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=2070')" }}
      ></div>

      <div className="absolute inset-0 bg-neutral-900/75"></div>

      <div className="relative z-10 flex flex-col md:flex-row min-h-screen">
        <div className="hidden md:flex md:w-1/2 flex-col justify-between p-12">
          <div className="mb-auto">
            <Link to="/">
              <h1 className="text-4xl font-bold text-white mb-2">The Closet</h1>
              <p className="text-white/80 text-lg">Join our community</p>
            </Link>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Benefits</h2>
              <ul className="space-y-2 text-white/70">
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-white/90"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Exclusive member discounts
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-white/90"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Early access to new collections
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-white/90"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Free shipping on orders over $50
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-white/20 text-white/60 text-sm">
              © 2023 The Closet. All rights reserved.
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center p-6">
          <RegisterForm
            onSubmit={(formData, onFieldError) => {
              register(formData, {
                onError: (error) => {
                  onFieldError?.('username', { message: error.message });
                },
              });
            }}
            isLoading={isPending}
          />
        </div>
      </div>
    </div>
  );
}
