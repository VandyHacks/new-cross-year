import "server-only";

// Minimal Resend client (plain fetch, no SDK). A no-op when RESEND_API_KEY is
// not set, and failures are logged rather than thrown — a mail hiccup must
// never make a successful submission look like it failed.
const apiKey = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM ?? "VandyHacks <hello@vandyhacks.org>";

export const notifyTo = process.env.NOTIFY_EMAIL_TO ?? "info@vandyhacks.org";

export function escapeHtml(value: string) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

export async function sendEmail(message: {
	to: string;
	subject: string;
	html: string;
	replyTo?: string;
}) {
	if (!apiKey) return;
	try {
		const response = await fetch("https://api.resend.com/emails", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				from,
				to: message.to,
				subject: message.subject.replace(/[\r\n]+/g, " "),
				html: message.html,
				reply_to: message.replyTo,
			}),
		});
		if (!response.ok) {
			console.error(
				"Resend rejected an email",
				response.status,
				await response.text(),
			);
		}
	} catch (error) {
		console.error("Failed to send email", error);
	}
}
