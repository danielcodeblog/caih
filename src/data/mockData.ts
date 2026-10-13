import { Project, Article, VideoDispatch, Executive } from '../types';

export const BRAND_ASSETS = {
  headerLogo: 'https://lh3.googleusercontent.com/aida/AEtjO1Xu8Hi6gt4IGQJGtzMiiVOJsUwmZ-9RghSb-lHSvDpMG5D3t77bbzY0y9gAIJ6o78MlC6UABcvq9m0iKyLQwjI08lacfJPVOO8cr20_5kA_wzVeh90QGIhgw7zo26A_EdIQkJFpQsK3a4CjHn33AovZQIaCE0UikPrXE00tOzFoQtJv11D2H9wEllnI-NvPVCIVwoG3McT19e39q9STUSXiswdZ5VIEJbGzrNTRu3i-GtZu4Zlvztb2RF1E',
  footerLogo: 'https://lh3.googleusercontent.com/aida/AEtjO1Xh7m1LVYBaw0lDCpWR888j1OvjzL1foSTe-mC7AybTvqOBn5DivVAS3bxyvR5tIJc6Is4XMWVXygCD3jotXUI589-ZNT8Tfv42OMK5U4IMB_FhbUcshWuri51y29ehddrVC0ZYjpE-oMQkpUvBLT54uVxFCzDcm7DfvRPqPSgK3R7PCIlItsMhxFmYClqITTx8gfnV1O-gMaNkUy-JK3OmD_P-M8_lbIfI90ruOvxHANX1u-l-aisgOBSU',
  phone: '+234 906 688 7444',
  phoneClean: '+2349066887444',
  email: 'info@caihgroup.com',
  address: 'NO. 5 Chief Ganiu Enitan Olugborangan layout, Eleganza Bus stop, Lagos, Nigeria'
};

