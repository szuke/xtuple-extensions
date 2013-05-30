select xt.create_table('icflav');

select xt.add_column('icflav','icflav_id', 'serial', 'primary key');
select xt.add_column('icflav','icflav_name', 'text');
select xt.add_column('icflav','icflav_description', 'text');
select xt.add_column('icflav','icflav_calories', 'integer');

comment on table xt.icflav is 'Ice cream flavors';
