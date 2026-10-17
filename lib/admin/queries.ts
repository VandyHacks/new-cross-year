import "server-only";
import { type Kind, type Status, statuses } from "@/lib/admin/kinds";
import { getServiceClient } from "@/lib/supabase/service";

export type Row = Record<string, string | number | boolean | null> & {
	id: string;
	created_at: string;
	email: string;
	status: Status;
	notes: string;
};

export type Filters = { q: string; status: Status | "" };

export function parseFilters(params: {
	[key: string]: string | string[] | undefined;
}): Filters {
	const q = typeof params.q === "string" ? params.q.trim().slice(0, 100) : "";
	const status =
		typeof params.status === "string" &&
		(statuses as readonly string[]).includes(params.status)
			? (params.status as Status)
			: "";
	return { q, status };
}

// PostgREST treats these as filter syntax inside .or(); drop them so a search
// term can't alter the query structure.
const sanitizeTerm = (term: string) =>
	term.replace(/[,()%*\\"':]/g, " ").trim();

function applyFilters<
	Q extends {
		eq: (column: string, value: string) => Q;
		or: (filters: string) => Q;
	},
>(query: Q, kind: Kind, { q, status }: Filters): Q {
	let next = query;
	if (status) next = next.eq("status", status);
	const term = sanitizeTerm(q);
	if (term) {
		next = next.or(
			kind.searchable
				.map((column) => `${column}.ilike.%${term}%`)
				.join(","),
		);
	}
	return next;
}

export const PAGE_SIZE = 25;

export async function fetchPage(kind: Kind, filters: Filters, page: number) {
	const db = getServiceClient();
	if (!db) throw new Error("Database is not configured");
	const from = (page - 1) * PAGE_SIZE;
	const query = applyFilters(
		db
			.from(kind.table)
			.select("*", { count: "exact" })
			.order("created_at", { ascending: false })
			.range(from, from + PAGE_SIZE - 1),
		kind,
		filters,
	);
	const { data, count, error } = await query;
	if (error) throw error;
	return { rows: (data ?? []) as Row[], total: count ?? 0 };
}

// Every matching row, fetched in chunks (Supabase caps a single response).
export async function fetchAll(kind: Kind, filters: Filters) {
	const db = getServiceClient();
	if (!db) throw new Error("Database is not configured");
	const chunk = 1000;
	const rows: Row[] = [];
	for (let from = 0; ; from += chunk) {
		const { data, error } = await applyFilters(
			db
				.from(kind.table)
				.select("*")
				.order("created_at", { ascending: false })
				.range(from, from + chunk - 1),
			kind,
			filters,
		);
		if (error) throw error;
		rows.push(...((data ?? []) as Row[]));
		if (!data || data.length < chunk) break;
	}
	return rows;
}
