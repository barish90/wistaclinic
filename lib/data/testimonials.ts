export type Rating = 1 | 2 | 3 | 4 | 5;

export interface Testimonial {
  id: string;
  name: string;
  country: string;
  age: number;
  procedure: string;
  rating: Rating;
  quote: string;
  date: string;
}

export const countryFlags: Record<string, string> = {
  'United Kingdom': '\u{1F1EC}\u{1F1E7}',
  'Germany': '\u{1F1E9}\u{1F1EA}',
  'France': '\u{1F1EB}\u{1F1F7}',
  'Netherlands': '\u{1F1F3}\u{1F1F1}',
  'UAE': '\u{1F1E6}\u{1F1EA}',
  'USA': '\u{1F1FA}\u{1F1F8}',
  'Canada': '\u{1F1E8}\u{1F1E6}',
  'Italy': '\u{1F1EE}\u{1F1F9}',
  'Sweden': '\u{1F1F8}\u{1F1EA}',
  'Australia': '\u{1F1E6}\u{1F1FA}',
  'Ireland': '\u{1F1EE}\u{1F1EA}',
  'Belgium': '\u{1F1E7}\u{1F1EA}',
  'Switzerland': '\u{1F1E8}\u{1F1ED}',
  'Saudi Arabia': '\u{1F1F8}\u{1F1E6}',
  'Kuwait': '\u{1F1F0}\u{1F1FC}',
};

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'James W.',
    country: 'United Kingdom',
    age: 34,
    procedure: 'hair-transplant',
    rating: 5,
    quote: 'I flew to Istanbul expecting good results, but what I received was beyond anything I imagined. The team was meticulous during my FUE procedure. Twelve months later, my hairline looks completely natural and I feel ten years younger.',
    date: '2025-11-15',
  },
  {
    id: '2',
    name: 'Sophie M.',
    country: 'France',
    age: 29,
    procedure: 'rhinoplasty',
    rating: 5,
    quote: 'From the initial video consultation to the post-op care, every step was handled with professionalism. My nose looks beautifully natural and I can breathe so much better. The clinic arranged everything including airport transfers and hotel.',
    date: '2025-10-22',
  },
  {
    id: '3',
    name: 'Thomas K.',
    country: 'Germany',
    age: 41,
    procedure: 'hair-transplant',
    rating: 5,
    quote: 'After researching clinics across Europe, WistaClinic stood out for their transparent pricing and stellar reviews. My 4,500-graft procedure went smoothly and the results speak for themselves. Worth every penny.',
    date: '2025-09-18',
  },
  {
    id: '4',
    name: 'Emma L.',
    country: 'Netherlands',
    age: 38,
    procedure: 'breast-augmentation',
    rating: 5,
    quote: 'The surgeon took the time to understand exactly what I wanted and recommended the perfect implant size for my frame. Recovery was easier than expected and the results are incredibly natural-looking.',
    date: '2025-12-05',
  },
  {
    id: '5',
    name: 'Ahmed R.',
    country: 'UAE',
    age: 45,
    procedure: 'hair-transplant',
    rating: 4,
    quote: 'Very professional team and state-of-the-art facilities. The only reason I give four stars instead of five is the slightly longer waiting time on the day of the procedure, but the results have been excellent.',
    date: '2025-08-30',
  },
  {
    id: '6',
    name: 'Maria G.',
    country: 'Italy',
    age: 52,
    procedure: 'facial-aesthetics',
    rating: 5,
    quote: 'I came for a full facial rejuvenation package and left looking refreshed, not overdone. The combination of fillers and a mini-lift took years off my face. Friends keep asking what my secret is.',
    date: '2025-11-02',
  },
  {
    id: '7',
    name: 'Michael B.',
    country: 'USA',
    age: 36,
    procedure: 'rhinoplasty',
    rating: 5,
    quote: 'Even with the long flight from New York, choosing WistaClinic was the best decision. The cost savings compared to the US were significant, and the quality of care was on par with any top surgeon stateside.',
    date: '2025-07-14',
  },
  {
    id: '8',
    name: 'Sarah C.',
    country: 'Canada',
    age: 33,
    procedure: 'brazilian-butt-lift',
    rating: 4,
    quote: 'The recovery was tougher than I expected, but the team prepared me well and were always available on WhatsApp when I had questions. Three months post-op and I am thrilled with my new shape.',
    date: '2025-10-08',
  },
  {
    id: '9',
    name: 'Lars H.',
    country: 'Sweden',
    age: 28,
    procedure: 'hair-transplant',
    rating: 5,
    quote: 'I was nervous about having surgery abroad, but the clinic put all my worries to rest. The facility was spotless, the medical team was experienced, and the VIP transfer service made the whole trip seamless.',
    date: '2025-12-20',
  },
  {
    id: '10',
    name: 'Fatima A.',
    country: 'Saudi Arabia',
    age: 42,
    procedure: 'body-contouring',
    rating: 5,
    quote: 'After losing 30 kilograms, I had significant excess skin. The body contouring surgery gave me the figure I had been working toward. The surgeon was incredibly skilled and the results are life-changing.',
    date: '2025-09-25',
  },
  {
    id: '11',
    name: 'Daniel P.',
    country: 'Ireland',
    age: 31,
    procedure: 'rhinoplasty',
    rating: 4,
    quote: 'Great experience overall. The consultation process was thorough and the 3D imaging helped me visualize the outcome. My nose suits my face perfectly now. Small hiccup with post-op medication scheduling, but nothing major.',
    date: '2025-06-19',
  },
  {
    id: '12',
    name: 'Anna V.',
    country: 'Belgium',
    age: 47,
    procedure: 'facial-aesthetics',
    rating: 5,
    quote: 'The non-surgical facelift with threads and fillers gave me incredible results without the downtime of surgery. I was back sightseeing in Istanbul the next day. The doctor was an absolute artist.',
    date: '2025-11-28',
  },
  {
    id: '13',
    name: 'Robert T.',
    country: 'United Kingdom',
    age: 39,
    procedure: 'liposuction',
    rating: 5,
    quote: 'Had VASER liposuction on my abdomen and flanks. The precision of the work was remarkable. Six months on, my midsection is completely transformed. The compression garment phase was the hardest part but so worth it.',
    date: '2025-08-11',
  },
  {
    id: '14',
    name: 'Lena S.',
    country: 'Germany',
    age: 35,
    procedure: 'breast-augmentation',
    rating: 4,
    quote: 'The surgeon was honest about what would look proportionate on my body rather than just agreeing with my initial request. I appreciate that honesty because the result looks absolutely perfect.',
    date: '2025-10-30',
  },
  {
    id: '15',
    name: 'Hassan M.',
    country: 'Kuwait',
    age: 50,
    procedure: 'hair-transplant',
    rating: 5,
    quote: 'This was my second hair transplant, and WistaClinic delivered far superior results to my first procedure elsewhere. The DHI technique they used gave me much better density. Highly recommend.',
    date: '2025-07-22',
  },
  {
    id: '16',
    name: 'Charlotte D.',
    country: 'Switzerland',
    age: 44,
    procedure: 'body-contouring',
    rating: 5,
    quote: 'Had a tummy tuck combined with liposuction. The coordination between pre-op planning, the surgery itself, and follow-up care was flawless. Six months later, I feel confident wearing clothes I never thought I could.',
    date: '2025-09-03',
  },
  {
    id: '17',
    name: 'David N.',
    country: 'Australia',
    age: 37,
    procedure: 'brazilian-butt-lift',
    rating: 5,
    quote: 'Traveled all the way from Sydney and it was completely worth the trip. The fat transfer results are natural-looking and the contouring around my waist is an amazing bonus. First-class medical care.',
    date: '2025-11-10',
  },
  {
    id: '18',
    name: 'Julia F.',
    country: 'USA',
    age: 30,
    procedure: 'liposuction',
    rating: 4,
    quote: 'Compared prices in the US and Turkey, and WistaClinic offered the same quality at a fraction of the cost. The whole experience felt like a medical vacation. Results are smooth and natural.',
    date: '2025-12-01',
  },
];

export function getTestimonialsByProcedure(procedure: string): Testimonial[] {
  return testimonials.filter((t) => t.procedure === procedure);
}

export function getAverageRating(items: Testimonial[]): number {
  if (items.length === 0) return 0;
  const sum = items.reduce((acc, t) => acc + t.rating, 0);
  return Math.round((sum / items.length) * 10) / 10;
}
