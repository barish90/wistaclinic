export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  bio: string;
  image: string;
}

export const doctors: Doctor[] = [
  {
    id: 'dr-aydin-kaya',
    name: 'Dr. Aydın Kaya',
    title: 'MD, FACS',
    specialty: 'Plastic & Reconstructive Surgery',
    bio: 'Dr. Kaya is a board-certified plastic surgeon with over 15 years of experience in aesthetic and reconstructive procedures. Trained at Istanbul University Faculty of Medicine and having completed fellowships in Paris and New York, he specializes in facial rejuvenation, rhinoplasty, and body contouring. His patient-centered approach combines surgical excellence with artistic vision, delivering natural-looking results that enhance individual beauty.',
    image: '/images/doctors/dr-aydin-kaya.jpg'
  },
  {
    id: 'dr-zeynep-arslan',
    name: 'Dr. Zeynep Arslan',
    title: 'MD, EBOPRAS',
    specialty: 'Facial Aesthetics & Anti-Aging Medicine',
    bio: 'Dr. Arslan is a renowned specialist in non-surgical facial rejuvenation and minimally invasive aesthetic treatments. With expertise in advanced injection techniques, thread lifts, and laser therapies, she creates subtle, natural enhancements that restore youthful vitality. A member of the European Board of Plastic, Reconstructive and Aesthetic Surgery, Dr. Arslan is dedicated to helping patients achieve timeless beauty through innovative, evidence-based treatments.',
    image: '/images/doctors/dr-zeynep-arslan.jpg'
  },
  {
    id: 'dr-mehmet-yilmaz',
    name: 'Dr. Mehmet Yılmaz',
    title: 'MD, ISHRS',
    specialty: 'Hair Restoration Surgery',
    bio: 'Dr. Yılmaz is a leading expert in modern hair transplantation techniques, including FUE and DHI methods. A member of the International Society of Hair Restoration Surgery, he has performed over 3,000 successful procedures, helping patients restore natural-looking hairlines and density. His meticulous attention to detail and understanding of hair growth patterns ensure exceptional, undetectable results that dramatically improve confidence and appearance.',
    image: '/images/doctors/dr-mehmet-yilmaz.jpg'
  },
  {
    id: 'dr-elif-demir',
    name: 'Dr. Elif Demir',
    title: 'MD, ASPS',
    specialty: 'Body Contouring & Aesthetic Surgery',
    bio: 'Dr. Demir specializes in advanced body sculpting procedures including Brazilian Butt Lift, liposuction, and post-bariatric body contouring. With a keen artistic eye and extensive surgical training, she helps patients achieve their ideal physique through personalized treatment plans. Her commitment to safety, combined with cutting-edge techniques, has earned her recognition as one of Istanbul\'s premier body contouring specialists.',
    image: '/images/doctors/dr-elif-demir.jpg'
  }
];
