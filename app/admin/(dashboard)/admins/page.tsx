import { addAdmin, removeAdmin } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";
import { getServiceClient } from "@/lib/supabase/service";

const controlClassName =
	"type-body-sm rounded-md border border-white/15 bg-vh-navy-950/70 px-3 py-2 text-white focus:border-vh-purple-300 focus:ring-2 focus:ring-vh-purple-300/40 focus:outline-none";
const buttonClassName =
	"type-button rounded-full border border-white/15 px-4 py-2 text-vh-muted transition-colors hover:border-vh-purple-300/60 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vh-purple-300";

const errors: Record<string, string> = {
	email: "Enter a valid email address.",
	self: "You can't remove yourself. Ask another admin.",
	server: "Something went wrong. Please try again.",
};

const formatDate = (value: string) =>
	new Date(value).toLocaleDateString("en-US", {
		timeZone: "America/Chicago",
		dateStyle: "medium",
	});

export default async function AdminsPage({
	searchParams,
}: PageProps<"/admin/admins">) {
	const { email: self } = await requireAdmin();
	const params = await searchParams;
	const error =
		typeof params.error === "string" ? errors[params.error] : undefined;

	const db = getServiceClient();
	const { data, error: loadError } = db
		? await db
				.from("admins")
				.select("email, created_at")
				.order("created_at", { ascending: true })
		: { data: null, error: new Error("Database is not configured") };
	if (loadError) console.error("Failed to load admins", loadError);
	const admins = (data ?? []) as { email: string; created_at: string }[];

	return (
		<>
			<h1 className="type-heading text-white">Admins</h1>
			<p className="type-body-sm mt-2 max-w-2xl text-vh-muted">
				These emails can sign in to this dashboard. Adding someone here
				doesn&apos;t notify them; send them the sign-in page link
				yourself. Removing someone takes effect on their next page load.
			</p>

			<form
				action={addAdmin}
				className="mt-6 flex flex-wrap items-end gap-3"
			>
				<label className="block min-w-64 flex-1">
					<span className="type-label mb-1 block text-[10px] text-vh-faint">
						Email
					</span>
					<input
						name="email"
						type="email"
						required
						placeholder="name@vanderbilt.edu"
						className={`${controlClassName} w-full`}
					/>
				</label>
				<button type="submit" className={buttonClassName}>
					Add admin
				</button>
			</form>
			{error && (
				<p role="alert" className="type-body-sm mt-3 text-red-300">
					{error}
				</p>
			)}

			{loadError ? (
				<p role="alert" className="type-body mt-10 text-red-300">
					Couldn&apos;t load the admin list.
				</p>
			) : (
				<ul className="mt-8 divide-y divide-white/10 rounded-xl border border-white/10 bg-vh-navy-800/60">
					{admins.map((admin) => (
						<li
							key={admin.email}
							className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
						>
							<div>
								<p className="type-body-sm text-white">
									{admin.email}
									{admin.email === self && (
										<span className="ml-2 text-vh-faint">
											(you)
										</span>
									)}
								</p>
								<p className="type-body-sm text-[12px] text-vh-faint">
									Added {formatDate(admin.created_at)}
								</p>
							</div>
							{admin.email !== self && (
								<form action={removeAdmin}>
									<input
										type="hidden"
										name="email"
										value={admin.email}
									/>
									<button
										type="submit"
										className={buttonClassName}
									>
										Remove
									</button>
								</form>
							)}
						</li>
					))}
				</ul>
			)}
		</>
	);
}
