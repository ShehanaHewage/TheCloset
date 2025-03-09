import { useUserStore } from '@/stores/userStore';
import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';
import { User, LogOut, Settings, ShoppingBag, Package, ClipboardList } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from '@tanstack/react-router';

export function UserMenu() {
  const { user, isAuthenticated, logout } = useUserStore();
  const { itemCount } = useCartStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: '/' });
  };

  if (!isAuthenticated) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="text-white/80 hover:text-white hover:bg-transparent"
        onClick={() => navigate({ to: '/auth/login' })}
      >
        <User className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-transparent relative">
          <User className="h-6 w-6 text-white" />
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-neutral-900"></span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span>
              {user?.firstName} {user?.lastName}
            </span>
            <span className="text-xs text-muted-foreground">{user?.username}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate({ to: '/profile' })}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate({ to: '/cart' })}>
          <ShoppingBag className="mr-2 h-4 w-4" />
          <span>Cart</span>
          {itemCount > 0 && (
            <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {itemCount > 99 ? '99+' : itemCount}
            </span>
          )}
        </DropdownMenuItem>
        {user?.type === 'admin' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate({ to: '/admin/items' })}>
              <Package className="mr-2 h-4 w-4" />
              <span>Admin Items</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate({ to: '/admin/orders' })}>
              <ClipboardList className="mr-2 h-4 w-4" />
              <span>Admin Orders</span>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} variant="destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
