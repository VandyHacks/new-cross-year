import Link from "next/link";
import { notFound } from "next/navigation";
import { updateSubmission } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";
import { isKindId, kinds, statuses } from "@/lib/admin/kinds";
import {
	fetchPage,
	type Filters,
	PAGE_SIZE,
	parseFilters,
	type Row,
} from "@/lib/admin/queries";

const controlClassName =
	"type-body-sm rounded-md border border-white/15 bg-vh-navy-950/70 px-3 py-2 text-white focus:border-vh-purple-300 focus:ring-2 focus:ring-vh-purple-300/40 focus:outline-none";
const buttonClassName =
	"type-button rounded-full border border-white/15 px-4 py-2 text-vh-muted transition-colors hover:border-vh-purple-300/60 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vh-purple-300";

const statusStyles: Record<string, string> = {
	new: "border-vh-purple-300/60 bg-vh-purple-700/30 text-vh-purple-100",
	contacted: "border-sky-300/40 bg-sky-400/10 text-sky-200",
	confirmed: "border-emerald-300/40 bg-emerald-400/10 text-emerald-200",
	declined: "border-red-300/40 bg-red-400/10 text-red-200",
	archived: "border-white/15 text-vh-faint",
};

const formatDate = (value: string) =>
	new Date(value).toLocaleString("en-US", {
		timeZone: "America/Chicago",
		dateStyle: "medium",
		timeStyle: "short",
	});

function displayValue(key: string, value: Row[string]) {
	if (value === null || value === "") return null;
	if (key === "first_hackathon") return value ? "Yes" : "No";
	return String(value);
}

function buildHref(kind: string, filters: Filters, page: number) {
	const params = new URLSearchParams();
	if (filters.q) params.set("q", filters.q);
	if (filters.status) params.set("status", filters.status);
	if (page > 1) params.set("page", String(page));
	const query = params.toString();
	return `/admin/${kind}${query ? `?${query}` : ""}`;
}

