/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.icecream.initModels = function () {
    XM.IceCreamFlavor = XM.Document.extend({
      recordType: "XM.IceCreamFlavor",
      documentKey: "name", // the natural key
      idAttribute: "name"  // the natural key
    });

    XM.IceCreamFlavorCollection = XM.Collection.extend({
      model: XM.IceCreamFlavor
    });
  };
}());
