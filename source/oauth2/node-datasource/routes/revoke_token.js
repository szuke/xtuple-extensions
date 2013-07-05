/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, _:true, SYS:true */

(function () {
  "use strict";

  /**
    Revoke an OAUTH2 token.
   The token can be an access token or a refresh token. If the token is an access token and it has a corresponding refresh token, the refersh token will also be revoked. (? from Google)
   */
  exports.revokeToken = function (req, res) {
    var token = req.query.token;

    res.send({isError: true, message: "TODO: implement this route."});
  };
}());
