import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Add new public pages here as the redesign introduces them.
export default function sitemap(): MetadataRoute.Sitemap {
	return [{ url: siteUrl, changeFrequency: "weekly", priority: 1 }];
}
