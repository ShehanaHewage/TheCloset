import * as React from 'react';
import { Link } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';

import { Button, ButtonProps, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type AppButtonProps = ButtonProps & {
  /**
   * When provided, the button will be wrapped with a Link component
   */
  to?: string;

  /**
   * When true, the button will show a loading spinner and be disabled
   */
  loading?: boolean;
};

export const AppButton = React.forwardRef<HTMLButtonElement, AppButtonProps>(
  ({ className, variant, size, to, loading, children, disabled, ...props }, ref) => {
    const isDisabled = disabled || loading;

    const buttonContent = (
      <>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </>
    );

    if (to) {
      return (
        <Link
          to={to}
          className={cn(buttonVariants({ variant, size, className }))}
          aria-disabled={isDisabled ? 'true' : undefined}
          tabIndex={isDisabled ? -1 : undefined}
          onClick={isDisabled ? (e: React.MouseEvent<HTMLAnchorElement>) => e.preventDefault() : undefined}
        >
          {buttonContent}
        </Link>
      );
    }

    return (
      <Button ref={ref} className={className} variant={variant} size={size} disabled={isDisabled} {...props}>
        {buttonContent}
      </Button>
    );
  },
);

AppButton.displayName = 'AppButton';
