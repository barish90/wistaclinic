'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useGsap } from '@/app/hooks/useGsap';
import { doctors } from '@/lib/data/doctors';

interface DoctorProfilesProps {
  locale: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}

const doctorGradients: Record<string, string> = {
  'dr-aydin-kaya': 'linear-gradient(135deg, #D4A88C 0%, #C49070 50%, #E0BCA4 100%)',
  'dr-zeynep-arslan': 'linear-gradient(135deg, #C8A8B8 0%, #B898A8 50%, #D8B8C8 100%)',
  'dr-mehmet-yilmaz': 'linear-gradient(135deg, #B8A890 0%, #A89878 50%, #C8B8A0 100%)',
  'dr-elif-demir': 'linear-gradient(135deg, #A8B8C8 0%, #98A8B8 50%, #B8C8D8 100%)',
};

const extractCredentials = (bio: string, title: string, specialty: string): string[] => {
  // Use title and specialty as primary badges, plus extract one more from bio
  const credentials = [title, specialty];

  // Extract additional credential from bio (first sentence or notable qualification)
  const sentences = bio.split('.').filter(s => s.trim().length > 0);
  if (sentences.length > 0) {
    const firstSentence = sentences[0].trim();
    // Extract a short credential (max 30 chars)
    if (firstSentence.length <= 30) {
      credentials.push(firstSentence);
    } else {
      // Extract years of experience or similar pattern
      const yearsMatch = firstSentence.match(/(\d+\+?\s*years?)/i);
      if (yearsMatch) {
        credentials.push(yearsMatch[0]);
      }
    }
  }

  return credentials.slice(0, 3);
};

export default function DoctorProfiles({ locale, dict }: DoctorProfilesProps) {
  const { gsapReady } = useGsap();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gsapReady || typeof window === 'undefined') return;
    if (!window.gsap || !window.ScrollTrigger) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const gsap = window.gsap;
    const ctx = gsap.context(() => {
      // Title and subtitle fade up
      if (titleRef.current) {
        gsap.from(titleRef.current.children, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Card reveal animations
      if (cardsRef.current) {
        const cardsNode = cardsRef.current;
        const cards = cardsNode.querySelectorAll('.doctor-card');

        gsap.set(cards, {
          clipPath: 'inset(0 0 100% 0)',
        });

        gsap.to(cards, {
          clipPath: 'inset(0 0 0% 0)',
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: cardsNode,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
          onComplete: () => {
            // Snapshot cardsNode used instead of cardsRef.current to avoid stale ref after unmount
            const badges = cardsNode.querySelectorAll('.credential-badge');
            if (badges.length > 0) {
              gsap.from(badges, {
                opacity: 0,
                y: 10,
                duration: 0.4,
                stagger: 0.05,
                ease: 'power2.out',
              });
            }
          },
        });
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [gsapReady]);

  return (
    <section
      ref={sectionRef}
      className="py-24 lg:py-32 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {dict?.home?.doctors?.title ?? ''}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {dict?.home?.doctors?.subtitle ?? ''}
          </p>
        </div>

        {/* Doctor Cards Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {doctors.map((doctor) => {
            const credentials = extractCredentials(doctor.bio, doctor.title, doctor.specialty);
            const gradient = doctorGradients[doctor.id] || doctorGradients['dr-aydin-kaya'];

            return (
              <Link
                key={doctor.id}
                href={`/${locale}/doctors#${doctor.id}`}
                className="doctor-card group block"
              >
                <article className="h-full flex flex-col">
                  {/* Image/Gradient Area (3:4 aspect ratio) */}
                  <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg mb-4">
                    <div
                      className="absolute inset-0 transition-all duration-700 ease-out group-hover:scale-105"
                      style={{
                        background: gradient,
                        backgroundSize: '200% 200%',
                        backgroundPosition: 'center',
                      }}
                    />
                    {/* Optional: Add overlay gradient for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 flex flex-col">
                    {/* Name */}
                    <h3 className="font-serif text-2xl font-bold text-gray-900 mb-1">
                      {doctor.name}
                    </h3>

                    {/* Title */}
                    <p className="text-sm text-gray-500 mb-2">
                      {doctor.title}
                    </p>

                    {/* Specialty */}
                    <p className="text-xs uppercase tracking-wide text-[#D4AF37] font-semibold mb-3">
                      {doctor.specialty}
                    </p>

                    {/* Credential Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {credentials.map((credential, index) => (
                        <span
                          key={index}
                          className="credential-badge inline-block border border-gray-200 text-gray-500 px-2 py-0.5 text-xs rounded-full"
                        >
                          {credential}
                        </span>
                      ))}
                    </div>

                    {/* View Profile Link */}
                    <div className="mt-auto">
                      <span className="inline-flex items-center text-sm text-gray-900 font-medium group-hover:text-[#D4AF37] transition-colors">
                        {dict?.home?.doctors?.viewProfile ?? 'View Profile'}
                        <svg
                          className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
