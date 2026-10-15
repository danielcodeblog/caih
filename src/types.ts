export type PageId = 'home' | 'about-us' | 'projects' | 'blog' | 'project-detail' | 'video-detail' | 'realtor-registration' | 'contact';

export interface ProjectUnit {
  id: string;
  name: string;
  size?: string;
  priceDisplay: string;
  priceSub?: string;
  paymentType?: string;
  deposit?: string;
  beds?: number;
  baths?: number;
  landType?: string;
  titleType?: string;
  isPopular?: boolean;
  features?: string[];
  description?: string;
}

export interface Project {
  id: string;
  title: string;
  location: string;
  corridor: 'Idera' | 'Victoria Island' | 'Dangote Refinery Axis' | 'Ibeju-Lekki' | 'Akachukwu Street' | 'Lekki Phase 2' | 'Ajah' | 'Epe Corridor' | 'Victoria Island' | 'Abuja FCT' | string;
  propertyType: 'residential' | 'commercial' | 'plots' | 'industrial';
  priceCategory: 'mid' | 'high';
  status: 'upcoming' | 'ongoing' | 'completed' | 'sites' | 'civil';
  statusLabel: string;
  badge?: string;
  secondaryBadge?: string;
  image: string;
  priceDisplay: string;
  priceSub: string;
  specs: {
    beds?: number;
    baths?: number;
    area?: string;
    floors?: number;
    units?: number;
    yield?: string;
    output?: string;
    landType?: string;
    titleType?: string;
    statusLabel?: string;
  };
  summary: string;
  detailedDescription: string;
  keyFeatures: string[];
  handoverDate?: string;
  paymentType?: string;
  startingDeposit?: string;
  unitsOrPlots?: ProjectUnit[];
  galleryImages?: string[];
}

export interface Article {
  id: string;
  title: string;
  category: 'buying-tips' | 'building-news' | 'property-market';
  categoryLabel: string;
  readTime: string;
  date: string;
  author: {
    name: string;
    avatarInitials: string;
    role?: string;
  };
  image: string;
  excerpt: string;
  content: string[];
  sections?: {
    heading: string;
    paragraphs: string[];
    keyPoints?: string[];
  }[];
  keyTakeaways?: string[];
  featured?: boolean;
}

export interface VideoDispatch {
  id: string;
  title: string;
  tag: string;
  duration: string;
  thumbnail: string;
  description: string;
  speaker: string;
}

export interface Executive {
  name: string;
  role: string;
  credentials: string;
  image: string;
  bio?: string;
}

export interface InspectionBooking {
  fullName: string;
  phoneNumber: string;
  email: string;
  targetProject: string;
  preferredDate: string;
}

export interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  pillar: string;
  projectOrSector: string;
  location: string;
  verifiedBadge: string;
  rating: number;
  headline: string;
  quote: string;
}
