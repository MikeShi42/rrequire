var jayson = require('jayson');
var cors = require('cors');
var jsonParser = require('body-parser').json;
var connect = require('connect');
var app = connect();

// create a jayson rpc server
var server = jayson.server();

// parse request body before the jayson middleware
app.use(cors({methods: ['POST']}));
app.use(jsonParser());
app.use(server.middleware());

app.listen(3000);

module.exports = {
  export: function (obj) {
    const wrappedFunctions = {};
    // Wrap functions to explode args and hit callback appropriately
    for (key in obj) {
      const funcName = key; // capture current key for closure

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
          callback(null, obj[funcName](...parsedArgsArr));
        } catch (error) {
          console.error(error);
          callback(error, null);
        }
      }

      wrappedFunctions[key] = wrapper;
    }
    server.methods(wrappedFunctions);
  },
};
