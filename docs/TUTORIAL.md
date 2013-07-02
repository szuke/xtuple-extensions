## xTuple Extension Tutorial

## Overview

Suppose you are working with a prospect who is excited to use xTuple, but are balking at one critical missing feature. The prospect needs to be able to profile each contact's favorite ice cream flavor. The list of possible ice cream flavors must be fully customizable, and include the calorie count. Furthermore, users must be able to filter contacts by ice cream flavor. This data is going to be the lynchpin of an upcoming multichannel promotional campaign that the prospect is about the wage, and they cannot live without it.

This tutorial will walk you through setting up this customization in two parts. First, we need to add a new business object, `IceCreamFlavor`. Second, we need to extend the Contact business object to include this field.

Both parts will have to touch all of the layers of the xTuple stack. On the server side, we'll have to make a new table and related ORMs. On the client side we'll have to make the model for ice cream flavors, the views and the views to profile them. We'll also have to insert this feature into the pre-existing contact view. In **Part I** we'll start at the bottom and work our way up to create the `IceCreamFlavor` business object. We'll do the same in **Part II**, and revisiting each layer of the stack will feel like seeing an old friend! Lastly, in **Part III*** we'll add some bells and whistles to give you a taste of some of the more advanced functionality that's available.

If you have not already cloned the [core xtuple repository](http://github.com/xtuple/xtuple) and set up your development environment, do so now by following [our setup instructions](http://github.com/xtuple/xtuple/tree/master/UBUNTU_SETUP.md). You will furthermore want to fork and clone this [xtuple-extensions](http://github.com/xtuple/xtuple-extensions) repository. Make sure that this repository sits alongside the core `xtuple` repository.

As you work through the tutorial you will be putting of your code in the `/source/icecream` directory of the xtuple-extensions repository. You can find a full version of the final product in a [sample directory](http://github.com/xtuple/xtuple-extensions/tree/master/sample/icecream). Because it is not in the source directory it is inactive, but it might be useful for reference as you complete the tutorial.

## Part I: Adding the `IceCreamFlavor` business object

### Tables

We write our database code in plv8, which allows us to use pure javascript even when constructing tables. You won't see any SQL in this tutorial! Don't worry: it's postgres behind the scenes. We'll be putting three files in the `database/source` directory (You'll have to make these directories inside the `icecream` directory). 
* `icflav.sql` (to define the table)
* `register.sql` (to register the extension in the database)
* `manifest.js` (as a single point of entry to call the other two and any other files we make)

Let's start with `icflav.sql`. We'll make a table named `xt.icflav`, with four columns:
* `icflav_id` (the primary key)
* `icflav_name` (the natural key)
* `icflav_description`
* `icflav_calories`

```javascript
select xt.create_table('icflav');

select xt.add_column('icflav','icflav_id', 'serial', 'primary key');
select xt.add_column('icflav','icflav_name', 'text');
select xt.add_column('icflav','icflav_description', 'text');
select xt.add_column('icflav','icflav_calories', 'integer');

comment on table xt.icflav is 'Ice cream flavors';
```

You can actually create the table by running this code against your database

```bash
$ cd database/source
$ psql -U admin -d dev -f icflav.sql
```

**Verify** your work so far by finding the icflav table in the xt schema of your development database using pgadmin3 or psql.


***

While we're here, let's write the command that will register this extension into the database. 

Create a file called `register.sql` with the following code:

```javascript
select xt.register_extension('icecream', 'Ice Cream extension', '/xtuple-extensions', '', 999);
```
999 is the load order, and just has to be any number higher than the load order of the CRM extension, which is 10.

**Verify** this step by seeing this extension as a new row in the `xt.ext` table.

Now is also a good time to associate this extension with the admin. Any extension can be turned off and on for any user, but by default they're turned off. Load up the webapp and navigate to `Setup`->`User Accounts`->`admin`. You'll see that admin has some extensions already turned on. Click the `icecream` checkbox as well, and save the workspace.

***

We can put these files together in our `manifest.js` file, which as a convention will be run by maintenances processes when the database needs to be updated. Another function of the `manifest.js` is to ensure that files get installed in the correct order. In this case so far it doesn't matter because our two scripts are independent.

```javascript
{
  "version": "1.3.9",
  "comment": "Ice Cream Flavor sample extension",
  "databaseScripts": [
    "icflav.sql",
    "register.sql"
  ]
}
```

From now on, you can just update the database by running the core build tool. All of these files are idempotent, so you don't have to worry about anything being installed in duplicate.

```bash
$ cd xtuple
$ ./scripts/build_all.js -d dev -e ../xtuple-extensions/source/icecream
```

### ORMs

The xTuple ORMs are a JSON mapping between the SQL tables and the object-oriented world above the database. In this part of the tutorial we need to make an ORM for the IceCreamFlavor business object. 

By convention, we put new orms in the `orm/models` directory, and extensions to existing orms in the `orm/ext` directory. Unlike with the sql scripts, you don't need to have a master file like the `manifest.js` that references them all. The core build tool will find all the files in these directories and load them in the appropriate order based on the dependency chain.

Put the following JSON object in a new file, `database/orm/models/ice_cream_flavor.json`

```javascript
[
  {
    "context": "icecream",
    "nameSpace": "XM",
    "type": "IceCreamFlavor",
    "table": "xt.icflav",
    "idSequenceName": "icflav_icflav_id_seq",
    "lockable": true,
    "comment": "Ice Cream Flavor Map",
    "privileges": {
      "all": {
        "create": true,
        "read": true,
        "update": true,
        "delete": true
      }
    },
    "properties": [
      {
        "name": "id",
        "attr": {
          "type": "Number",
          "column": "icflav_id",
          "isPrimaryKey": true
        }
      },
      {
        "name": "name",
        "attr": {
          "type": "String",
          "column": "icflav_name",
          "isNaturalKey": true
        }
      },
      {
        "name": "description",
        "attr": {
          "type": "String",
          "column": "icflav_description"
        }
      },
      {
        "name": "calories",
        "attr": {
          "type": "Number",
          "column": "icflav_calories"
        }
      }
    ],
    "isSystem": true
  }
]
```

A lot of the ORM is self-explanatory; you just have to follow the conventions in place. The ORM creates a business object XM.IceCreamFlavor, mapped to the xt.icflav table. The four columns from the table are given names that will be used by the application. (Above this layer, nobody needs to worry about column names like icflav_calories.)

You'll notice that the privileges are all true. Anyone can do any action to this object. This is the default behavior, and we could have left this out of the map altogether. However, soon enough we'll be putting real privileges behind this business object, so it's useful to see it in action.

The name of the idSequence follows the postgres convention and was created automatically when you set the icflav_id field to be of type serial.

Currently, all ORMs in the application are isSystem:true.

The same core build tool that ran the files referenced in `manifest.js` will also find and run any orms in the ORM directory.

```bash
$ cd xtuple
$ ./scripts/build_all.js -d dev -e ../xtuple-extensions/source/icecream
```

**Verify** your work by finding a new view called ice_cream_flavor in the xm schema of your database. Now we're ready to move on to the client! There is no need to make any modifications to the `node-datasource`.

### Client scaffolding

Alongside the `database` directory in your extension you'll want to make a second called `client`, which will have four files, `core.js`, `package.js` and `postbooks.js`, as well as four directories, `en`, `models`, `views`, and `widgets`. 

We'll start with `core.js`, in which we create an object to store our extension.

```javascript
XT.extensions.icecream = {};
```

_A note about the javascript wrappers in the client:_ At the beginning of all of our client-side files you'll see a jshint declaration, and the entirety of the code is wrapped in an anonymous function which is executed immediately. If possible, we also `"use strict"`. These are all good practices and you should follow them when writing in our style. Moreover, you'll also see that for the extension client-side files (except for `core.js` and the `package.js` files), the code is wrapped in another, named function that is not executed immediately. This allows us to load the code of the extension and actually execute the code at different moments in our setup process. For the sake of concision the code examples in this tutorial will ignore all these wrappers, but you will see them in the actual implementation of this sample extension.

You might find yourself copying and pasting the tops and bottoms of client-side files, so as to avoid writing the jshint, `"use strict"`, and wrapper functions. This is fine to do, but make sure that you rename the XT.extensions functions. There must only be one `XT.extensions.iceCream.initModels` [function](http://github.com/xtuple/xtuple-extensions/tree/master/sample/icecream/client/models/ice_cream_flavor.js#L9), for example. 

### Models

Now we can start to build on the client. We use a model layer based on backbone.js and backbone-relational, and at its simplest the model layer requires very little code. Create a file `ice_cream_flavor.js` in the `client/models` directory, with the following:

```javascript
XM.IceCreamFlavor = XM.Document.extend({
  recordType: "XM.IceCreamFlavor",
  documentKey: "name", // the natural key
  idAttribute: "name" // the natural key
});

XM.IceCreamFlavorCollection = XM.Collection.extend({
  model: XM.IceCreamFlavor
});
```

That's all there is to it. As we'll see later on, though, these model files are a very convenient place to put in business logic, so we'll be coming back to these. All the same, this is all you need to get the application to work. All of the details of the model (columns, relations, privileges, etc.) are loaded reflectively off the server during app startup and are injected into the model. That's one of the things that's going on when you're watching the loading bar when you sign in.

You'll notice that we are extending `XM.IceCreamFlavor` off of `XM.Document`, which is itself extended off of `XM.Model`, which itself extends Backbone-relational and Backbone models. `XM.Document` has some features on top of `XM.Model`, such as having a user-defined key. This is the most commonly extended base object in `backbone-x`.

For the larger business objects, we'll typically define one or two lighterweight models (and ORMs) to be used in lists or as nested objects within other business objects. So, along with the "editable" model `XM.Quote`, we have `XM.QuoteListItem` and `XM.QuoteRelation`, which have fewer fields and are not editable. These lightweight models are extended from `XM.Info`. In the case of `IceCreamFlavor` our editable model is so light that we don't need to define any others.

### Lists

Now we start writing the Enyo views, so get your browser ready. We'll start by creating a `list.js` file in `client/views`. 

```javascript
enyo.kind({
  name: "XV.IceCreamFlavorList",
  kind: "XV.List",
  label: "_iceCreamFlavors".loc(),
  collection: "XM.IceCreamFlavorCollection",
  query: {orderBy: [
    {attribute: 'name'}
  ]},
  components: [
    {kind: "XV.ListItem", components: [
      {kind: "FittableColumns", components: [
        {kind: "XV.ListColumn", classes: "short",
          components: [
          {kind: "XV.ListAttr", attr: "name", isKey: true},
          {kind: "XV.ListAttr", attr: "description"}
        ]},
        {kind: "XV.ListColumn", classes: "last", fit: true, components: [
          {kind: "XV.ListAttr", attr: "calories"}
        ]}
      ]}
    ]}
  ]
});
```

The architecture of our application as a whole is that there is a central core of functionality which is itself unaware of the existence of the various extensions that can float around it. The core of the application is really quite small; almost all of the models and views are part of extensions. The way we get this to work is that the core exposes methods to let extensions inject panels into it. The place where this happens is in the `client/postbooks.js` file:

```javascript
var panels, relevantPrivileges;

panels = [
  {name: "iceCreamFlavorList", kind: "XV.IceCreamFlavorList"}
];
XT.app.$.postbooks.appendPanels("setup", panels);
```

This will inject the `IceCreamFlavor` list into the `Setup` module of our app. It is all the code we need to start seeing our changes in the client, so before we write any more, let's try to verify our work so far.

### Packaging the client

We **do** first need to add the glue that will tell the browser which files need to be loaded and in what order, which is the enyo `package.js` files. You can read about the purpose of these files these files in the [Enyo tutorial](https://github.com/enyojs/enyo/wiki/Tutorial#you-got-to-keep-it-separated). 

So far, our package files are `client/package.js`

```javascript
enyo.depends(
  "core.js",
  "models",
  "views",
  "postbooks.js"
);
```

as well as `client/models/package.js`
```javascript
enyo.depends(
  "ice_cream_flavor.js"
);
```

and `client/views/package.js`
```javascript
enyo.depends(
  "list.js"
);
```

Take a second to see how these files, between them, cover all the client-side js files we've written so far. From here on out you'll be expected to add these package files yourself without much prompting from the tutorial.

### Building the client

Enyo provides a build process to join all the client-side code together into one four big files, `enyo.js`, `enyo.css`, `app.js`, and `app.css`. Perhaps you've already built the core app by the following commands:

```bash
cd xtuple/enyo-client/application/tools
./deploy.sh
```

Building an extension is a similar process. 

```bash
cd xtuple/scripts
sudo ./build_client.js -e ../../xtuple-extensions/source/icecream
```

That's it! Load up your browser, sign in to the app, and you should see an empty list of _iceCreamFlavors in the setup area. If you don't see it, it's likely that you haven't associated this extension with the admin user as described above. You might want to open up the browser's javascript console and verify that `Installing extension icecream` is logged.

### Translations

You'll probably notice that the name of the menu option reads `_iceCreamFlavors` instead of "Ice Cream Flavors". Don't assume that the only users consuming your extension will be native English speakers! People eat ice cream all over the world. The xTuple mobile platform uses a simple but powerful way to globalize your code.

As a rule of thumb, don't write any English words or phrases into parts of the application that are visible to the client, such as labels. Instead, use the convention `"_key".loc()`, such as you see in the `XV.IceCreamFlavorList` kind that you've written. The `loc()` function will localize this key per the user's preferences.

You should add the English translation of the key, and our global team of linguists will take care of translating it into other supported languages.

Put the following into a file `client/en/strings.js`.

```javascript
var lang = XT.stringsFor("en_US", {
  "_iceCreamFlavors": "Ice Cream Flavors"
});
```

Of course, you'll need to add a `package.js` file into that directory
```javascript
enyo.depends(
  "strings.js"
);
```
and add `en` as an entry in the root `package.js` array, anywhere above `views`.

**Verify** your work by rebuilding the extension and refreshing the app. Now the label of the list should be nicely formatted, like the other menu items.


### Workspaces


```
  enyo.kind({
    name: "XV.IceCreamFlavorWorkspace",
    kind: "XV.Workspace",
    title: "_iceCreamFlavor".loc(),
    model: "XM.IceCreamFlavor",
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup", classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "name"},
            {kind: "XV.InputWidget", attr: "description"},
            {kind: "XV.NumberWidget", attr: "calories"}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelWorkspace("XM.IceCreamFlavor", "XV.IceCreamFlavorWorkspace");
```

A few things to note. The `attr` fields need to be the model attribute names. The `XV.registerModelWorkspace` tells the application that this is the workspace that should be drilled down to when a user clicks into an item on the list, or clicks the add button.

By now you're hopefully getting the hang of the `package.js` system, so update these files as appropriate. 

**Verify** this works by refreshing the app, going to the empty list, and clicking the add button in the toolbar. This workspace should load. Add some data, and save. The item should show up in the list. The data should be in the xt.icflav table. You should be able to go back into the workspace and edit the data. You'll notice some more untranslated fields, so put these into `strings.js` and rebuild.

Congratulations! You've made a new business object in the xTuple application. In [Part II](TUTORIAL2.md) we're going to start putting it to use.