export const PROJECTS: Project[] = [
  {
    id: 'appleton-enclave',
    title: 'Appleton Enclave Phase I & II',
    location: 'Eleganza Bus Stop, Lekki Phase 2, Lagos',
    corridor: 'Lekki Phase 2',
    propertyType: 'residential',
    priceCategory: 'deposit',
    status: 'upcoming',
    statusLabel: 'Upcoming Project',
    badge: 'UPCOMING PROJECT',
    secondaryBadge: 'EARLY BIRD ALLOCATION',
    image: '/src/assets/images/appleton_enclave_1791879258411.jpg',
    priceDisplay: '₦3,280,000',
    priceSub: 'Flexible 18-month plan',
    startingDeposit: '₦3,280,000',
    handoverDate: 'Q4 2026',
    specs: {
      beds: 4,
      baths: 5,
      area: '3,549 Sq. Ft',
      titleType: "Governor's Consent & C of O"
    },
    summary: 'Upcoming master-planned residential community featuring smart-home automation, central water reticulation, underground cabling, and gated perimeter access control in Lekki Phase 2.',
    detailedDescription: 'Appleton Enclave Phase I & II is an upcoming flagship residential community within the Lekki Phase 2 growth corridor. Developed by Caih Group with structural cast concrete, integrated fiber optics, and dedicated solar-hybrid auxiliary power, each unit offers spacious en-suite family bedrooms, custom Italian-grade kitchens, and private parking bays.',
    keyFeatures: [
      'Full Smart Home Automation & Biometric Access',
      'Central Water Purification Plant with Dedicated Reticulation',
      'Underground Electrical Cabling & 24/7 Solar-Grid Backup',
      'Children Play Area, Swimming Pool & Clubhouse',
      'Certified Governor’s Consent & Lagos State Registered C of O'
    ]
  },
  {
    id: 'appleton-court',
    title: 'Appleton Court Terraces',
    location: 'Eleganza Bus Stop, Lekki Phase 2',
    corridor: 'Lekki Phase 2',
    propertyType: 'residential',
    priceCategory: 'deposit',
    status: 'completed',
    statusLabel: 'Completed & Delivered',
    badge: 'COMPLETED PROJECT',
    secondaryBadge: 'CAIH PROPERTIES HOME',
    image: '/src/assets/images/appleton_court_1791879277574.jpg',
    priceDisplay: '₦3,280,000',
    priceSub: 'Initial Deposit / Milestone Linked',
    startingDeposit: '₦3,280,000',
    specs: {
      beds: 4,
      baths: 5,
      area: '3,549 SqFt',
      titleType: 'Governor’s Consent'
    },
    summary: 'Contemporary 4-bedroom luxury residential terraces with smart home automation and dedicated utilities.',
    detailedDescription: 'Appleton Court Terraces provides master-crafted four-bedroom luxury living designed for upwardly mobile families and high-yield investors. Featuring expansive floor-to-ceiling soundproof glazing, perimeter smart security, and milestone-linked payment schedules.',
    keyFeatures: [
      '4 En-Suite Bedrooms with Walk-in Closets',
      '5 Modern Bathrooms with Hansgrohe Fittings',
      'Dedicated Maid’s Room / BQ',
      'Private 2-Car Parking Port',
      'CCTV Monitoring & Uniformed Security'
    ]
  },
  {
    id: 'epe-gateway-plots',
    title: 'Epe Gateway Industrial Plots',
    location: 'Sagamu-Epe Expressway, Lagos',
    corridor: 'Epe Corridor',
    propertyType: 'plots',
    priceCategory: 'mid',
    status: 'sites',
    statusLabel: 'Phase 1 Open for Allocation',
    badge: 'SITES & LOGISTICS',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFJybpPgCwmC70060FAOx6W8gasmkdrtMlwxj2PGoJw7oxrNmTxqup3kCg2nXnmllOfCIpuGGN_8nSNZpWsjs8OrTydYtvflVMimCEadK6mo882bNthi8-MfQycz4eUJW21YqveTfyuklLXHUUO0z7sgTTrWWf_QUdwWiMf3IQ3zR7wGfd4ibZtjtQkPl-jF9mjbKBLjdSnCXnBZPszZ1nERtE_IeX1ux3tf9716sqUbNHySvrvsPVbA',
    priceDisplay: '₦18,500,000',
    priceSub: 'Per 600 SQM Plot Allocation',
    specs: {
      area: '600 - 2,000 SQM',
      landType: '100% Dry Land',
      titleType: 'C of O Registered'
    },
    summary: 'Commercial and logistics sites with verified C of O, dual-carriageway access, perimeter fencing, and internal drainage.',
    detailedDescription: 'Strategically positioned along the newly dualized Sagamu-Epe Expressway, this master-serviced industrial park serves light manufacturing, cold storage, warehousing, and corporate distribution hubs connecting Lagos with Ogun and regional trade corridors.',
    keyFeatures: [
      '100% Guaranteed Dry Topography (Immediate Building Allocation)',
      'Dual Carriageway Direct Expressway Access',
      'Concrete Open Drainage Network & Heavy Duty Haulage Paving',
      'Perimeter Electric Fencing with Dedicated Patrol Gatehouse',
      'Registered Lagos State Certificate of Occupancy (C of O)'
    ]
  },
  {
    id: 'ahmadu-bello-plaza',
    title: 'Ahmadu Bello Commercial Plaza',
    location: 'Ahmadu Bello Way, Victoria Island',
    corridor: 'Victoria Island',
    propertyType: 'commercial',
    priceCategory: 'high',
    status: 'completed',
    statusLabel: 'Fully Handed Over',
    badge: 'COMMERCIAL PRESTIGE',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABOJR1YJOlLdbob69c45ir5N5sJqaVqjsoudPeslkiBXfdJh8rBnLwtDR1kAZeBDr5cd-OjHZOTsaGXnLrvTtF-YuJvKSf6VyDGjQvhipTwWgpYpqOVyqsCGyk-d0zh8mvuR_sdCarP4fBfKdTJBg53CjWFR0C6ZWdLp2zPZWC0TeUHCYgVVT3P9pCwRHffPh-gElZ4BuLbOeQbHxO_DkTNXOB4SsECBPqBfpJ62eRcL8Ir0WgG5Bkpg',
    priceDisplay: '₦2.4B Deliverable',
    priceSub: 'Turnkey Commercial Contract',
    specs: {
      floors: 7,
      area: 'Grade-A Spec',
      statusLabel: 'Delivered'
    },
    summary: 'Turnkey 7-storey Grade-A corporate complex equipped with acoustic facade and centralized HVAC systems.',
    detailedDescription: 'An institutional landmark in Victoria Island delivered on schedule by Caih Construction. Featuring low-emissivity acoustic glass facade, pressurized fire-escape stairwells, multi-level podium parking, and redundant Cummins generator backup.',
    keyFeatures: [
      '7 Floors of Open-Plan Flexible Executive Office Spaces',
      'Acoustic Double-Glazed Curtain Wall Architecture',
      'Dual High-Speed Mitsubishi Elevators',
      'Dedicated Basement & Surface Parking for 110 Vehicles',
      'Delivered Under Turnkey EPC Institutional Contract'
    ]
  },
  {
    id: 'guzape-ridge-enclave',
    title: 'Guzape Ridge Enclave',
    location: 'Diplomatic Zone, Guzape Hills, Abuja',
    corridor: 'Abuja FCT',
    propertyType: 'residential',
    priceCategory: 'high',
    status: 'civil',
    statusLabel: 'Civil Works in Progress (60%)',
    badge: 'ABUJA DIPLOMATIC',
    image: '/src/assets/images/caih_luxury_residence_1791879278290.jpg',
    priceDisplay: '₦185,000,000',
    priceSub: 'Per Detached Villa Structure',
    specs: {
      beds: 5,
      units: 12,
      area: 'Private Pool & Scenic Terrace',
      titleType: 'FCDA Registered Title'
    },
    summary: 'Hillside executive residences with structural retaining civil works and scenic skyline vistas for 12 detached villas.',
    detailedDescription: 'Guzape Ridge Enclave showcases Caih Construction’s deep geotechnical and hillside retention engineering. Overlooking Abuja’s diplomatic quarter, these 12 multi-level detached mansions incorporate private infinity plunge pools, internal elevators, and bullet-resistant entry systems.',
    keyFeatures: [
      '5 Grand Bedrooms with Panoramic Hilltop Terraces',
      'Reinforced Retaining Wall Civil Engineering by Caih Civil',
      'Private Swimming Pool and Rooftop Entertainment Lounge',
      'Provision for Private In-Home Elevator',
      'High-Security Diplomatic Zone Gated Perimeter'
    ]
  },
  {
    id: 'eleganza-commercial-arcade',
    title: 'Eleganza Commercial Arcade',
    location: 'Eleganza Complex, Lekki Phase 2',
    corridor: 'Lekki Phase 2',
    propertyType: 'commercial',
    priceCategory: 'mid',
    status: 'completed',
    statusLabel: 'Delivered & 100% Sold',
    badge: 'COMMERCIAL ARCADE',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbZafueF0GM26QfOOBSDPvnsyiVV1IgNO-oWj1UlN3XN7ckYTE9y8ilgDcsFvjiCIcIu7suuKkIl5uC3nMHHHCJAR7qisKwK356vfcgUGvctQmmvDAWebqR15Tnv9JveZbNjDhw9Tajzi858bx5Pgv-Ru2rbmkne1-ZIE5ERSKQaCAmiXT0pMfmSqdFj2VdV4Q1MfVK86X4zdPAN7g2iiEWlJn5XyR5RJwWnmQJD0S9APO0Bk-BRBYTA',
    priceDisplay: '14.2% p.a. ROI',
    priceSub: 'Portfolio Yield Performance',
    specs: {
      units: 32,
      yield: '14.2% p.a. Yield',
      statusLabel: '100% Sold'
    },
    summary: 'Retail and office suites comprising 32 modular units with high-capacity interlocked paving and backup solar power.',
    detailedDescription: 'Developed by Caih Properties, this vibrant commercial destination serves over 15,000 residents across the Eleganza Axis. Built with commercial-grade interlocking, 60+ vehicle customer parking, and centralized waste management.',
    keyFeatures: [
      '32 Modular Commercial Suites & Showrooms',
      '60+ Paved Surface Parking Bays',
      'Consistent 14.2% Annualized Rental Yield for Acquirers',
      'Integrated Rooftop Solar Array and Commercial Transformer',
      'Active Facility Management by Caih Group'
    ]
  },
  {
    id: 'caih-central-batching-yard',
    title: 'Caih Central Batching Yard & Plant Hub',
    location: 'Sagamu-Epe Expressway, Ogun/Lagos',
    corridor: 'Epe Corridor',
    propertyType: 'industrial',
    priceCategory: 'high',
    status: 'civil',
    statusLabel: 'Full Production Operation',
    badge: 'CONGLOMERATE INDUSTRIAL ASSET',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCs48nxY5Bktf9Iq6Qg9Zk_lIsoO0MAxRickGvCgfQMdYRq6JXgtnSINNrBvBnpjfR6jhVdiwrQEI5KRR6iR8AewRxj91-R05MvgaliU259GCRDCj8soF-m-QuMlu8VXdx9aYCPMbOq94Z-ptTZx6WIrxeqjE_CQJ7ja_brOAS75Kw0pVqGIPRy3eD0ZeJqrgxdxjo-CrIyvqclkE6gzE_nZHxHQ3YiOflmtXy5VHXF1WmfLDWBajMQtw',
    priceDisplay: 'Central Hub',
    priceSub: 'Strategic Industrial Infrastructure',
    specs: {
      output: '180m³/hr Output',
      landType: 'ISO 9001 Mix',
      statusLabel: 'Active Fleet'
    },
    summary: 'Industrial aggregate & civil resources: 180m³/hr ready-mix facility and structural rebar fabrication serving all regional sites.',
    detailedDescription: 'Operated by Caih Building Resources, our central batching facility guarantees sovereign quality control over raw concrete mixtures, heavy foundation aggregate, and precast beams across all Caih Group active developments.',
    keyFeatures: [
      'Automated 180 Cubic Meters Per Hour Batching Capability',
      'On-Site Laboratory for Compressive Strength Verification',
      'Fleet of 24 Concrete Mixer Trucks & Mobile Boom Pumps',
      'Certified Quarry Aggregate Logistics & Rebar Bending Yards',
      'Dedicated Power Plant for Uninterrupted 24-Hour Production'
    ]
  }
];

