// Marketing-site chrome. The vinyl redesign drops the CRT treatment for a
// fine film grain; /admin is unaffected either way.
export default function SiteLayout({ children }: LayoutProps<"/">) {
	return (
		<div className="vinyl-site">
			{children}
			<div className="vinyl-grain" aria-hidden="true" />
		</div>
	);
}
