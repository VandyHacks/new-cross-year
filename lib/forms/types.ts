// Shared by the Server Actions (lib/forms/actions.ts) and the form UI.
export type FormState = {
	status: "idle" | "success" | "error";
	message?: string;
	// Field name -> messages, shown inline next to each input.
	errors?: Record<string, string[] | undefined>;
	// Submitted values, echoed back on error so React's post-action form reset
	// doesn't wipe what the visitor typed.
	values?: Record<string, string>;
};

export const initialFormState: FormState = { status: "idle" };
