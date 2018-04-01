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

### Web Client

The `rrequire` client allows for easy calls from a web browser
to a remote server implementing the `JSON-RPC` protocol (such as the
`@rrequire/server`).

#### Install from npm:

    npm install @rrequire/client

#### 'Import' a remote function for use:

    import rrequire from '@rrequire/client';

    const { add } = rrequire('server/module');

    async function myClientMethod(x) {
      console.log(await add(x, 5));
    }

By default, `rrequire` will try to send requests to the current host (`/`).

All functions return
[`Promises`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
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
