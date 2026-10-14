import { Project, VideoDispatch, Executive } from '../types';

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
    title: 'Appleton Enclave',
    location: 'Idera Scheme, Eleko, Lagos',
    corridor: 'Idera',
    propertyType: 'plots',
    priceCategory: 'mid',
    status: 'ongoing',
    statusLabel: 'Selling Fast',
    badge: 'APPLETON ENCLAVE',
    secondaryBadge: 'IDERA SCHEME',
    image: '/images/appleton_enclave_entrance.jpg',
    galleryImages: ['/images/appleton_enclave_entrance.jpg'],
    priceDisplay: 'From ₦35m',
    priceSub: '300 sqm & 500 sqm serviced plots',
    paymentType: 'Direct Allocation',
    handoverDate: 'Immediate Physical Allocation',
    specs: {
      area: '300 sqm – 500 sqm',
      landType: '100% Dry Table Land',
      titleType: 'Governor’s Consent'
    },
    summary: 'Master-planned serviced residential land in the high-growth Idera Scheme, Eleko, featuring 100% dry topography, perimeter fencing, and verified Governor’s Consent.',
    detailedDescription: 'Appleton Enclave offers premium serviced land within the planned Idera Scheme corridor. Featuring verified Governor’s Consent titles, 100% dry table topography requiring zero sand-filling, perimeter gatehouse security, paved internal access networks, and instant survey beacon pegging upon plot allocation.',
    keyFeatures: [
      '100% Dry Table Land Topography (Zero Sand-Filling Required)',
      'Direct Certified Governor’s Consent Title',
      'Gated Perimeter Fencing with 24/7 Monitored Access Gate',
      'Paved Internal Access Roads & Central Storm Drainage',
      'Solar Street Lighting & Central Utility Right-of-Way',
      'Instant Physical Allocation & Cadastral Beacon Demarcation'
    ],
    unitsOrPlots: [
      {
        id: 'appleton-enclave-300',
        name: '300 sqm Serviced Residential Plot',
        size: '300 sqm',
        priceDisplay: '₦35m',
        priceSub: '300 sqm Serviced Plot',
        paymentType: 'Direct Allocation',
        landType: '100% Dry Table Land',
        titleType: 'Governor’s Consent',
        isPopular: true,
        features: [
          '100% Dry Table Ground',
          'Direct Paved Road Frontage',
          'Instant Survey Beacon Pegging',
          'Governor’s Consent Title'
        ],
        description: 'Prime dry residential land plot with clear boundary coordinates and instant deed of assignment execution.'
      },
      {
        id: 'appleton-enclave-500',
        name: '500 sqm Standard Serviced Plot',
        size: '500 sqm',
        priceDisplay: '₦55m',
        priceSub: '500 sqm Standard Plot',
        paymentType: 'Direct Allocation',
        landType: '100% Dry Table Land',
        titleType: 'Governor’s Consent',
        isPopular: false,
        features: [
          'Expansive 500 sqm Dry Topography',
          'Corner Plot Coordinates Available',
          'Perimeter Fenced Estate Boundary',
          'Immediate Physical Demarcation'
        ],
        description: 'Generously proportioned standard serviced plot with maximum road frontage and verified sovereign title.'
      }
    ]
  },
  {
    id: 'appleton-commercial-residential',
    title: 'Appleton (Commercial & Residential)',
    location: 'Dangote Refinery Corridor, Lagos',
    corridor: 'Dangote Refinery Axis',
    propertyType: 'plots',
    priceCategory: 'high',
    status: 'upcoming',
    statusLabel: 'Available for Allocation',
    badge: 'COMMERCIAL & RESIDENTIAL',
    secondaryBadge: 'DANGOTE REFINERY AXIS',
    image: '/images/regenerated_image_1791992702647.png',
    galleryImages: ['/images/regenerated_image_1791992702647.png'],
    priceDisplay: 'From ₦95m',
    priceSub: '1,000 sqm – 3,000 sqm development parcels',
    paymentType: 'Direct Allocation',
    handoverDate: 'Immediate Physical Allocation',
    specs: {
      area: '1,000 – 3,000 sqm',
      landType: 'Heavy-Duty Dry Ground',
      titleType: 'Governor’s Consent'
    },
    summary: 'Strategic mixed-use development land parcels along the booming Dangote Refinery and Lekki Free Zone economic corridor.',
    detailedDescription: 'Appleton Commercial & Residential offers unmatched strategic placement along the high-growth Dangote Refinery axis. Featuring high-load bearing dry land, certified Governor’s Consent titles, dual-access heavy duty roadways, and versatile zoning for commercial and residential developments.',
    keyFeatures: [
      'Strategic Frontage on Dangote Refinery / Lekki Free Zone Corridor',
      'Dual-Access Heavy-Duty Paved Roadways',
      'High-Load Bearing 100% Dry Ground Topography',
      'Certified Governor’s Consent Sovereign Title',
      'Flexible Mixed-Use (Commercial & Residential) Zoning Approval',
      'Immediate Physical Allocation & Beacon Inscription'
    ],
    unitsOrPlots: [
      {
        id: 'appleton-comm-res-1000',
        name: '1,000 sqm Commercial / Residential Plot',
        size: '1,000 sqm',
        priceDisplay: '₦95m',
        priceSub: '1,000 sqm Parcel',
        paymentType: 'Direct Allocation',
        landType: 'Heavy-Duty Dry Land',
        titleType: 'Governor’s Consent',
        isPopular: true,
        features: [
          'Dual Mixed-Use Zoning',
          'Direct Corridor Road Frontage',
          '100% Dry Table Topography',
          'Clear Governor’s Consent Title'
        ],
        description: 'Strategically located development land parcel along the high-traffic commercial refinery corridor.'
      },
      {
        id: 'appleton-comm-res-2000',
        name: '2,000 sqm Strategic Development Parcel',
        size: '2,000 sqm',
        priceDisplay: '₦190m',
        priceSub: '2,000 sqm Strategic Parcel',
        paymentType: 'Direct Allocation',
        landType: 'Heavy-Duty Dry Land',
        titleType: 'Governor’s Consent',
        isPopular: false,
        features: [
          'Dual-Frontage Corridor Access',
          'Heavy-Load Bearing Soil',
          'Central Drainage Reticulation',
          'Immediate Survey Demarcation'
        ],
        description: 'Substantial commercial land parcel with wide frontage and excellent access infrastructure.'
      },
      {
        id: 'appleton-comm-res-3000',
        name: '3,000 sqm Landmark Commercial Parcel',
        size: '3,000 sqm',
        priceDisplay: '₦285m',
        priceSub: '3,000 sqm Landmark Parcel',
        paymentType: 'Direct Allocation',
        landType: 'Heavy-Duty Dry Land',
        titleType: 'Governor’s Consent',
        isPopular: false,
        features: [
          'Corner Landmark Visibility',
          'Dedicated Power Substation Corridor',
          'Maximum Frontage Geometry',
          'Instant Deed of Assignment'
        ],
        description: 'Expansive signature land parcel with prime positioning for high-capacity corporate and commercial undertakings.'
      }
    ]
  },
  {
    id: 'appleton-haven',
    title: 'Appleton Haven',
    location: 'Victoria Island (VI), Lagos',
    corridor: 'Victoria Island',
    propertyType: 'residential',
    priceCategory: 'high',
    status: 'ongoing',
    statusLabel: 'Under Construction',
    badge: 'APPLETON HAVEN',
    secondaryBadge: 'VICTORIA ISLAND LUXURY',
    image: '/images/IMG_4380.JPG',
    galleryImages: [
      '/images/IMG_4380.JPG',
      '/images/IMG_4379.JPG',
      '/images/IMG_4378.JPG',
      '/images/IMG_4382.JPG',
      '/images/IMG_4381.JPG'
    ],
    priceDisplay: 'From ₦450m',
    priceSub: '2, 3 & 4-Bedroom Luxury Residences',
    paymentType: 'Direct Allocation',
    handoverDate: 'Q3 2026',
    specs: {
      beds: 2,
      baths: 3,
      area: '180 – 480 Sq. M',
      titleType: 'Governor’s Consent'
    },
    summary: 'Ultra-luxurious residential tower and maisonettes in Victoria Island, featuring private cinema suites, biometric access, and panoramic views.',
    detailedDescription: 'Appleton Haven defines prime metropolitan living in Victoria Island (VI), Lagos. Handcrafted with bespoke Italian kitchens, soaring ceilings, acoustic cinema spaces, and full hotel-grade concierge amenities.',
    keyFeatures: [
      'Prime Victoria Island (VI) Waterfront / Cityscape Views',
      'Private In-Home Acoustic Cinema & En-Suite BQ',
      'Full Smart Home Automation & Biometric Security',
      'Infinity Pool, Fully Equipped Gym & Private Resident Lounge',
      '24/7 Redundant Power & Solar Hybrid System',
      'Guaranteed Allocation with Certified Title Deed'
    ],
    unitsOrPlots: [
      {
        id: 'appleton-haven-2bed',
        name: '2-Bedroom Luxury Residence',
        size: '180 Sq. M',
        priceDisplay: '₦450m',
        priceSub: '180 Sq. M Luxury Residence',
        paymentType: 'Direct Allocation',
        beds: 2,
        baths: 3,
        titleType: 'Governor’s Consent',
        isPopular: true,
        features: ['All En-Suite Bedrooms', 'Fitted Designer Kitchen', 'Balcony with VI Views', 'Smart Automation'],
        description: 'Sophisticated 2-bedroom apartment with open living, custom fixtures, and smart home automation.'
      },
      {
        id: 'appleton-haven-3bed',
        name: '3-Bedroom Residence + BQ & Private Cinema',
        size: '320 Sq. M',
        priceDisplay: '₦750m',
        priceSub: '320 Sq. M + Private Cinema',
        paymentType: 'Direct Allocation',
        beds: 3,
        baths: 4,
        titleType: 'Governor’s Consent',
        isPopular: false,
        features: ['Private Acoustic Cinema Room', 'Dedicated Maid’s BQ', 'Dual Parking Bays', 'Italian Fitted Kitchen'],
        description: 'Opulent residence complete with sound-insulated cinema, large terrace, and separate staff quarters.'
      },
      {
        id: 'appleton-haven-4bed',
        name: '4-Bedroom Multi-Level Maisonette + BQ',
        size: '480 Sq. M',
        priceDisplay: '₦1.4bn',
        priceSub: '480 Sq. M Multi-Level Maisonette',
        paymentType: 'Direct Allocation',
        beds: 4,
        baths: 5,
        titleType: 'Governor’s Consent',
        isPopular: false,
        features: ['Double-Volume Soaring Ceilings', 'Private Elevator Access Option', 'Rooftop Terrace', 'Panoramic Skyline Views'],
        description: 'The pinnacle of architectural grandeur with panoramic Lagos skyline views and private elevator.'
      }
    ]
  },
  {
    id: 'appleton-court',
    title: 'Appleton Court Terraces',
    location: 'Akachukwu Street, Lekki, Lagos',
    corridor: 'Akachukwu Street',
    propertyType: 'residential',
    priceCategory: 'high',
    status: 'ongoing',
    statusLabel: 'Under Construction',
    badge: 'APPLETON COURT',
    secondaryBadge: 'AKACHUKWU STREET • TERRACES',
    image: '/images/Caih-Properties-Home.jpg',
    galleryImages: ['/images/Caih-Properties-Home.jpg'],
    priceDisplay: 'From ₦280m',
    priceSub: '4-Bedroom Luxury Terraces',
    paymentType: 'Direct Allocation',
    handoverDate: 'Q2 2026',
    specs: {
      beds: 4,
      baths: 5,
      area: '240 – 280 Sq. M',
      titleType: 'Governor’s Consent'
    },
    summary: 'Contemporary 4-bedroom luxury terraces with maid’s room, private study, and rooftop patio on quiet Akachukwu Street.',
    detailedDescription: 'Appleton Court Terraces on Akachukwu Street offers modern architectural elegance in an established Lekki neighborhood. Built with high-spec structural engineering, private backyards, and dedicated parking.',
    keyFeatures: [
      'Serene Residential Pocket on Akachukwu Street, Lekki',
      'All 4 Bedrooms En-Suite with Maid’s Quarters (BQ)',
      'Custom Kitchen with High-end Integrated Appliances',
      '24/7 Monitored Estate Security & Dedicated Transformer',
      'Governor’s Consent Title with Verified Survey',
      'Prompt Allocation with Title Deed Execution'
    ],
    unitsOrPlots: [
      {
        id: 'appleton-court-4bed-std',
        name: '4-Bedroom Standard Luxury Terrace + BQ',
        size: '240 Sq. M',
        priceDisplay: '₦280m',
        priceSub: '240 Sq. M Terrace',
        paymentType: 'Direct Allocation',
        beds: 4,
        baths: 5,
        titleType: 'Governor’s Consent',
        isPopular: true,
        features: ['All 4 Bedrooms En-suite', 'Maid’s Quarters (BQ)', '2 Dedicated Parking Bays', 'Private Backyard'],
        description: 'Generously proportioned multi-level terrace home with master suite and private backyard.'
      },
      {
        id: 'appleton-court-4bed-corner',
        name: '4-Bedroom Corner Terrace + BQ & Extended Garden',
        size: '280 Sq. M',
        priceDisplay: '₦310m',
        priceSub: '280 Sq. M Corner Terrace',
        paymentType: 'Direct Allocation',
        beds: 4,
        baths: 5,
        titleType: 'Governor’s Consent',
        isPopular: false,
        features: ['Extended Corner Garden', 'Extra Natural Sunlight', '3 Dedicated Parking Bays', 'En-suite BQ'],
        description: 'Corner unit terrace providing extra privacy, large landscaped side lawn, and extra parking.'
      }
    ]
  }
];


export const VIDEO_DISPATCHES: VideoDispatch[] = [
  {
    id: 'vid-1',
    title: 'Appleton Court Terraces: Structural Framing Progress (Akachukwu Street)',
    tag: 'ON-SITE WALKTHROUGH',
    duration: '04:18',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-TtZKs-Lllm8g6mv2-yEl_ctQvGvdiG9YNnUjabjGVJj90WF-Mnlm_hauqg31WmikIHOjUuDwEhWtQC8FugSfEULm6nf9ZLE3153GSjQ-DnObvPpXuO7DlV9EMLQfwImZ7DVSBNfkc1fTXqkYxEt3PX5wUBIE9DE0XXA8dZMrfom9X6hOYFIioIO9pbhHHFf4MZ8yDj2VWQS5W-3MugQztiWlI3t2xjBk9Fdj6U1tpdbyM-iqL_XvLQ',
    description: 'Engr. Babatunde leads a live walkthrough of concrete curing, high-tensile rebar ties, and subsurface drainage at Appleton Court, Akachukwu Street.',
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
    role: 'Homeowner • Appleton Court, Akachukwu Street',
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
