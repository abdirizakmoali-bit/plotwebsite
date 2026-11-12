export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
export default function sitemap():MetadataRoute.Sitemap {
 return ["", "/services", "/projects", "/process", "/about", "/contact", "/privacy"].map(path=>({url:`${siteUrl}${path}`,changeFrequency:"monthly" as const,priority:path===""?1:0.7}));
}
