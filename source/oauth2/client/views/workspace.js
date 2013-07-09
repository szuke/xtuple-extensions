/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true,
white:true*/
/*global XT:true, XV:true, Backbone:true, enyo:true, console:true */

(function () {

  XT.extensions.oauth2.initWorkspace = function () {
    enyo.kind({
      name: "XV.Oauth2clientWorkspace",
      kind: "XV.Workspace",
      title: "_oauth2Client".loc(),
      model: "XM.Oauth2client",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
                classes: "in-panel", components: [
              {kind: "XV.InputWidget", attr: "clientID", label: "_id".loc()},
              {kind: "XV.InputWidget", attr: "clientSecret", label: "_secret".loc()},
              {kind: "XV.InputWidget", attr: "clientName", label: "_name".loc()},
              {kind: "XV.InputWidget", attr: "clientEmail", label: "_email".loc()},
              {kind: "XV.InputWidget", attr: "clientWebSite", label: "_website".loc()},
              {kind: "XV.InputWidget", attr: "clientLogo", label: "_logo".loc()},
              {kind: "XV.Oauth2clientTypePicker", attr: "clientType"},
              {kind: "XV.CheckboxWidget", attr: "isActive"},
              {kind: "XV.DateWidget", attr: "issued"},
              {kind: "XV.InputWidget", name: "fullListUrl", label: "_fullListUrl".loc(), disabled: true},
              {kind: "XV.InputWidget", name: "singleResourceUrl", label: "_singleResourceUrl".loc(), disabled: true},
              {kind: "XV.InputWidget", name: "authURI", label: "_authURI".loc(), disabled: true},
              {kind: "XV.InputWidget", name: "tokenURI", label: "_tokenURI".loc(), disabled: true},
              {kind: "XV.InputWidget", name: "tokenRevocationURI", label: "_tokenRevocationURI".loc(), disabled: true},
              {kind: "XV.CheckboxWidget", attr: "delegatedAccess"},
              {kind: "XV.InputWidget", attr: "clientX509PubCert", label: "_x509PubCert".loc()},
              {kind: "XV.InputWidget", attr: "organization"}
            ]}
          ]},
          {kind: "XV.Oauth2clientRedirectBox", attr: "redirectURIs" }
        ]}
      ],
      create: function () {
        this.inherited(arguments);
        this.$.fullListUrl.setValue(XT.getOrganizationPath() + "/discovery/v1alpha1/apis/v1alpha1/rest");
        this.$.singleResourceUrl.setValue(XT.getOrganizationPath() + "/discovery/v1alpha1/apis/:model/v1alpha1/rest");
        this.$.authURI.setValue(XT.getOrganizationPath() + "/dialog/authorize");
        this.$.tokenURI.setValue(XT.getOrganizationPath() + "/oauth/token");
        this.$.tokenRevocationURI.setValue(XT.getOrganizationPath() + "/oauth/revoke-token");
      }
    });

    XV.registerModelWorkspace("XM.Oauth2client", "XV.Oauth2clientWorkspace");
  };
}());
