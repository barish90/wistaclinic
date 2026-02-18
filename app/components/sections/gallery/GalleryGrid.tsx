'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryItems, type GalleryCategory } from '@/lib/data/gallery';
import { GalleryFilter } from './GalleryFilter';
import { BeforeAfterCard } from './BeforeAfterCard';

export function GalleryGrid() {
  const [activeCategory, setActiveCategory] = useState<
    GalleryCategory | 'all'
  >('all');

  const filteredItems =
    activeCategory === 'all'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <div className="space-y-8">
      <GalleryFilter
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <BeforeAfterCard item={item} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredItems.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          No results found for this category.
        </p>
      )}
    </div>
  );
}
