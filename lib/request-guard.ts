import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";

// Abuse checks shared by the public forms and the admin sign-in form.

export const TURNSTILE_FIELD = "cf-turnstile-response";
// Cloudflare documents tokens as at most 2048 characters.
const TURNSTILE_MAX = 2048;

// The leftmost X-Forwarded-For entry is whatever the client sent, so trusting
// it would let a bot pick a fresh rate-limit bucket per request. Prefer the
// header your edge sets and overwrites (CLIENT_IP_HEADER, e.g.
// `cf-connecting-ip` behind Cloudflare), then platform headers, then the
// entry appended by the nearest proxy.
export async function clientIp() {
	const h = await headers();
	const trusted = process.env.CLIENT_IP_HEADER;
	return (
		(trusted ? h.get(trusted)?.trim() : undefined) ||
		h.get("x-nf-client-connection-ip") ||
		h.get("x-real-ip") ||
		h.get("x-forwarded-for")?.split(",").at(-1)?.trim() ||
		"unknown"
	);
}

let warnedNoSalt = false;

// Salted, truncated SHA-256. Used for IPs (rate limiting) and, on the admin
// sign-in form, for emails, so neither is stored in the clear.
export function hashValue(value: string) {
	if (!process.env.IP_HASH_SALT && !warnedNoSalt) {
		warnedNoSalt = true;
		console.warn(
			"IP_HASH_SALT is not set: stored hashes are unsalted and reversible.",
		);
	}
	return createHash("sha256")
		.update(`${process.env.IP_HASH_SALT ?? ""}:${value}`)
		.digest("hex")
		.slice(0, 32);
}

let warnedTurnstile = false;

// Turnstile is enforced only when BOTH keys are set: the site key renders the
// widget (it is inlined into the browser bundle at build time) and the secret
// verifies its token. With just the secret, no visitor could ever get a token
// and every submission would fail, so a half-configured deploy is treated as
// "off" and logged instead.
export async function passesTurnstile(formData: FormData, ip: string) {
	const secret = process.env.TURNSTILE_SECRET_KEY;
	const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
	if (!secret || !siteKey) {
		if (process.env.NODE_ENV === "production" && !warnedTurnstile) {
			warnedTurnstile = true;
			console.warn(
				secret || siteKey
					? "Only one Turnstile key is set: set both NEXT_PUBLIC_TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY, then rebuild. Turnstile is OFF until then."
					: "Turnstile keys are not set: forms rely on the honeypot and rate limits only.",
			);
		}
		return true;
	}
	const value = formData.get(TURNSTILE_FIELD);
	const token = typeof value === "string" ? value : "";
	if (!token || token.length > TURNSTILE_MAX) return false;
	try {
		const response = await fetch(
			"https://challenges.cloudflare.com/turnstile/v0/siteverify",
			{
				method: "POST",
				signal: AbortSignal.timeout(8000),
				body: new URLSearchParams({
					secret,
					response: token,
					...(ip !== "unknown" ? { remoteip: ip } : {}),
				}),
			},
		);
		const result = (await response.json()) as { success?: boolean };
		return result.success === true;
	} catch (error) {
		console.error("Turnstile verification failed", error);
		return false;
	}
}
