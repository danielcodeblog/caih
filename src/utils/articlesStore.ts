import { Article } from '../types';
import { ARTICLES as DEFAULT_ARTICLES } from '../data/articles';

const STORAGE_KEY = 'caih_admin_articles';
const DELETED_KEY = 'caih_admin_deleted_articles';

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
  if (typeof window === 'undefined') return DEFAULT_ARTICLES;
  const deletedIds = getDeletedArticleIds();
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.filter((a) => !deletedIds.has(a.id));
      }
    }
  } catch (e) {
    console.warn('Failed to parse stored articles:', e);
  }
  // Initialize default articles in storage excluding deleted ones
  const filteredDefaults = DEFAULT_ARTICLES.filter((a) => !deletedIds.has(a.id));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredDefaults));
  } catch {}
  return filteredDefaults;
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
  if (typeof window !== 'undefined') {
    const deleted = getDeletedArticleIds();
    if (deleted.has(article.id)) {
      deleted.delete(article.id);
      localStorage.setItem(DELETED_KEY, JSON.stringify(Array.from(deleted)));
    }
  }
  const current = getStoredArticles();
  const exists = current.some((a) => a.id === article.id);
  const updated = exists
    ? current.map((a) => (a.id === article.id ? article : a))
    : [article, ...current];
  saveStoredArticles(updated);
  return updated;
};

export const deleteStoredArticle = (id: string): Article[] => {
  if (typeof window !== 'undefined') {
    const deleted = getDeletedArticleIds();
    deleted.add(id);
    localStorage.setItem(DELETED_KEY, JSON.stringify(Array.from(deleted)));
  }
  const current = getStoredArticles();
  const updated = current.filter((a) => a.id !== id);
  saveStoredArticles(updated);
  return updated;
};