export default async function SubmissionsPage({
	params,
	searchParams,
}: PageProps<"/admin/[kind]">) {
	await requireAdmin();
	const { kind: kindParam } = await params;
	if (!isKindId(kindParam)) notFound();
	const kind = kinds[kindParam];

	const query = await searchParams;
	const filters = parseFilters(query);
	const requested = Number(typeof query.page === "string" ? query.page : "1");
	const page = Number.isInteger(requested) && requested > 0 ? requested : 1;

	let result: Awaited<ReturnType<typeof fetchPage>>;
	try {
		result = await fetchPage(kind, filters, page);
	} catch (error) {
		console.error(`Failed to load ${kind.table}`, error);
		return (
			<>
				<h1 className="type-heading text-white">{kind.label}</h1>
				<p role="alert" className="type-body mt-6 text-red-300">
					Couldn&apos;t load submissions. Check that the database
					migration has been applied.
				</p>
			</>
		);
	}

	const { rows, total } = result;
	const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
	const exportParams = new URLSearchParams();
	if (filters.q) exportParams.set("q", filters.q);
	if (filters.status) exportParams.set("status", filters.status);
	const save = updateSubmission.bind(null, kind.id);

	return (
		<>
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<h1 className="type-heading text-white">{kind.label}</h1>
					<p className="type-body-sm mt-2 text-vh-muted">
						{total}{" "}
						{total === 1 ? kind.singular : `${kind.singular}s`}
						{filters.q || filters.status
							? " match your filters"
							: ""}
					</p>
				</div>
				<a
					href={`/admin/${kind.id}/export${exportParams.size ? `?${exportParams}` : ""}`}
					className={buttonClassName}
				>
					Export CSV
				</a>
			</div>

			<form method="get" className="mt-6 flex flex-wrap gap-3">
				<input
					type="search"
					name="q"
					defaultValue={filters.q}
					placeholder="Search…"
					aria-label="Search"
					className={`${controlClassName} min-w-56 flex-1`}
				/>
				<select
					name="status"
					defaultValue={filters.status}
					aria-label="Filter by status"
					className={controlClassName}
				>
					<option value="">All statuses</option>
					{statuses.map((status) => (
						<option key={status} value={status}>
							{status}
						</option>
					))}
				</select>
				<button type="submit" className={buttonClassName}>
					Filter
				</button>
				{(filters.q || filters.status) && (
					<Link
						href={`/admin/${kind.id}`}
						className={buttonClassName}
					>
						Clear
					</Link>
				)}
			</form>

			{rows.length === 0 ? (
				<p className="type-body mt-10 text-vh-muted">
					Nothing here yet.
				</p>
			) : (
				<ul className="mt-8 space-y-4">
					{rows.map((row) => {
						const details = kind.details
							.map(({ key, label }) => ({
								label,
								value: displayValue(key, row[key]),
							}))
							.filter((item) => item.value);
						return (
							<li
								key={row.id}
								className="rounded-xl border border-white/10 bg-vh-navy-800/60 p-5"
							>
								<div className="flex flex-wrap items-start justify-between gap-3">
									<div>
										<h2 className="type-subheading text-white">
											{String(row[kind.title])}
										</h2>
										<a
											href={`mailto:${row.email}`}
											className="type-body-sm text-vh-purple-300 underline-offset-4 hover:underline"
										>
											{row.email}
										</a>
									</div>
									<div className="text-right">
										<span
											className={`type-label inline-block rounded-full border px-3 py-1 text-[10px] ${statusStyles[row.status] ?? ""}`}
										>
											{row.status}
										</span>
										<p className="type-body-sm mt-2 text-[12px] text-vh-faint">
											{formatDate(row.created_at)}
										</p>
									</div>
								</div>

								{details.length > 0 && (
									<dl className="type-body-sm mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
										{details.map((item) => (
											<div key={item.label}>
												<dt className="type-label text-[10px] text-vh-faint">
													{item.label}
												</dt>
												<dd className="break-words whitespace-pre-wrap text-vh-text-soft">
													{item.value}
												</dd>
											</div>
										))}
									</dl>
								)}

								<form
									// Remount when the saved values change so the status/notes
									// controls show what was just saved, not pre-save defaults.
									key={`${row.status}:${row.notes}`}
									action={save}
									className="mt-5 flex flex-wrap items-end gap-3 border-t border-white/10 pt-4"
								>
									<input
										type="hidden"
										name="id"
										value={row.id}
									/>
									<label className="block">
										<span className="type-label mb-1 block text-[10px] text-vh-faint">
											Status
										</span>
										<select
											name="status"
											defaultValue={row.status}
											className={controlClassName}
										>
											{statuses.map((status) => (
												<option
													key={status}
													value={status}
												>
													{status}
												</option>
											))}
										</select>
									</label>
									<label className="block min-w-56 flex-1">
										<span className="type-label mb-1 block text-[10px] text-vh-faint">
											Notes
										</span>
										<textarea
											name="notes"
											rows={1}
											maxLength={2000}
											defaultValue={row.notes}
											className={`${controlClassName} w-full`}
										/>
									</label>
									<button
										type="submit"
										className={buttonClassName}
									>
										Save
									</button>
								</form>
							</li>
						);
					})}
				</ul>
			)}

			{pages > 1 && (
				<nav
					aria-label="Pagination"
					className="mt-8 flex items-center justify-between gap-4"
				>
					{page > 1 ? (
						<Link
							href={buildHref(kind.id, filters, page - 1)}
							className={buttonClassName}
						>
							← Newer
						</Link>
					) : (
						<span />
					)}
					<span className="type-body-sm text-vh-muted">
						Page {page} of {pages}
					</span>
					{page < pages ? (
						<Link
							href={buildHref(kind.id, filters, page + 1)}
							className={buttonClassName}
						>
							Older →
						</Link>
					) : (
						<span />
					)}
				</nav>
			)}
		</>
	);
}
