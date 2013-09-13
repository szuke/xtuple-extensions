create or replace function xt.te_total_expenses(tehead_id integer) returns numeric stable as $$
  select sum(case when (teitem_type='E') then teitem_qty else 0 end)
  from te.teitem
  where teitem_tehead_id=$1;
$$ language sql;
