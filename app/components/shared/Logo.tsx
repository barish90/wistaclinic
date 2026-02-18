import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-8',
  md: 'h-10 lg:h-12',
  lg: 'h-12 lg:h-14',
} as const;

export function Logo({ size = 'md', className }: LogoProps) {
  return (
    <img
      src="/images/logo/wista-logo-gold.webp"
      alt="WistaClinic"
      className={cn('w-auto object-contain', sizeClasses[size], className)}
    />
  );
}
