create or replace function xt.te_to_voucher(tehead_id integer) returns numeric stable as $$
  select sum(case when (teitem_type='E' and teitem_prepaid=false and teitem_vodist_id is null) then teitem_total
           when (teitem_type='T' and teemp_contractor=true and teitem_vodist_id is null) then
             coalesce(teitem_empcost, te.calcRate(emp_wage, emp_wage_period)) * teitem_qty
           else 0 end)
  from te.tehead
    join emp on (tehead_emp_id=emp_id)
    left outer join te.teitem on (tehead_id=teitem_tehead_id)
    left outer join te.teemp on (tehead_emp_id=teemp_emp_id)
$$ language sql;
