import { Footer } from '@/components/layout/Footer';
import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUserStore } from '@/stores/userStore';
import { useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { cn } from '@/lib/utils';
import { Toaster } from 'sonner';
const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: RootLayout,
});

function isRootPath(pathname: string) {
  const cleanedPathname = pathname.replace(/\/$/, '');
  if (cleanedPathname === '') {
    return true;
  }
  if (cleanedPathname.startsWith('/auth')) {
    return true;
  }
  return false;
}

function RootLayout() {
  const { isAuthenticated, refresh } = useUserStore();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      refresh();
    }
  }, [isAuthenticated, refresh]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 min-h-screen">
          <Header className={cn(isRootPath(location.pathname) ? 'bg-transparent' : '')} />
          <div className={cn('h-[80px]', isRootPath(location.pathname) && 'hidden')} />
          <Outlet />
        </main>
        <Footer />
      </div>
      <Toaster position="bottom-right" closeButton />
    </QueryClientProvider>
  );
}
