-- Cloudflare D1 schema for the public site's backend.
--
-- Deliberately independent of the main platform database. Nothing here is
-- spatial, nothing needs Postgres extensions, and nothing needs row-level
-- security: D1 has no public REST endpoint, so the only path to these tables
-- is through the Worker. That makes the site's backend survive independently
-- of the analysis platform — a lockout on one cannot take down the other.
--
-- Apply:  npx wrangler d1 execute krystallx-site --remote --file=./schema.sql

create table if not exists briefing_requests (
  id                text primary key,           -- crypto.randomUUID() from the Worker
  created_at        text not null,              -- ISO-8601 UTC

  full_name         text not null,
  email             text not null,
  organisation      text not null,
  role_title        text,

  mandate           text not null check (mandate in (
                      'STATE_GOVERNMENT','FEDERAL_AGENCY','SECURITY_SERVICES',
                      'OIL_AND_GAS','DONOR_NGO','OTHER')),
  pillars           text not null default '[]', -- JSON array (SQLite has no array type)
  region            text,
  decision_context  text,
  timeline          text,

  -- An identity claim made in chat is a CLAIM, never proof. Only ever set
  -- true by a human after out-of-band verification.
  claimed_authority text,
  identity_verified integer not null default 0 check (identity_verified in (0,1)),

  transcript        text not null default '[]', -- JSON: the qualification record

  status            text not null default 'NEW' check (status in (
                      'NEW','REVIEWING','VERIFIED','GRANTED','DECLINED','SPAM')),
  reviewed_by       text,
  review_note       text,

  source_ip_hash    text,                       -- salted hash, never the raw IP
  user_agent        text
);

-- Review queue is "newest first, filtered by status".
create index if not exists briefing_requests_status_created_idx
  on briefing_requests (status, created_at desc);

create index if not exists briefing_requests_email_idx
  on briefing_requests (email);

-- Per-IP-hash throttle for the intake endpoint.
create table if not exists intake_rate_limit (
  ip_hash       text primary key,
  window_start  integer not null,               -- unix epoch seconds
  request_count integer not null default 0
);
