import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useState } from 'react';
import { Search, ShoppingBag, X, Menu } from 'lucide-react';
import { UserMenu } from './UserMenu';
import { MobileUserMenu } from './MobileUserMenu';
import { NavigationLinks } from './NavigationLinks';
import { useUserStore } from '@/stores/userStore';
import { useCartStore } from '@/stores/cartStore';
import { Link } from '@tanstack/react-router';
import { cn } from '@/lib/utils';
import { AppButton } from '../common/AppButton';
export type HeaderProps = {
  className?: string;
};

export function Header({ className }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useUserStore();
  const { itemCount } = useCartStore();

  return (
    <header className={cn('absolute top-0 left-0 right-0 z-50 transition-colors duration-1000 bg-black', className)}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-white font-bold text-xl">
              The Closet
            </Link>
          </div>

          {/* Desktop Navigation */}
          <NavigationLinks className="hidden md:flex space-x-8" />

          {/* Search and Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search..."
                className="w-64 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full text-white/60 hover:text-white hover:bg-transparent"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>

            {/* User Menu */}
            <UserMenu />

            <AppButton
              variant="ghost"
              size="icon"
              className="text-white/80 hover:text-white hover:bg-transparent relative"
              to="/cart"
            >
              <ShoppingBag className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-neutral-900 text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </AppButton>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              variant="ghost"
              size="icon"
              className="text-white/80 hover:text-white hover:bg-transparent"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 bg-neutral-900/95 backdrop-blur-sm mt-2 rounded-lg">
            <div className="flex flex-col space-y-3 px-4">
              <NavigationLinks
                className="flex flex-col space-y-3"
                linkClassName="text-white/80 hover:text-white transition-colors"
              />
            </div>

            <div className="mt-4 pt-4 border-t border-white/20 px-4">
              <div className="relative mb-4">
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full text-white/60 hover:text-white hover:bg-transparent"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>

              <div className={isAuthenticated ? 'flex flex-col space-y-2' : 'flex space-x-4'}>
                {/* Mobile User Menu */}
                <MobileUserMenu />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
