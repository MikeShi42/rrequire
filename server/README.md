See full documentation in the repo: https://github.com/MikeShi42/rrequire

![rrequire logo](https://i.imgur.com/0zexI83.png)

# why rrequire?

The 🚀 fastest ⚡️ way for web apps to start talking to servers.
Connect your frontend to your backend with just 3 lines of code and
zero configuration.

Enjoy familiar node module export syntax
and ES6 import syntax to make your remote calls.

**Warning**: This package is still experimental and the API may change
in-between minor versions.

## Getting Started

### Server

The `rrequire` server allows for easy definition of remote functions
that will be served on a Node server using the `JSON-RPC` protocol over
http.

#### Install from npm:

    npm install @rrequire/server

#### 'Export' a remote function:

    function add(x, y) {
      return x + y;
    }

    require('@rrequire/server').export({
      add,
    });

By default, a `rrequire` server on port 8080 will be started with CORS
enabled for any host.

#### Configuration

Call the `start` function before any `export` function calls
to explicitly start the Node server with custom options. Calling `start`
after an `export` will have no effect.

Calling `export` alone will automatically start up a server with default
options.

    const rrequire = require('@rrequire/server')

    // ...function definitions here

    rrequire.start({ port: 3000, enableCors: true });
    require.export({
      // ... function exports here
    });


**Start Options**

Key | Type | Default | Description
--- | --- | --- | ---
`port` | `Number` | `3000` | Port number to listen to incoming RPC requests.
`enableCors` | `Boolean` | `true` | If true, allows RPC requests from any domain.

#### Further Info

The server largely depends on [`jayson`](https://github.com/tedeh/jayson)
middleware to handle RPC function registration and invocation.
