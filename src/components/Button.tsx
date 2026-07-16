import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'neo-primary'
  | 'neo-secondary'
  | 'ghost'
  | 'danger'
  | 'chip'
  | 'tab'
  | 'day'
  | 'stepper';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  active?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  active = false,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`native-button button-${variant} button-${size} ${block ? 'button-block' : ''} ${active ? 'is-active' : ''} ${className}`}
      {...props}
    />
  );
}
