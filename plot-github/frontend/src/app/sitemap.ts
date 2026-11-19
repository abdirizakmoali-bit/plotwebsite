import { getPosts } from "@/lib/insights";
export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
export default function sitemap():MetadataRoute.Sitemap {
 return ["", "/services", "/qiyaas", "/projects", "/plots", "/buy", "/process", "/about", "/contact", "/privacy", "/insights", ...getPosts().map(p => "/insights/" + p.slug)].map(path=>({url:`${siteUrl}${path}`,changeFrequency:"monthly" as const,priority:path===""?1:0.7}));
}
