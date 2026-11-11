import { Project } from '../types';
import { PROJECTS as DEFAULT_PROJECTS } from '../data/mockData';
import { getPropertyOrderRank, sortProjectsByCanonicalOrder } from './propertyOrdering';

import havenImg from '../assets/images/appleton_haven_main.jpg';
import apartmentsImg from '../assets/images/appleton_apartments_main.jpg';
import enclaveImg from '../assets/images/appleton_enclave_entrance.jpg';
import commercialImg from '../assets/images/appleton_commercial_main.jpg';
import gardensImg from '../assets/images/appleton_gardens_hero.jpg';
import courtImg from '../assets/images/appleton_court_aerial_clean.jpg';
import terracesImg from '../assets/images/appleton_terraces_exterior.jpg';

export { getPropertyOrderRank, sortProjectsByCanonicalOrder };

const STORAGE_KEY = 'caih_admin_projects_v5';

export const PROJECT_CANONICAL_IMAGES: Record<string, string> = {
  'appleton-haven': havenImg,
  'appleton-luxury-apartments': apartmentsImg,
  'appleton-enclave': enclaveImg,
  'appleton-commercial-residential': commercialImg,
  'appleton-gardens': gardensImg,
  'appleton-court': courtImg,
  'appleton-terraces-and-apartments': terracesImg
};

export const getProjectFallbackImage = (projId: string): string => {
  const id = (projId || '').toLowerCase();
  if (id.includes('haven')) return havenImg;
  if (id.includes('terrace')) return terracesImg;
  if (id.includes('luxury') || id.includes('apartment') || id.includes('maisonette')) return apartmentsImg;
  if (id.includes('commercial')) return commercialImg;
  if (id.includes('enclave')) return enclaveImg;
  if (id.includes('garden')) return gardensImg;
  return courtImg;
};

export const resolveProjectImage = (img?: string, projId: string = ''): string => {
  const canonical = projId ? PROJECT_CANONICAL_IMAGES[projId] : undefined;
  if (canonical) {
    if (
      !img ||
      img.includes('caihgroup.com') ||
      img.includes('PHOTO-2025') ||
      img.includes('(1)') ||
      img.includes('SL-070720') ||
      img.includes('ApartmentMaisonnette') ||
      img.includes('commercial-e1770636774756') ||
      img.includes('IMG_4378') ||
      img.startsWith('/images/appleton_') ||
      img.startsWith('/images/')
    ) {
      return canonical;
    }
  }
  if (!img) return getProjectFallbackImage(projId);
  if (img.includes('caihgroup.com/wp-content') || img.includes('(1)')) {
    return getProjectFallbackImage(projId);
  }
  return img;
};

export function sanitizeProjectImages(p: Project): Project {
  const canonical = PROJECT_CANONICAL_IMAGES[p.id];
  let image = canonical || getProjectFallbackImage(p.id);

  let galleryImages = p.galleryImages;
  if (!galleryImages || galleryImages.length === 0 || galleryImages.some((g) => g.includes('caihgroup.com/wp-content') || g.includes('(1)'))) {
    if (p.id === 'appleton-haven') {
      galleryImages = [
        havenImg,
        '/images/appleton_haven_facade.jpg',
        apartmentsImg,
        '/images/IMG_4379.jpg',
        '/images/IMG_3523.jpg',
        '/images/IMG_3525.jpg'
      ];
    } else if (p.id === 'appleton-luxury-apartments') {
      galleryImages = [
        apartmentsImg,
        '/images/IMG_4379.jpg',
        '/images/IMG_4380.jpg',
        '/images/IMG_4381.jpg',
        '/images/IMG_4382.jpg',
        '/images/IMG_3523.jpg'
      ];
    } else if (p.id === 'appleton-terraces-and-apartments') {
      galleryImages = [
        terracesImg,
        '/images/caih_luxury_residence_1791879278290.jpg',
        '/images/IMG_3525.jpg',
        '/images/appleton_court_exterior_real.jpg'
      ];
    } else if (p.id === 'appleton-commercial-residential') {
      galleryImages = [
        commercialImg,
        '/images/regenerated_image_1791992702647.png',
        '/images/regenerated_image_1791992506306.png'
      ];
    } else if (p.id === 'appleton-gardens') {
      galleryImages = [
        gardensImg,
        '/images/appleton_gardens_greenery.jpg',
        enclaveImg
      ];
    } else if (p.id === 'appleton-court') {
      galleryImages = [
        courtImg,
        '/images/appleton_court_exterior_real.jpg',
        '/images/appleton_court_interior_living.jpg',
        '/images/appleton_court_interior_stairs.jpg'
      ];
    } else if (p.id === 'appleton-enclave') {
      galleryImages = [
        enclaveImg,
        '/images/yt_ihEzpBhqRjY.jpg'
      ];
    } else {
      galleryImages = [image].filter(Boolean) as string[];
    }
  }

  return {
    ...p,
    image,
    galleryImages
  };
}

export const getStoredProjects = (): Project[] => {
  if (typeof window === 'undefined') return sortProjectsByCanonicalOrder(DEFAULT_PROJECTS).map(sanitizeProjectImages);
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const existingIds = new Set(parsed.map((p: Project) => p.id));
        const missing = DEFAULT_PROJECTS.filter((p) => !existingIds.has(p.id));
        const merged = missing.length > 0 ? [...parsed, ...missing] : parsed;
        const sanitized = merged.map(sanitizeProjectImages);
        const sorted = sortProjectsByCanonicalOrder(sanitized);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
        return sorted;
      }
    }
  } catch (e) {
    console.warn('Failed to parse stored projects:', e);
  }
  // Initialize default projects in storage with canonical order
  const defaultSanitized = DEFAULT_PROJECTS.map(sanitizeProjectImages);
  const defaultSorted = sortProjectsByCanonicalOrder(defaultSanitized);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSorted));
  } catch {}
  return defaultSorted;
};

export const saveStoredProjects = (projects: Project[]): void => {
  if (typeof window === 'undefined') return;
  try {
    const sorted = sortProjectsByCanonicalOrder(projects);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
    window.dispatchEvent(
      new CustomEvent('caih_projects_updated', {
        detail: sorted,
      })
    );
  } catch (e) {
    console.warn('Failed to save stored projects:', e);
  }
};

export const addOrUpdateProject = (project: Project): Project[] => {
  const current = getStoredProjects();
  const exists = current.some((p) => p.id === project.id);
  const updated = exists
    ? current.map((p) => (p.id === project.id ? project : p))
    : [project, ...current];
  const sorted = sortProjectsByCanonicalOrder(updated);
  saveStoredProjects(sorted);
  return sorted;
};

export const deleteStoredProject = (id: string): Project[] => {
  const current = getStoredProjects();
  const updated = current.filter((p) => p.id !== id);
  const sorted = sortProjectsByCanonicalOrder(updated);
  saveStoredProjects(sorted);
  return sorted;
};
