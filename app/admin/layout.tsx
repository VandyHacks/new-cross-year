import type { Metadata } from "next";

// The dashboard is private: keep it out of search results and previews.
export const metadata: Metadata = {
	title: "VandyHacks admin",
	robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
	return <div className="min-h-svh bg-vh-navy-950">{children}</div>;
}
