import { createFileRoute, Link } from '@tanstack/react-router';
import { LoginForm } from './-comps/LoginForm';
import { useMutation } from '@tanstack/react-query';
import { LoginFormDto, LoginDto } from '@/models/user';
import api from '@/api/api';
import { useNavigate } from '@tanstack/react-router';
import { useUserStore } from '@/stores/userStore';

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const login = useUserStore((state) => state.login);

  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: (data: LoginFormDto) => {
      return api.users.login(data);
    },
    onSuccess: (data: LoginDto) => {
      login(data.user, data.token);
      console.log('Login successful:', data);
      navigate({ to: '/' });
    },
  });

  return (
    <div className="min-h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070')" }}
      ></div>

      <div className="absolute inset-0 bg-neutral-900/75"></div>

      <div className="relative z-10 flex flex-col md:flex-row min-h-screen">
        <div className="hidden md:flex md:w-1/2 flex-col justify-between p-12">
          <div className="mb-auto">
            <Link to="/">
              <h1 className="text-4xl font-bold text-white mb-2">The Closet</h1>
              <p className="text-white/80 text-lg">Make your closet elegant</p>
            </Link>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Shop</h2>
              <div className="grid grid-cols-2 gap-2 text-white/70">
                <a href="#" className="hover:text-white transition-colors">
                  Women's Collection
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Men's Collection
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Accessories
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  New Arrivals
                </a>
              </div>
            </div>

            <div className="pt-6 border-t border-white/20 text-white/60 text-sm">
              © 2023 The Closet. All rights reserved.
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center p-6">
          <LoginForm
            onSubmit={(formData, onFieldError) => {
              loginMutation(formData, {
                onError: (error) => {
                  onFieldError?.('username', { message: error.message });
                  onFieldError?.('password', { message: error.message });
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
