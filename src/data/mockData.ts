import { Project, VideoDispatch, Executive, Testimonial } from '../types';

export const BRAND_ASSETS = {
  headerLogo: 'https://caihgroup.com/wp-content/uploads/2024/10/Caih-group.png',
  footerLogo: 'https://caihgroup.com/wp-content/uploads/2024/10/Caih-group.png',
  phone: '0906 688 7444',
  phoneClean: '+2349066887444',
  email: 'info@caihgroup.com',
  address: 'No. 5 Chief Ganiu Enitan Olugborangan Layout, Eleganza Bus Stop, Lagos, Nigeria'
};

export const PROJECTS: Project[] = [
  {
    id: 'appleton-court',
    title: 'Appleton Court',
    location: 'Emmanuel Akachukwu St, Aja, Lagos (Ajiwe, Abraham Adesanya, Ajah)',
    corridor: 'Ajah / Lekki Corridor',
    propertyType: 'plots',
    priceCategory: 'mid',
    status: 'completed',
    statusLabel: 'Sold Out',
    badge: 'APPLETON COURT',
    secondaryBadge: 'SOLD OUT • EMMANUEL AKACHUKWU ST',
    image: '/images/appleton_court_aerial_clean.jpg',
    galleryImages: [
      '/images/appleton_court_aerial_clean.jpg',
      '/images/appleton_court_exterior_real.jpg',
      '/images/appleton_court_interior_living.jpg',
      '/images/appleton_court_interior_stairs.jpg',
      '/images/IMG-20260919-WA0004 (1).jpg',
      '/images/IMG-20260919-WA0005 (1).jpg',
      '/images/IMG-20260919-WA0006.jpg'
    ],
    priceDisplay: 'From ₦22M',
    priceSub: '300sqm (₦22M) • 500sqm (₦35M) • 1000sqm (₦70M)',
    paymentType: 'Direct Allocation',
    handoverDate: 'Completed & Allocated',
    specs: {
      area: '300 sqm – 1,000 sqm',
      landType: '100% Dry Table Land',
      titleType: 'Governor’s Consent'
    },
    summary: 'Appleton Court is a carefully designed estate to provide homes and not just houses to our esteemed subscribers. It is a gated estate within a serene environment and in one of the safest neighbourhood in the Lekki corridor.',
    detailedDescription: 'Appleton Court is a carefully designed estate to provide homes and not just houses to our esteemed subscribers. It is a gated estate within a serene environment and in one of the safest neighbourhood in the Lekki corridor. This estate comes with a 24/7 power supply, portable water, armed security personnel, green areas, gym, skylight roofs, internet ready homes, massive rooms with walk in closets, high luxury doors and lavish windows, fitted kitchen, stylish staircase, ample front and rear terrace sit outs and lots more. It is a fully serviced estate.',
    keyFeatures: [
      'Portable Water & 24/7 Power Supply',
      'Internet Ready & Fully Serviced Estate',
      'Armed Security Personnel & Perimeter Fencing',
      'Gymnasium & Green Areas',
      'Skylight Roofs & Walk-in Closets',
      'High Luxury Doors & Lavish Windows',
      'Fitted Kitchen & Stylish Staircase',
      'Ample Front and Rear Terrace Sit-outs'
    ],
    neighbourhood: [
      'Abraham Adesanya Estate',
      'Mother & Child Healthcare Center',
      'Lekki Pride 1',
      'Royal Garden, Ajah',
      'Ajiwe Police Station',
      'Lagos Business School'
    ],
    faqPdfUrl: 'https://caihgroup.com/wp-content/uploads/2024/11/APPLETON-FORM-FAQ.pdf',
    mapEmbedUrl: 'https://maps.google.com/maps?q=Appleton%20Court%2C%20Emmanuel%20Achukwu%20St%2C%20Aja%2C%20Lagos%20106104%2C%20Lagos&t=m&z=14&output=embed&iwloc=near',
    videoList: [
      {
        url: 'https://www.youtube.com/embed/qa550kq6gc8',
        title: 'Welcome to Appleton Court',
        duration: '03:15',
        description: 'Official estate tour of Appleton Court on Emmanuel Akachukwu St, Ajah, by Caih Properties.'
      }
    ],
    unitsOrPlots: [
      {
        id: 'appleton-court-300',
        name: '300sqm Serviced Plot',
        size: '300 sqm',
        priceDisplay: '₦22M',
        priceSub: '₦3M deposit, ₦22M total',
        deposit: '₦3,000,000',
        paymentType: 'Direct Allocation',
        landType: '100% Dry Land',
        titleType: 'Governor’s Consent',
        isPopular: true,
        features: ['₦3M Initial Deposit', 'Fully Serviced Infrastructure', 'Governor’s Consent', 'Armed Security'],
        description: 'Prime 300sqm plot with ₦3M deposit and ₦22M total price.'
      },
      {
        id: 'appleton-court-500',
        name: '500sqm Serviced Plot',
        size: '500 sqm',
        priceDisplay: '₦35M',
        priceSub: '₦5M deposit, ₦35M total',
        deposit: '₦5,000,000',
        paymentType: 'Direct Allocation',
        landType: '100% Dry Land',
        titleType: 'Governor’s Consent',
        isPopular: false,
        features: ['₦5M Initial Deposit', 'Fully Serviced Infrastructure', 'Governor’s Consent', 'Armed Security'],
        description: 'Standard 500sqm plot with ₦5M deposit and ₦35M total price.'
      },
      {
        id: 'appleton-court-1000',
        name: '1000sqm Commercial / Residential Parcel',
        size: '1,000 sqm',
        priceDisplay: '₦70M',
        priceSub: '₦10M deposit, ₦70M total',
        deposit: '₦10,000,000',
        paymentType: 'Direct Allocation',
        landType: '100% Dry Land',
        titleType: 'Governor’s Consent',
        isPopular: false,
        features: ['₦10M Initial Deposit', 'Prime Road Frontage', 'Governor’s Consent', 'Armed Security'],
        description: 'Large 1000sqm parcel with ₦10M deposit and ₦70M total price.'
      }
    ]
  },
  {
    id: 'appleton-haven',
    title: 'Appleton Haven',
    location: 'Balarabe Musa Crescent, Victoria Island, Lagos',
    corridor: 'Victoria Island',
    propertyType: 'residential',
    priceCategory: 'high',
    status: 'ongoing',
    statusLabel: 'Luxury Residential',
    badge: 'APPLETON HAVEN',
    secondaryBadge: 'VICTORIA ISLAND • LUXURY RESIDENCES',
    image: 'https://caihgroup.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-05-at-09.28.10-1-e1770664687158.jpg',
    galleryImages: [
      'https://caihgroup.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-05-at-09.28.10-1-e1770664687158.jpg',
      'https://caihgroup.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-05-at-09.28.14.jpg',
      'https://caihgroup.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-05-at-09.28.14-1.jpg',
      'https://caihgroup.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-05-at-09.28.14-2.jpg',
      'https://caihgroup.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-05-at-09.28.14-3.jpg',
      'https://caihgroup.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-05-at-09.28.13.jpg',
      'https://caihgroup.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-05-at-09.28.12-4.jpg',
      'https://caihgroup.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-05-at-09.28.12-3.jpg',
      'https://caihgroup.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-05-at-09.28.12-2.jpg',
      'https://caihgroup.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-05-at-09.28.12-5.jpg',
      'https://caihgroup.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-05-at-09.28.10.jpg',
      'https://caihgroup.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-05-at-09.28.11-3.jpg',
      'https://caihgroup.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-05-at-09.28.12.jpg',
      'https://caihgroup.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-05-at-09.28.12-1.jpg'
    ],
    priceDisplay: 'From ₦450M',
    priceSub: '2-Bed: ₦450M • 3-Bed: ₦750M • 4-Bed Maisonette: ₦1.4B',
    paymentType: 'Direct Allocation',
    handoverDate: 'Q3 2026',
    specs: {
      beds: 2,
      baths: 3,
      area: '180 – 480 Sq. M',
      titleType: 'Governor’s Consent'
    },
    summary: 'An ultra-luxury residential development on Balarabe Musa Crescent, Victoria Island, featuring expansive living areas, lush greenery, 24/7 power, swimming pool, concierge, and elevator.',
    detailedDescription: 'Appleton Haven offers 2-bedroom apartments with BQ (₦450M), 3-bedroom apartments with BQ (₦750M), and 4-bedroom maisonettes with cinema and BQ (₦1.4B) in Victoria Island, Lagos.',
    keyFeatures: [
      'Expansive Living Area & Lush Greenery',
      '24/7 Redundant Power & Security',
      'Swimming Pool & Concierge Services',
      'High-Speed Private Elevator',
      'Private Cinema & Maid’s BQ (in Maisonette)'
    ],
    unitsOrPlots: [
      {
        id: 'appleton-haven-2bed',
        name: '2-Bedroom Apartment with BQ',
        size: '180 Sq. M',
        priceDisplay: '₦450M',
        priceSub: '2-Bed with BQ',
        paymentType: 'Direct Allocation',
        beds: 2,
        baths: 3,
        titleType: 'Governor’s Consent',
        isPopular: true,
        features: ['En-suite Bedrooms', 'Maid’s BQ', 'Expansive Living Area', 'Concierge Access'],
        description: '2-bedroom luxury apartment with BQ in Victoria Island.'
      },
      {
        id: 'appleton-haven-3bed',
        name: '3-Bedroom Apartment with BQ',
        size: '320 Sq. M',
        priceDisplay: '₦750M',
        priceSub: '3-Bed with BQ',
        paymentType: 'Direct Allocation',
        beds: 3,
        baths: 4,
        titleType: 'Governor’s Consent',
        isPopular: false,
        features: ['En-suite Bedrooms', 'Maid’s BQ', 'Swimming Pool Access', 'Private Elevator'],
        description: '3-bedroom luxury apartment with BQ in Victoria Island.'
      },
      {
        id: 'appleton-haven-4bed',
        name: '4-Bedroom Maisonette with Cinema and BQ',
        size: '480 Sq. M',
        priceDisplay: '₦1.4B',
        priceSub: '4-Bed Maisonette with Cinema',
        paymentType: 'Direct Allocation',
        beds: 4,
        baths: 5,
        titleType: 'Governor’s Consent',
        isPopular: false,
        features: ['Private Cinema Suite', 'Maid’s BQ', 'Double-Volume Ceilings', 'Rooftop Terrace'],
        description: '4-bedroom maisonette with private cinema suite and BQ.'
      }
    ]
  },
  {
    id: 'appleton-luxury-apartments',
    title: 'Appleton Apartments & Maisonette',
    location: 'Remi Olowude Street, Lekki Phase 1, Lagos',
    corridor: 'Lekki Phase 1',
    propertyType: 'residential',
    priceCategory: 'high',
    status: 'ongoing',
    statusLabel: 'Luxury Apartments',
    badge: 'LEKKI PHASE 1',
    secondaryBadge: 'REMI OLOWUDE STREET',
    image: 'https://caihgroup.com/wp-content/uploads/2026/02/ApartmentMaisonnette3-1-e1770664790399.jpeg',
    galleryImages: [
      'https://caihgroup.com/wp-content/uploads/2026/02/ApartmentMaisonnette3-1-e1770664790399.jpeg',
      'https://caihgroup.com/wp-content/uploads/2026/02/ApartmentMaisonnette1.jpeg',
      'https://caihgroup.com/wp-content/uploads/2026/02/ApartmentMaisonnette2.jpeg',
      'https://caihgroup.com/wp-content/uploads/2026/02/ApartmentMaisonnette3.jpeg',
      'https://caihgroup.com/wp-content/uploads/2026/02/ApartmentMaisonnette4.jpeg'
    ],
    priceDisplay: 'From ₦220M',
    priceSub: '1-Bed: ₦220M • 2-Bed: ₦300M • 3-Bed: ₦450M',
    paymentType: 'Direct Allocation',
    handoverDate: 'Q4 2026',
    specs: {
      beds: 1,
      baths: 2,
      area: '120 – 320 Sq. M',
      titleType: 'Governor’s Consent'
    },
    summary: 'Executive apartments & maisonettes on Remi Olowude Street, Lekki Phase 1, featuring rooftop pool, smart home technology, 24/7 power, and state-of-the-art gym.',
    detailedDescription: 'Appleton Apartments & Maisonette on Remi Olowude Street, Lekki Phase 1 offers executive 1-bedroom maisonettes (₦220M), 2-bedroom ensuite apartments (₦300M), and 3-bedroom maisonettes (₦450M).',
    keyFeatures: [
      'Rooftop Swimming Pool & Lounge',
      'Smart Home Technology Integration',
      '24/7 Power Supply & Security',
      'State-of-the-Art Gymnasium'
    ],
    unitsOrPlots: [
      {
        id: 'appleton-apt-1bed',
        name: '1-Bedroom Executive Maisonette',
        size: '120 Sq. M',
        priceDisplay: '₦220M',
        priceSub: '1-Bed Executive',
        paymentType: 'Direct Allocation',
        beds: 1,
        baths: 2,
        titleType: 'Governor’s Consent',
        isPopular: true,
        features: ['Smart Home Tech', 'Rooftop Pool Access', 'Fitted Kitchen'],
        description: 'Executive 1-bedroom maisonette in Lekki Phase 1.'
      },
      {
        id: 'appleton-apt-2bed',
        name: '2-Bedroom Ensuite Apartment',
        size: '200 Sq. M',
        priceDisplay: '₦300M',
        priceSub: '2-Bed Ensuite',
        paymentType: 'Direct Allocation',
        beds: 2,
        baths: 3,
        titleType: 'Governor’s Consent',
        isPopular: false,
        features: ['All Ensuite Bedrooms', 'Smart Automation', 'Gym Access'],
        description: '2-bedroom ensuite apartment in Lekki Phase 1.'
      },
      {
        id: 'appleton-apt-3bed',
        name: '3-Bedroom Maisonette',
        size: '320 Sq. M',
        priceDisplay: '₦450M',
        priceSub: '3-Bed Maisonette',
        paymentType: 'Direct Allocation',
        beds: 3,
        baths: 4,
        titleType: 'Governor’s Consent',
        isPopular: false,
        features: ['Spacious Living Area', 'Smart Home Tech', 'Rooftop Pool & Parking'],
        description: '3-bedroom luxury maisonette in Lekki Phase 1.'
      }
    ]
  },
  {
    id: 'appleton-terraces-and-apartments',
    title: 'Appleton Terraces and Apartments',
    location: 'Ogombo Road, near Charter House School, Eti-Osa, Lekki, Lagos',
    corridor: 'Ogombo Road / Coastal Road Axis',
    propertyType: 'residential',
    priceCategory: 'mid',
    status: 'ongoing',
    statusLabel: 'Selling Fast',
    badge: 'OGOMBO ROAD • LEKKI',
    secondaryBadge: '96 UNITS • 3 & 4 BEDROOMS',
    image: 'https://caihgroup.com/wp-content/uploads/2025/01/SL-070720-32260-33-scaled.jpg',
    galleryImages: [
      'https://caihgroup.com/wp-content/uploads/2025/01/SL-070720-32260-33-scaled.jpg'
    ],
    priceDisplay: 'From ₦90M',
    priceSub: '3-Bed Duplex: ₦90M • 4-Bed Duplex: ₦110M',
    paymentType: 'Direct Allocation',
    videoComingSoon: true,
    handoverDate: 'Q1 2027',
    specs: {
      beds: 3,
      baths: 4,
      area: '220 – 280 Sq. M',
      titleType: 'Governor’s Consent'
    },
    summary: '96 units of 3- and 4-bedroom terrace duplexes on Ogombo Road, near Charter House School, close to the ongoing Lagos-Calabar coastal road.',
    detailedDescription: 'Appleton Terraces and Apartments offers 96 units of 3-bedroom terrace duplexes (₦90M) and 4-bedroom terrace duplexes (₦110M) on Ogombo Road, Eti-Osa, Lekki, close to Charter House School and the Lagos-Calabar coastal highway.',
    keyFeatures: [
      '96 Units of 3 & 4-Bedroom Terrace Duplexes',
      'Portable Water & Spacious Car Park',
      '24/7 Power Supply & Gym',
      '24/7 Security & CCTV Surveillance',
      'Close to Charter House School & Coastal Road'
    ],
    unitsOrPlots: [
      {
        id: 'appleton-terraces-3bed',
        name: '3-Bedroom Terrace Duplex',
        size: '220 Sq. M',
        priceDisplay: '₦90M',
        priceSub: '3-Bedroom Duplex',
        paymentType: 'Direct Allocation',
        beds: 3,
        baths: 4,
        titleType: 'Governor’s Consent',
        isPopular: true,
        features: ['All En-suite Bedrooms', 'Spacious Car Park', '24/7 Power & Security'],
        description: '3-bedroom terrace duplex on Ogombo Road, Lekki.'
      },
      {
        id: 'appleton-terraces-4bed',
        name: '4-Bedroom Terrace Duplex',
        size: '280 Sq. M',
        priceDisplay: '₦110M',
        priceSub: '4-Bedroom Duplex',
        paymentType: 'Direct Allocation',
        beds: 4,
        baths: 5,
        titleType: 'Governor’s Consent',
        isPopular: false,
        features: ['4 En-suite Bedrooms', 'Maid’s Room Provision', 'Gym & CCTV Security'],
        description: '4-bedroom terrace duplex on Ogombo Road, Lekki.'
      }
    ]
  },
  {
    id: 'appleton-enclave',
    title: 'Appleton Enclave',
    location: 'Olomowewe area, Free Trade Zone Corridor, Ibeju-Lekki, Lagos',
    corridor: 'Free Trade Zone Axis',
    propertyType: 'plots',
    priceCategory: 'mid',
    status: 'ongoing',
    statusLabel: 'Selling Fast',
    badge: 'APPLETON ENCLAVE',
    secondaryBadge: 'FREE TRADE ZONE • C OF O',
    image: '/images/appleton_enclave_entrance.jpg',
    galleryImages: [
      '/images/appleton_enclave_entrance.jpg',
      '/images/yt_ihEzpBhqRjY.jpg'
    ],
    priceDisplay: 'From ₦16M',
    priceSub: '300sqm (₦16M) • 500sqm (₦25M) • 1,000sqm (₦60M)',
    paymentType: 'Direct Allocation',
    handoverDate: 'Immediate Physical Allocation',
    specs: {
      area: '300 sqm – 1,000 sqm',
      landType: '100% Dry Table Land',
      titleType: 'Certificate of Occupancy (C of O)'
    },
    summary: 'Appleton Enclave is located in the Olomowewe area of the Free Trade Zone, with close proximity to the Dangote Refinery, Lekki Deep Sea Port, and other notable developments. A serene location with beautiful residential ambience.',
    detailedDescription: 'Appleton Enclave is located at Olomowewe area of the Free Trade Zone, in close proximity to the Dangote Refinery, Deep Sea Port, and other notable mega-developments. It is a very serene location with beautiful residential ambience, featuring Certificate of Occupancy (C of O) title, 100% dry table land, well-paved road network, constant electricity, portable water, armed security personnel, children play area, and lavish greenery.',
    keyFeatures: [
      'Certificate of Occupancy (C of O) Sovereign Title',
      'Close proximity to Dangote Refinery & Lekki Deep Sea Port',
      'Well-Paved Internal Road Network',
      'Constant Electricity & Portable Water',
      'Armed Security Personnel & Monitored Access Gate',
      'Children Play Area & Lavish Greenery',
      '100% Dry Table Land (Zero Sand-Filling Required)',
      'Immediate Physical Allocation & Beacon Demarcation'
    ],
    faqPdfUrl: 'https://caihgroup.com/wp-content/uploads/2024/11/APPLETON-FORM-FAQ.pdf',
    videoList: [
      {
        url: 'https://www.youtube.com/embed/ihEzpBhqRjY',
        title: 'Premium Living at Appleton Enclave: Prime Plots in Ibeju Lekki',
        duration: '03:45',
        description: 'Official site video tour of Appleton Enclave in the Free Trade Zone corridor.'
      }
    ],
    paymentTable: [
      {
        plotSize: '300 sqm',
        initialDeposit: '₦3,000,000',
        threeMonths: '₦16,000,000',
        sixMonths: '₦18,000,000'
      },
      {
        plotSize: '500 sqm',
        initialDeposit: '₦4,000,000',
        threeMonths: '₦25,000,000',
        sixMonths: '₦27,000,000'
      },
      {
        plotSize: '1,000 sqm',
        initialDeposit: '₦10,000,000',
        threeMonths: '₦60,000,000',
        sixMonths: '₦65,000,000'
      }
    ],
    bankingDetails: {
      accountName: 'CAIH RESOURCES LIMITED',
      bankName: 'TAJ BANK',
      accountNumber: '0008343786'
    },
    faqs: [
      {
        question: 'Where is APPLETON ENCLAVE located?',
        answer: 'APPLETON ENCLAVE is located at Olomowewe area of the Free Trade Zone, with close proximity to the Dangote Refinery, Deep Sea port, and other notable developments. A very serene location with beautiful residential ambience.'
      },
      {
        question: 'Who is the developer of APPLETON ENCLAVE?',
        answer: 'CAIH Group (Caih Resources Limited).'
      },
      {
        question: 'What is the title on APPLETON ENCLAVE?',
        answer: 'Certificate of Occupancy (C of O).'
      },
      {
        question: 'What plot sizes are available?',
        answer: '300sqm, 500sqm, and 1,000sqm respectively.'
      },
      {
        question: 'What facilities will be available in the estate?',
        answer: 'Well-paved road network, constant electricity, portable water, armed security personnel, children play area, and lavish greenery amongst others.'
      },
      {
        question: 'What is the transaction process?',
        answer: '1. Pay the initial deposit. 2. Collect Receipt and Contract of Sale. 3. Collect Deed of Assignment and Survey Plan on completion of payment. 4. Collect Allocation Letter and Physical Allocation. 5. Commence your building.'
      },
      {
        question: 'Are there any encumbrances on the land?',
        answer: 'No, the land is free from every known government acquisition or interest and adverse claims.'
      },
      {
        question: 'Can I pay cash to your consultants?',
        answer: 'No! All payments for APPLETON ENCLAVE should be made directly to CAIH GROUP’S designated bank account: Caih Resources Limited, TAJ Bank, Account Number: 0008343786.'
      },
      {
        question: 'How do I pay my balance after initial deposit?',
        answer: 'Balance will be paid based on an agreed fixed monthly installment across the 0-3 months or 4-6 months duration.'
      },
      {
        question: 'Is the price subject to change?',
        answer: 'Yes.'
      },
      {
        question: 'What documents will I get after initial deposit?',
        answer: 'Receipt of payment and Contract of Sales.'
      },
      {
        question: 'Can I resell my plot(s)?',
        answer: 'Yes, plot(s) FULLY paid for can be resold, but with the company’s consent.'
      },
      {
        question: 'When will work begin on the estate?',
        answer: 'Infrastructure development work is currently ongoing.'
      },
      {
        question: 'Can I start building immediately after payment?',
        answer: 'Yes, construction can commence after full payment and after obtaining all Government Permits.'
      },
      {
        question: 'Is the road leading to the estate motorable?',
        answer: 'Yes, there is a good motorable road leading to the estate.'
      }
    ],
    unitsOrPlots: [
      {
        id: 'appleton-enclave-300',
        name: '300 sqm Serviced Residential Plot',
        size: '300 sqm',
        priceDisplay: '₦16M',
        priceSub: '₦3M Deposit • 0-3 mos: ₦16M / 4-6 mos: ₦18M',
        deposit: '₦3,000,000',
        paymentType: 'Direct Allocation',
        landType: '100% Dry Table Land',
        titleType: 'Certificate of Occupancy (C of O)',
        isPopular: true,
        features: [
          '100% Dry Table Ground',
          'Certificate of Occupancy Title',
          'Direct Paved Road Frontage',
          'Instant Survey Beacon Demarcation'
        ],
        description: 'Prime dry residential land plot with C of O title, close to Dangote Refinery and Lekki Deep Sea Port.'
      },
      {
        id: 'appleton-enclave-500',
        name: '500 sqm Standard Serviced Plot',
        size: '500 sqm',
        priceDisplay: '₦25M',
        priceSub: '₦4M Deposit • 0-3 mos: ₦25M / 4-6 mos: ₦27M',
        deposit: '₦4,000,000',
        paymentType: 'Direct Allocation',
        landType: '100% Dry Table Land',
        titleType: 'Certificate of Occupancy (C of O)',
        isPopular: false,
        features: [
          'Expansive 500 sqm Dry Topography',
          'Certificate of Occupancy Title',
          'Direct Paved Access & Constant Power',
          'Immediate Physical Demarcation'
        ],
        description: 'Standard serviced plot with maximum road frontage in the high-yield Free Trade Zone corridor.'
      },
      {
        id: 'appleton-enclave-1000',
        name: '1,000 sqm Commercial / Double Plot',
        size: '1,000 sqm',
        priceDisplay: '₦60M',
        priceSub: '₦10M Deposit • 0-3 mos: ₦60M / 4-6 mos: ₦65M',
        deposit: '₦10,000,000',
        paymentType: 'Direct Allocation',
        landType: '100% Dry Table Land',
        titleType: 'Certificate of Occupancy (C of O)',
        isPopular: false,
        features: [
          'Massive 1,000 sqm Estate Parcel',
          'Certificate of Occupancy Title',
          'Suitable for Luxury Villa or Multi-unit',
          'Immediate Physical Allocation'
        ],
        description: 'Large-scale 1,000 sqm prime parcel suited for expansive residential developments or family compounds.'
      }
    ]
  },
  {
    id: 'appleton-commercial-residential',
    title: 'Appleton Commercial & Residences',
    location: 'Origanrigan Area of Ibeju Lekki by the Free Trade Zone',
    corridor: 'Free Trade Zone / Dangote Refinery Axis',
    propertyType: 'plots',
    priceCategory: 'high',
    status: 'upcoming',
    statusLabel: 'Available for Allocation',
    badge: 'COMMERCIAL & RESIDENCES',
    secondaryBadge: 'FREE TRADE ZONE • C OF O',
    image: 'https://caihgroup.com/wp-content/uploads/2026/02/commercial-e1770636774756.jpeg',
    galleryImages: [
      'https://caihgroup.com/wp-content/uploads/2026/02/commercial-e1770636774756.jpeg',
      '/images/regenerated_image_1791992702647.png'
    ],
    priceDisplay: 'From ₦70m',
    priceSub: '1,000 SQM (₦70M) • 2,000 SQM (₦130M) • 5,000 SQM (₦300M)',
    paymentType: 'Direct Allocation',
    handoverDate: 'Immediate Physical Allocation',
    specs: {
      area: '1,000 – 5,000 SQM',
      landType: 'Heavy-Duty Dry Ground',
      titleType: 'Certificate of Occupancy (C of O)'
    },
    summary: 'Appleton Commercial & Residences in the Origanrigan Area of Ibeju Lekki by the Free Trade Zone. Prime C of O serviced parcels with central gas powered system, warehouses & storage, wide heavy-duty roads, and residential zoning.',
    detailedDescription: 'Appleton Commercial & Residences is a signature master development by CAIH Group located in the strategic Origanrigan area of Ibeju Lekki, adjacent to the Lekki Free Trade Zone and Dangote Refinery corridor. Fully certified with a sovereign Certificate of Occupancy (C of O), the project offers 1,000 SQM, 2,000 SQM, and 5,000 SQM development parcels engineered with heavy-duty roadways, central gas-powered systems, 24/7 CCTV surveillance, perimeter fencing, integrated warehouse and storage facilities, and designated residential quarters.',
    keyFeatures: [
      'Land Title: Certified Certificate of Occupancy (C of O)',
      'Strategic Location: Origanrigan Area of Ibeju Lekki by Free Trade Zone',
      'Central Gas Powered System Infrastructure',
      '24/7 Surveillance Camera Security Coverage',
      'Full Perimeter Fencing with Monitored Gate Access',
      'Wide and Heavy-Duty Road Networks Engineered for Logistics',
      'Integrated Warehouses and Storage Facilities',
      'Master-Planned Dedicated Residential Area Partition',
      'Immediate Physical Allocation & Cadastral Beacon Demarcation'
    ],
    unitsOrPlots: [
      {
        id: 'appleton-comm-res-1000',
        name: '1,000 SQM Commercial & Residential Plot',
        size: '1,000 SQM',
        priceDisplay: '₦70m',
        priceSub: '1,000 SQM Parcel',
        paymentType: 'Direct Allocation',
        landType: 'Heavy-Duty Dry Land',
        titleType: 'Certificate of Occupancy (C of O)',
        isPopular: true,
        features: [
          'Certificate of Occupancy (C of O)',
          '1,000 SQM Heavy-Duty Ground',
          'Direct Free Trade Zone Corridor Frontage',
          'Access to Central Gas Powered Grid'
        ],
        description: 'Prime 1,000 SQM parcel in Origanrigan by the Free Trade Zone, optimal for high-yield commercial or residential developments.'
      },
      {
        id: 'appleton-comm-res-2000',
        name: '2,000 SQM Strategic Logistics & Enterprise Parcel',
        size: '2,000 SQM',
        priceDisplay: '₦130m',
        priceSub: '2,000 SQM Strategic Parcel',
        paymentType: 'Direct Allocation',
        landType: 'Heavy-Duty Dry Land',
        titleType: 'Certificate of Occupancy (C of O)',
        isPopular: false,
        features: [
          'Certificate of Occupancy (C of O)',
          '2,000 SQM Dual-Frontage Access',
          'Heavy-Load Bearing Foundation Ground',
          'Central Gas & Warehouse Ready'
        ],
        description: 'Substantial 2,000 SQM parcel with wide frontage and heavy-load capacity, tailored for distribution, commerce, or multi-family residences.'
      },
      {
        id: 'appleton-comm-res-5000',
        name: '5,000 SQM Mega Warehouse / Industrial & Commercial Hub',
        size: '5,000 SQM',
        priceDisplay: '₦300m',
        priceSub: '5,000 SQM Mega Parcel',
        paymentType: 'Direct Allocation',
        landType: 'Heavy-Duty Dry Land',
        titleType: 'Certificate of Occupancy (C of O)',
        isPopular: false,
        features: [
          'Certificate of Occupancy (C of O)',
          '5,000 SQM Landmark Industrial Footprint',
          'Direct Logistics Heavy-Duty Roadway Access',
          'Integrated Warehouse & Storage Infrastructure'
        ],
        description: 'Expansive 5,000 SQM flagship commercial land parcel in Origanrigan by the Free Trade Zone, primed for industrial warehousing, corporate storage, or large-scale enterprise.'
      }
    ]
  }
];

