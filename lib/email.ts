import "server-only";
import { createTransport, type Transporter } from "nodemailer";

// Form emails over SMTP (Zoho Mail). A no-op when SMTP_USER/SMTP_PASS are not
// set, and failures are logged rather than thrown — a mail hiccup must never
// make a successful submission look like it failed.
const host = process.env.SMTP_HOST || "smtp.zoho.com";
const port = Number(process.env.SMTP_PORT || 465);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
// Zoho only lets a mailbox send as itself (or its verified aliases), so the
// default sender is the SMTP mailbox.
const from = process.env.EMAIL_FROM || `VandyHacks <${user}>`;

export const notifyTo = process.env.NOTIFY_EMAIL_TO ?? "info@vandyhacks.org";

let transport: Transporter | null = null;
function getTransport() {
	if (!user || !pass) return null;
	transport ??= createTransport({
		host,
		port,
		// 465 is implicit TLS; 587 upgrades with STARTTLS (required, never plain).
		secure: port === 465,
		requireTLS: port !== 465,
		auth: { user, pass },
		// Serverless functions shouldn't hang on a slow mail server.
		connectionTimeout: 10_000,
		greetingTimeout: 10_000,
		socketTimeout: 15_000,
	});
	return transport;
}

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
	const mailer = getTransport();
	if (!mailer) return;
	try {
		await mailer.sendMail({
			from,
			to: message.to,
			subject: message.subject.replace(/[\r\n]+/g, " "),
			html: message.html,
			replyTo: message.replyTo,
		});
	} catch (error) {
		console.error("Failed to send email", error);
	}
}
