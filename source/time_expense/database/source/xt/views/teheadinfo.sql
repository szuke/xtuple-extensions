select xt.create_view('xt.teheadinfo', $$

select tehead_id, tehead_number, tehead_weekending, tehead_emp_id, tehead_status, tehead_username,
  xt.te_total_hours(tehead_id) as total_hours,
  xt.te_total_hours(tehead_id) as total_expenses,
  xt.te_to_voucher(tehead_id) as to_voucher,
  xt.te_to_invoice(tehead_id) as to_invoice,
  xt.te_invoiced_state as invoiced,
  xt.te_vouchered_state as vouchered,
  xt.te_posted_state as posted,
  xt.te_invoiced_value(tehead_id) as invoiced_value,
  xt.te_invoiced_value(tehead_id) as vouchered_value,
  xt.te_posted_value(tehead_id) as posted_value
from te.tehead;

$$);