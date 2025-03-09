import { cn } from '@/lib/utils';
import { useRef } from 'react';

export type PageProps = {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  isLoading?: boolean;
  actions?: React.ReactNode;
};

export const Page: React.FC<PageProps> = ({
  title,
  description,
  children,
  className,
  containerClassName,
  isLoading,
  actions,
}) => {
  const headerRef = useRef<HTMLDivElement>(null);

  return (
    <div className={cn('h-full flex flex-col min-h-[calc(100vh-150px)]', containerClassName)}>
      <div
        className={cn(
          'bg-background rounded-md flex flex-col flex-1 min-h-0 border p-5',
          className,
          isLoading &&
            "relative before:content-[''] before:h-[4px] before:bg-gradient-progress before:absolute before:top-0 before:left-0 before:right-0 before:animate-gradient-progress",
        )}
      >
        <div ref={headerRef}>
          {(title || description || actions) && (
            <div className="px-6 py-4 flex justify-between items-start gap-4">
              <div className="flex-grow">
                {title && <h1 className="text-2xl font-bold tracking-tight font-display">{title}</h1>}
                {description && <p className="text-muted-foreground text-sm">{description}</p>}
              </div>
              {actions && <div className="flex-shrink-0">{actions}</div>}
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="px-6 py-2">{children}</div>
        </div>
      </div>
    </div>
  );
};
