import Link from "next/link";
import { redirect } from "next/navigation";
import SetupNotice from "@/components/admin/setup-notice";
import { signOut } from "@/lib/admin/actions";
import { getAdminState } from "@/lib/admin/auth";
import { kindIds, kinds } from "@/lib/admin/kinds";

const navLinkClassName =
	"type-button rounded-full border border-white/15 px-4 py-2 text-vh-muted transition-colors hover:border-vh-purple-300/60 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vh-purple-300";

export default async function DashboardLayout({
	children,
}: LayoutProps<"/admin">) {
	const state = await getAdminState();
	if (state.status === "unconfigured") {
		return (
			<main className="px-[clamp(20px,5vw,72px)] py-16">
				<SetupNotice />
			</main>
		);
	}
	if (state.status === "anonymous") redirect("/admin/login");
	if (state.status === "forbidden") redirect("/admin/login?error=forbidden");

	return (
		<div className="mx-auto w-full max-w-6xl px-[clamp(16px,4vw,48px)] py-8">
			<header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
				<div className="flex flex-wrap items-center gap-2">
					<Link href="/admin" className={navLinkClassName}>
						Overview
					</Link>
					{kindIds.map((id) => (
						<Link
							key={id}
							href={`/admin/${id}`}
							className={navLinkClassName}
						>
							{kinds[id].label}
						</Link>
					))}
				</div>
				<div className="flex items-center gap-4">
					<span className="type-body-sm text-vh-faint">
						{state.email}
					</span>
					<form action={signOut}>
						<button type="submit" className={navLinkClassName}>
							Sign out
						</button>
					</form>
				</div>
			</header>
			<main>{children}</main>
		</div>
	);
}
