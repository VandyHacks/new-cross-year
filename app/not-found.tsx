import Link from "next/link";
import { primaryButtonClassName } from "@/lib/button-styles";

export default function NotFound() {
	return (
		<main className="flex min-h-svh flex-col items-center justify-center gap-6 px-[clamp(20px,5vw,72px)] text-center">
			<p className="type-label text-vh-purple-300">error 404</p>
			<h1 className="type-heading text-white">Page not found</h1>
			<p className="type-body max-w-md text-vh-muted">
				That page doesn&apos;t exist, or it moved.
			</p>
			<Link href="/" className={primaryButtonClassName}>
				Back to home
			</Link>
		</main>
	);
}
