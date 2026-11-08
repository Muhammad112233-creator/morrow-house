const [owner = "", repository = ""] = (process.env.GITHUB_REPOSITORY || "").split("/");
const isUserOrOrgSite = repository === `${owner}.github.io`;
const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === "true";
const basePath = isGitHubPagesBuild && repository && !isUserOrOrgSite ? `/${repository}` : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permit the Arena live-preview host to load Next.js development/HMR resources.
  allowedDevOrigins: ["3000-i6nc8iw21ip8a9a2zjm4i.e2b.app"],
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
