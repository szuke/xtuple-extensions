create or replace function xt.te_invoiced_state(tehead_id integer) returns boolean stable as $$
  select case te.sheetstate($1, 'I') when 1 then true when 0 then false end;
$$ language sql;
