OAuth 2.0 Admin Interface
=========================

xTuple ERP Mobile-Web Client OAuth 2.0 Admin Interface Extension

This extension allows you to add and manage OAuth 2.0 clients in the xTuple ERP
Mobile-Web Client. Before you can use OAuth 2.0 to authenticate with you xTuple
OAuth 2.0 Server, you have to have valid OAuth 2.0 Client credentials
registered with that server. This extension provides a GUI interface for you to
add that OAuth 2.0 Client to the OAuth 2.0 Server.

xTuple's OAuth 2.0 Server is modeled off of Google's OAuth 2.0 Server. xTuple
currently supports two OAuth 2.0 scenarios:

  * [Web Server](https://developers.google.com/accounts/docs/OAuth2WebServer)
  * [Service Accounts](https://developers.google.com/accounts/docs/OAuth2ServiceAccount)

Those two types of clients can be added to your xTuple OAuth 2.0 Server in a
process very similar adding OAuth 2.0 Clients in Google's [APIs Console](https://code.google.com/apis/console#access).

### OAuth 2.0 Extension Installation:

To use this extension, you need to first ensure that you have OpenSSL installed
on your OS that is running the server. If you are using Ubuntu, OpenSSL can be
installed with this command:

    sudo apt-get install openssl

Next, clone this repository in the same directory your "xtuple" Mobile-Web
Client directory is located. The command is:

    git clone git@github.com:xtuple/xtuple-extensions.git

The directory tree structure should look like this:

  * some-parent-directory
    * xtuple
      * enyo-client
      * lib
      * node-datasource
      * scripts
      * etc...
    * xtuple-extensions
      * docs
      * samples
      * source
        * oauth2
          * ...
      * tools
      * etc...

Then enter the "xtuple-extensions" directory and run these commands to
initialize it:

    git submodule update --init --recursive
    npm install

Next, add the relative path to the OAuth 2.0 route to your config.js file
located at "xtuple/node-datasource/config.js". The entry in you config.js
file should look like this:

  ``` javascript
    extensionRoutes: [
      "../../xtuple-extensions/source/oauth2/node-datasource/routes"
    ],
  ```
Finally, install the extension on your xTuple database. Assuming you already
have the Mobile-Web client setup and working. To install JUST this extension
stop the datasource, enter the main "xtuple" directory and run this command:

    ./scripts/build_app.js -d your-xtuple-database-name-here -e ../xtuple-extensions/source/oauth2

You can now start the datasource.

### OAuth 2.0 Client Setup:

After you have installed the OAuth 2.0 extension, login to the Mobile-Web
client as a privileged  "admin" user. Enter the "Setup->User Accounts" workspace
and select your "admin" user. Check the "oauth2" box in the "EXTENSIONS"
section and check the "Maintain OAUTH2 Clients" in the "OAUTH2" Privileges
section. Then refresh your browser window and you should see an "OAUTH2" menu
option on the left hand side of the screen.

Select the "OAUTH2" workspace and add an OAuth 2.0 Client. You should then have
all the OAuth 2.0 Client credentials you will need to connect to the OAuth 2.0
Server.
