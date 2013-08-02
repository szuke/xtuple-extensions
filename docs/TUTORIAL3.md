## xTuple Extension Tutorial
### Part III: Bells and whistles

Let's add some bells and whistles to give you a feel for how to implement advanced functionality onto the base you've already written.

### Tests

Your grandmother always told you to put your code under test. We use mocha for unit and integration testing, and you should run your ice cream model through a simple CRUD test to make sure that you haven't made any mistakes in the ORM code, and that you've set the `idAttribute` appropriately on the model. It's best to do this immediately after writing the model, before you write any views.

To get your testing environment set up, you'll want to refer to our getting started with [testing document](https://github.com/xtuple/xtuple/wiki/Testing-Setup). Your test code for `IceCreamFlavor` can go in `test/ice_cream_flavor.js` and will look something like:

```javascript
  var crud = require("../../../../xtuple/mocha/test/lib/crud"),
    data = {
      recordType: "XM.IceCreamFlavor",
      autoTestAttributes: true,
      createHash: {
        name: "VANILLA" + Math.random(),
        calories: 1200
      },
      updateHash: {
        calories: 1400
      }
    };

  describe('Ice cream flavor crud test', function () {
    crud.runAllCrud(data);
  });
```

To run the test you'll need some node packages, which means you should run `npm install` from the root of the repository. 
```bash
cd xtuple-extensions
sudo npm intall
```

There are a number of necessary steps that you've probably taken if you've been following along since the beginning. For example, if you haven't built the extension into the database, you'll have to do that, or else you'll get a `undefined is not a function` error.
```bash
../xtuple/scripts/build_app.js -e source/icecream/
```
And you'll have to make sure the user specified in `login_data.js` (typically `admin`) has access to the extension.

You'll also need to have the core datasource running.
```bash
cd xtuple/node-datasource
sudo ./main.js
```

You can run the test based on the typical mocha command.
```bash
./node_modules/mocha/bin/mocha source/icecream/test/ice_cream_flavor.js
```

It's a bit awkward to have to type the path out to the binary, so you might want to install mocha globally
```bash
sudo npm install -g mocha
```

and then you can call the tests more concisely.
```bash
mocha source/icecream/test/ice_cream_flavor.js
```

### Business Logic: Validation

Late breaking requirement from the prospect! Any flavor under 450 calories must start with the word "Lite". This sort of business logic is best put in the model, so let's open up that file.

```javascript
validate: function (attributes) {
  var params = {};
  if (attributes.calories <= 450 && attributes.name.indexOf('LITE ') !== 0) {
    return XT.Error.clone('icecream3001', { params: params });
  }
  // if our custom validation passes, then just test the usual validation
  return XM.Document.prototype.validate.apply(this, arguments);
}
```

The validate function is intended to return undefined if there is no error, and to return an error object if there is an error. What we're doing here is to add a specific check for the business logic. If that passes, we just call the default validation.

See that we're relying on our centralized error registry to understand what `icecream3001` means. Let's register this error in our `client/models/startup.js` file.

```javascript
XT.Error.addError({
  code: "icecream3001",
  messageKey: "_mustUseLite"
});
```

**Verify** your validation by trying to save an invalid flavor. You'll want to update your `strings.js` file to desplay a descriptive message.

### Business Logic: Event Binding

We can do better than this, by making the model automatically update the name based on the calorie count. To do this we use event binding, which is one of the most powerful tool we have to drive business logic. We'll use the bindEvents function to listen to changes to the calorie attribute and act accordingly.

```javascript
bindEvents: function () {
  XM.Document.prototype.bindEvents.apply(this, arguments);
  this.on('change:calories', this.caloriesDidChange);
},
caloriesDidChange: function () {
  var calories = this.get("calories"),
    name = this.get("name");

  if (calories < 450 && name.indexOf('LITE ') !== 0) {
    // add the word lite as applicable
    this.set("name", 'LITE ' + name);
  } else if (calories >= 450 && name.indexOf('LITE ') === 0) {
    // get rid of the word lite if it's not applicable
    this.set("name", name.substring(5));
  }
}
```

