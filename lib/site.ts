// Canonical public URL, used for metadata (Open Graph, sitemap, robots).
// Set NEXT_PUBLIC_SITE_URL in production; previews fall back to localhost.
export const siteUrl = (
	// `||`, not `??`: an empty value copied from .env.example must fall back too.
	process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");
