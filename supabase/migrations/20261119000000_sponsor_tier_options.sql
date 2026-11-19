-- Redesigned Get Involved section: the sponsorship-interest dropdown is now
-- Financial Sponsorship / In-Kind Sponsorship. Update the allowed values (and
-- the column default) to match.

alter table sponsor_inquiries
	alter column tier_interest drop default;

alter table sponsor_inquiries
	drop constraint if exists sponsor_inquiries_tier_interest_check;

alter table sponsor_inquiries
	add constraint sponsor_inquiries_tier_interest_check
		check (tier_interest in ('financial', 'in_kind'));

alter table sponsor_inquiries
	alter column tier_interest set default 'financial';
