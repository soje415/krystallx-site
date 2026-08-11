-- Briefing intake — public site → qualified lead → time-boxed access grant.
--
-- SECURITY MODEL: this table has RLS enabled and NO policy for anon or
-- authenticated. That is deliberate, not an oversight. The browser never
-- writes here; the /api/intake serverless function does, using the service
-- role (which bypasses RLS). An anon-insert policy would let anyone POST
-- arbitrary rows straight at PostgREST, bypassing the rate limiting, the
-- conversation transcript, and every server-side cap.
--
-- Reads are for operators only, gated on the same access_profiles grant the
-- console uses — authentication is not authorisation.

create table if not exists public.briefing_requests (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),

  -- Captured by the intake AI during conversation.
  full_name         text not null check (length(trim(full_name)) between 2 and 120),
  email             text not null check (email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  organisation      text not null check (length(trim(organisation)) between 2 and 200),
  role_title        text check (length(role_title) <= 200),

  mandate           text not null check (mandate in (
                      'STATE_GOVERNMENT','FEDERAL_AGENCY','SECURITY_SERVICES',
                      'OIL_AND_GAS','DONOR_NGO','OTHER')),
  pillars           text[] not null default '{}',
  region            text check (length(region) <= 300),
  decision_context  text check (length(decision_context) <= 4000),
  timeline          text check (length(timeline) <= 200),

  -- An identity claim made in chat is a CLAIM, never proof. Verification
  -- happens out-of-band before any grant is issued.
  claimed_authority text check (length(claimed_authority) <= 300),
  identity_verified boolean not null default false,

  -- Full intake conversation: the qualification record, richer than the fields.
  transcript        jsonb not null default '[]'::jsonb,

  status            text not null default 'NEW' check (status in (
                      'NEW','REVIEWING','VERIFIED','GRANTED','DECLINED','SPAM')),
  reviewed_by       uuid,
  review_note       text,

  source_ip_hash    text,   -- salted hash; for abuse correlation, never the raw IP
  user_agent        text
);

comment on table public.briefing_requests is
  'Public-site briefing intake. Written only by the /api/intake function via service role.';
comment on column public.briefing_requests.identity_verified is
  'Set true only after out-of-band verification. Never set from chat content.';

-- Operator review queue is "newest first, filtered by status".
create index if not exists briefing_requests_status_created_idx
  on public.briefing_requests (status, created_at desc);

alter table public.briefing_requests enable row level security;
alter table public.briefing_requests force row level security;

-- Operators with a live grant may read the queue. No anon or authenticated
-- INSERT policy exists by design (see header).
create policy briefing_requests_operator_read
  on public.briefing_requests
  for select
  to authenticated
  using (
    exists (
      select 1 from public.access_profiles ap
      where ap.user_id = (select auth.uid())
        and ap.status = 'ACTIVE'
        and (ap.expires_at is null or ap.expires_at > now())
    )
  );

create policy briefing_requests_operator_update
  on public.briefing_requests
  for update
  to authenticated
  using (
    exists (
      select 1 from public.access_profiles ap
      where ap.user_id = (select auth.uid())
        and ap.status = 'ACTIVE'
        and (ap.expires_at is null or ap.expires_at > now())
    )
  );

-- Per-IP-hash throttle for the intake endpoint. Same rule: service role only.
create table if not exists public.intake_rate_limit (
  ip_hash     text primary key,
  window_start timestamptz not null default now(),
  request_count int not null default 0
);

alter table public.intake_rate_limit enable row level security;
alter table public.intake_rate_limit force row level security;

-- Atomic check-and-increment. Returns true when the caller is allowed through.
-- SECURITY DEFINER with a pinned search_path so it can't be hijacked by a
-- shadowing object in a caller-controlled schema.
create or replace function public.intake_rate_check(
  p_ip_hash text,
  p_limit int default 30,
  p_window interval default '1 hour'
) returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_count int;
begin
  insert into public.intake_rate_limit (ip_hash, window_start, request_count)
    values (p_ip_hash, now(), 1)
  on conflict (ip_hash) do update
    set request_count = case
          when public.intake_rate_limit.window_start < now() - p_window then 1
          else public.intake_rate_limit.request_count + 1
        end,
        window_start = case
          when public.intake_rate_limit.window_start < now() - p_window then now()
          else public.intake_rate_limit.window_start
        end
  returning request_count into v_count;

  return v_count <= p_limit;
end;
$$;

revoke all on function public.intake_rate_check(text, int, interval) from public, anon, authenticated;
