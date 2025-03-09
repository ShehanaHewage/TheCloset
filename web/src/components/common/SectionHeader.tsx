import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  actions,
  className,
  titleClassName,
  descriptionClassName,
}) => {
  return (
    <div className={cn('my-2 border-l-4 border-primary', className)}>
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
        <div className="pl-4">
          <h2 className={cn('text-lg font-semibold tracking-tight font-display', titleClassName)}>{title}</h2>
          {description && <p className={cn('text-sm text-muted-foreground/80', descriptionClassName)}>{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
};

export default SectionHeader;
