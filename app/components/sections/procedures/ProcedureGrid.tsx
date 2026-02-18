import { procedures } from '@/lib/data/procedures';
import { ProcedureCard } from './ProcedureCard';
import { cn } from '@/lib/utils';

interface ProcedureGridProps {
  locale: string;
  className?: string;
}

export function ProcedureGrid({ locale, className }: ProcedureGridProps) {
  return (
    <div className={cn('grid gap-8 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {procedures.map((procedure) => (
        <ProcedureCard
          key={procedure.slug}
          slug={procedure.slug}
          title={procedure.title}
          shortDescription={procedure.shortDescription}
          locale={locale}
        />
      ))}
    </div>
  );
}
