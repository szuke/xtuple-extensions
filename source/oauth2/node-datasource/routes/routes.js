/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XM:true */

(function () {
  "use strict";

  var generateKey = require("./generate_key").generateKey,
    revokeToken = require("./revoke_token").revokeToken;

  exports.generateKey = {
    path: "oauth/generate-key",
    function: generateKey
  };

  exports.revokeToken = {
    path: "oauth/revoke-token",
    verb: "POST",
    function: revokeToken
  };

}());
