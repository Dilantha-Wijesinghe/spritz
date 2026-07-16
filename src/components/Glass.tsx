import { useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import LiquidGlass from 'liquid-glass-react';

type Variant = 'chrome' | 'primary' | 'accent2' | 'card' | 'row' | 'pick' | 'nav' | 'sheet';

interface GlassProps {
  /** Render the content node as a real <button> (default) or a <div>. */
  as?: 'button' | 'div';
  variant: Variant;
  corner?: number;
  /** Classes/styles for the slot that defines the element's footprint in the layout. */
  className?: string;
  style?: CSSProperties;
  /** Classes/styles for the content node inside the glass. */
  contentClassName?: string;
  contentStyle?: CSSProperties;
  onClick?: (e: MouseEvent) => void;
  title?: string;
  label?: string;
  displacementScale?: number;
  blurAmount?: number;
  aberrationIntensity?: number;
  children?: ReactNode;
}

/**
 * In-flow adapter for liquid-glass-react. The library positions itself with
 * translate(-50%,-50%) inside a positioned parent and sizes to its content,
 * so we render a slot whose width the caller controls, mirror that width onto
 * the content node, and feed the content's measured height back to the slot.
 */
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
  displacementScale = 34,
  blurAmount = 0.15,
  aberrationIntensity = 1.5,
  children,
}: GlassProps) {
  const slotRef = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const [h, setH] = useState(0);
  const [innerEl, setInnerEl] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const slot = slotRef.current;
    if (!slot) return;
    const measure = () => setW(slot.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(slot);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (!innerEl) return;
    const measure = () => setH(innerEl.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(innerEl);
    return () => ro.disconnect();
  }, [innerEl]);

  const Inner = as;
  return (
    <div ref={slotRef} className={`lg-slot lg-${variant} ${className}`} style={{ height: h || undefined, ...style }}>
      {w > 0 && (
        <LiquidGlass
          style={{ position: 'absolute', top: '50%', left: '50%' }}
          padding="0px"
          cornerRadius={corner}
          elasticity={0}
          mode="standard"
          saturation={130}
          displacementScale={displacementScale}
          blurAmount={blurAmount}
          aberrationIntensity={aberrationIntensity}
          mouseContainer={slotRef}
        >
          <Inner
            ref={setInnerEl as never}
            {...(as === 'button' ? { type: 'button' as const } : {})}
            className={`glass-content gc-${variant} ${contentClassName}`}
            style={{ width: w, borderRadius: corner, ...contentStyle }}
            onClick={onClick}
            title={title}
            aria-label={label}
          >
            {children}
          </Inner>
        </LiquidGlass>
      )}
    </div>
  );
}
