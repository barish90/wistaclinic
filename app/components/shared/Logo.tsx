import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  priority?: boolean;
}

const sizeDimensions = {
  sm: { width: 120, height: 32 },
  md: { width: 160, height: 48 },
  lg: { width: 200, height: 56 },
} as const;

const sizeClasses = {
  sm: 'h-8',
  md: 'h-10 lg:h-12',
  lg: 'h-12 lg:h-14',
} as const;

export function Logo({ size = 'md', className, priority = false }: LogoProps) {
  const dims = sizeDimensions[size];
  return (
    <Image
      src="/images/logo/wista-logo-gold.webp"
      alt="WistaClinic"
      width={dims.width}
      height={dims.height}
      priority={priority}
      className={cn('w-auto object-contain', sizeClasses[size], className)}
    />
  );
}