export const ARTICLES: Article[] = [
  {
    id: 'why-lekki-phase-2-is-great',
    title: 'Why Lekki Phase 2 is Great for New Homeowners',
    category: 'property-market',
    categoryLabel: 'Property Market',
    readTime: '5 min read',
    date: 'March 2025',
    author: {
      name: 'Olumide Adeleke',
      avatarInitials: 'OA',
      role: 'Senior Real Estate Analyst'
    },
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaspKwS-9-lfkm8UrXHGs0LP0-yQHNTVOhS82m5hholmOgEnoA6tCljQbXGrDFnku0rxHqmgR-n85EN4St9AL0OQxquC714HDx4_1C_3EeSthYmjekcmXol8ZORImvnhHPVsMrFD55YRnGg0Rgu2pARRtSKgeJEpqwbXsEmQtp1XVUkWcp7E2i3btShJn-0IEiwkknUN3nlQph6c5fd1VuJg_PyaUl9cjn_mzBZ-AQInGpMDundR014g',
    excerpt: 'New roads, calm neighborhoods, and better value make Lekki Phase 2 one of the top choices for young families and smart investors looking for long-term comfort in Lagos.',
    content: [
      'The rapid infrastructural expansion along the Lekki-Epe expressway has redefined the property landscape in Lagos. While Lekki Phase 1 has reached density saturation and premium pricing thresholds, Lekki Phase 2 has emerged as the premier corridor for discerning homeowners seeking institutional construction quality paired with sensible entry economics.',
      'Key developmental drivers include expanded drainage networks, uninterrupted arterial road links, and proximity to major educational institutions and commercial hubs like the Eleganza Axis.',
      'For diaspora buyers and local professionals alike, purchasing in gated master-planned communities like Appleton Enclave ensures verified titles, governed facility management, and guaranteed equity growth over a 3 to 5-year investment horizon.'
    ],
    featured: true
  },
  {
    id: 'how-to-buy-land-safely',
    title: 'How to Buy Land or a Home in Lagos Safely',
    category: 'buying-tips',
    categoryLabel: 'Buying Tips',
    readTime: '4 min read',
    date: 'Feb 24, 2025',
    author: {
      name: 'Babatunde Adeyemi',
      avatarInitials: 'BA',
      role: 'Legal Title Consultant'
    },
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnCZB9i3w6wY-79yplV3BsnJQDGuaMW_2RVge11NiznHJ0gZBg2H0evgEFiVqefXkN_OIoHKsj7Q7JoznSh9aVpvOpBqiVcnO9XLSj4o5XPoTheHl7SwR9ut_ABTGZi6NNeVMCUkyHvtn7dFoOlBPRoqXujhCc3513EwGwSwvjmBvOzD1XS7KuATqeuoF4239gBuJXTm9V3RAO_cm0mdQz2AIGfEvOkp8oqzoqLeZ5solI12E7kxsbvg',
    excerpt: 'Everything first-time buyers need to know before putting money down on any property.',
    content: [
      'Property acquisitions in Lagos require rigorous legal due diligence. The cornerstone of a bulletproof transaction is verifying the land classification at the Lagos State Lands Bureau in Alausa.',
      'Never rely on word of mouth or informal community agreements. Always demand certified true copies of the Governor’s Consent or Certificate of Occupancy (C of O), and ensure coordinate verification through a licensed surveyor.',
      'At Caih Group, all our residential estates and industrial plots undergo sovereign title validation before site breaking, protecting purchasers from disputes or government acquisition.'
    ]
  },
  {
    id: 'inside-appleton-enclave',
    title: 'Inside Our Appleton Enclave Homes',
    category: 'building-news',
    categoryLabel: 'Building News',
    readTime: '3 min read',
    date: 'Feb 10, 2025',
    author: {
      name: 'Engr. Kayode Olorunfemi',
      avatarInitials: 'KO',
      role: 'Managing Director & CEO'
    },
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQFVnucLIm-ylRks1q-oJmkfjCSWQkqu0SbAXDSeBHCvkAvOuUuloq0DGnEAXBQsfCbRCoqNyEnpvHd6MXFWLl7AWkoNW8fVL24Hu_YDpi0TDnd_9O-Zug0oNt7zasWW6-Y9JFcTMKgWrkle0bVMAaZEUESNR170shFXLDaDI8NHn_EYzP1mLwU7gmW_KFc99reOp2Am4GiNtwV_eyO8Hd1iP1JPj5WAPzCDoIP7LFmBYCzJ0v6rwpFQ',
    excerpt: 'Take a peek at recent building progress, floor layouts, and our expected handover dates.',
    content: [
      'Construction at Appleton Enclave Phase I & II has crossed key structural milestones. Our civil engineering teams have finalized reinforced slab casting and are currently advancing internal mechanical, electrical, and plumbing (MEP) installations.',
      'Our architectural design prioritizes cross-ventilation, generous ceiling clearance (3.2m), and dedicated conduit infrastructure for smart home automation.',
      'Deliveries remain strictly on schedule for Q4 2025 handovers, backed by our milestone-linked escrow commitment to all enrolled subscribers.'
    ]
  },
  {
    id: 'three-steps-check-documents',
    title: '3 Easy Steps to Check Property Documents',
    category: 'buying-tips',
    categoryLabel: 'Buying Tips',
    readTime: '4 min read',
    date: 'Jan 28, 2025',
    author: {
      name: 'Folashade Balogun',
      avatarInitials: 'FB',
      role: 'Investment Advisor'
    },
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnCZB9i3w6wY-79yplV3BsnJQDGuaMW_2RVge11NiznHJ0gZBg2H0evgEFiVqefXkN_OIoHKsj7Q7JoznSh9aVpvOpBqiVcnO9XLSj4o5XPoTheHl7SwR9ut_ABTGZi6NNeVMCUkyHvtn7dFoOlBPRoqXujhCc3513EwGwSwvjmBvOzD1XS7KuATqeuoF4239gBuJXTm9V3RAO_cm0mdQz2AIGfEvOkp8oqzoqLeZ5solI12E7kxsbvg',
    excerpt: 'A simple checklist on how Governor’s Consent and land titles protect your investment.',
    content: [
      'Step 1: Check the Survey Charting. Obtain the survey coordinates and verify with the office of the Surveyor General that the land does not fall within committed agricultural, coastal, or road expansion gazettes.',
      'Step 2: Inspect the Root of Title. Ascertain whether the developer possesses a registered Deed of Assignment, Governor’s Consent, or Certificate of Occupancy.',
      'Step 3: Confirm Developer Escrow Terms. Reputable developers link payments directly to verifiable construction stages, providing transparency and eliminating project abandonment risks.'
    ]
  }
];

