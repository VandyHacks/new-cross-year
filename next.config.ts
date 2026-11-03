import type { NextConfig } from "next";

// Baseline security headers for every route. A full script/style CSP is left
// out on purpose: the WebGL hero, Turnstile and inline styles would each need
// carve-outs. `frame-ancestors` alone blocks clickjacking of /admin.
const securityHeaders = [
	{ key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
	{ key: "X-Frame-Options", value: "DENY" },
	{ key: "X-Content-Type-Options", value: "nosniff" },
	{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
	{
		key: "Permissions-Policy",
		value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
	},
	{
		key: "Strict-Transport-Security",
		value: "max-age=63072000; includeSubDomains",
	},
];

const nextConfig: NextConfig = {
	poweredByHeader: false,
	async headers() {
		return [{ source: "/:path*", headers: securityHeaders }];
	},
};

export default nextConfig;
