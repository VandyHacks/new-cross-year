import type { Metadata } from "next";
import Link from "next/link";
import { confirmMagicLink } from "@/lib/admin/actions";
import { primaryButtonClassName } from "@/lib/button-styles";

export const metadata: Metadata = {
	title: "Sign in",
	robots: { index: false, follow: false },
};

// Landing page for the magic-link email. It only renders a button: the token
// is spent when the admin clicks, so link scanners that prefetch the URL
// can't burn it, and it works in whatever browser the email opens in.
export default async function ConfirmPage({
	searchParams,
}: PageProps<"/auth/confirm">) {
	const params = await searchParams;
	const tokenHash =
		typeof params.token_hash === "string" ? params.token_hash : "";

	return (
		<main className="flex min-h-svh items-center justify-center bg-vh-navy-950 px-[clamp(20px,5vw,72px)] py-16">
			<div className="w-full max-w-md rounded-2xl border border-white/10 bg-vh-navy-800/60 p-[clamp(20px,4vw,36px)]">
				<p className="type-label text-vh-purple-300">vandyhacks://admin</p>
				<h1 className="type-heading mt-3 text-white">Sign in</h1>
				{tokenHash ? (
					<form action={confirmMagicLink} className="mt-6">
						<input type="hidden" name="token_hash" value={tokenHash} />
						<p className="type-body text-vh-text-soft">
							Continue to the VandyHacks admin dashboard.
						</p>
						<button
							type="submit"
							className={`${primaryButtonClassName} mt-5`}
						>
							Sign in
						</button>
					</form>
				) : (
					<p role="alert" className="type-body-sm mt-6 text-red-300">
						This sign-in link is incomplete.{" "}
						<Link href="/admin/login" className="underline">
							Request a new one
						</Link>
						.
					</p>
				)}
			</div>
		</main>
	);
}
