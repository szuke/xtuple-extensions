/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, describe:true, it:true, require:true */

(function () {
  "use strict";

  var crud = require("../../../../xtuple/test/mocha/lib/crud"),
    assert = require("chai").assert,
    data = {
      recordType: "XM.IceCreamFlavor",
      autoTestAttributes: true,
      createHash: {
        name: "VANILLA" + Math.random(),
        calories: 1200
      },
      updateHash: {
        calories: 1400
      },
      setCallback: function (data, done) {
        var model = data.model;
        assert.equal(model.get("name").substring(0, 7), "VANILLA");
        model.set("calories", 200);
        assert.equal(model.get("name").substring(0, 7), "LITE VA");
        model.set("calories", 1200);
        assert.equal(model.get("name").substring(0, 7), "VANILLA");
      }
    };

  describe('Ice cream flavor crud test', function () {
    this.timeout(20 * 1000);
    it('should perform all the crud operations', function (done) {
      crud.runAllCrud(data, done);
    });
  });
}());
