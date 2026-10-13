export type PageId = 'home' | 'about-us' | 'projects' | 'blog' | 'project-detail' | 'video-detail' | 'realtor-registration';

export interface Project {
  id: string;
  title: string;
  location: string;
  corridor: 'Lekki Phase 2' | 'Ajah' | 'Epe Corridor' | 'Victoria Island' | 'Abuja FCT';
  propertyType: 'residential' | 'commercial' | 'plots' | 'industrial';
  priceCategory: 'deposit' | 'mid' | 'high';
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
  startingDeposit?: string;
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
