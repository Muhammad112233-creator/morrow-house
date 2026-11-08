const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** Prefix public-file paths for GitHub Pages project sites and leave local paths untouched. */
export function assetPath(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalized}`;
}
