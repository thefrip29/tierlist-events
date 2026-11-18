-- Listes modifiables depuis la page admin.
-- À lancer UNE fois dans Supabase > SQL Editor (ne touche pas aux votes).

create table if not exists public.items (
  list_id  text not null,
  name     text not null,
  position int  not null default 0,
  primary key (list_id, name)
);
alter table public.items enable row level security;
revoke all on public.items from anon, authenticated;

-- Contenu actuel des listes
insert into public.items (list_id, name, position) values
  ('events', 'Préranks', 1),
  ('events', 'Bienvenue', 2),
  ('events', 'BCLG', 3),
  ('events', 'Sainte B', 4),
  ('events', 'Sainte C', 5),
  ('events', 'Sainte D', 6),
  ('events', 'SKZ', 7),
  ('events', '508', 8),
  ('events', 'Croisière', 9),
  ('events', 'WTP', 10),
  ('events', 'Wix promo maraine', 11),
  ('events', 'Wix JP', 12),
  ('events', 'Délivrance', 13),
  ('events', 'Gala de Cluny', 14),
  ('events', 'GUAI', 15),
  ('events', 'Le CE', 16),
  ('events', 'Micro UAI', 17),
  ('events', 'Exances', 18),
  ('events', 'RDK', 19),
  ('assos', 'Pians', 1),
  ('assos', 'Comit''s', 2),
  ('assos', 'HH', 3),
  ('assos', '4H', 4),
  ('assos', 'Zoulou', 5),
  ('assos', 'FU', 6),
  ('assos', 'Estime', 7),
  ('assos', 'UAI', 8),
  ('assos', 'BFS', 9),
  ('assos', 'Gazole', 10),
  ('assos', 'DDP', 11),
  ('assos', 'ERS', 12),
  ('assos', 'DAP', 13),
  ('assos', 'Gadzarbre', 14),
  ('assos', 'Grand-mère', 15),
  ('assos', 'DDC', 16),
  ('assos', 'Zi-Atrium', 17),
  ('assos', 'AE', 18),
  ('assos', 'CDF', 19),
  ('assos', 'GG', 20),
  ('assos', 'TQ', 21),
  ('assos', 'Zizag', 22),
  ('assos', 'Zi-spy', 23),
  ('assos', 'Zi-phot''s', 24),
  ('assos', 'Boquette studio', 25),
  ('assos', 'Boxon', 26),
  ('assos', 'AMJE', 27),
  ('assos', 'AMC', 28),
  ('assos', 'ELF', 29),
  ('assos', 'UE', 30),
  ('assos', 'Zi-forum', 31),
  ('assos', 'Moquette', 32),
  ('assos', 'Baral', 33),
  ('assos', 'Boloss', 34),
  ('assos', 'Zident histoire', 35),
  ('assos', 'Zi-Amphi', 36),
  ('assos', 'Bokal', 37)
on conflict (list_id, name) do nothing;

-- Lecture des listes (page publique)
create or replace function public.get_items() returns jsonb
language sql security definer set search_path = public stable as $f$
  select coalesce(jsonb_object_agg(list_id, names), '{}'::jsonb) from (
    select list_id, jsonb_agg(name order by position, name) as names from items group by list_id
  ) t;
$f$;

-- Ajout (page admin, avec le code)
create or replace function public.admin_add_item(p_code text, p_list text, p_name text) returns void
language plpgsql security definer set search_path = public as $f$
begin
  if not code_ok(p_code) then raise exception 'unauthorized'; end if;
  if p_list not in ('events', 'assos') then raise exception 'liste inconnue'; end if;
  p_name := trim(p_name);
  if length(p_name) < 1 or length(p_name) > 40 then raise exception 'nom invalide'; end if;
  insert into items (list_id, name, position)
  values (p_list, p_name, coalesce((select max(position) from items where list_id = p_list), 0) + 1)
  on conflict (list_id, name) do nothing;
end $f$;

-- Retrait (page admin, avec le code)
create or replace function public.admin_remove_item(p_code text, p_list text, p_name text) returns void
language plpgsql security definer set search_path = public as $f$
begin
  if not code_ok(p_code) then raise exception 'unauthorized'; end if;
  delete from items where list_id = p_list and name = p_name;
end $f$;

revoke all on function public.get_items(), public.admin_add_item(text, text, text),
  public.admin_remove_item(text, text, text) from public, anon, authenticated;
grant execute on function public.get_items(), public.admin_add_item(text, text, text),
  public.admin_remove_item(text, text, text) to anon, authenticated;
