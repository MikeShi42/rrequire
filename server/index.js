const jayson = require('jayson');
const cors = require('cors');
const jsonParser = require('body-parser').json;
const connect = require('connect');
const isPromise = require('is-promise');

const jaysonMiddleware = require('./middleware');

const app = connect();

// create a jayson rpc server
const server = jayson.server({}, {
  useContext: true,
});

let started = false;

function start({ port = 8080, enableCors = true } = {}) {
  if (started) {
    console.warn('rrequire server already started, ignoring.');
    return;
  }

  if (enableCors === true) {
    app.use(cors({ methods: ['POST'] }));
  }
  if (typeof enableCors === 'object') {
    console.log('enable cors object', enableCors);
    app.use(cors({ methods: ['POST'], ...enableCors }));
  }

  // parse request body before the jayson middleware
  app.use(jsonParser());
  app.use(server.middleware());

  app.listen(port);
  console.log('Started jayson server on port', port);
  started = true;
}

function createJaysonServer(obj) {
  const wrappedFunctions = {};
  // Wrap functions to explode args and hit callback appropriately
  Object.keys(obj).forEach(funcName => {
    const wrapper = (args, context, callback) => {
      let parsedArgsArr = [];

      // TODO: Handle named parameters passing
      if (!(args instanceof Array)) {
        for (let i = 0; i < Object.keys(args).length; i++) {
          parsedArgsArr[i] = args[i];
        }
      } else {
        parsedArgsArr = args;
      }

      // Properly send response of RPC back to client
      const handleResponse = (error, value) => {
        if (value == null) {
          // return a null so we still send a result key
          return callback(error, null);
        }
        return callback(error, value);
      };

      try {
        const returnValue = obj[funcName](...parsedArgsArr, context);

        // Wait for promises before responding
        if (isPromise(returnValue)) {
          returnValue.then(resolvedReturnValue => {
            handleResponse(null, resolvedReturnValue);
          }, error => {
            console.error(error);
            handleResponse(error);
          });
        } else {
          handleResponse(null, returnValue);
        }
      } catch (error) {
        console.error(error);
        handleResponse(error);
      }
    };

    wrappedFunctions[funcName] = wrapper;
  });

  server.methods(wrappedFunctions);
}

class RError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

module.exports = {
  // Export as middleware to be used in an express app instead of stand-alone
  // server.
  middleware({ enableCors = false, end = true } = {}) {
    // Don't start the stand-alone server if we're exporting middleware.
    started = true;

    const middlewares = [jsonParser(), jaysonMiddleware(server, { end })];
    // TODO: Dedup with `start` above
    if (enableCors === true) {
      middlewares.unshift(cors({ methods: ['POST'] }));
    }
    if (typeof enableCors === 'object') {
      middlewares.unshift(cors(enableCors));
    }
    return middlewares;
  },
  // Start our own server with given options.
  start(opts) {
    start(opts);
  },
  serve(obj) {
    if (!started) {
      start();
    }
    createJaysonServer(obj);
  },
  export: createJaysonServer,
  Error: RError,
};
