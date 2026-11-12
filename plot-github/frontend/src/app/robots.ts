export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
export default function robots():MetadataRoute.Robots {
 const ready=Boolean(process.env.NEXT_PUBLIC_SITE_URL);
 return {rules:{userAgent:"*",[ready?"allow":"disallow"]:"/"},sitemap:ready?`${siteUrl}/sitemap.xml`:undefined};
}
