## xTuple Extension Tutorial
### Part IV: Production deployment

Writing a bit of code on your own laptop is one thing, but it won't do you much good if you can't deploy it into pruduction. Unlike previous iterations of field dev, you can't feasibly use a tool like `pgadmin`, or even the classic xTuple `installer`, to get all of this code onto a production database. You might be tempted to ssh into the production server and recreate all of this work there, but that won't work either, as doing so will break upgrades.

The appropriate way to deploy your code into production is to go by way of npm. The process is quite easy, actually, and has the added benefit of properly memorializing your source code for maximum reliability and reusability.

### A bit about npm

You can think about npm as providing two services. It is a datacenter in California, with mirrors around the world, that hosts packages of code for free. It is also the software that provides nodejs-based project and dependency management. We rely on it heavily in every part of our app, and so using it for custom extension control is a good fit.

### This sounds complicated

It's breathtakingly simple. We've already published `xtuple-ice-cream` to npm, so starting in xTuple version 4.6, all you have to do to install `xtuple-ice-cream` is the following:

- Boot up a new database without any of the work you've done so far, to mimic the production database
- From the app home, click `Setup` -> `Configure` -> `Database`
- You'll need the `Install Extensions` privilege, which you'll have automatically as an admin user in the `ADMIN` role
- On the `Install Extension` panel, type `xtuple-ice-cream` and click the checkbox
- When you get the success message, restart the browser and you'll see that `xtuple-ice-cream` is all there

### How would I publish my own npm package?

TODO: document

Of course, you're not allowed to publish over our `xtuple-ice-cream` package. 

### What about code I want to keep private

We're still working on that! We'll have a private solution, based around private github repos, available soon.

That's it! Hopefully you have a sense of how to work within the xTuple Web/Mobile platform, and you're excited to start developing your own work. Drop us a line to let us know what you think, or if you have anything else you'd like to be better documented, at dev at xtuple dot com.
