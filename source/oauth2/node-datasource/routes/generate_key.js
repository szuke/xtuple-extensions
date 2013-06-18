/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, _:true, SYS:true */

// https://localhost/dev/oauth2-generate-key?id=7

(function () {
  "use strict";

  var ursa = require("ursa");

  /**
    Fetch the requested oauth2client model, validate the request,
    generate a keypair whose public key will be saved with the
    model and whose private key is returned to the browser.
   */
  exports.generateKey = function (req, res) {
    var clientModel = new SYS.Oauth2client(),
      id = req.query.id,
      // generic error function for both the fetch and the save
      error = function (model, err) {
        console.log("oauth2client error ", arguments);
        res.send({isError: true, error: err});
      },
      fetchSuccess = function (model, result) {
        var keypair = ursa.generatePrivateKey(),
          privateKey = keypair.toPrivatePem(),
          publicKey = keypair.toPublicPem().toString(),
          filename = publicKey.substring(0, publicKey.indexOf("-----END")) +
            "-private_key.pem",
          saveSuccess = function (model, result) {
            res.attachment(filename);
            res.send(new Buffer(privateKey));
          };

        // Cursory validation: this should be a jwt bearer and the
        // public key field should not have already been set.
        if (clientModel.get("clientType" !== "jwt bearer") ||
            clientModel.get("clientX509PubCert")) {
          res.send({isError: true, message: "Invalid request"});
          return;
        }

        // TODO: probably set a bunch more fields here
        clientModel.set("clientX509PubCert", publicKey);
        clientModel.save(null, {
          error: error,
          username: req.session.passport.user.username,
          database: req.session.passport.user.organization,
          success: saveSuccess
        });
      };

    clientModel.fetch({
      id: id,
      username: req.session.passport.user.username,
      database: req.session.passport.user.organization,
      error: error,
      success: fetchSuccess
    });

  };
}());
