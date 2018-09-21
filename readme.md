# ngKit

This package helps you get your Angular app up and running quickly with common services that easily integrate with your own API.

### Included Services
- Authentication
- Http
- Storage
- Event Dispatching
- Caching

## Getting Started
Simply import ngKitModule into your AppModule and provide your configuration to the `forRoot` method.

``` ts
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ngKitModule.forRoot({...}),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Config
Here is a list of the configurable options:

### Authentication

Your app can authenticated

### Http
 - baseUrl: The base url for your API.
 - headers: Default headers to send with every request.

### Storage
- name: The name of your local storage instance.

### Token
- readAs: What the token should be read as from authentication requests.
- storeAs: The key that you would like to store the token as.
- scheme: The http authorization scheme to use for the token when sent in headers.

### Cache
- expires: The default time in minutes that a cached value should expire.

### Debug
Turning debug mode on will provide additional context when developing your app.
