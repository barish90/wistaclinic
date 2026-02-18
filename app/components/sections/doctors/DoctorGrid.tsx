import { doctors } from '@/lib/data/doctors';
import { DoctorCard } from './DoctorCard';
import { cn } from '@/lib/utils';

interface DoctorGridProps {
  className?: string;
}

export function DoctorGrid({ className }: DoctorGridProps) {
  return (
    <div className={cn('grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4', className)}>
      {doctors.map((doctor) => (
        <DoctorCard
          key={doctor.id}
          name={doctor.name}
          title={doctor.title}
          specialty={doctor.specialty}
          bio={doctor.bio}
        />
      ))}
    </div>
  );
}
