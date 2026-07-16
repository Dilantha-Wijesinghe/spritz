import type { CSSProperties, MouseEvent, ReactNode } from 'react';

type Variant = 'chrome' | 'card' | 'row' | 'pick' | 'nav' | 'sheet';

interface GlassProps {
  as?: 'button' | 'div';
  variant: Variant;
  corner?: number;
  className?: string;
  style?: CSSProperties;
  contentClassName?: string;
  contentStyle?: CSSProperties;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  title?: string;
  label?: string;
  children?: ReactNode;
}

/** A stable, in-flow Organic surface with no runtime measurement or effects. */
export default function Glass({
  as = 'button',
  variant,
  corner = 999,
  className = '',
  style,
  contentClassName = '',
  contentStyle,
  onClick,
  title,
  label,
  children,
}: GlassProps) {
  const classes = `glass-surface gs-${variant} ${className} ${contentClassName}`;
  const mergedStyle = { borderRadius: corner, ...style, ...contentStyle };

  if (as === 'div') {
    return (
      <div className={classes} style={mergedStyle} onClick={onClick} title={title} aria-label={label}>
        {children}
      </div>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      style={mergedStyle}
      onClick={onClick}
      title={title}
      aria-label={label}
    >
      {children}
    </button>
  );
}
