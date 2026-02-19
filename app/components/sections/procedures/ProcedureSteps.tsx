import { cn } from '@/lib/utils';

export interface Step {
  title: string;
  description: string;
}

interface ProcedureStepsProps {
  steps: Step[];
  heading?: string;
  className?: string;
}

export function ProcedureSteps({ steps, heading = 'The Process', className }: ProcedureStepsProps) {
  return (
    <section className={cn('py-20 sm:py-24 bg-gradient-to-b from-champagne/5 to-background', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-center text-foreground sm:text-4xl mb-16">
            {heading}
          </h2>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={index} className="relative pl-12 sm:pl-16">
                {/* Timeline connector */}
                {index !== steps.length - 1 && (
                  <div className="absolute left-6 top-12 sm:left-8 sm:top-14 h-full w-[2px] bg-gradient-to-b from-bronze to-champagne" />
                )}

                {/* Step number */}
                <div className="absolute left-0 top-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-bronze to-bronze-deep flex items-center justify-center shadow-lg">
                  <span className="font-serif text-xl sm:text-2xl font-bold text-white">
                    {index + 1}
                  </span>
                </div>

                {/* Step content */}
                <div className="space-y-3 pb-8">
                  <h3 className="font-serif text-2xl font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
