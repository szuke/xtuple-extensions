create or replace function xt.te_to_invoice(tehead_id integer) returns numeric stable as $$
  select sum(case when (teitem_billable=true and teitem_invcitem_id is null) then
    currtobase(teitem_curr_id, teitem_total, current_date) else 0 end)
  from teitem where teitem_tehead_id=$1
$$ language sql;
