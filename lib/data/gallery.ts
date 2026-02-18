export type GalleryCategory =
  | 'dental'
  | 'rhinoplasty'
  | 'hair-transplant'
  | 'body-contouring'
  | 'facial-aesthetics'
  | 'breast-augmentation';

export interface GalleryImage {
  id: string;
  category: GalleryCategory;
  title: string;
  description: string;
  beforeGradient: string;
  afterGradient: string;
}

/** Default English labels — render sites should prefer i18n dictionary lookups. */
export const galleryCategoryLabels: Record<GalleryCategory, string> = {
  dental: 'Dental',
  rhinoplasty: 'Rhinoplasty',
  'hair-transplant': 'Hair Transplant',
  'body-contouring': 'Body Contouring',
  'facial-aesthetics': 'Facial Aesthetics',
  'breast-augmentation': 'Breast Augmentation',
};

export const galleryCategories: { value: GalleryCategory; label: string }[] =
  (Object.entries(galleryCategoryLabels) as [GalleryCategory, string][]).map(
    ([value, label]) => ({ value, label })
  );

export const galleryItems: GalleryImage[] = [
  // Rhinoplasty (4 items)
  {
    id: 'rhino-1',
    category: 'rhinoplasty',
    title: 'Dorsal Hump Removal',
    description: 'Refined nasal profile with smooth dorsal line correction.',
    beforeGradient: 'linear-gradient(135deg, #D4A88C 0%, #C49070 50%, #E0BCA4 100%)',
    afterGradient: 'linear-gradient(135deg, #F2D5C4 0%, #FADCCC 50%, #F8E4D8 100%)',
  },
  {
    id: 'rhino-2',
    category: 'rhinoplasty',
    title: 'Tip Refinement',
    description: 'Nasal tip reshaping for improved definition and facial balance.',
    beforeGradient: 'linear-gradient(135deg, #CFA88E 0%, #B8916E 50%, #DCBCA4 100%)',
    afterGradient: 'linear-gradient(135deg, #F5DED0 0%, #FBE8DC 50%, #F0D4C2 100%)',
  },
  {
    id: 'rhino-3',
    category: 'rhinoplasty',
    title: 'Revision Rhinoplasty',
    description: 'Corrective surgery restoring nasal harmony and breathing function.',
    beforeGradient: 'linear-gradient(135deg, #C09878 0%, #A88060 50%, #D4AC90 100%)',
    afterGradient: 'linear-gradient(135deg, #F0D8C8 0%, #F8E2D4 50%, #ECDACA 100%)',
  },
  {
    id: 'rhino-4',
    category: 'rhinoplasty',
    title: 'Ethnic Rhinoplasty',
    description: 'Culturally sensitive nose reshaping preserving natural ethnic features.',
    beforeGradient: 'linear-gradient(135deg, #BFA08A 0%, #A88A70 50%, #D0B49C 100%)',
    afterGradient: 'linear-gradient(135deg, #F4DDD0 0%, #FCE6DA 50%, #EED6C8 100%)',
  },

  // Hair Transplant (4 items)
  {
    id: 'hair-1',
    category: 'hair-transplant',
    title: 'FUE Hair Transplant',
    description: 'Follicular unit extraction restoring natural hairline density.',
    beforeGradient: 'linear-gradient(135deg, #E8D5C0 0%, #D4BFA8 50%, #F0DFC8 100%)',
    afterGradient: 'linear-gradient(135deg, #8B6B4A 0%, #6B4F32 50%, #A0825E 100%)',
  },
  {
    id: 'hair-2',
    category: 'hair-transplant',
    title: 'DHI Hair Transplant',
    description: 'Direct implantation technique for maximum density and natural growth.',
    beforeGradient: 'linear-gradient(135deg, #E0CDB8 0%, #CCB89E 50%, #ECD8C2 100%)',
    afterGradient: 'linear-gradient(135deg, #7A5C3E 0%, #5E4428 50%, #947050 100%)',
  },
  {
    id: 'hair-3',
    category: 'hair-transplant',
    title: 'Hairline Restoration',
    description: 'Receded hairline restored to a youthful, natural-looking frame.',
    beforeGradient: 'linear-gradient(135deg, #E5D4C0 0%, #D0BCA6 50%, #F2E2CE 100%)',
    afterGradient: 'linear-gradient(135deg, #806040 0%, #644828 50%, #9A7A58 100%)',
  },
  {
    id: 'hair-4',
    category: 'hair-transplant',
    title: 'Crown Area Transplant',
    description: 'Full coverage restoration of thinning crown and vertex area.',
    beforeGradient: 'linear-gradient(135deg, #DCC8B0 0%, #C8B498 50%, #E8D6C0 100%)',
    afterGradient: 'linear-gradient(135deg, #886848 0%, #6C5030 50%, #A08060 100%)',
  },

  // Body Contouring (4 items)
  {
    id: 'body-1',
    category: 'body-contouring',
    title: 'Liposuction',
    description: 'Targeted fat removal sculpting a slimmer, more defined silhouette.',
    beforeGradient: 'linear-gradient(135deg, #D4C0B0 0%, #C0AA98 50%, #E0D0C0 100%)',
    afterGradient: 'linear-gradient(135deg, #F5E8DC 0%, #FCEEE2 50%, #F0E0D4 100%)',
  },
  {
    id: 'body-2',
    category: 'body-contouring',
    title: 'Tummy Tuck',
    description: 'Abdominoplasty creating a flat, toned abdominal profile.',
    beforeGradient: 'linear-gradient(135deg, #CCB8A4 0%, #B8A28C 50%, #D8C8B4 100%)',
    afterGradient: 'linear-gradient(135deg, #F8ECDF 0%, #FFF2E8 50%, #F2E4D8 100%)',
  },
  {
    id: 'body-3',
    category: 'body-contouring',
    title: 'Brazilian Butt Lift',
    description: 'Fat transfer procedure enhancing buttock volume and shape naturally.',
    beforeGradient: 'linear-gradient(135deg, #D0BAA6 0%, #BCA48E 50%, #DCC8B4 100%)',
    afterGradient: 'linear-gradient(135deg, #F6EADC 0%, #FDF0E4 50%, #F0E2D4 100%)',
  },
  {
    id: 'body-4',
    category: 'body-contouring',
    title: 'Arm Lift',
    description: 'Brachioplasty removing excess skin for toned, contoured arms.',
    beforeGradient: 'linear-gradient(135deg, #C8B4A0 0%, #B49E88 50%, #D4C0AC 100%)',
    afterGradient: 'linear-gradient(135deg, #F4E6D8 0%, #FAEEDF 50%, #EEE0D2 100%)',
  },

  // Facial Aesthetics (4 items)
  {
    id: 'face-1',
    category: 'facial-aesthetics',
    title: 'Facelift',
    description: 'Comprehensive facial rejuvenation restoring youthful contours.',
    beforeGradient: 'linear-gradient(135deg, #C8A890 0%, #B49278 50%, #D4B8A0 100%)',
    afterGradient: 'linear-gradient(135deg, #F5DFD0 0%, #FCE8DC 50%, #F0D8C8 100%)',
  },
  {
    id: 'face-2',
    category: 'facial-aesthetics',
    title: 'Eyelid Surgery',
    description: 'Blepharoplasty refreshing tired-looking eyes for a brighter appearance.',
    beforeGradient: 'linear-gradient(135deg, #C4A490 0%, #B08E76 50%, #D0B49E 100%)',
    afterGradient: 'linear-gradient(135deg, #F2DCD0 0%, #FAE4D8 50%, #ECD4C6 100%)',
  },
  {
    id: 'face-3',
    category: 'facial-aesthetics',
    title: 'Lip Enhancement',
    description: 'Natural-looking lip augmentation for fuller, balanced lips.',
    beforeGradient: 'linear-gradient(135deg, #D4A8A0 0%, #C09088 50%, #E0BCB4 100%)',
    afterGradient: 'linear-gradient(135deg, #F5CCC4 0%, #FCD8D0 50%, #F0C4BC 100%)',
  },
  {
    id: 'face-4',
    category: 'facial-aesthetics',
    title: 'Chin Augmentation',
    description: 'Chin reshaping to improve profile balance and jawline definition.',
    beforeGradient: 'linear-gradient(135deg, #C0A490 0%, #AC8E78 50%, #CCB4A0 100%)',
    afterGradient: 'linear-gradient(135deg, #F0D8CA 0%, #F8E0D4 50%, #EAD2C4 100%)',
  },

  // Breast Augmentation (4 items)
  {
    id: 'breast-1',
    category: 'breast-augmentation',
    title: 'Breast Augmentation',
    description: 'Enhanced volume and shape with premium silicone or saline implants.',
    beforeGradient: 'linear-gradient(135deg, #D4BCA8 0%, #C0A892 50%, #E0CCB8 100%)',
    afterGradient: 'linear-gradient(135deg, #F5E4D8 0%, #FCECE0 50%, #F0DED2 100%)',
  },
  {
    id: 'breast-2',
    category: 'breast-augmentation',
    title: 'Breast Lift',
    description: 'Mastopexy restoring youthful breast position and firmness.',
    beforeGradient: 'linear-gradient(135deg, #D0B8A4 0%, #BCA48E 50%, #DCC8B4 100%)',
    afterGradient: 'linear-gradient(135deg, #F4E0D4 0%, #FAE8DC 50%, #EED8CC 100%)',
  },
  {
    id: 'breast-3',
    category: 'breast-augmentation',
    title: 'Breast Reduction',
    description: 'Proportional reduction for improved comfort and aesthetic balance.',
    beforeGradient: 'linear-gradient(135deg, #CCB4A0 0%, #B8A08A 50%, #D8C4B0 100%)',
    afterGradient: 'linear-gradient(135deg, #F2DCD0 0%, #F8E4D8 50%, #ECD6CA 100%)',
  },
  {
    id: 'breast-4',
    category: 'breast-augmentation',
    title: 'Breast Reconstruction',
    description: 'Restorative surgery rebuilding natural breast form after mastectomy.',
    beforeGradient: 'linear-gradient(135deg, #C8B09C 0%, #B49C86 50%, #D4C0AC 100%)',
    afterGradient: 'linear-gradient(135deg, #F0D8CC 0%, #F6E0D4 50%, #EAD4C6 100%)',
  },

  // Dental (4 items)
  {
    id: 'dental-1',
    category: 'dental',
    title: 'Smile Makeover',
    description: 'Complete smile transformation with porcelain veneers and teeth whitening.',
    beforeGradient: 'linear-gradient(135deg, #8B7355 0%, #A0926B 50%, #6B5B3E 100%)',
    afterGradient: 'linear-gradient(135deg, #F5F5F0 0%, #FFFDF7 50%, #E8E4D8 100%)',
  },
  {
    id: 'dental-2',
    category: 'dental',
    title: 'Dental Implants',
    description: 'Full-arch dental implant restoration for a natural, lasting smile.',
    beforeGradient: 'linear-gradient(135deg, #9E8E72 0%, #7A6B55 50%, #B5A48A 100%)',
    afterGradient: 'linear-gradient(135deg, #FAF8F5 0%, #F0EDE6 50%, #FFFFFF 100%)',
  },
  {
    id: 'dental-3',
    category: 'dental',
    title: 'Teeth Whitening',
    description: 'Professional laser whitening for a brighter, more confident smile.',
    beforeGradient: 'linear-gradient(135deg, #C4B393 0%, #A89778 50%, #D6C9AD 100%)',
    afterGradient: 'linear-gradient(135deg, #FFFFFF 0%, #F8F6F0 50%, #FEFEFE 100%)',
  },
  {
    id: 'dental-4',
    category: 'dental',
    title: 'Porcelain Veneers',
    description: 'Custom-crafted veneers designed to perfect your smile aesthetics.',
    beforeGradient: 'linear-gradient(135deg, #B0A08A 0%, #8C7D68 50%, #C5B8A2 100%)',
    afterGradient: 'linear-gradient(135deg, #FDFCFA 0%, #F5F2EC 50%, #FFFEF9 100%)',
  },
];
