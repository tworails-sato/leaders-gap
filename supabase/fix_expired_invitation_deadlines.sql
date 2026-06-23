-- Emergency repair for unused, active invitations whose deadline is missing or in the past.
-- The new deadline is the later of "project creation + 7 days" and "now + 7 days".

with affected_projects as (
  select distinct p.id
  from gap_projects p
  join gap_invitations i on i.project_id = p.id
  where i.used_at is null
    and i.revoked_at is null
    and (i.expires_at is null or i.expires_at <= now())
), repaired_projects as (
  update gap_projects p
  set response_deadline = greatest(p.created_at + interval '7 days', now() + interval '7 days'),
      updated_at = now()
  from affected_projects a
  where p.id = a.id
  returning p.id, p.response_deadline
)
update gap_invitations i
set expires_at = p.response_deadline
from repaired_projects p
where i.project_id = p.id
  and i.used_at is null
  and i.revoked_at is null
  and (i.expires_at is null or i.expires_at <= now());

-- Defaults for records that may be inserted outside the application routes.
alter table gap_projects
  alter column response_deadline set default (now() + interval '7 days');

alter table gap_invitations
  alter column expires_at set default (now() + interval '7 days');
