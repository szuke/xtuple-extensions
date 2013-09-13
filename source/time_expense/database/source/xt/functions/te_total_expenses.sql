create or replace function xt.te_total_expenses(tehead_id integer) returns numeric stable as $$
  select round(sum(coalesce(currtobase(teitem_curr_id, teitem_total, teitem_workdate),0)),2)
  from te.teitem
  where teitem_tehead_id=$1
   and teitem_type='E';
$$ language sql;