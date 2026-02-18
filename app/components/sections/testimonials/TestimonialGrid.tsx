'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import { testimonials, getAverageRating } from '@/lib/data/testimonials';
import { procedures } from '@/lib/data/procedures';
import { TestimonialCard } from './TestimonialCard';
import { TestimonialFilter, type SortOption } from './TestimonialFilter';

export function TestimonialGrid() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Build the procedure options from procedures that appear in testimonials
  const procedureOptions = useMemo(() => {
    const slugsInTestimonials = new Set(testimonials.map((t) => t.procedure));
    return procedures
      .filter((p) => slugsInTestimonials.has(p.slug))
      .map((p) => ({ slug: p.slug, title: p.title }));
  }, []);

  // Filter and sort
  const filtered = useMemo(() => {
    const items =
      activeFilter === 'all'
        ? [...testimonials]
        : testimonials.filter((t) => t.procedure === activeFilter);

    if (sortBy === 'newest') {
      items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else {
      items.sort((a, b) => b.rating - a.rating || new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return items;
  }, [activeFilter, sortBy]);

  const avgRating = getAverageRating(filtered);
  const totalCount = filtered.length;

  return (
    <div className="space-y-8">
      {/* Summary bar */}
      <div className="flex flex-col items-center gap-3 rounded-xl border border-[#D4A847]/20 bg-[#D4A847]/5 px-6 py-4 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Star className="h-5 w-5 fill-[#D4A847] text-[#D4A847]" />
            <span className="text-2xl font-bold text-foreground">{avgRating}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            Average rating from{' '}
            <span className="font-medium text-foreground">{totalCount}</span>{' '}
            {totalCount === 1 ? 'review' : 'reviews'}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Verified patient experiences
        </p>
      </div>

      {/* Filters */}
      <TestimonialFilter
        procedures={procedureOptions}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <TestimonialCard testimonial={testimonial} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-lg text-muted-foreground">
            No testimonials found for this procedure.
          </p>
        </div>
      )}
    </div>
  );
}