**Verify** this by opening up the workspace and playing with the calorie count. As soon as you tab off of the calorie field, the name field should update itself. This is magically accomplished without any modifications to the Enyo layer. What's happening is that the view is always watching any changes to the model, and will re-render itself if it sees any changes. 

The tests-- _you **are** putting your business logic under test, aren't you?_ -- can be achieved by putting the following function in your data object:

```javascript
beforeDeleteActions: [{it: "should update the description to and from LITE", action: function (data, done) {
  var model = data.model;
  assert.equal(model.get("name").substring(0, 7), "VANILLA");
  model.set("calories", 200);
  assert.equal(model.get("name").substring(0, 7), "LITE VA");
  model.set("calories", 1200);
  assert.equal(model.get("name").substring(0, 7), "VANILLA");
}}]
```

### Privilege Control

Earlier on we defined the ORM with totally lax privilege enforcement by setting all the privilege attributes to `true`. Let's go back and restrict privileges for creating, reading, updating, and deleting these objects. It would be easy enough to piggyback on a pre-existing set of privileges, such as `MaintainContacts` and `ViewContacts`, but let's be thorough and make a new privilege.

You'll want to start by going back to the `database/source` folder and add a new file `priv.sql` in with the others. (Make sure you add it to the `manifest.js` as well.)

```javascript
select xt.add_priv('MaintainIceCreamFlavors', 'Maintain Ice Cream Flavors', 'IceCream', 'Contact');
```

The third parameter here is the name of the extension, and the fourth parameter will be the business object that the privilege should be grouped with in the `UserAccount` profiling screen.

Rebuild the extension and **verify** the change by looking in the public `priv` table for these two new privileges.

```sql
select * from priv where priv_module = 'IceCream';
```

Next, go back to the ORM and update the privilege section. Whereas the booleans `true` (and `false`) represent that anyone (or no one) can perform a certain action, any string value is interpreted to mean that only users with that privilege can perform the action.

```javascript
"privileges": {
  "all": {
    "create": "MaintainIceCreamFlavors",
    "read": true,
    "update": "MaintainIceCreamFlavors",
    "delete": "MaintainIceCreamFlavors"
  }
},
```

**Verify** the privilege enforcement by rebuilding, refreshing the browser, and seeing that you can no longer add, edit, or delete an `IceCreamFlavor` (although you can still view them because that privilege is still set to `true`). 

If you go into the `UserAccount` workspace for the `admin` user you'll notice that this privilege is not visible. There are hundreds of privileges and for any given user only a fraction may be relevant. Because some privileges are relevant to multiple extensions there isn't a strict many-to-one relationship between privileges and extensions, so the privileges relevant to any given extension cannot be inferred. Long story short, we have to add the following to our `postbooks.js` file, which declares the `MaintainIceCreamFlavors` as relevant to the `icecream` extension, as well as the fact that this privilege should be grouped with the ones for `Contact`.

```javascript
relevantPrivileges = [
  "MaintainIceCreamFlavors"
];
XT.session.addRelevantPrivileges("icecream", relevantPrivileges);
XT.session.privilegeSegments.Contact.push("MaintainIceCreamFlavors");
```

When you refresh the browser you'll see this privilege in the `UserAccount` workspace. Grant it to yourself, refresh the browser again and you'll be able to add, edit, and delete an `IceCreamFlavor`.

### Declaring the Version Number

One last thing we should do is to declare the version number for the client. We have already specified the version number in the database `manifest.js` file. We should do the something similar in the client so that users will know how up-to-date their extension code is. Change your `client/core.js` file to the following:

```javascript
XT.extensions.icecream = {
  setVersion: function () {
    XT.setVersion("1.4.1", "iceCream");
  }
};
```

**Verify** your work by refreshing the browser, and selecting the `About` item from the gear menu. "Ice Cream 1.4.1" should display alongside your other extensions.

That's it! Hopefully you have a sense of how to work within the xTuple Web/Mobile platform, and you're excited to start developing your own work. Drop us a line to let us know what you think, or if you have anything else you'd like to be better documented, at dev at xtuple dot com.
