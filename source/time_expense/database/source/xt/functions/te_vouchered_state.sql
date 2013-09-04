create or replace function xt.te_vouchered_state(tehead_id integer) returns boolean stable as $$
  select case te.sheetstate($1, 'V') when 1 then true when 0 then false end;
$$ language sql;
