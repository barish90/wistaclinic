'use client';

import { useEffect, useRef } from 'react';
import { Star } from 'lucide-react';
import { useGsap } from '@/app/hooks/useGsap';
import { testimonials, countryFlags } from '@/lib/data/testimonials';

interface TestimonialsCarouselProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}

export default function TestimonialsCarousel({ dict }: TestimonialsCarouselProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const { gsapReady } = useGsap();

  useEffect(() => {
    if (!gsapReady || !sectionRef.current) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const SplitText = window.SplitText;

    if (!gsap || !ScrollTrigger || !SplitText) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Title split text animation
      if (titleRef.current) {
        const split = new SplitText(titleRef.current, { type: 'words' });
        gsap.from(split.words, {
          opacity: 0,
          y: 20,
          stagger: 0.05,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            once: true,
          },
        });
      }

      // Rows fade in with stagger
      if (row1Ref.current && row2Ref.current) {
        gsap.from([row1Ref.current, row2Ref.current], {
          opacity: 0,
          y: 30,
          stagger: 0.2,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: row1Ref.current,
            start: 'top 85%',
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [gsapReady]);

  // Split testimonials into two balanced rows
  const midpoint = Math.ceil(testimonials.length / 2);
  const row1Testimonials = testimonials.slice(0, midpoint);
  const row2Testimonials = testimonials.slice(midpoint);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={star <= rating ? 'fill-[#B8860B] text-[#B8860B]' : 'fill-warm-gray-200 text-warm-gray-200'}
          />
        ))}
      </div>
    );
  };

  const renderTestimonialCard = (testimonial: typeof testimonials[0]) => (
    <div
      key={testimonial.id}
      className="w-[320px] flex-shrink-0 bg-white rounded-xl border border-warm-gray-100 shadow-sm p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02]"
    >
      {/* Procedure badge */}
      <div className="flex justify-end mb-3">
        <span className="bg-warm-gray-100 text-warm-gray-600 text-xs px-3 py-1 rounded-full">
          {testimonial.procedure}
        </span>
      </div>

      {/* Quote */}
      <blockquote className="font-serif italic text-sm text-warm-gray-700 mb-4 line-clamp-4">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      {/* Bottom section */}
      <div className="flex items-center justify-between pt-4 border-t border-warm-gray-100">
        <div>
          <div className="font-sans font-medium text-warm-gray-900 text-sm mb-1">
            {testimonial.name}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-warm-gray-500">
            <span>{countryFlags[testimonial.country] || '🌍'}</span>
            <span>{testimonial.country}</span>
          </div>
        </div>
        {renderStars(testimonial.rating)}
      </div>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className="py-24 lg:py-32 bg-[#FAFAF8] overflow-hidden"
    >
      <div className="container mx-auto px-4 mb-12 lg:mb-16">
        <h2
          ref={titleRef}
          className="font-serif text-3xl md:text-4xl lg:text-5xl text-center text-warm-gray-900 mb-4"
        >
          {dict.home.testimonialsSection.title}
        </h2>
        <p className="font-sans text-center text-warm-gray-600 text-lg max-w-2xl mx-auto">
          {dict.home.testimonialsSection.subtitle}
        </p>
      </div>

      {/* Row 1 - Scroll Left to Right */}
      <div
        ref={row1Ref}
        className="mb-6 overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        }}
      >
        <div
          className={`flex gap-6 ${
            'animate-scroll-left hover:animation-pause'
          }`}
        >
          {/* Duplicate cards for seamless loop */}
          {row1Testimonials.map(renderTestimonialCard)}
          {row1Testimonials.map((testimonial) =>
            renderTestimonialCard({ ...testimonial, id: `${testimonial.id}-dup` })
          )}
        </div>
      </div>

      {/* Row 2 - Scroll Right to Left */}
      <div
        ref={row2Ref}
        className="overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        }}
      >
        <div
          className={`flex gap-6 ${
            'animate-scroll-right hover:animation-pause'
          }`}
        >
          {/* Duplicate cards for seamless loop */}
          {row2Testimonials.map(renderTestimonialCard)}
          {row2Testimonials.map((testimonial) =>
            renderTestimonialCard({ ...testimonial, id: `${testimonial.id}-dup` })
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes scroll-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-scroll-left {
          animation: scroll-left 40s linear infinite;
        }

        .animate-scroll-right {
          animation: scroll-right 40s linear infinite;
        }

        .hover\:animation-pause:hover {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-scroll-left,
          .animate-scroll-right {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
