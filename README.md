# AGILE Identity Management

## Architecture

AGILE Identity Management uses Identity Providers (IdPs) already available to authenticate users of the gateway.
These Identity Providers include:
* Linux-Pam authentication
* Github
* WebID (to be implemented)

Further, IDM is split in two components. A web-server (at the moment it is required, but it will be optional in the future), and a loca component exposing an API through D-Bus.

### IDM Web Component

This component  (inside agile-idm-web-ui) implements an OAuth2 client to authenticate users towards external IdPs.
Currently Github is supported, but we have started to implement Google and Dropbox connectors.

During the OAuth2 redirections, this Web component sets a cookie on the browser and stores a mapping between the IdPs token and the cookie.
As a result, any requests containing the cookie are mapped to the user owning the authentication token generated by the IdP. This makes IDM user-friendly since users need to authenticate only once.


### IDM D-Bus Server

The D-Bus server  (inside agile-idm) provides functionality to store entities through basic CRUD interfaces. These entities are later used by the security framework to enforce security policies on them.



## Configuration

To configure the two IDM components, a JSON object is stored in a file within the conf folder. For every subsection, mention whether they are required for the IDM to execute properly or not.


### OAuth2 Configuration  (Mandatory for the use of external IdPs)

Since AGILE-IDM (Web component) behaves as an OAuth2 client, it needs to be configured with the proper credentials to act as a relying party in the protocol.

For each IdP (that will be used by the AGILE gateway owner), a clientID, and a clientSecret are required. To configure them properly, open the agile-idm-web-ui/conf/agile-ui.conf.
Then, the following attributes of the configuration need to be updated:

* clientID: OAuth2 client
* clientSecret: OAuth2 secret
* host_name: host and port where the AGILE gateway is running.

Assuming that you have retrieved a **client Id** 5y4rye1946, and a **clientSecret** vz20g6010oxttt0gyqv2, and that the gateway is running in localhost:3000 the github configuration should look like this:

```
"auth":{
       "github":{
            "clientID": "5y4rye1946",
            "clientSecret": "vz20g6010oxttt0gyqv2",
            "host_name": "http://localhost:3000",
            "redirect_path": "/callback_github",
            "initial_path": "/github",
            "final_path":"/static/index.html",
            "site": "https://github.com/login",
            "tokenPath": "/oauth/access_token",
            "scope": "notifications"
       },
       "google":{
          ...
       }
}
```

To get the client credentials from github, go to your profile > Settings. Then clock on the left OAuth2 applications menu on the left hand side.
By default, this menu opens the __Authorized applications_. Then, click on the second tab __Developer Applications__ and register a new application.
There, create any application name.

In the application URL, place the combination of $host_name+$initial_path (http://localhost:3000/github according to the example above).
For the authorization URL, you should place    $host_name+$redirect_path (http://localhost:3000/callback_github in the example above).

Then create the application, and place the client Id and client secret in the proper configuration fields.

## Run the Components

To run the web server, including oauth2, web id, pam, and REST HTTP api for authentication execute the following commands after checking out the project:

```
sudo apt-get install libpam0g-dev
cd agile-idm-web-ui
npm install
node ui-server.js
```
libpam0g-dev is a library required to perform PAM authentication, i.e. native linux authentication. This allows users to provide usernames and passwords to authenticate themselves with the underlying operating system So, if this functionality is not going to be used, you can remove "authenticate-pam" from the package.json file and then ignore the apt-get command above.

and to run the core component (D-bus), you can execute the following commands (from the root of the folder checked out):

```
cd agile-idm/external-api/
npm install
cd external-api
node main.js
```
