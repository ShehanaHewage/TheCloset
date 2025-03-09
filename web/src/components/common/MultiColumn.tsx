import { cn } from '@/lib/utils';

type BreakpointCols = {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  '2xl'?: number;
};

type ResponsiveGridVars = {
  '--cols-xs'?: number;
  '--cols-sm'?: number;
  '--cols-md'?: number;
  '--cols-lg'?: number;
  '--cols-xl'?: number;
  '--cols-2xl'?: number;
};

type CSSPropertiesWithVars = React.CSSProperties & ResponsiveGridVars;

export type MultiColumnProps = {
  children?: React.ReactNode;
  className?: string;
} & (
  | {
      colMode: 'auto-fill' | 'auto-fit';
      colWidth: number;
    }
  | {
      colMode: 'fixed';
      cols: number | BreakpointCols;
    }
);

const RESPONSIVE_STYLES = `
  .responsive-grid {
    grid-template-columns: repeat(var(--cols-xs, 1), 1fr);
  }
  @media (min-width: 640px) {
    .responsive-grid {
      grid-template-columns: repeat(var(--cols-sm, var(--cols-xs, 1)), 1fr);
    }
  }
  @media (min-width: 768px) {
    .responsive-grid {
      grid-template-columns: repeat(var(--cols-md, var(--cols-sm, var(--cols-xs, 1))), 1fr);
    }
  }
  @media (min-width: 1024px) {
    .responsive-grid {
      grid-template-columns: repeat(var(--cols-lg, var(--cols-md, var(--cols-sm, var(--cols-xs, 1)))), 1fr);
    }
  }
  @media (min-width: 1280px) {
    .responsive-grid {
      grid-template-columns: repeat(var(--cols-xl, var(--cols-lg, var(--cols-md, var(--cols-sm, var(--cols-xs, 1))))), 1fr);
    }
  }
  @media (min-width: 1536px) {
    .responsive-grid {
      grid-template-columns: repeat(var(--cols-2xl, var(--cols-xl, var(--cols-lg, var(--cols-md, var(--cols-sm, var(--cols-xs, 1)))))), 1fr);
    }
  }
`;

function getResponsiveGridStyle(cols: BreakpointCols): CSSPropertiesWithVars {
  const style = {} as CSSPropertiesWithVars;

  const breakpointMap: Record<keyof BreakpointCols, keyof ResponsiveGridVars> = {
    xs: '--cols-xs',
    sm: '--cols-sm',
    md: '--cols-md',
    lg: '--cols-lg',
    xl: '--cols-xl',
    '2xl': '--cols-2xl',
  };

  Object.entries(cols).forEach(([breakpoint, value]) => {
    const cssVar = breakpointMap[breakpoint as keyof BreakpointCols];
    if (cssVar && value !== undefined) {
      style[cssVar] = value;
    }
  });

  return style;
}

function getGridTemplateColumns(props: MultiColumnProps): React.CSSProperties | CSSPropertiesWithVars {
  if (props.colMode === 'auto-fill') {
    return {
      gridTemplateColumns: `repeat(auto-fill, minmax(${props.colWidth}px, 1fr))`,
    };
  } else if (props.colMode === 'auto-fit') {
    return {
      gridTemplateColumns: `repeat(auto-fit, minmax(${props.colWidth}px, 1fr))`,
    };
  } else if (props.colMode === 'fixed') {
    if (typeof props.cols === 'number') {
      return {
        gridTemplateColumns: `repeat(${props.cols}, 1fr)`,
      };
    }
    return getResponsiveGridStyle(props.cols);
  }
  throw new Error('Invalid colMode');
}

// Add styles to document
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.textContent = RESPONSIVE_STYLES;
  document.head.appendChild(styleEl);
}

const MultiColumn: React.FC<MultiColumnProps> = (props) => {
  const isResponsive = props.colMode === 'fixed' && typeof props.cols !== 'number';

  return (
    <div
      className={cn('grid gap-4', isResponsive && 'responsive-grid', props.className)}
      style={getGridTemplateColumns(props)}
    >
      {props.children}
    </div>
  );
};

export default MultiColumn;
