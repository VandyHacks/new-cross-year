"use client";

import { useFormStatus } from "react-dom";
import Turnstile from "@/components/forms/turnstile";

// Turnstile for a plain `<form action={serverAction}>` (no useActionState).
// Tokens are single-use, so the widget resets whenever a submission starts or
// ends; the token has already been copied into that submission's FormData.
export default function TurnstileField() {
	const { pending } = useFormStatus();
	return <Turnstile active resetSignal={pending} />;
}
