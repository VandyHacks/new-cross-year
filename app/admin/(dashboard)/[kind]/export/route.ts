import { requireAdmin } from "@/lib/admin/auth";
import { isKindId, kinds } from "@/lib/admin/kinds";
import { fetchAll, parseFilters, type Row } from "@/lib/admin/queries";

// Excel needs a BOM to read UTF-8 CSVs correctly.
const BOM = "\uFEFF";

// Spreadsheet apps run cells starting with these as formulas; prefix a quote
// so a malicious submission can't execute when an admin opens the export.
function csvCell(value: Row[string]) {
	if (value === null || value === undefined) return "";
	let text = String(value);
	if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
	return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export async function GET(
	request: Request,
	ctx: RouteContext<"/admin/[kind]/export">,
) {
	await requireAdmin();
	const { kind: kindParam } = await ctx.params;
	if (!isKindId(kindParam)) return new Response("Not found", { status: 404 });
	const kind = kinds[kindParam];

	const filters = parseFilters(
		Object.fromEntries(new URL(request.url).searchParams),
	);
	const rows = await fetchAll(kind, filters);
	const lines = [
		kind.csv.join(","),
		...rows.map((row) =>
			kind.csv.map((key) => csvCell(row[key])).join(","),
		),
	];
	const stamp = new Date().toISOString().slice(0, 10);

	return new Response(`${BOM}${lines.join("\r\n")}\r\n`, {
		headers: {
			"Content-Type": "text/csv; charset=utf-8",
			"Content-Disposition": `attachment; filename="vandyhacks-${kind.id}-${stamp}.csv"`,
			"Cache-Control": "no-store",
		},
	});
}
