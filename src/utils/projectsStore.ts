import { Project } from '../types';
import { PROJECTS as DEFAULT_PROJECTS } from '../data/mockData';

const STORAGE_KEY = 'caih_admin_projects';

export const getStoredProjects = (): Project[] => {
  if (typeof window === 'undefined') return DEFAULT_PROJECTS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse stored projects:', e);
  }
  // Initialize with DEFAULT_PROJECTS if nothing is saved
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROJECTS));
  } catch {}
  return DEFAULT_PROJECTS;
};

export const saveStoredProjects = (projects: Project[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    window.dispatchEvent(
      new CustomEvent('caih_projects_updated', {
        detail: projects,
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
  saveStoredProjects(updated);
  return updated;
};

export const deleteStoredProject = (id: string): Project[] => {
  const current = getStoredProjects();
  const updated = current.filter((p) => p.id !== id);
  saveStoredProjects(updated);
  return updated;
};
