export const getBackendOrigin = () => {
  const rawApiBase = process.env.REACT_APP_API_URL;
  const apiBase = rawApiBase
    ? (rawApiBase.trim().replace(/\/+$/, '').match(/\/api$/i)
      ? rawApiBase.trim().replace(/\/+$/, '')
      : `${rawApiBase.trim().replace(/\/+$/, '')}/api`)
    : 'http://localhost:5000/api';
  return apiBase.replace(/\/api\/?$/, '');
};

export const getAssetUrl = (assetPath) => {
  if (!assetPath) return '';

  if (/^https?:\/\//i.test(assetPath)) {
    return assetPath;
  }

  const normalizedPath = assetPath.startsWith('/') ? assetPath : `/${assetPath}`;
  return `${getBackendOrigin()}${normalizedPath}`;
};
