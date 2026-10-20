import { Article } from '../types';
import { ARTICLES as DEFAULT_ARTICLES } from '../data/articles';

const STORAGE_KEY = 'caih_admin_articles';

export const getStoredArticles = (): Article[] => {
  if (typeof window === 'undefined') return DEFAULT_ARTICLES;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse stored articles:', e);
  }
  // Initialize default articles in storage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ARTICLES));
  } catch {}
  return DEFAULT_ARTICLES;
};

export const saveStoredArticles = (articles: Article[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
    window.dispatchEvent(
      new CustomEvent('caih_articles_updated', {
        detail: articles,
      })
    );
  } catch (e) {
    console.warn('Failed to save stored articles:', e);
  }
};

export const addOrUpdateArticle = (article: Article): Article[] => {
  const current = getStoredArticles();
  const exists = current.some((a) => a.id === article.id);
  const updated = exists
    ? current.map((a) => (a.id === article.id ? article : a))
    : [article, ...current];
  saveStoredArticles(updated);
  return updated;
};

export const deleteStoredArticle = (id: string): Article[] => {
  const current = getStoredArticles();
  const updated = current.filter((a) => a.id !== id);
  saveStoredArticles(updated);
  return updated;
};
