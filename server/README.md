See full documentation in the repo: https://github.com/MikeShi42/rrequire

# why rrequire?
`rrequire` eliminates the overhead of creating and dealing with REST endpoints.
Import and export remote functions as if they were just local functions!

## Getting Started

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
