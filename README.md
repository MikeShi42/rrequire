# why rrequire?
`rrequire` eliminates the overhead of creating and dealing with REST endpoints.
Import and export remote functions as if they were just local functions!

## Getting Started

### Client

The `rrequire` client allows for easy calls to a remote server implementing
the `JSON-RPC` protocol (such as the `@rrequire/server`).

#### Install from npm:

    npm install @rrequire/client

#### 'Import' a remote function for use:

    import rrequire from '@rrequire/client';

    const { add } = rrequire('server/module');

    async function myClientMethod(x) {
      console.log(await add(x, 5));
    }

By default, `rrequire` will try to send requests to the current host (`/`).

All functions return [`Promises`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
that will resolve to the value that's returned
by the remote procedure (or reject if a problem occurs). It's recommended
to use the [`async/await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
syntax for more concise code.

Note: As of this time, module names are not used to scope function imports.

#### Configuration

Import the config function to globally set configs for future RPC requests.

    import rrequire, { config } from '@rrequire/client';

    config({ remoteLocation: 'http://localhost:8080' });

**Config Options**

Key | Type | Description
--- | --- | ---
`remoteLocation` | `String` | URL of the `JSON-RPC` server.

### Server

The `rrequire` server allows for easy definition of remote functions
that will be served on a Node server using the `JSON-RPC` protocol.

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
to explicitly start the Node server with custom options.

Calling `start` after an `export` will have no effect.

Calling `export` alone will automatically start up a server with default
options.

    const rrequire = require('@rrequire/server')

    // ...function definitions here

    rrequire.start({ port: 3000, enableCors: true });
    require.export({
      // ... function exports here
    });

#### Further Info

The server largely depends on [`jayson`](https://github.com/tedeh/jayson)
middleware to handle RPC function registration and invocation.
