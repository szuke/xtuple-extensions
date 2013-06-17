/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, _:true */

(function () {
  "use strict";

  exports.generateKey = function (req, res) {
    var buffer,
      data = "TODO: private key goes here";

    buffer = new Buffer(data);

    res.attachment("X509_needs_name");
    res.send(buffer);
  };
}());
