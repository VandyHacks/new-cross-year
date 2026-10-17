import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { kindIds, kinds } from "@/lib/admin/kinds";
import { getServiceClient } from "@/lib/supabase/service";

async function counts(table: string) {
	const db = getServiceClient();
	if (!db) return { total: 0, fresh: 0, failed: true };
	const [total, fresh] = await Promise.all([
		db.from(table).select("id", { count: "exact", head: true }),
		db
			.from(table)
			.select("id", { count: "exact", head: true })
			.eq("status", "new"),
	]);
	return {
		total: total.count ?? 0,
		fresh: fresh.count ?? 0,
		failed: Boolean(total.error || fresh.error),
	};
}

export default async function OverviewPage() {
	await requireAdmin();
	const results = await Promise.all(
		kindIds.map(async (id) => [id, await counts(kinds[id].table)] as const),
	);

	return (
		<>
			<h1 className="type-heading text-white">Overview</h1>
			<div className="mt-8 grid gap-4 sm:grid-cols-3">
				{results.map(([id, count]) => (
					<Link
						key={id}
						href={`/admin/${id}`}
						className="group rounded-xl border border-white/10 bg-vh-navy-800/60 p-6 transition-colors hover:border-vh-purple-300/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vh-purple-300"
					>
						<p className="type-label text-vh-purple-300">
							{kinds[id].label}
						</p>
						<p className="mt-4 font-heading text-5xl text-white">
							{count.failed ? "–" : count.total}
						</p>
						<p className="type-body-sm mt-2 text-vh-muted">
							{count.failed
								? "Couldn't load. Check the database setup."
								: `${count.fresh} new`}
						</p>
					</Link>
				))}
			</div>
		</>
	);
}
