See full documentation in the repo: https://github.com/MikeShi42/rrequire

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
