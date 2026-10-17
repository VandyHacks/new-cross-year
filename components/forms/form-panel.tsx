"use client";

import { useActionState, useId, useState } from "react";
import Turnstile from "@/components/forms/turnstile";
import type { FieldSpec } from "@/lib/forms/fields";
import { type FormState, initialFormState } from "@/lib/forms/types";
import { primaryButtonClassName } from "@/lib/button-styles";

type Action = (prev: FormState, formData: FormData) => Promise<FormState>;

type FormPanelProps = {
	action: Action;
	fields: FieldSpec[];
	submitLabel: string;
	// Terminal-chrome title, e.g. "vandyhacks://interest".
	command: string;
	// False while the tab is hidden (pauses the Turnstile widget).
	active: boolean;
};

const controlClassName =
	"type-body-sm w-full rounded-md border border-white/15 bg-vh-navy-950/70 px-3 py-2.5 text-white placeholder:text-vh-faint transition-colors focus:border-vh-purple-300 focus:ring-2 focus:ring-vh-purple-300/40 focus:outline-none aria-[invalid=true]:border-red-400 disabled:opacity-60";

function Field({
	spec,
	error,
	defaultValue,
	disabled,
}: {
	spec: FieldSpec;
	error?: string;
	defaultValue?: string;
	disabled: boolean;
}) {
	const id = useId();
	const errorId = `${id}-error`;
	const shared = {
		id,
		name: spec.name,
		required: spec.required,
		disabled,
		"aria-invalid": error ? true : undefined,
		"aria-describedby": error ? errorId : undefined,
		className: controlClassName,
	} as const;

	return (
		<div className={spec.wide ? "sm:col-span-2" : undefined}>
			<label
				htmlFor={id}
				className="type-label mb-1.5 block text-[11px] text-vh-purple-300"
			>
				{"> "}
				{spec.label}
				{spec.required && (
					<span aria-hidden="true" className="text-vh-purple-100">
						{" *"}
					</span>
				)}
			</label>
			{spec.type === "select" ? (
				<select
					{...shared}
					defaultValue={defaultValue ?? spec.options?.[0]?.value}
				>
					{spec.options?.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			) : spec.type === "textarea" ? (
				<textarea
					{...shared}
					rows={4}
					maxLength={spec.maxLength}
					placeholder={spec.placeholder}
					defaultValue={defaultValue}
				/>
			) : (
				<input
					{...shared}
					type={spec.type}
					maxLength={spec.maxLength}
					autoComplete={spec.autoComplete}
					placeholder={spec.placeholder}
					defaultValue={defaultValue}
				/>
			)}
			{error && (
				<p id={errorId} className="type-body-sm mt-1.5 text-red-300">
					{error}
				</p>
			)}
		</div>
	);
}

function FormInner({
	action,
	fields,
	submitLabel,
	command,
	active,
	onReset,
}: FormPanelProps & { onReset: () => void }) {
	const [state, formAction, pending] = useActionState(
		action,
		initialFormState,
	);

	if (state.status === "success") {
		return (
			<div role="status" className="py-8 text-center">
				<p className="type-label mb-3 text-vh-purple-300">{`// ${command} — sent`}</p>
				<p className="type-body mx-auto max-w-md text-white">
					{state.message}
				</p>
				<button
					type="button"
					onClick={onReset}
					className="type-button mt-6 rounded-sm text-vh-muted underline-offset-4 hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vh-purple-300"
				>
					Send another response
				</button>
			</div>
		);
	}

	return (
		<form action={formAction} noValidate={false} className="relative">
			{/* Honeypot: invisible to people, tempting to bots. */}
			<div
				aria-hidden="true"
				className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
			>
				<label>
					Website
					<input
						type="text"
						name="website"
						tabIndex={-1}
						autoComplete="off"
					/>
				</label>
			</div>
			<div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
				{fields.map((spec) => (
					<Field
						key={spec.name}
						spec={spec}
						error={state.errors?.[spec.name]?.[0]}
						defaultValue={state.values?.[spec.name]}
						disabled={pending}
					/>
				))}
			</div>
			<div className="mt-5">
				<Turnstile active={active} resetSignal={state} />
			</div>
			<div className="mt-6 flex flex-wrap items-center gap-4">
				<button
					type="submit"
					disabled={pending}
					className={`${primaryButtonClassName} disabled:cursor-wait disabled:opacity-70`}
				>
					{pending ? "Sending…" : submitLabel}
				</button>
				{state.status === "error" && state.message && (
					<p role="alert" className="type-body-sm text-red-300">
						{state.message}
					</p>
				)}
			</div>
			<p className="type-body-sm mt-5 text-[12px] text-vh-faint">
				We only use your details to contact you about VandyHacks, and
				never sell them.
			</p>
		</form>
	);
}

export default function FormPanel(props: FormPanelProps) {
	// Bumping the key remounts the form with fresh state ("Send another").
	const [instance, setInstance] = useState(0);
	return (
		<div className="rounded-2xl border border-white/10 bg-vh-navy-800/60 shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_0_40px_rgb(113_56_199/0.18)] backdrop-blur-md">
			<div
				className="flex items-center gap-2 border-b border-white/10 px-4 py-3"
				aria-hidden="true"
			>
				<span className="size-2.5 rounded-full bg-vh-purple-700" />
				<span className="size-2.5 rounded-full bg-vh-purple-400/70" />
				<span className="size-2.5 rounded-full bg-vh-purple-300/40" />
				<span className="type-label ml-3 text-[11px] text-vh-faint">
					{props.command}
				</span>
			</div>
			<div className="p-[clamp(16px,3vw,32px)]">
				<FormInner
					key={instance}
					{...props}
					onReset={() => setInstance((value) => value + 1)}
				/>
			</div>
		</div>
	);
}
