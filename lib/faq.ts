// FAQ content, grouped by category.
import { CTA, EVENT } from "@/lib/event";

export type FaqItem = {
	question: string;
	answer: string;
	// Optional call-to-action link rendered under the answer.
	link?: { label: string; href: string };
};

export type FaqCategory = { id: string; label: string; items: FaqItem[] };

export const faqCategories: FaqCategory[] = [
	{
		id: "general",
		label: "General",
		items: [
			{
				question: "What is VandyHacks?",
				answer:
					"VandyHacks is Vanderbilt University's student-run hackathon organization, bringing students together to build projects, learn new skills, and connect with a community of innovators.",
			},
			{
				question: "What is a hackathon?",
				answer:
					"A hackathon is an event where students collaborate to turn ideas into real projects in a limited amount of time. From websites and apps to AI tools and hardware, there's no limit to what you can create!",
			},
			{
				question: "Do I need coding experience to participate?",
				answer:
					"Not at all! Whether you're writing your first line of code or have years of experience, VandyHacks welcomes hackers of all skill levels.",
			},
			{
				question: "Do I need a team?",
				answer:
					"Nope! You can participate with friends or find teammates at the event. We'll help you connect with other hackers.",
			},
			{
				question: "Do I have to submit a project?",
				answer:
					"Not at all! While we encourage everyone to build and submit a project, you're welcome to attend workshops, meet other hackers, and enjoy the experience even if you don't submit anything.",
			},
			{
				question: "Can I participate virtually?",
				answer: `${EVENT.name} is an in-person event at ${EVENT.venue} in Nashville, Tennessee. We encourage you to join us on campus for the full hackathon experience!`,
			},
		],
	},
	{
		id: "xiii",
		label: EVENT.name,
		items: [
			{
				question: `When and where is ${EVENT.name}?`,
				answer: `${EVENT.name} will take place ${EVENT.dateLabel}, at ${EVENT.venue} in Nashville, Tennessee.`,
			},
			{
				question: "Who can participate?",
				answer:
					"VandyHacks welcomes both undergraduate and graduate students from Vanderbilt and other universities. Whether you're a first-time hacker or an experienced builder, we'd love to have you join us!",
			},
			{
				question: "Is VandyHacks free?",
				answer: "Yes! VandyHacks is completely free to attend.",
			},
			{
				question: "Does VandyHacks provide travel reimbursement?",
				answer:
					"We aim to make VandyHacks accessible to students traveling from other universities. Information about travel assistance, eligibility, and reimbursement will be announced soon.",
			},
			{
				question: "When does registration open?",
				answer: `Registration details will be announced soon! Sign up for updates to be notified when registration opens and stay informed about ${EVENT.name}.`,
				link: { label: "Sign up for updates", href: CTA.interest },
			},
		],
	},
	{
		id: "involved",
		label: "Get Involved",
		items: [
			{
				question: "How can my company sponsor VandyHacks?",
				answer:
					"We're always excited to partner with companies that support student innovation and technology. Reach out to our team to explore sponsorship opportunities.",
				link: {
					label: EVENT.email,
					href: `mailto:${EVENT.email}`,
				},
			},
			{
				question: "How can I become a mentor or judge?",
				answer:
					"We welcome industry professionals, alumni, and others who want to support student innovation. Fill out the form if you're interested in becoming a mentor or judge!",
				link: { label: "Become a mentor or judge", href: CTA.judge },
			},
			{
				question: "How can I join the VandyHacks organizing team?",
				answer:
					"Our team works on everything from technology and design to marketing, partnerships, and event planning. We recruit new members through applications, so follow our social media for upcoming opportunities!",
				link: {
					label: "@vandyhacks on Instagram",
					href: "https://www.instagram.com/vandyhacks",
				},
			},
			{
				question: "How can I register for the next VandyHacks?",
				answer:
					"Fill out our interest form to stay updated on upcoming events, registration openings, and announcements!",
				link: { label: "Fill out the interest form", href: CTA.interest },
			},
		],
	},
];
