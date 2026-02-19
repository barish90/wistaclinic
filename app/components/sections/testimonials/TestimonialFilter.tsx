'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export type SortOption = 'newest' | 'highest';

interface ProcedureOption {
  slug: string;
  title: string;
}

interface TestimonialFilterProps {
  procedures: ProcedureOption[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  allLabel?: string;
  newestLabel?: string;
  highestLabel?: string;
}

export function TestimonialFilter({
  procedures,
  activeFilter,
  onFilterChange,
  sortBy,
  onSortChange,
  allLabel = 'All',
  newestLabel = 'Newest First',
  highestLabel = 'Highest Rated',
}: TestimonialFilterProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange('all')}
          className={cn(
            'transition-all',
            activeFilter === 'all' &&
              'bg-[#B8860B] text-white hover:bg-[#8B6508]'
          )}
        >
          {allLabel}
        </Button>
        {procedures.map((proc) => (
          <Button
            key={proc.slug}
            variant={activeFilter === proc.slug ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterChange(proc.slug)}
            className={cn(
              'transition-all',
              activeFilter === proc.slug &&
                'bg-[#B8860B] text-white hover:bg-[#8B6508]'
            )}
          >
            {proc.title}
          </Button>
        ))}
      </div>

      {/* Sort dropdown */}
      <Select value={sortBy} onValueChange={(val) => onSortChange(val as SortOption)}>
        <SelectTrigger className="w-[180px] shrink-0">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">{newestLabel}</SelectItem>
          <SelectItem value="highest">{highestLabel}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
