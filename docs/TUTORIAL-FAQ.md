## xTuple Extension Tutorial FAQ

### How to fork and clone `xtuple-extensions`
Log in to github.com (you will need a user account, which
is free to set up), go to 
https://github.com/xtuple/xtuple-extensions,
and click the "fork" button in the upper-right.

Then, navigate on the command line of your development
environment to the directory that contains the `xtuple`
repository. Type
```bash
git clone git://github.com/yourusername/xtuple-extensions.git
```
(with your own username, of course.) 

Congratulations! The `xtuple-extensions` directory is now
created. It *is* important that this repository sits 
alongside the core `xtuple` repository.

### Why create a new schema?
We do this to avoid namespace collisions, and generally to 
keep every extension code neatly cordoned off into its own
area. It's easy enough to do and our `xm` (ORM) layer hides all
of these details from the client. For the purposes of this
tutorial all our tables will be in the `ic` schema, whereas
the ORM-backed views will live in `xm`.

### Why not use native postgres functions to create tables?
Our `xt.create_table` and `xt.add_column` functions ensure that
you can run the same script over and over and not have to make 
separate install and update packages. The system will only 
add things that weren't there before.