export const VIDEO_DISPATCHES: VideoDispatch[] = [
  {
    id: 'vid-1',
    title: 'Appleton Court Terraces: Structural Framing Progress',
    tag: 'ON-SITE WALKTHROUGH',
    duration: '04:18',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-TtZKs-Lllm8g6mv2-yEl_ctQvGvdiG9YNnUjabjGVJj90WF-Mnlm_hauqg31WmikIHOjUuDwEhWtQC8FugSfEULm6nf9ZLE3153GSjQ-DnObvPpXuO7DlV9EMLQfwImZ7DVSBNfkc1fTXqkYxEt3PX5wUBIE9DE0XXA8dZMrfom9X6hOYFIioIO9pbhHHFf4MZ8yDj2VWQS5W-3MugQztiWlI3t2xjBk9Fdj6U1tpdbyM-iqL_XvLQ',
    description: 'Engr. Babatunde leads a live walkthrough of concrete curing, high-tensile rebar ties, and subsurface drainage at Appleton Court.',
    speaker: 'Engr. Babatunde (Project Lead)'
  },
  {
    id: 'vid-2',
    title: '"Why I Confidently Sell Caih Properties to Diaspora Clients"',
    tag: 'PARTNER TESTIMONIAL',
    duration: '02:45',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIZX-GtV7PL9YNIuRnz8QSjetUCdIP53G0dDbYnRb4MJltVUEe0IlKCn6O8knvX-j7WdyYNtHnmo9rL6JeGelZEoCZ6jVXJVqVSZqzwgUgRV6zCI-hxU4_o52FvwzHZyW9jD9mOuyaMxhHNmCqEzDozV9AvTv9QAYnLcVQJl0fYzJ-vGrymxnsLVFy5EWJHS0Dly3nw9fHmVTKsWI3MuHoJk3BUNTuUzU04eqcf5pU6ME2gNgNnuv5Tw',
    description: 'Folashade Balogun, Apex Haven Realty, breaks down documentation transparency, escrow security, and prompt title issuance.',
    speaker: 'Folashade Balogun (Apex Haven Realty)'
  },
  {
    id: 'vid-3',
    title: 'Epe Gateway: Industrial Infrastructure Growth Blueprint',
    tag: 'MACRO LOGISTICS',
    duration: '06:12',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFJybpPgCwmC70060FAOx6W8gasmkdrtMlwxj2PGoJw7oxrNmTxqup3kCg2nXnmllOfCIpuGGN_8nSNZpWsjs8OrTydYtvflVMimCEadK6mo882bNthi8-MfQycz4eUJW21YqveTfyuklLXHUUO0z7sgTTrWWf_QUdwWiMf3IQ3zR7wGfd4ibZtjtQkPl-jF9mjbKBLjdSnCXnBZPszZ1nERtE_IeX1ux3tf9716sqUbNHySvrvsPVbA',
    description: 'Evaluating dual carriageway connectivity, dry logistics opportunities, and deep sea port proximity along the Epe economic corridor.',
    speaker: 'Caih Group Logistics Directorate'
  }
];

