create or replace function xt.te_total_hours(tehead_id integer) returns numeric stable as $$
  select coalesce(sum(case when (teitem_type='T') then teitem_qty else 0 end),0)
  from te.teitem
  where teitem_tehead_id=$1;
$$ language sql;
