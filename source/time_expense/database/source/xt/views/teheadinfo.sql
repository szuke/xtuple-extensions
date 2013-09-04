select xt.create_view('xt.teheadinfo', $$

select tehead_id, tehead_number, tehead_weekending, tehead_emp_id, tehead_status, tehead_username,
  xt.te_total_hours(tehead_id) as total_hours,
  xt.te_total_hours(tehead_id) as total_expenses,
  xt.te_to_voucher(tehead_id) as to_voucher,
  xt.te_to_invoice(tehead_id) as to_invoice,
  case te.sheetstate(tehead_id, 'I') when 1 then true when 0 then false end as invoiced,
  case te.sheetstate(tehead_id, 'V') when 1 then true when 0 then false end as vouchered,
  case te.sheetstate(tehead_id, 'P') when 1 then true when 0 then false end as posted,
  xt.te_invoiced_value(tehead_id) as invoiced_value,
  xt.te_invoiced_value(tehead_id) as vouchered_value,
  xt.te_posted_value(tehead_id) as posted_value
from te.tehead;

$$);