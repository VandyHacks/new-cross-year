// Canonical public URL, used for metadata (Open Graph, sitemap, robots).
// Set NEXT_PUBLIC_SITE_URL in production; previews fall back to localhost.
export const siteUrl = (
	// `||`, not `??`: an empty value copied from .env.example must fall back too.
	process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");

// Search engines are kept out until launch: set ALLOW_INDEXING=true in the
// production env (and redeploy) to let the site be indexed. Read at build time.
export const allowIndexing = process.env.ALLOW_INDEXING === "true";
