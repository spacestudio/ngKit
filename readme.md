# ngKit

This package helps you get your Angular app up and running quickly with common services that easily integrate with your own API.

### Installation

```
npm install ngkit
```

**Install Peer Dependencies**
```
npm install cookie-storage localforage
```

### Included Services
- Authentication
- Http
- Storage
- Event Dispatching
- Caching

## Getting Started
After you've installed ngKit, there will be a few configurable options that you'll want to setup based on the services you're using. For example, if you will be making http requests to an API, you'll want to configure the Http service to use a base url for all requests.

### Installation
ngKit is available on NPM:

`npm install ngkit`

### Import ngKit
Simply import NgKitModule into your AppModule and provide your configuration to the `forRoot` method.

``` ts
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    NgKitModule.forRoot({...}),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Config
Here is a list of the configurable options:

### Authentication

Your app can authenticated using an endpoint from your API. You'll need to provide some common endpoints that will provide ngKit with context to the authentication state of the current user.

- **check**: A common endpoint that can be used to check if the user's access token is still valid.
- **forogotPassword**: An endpoint to send forgot password requests to.
- **login**: Where to send a request to login the user and retrieve their access token.
- **logout**: The endpoint that can be accessed to invalidate the user's access token.

### Http
 - **baseUrl**: The base url for your API.
 - **headers**: Default headers to send with every request.

### Storage
- **name**: The name of your local storage instance.

### Token
- **readAs**: What the token should be read as from authentication requests.
- **storeAs**: The key that you would like to store the token as.
- **scheme**: The http authorization scheme to use for the token when sent in headers.

### Cache
- **expires**: The default time in minutes that a cached value should expire.

### Debug
Turning debug mode on will provide additional context when developing your app.
