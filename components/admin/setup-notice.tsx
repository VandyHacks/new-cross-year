export default function SetupNotice() {
	return (
		<div className="mx-auto max-w-2xl rounded-2xl border border-vh-purple-300/30 bg-vh-navy-800/60 p-[clamp(20px,4vw,40px)]">
			<h1 className="type-heading text-white">Finish backend setup</h1>
			<p className="type-body mt-4 text-vh-muted">
				The dashboard needs Supabase. Nothing is broken; it just
				isn&apos;t connected yet.
			</p>
			<ol className="type-body-sm mt-6 list-decimal space-y-2 pl-5 text-vh-text-soft">
				<li>
					Create a Supabase project and run{" "}
					<code className="text-vh-purple-300">
						supabase/migrations/20261017000000_init.sql
					</code>{" "}
					in the SQL editor.
				</li>
				<li>
					Copy{" "}
					<code className="text-vh-purple-300">.env.example</code> to{" "}
					<code className="text-vh-purple-300">.env.local</code> and
					fill in the Supabase URL, anon key, and service-role key.
				</li>
				<li>
					Add yourself to the{" "}
					<code className="text-vh-purple-300">admins</code> table,
					then restart the dev server.
				</li>
			</ol>
			<p className="type-body-sm mt-6 text-vh-faint">
				Full steps are in docs/forms-setup.md.
			</p>
		</div>
	);
}
