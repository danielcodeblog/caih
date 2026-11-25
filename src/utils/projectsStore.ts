import { Project } from '../types';
import { PROJECTS as DEFAULT_PROJECTS } from '../data/mockData';
import { getPropertyOrderRank, sortProjectsByCanonicalOrder } from './propertyOrdering';
import { resolveImageAsset } from './imageAssets';

import havenImg from '../assets/images/appleton_haven_main.jpg';
import apartmentsImg from '../assets/images/appleton_apartments_main.jpg';
import enclaveImg from '../assets/images/appleton_enclave_entrance.jpg';
import commercialImg from '../assets/images/appleton_commercial_main.jpg';
import gardensImg from '../assets/images/appleton_gardens_hero.jpg';
import courtImg from '../assets/images/appleton_court_aerial_clean.jpg';
import terracesImg from '../assets/images/appleton_terraces_exterior.jpg';

export { getPropertyOrderRank, sortProjectsByCanonicalOrder };

const STORAGE_KEY = 'caih_admin_projects_v6';

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

const isLegacyBrokenImage = (img: string): boolean => {
  return (
    img.includes('caihgroup.com') ||
    img.includes('SL-070720') ||
    img.includes('ApartmentMaisonnette') ||
    img.includes('commercial-e1770636774756') ||
    (img.startsWith('/images/') && img.includes('(1)'))
  );
};

export const resolveProjectImage = (img?: string, projId: string = ''): string => {
  const canonical = projId ? PROJECT_CANONICAL_IMAGES[projId] : undefined;
  const fallback = canonical || getProjectFallbackImage(projId);
  if (!img || !img.trim()) return fallback;

  const trimmed = img.trim();
  if (canonical && isLegacyBrokenImage(trimmed)) {
    return canonical;
  }

  return resolveImageAsset(trimmed, fallback);
};

export function sanitizeProjectImages(p: Project): Project {
  const canonical = PROJECT_CANONICAL_IMAGES[p.id];
  const fallback = canonical || getProjectFallbackImage(p.id);
  const image = resolveProjectImage(p.image, p.id);

  let galleryImages = Array.isArray(p.galleryImages) ? p.galleryImages.filter(Boolean) : [];
  const allLegacyBroken =
    galleryImages.length > 0 && galleryImages.every((g) => isLegacyBrokenImage(g));

  if (galleryImages.length === 0 || allLegacyBroken) {
    if (p.id === 'appleton-haven') {
      galleryImages = [
        image || havenImg,
        resolveImageAsset('/images/appleton_haven_facade.jpg'),
        apartmentsImg,
        resolveImageAsset('/images/IMG_4379.jpg'),
        resolveImageAsset('/images/IMG_3523.jpg'),
        resolveImageAsset('/images/IMG_3525.jpg')
      ];
    } else if (p.id === 'appleton-luxury-apartments') {
      galleryImages = [
        image || apartmentsImg,
        resolveImageAsset('/images/IMG_4379.jpg'),
        resolveImageAsset('/images/IMG_4380.jpg'),
        resolveImageAsset('/images/IMG_4381.jpg'),
        resolveImageAsset('/images/IMG_4382.jpg'),
        resolveImageAsset('/images/IMG_3523.jpg')
      ];
    } else if (p.id === 'appleton-terraces-and-apartments') {
      galleryImages = [
        image || terracesImg,
        resolveImageAsset('/images/caih_luxury_residence_1791879278290.jpg'),
        resolveImageAsset('/images/IMG_3525.jpg'),
        resolveImageAsset('/images/appleton_court_exterior_real.jpg')
      ];
    } else if (p.id === 'appleton-commercial-residential') {
      galleryImages = [
        image || commercialImg,
        resolveImageAsset('/images/regenerated_image_1791992702647.png'),
        resolveImageAsset('/images/regenerated_image_1791992506306.png')
      ];
    } else if (p.id === 'appleton-gardens') {
      galleryImages = [
        image || gardensImg,
        resolveImageAsset('/images/appleton_gardens_greenery.jpg'),
        enclaveImg
      ];
    } else if (p.id === 'appleton-court') {
      galleryImages = [
        image || courtImg,
        resolveImageAsset('/images/appleton_court_exterior_real.jpg'),
        resolveImageAsset('/images/appleton_court_interior_living.jpg'),
        resolveImageAsset('/images/appleton_court_interior_stairs.jpg'),
        resolveImageAsset('/images/testimonial-handover-1.jpg'),
        resolveImageAsset('/images/testimonial-handover-2.jpg'),
        resolveImageAsset('/images/testimonial-handover-3.jpg')
      ];
    } else if (p.id === 'appleton-enclave') {
      galleryImages = [
        image || enclaveImg,
        resolveImageAsset('/images/yt_ihEzpBhqRjY.jpg')
      ];
    } else {
      galleryImages = [image].filter(Boolean) as string[];
    }
  } else {
    galleryImages = galleryImages
      .map((g) => (isLegacyBrokenImage(g) ? fallback : resolveImageAsset(g, fallback)))
      .filter(Boolean);
  }

  // Deduplicate gallery images while keeping primary order
  const uniqueGallery = Array.from(new Set(galleryImages));

  return {
    ...p,
    image,
    galleryImages: uniqueGallery
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
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
        } catch {}
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
  const sorted = sortProjectsByCanonicalOrder(projects.map(sanitizeProjectImages));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
  } catch (e) {
    console.warn('Failed to save stored projects to localStorage (quota or privacy mode):', e);
  }
  window.dispatchEvent(
    new CustomEvent('caih_projects_updated', {
      detail: sorted,
    })
  );
};

export const addOrUpdateProject = (project: Project): Project[] => {
  const sanitizedProject = sanitizeProjectImages(project);
  const current = getStoredProjects();
  const exists = current.some((p) => p.id === sanitizedProject.id);
  const updated = exists
    ? current.map((p) => (p.id === sanitizedProject.id ? sanitizedProject : p))
    : [sanitizedProject, ...current];
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