export const VIDEO_DISPATCHES: VideoDispatch[] = [
  {
    id: 'vid-1',
    title: 'Appleton Haven: Luxury Penthouse & Maisonette Tour (Victoria Island)',
    tag: 'ON-SITE WALKTHROUGH',
    duration: '04:18',
    thumbnail: 'https://caihgroup.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-05-at-09.28.10-1-e1770664687158.jpg',
    description: 'Exclusive tour of Appleton Haven in Victoria Island, showcasing bespoke Italian kitchens, soaring ceilings, and panoramic skyline views.',
    speaker: 'Caih Group Architectural Directorate',
    embedUrl: 'https://player.vimeo.com/video/1051104651'
  },
  {
    id: 'vid-2',
    title: 'Welcome to Appleton Court (Ajah)',
    tag: 'COMPLETED PROJECT',
    duration: '03:15',
    thumbnail: 'https://i.ytimg.com/vi/qa550kq6gc8/hqdefault.jpg',
    description: 'Official estate tour and walkthrough of Appleton Court on Emmanuel Akachukwu Street, Ajah by Caih Properties.',
    speaker: 'Caih Properties',
    embedUrl: 'https://www.youtube.com/embed/qa550kq6gc8'
  },
  {
    id: 'vid-3',
    title: 'Appleton Apartments & Maisonette: Lekki Phase 1 Rooftop & Interiors',
    tag: 'LEKKI PHASE 1',
    duration: '05:12',
    thumbnail: 'https://caihgroup.com/wp-content/uploads/2026/02/ApartmentMaisonnette3-1-e1770664790399.jpeg',
    description: 'Exploring smart home features, executive maisonettes, and rooftop pool on Remi Olowude Street, Lekki Phase 1.',
    speaker: 'Caih Group Real Estate Advisory',
    embedUrl: 'https://player.vimeo.com/video/1051104651'
  }
];

