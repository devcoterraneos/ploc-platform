-- ─── Tabla donations ─────────────────────────────────────────────────────────
-- Corre este SQL en Supabase → SQL Editor

create table if not exists public.donations (
  id              uuid primary key default gen_random_uuid(),
  commerce_order  text unique not null,
  campaign_id     text,
  campaign_name   text,
  donor_name      text,
  donor_email     text not null,
  amount          integer not null,
  status          text not null default 'pending',  -- pending | completed | rejected | cancelled
  flow_token      text,
  flow_order      text,
  payment_date    text,
  payer_email     text,
  flow_raw        jsonb,
  paid_at         timestamptz,
  created_at      timestamptz default now()
);

-- RLS: solo el service role puede leer y escribir
alter table public.donations enable row level security;

-- Bloquear acceso anon/authenticated (solo service role pasa)
create policy "No public access" on public.donations
  for all using (false);

-- Índices útiles para el dashboard
create index if not exists donations_status_idx     on public.donations(status);
create index if not exists donations_campaign_idx   on public.donations(campaign_id);
create index if not exists donations_created_at_idx on public.donations(created_at desc);
