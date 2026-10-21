import { Project } from '../types';

/**
 * Returns canonical sorting rank for Caih Group properties according to business priority:
 * 1. Appleton Haven
 * 2. Appleton Apartment (Appleton Apartments & Maisonette)
 * 3. Appleton Enclave
 * 4. Commercial (Appleton Commercial & Residences)
 * 5. Gardens (Appleton Gardens)
 * Followed by legacy/sold-out estates:
 * 6. Appleton Court
 * 7. Appleton Terraces and Apartments
 */
export const getPropertyOrderRank = (p: Project | { id?: string; title?: string }): number => {
  const id = (p.id || '').toLowerCase();
  const title = (p.title || '').toLowerCase();

  // 1. Appleton Haven
  if (id === 'appleton-haven' || title.includes('haven')) return 1;

  // 2. Appleton Apartment (Appleton Apartments & Maisonette)
  if (
    id === 'appleton-luxury-apartments' ||
    id === 'appleton-apartment' ||
    id === 'appleton-apartments' ||
    (title.includes('appleton') && title.includes('apartment') && !title.includes('terrace'))
  ) {
    return 2;
  }

  // 3. Appleton Enclave
  if (id === 'appleton-enclave' || title.includes('enclave')) return 3;

  // 4. Commercial (Appleton Commercial & Residences)
  if (
    id === 'appleton-commercial-residential' ||
    id.includes('commercial') ||
    title.includes('commercial')
  ) {
    return 4;
  }

  // 5. Gardens (Appleton Gardens)
  if (id === 'appleton-gardens' || title.includes('garden')) return 5;

  // 6. Other legacy/sold-out properties
  if (id === 'appleton-court' || title.includes('court')) return 6;
  if (id === 'appleton-terraces-and-apartments' || title.includes('terrace')) return 7;

  return 100;
};

export const sortProjectsByCanonicalOrder = <T extends Project>(
  projects: T[]
): T[] => {
  return [...projects].sort((a, b) => getPropertyOrderRank(a) - getPropertyOrderRank(b));
};
