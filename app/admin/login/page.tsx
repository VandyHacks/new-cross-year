import { redirect } from "next/navigation";
import SetupNotice from "@/components/admin/setup-notice";
import { sendMagicLink, signOut } from "@/lib/admin/actions";
import { getAdminState } from "@/lib/admin/auth";
import { primaryButtonClassName } from "@/lib/button-styles";

const errors: Record<string, string> = {
	email: "Enter a valid email address.",
	forbidden: "That account isn't on the admin list.",
	callback: "That sign-in link was invalid or expired. Request a new one.",
	server: "Something went wrong. Please try again.",
};

export default async function LoginPage({
	searchParams,
}: PageProps<"/admin/login">) {
	const state = await getAdminState();
	if (state.status === "admin") redirect("/admin");

	const params = await searchParams;
	const error =
		typeof params.error === "string" ? errors[params.error] : undefined;
	const sent = params.sent === "1";

	return (
		<main className="flex min-h-svh items-center justify-center px-[clamp(20px,5vw,72px)] py-16">
			{state.status === "unconfigured" ? (
				<SetupNotice />
			) : (
				<div className="w-full max-w-md rounded-2xl border border-white/10 bg-vh-navy-800/60 p-[clamp(20px,4vw,36px)]">
					<p className="type-label text-vh-purple-300">
						vandyhacks://admin
					</p>
					<h1 className="type-heading mt-3 text-white">Sign in</h1>

					{state.status === "forbidden" ? (
						<div className="mt-6">
							<p
								role="alert"
								className="type-body-sm text-red-300"
							>
								{state.email} isn&apos;t on the admin list.
							</p>
							<form action={signOut} className="mt-4">
								<button
									type="submit"
									className={primaryButtonClassName}
								>
									Sign out
								</button>
							</form>
						</div>
					) : sent ? (
						<p
							role="status"
							className="type-body mt-6 text-vh-text-soft"
						>
							If that email is on the admin list, a sign-in link
							is on its way. It expires shortly, so use it soon.
						</p>
					) : (
						<form action={sendMagicLink} className="mt-6">
							<label
								htmlFor="email"
								className="type-label mb-1.5 block text-[11px] text-vh-purple-300"
							>
								{"> "}Email
							</label>
							<input
								id="email"
								name="email"
								type="email"
								required
								autoComplete="email"
								className="type-body-sm w-full rounded-md border border-white/15 bg-vh-navy-950/70 px-3 py-2.5 text-white focus:border-vh-purple-300 focus:ring-2 focus:ring-vh-purple-300/40 focus:outline-none"
							/>
							{error && (
								<p
									role="alert"
									className="type-body-sm mt-3 text-red-300"
								>
									{error}
								</p>
							)}
							<button
								type="submit"
								className={`${primaryButtonClassName} mt-5`}
							>
								Email me a sign-in link
							</button>
						</form>
					)}
				</div>
			)}
		</main>
	);
}
