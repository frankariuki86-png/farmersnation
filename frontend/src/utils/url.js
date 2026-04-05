export const getBackendOrigin = () => {
  const rawApiBase = process.env.REACT_APP_API_URL;
  const isBrowser = typeof window !== 'undefined';
  const host = isBrowser ? window.location.hostname : '';
  const isLocalHost = host === 'localhost' || host === '127.0.0.1';
  const fallbackApi = isLocalHost ? 'http://localhost:5000/api' : 'https://farmersnation.onrender.com/api';
  const apiBase = rawApiBase
    ? (rawApiBase.trim().replace(/\/+$/, '').match(/\/api$/i)
      ? rawApiBase.trim().replace(/\/+$/, '')
      : `${rawApiBase.trim().replace(/\/+$/, '')}/api`)
    : fallbackApi;
  return apiBase.replace(/\/api\/?$/, '');
};

export const getAssetUrl = (assetPath) => {
  if (!assetPath) return '';

  const backendOrigin = getBackendOrigin();
  const normalizedInput = String(assetPath).trim().replace(/\\/g, '/');

  if (!normalizedInput) return '';

  // If a localhost URL was saved in DB, rewrite it to the configured backend origin.
  if (/^https?:\/\//i.test(normalizedInput)) {
    try {
      const parsed = new URL(normalizedInput);
      const isLocalHost = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
      if (isLocalHost) {
        return `${backendOrigin}${parsed.pathname}`;
      }
      return normalizedInput;
    } catch (error) {
      return normalizedInput;
    }
  }

  // Handle legacy paths such as /api/uploads/... or api/uploads/...
  let normalizedPath = normalizedInput.replace(/^\/api(?=\/uploads\/)/i, '');
  normalizedPath = normalizedPath.replace(/^api(?=\/uploads\/)/i, '');

  // If path contains /uploads somewhere in the middle, keep canonical uploads segment.
  const uploadsIndex = normalizedPath.toLowerCase().indexOf('/uploads/');
  if (uploadsIndex > 0) {
    normalizedPath = normalizedPath.slice(uploadsIndex);
  }

  if (!normalizedPath.startsWith('/')) {
    normalizedPath = `/${normalizedPath}`;
  }

  return `${backendOrigin}${normalizedPath}`;
};
