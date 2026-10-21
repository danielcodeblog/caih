import { Project } from '../types';
import { PROJECTS as DEFAULT_PROJECTS } from '../data/mockData';
import { getPropertyOrderRank, sortProjectsByCanonicalOrder } from './propertyOrdering';

export { getPropertyOrderRank, sortProjectsByCanonicalOrder };

const STORAGE_KEY = 'caih_admin_projects';

export const getStoredProjects = (): Project[] => {
  if (typeof window === 'undefined') return sortProjectsByCanonicalOrder(DEFAULT_PROJECTS);
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const existingIds = new Set(parsed.map((p: Project) => p.id));
        const missing = DEFAULT_PROJECTS.filter((p) => !existingIds.has(p.id));
        const merged = missing.length > 0 ? [...parsed, ...missing] : parsed;
        const sorted = sortProjectsByCanonicalOrder(merged);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
        return sorted;
      }
    }
  } catch (e) {
    console.warn('Failed to parse stored projects:', e);
  }
  // Initialize default projects in storage with canonical order
  const defaultSorted = sortProjectsByCanonicalOrder(DEFAULT_PROJECTS);
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