export const EXECUTIVES: Executive[] = [
  {
    name: 'Engr. Kayode Olorunfemi',
    role: 'Managing Director & CEO',
    credentials: 'B.Eng, MSc, PMP, MNSE, COREN',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbzgcEVVeCtlWvZcmgNavHXtESSrbMtcrBOHRM4rg6wF9I23odahAPjtrEW6YfodVNbYsr-vhNw0aYjO7itufjZn8CQryyh5aEwZ9YnB2nPLUbN2GglwNytP5fKrCrTQDYIkNM1SMz-tjS-9oBn4j9u3BbaJi3HfwluRlJ8KRR1rsOhc9fMOH97hV_GhIfQCwT7EhoiBbFsIrR1V074eUPBFh1hJC_COAyy4PPLuuJEv2iIKSnAJt_OmCxNuG2XcNtLMM',
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

export const TESTIMONIALS = [
  {
    name: 'Maria Analia',
    role: 'Homeowner • Appleton Court',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBv99vS-UWLjYv9FMokxKVOkk4I1NsMHJ70LxoQXrb3auHR1FaETG2lw_cL-HQ8ncVyqdovzdeoptev0iNlvJr8DkxIpJ145NuGyfp0thcfLAVY_h6-BMYxuxTI-koxCMGMOIQqDwrpbOFQiZExCMdiynEWdJa9FCjz12wZ_vbS84TDn8kR7H15L7rzosJbg2fCv53swcEVxfVTMITGXy_j9RJ7EnimH4NIkkquuKEL6Pex527HPwU8vw',
    quote: 'Investing in Appleton Court off-plan was one of our best financial decisions in Lagos. Caih Group stuck religiously to their construction timeline and their structural finishing is pristine.'
  },
  {
    name: 'Dr. Emmanuel Olugbenga',
    role: 'Investor • UK Diaspora Syndicate',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCFdzODji4ZKbu4_Cci9uzE_D4RyaVCiRdqHOiwQAv2nI9ftfSweVGp-FP4U6W2cXU66NN4RSBRWY7ZyGqZCzcbPGELbC-445rmmm0NwtIDfGBeK12XtZhWCUQudnpqb6GS9RuDvGHQb2i3HxSqKP3vP57xV9p-X5yHzLjcPUG3uOKzqI6eq3AIC6lae3jwv1coi21Bsjzdk988llFllmJgJbBl74jdsHRC79p4p34rirE8F_tjy6dRg',
    quote: 'As a diaspora buyer, trusting local building contractors was a major anxiety. Caih Construction delivered live video milestones and delivered on budget with zero unexpected additions.'
  },
  {
    name: 'Tunde Bakare',
    role: 'Procurement Lead • Apex Logistics',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHavURfztIrSqr_5BZcf8LwmuDqOP4S3ZCLWBKKm0FuVAjHRF1UAJnnMAo5NshjIZtRiVJj_QbT-IB8t0im85Gmvm1GrRHk0o3fzCck5RxxuO8_sxxCkD5VHTAGt8KR8iJMrMejF3f3XMRN9PtzlymfSbTfyAJQ_coDqZhkR1fnAQVUsTvlTsRt_cQGlORvxP0PBmYhmNSmsXeKED8QTkAqvBps38Q2cBo3mnSoewbs9gruaqJSizYNQ',
    quote: 'The machinery and steel supplied by Caih Resources for our Lekki commercial warehouse project kept our engineers uninterrupted. Their logistical readiness in Lagos is unmatched.'
  }
];
