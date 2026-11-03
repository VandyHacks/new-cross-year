// Marketing-site chrome (CRT vignette, glow text, scanlines). Kept out of the
// root layout so a redesign can swap it without touching /admin.
export default function SiteLayout({ children }: LayoutProps<"/">) {
	return (
		<div className="retro-screen">
			{children}
			<div className="retro-crt" aria-hidden="true" />
		</div>
	);
}
