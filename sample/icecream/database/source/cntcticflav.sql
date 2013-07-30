select xt.create_table('cntcticflav');

select xt.add_column('cntcticflav','cntcticflav_id', 'serial', 'primary key');
select xt.add_column('cntcticflav','cntcticflav_cntct_id', 'integer', 'references cntct (cntct_id)');
select xt.add_column('cntcticflav','cntcticflav_icflav_id', 'integer', 'references xt.icflav (icflav_id)');

comment on table xt.cntcticflav is 'Joins Contact with Ice cream flavor';

