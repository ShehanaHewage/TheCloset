import { createFileRoute, Outlet, Navigate } from '@tanstack/react-router';
import { useUserStore } from '../../stores/userStore';

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
});

function AdminLayout() {
  const { user, isAuthenticated } = useUserStore();

  if (!isAuthenticated || user?.type !== 'admin') {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
