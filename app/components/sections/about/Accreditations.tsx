import { Award, BadgeCheck, Shield, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccreditationsProps {
  title: string;
  description: string;
  className?: string;
}

export function Accreditations({ title, description, className }: AccreditationsProps) {
  const accreditations = [
    { name: 'JCI Accredited', icon: Award },
    { name: 'ISO 9001:2015', icon: BadgeCheck },
    { name: 'European Board Certified', icon: Shield },
    { name: 'Excellence in Care', icon: Star },
  ];

  return (
    <section className={cn('py-20 sm:py-24', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-serif text-4xl font-bold text-foreground sm:text-5xl">
            {title}
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12 max-w-5xl mx-auto">
          {accreditations.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-bronze/20 bg-gradient-to-br from-background to-champagne/5 hover:border-bronze/40 transition-colors duration-300 min-w-[200px]"
              >
                <Icon className="w-12 h-12 text-bronze-deep mb-4" strokeWidth={1.5} />
                <p className="font-serif text-lg font-semibold text-foreground text-center">
                  {item.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
