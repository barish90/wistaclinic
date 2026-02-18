'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { galleryCategories, type GalleryCategory } from '@/lib/data/gallery';

interface GalleryFilterProps {
  activeCategory: GalleryCategory | 'all';
  onCategoryChange: (category: GalleryCategory | 'all') => void;
}

export function GalleryFilter({
  activeCategory,
  onCategoryChange,
}: GalleryFilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Button
        variant={activeCategory === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onCategoryChange('all')}
        className={cn(
          activeCategory === 'all' &&
            'bg-bronze hover:bg-bronze-deep text-white border-bronze'
        )}
      >
        All
      </Button>
      {galleryCategories.map((cat) => (
        <Button
          key={cat.value}
          variant={activeCategory === cat.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange(cat.value)}
          className={cn(
            activeCategory === cat.value &&
              'bg-bronze hover:bg-bronze-deep text-white border-bronze'
          )}
        >
          {cat.label}
        </Button>
      ))}
    </div>
  );
}
