-- The interest form offers "Graduate Student" alongside class years. Store it
-- as 'grad' instead of collapsing it to null (which looked like no answer).

alter table interest_signups
	drop constraint if exists interest_signups_grad_year_check;

alter table interest_signups
	alter column grad_year type text using grad_year::text;

alter table interest_signups
	add constraint interest_signups_grad_year_check
		check (grad_year = 'grad' or grad_year ~ '^20(2[4-9]|3[0-9]|40)$');
