/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, Backbone:true, _:true, XM:true, XT:true*/
var fs = require('fs'),
  exec = require('child_process').exec,
  rimraf = require('rimraf').exec,
  _ = require('underscore');

(function () {
  "use strict";

  var argv, buildExtension, extensions, finish;

  //
  // Recurse down the array of the extensions to be built
  //
  buildExtension = function (extensionQueue, callback) {
    var extDir, extName, buildDir, recurse;

    recurse = function (err, stdout, stderr) {
      if (err) {
        console.log("Error building enyo app", err);
      }
      console.log(extDir, "extension has been built");

      // move the built extension into its proper directory
      fs.mkdirSync(buildDir);
      fs.renameSync("./build/app.js", buildDir + "/" + extName + ".js");

      // actually recurse
      buildExtension(extensionQueue, callback);
    };

    if (extensionQueue.length === 0) {
      callback();
      return;
    }

    extDir = extensionQueue.pop();
    buildDir = extDir.replace('/source/', '/builds/');

    // create the package file for enyo to use
    var rootPackageContents = 'enyo.depends("' + extDir + '/client");';
    fs.writeFileSync("./package.js", rootPackageContents);

    // run the enyo deployment method asyncronously
    exec("./tools/deploy.sh", recurse);
  };

  //
  // Determine which extensions we want to build
  //
  argv = process.argv;
  if (argv.indexOf("-e") >= 0) {
    // the user has specified a particular extension
    extensions = [ argv[argv.indexOf("-e") + 1] ];

  } else {
    // add the core extensions
    // TODO: rmrf with node, remove buildExtensions.sh, move to /scripts directory
    // this isn't complete for 1.3.5, so users should continue to use the old script
    console.log("You need to specify an extension with -e");
    process.exit(1);
    extensions = fs.readdirSync("./source");
  }

  //
  // Define cleanup function
  //
  finish = function () {
    fs.unlinkSync("./package.js");
    console.log("all done");
  };

  console.log(extensions);

  //
  // Go do it.
  //
  buildExtension(extensions, finish);

}());
