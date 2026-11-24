import type { MetadataRoute } from "next";
import { allowIndexing, siteUrl } from "@/lib/site";

// Crawling stays allowed even while the site is hidden: the noindex header and
// meta tag only work if crawlers can fetch the page and see them.
export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: ["/admin", "/auth"],
		},
		...(allowIndexing ? { sitemap: `${siteUrl}/sitemap.xml` } : {}),
	};
}
