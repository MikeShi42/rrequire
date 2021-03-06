![rrequire logo](https://i.imgur.com/0zexI83.png)

# why rrequire?

The 🚀 fastest ⚡️ way for web apps to start talking to servers.
Connect your frontend to your backend with just 3 lines of code and
zero configuration.

Enjoy familiar node module export syntax
and ES6 import syntax to make your remote calls.

**Warning**: This package is still experimental and the API may change
in-between patch versions.

# Getting Started

Jump To:

- [Web Client](#web-client)
- [Server](#server)

## Web Client

The `rrequire` client allows for easy calls from a web browser
to a remote server implementing the `JSON-RPC` protocol (such as the
`@rrequire/server`).

### Install from npm:

    npm install @rrequire/client

### 'Import' a remote function for use:

    import rrequire from '@rrequire/client';

    const { add } = rrequire('server/module');

    async function myClientMethod(x) {
      console.log(await add(x, 5));
    }

By default, `rrequire` will try to send requests to the current host
(`/`, equivalent to `location.origin`).

All functions return
[`Promises`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
that will resolve to the value that's returned
by the remote procedure (or reject if a problem occurs). It's recommended
to use the [`async/await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
syntax for more concise code.

Note: As of this time, module names are not used to scope function imports.

### Configuration

Import the config function to globally set configs for future RPC requests.

    import rrequire, { config } from '@rrequire/client';

    config({ remoteLocation: 'http://localhost:8080' });

**Config Options**

Key | Type | Default | Description
--- | --- | --- | ---
`remoteLocation` | `String` | `/` | URL of the `JSON-RPC` server.

#### Advanced Usage: Avoiding ES6 Proxy

The usage of
[`Proxy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
in production can cause problems for browsers that
do not yet support `Proxy`. The `Proxy` object is used to magically catch
all property references at run time (ex. module.function),
allowing for easy ES6-like import syntax and minimal overhead. Since
there is no polyfill for `Proxy`, you must
instead explicitly define which functions you expect to import from
the remote server.

By passing in an array of function names into the `rrequire` function call,
`rrequire` avoids using `Proxy` and creates a static object with all functions
pre-defined according to the array.

**Example**

    const {
        add,
        subtract,
    } = rrequire('server/module', [
        // This array specifies which function names we're importing
        // It should match the above properties
        'add',
        'subtract',
    ]);


## Server

The `rrequire` server allows for easy definition of remote functions
that will be served on a Node server using the `JSON-RPC` protocol over
http.

### Install from npm:

    npm install @rrequire/server

### 'Export' a remote function:

    function add(x, y) {
      return x + y;
    }

    require('@rrequire/server').export({
      add,
    });

By default, a `rrequire` server on port 8080 will be started with CORS
enabled for any host.

**Function Signature**: `export(Object functionsToExport, Object options)`

Example:

    require('@rrequire/server').export(
      {
        func1,
        func2,
      }, {
        autoStart: false,
      },
    );

**Export Options**

Key | Type | Default | Description
--- | --- | --- | ---
`autoStart` | `Boolean` | `true` | If set to `false`, prevents rrequire from starting its own server. (Useful for using `start` explicitly or for using rrequire as middleware)

### Stand-Alone Configuration

Call the `start` function before any `export` function calls
to explicitly start the Node server with custom options. Calling `start`
after an `export` will have no effect.

Calling `export` alone will automatically start up a server with default
options.

    const rrequire = require('@rrequire/server')

    // ...function definitions here

    rrequire.start({ port: 3000, enableCors: true });
    rrequire.export({
      // ... function exports here
    });


**Start Options**

Key | Type | Default | Description
--- | --- | --- | ---
`port` | `Number` | `3000` | Port number to listen to incoming RPC requests.
`enableCors` | `Boolean` | `true` | If true, allows RPC requests from any domain.

### Middleware (Use in Existing Apps)

Use rrequire in your current express/connect app by inserting the rrequire
server as middleware.

```
const rrequire = require('@rrequire/server');
const express = require('express');

const app = express();
// ... Your express app
app.all('/rpc', rrequire.middleware({ enableCors: true }));
```

**Middleware Options**

Key | Type | Default | Description
--- | --- | --- | ---
`end` | `Boolean` | `true` | If set to `false` causes the middleware to `next()` instead of `res.end()` when finished.
`enableCors` | `Boolean` | `true` | If true, allows requests from any domain.

#### Further Info

The server largely depends on [`jayson`](https://github.com/tedeh/jayson)
middleware to handle RPC function registration and invocation.
