const jayson = require('jayson');
const cors = require('cors');
const jsonParser = require('body-parser').json;
const connect = require('connect');

const app = connect();

// create a jayson rpc server
const server = jayson.server();

let started = false;

function start({ port = 8080, enableCors = true }) {
  if (started) {
    console.warn('rrequire server already started, ignoring.');
    return;
  }

  if (enableCors) {
    app.use(cors({ methods: ['POST'] }));
  }

  // parse request body before the jayson middleware
  app.use(jsonParser());
  app.use(server.middleware());

  app.listen(port);
  console.log('Started jayson server on port', port);
  started = true;
}

module.exports = {
  start(opts) {
    start(opts);
  },
  export(obj) {
    if (!started) {
      console.log('Implicitly starting server with default configs');
      start({});
    }

    const wrappedFunctions = {};
    // Wrap functions to explode args and hit callback appropriately
    Object.keys(obj).forEach(funcName => {
      const wrapper = (args, callback) => {
        let parsedArgsArr = [];

        // TODO: Handle named parameters passing
        if (!(args instanceof Array)) {
          for (let i = 0; i < Object.keys(args).length; i++) {
            parsedArgsArr[i] = args[i];
          }
        } else {
          parsedArgsArr = args;
        }

        try {
          let returnValue = obj[funcName](...parsedArgsArr);
          if (returnValue == null) {
            returnValue = null; // return a null so we still send a result key
          }
          callback(null, returnValue);
        } catch (error) {
          console.error(error);
          callback(error, null);
        }
      };

      wrappedFunctions[funcName] = wrapper;
    });

    server.methods(wrappedFunctions);
  },
};
