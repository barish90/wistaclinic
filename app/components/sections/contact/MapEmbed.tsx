'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { MapPin } from 'lucide-react';

interface MapEmbedProps {
  className?: string;
}

export function MapEmbed({ className }: MapEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={cn(
        'relative aspect-[16/10] rounded-xl overflow-hidden shadow-lg',
        className
      )}
    >
      {/* Loading skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-bronze-light/20 via-champagne/30 to-bronze/10 animate-pulse flex items-center justify-center" aria-busy="true">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <MapPin className="h-8 w-8" />
            <span className="text-sm">Loading map...</span>
          </div>
        </div>
      )}

      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.123456789!2d28.9784!3d41.0821!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDA0JzU1LjYiTiAyOMKwNTgnNDIuMiJF!5e0!3m2!1sen!2str!4v1700000000000!5m2!1sen!2str"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="WistaClinic Location - Kagithane, Istanbul"
        onLoad={() => setIsLoaded(true)}
        className={cn(
          'absolute inset-0 transition-opacity duration-500',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
      />

      {/* Fallback link overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
        <a
          href="https://maps.google.com/?q=Merkez,+Cendere+Cad.+No:9,+34406+Kagithane/Istanbul"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-white text-sm hover:underline"
        >
          <MapPin className="h-4 w-4" />
          <span>Open in Google Maps</span>
        </a>
      </div>
    </div>
  );
}
