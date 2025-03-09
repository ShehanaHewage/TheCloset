import { useUserStore } from '@/stores/userStore';
import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';
import { User, LogOut, Settings, ShoppingBag, Package, ClipboardList } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export function MobileUserMenu() {
  const { user, isAuthenticated, logout } = useUserStore();
  const { itemCount } = useCartStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: '/' });
  };

  const handleLogin = () => {
    navigate({ to: '/auth/login' });
  };

  const handleProfile = () => {
    navigate({ to: '/' });
  };

  const handleCart = () => {
    window.location.href = '#/cart';
  };

  if (!isAuthenticated) {
    return (
      <div className="flex space-x-2">
        <Button
          variant="outline"
          className="flex-1 justify-center border-white/40 text-white font-medium hover:bg-white/20 bg-white/10"
          onClick={handleLogin}
        >
          <User className="h-5 w-5 mr-2" />
          Login
        </Button>

        <Button
          variant="outline"
          className="flex-1 justify-center border-white/40 text-white font-medium hover:bg-white/20 bg-white/10"
          onClick={handleCart}
        >
          <ShoppingBag className="h-5 w-5 mr-2" />
          Cart
          {itemCount > 0 && (
            <span className="ml-2 bg-white text-neutral-900 text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {itemCount > 99 ? '99+' : itemCount}
            </span>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-2">
      <div className="p-3 bg-white/10 rounded-md border border-white/20">
        <div className="text-sm font-medium flex items-center text-white">
          <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
          {user?.firstName} {user?.lastName}
        </div>
        <div className="text-xs text-white/60">{user?.username}</div>
      </div>

      <Button
        variant="outline"
        className="justify-start border-white/40 text-white font-medium bg-white/10 hover:bg-white/20"
        onClick={handleProfile}
      >
        <Settings className="h-5 w-5 mr-2" />
        Profile
      </Button>

      <Button
        variant="outline"
        className="justify-start border-white/40 text-white font-medium bg-white/10 hover:bg-white/20"
        onClick={handleCart}
      >
        <ShoppingBag className="h-5 w-5 mr-2" />
        Cart
        {itemCount > 0 && (
          <span className="ml-auto bg-white text-neutral-900 text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </Button>

      {user?.type === 'admin' && (
        <>
          <Button
            variant="outline"
            className="justify-start border-white/40 text-white font-medium bg-white/10 hover:bg-white/20"
            onClick={() => navigate({ to: '/admin/items' })}
          >
            <Package className="h-5 w-5 mr-2" />
            Admin Items
          </Button>

          <Button
            variant="outline"
            className="justify-start border-white/40 text-white font-medium bg-white/10 hover:bg-white/20"
            onClick={() => navigate({ to: '/admin/orders' })}
          >
            <ClipboardList className="h-5 w-5 mr-2" />
            Admin Orders
          </Button>
        </>
      )}

      <Button
        variant="outline"
        className="justify-start border-red-500/30 text-white font-medium bg-red-500/10 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-200"
        onClick={handleLogout}
      >
        <LogOut className="h-5 w-5 mr-2" />
        Logout
      </Button>
    </div>
  );
}
