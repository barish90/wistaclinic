import { Palette, Shield, Lightbulb, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const iconMap: Record<string, typeof Palette> = {
  artistry: Palette,
  safety: Shield,
  innovation: Lightbulb,
  care: Heart,
};

interface Value {
  id?: string;
  title: string;
  description: string;
}

interface ValuesGridProps {
  title: string;
  values: Value[];
  className?: string;
}

export function ValuesGrid({ title, values, className }: ValuesGridProps) {
  return (
    <section className={cn('py-20 sm:py-24', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-4xl font-bold text-center text-foreground sm:text-5xl mb-16">
          {title}
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 max-w-5xl mx-auto">
          {values.map((value) => {
            const Icon = (value.id ? iconMap[value.id] : undefined) || iconMap[value.title.toLowerCase()] || Heart;

            return (
              <Card
                key={value.title}
                className="border-bronze/20 bg-gradient-to-br from-background to-champagne/5 hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-8 space-y-4">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-bronze/10">
                    <Icon className="w-7 h-7 text-bronze-deep" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
