-- Tier lists : à coller dans Supabase > SQL Editor > New query, puis Run.
-- ⚠️ Remplace CHANGE_MOI (tout en bas) par ton code admin avant de lancer.

-- 1) Les votes : une ligne par votant (anonyme), ses deux tier lists en JSON
create table if not exists public.votes (
  voter_id   text primary key,
  lists      jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) Le code admin (stocké sous forme d'empreinte, illisible depuis le site)
create table if not exists public.admin_config (
  id        int primary key default 1 check (id = 1),
  code_hash text not null
);

-- Personne ne lit/écrit ces tables directement depuis le site
alter table public.votes enable row level security;
alter table public.admin_config enable row level security;
revoke all on public.votes, public.admin_config from anon, authenticated;

create or replace function public.code_ok(p_code text) returns boolean
language sql security definer set search_path = public stable as $$
  select exists (select 1 from admin_config
    where code_hash = encode(sha256(convert_to(upper(trim(p_code)), 'UTF8')), 'hex'));
$$;

-- 3) Envoi d'un vote (page publique). Si la personne revote, ça remplace.
create or replace function public.submit_vote(p_voter text, p_lists jsonb) returns void
language plpgsql security definer set search_path = public as $$
begin
  if p_voter is null or length(p_voter) < 8 or length(p_voter) > 64 then raise exception 'voter invalide'; end if;
  if jsonb_typeof(p_lists) <> 'object' or length(p_lists::text) > 20000 then raise exception 'vote invalide'; end if;
  insert into votes (voter_id, lists) values (p_voter, p_lists)
  on conflict (voter_id) do update set lists = excluded.lists, updated_at = now();
end $$;

-- 4) Lecture des résultats (page admin, avec le code)
create or replace function public.admin_results(p_code text) returns jsonb
language plpgsql security definer set search_path = public stable as $$
begin
  if not code_ok(p_code) then raise exception 'unauthorized'; end if;
  return coalesce((select jsonb_agg(jsonb_build_object('id', voter_id, 'date', updated_at, 'lists', lists) order by created_at)
                   from votes), '[]'::jsonb);
end $$;

-- 5) Suppression d'un vote (page admin, avec le code)
create or replace function public.admin_delete(p_code text, p_voter text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not code_ok(p_code) then raise exception 'unauthorized'; end if;
  delete from votes where voter_id = p_voter;
end $$;

revoke all on function public.code_ok(text), public.submit_vote(text, jsonb),
  public.admin_results(text), public.admin_delete(text, text) from public, anon, authenticated;
grant execute on function public.submit_vote(text, jsonb), public.admin_results(text),
  public.admin_delete(text, text) to anon, authenticated;

-- 6) Ton code admin (insensible à la casse). Relance juste cette ligne pour le changer.
insert into public.admin_config (id, code_hash)
values (1, encode(sha256(convert_to(upper(trim('CHANGE_MOI')), 'UTF8')), 'hex'))
on conflict (id) do update set code_hash = excluded.code_hash;
