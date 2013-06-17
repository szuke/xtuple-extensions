/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, window:true */

(function () {
  "use strict";

  XT.extensions.oauth2.initModels = function () {

    //
    // MODELS
    //

    XM.Oauth2client = XM.Model.extend({

      recordType: "XM.Oauth2client",

      autoFetchId: true,

      // clientType must not be editable once first saved.
      bindEvents: function () {
        XM.Model.prototype.bindEvents.apply(this, arguments);
        this.on('statusChange', this.statusDidChange);
      },
      statusDidChange: function () {
        this.setReadOnly('clientType', this.getStatus() !== XM.Model.READY_NEW);
      },

      // TODO: validate secret key unique constraint

      save: function (key, value, options) {
        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (_.isObject(key) || _.isEmpty(key)) {
          options = value;
        }
        options = options ? _.clone(options) : {};

        var success = options.success,
          status = this.getStatus(),
          that = this;

        options.success = function (model, resp, options) {
          console.log(that.get("clientType"));
          if (status === XM.Model.READY_NEW && that.get("clientType") === 'jwt bearer') {
            that.notify("_generatingKey".loc(), {callback: function () {
              window.open(XT.getOrganizationPath() + '/oauth2-generate-key',
                '_newtab');
            }});
          }

          if (success) { success(model, resp, options); }
        };

        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (_.isObject(key) || _.isEmpty(key)) {
          value = options;
        }

        XM.Model.prototype.save.call(this, key, value, options);
      }

    });

    XM.Oauth2clientRedirs = XM.Model.extend({

      recordType: "XM.Oauth2clientRedirs",

      autoFetchId: true

    });

    //
    // COLLECTIONS
    //

    XM.Oauth2clientCollection = XM.Collection.extend({
      model: XM.Oauth2client
    });

    XM.Oauth2clientRedirsCollection = XM.Collection.extend({
      model: XM.Oauth2clientRedirs
    });
  };
}());
