-- Sample rows for the LOCAL stack only (`supabase start` / `supabase db reset`).
-- `supabase db push` never runs this file against the hosted project.

insert into admins (email) values ('admin@example.com');

insert into interest_signups (name, email, school, grad_year, first_hackathon, status) values
	('Ada Lovelace', 'ada@example.com', 'Vanderbilt University', 2028, true, 'new'),
	('Grace Hopper', 'grace@example.com', 'Belmont University', 2027, false, 'contacted'),
	('Alan Turing', 'alan@example.com', 'Tennessee State University', 2029, true, 'new');

insert into judge_applications (name, email, organization, title, role, expertise, availability, status) values
	('Katherine Johnson', 'katherine@example.com', 'NASA', 'Research Mathematician', 'judge', 'Orbital mechanics', 'Saturday', 'new'),
	('Linus Torvalds', 'linus@example.com', 'Linux Foundation', 'Fellow', 'mentor', 'Systems, git', 'All weekend', 'confirmed');

insert into sponsor_inquiries (company, contact_name, email, tier_interest, message, status) values
	('Example Corp', 'Pat Doe', 'pat@example.com', 'gold', 'Interested in a workshop slot.', 'new');
