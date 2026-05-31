import type { MetadataRoute } from "next";

import { site } from "@/content/site";
import { vans } from "@/content/vans";

/** Public routes only — /admin, /build, /api are intentionally excluded. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const routes = [
    "",
    "/about",
    "/configure",
    "/contact",
    "/creators",
    "/events",
    "/process",
    "/tax-benefits",
    "/technology",
    "/vans",
    ...vans.map((v) => `/vans/${v.slug}`),
  ];
  return routes.map((path) => ({
    url: `${base}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
