// Centralized Vite-bundled image asset resolver.
// Ensures all /images/* and legacy filenames resolve reliably in both Vite dev and Vercel production builds.

const bundledModules = import.meta.glob('../assets/images/*.{jpg,jpeg,png,webp,svg}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const filenameToAssetUrl: Record<string, string> = {};
const assetUrlToFilename: Record<string, string> = {};
for (const [modulePath, assetUrl] of Object.entries(bundledModules)) {
  const filename = modulePath.split('/').pop();
  if (filename && assetUrl) {
    filenameToAssetUrl[filename] = assetUrl;
    filenameToAssetUrl[filename.toLowerCase()] = assetUrl;
    assetUrlToFilename[assetUrl] = filename;
  }
}

const LEGACY_FILENAME_ALIASES: Record<string, string> = {
  'PHOTO-2025-01-14-10-40-55 (1) (1).jpg': 'appleton_haven_main.jpg',
  'PHOTO-2025-01-14-10-40-55 (2).jpg': 'appleton_haven_facade.jpg',
  'IMG_4378.jpg': 'appleton_apartments_main.jpg',
  'IMG_3535 (1).jpg': 'appleton_terraces_exterior.jpg',
  'IMG_3525 (1).jpg': 'IMG_3525.jpg',
  'commercial-e1770636774756.jpeg': 'appleton_commercial_main.jpg',
  'IMG-20260919-WA0004 (1).jpg': 'testimonial-handover-1.jpg',
  'IMG-20260919-WA0005 (1).jpg': 'testimonial-handover-2.jpg',
  'IMG-20260919-WA0006.jpg': 'testimonial-handover-3.jpg',
  'appleton_gardens_hero_1792572091394.jpg': 'appleton_gardens_hero.jpg',
  'appleton_gardens_greenery_1792572132717.jpg': 'appleton_gardens_greenery.jpg',
};

function findBundledByPossibleHashedName(rawName: string): string | undefined {
  if (!rawName) return undefined;
  const decoded = decodeURIComponent(rawName.split('?')[0]);
  if (filenameToAssetUrl[decoded]) return filenameToAssetUrl[decoded];
  if (filenameToAssetUrl[decoded.toLowerCase()]) return filenameToAssetUrl[decoded.toLowerCase()];

  // Match Vite build hashed filename pattern e.g. appleton_haven_main-CwYom9Yj.jpg
  const hashMatch = decoded.match(/^(.+?)-[A-Za-z0-9_-]{6,12}(\.[a-zA-Z0-9]+)$/);
  if (hashMatch) {
    const cleanName = `${hashMatch[1]}${hashMatch[2]}`;
    const aliased = LEGACY_FILENAME_ALIASES[cleanName] || cleanName;
    return filenameToAssetUrl[aliased] || filenameToAssetUrl[aliased.toLowerCase()];
  }
  return undefined;
}

/**
 * Converts ephemeral Vite build `/assets/...-<hash>.ext` URLs back into stable
 * `/images/<filename>.ext` paths before storing in Supabase / localStorage, while
 * preserving HTTPS URLs (e.g. Supabase Storage), data URIs, and `/images/...` paths.
 */
export function normalizeImageForStorage(src?: string): string {
  if (!src) return '';
  const trimmed = src.trim();
  if (!trimmed) return '';

  if (
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://')
  ) {
    return trimmed;
  }

  if (assetUrlToFilename[trimmed]) {
    return `/images/${assetUrlToFilename[trimmed]}`;
  }

  if (trimmed.startsWith('/assets/')) {
    const rawName = trimmed.replace(/^\/assets\//, '').split('?')[0];
    const hashMatch = rawName.match(/^(.+?)-[A-Za-z0-9_-]{6,12}(\.[a-zA-Z0-9]+)$/);
    if (hashMatch) {
      const cleanName = `${hashMatch[1]}${hashMatch[2]}`;
      if (filenameToAssetUrl[cleanName] || filenameToAssetUrl[cleanName.toLowerCase()]) {
        return `/images/${cleanName}`;
      }
    }
    if (filenameToAssetUrl[rawName] || filenameToAssetUrl[rawName.toLowerCase()]) {
      return `/images/${rawName}`;
    }
  }

  return trimmed;
}

export function resolveImageAsset(src?: string, fallback?: string): string {
  if (!src) {
    return fallback ? resolveImageAsset(fallback) : (filenameToAssetUrl['appleton_court_aerial_clean.jpg'] || '/images/appleton_court_aerial_clean.jpg');
  }

  const trimmed = src.trim();
  if (!trimmed) {
    return fallback ? resolveImageAsset(fallback) : (filenameToAssetUrl['appleton_court_aerial_clean.jpg'] || '/images/appleton_court_aerial_clean.jpg');
  }

  // Data URIs and blob URLs render directly
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  // Handle Vite-bundled `/assets/...` URLs: return live match or rescue outdated build hashes
  if (trimmed.startsWith('/assets/')) {
    if (assetUrlToFilename[trimmed]) {
      return trimmed;
    }
    const rawName = trimmed.replace(/^\/assets\//, '');
    const rescued = findBundledByPossibleHashedName(rawName);
    if (rescued) return rescued;
    return trimmed;
  }

  // Handle legacy caihgroup.com WordPress upload URLs by mapping their filename
  if (trimmed.includes('caihgroup.com/wp-content/')) {
    const rawName = decodeURIComponent(trimmed.split('?')[0].split('/').pop() || '');
    const aliased = LEGACY_FILENAME_ALIASES[rawName] || rawName;
    if (filenameToAssetUrl[aliased]) return filenameToAssetUrl[aliased];
    if (filenameToAssetUrl[aliased.toLowerCase()]) return filenameToAssetUrl[aliased.toLowerCase()];
    if (trimmed.toLowerCase().includes('haven')) return filenameToAssetUrl['appleton_haven_main.jpg'] || trimmed;
    if (trimmed.toLowerCase().includes('apartment') || trimmed.toLowerCase().includes('maisonnette')) return filenameToAssetUrl['appleton_apartments_main.jpg'] || trimmed;
    if (trimmed.toLowerCase().includes('terrace')) return filenameToAssetUrl['appleton_terraces_exterior.jpg'] || trimmed;
    if (trimmed.toLowerCase().includes('commercial')) return filenameToAssetUrl['appleton_commercial_main.jpg'] || trimmed;
    if (trimmed.toLowerCase().includes('enclave')) return filenameToAssetUrl['appleton_enclave_entrance.jpg'] || trimmed;
    if (trimmed.toLowerCase().includes('garden')) return filenameToAssetUrl['appleton_gardens_hero.jpg'] || trimmed;
    return fallback ? resolveImageAsset(fallback) : (filenameToAssetUrl['appleton_court_aerial_clean.jpg'] || '/images/appleton_court_aerial_clean.jpg');
  }

  // Handle local /images/... or relative images/... paths
  if (trimmed.startsWith('/images/') || trimmed.startsWith('images/')) {
    const rawPath = trimmed.replace(/^\/?images\//, '').split('?')[0];
    let decodedName = rawPath;
    try {
      decodedName = decodeURIComponent(rawPath);
    } catch {
      decodedName = rawPath;
    }
    const aliased = LEGACY_FILENAME_ALIASES[decodedName] || LEGACY_FILENAME_ALIASES[rawPath] || decodedName;
    if (filenameToAssetUrl[aliased]) return filenameToAssetUrl[aliased];
    if (filenameToAssetUrl[aliased.toLowerCase()]) return filenameToAssetUrl[aliased.toLowerCase()];
    // If file is only in public/images (not bundled), return cleanly encoded path
    return `/images/${encodeURI(aliased)}`;
  }

  return trimmed;
}

export const BUNDLED_LOGO = filenameToAssetUrl['Caih-group.png'] || '/images/Caih-group.png';
export const BUNDLED_ICON = filenameToAssetUrl['cropped-Caih-icon-270x270.png'] || '/images/cropped-Caih-icon-270x270.png';
export const BUNDLED_HERO_IMAGE = filenameToAssetUrl['caih_luxury_residence_1791879278290.jpg'] || '/images/caih_luxury_residence_1791879278290.jpg';
export const BUNDLED_DEFAULT_COURT = filenameToAssetUrl['appleton_court_aerial_clean.jpg'] || '/images/appleton_court_aerial_clean.jpg';
