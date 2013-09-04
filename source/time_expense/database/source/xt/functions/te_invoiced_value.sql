create or replace function xt.te_invoiced_value(tehead_id integer) returns numeric stable as $$
  select sum(case when teitem_invcitem_id is not null
    then currtobase(teitem_curr_id, teitem_total, current_date) else 0 end)
  from te.teitem where teitem_tehead_id=$1
$$ language sql;
