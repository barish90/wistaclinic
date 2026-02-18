import { Card, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DoctorCardProps {
  name: string;
  title: string;
  specialty: string;
  bio: string;
  className?: string;
}

export function DoctorCard({
  name,
  title,
  specialty,
  bio,
  className,
}: DoctorCardProps) {
  return (
    <Card
      className={cn(
        'group overflow-hidden border-bronze/20 bg-gradient-to-br from-background to-champagne/5 hover:shadow-xl transition-all duration-500',
        className
      )}
    >
      <CardContent className="p-0">
        {/* Doctor photo placeholder */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-bronze-light via-champagne to-bronze flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Doctor avatar fallback */}
          <div className="relative z-10 flex flex-col items-center justify-center gap-4">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/40">
              <User className="w-12 h-12 text-white" strokeWidth={1.5} />
            </div>
            <div className="text-center px-4">
              <p className="text-white font-serif text-2xl font-bold drop-shadow-lg">
                {name.split(' ').map(word => word[0] || '').join('')}
              </p>
            </div>
          </div>

          {/* Decorative overlay */}
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_120%,rgba(212,175,55,0.3),transparent)]" />
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          <div>
            <h3 className="font-serif text-2xl font-bold text-foreground">
              {name}
            </h3>
            <p className="text-bronze-deep font-medium">{title}</p>
          </div>

          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {specialty}
          </p>

          <p className="text-muted-foreground leading-relaxed line-clamp-4">
            {bio}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
