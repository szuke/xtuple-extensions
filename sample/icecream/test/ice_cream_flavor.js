/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, describe:true, it:true, require:true */

(function () {
  "use strict";

  var crud = require("../../../../xtuple/node-datasource/test/mocha/lib/crud"),
    assert = require("chai").assert,
    data = {
      recordType: "XM.IceCreamFlavor",
      autoTestAttributes: true,
      createHash: {
        name: "Vanilla",
        calories: 200
      },
      updateHash: {
        calories: 400
      }
    };

  describe('Ice cream flavor crud test', function () {
    this.timeout(20 * 1000);
    it('should perform all the crud operations', function (done) {
      crud.runAllCrud(data, done);
    });
  });
}());
