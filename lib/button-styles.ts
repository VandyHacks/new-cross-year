// Shared CTA styles so the navbar and hero buttons stay identical.
const base =
	"type-button inline-flex items-center justify-center rounded-full px-5 py-2.5 transition-[transform,box-shadow,background-color,border-color] duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vh-purple-300 motion-reduce:transition-none motion-reduce:hover:translate-y-0";

export const primaryButtonClassName = `${base} bg-vh-purple-700 text-white shadow-[0_0_20px_rgba(113,56,199,0.55)] hover:bg-vh-purple-600 hover:shadow-[0_0_28px_rgba(136,83,220,0.8)]`;

export const secondaryButtonClassName = `${base} border border-vh-purple-300/40 bg-vh-navy-950/40 text-vh-purple-100 backdrop-blur-md hover:border-vh-purple-300 hover:bg-vh-purple-700/20`;
