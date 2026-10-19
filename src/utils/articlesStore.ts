import { Article } from '../types';
import { ARTICLES } from '../data/articles';

export const getStoredArticles = (): Article[] => {
  const saved = localStorage.getItem('caih_admin_articles');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {}
  }
  return ARTICLES;
};

export const saveStoredArticles = (articles: Article[]) => {
  localStorage.setItem('caih_admin_articles', JSON.stringify(articles));
};
