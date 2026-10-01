import type { Variants } from "motion/react";

export const screenFlicker: Variants = {
	hidden: { opacity: 0 },
	visible: ({ delay = 0, reducedMotion = false } = {}) =>
		reducedMotion
			? { opacity: 1, transition: { duration: 0 } }
			: {
					opacity: [0, 0.7, 0.1, 0.9, 0.35, 1],
					transition: {
						delay,
						duration: 0.85,
						times: [0, 0.12, 0.22, 0.5, 0.6, 1],
						ease: "linear",
					},
				},
};

export const sequenceStage: Variants = {
	hidden: {},
	visible: { transition: { when: "afterChildren" } },
};