export const EXECUTIVES: Executive[] = [
  {
    name: 'Engr. Kayode Olorunfemi',
    role: 'Managing Director & CEO',
    credentials: 'B.Eng, MSc, PMP, MNSE, COREN',
    image: '/images/D2B631C2-32BE-4212-91E9-3268045FD781.png',
    bio: 'Pioneering structural integrity across commercial and residential developments in Nigeria for over two decades. Accredited with the Nigerian Society of Engineers (NSE) and Council for the Regulation of Engineering in Nigeria (COREN).'
  },
  {
    name: 'Dr. Paul Olorunfemi',
    role: 'Co-Founder & Director of Strategy',
    credentials: 'Strategic Corporate Advisory & Global Capital',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZk4Z7owM1QyHg5U6JfTWSui6uh5sqPYJI547mAvfNy6L1Zb0L1eT7JiydgtkT3-9hbNWNsSTnSIyAV86gPM4iOeP3hICFA0vSplQyUsSLRYyHa_cW0yc32Od0eZYrM5rQj3bnk35TWPSpe0xGj6UY9iKR1wcSwoqfciBzp7iQLHVlYVY54ypaTtIsSepIsLnbyS5DnnxDfzPvdfm9KoHbQ1LzVUdhdCQTrbVZaiCaJNdWft-JXkPXYPyAVvCv_GPazSg',
    bio: 'Oversees diaspora investment conduits, multi-tier joint ventures, and structured institutional funding partnerships across West African infrastructure assets.'
  },
  {
    name: 'Engr. Obafaiye',
    role: 'Executive Director, Projects & Operations',
    credentials: 'COREN, NSE, PMP, SPE | 25+ Years Experience',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB23Oz8MwH4ndcyUxIz_4SJ0y2A9foZvCjmiBs7lDa3mkgMJUPOM9l-cT87PUHRCTmMshfEYTIt4yMmvpmHE4IKWEhbAuunt7d21GS_xuVWvPPdaxD6K46m0emOp_b-8dhZPWTmRBTRJlFMlaZTLE0OSw1sDzWBJGQb32sCiybPL1Q61rh6t3HtjkkQDeSIQaMVezd6AHTrMfRrcmykzggETMq5XA9-_yzHY-EPq0YwZnARyl6pTiCC_EBFYblrKXQ64Ic',
    bio: 'Seasoned EPC director commanding mega-scale industrial batching yards, high-load foundation piling, and highway infrastructure with rigorous health, safety, and delivery timelines.'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Dr. Babatunde Adeyemi',
    role: 'Diaspora Investor',
    avatar: '/images/IMG-20260919-WA0004 (1).jpg',
    pillar: 'Title Security',
    projectOrSector: 'Appleton Court & Haven',
    location: 'London, UK',
    verifiedBadge: 'Verified Owner',
    rating: 5,
    headline: 'Seamless remote acquisition with absolute transparency',
    quote: 'Securing my property while residing in London was remarkably smooth. The titles were verified directly with the Lagos Lands Bureau, and deeds arrived without delay.'
  },
  {
    name: 'Mrs. Chinwe Okonkwo',
    role: 'Homeowner',
    avatar: '/images/IMG-20260919-WA0005 (1).jpg',
    pillar: 'Structural Integrity',
    projectOrSector: 'Appleton Terraces',
    location: 'Houston, TX',
    verifiedBadge: 'Allocated & Handed Over',
    rating: 5,
    headline: 'Uncompromising construction standards',
    quote: 'Caih Group delivered on structural integrity and building specs. Zero hidden development levies, with weekly drone videos throughout construction.'
  },
  {
    name: 'Engr. Olumide Lawal',
    role: 'Civil Engineer & Investor',
    avatar: '/images/IMG-20260919-WA0006.jpg',
    pillar: 'Engineering & Drainage',
    projectOrSector: 'Appleton Estates',
    location: 'Lagos, Nigeria',
    verifiedBadge: 'Verified Investor',
    rating: 5,
    headline: 'Benchmark engineering grade along the corridor',
    quote: 'As an engineer myself, I inspect foundation reinforcement and drainage lines closely. Caih Group’s civil standards along Lekki-Epe are benchmark grade.'
  }
];
