export interface Procedure {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  image: string;
  icon: string;
  steps: Array<{
    title: string;
    description: string;
  }>;
  faq: Array<{
    question: string;
    answer: string;
  }>;
}

export const procedures: Procedure[] = [
  {
    slug: 'rhinoplasty',
    title: 'Rhinoplasty',
    shortDescription: 'Refine and reshape your nose for improved facial harmony and breathing function.',
    description: 'Rhinoplasty, commonly known as nose reshaping surgery, is designed to enhance the aesthetic appearance of your nose while maintaining or improving its function. Our skilled surgeons use advanced techniques to address concerns such as a dorsal hump, bulbous tip, asymmetry, or breathing difficulties. The procedure is tailored to your unique facial structure, ensuring natural-looking results that complement your features.',
    image: '/images/procedures/rhinoplasty.jpg',
    icon: 'nose',
    steps: [
      {
        title: 'Initial Consultation',
        description: 'During your consultation, our surgeon will evaluate your nasal structure, discuss your aesthetic goals, and create a personalized surgical plan. We use advanced imaging technology to help you visualize potential outcomes.'
      },
      {
        title: 'Surgical Procedure',
        description: 'The procedure typically takes 2-3 hours under general anesthesia. Our surgeons use either an open or closed technique depending on your needs, carefully reshaping bone and cartilage to achieve your desired result.'
      },
      {
        title: 'Recovery Period',
        description: 'Initial swelling subsides within 2-3 weeks, though final results become apparent after 12 months. You can return to work within 7-10 days, with a protective splint worn for the first week.'
      },
      {
        title: 'Long-Term Results',
        description: 'The results of rhinoplasty are permanent, with your new nasal shape continuing to refine over the first year. Most patients experience significant improvement in both appearance and confidence.'
      }
    ],
    faq: [
      {
        question: 'How long does rhinoplasty recovery take?',
        answer: 'Most patients return to work within 7-10 days. While major swelling subsides in 2-3 weeks, complete healing and final results take approximately 12 months as subtle refinements continue.'
      },
      {
        question: 'Will rhinoplasty improve my breathing?',
        answer: 'Yes, functional rhinoplasty can correct structural issues like a deviated septum or collapsed nasal valves, significantly improving airflow. Many patients combine aesthetic and functional improvements in a single procedure.'
      },
      {
        question: 'Is rhinoplasty painful?',
        answer: 'Patients typically experience minimal pain, which is well-controlled with prescribed medication. Most describe the recovery as more uncomfortable than painful, with congestion and swelling being the primary concerns.'
      },
      {
        question: 'How long do rhinoplasty results last?',
        answer: 'Rhinoplasty results are permanent. While your nose will continue to age naturally along with your face, the structural changes made during surgery remain stable throughout your lifetime.'
      }
    ]
  },
  {
    slug: 'breast-augmentation',
    title: 'Breast Augmentation',
    shortDescription: 'Enhance breast volume and shape with natural-looking implants tailored to your body.',
    description: 'Breast augmentation is one of the most popular cosmetic procedures, designed to enhance breast size, restore volume lost after pregnancy or weight loss, and improve symmetry. We offer a range of implant options including silicone and saline, with various shapes and profiles to achieve your desired look. Our surgeons work closely with you to select the optimal implant size and placement technique for natural, proportionate results.',
    image: '/images/procedures/breast-augmentation.jpg',
    icon: 'heart',
    steps: [
      {
        title: 'Personalized Consultation',
        description: 'We assess your anatomy, discuss your size preferences, and help you choose between implant types, sizes, and placement options. You can try on different implant sizers to preview your potential results.'
      },
      {
        title: 'Surgical Procedure',
        description: 'The surgery takes approximately 1-2 hours under general anesthesia. Implants are placed through discreet incisions, either under the breast tissue or beneath the chest muscle, depending on your anatomy and goals.'
      },
      {
        title: 'Recovery Process',
        description: 'Most patients return to light activities within a week and resume full exercise after 4-6 weeks. You will wear a supportive surgical bra during the initial healing phase to optimize results.'
      },
      {
        title: 'Final Results',
        description: 'Your breasts will settle into their final position within 3-6 months. The results are long-lasting, though implants may need replacement after 10-15 years depending on the type selected.'
      }
    ],
    faq: [
      {
        question: 'What is the difference between silicone and saline implants?',
        answer: 'Silicone implants are filled with a cohesive gel that closely mimics natural breast tissue, while saline implants are filled with sterile saltwater. Silicone typically feels more natural, while saline implants can be adjusted during surgery and require smaller incisions.'
      },
      {
        question: 'Can I breastfeed after breast augmentation?',
        answer: 'Most women can successfully breastfeed after augmentation, especially when implants are placed beneath the chest muscle and incisions avoid the nipple area. We discuss this concern during consultation to optimize your surgical approach.'
      },
      {
        question: 'How do I choose the right implant size?',
        answer: 'Size selection depends on your body frame, chest width, existing breast tissue, and aesthetic goals. We use sizing systems and 3D imaging to help you visualize options and select the size that best complements your proportions.'
      },
      {
        question: 'Will breast implants affect mammograms?',
        answer: 'Implants do not prevent mammograms, but specialized techniques are used to ensure accurate imaging. It is important to inform the radiology technician about your implants before the screening.'
      }
    ]
  },
  {
    slug: 'brazilian-butt-lift',
    title: 'Brazilian Butt Lift (BBL)',
    shortDescription: 'Sculpt and enhance your buttocks using your own purified fat for natural, lasting curves.',
    description: 'The Brazilian Butt Lift is an advanced body contouring procedure that uses your own fat to enhance buttock shape and volume. Fat is harvested from areas with excess, such as the abdomen, flanks, or thighs, then purified and strategically injected to create a lifted, rounded appearance. This dual-benefit procedure simultaneously slims donor areas while enhancing your curves, all without the use of implants.',
    image: '/images/procedures/brazilian-butt-lift.jpg',
    icon: 'sparkles',
    steps: [
      {
        title: 'Comprehensive Assessment',
        description: 'Our surgeon evaluates your body proportions, fat availability, and aesthetic goals. We create a customized plan identifying optimal donor sites and discussing the projected enhancement you can achieve.'
      },
      {
        title: 'Fat Transfer Procedure',
        description: 'The 3-4 hour procedure involves gentle liposuction to harvest fat, purification to isolate healthy fat cells, and precise injection into multiple buttock layers to create natural shape and projection.'
      },
      {
        title: 'Specialized Recovery',
        description: 'You must avoid sitting directly on your buttocks for 2-3 weeks to protect the transferred fat. Most patients return to work within 2 weeks and resume full activities after 6-8 weeks.'
      },
      {
        title: 'Lasting Enhancement',
        description: 'Approximately 60-80% of transferred fat establishes permanent blood supply and survives long-term. Final results appear after 3-6 months once swelling resolves and fat stabilizes.'
      }
    ],
    faq: [
      {
        question: 'How long do BBL results last?',
        answer: 'Once the transferred fat establishes blood supply (typically after 3 months), results are permanent. The surviving fat cells behave like natural tissue and will fluctuate with weight changes, but the overall enhancement remains.'
      },
      {
        question: 'Is BBL safe?',
        answer: 'When performed by a board-certified plastic surgeon using proper techniques, BBL is safe. We follow strict safety protocols including subcutaneous fat placement and limiting injection volumes to minimize risks.'
      },
      {
        question: 'Do I need to be a certain weight for BBL?',
        answer: 'Ideal candidates have sufficient fat deposits for harvesting, typically with a BMI between 24-30. Very thin patients may not have adequate donor fat, while significantly overweight patients are encouraged to reach a stable weight first.'
      },
      {
        question: 'Can I sit after BBL surgery?',
        answer: 'You must avoid direct sitting for 2-3 weeks to protect the newly transferred fat. After this period, you can gradually resume sitting with a specialized pillow that shifts pressure to your thighs rather than buttocks.'
      }
    ]
  },
  {
    slug: 'liposuction',
    title: 'Liposuction',
    shortDescription: 'Remove stubborn fat deposits and reveal a more contoured, sculpted physique.',
    description: 'Liposuction is a proven body contouring technique that removes localized fat deposits resistant to diet and exercise. Using advanced techniques such as tumescent, ultrasound-assisted, or laser-assisted liposuction, we can precisely sculpt areas including the abdomen, flanks, thighs, arms, and neck. The procedure creates smoother body contours and enhanced definition, helping you achieve the silhouette you desire.',
    image: '/images/procedures/liposuction.jpg',
    icon: 'target',
    steps: [
      {
        title: 'Detailed Consultation',
        description: 'We identify your problem areas, assess skin quality, and determine which liposuction technique will deliver optimal results. Realistic expectations are discussed based on your body type and goals.'
      },
      {
        title: 'Contouring Procedure',
        description: 'The 1-3 hour procedure uses small cannulas inserted through tiny incisions to break up and suction out fat cells. We sculpt each area with artistic precision to create smooth, natural-looking contours.'
      },
      {
        title: 'Recovery Timeline',
        description: 'Compression garments are worn for 4-6 weeks to reduce swelling and support healing. Most patients return to work within 3-7 days and resume exercise after 3-4 weeks.'
      },
      {
        title: 'Refined Silhouette',
        description: 'Initial results are visible immediately, with final contouring apparent after 3-6 months once all swelling subsides. Maintaining a stable weight preserves your enhanced body shape indefinitely.'
      }
    ],
    faq: [
      {
        question: 'Is liposuction a weight loss procedure?',
        answer: 'No, liposuction is a body contouring procedure designed to remove localized fat deposits and improve shape. While some weight is lost, it is not a substitute for healthy lifestyle habits or significant weight loss.'
      },
      {
        question: 'Will the fat come back after liposuction?',
        answer: 'The removed fat cells are permanently gone. However, remaining fat cells can enlarge with weight gain, so maintaining a stable weight through diet and exercise is essential to preserve your results.'
      },
      {
        question: 'What areas can be treated with liposuction?',
        answer: 'Common treatment areas include the abdomen, flanks (love handles), thighs, buttocks, upper arms, back, chest, chin, and neck. Multiple areas can often be treated in a single session.'
      },
      {
        question: 'Will I have loose skin after liposuction?',
        answer: 'If you have good skin elasticity, your skin will typically retract smoothly over your new contours. Patients with poor elasticity or significant fat removal may require additional skin tightening procedures for optimal results.'
      }
    ]
  },
  {
    slug: 'hair-transplant',
    title: 'Hair Transplant',
    shortDescription: 'Restore natural hair growth and confidence with advanced follicular transplant techniques.',
    description: 'Hair transplantation uses microsurgical techniques to relocate healthy hair follicles from donor areas to thinning or balding regions. We specialize in FUE (Follicular Unit Extraction) and DHI (Direct Hair Implantation) methods, which offer natural-looking results with minimal scarring. Whether addressing male pattern baldness, receding hairlines, or thinning areas, our procedures deliver permanent, natural hair restoration.',
    image: '/images/procedures/hair-transplant.jpg',
    icon: 'user',
    steps: [
      {
        title: 'Hair Analysis & Planning',
        description: 'We assess your hair loss pattern, donor area density, and scalp condition. A detailed plan is created specifying the number of grafts needed and designing your new hairline for natural appearance.'
      },
      {
        title: 'Graft Extraction & Implantation',
        description: 'Individual follicular units are extracted from the donor area using specialized micro-punches, then meticulously implanted into recipient sites at precise angles and densities to mimic natural growth patterns.'
      },
      {
        title: 'Initial Recovery',
        description: 'The scalp heals within 7-10 days with minimal discomfort. Transplanted hairs initially shed after 2-3 weeks, which is a normal part of the process before new growth begins.'
      },
      {
        title: 'Hair Regrowth',
        description: 'New hair growth typically begins at 3-4 months, with significant improvement visible at 6-9 months. Final density and results are achieved by 12-18 months, providing permanent, natural-looking hair.'
      }
    ],
    faq: [
      {
        question: 'Is hair transplant permanent?',
        answer: 'Yes, transplanted hair follicles are genetically resistant to balding hormones and will continue growing for your lifetime. The results are permanent, though you may experience natural age-related thinning in non-transplanted areas.'
      },
      {
        question: 'What is the difference between FUE and DHI?',
        answer: 'FUE extracts individual follicles which are then implanted using pre-made channels, while DHI uses a specialized pen tool that creates the channel and implants the graft simultaneously. DHI offers more precision and less handling time.'
      },
      {
        question: 'How many grafts will I need?',
        answer: 'Graft requirements vary based on the extent of hair loss and desired density. Mild cases may need 1,000-2,000 grafts, while advanced balding can require 3,000-5,000+ grafts. We provide specific recommendations during consultation.'
      },
      {
        question: 'Is the procedure painful?',
        answer: 'Local anesthesia ensures the procedure is virtually painless. Most patients report minimal discomfort during recovery, easily managed with over-the-counter pain medication for the first few days.'
      }
    ]
  },
  {
    slug: 'facial-aesthetics',
    title: 'Facial Aesthetics',
    shortDescription: 'Rejuvenate your appearance with surgical and non-surgical facial enhancement options.',
    description: 'Our comprehensive facial aesthetics services encompass both surgical procedures like facelifts and blepharoplasty, as well as non-surgical treatments including dermal fillers, Botox, and thread lifts. Whether you seek to address signs of aging, enhance facial features, or refresh your overall appearance, we offer personalized treatment plans combining multiple modalities for optimal, natural-looking rejuvenation.',
    image: '/images/procedures/facial-aesthetics.jpg',
    icon: 'smile',
    steps: [
      {
        title: 'Facial Analysis',
        description: 'Our specialists conduct a thorough facial assessment, identifying areas of concern such as wrinkles, volume loss, or skin laxity. We create a customized treatment plan that may combine surgical and non-surgical approaches.'
      },
      {
        title: 'Treatment Application',
        description: 'Depending on your plan, this may involve injectable treatments completed in 15-30 minutes, or surgical procedures lasting 2-4 hours. All treatments are performed with precision to ensure natural, harmonious results.'
      },
      {
        title: 'Recovery & Healing',
        description: 'Non-surgical treatments require minimal downtime (1-2 days), while surgical procedures need 1-3 weeks for initial healing. Swelling and bruising gradually resolve, revealing your refreshed appearance.'
      },
      {
        title: 'Sustained Rejuvenation',
        description: 'Injectable results last 6-18 months depending on the product, while surgical improvements can last 5-10+ years. Maintenance treatments help preserve and enhance your rejuvenated look over time.'
      }
    ],
    faq: [
      {
        question: 'What is the difference between Botox and fillers?',
        answer: 'Botox relaxes muscles that cause dynamic wrinkles (like frown lines), while dermal fillers restore lost volume and fill static wrinkles. They often work synergistically to address different aging concerns simultaneously.'
      },
      {
        question: 'When should I consider a facelift versus fillers?',
        answer: 'Fillers are excellent for mild to moderate volume loss and fine lines, while facelifts address significant skin laxity, jowls, and deep folds. Many patients in their 40s-50s benefit from combining both approaches for comprehensive rejuvenation.'
      },
      {
        question: 'How long do facial filler results last?',
        answer: 'Duration varies by product type and placement area. Hyaluronic acid fillers typically last 6-18 months, while longer-lasting options like Sculptra can provide results for 2+ years. Your specialist will recommend appropriate products based on your goals.'
      },
      {
        question: 'Will facial procedures look natural?',
        answer: 'Modern techniques emphasize subtle enhancement and natural beauty. Our philosophy is to refresh and rejuvenate while maintaining your unique features, avoiding the overdone or artificial appearance associated with older methods.'
      }
    ]
  },
  {
    slug: 'body-contouring',
    title: 'Body Contouring',
    shortDescription: 'Achieve your ideal body shape with comprehensive surgical contouring solutions.',
    description: 'Body contouring encompasses a range of surgical procedures designed to reshape and refine your physique. This includes tummy tucks (abdominoplasty), arm lifts, thigh lifts, and lower body lifts that remove excess skin and tighten underlying tissues. These procedures are particularly beneficial after significant weight loss or pregnancy, helping you achieve the toned, proportionate body contours that diet and exercise alone cannot provide.',
    image: '/images/procedures/body-contouring.jpg',
    icon: 'activity',
    steps: [
      {
        title: 'Body Assessment',
        description: 'We evaluate areas of concern including skin laxity, stubborn fat deposits, and overall body proportions. A comprehensive plan is developed that may combine multiple procedures to achieve balanced, harmonious results.'
      },
      {
        title: 'Surgical Contouring',
        description: 'Procedures typically take 2-5 hours depending on the areas treated. Excess skin is removed, underlying muscles are tightened, and remaining skin is re-draped to create smooth, firm contours.'
      },
      {
        title: 'Recovery Program',
        description: 'Initial recovery takes 2-3 weeks with compression garments worn for 6-8 weeks. Most patients return to desk work within 2-3 weeks and gradually resume full activities over 6-8 weeks.'
      },
      {
        title: 'Transformed Physique',
        description: 'Swelling subsides over 3-6 months, revealing your final contours. With stable weight maintenance, results are long-lasting, providing a firmer, more toned appearance for years to come.'
      }
    ],
    faq: [
      {
        question: 'Am I a candidate for body contouring?',
        answer: 'Ideal candidates have reached a stable weight, have realistic expectations, and are bothered by excess skin or stubborn fat deposits. Post-weight loss patients and post-pregnancy women are common candidates for these transformative procedures.'
      },
      {
        question: 'Can multiple areas be treated at once?',
        answer: 'Yes, combining procedures is common and can be more efficient than staging surgeries. Common combinations include tummy tuck with liposuction, or lower body lift with thigh lift. We assess your health and goals to determine the safest approach.'
      },
      {
        question: 'How visible will my scars be?',
        answer: 'While scars are inevitable with body contouring, they are strategically placed along natural creases or areas easily concealed by clothing. Scars fade significantly over 12-18 months and most patients find the dramatic improvement in contours well worth the tradeoff.'
      },
      {
        question: 'What is the difference between a tummy tuck and liposuction?',
        answer: 'Liposuction removes fat but does not address excess skin or separated abdominal muscles. A tummy tuck removes skin, tightens muscles, and can be combined with liposuction for comprehensive abdominal rejuvenation.'
      }
    ]
  }
];

export function getProcedureBySlug(slug: string): Procedure | undefined {
  return procedures.find(procedure => procedure.slug === slug);
}
