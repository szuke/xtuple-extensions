/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XM:true */

(function () {
  "use strict";

  var generateKey = require("./generate_key").generateKey;

  exports.generateKey = {
    path: "oauth2-generate-key",
    function: generateKey
  };

}());
