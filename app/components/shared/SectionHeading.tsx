import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({
  title,
  subtitle,
  className,
  align = 'center',
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'space-y-2',
        align === 'center' && 'text-center',
        align === 'left' && 'text-left',
        className
      )}
    >
      <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className={cn("text-muted-foreground text-lg sm:text-xl max-w-2xl", align === 'center' && 'mx-auto')}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
