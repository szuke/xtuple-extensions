create or replace function xt.te_posted_value(tehead_id integer) returns numeric stable as $$
  select sum(teitem_postedvalue)
  from teitem where teitem_tehead_id=$1
$$ language sql;
