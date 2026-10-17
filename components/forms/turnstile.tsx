"use client";

import { useEffect, useRef } from "react";

declare global {
	interface Window {
		turnstile?: {
			render: (
				element: HTMLElement,
				options: { sitekey: string; theme?: string },
			) => string;
			reset: (widgetId?: string) => void;
			remove: (widgetId?: string) => void;
		};
	}
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_SRC =
	"https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let scriptPromise: Promise<void> | null = null;
function loadScript() {
	scriptPromise ??= new Promise((resolve, reject) => {
		const script = document.createElement("script");
		script.src = SCRIPT_SRC;
		script.async = true;
		script.onload = () => resolve();
		script.onerror = () => reject(new Error("Turnstile failed to load"));
		document.head.appendChild(script);
	});
	return scriptPromise;
}

// Renders a Cloudflare Turnstile widget (which injects the hidden
// `cf-turnstile-response` input into the surrounding form). Renders nothing
// unless NEXT_PUBLIC_TURNSTILE_SITE_KEY is set. `resetSignal` changes after
// each submission so the single-use token is refreshed.
export default function Turnstile({
	active,
	resetSignal,
}: {
	active: boolean;
	resetSignal: unknown;
}) {
	const containerRef = useRef<HTMLDivElement>(null);
	const widgetId = useRef<string | undefined>(undefined);

	useEffect(() => {
		if (!SITE_KEY || !active) return;
		let cancelled = false;
		loadScript()
			.then(() => {
				const container = containerRef.current;
				if (cancelled || !container || !window.turnstile) return;
				if (widgetId.current === undefined) {
					widgetId.current = window.turnstile.render(container, {
						sitekey: SITE_KEY,
						theme: "dark",
					});
				}
			})
			.catch(() => {});
		return () => {
			cancelled = true;
		};
	}, [active]);

	useEffect(() => {
		if (widgetId.current !== undefined)
			window.turnstile?.reset(widgetId.current);
	}, [resetSignal]);

	if (!SITE_KEY) return null;
	return <div ref={containerRef} className="min-h-[65px]" />;
}
