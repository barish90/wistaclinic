import { cn } from '@/lib/utils';

const DEFAULT_TOUR_AREAS = [
  'Reception & Lounge',
  'Consultation Suites',
  'Surgical Theater',
  'Recovery Rooms',
  'VIP Suites',
  'Medical Laboratory',
];

interface ClinicTourProps {
  title: string;
  description: string;
  tourAreas?: string[];
  className?: string;
}

export function ClinicTour({ title, description, tourAreas = DEFAULT_TOUR_AREAS, className }: ClinicTourProps) {

  return (
    <section className={cn('py-20 sm:py-24 bg-gradient-to-b from-champagne/5 to-background', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-serif text-4xl font-bold text-foreground sm:text-5xl">
            {title}
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {tourAreas.map((area, index) => (
            <div
              key={`${area}-${index}`}
              className="group relative aspect-[4/3] rounded-lg overflow-hidden bg-gradient-to-br from-bronze-light via-champagne to-bronze shadow-md hover:shadow-xl transition-all duration-500"
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-500" />

              {/* Area title */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="font-serif text-xl font-semibold text-white">
                  {area}
                </p>
              </div>

              {/* Decorative number */}
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="font-serif text-sm font-semibold text-white">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
