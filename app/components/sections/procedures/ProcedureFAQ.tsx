'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

interface FAQ {
  question: string;
  answer: string;
}

interface ProcedureFAQProps {
  faqs: FAQ[];
  className?: string;
}

export function ProcedureFAQ({ faqs, className }: ProcedureFAQProps) {
  return (
    <section className={cn('py-20 sm:py-24', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-center text-foreground sm:text-4xl mb-12">
            Frequently Asked Questions
          </h2>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-bronze/20 rounded-lg px-6 bg-gradient-to-br from-background to-champagne/5"
              >
                <AccordionTrigger className="text-left font-serif text-lg font-semibold text-foreground hover:text-bronze-deep">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pt-2 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
