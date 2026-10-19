import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PROJECTS, VIDEO_DISPATCHES } from '../data/mockData';

export function SeoManager() {
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    let title = 'CaihGroup – Property | Resources | Construction';
    let description =
      'We take the stress off our customers by providing them a professionally tailored solution to their building, construction, housing and metal fabrication needs within time and budget.';

    if (pathname === '/') {
      title = 'CaihGroup – Property | Resources | Construction';
      description =
        'We take the stress off our customers by providing them a professionally tailored solution to their building, construction, housing and metal fabrication needs within time and budget.';
    } else if (pathname === '/projects') {
      title = 'Projects – CaihGroup';
      description =
        'Explore verified residential developments, site & services, and prime estates by Caih Properties across Lagos and Nigeria.';
    } else if (pathname.startsWith('/projects/')) {
      const slug = pathname.replace('/projects/', '').trim();
      const project =
        PROJECTS.find((p) => p.id === slug) ||
        PROJECTS.find((p) => p.unitsOrPlots?.some((u) => u.id === slug));

      if (project) {
        if (project.id === 'appleton-court') {
          title = 'Appleton Court Finished Projects – CaihGroup';
          description =
            'Appleton Court is a carefully designed estate providing homes and not just houses to our esteemed subscribers. A gated estate in Ajiwe, Ajah, Lekki corridor.';
        } else if (project.id === 'appleton-terraces-and-apartments') {
          title = 'Appleton Terraces and Apartments – CaihGroup';
          description = `${project.title}: ${project.summary || 'Luxury terraces and apartments'}. Located in ${project.location}. Premium residential development.`;
        } else {
          title = `${project.title} – CaihGroup`;
          description = `${project.title}: ${project.summary || ''}. Located in ${project.location}.`;
        }
      } else {
        title = 'Projects – CaihGroup';
      }
    } else if (pathname.startsWith('/video/')) {
      const vidId = pathname.replace('/video/', '').trim();
      const video = VIDEO_DISPATCHES.find((v) => v.id === vidId);
      if (video) {
        title = `${video.title} – CaihGroup`;
        description = video.description;
      }
    } else if (pathname.startsWith('/blog')) {
      title = 'Blog – CaihGroup';
      description =
        'Latest updates, infrastructure insights, real estate investment guides, and development intelligence from CaihGroup.';
    } else if (pathname === '/about-us') {
      title = 'About Us – CaihGroup';
      description =
        'We take the stress off our customers by providing them a professionally tailored solution to their building, construction, housing and metal fabrication needs within time and budget.';
    } else if (pathname === '/realtor-registration') {
      title = 'Realtor Registration – CaihGroup';
      description =
        'Register as an accredited realtor with CaihGroup to unlock prime developer allocations, verified documentation, and instant commission payouts.';
    } else if (pathname === '/contact') {
      title = 'Contact Us – CaihGroup';
      description =
        'Contact CaihGroup: NO. 5 Chief Ganiu Enitan Olugborangan layout, Eleganza Bus stop, Lagos, Nigeria. Phone: 0906 688 7444. Email: info@caihgroup.com.';
    }

    // Update document title
    document.title = title;

    // Helper to update meta tag content
    const setMetaTag = (selector: string, attr: string, value: string) => {
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement('meta');
        if (selector.startsWith('meta[name="')) {
          const name = selector.match(/name="([^"]+)"/)?.[1];
          if (name) tag.setAttribute('name', name);
        } else if (selector.startsWith('meta[property="')) {
          const prop = selector.match(/property="([^"]+)"/)?.[1];
          if (prop) tag.setAttribute('property', prop);
        }
        document.head.appendChild(tag);
      }
      tag.setAttribute(attr, value);
    };

    setMetaTag('meta[name="description"]', 'content', description);
    setMetaTag('meta[property="og:title"]', 'content', title);
    setMetaTag('meta[property="og:description"]', 'content', description);
    setMetaTag('meta[property="og:url"]', 'content', window.location.href);
    setMetaTag('meta[name="twitter:title"]', 'content', title);
    setMetaTag('meta[name="twitter:description"]', 'content', description);

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.href);
  }, [pathname]);

  return null;
}
