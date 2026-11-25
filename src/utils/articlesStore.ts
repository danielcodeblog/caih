import { Article } from '../types';
import { ARTICLES as DEFAULT_ARTICLES } from '../data/articles';
import { resolveImageAsset } from './imageAssets';

const STORAGE_KEY = 'caih_admin_articles';
const DELETED_KEY = 'caih_admin_deleted_articles';

export const sanitizeArticleImages = (article: Article): Article => ({
  ...article,
  image: resolveImageAsset(article.image),
});

export const getDeletedArticleIds = (): Set<string> => {
  if (typeof window === 'undefined') return new Set();
  try {
    const saved = localStorage.getItem(DELETED_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return new Set(parsed);
    }
  } catch {}
  return new Set();
};

export const getStoredArticles = (): Article[] => {
  if (typeof window === 'undefined') return DEFAULT_ARTICLES.map(sanitizeArticleImages);
  const deletedIds = getDeletedArticleIds();
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.filter((a) => !deletedIds.has(a.id)).map(sanitizeArticleImages);
      }
    }
  } catch (e) {
    console.warn('Failed to parse stored articles:', e);
  }
  // Initialize default articles in storage excluding deleted ones
  const filteredDefaults = DEFAULT_ARTICLES.filter((a) => !deletedIds.has(a.id)).map(sanitizeArticleImages);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredDefaults));
  } catch {}
  return filteredDefaults;
};

export const saveStoredArticles = (articles: Article[]): void => {
  if (typeof window === 'undefined') return;
  const sanitized = articles.map(sanitizeArticleImages);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
  } catch (e) {
    console.warn('Failed to save stored articles to localStorage:', e);
  }
  window.dispatchEvent(
    new CustomEvent('caih_articles_updated', {
      detail: sanitized,
    })
  );
};

export const addOrUpdateArticle = (article: Article): Article[] => {
  const sanitized = sanitizeArticleImages(article);
  if (typeof window !== 'undefined') {
    const deleted = getDeletedArticleIds();
    if (deleted.has(sanitized.id)) {
      deleted.delete(sanitized.id);
      try {
        localStorage.setItem(DELETED_KEY, JSON.stringify(Array.from(deleted)));
      } catch {}
    }
  }
  const current = getStoredArticles();
  const exists = current.some((a) => a.id === sanitized.id);
  const updated = exists
    ? current.map((a) => (a.id === sanitized.id ? sanitized : a))
    : [sanitized, ...current];
  saveStoredArticles(updated);
  return updated;
};

export const deleteStoredArticle = (id: string): Article[] => {
  if (typeof window !== 'undefined') {
    const deleted = getDeletedArticleIds();
    deleted.add(id);
    try {
      localStorage.setItem(DELETED_KEY, JSON.stringify(Array.from(deleted)));
    } catch {}
  }
  const current = getStoredArticles();
  const updated = current.filter((a) => a.id !== id);
  saveStoredArticles(updated);
  return updated;
};

