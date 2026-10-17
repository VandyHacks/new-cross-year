// FAQ content, grouped by category. Answers adapted from the VandyHacks XII
// site and earlier editions. Items marked CONFIRM are policy guesses the
// organizers still need to verify before launch.
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
				answer: "VandyHacks is Vanderbilt's student-run collegiate hackathon: a weekend for students to build projects, learn new skills, meet other hackers, and share what they create. Founded in 2015, it was the first collegiate hackathon to call Nashville home.",
			},
			{
				question: "What is a hackathon?",
				answer: "A hackathon is an event where you collaborate with others to build a project from scratch in a short amount of time. It's less about the final product and more about the teamwork, creativity, and learning along the way.",
			},
			{
				question: `When and where is ${EVENT.name}?`,
				answer: `${EVENT.name} takes place ${EVENT.dateLabel} at ${EVENT.venue} in Nashville, Tennessee. We'll share the building, check-in, parking, and arrival details before the event.`,
			},
			{
				question: "How much does it cost?",
				// CONFIRM
				answer: "Nothing. VandyHacks is free to attend for accepted hackers.",
			},
			{
				question: "Is it in person?",
				answer: `${EVENT.name} is planned as a fully in-person event, so there is no virtual participation.`,
			},
			{
				question: "What is the code of conduct?",
				answer: "VandyHacks follows the MLH Code of Conduct. Everyone at the event, including hackers, mentors, sponsors, and organizers, is expected to follow it.",
				link: {
					label: "Read the MLH Code of Conduct",
					href: "https://mlh.io/code-of-conduct",
				},
			},
		],
	},
	{
		id: "applying",
		label: "Applying",
		items: [
			{
				question: "Who can apply?",
				answer: "Anyone who is 18 or older by the day of the event and is currently enrolled in a college or university with a valid student ID. Students from any school and any major are welcome.",
			},
			{
				question: "Do I need hackathon experience?",
				answer: "No. VandyHacks welcomes first-time hackers as well as returning participants. You'll get a hacker guide a few days before the event, and VandyHacks staff, mentors, and other hackers will be around to help.",
			},
			{
				question: "What if I don't know how to code?",
				answer: "Even more reason to come! We host beginner workshops, and you can contribute through design, ideas, pitching, and more. Mentors are on hand to help you get started.",
			},
			{
				question: "When do applications open?",
				answer: "We'll announce the application timeline as soon as it's confirmed. Leave your email and we'll let you know the moment applications open.",
				link: { label: "Get notified", href: CTA.interest },
			},
			{
				question: "Do I need a team?",
				answer: "No. Teams can have up to four people, and you're welcome to work solo. You don't need a team to apply.",
			},
			{
				question: "How are teams formed?",
				answer: "Bring friends, or meet people before the event on our Discord. We also run a team-matching event right after the opening ceremony.",
			},
		],
	},
	{
		id: "event",
		label: "At the event",
		items: [
			{
				question: "What should I bring?",
				answer: "A device you can code or design on, a charger, and anything you'd need for an overnight stay if you're traveling from outside Vanderbilt: toiletries, a change of clothes, and a sleeping bag if you plan to rest at the venue.",
			},
			{
				question: "Will food be provided?",
				// CONFIRM
				answer: "Yes. We provide meals and snacks throughout the weekend. Let us know about any dietary restrictions when you apply.",
			},
			{
				question: "Will there be other activities?",
				answer: "Absolutely: workshops, sponsor career fairs, social events, panels, and more. You need to be registered to take part in most of them, even if you don't plan to submit a project.",
			},
			{
				question: "What can I build?",
				answer: "Anything. You can make a project on any platform, in any language, or in any format to show our judges: software, hardware, a design, or even a storyboard or idea.",
			},
			{
				question: "Can I work on an older project?",
				answer: `No. Submissions must be projects that were started, built, and presented during ${EVENT.name}. Projects with a noticeable amount of previously made material are disqualified from all prizes.`,
			},
			{
				question: "Am I eligible for prizes?",
				answer: "Any team of up to four people that submits a project is eligible. To receive a prize, team members must hold unrestricted work authorization in the United States.",
			},
			{
				question: "Is parking available?",
				answer: "Yes, parking is available near the venue. We'll share specific garages and directions with accepted hackers before the event.",
			},
			{
				question: "Does VandyHacks reimburse travel?",
				// CONFIRM
				answer: "No, we don't. If you can, contact your school's hackathon or CS organization about travel support.",
			},
			{
				question: "I need an accessibility accommodation.",
				answer: `Email ${EVENT.email} and tell us what you need. We'll work with you before the event to make it work.`,
				link: {
					label: `Email ${EVENT.email}`,
					href: `mailto:${EVENT.email}`,
				},
			},
		],
	},
	{
		id: "involved",
		label: "Get involved",
		items: [
			{
				question: "How can my company sponsor VandyHacks?",
				answer: "We'd love to hear from you. Reach out and the team will walk you through sponsorship opportunities and how to reach 1,000+ student builders.",
				link: { label: "Become a sponsor", href: CTA.sponsor },
			},
			{
				question: "How can I judge or mentor?",
				answer: "Industry professionals, alumni, and grad students are welcome. Tell us a bit about yourself and we'll follow up with next steps.",
				link: { label: "Judge or mentor", href: CTA.judge },
			},
			{
				question: "Can I volunteer?",
				answer: `Yes. Email ${EVENT.email} and let us know you're interested in helping run the event.`,
			},
			{
				question: "Where can I find updates or ask another question?",
				answer: `Follow @vandyhacks on Instagram for updates, or email ${EVENT.email} with questions.`,
				link: {
					label: "@vandyhacks on Instagram",
					href: "https://www.instagram.com/vandyhacks",
				},
			},
		],
	},
];
