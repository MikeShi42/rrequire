const request = require('superagent');
const serializer = require('jsonrpc-serializer');

const options = {
  remoteLocation: '/',
};

function config({ remoteLocation }) {
  options.remoteLocation = remoteLocation || '/';
}

function sendRequest(req) {
  return new Promise((resolve, reject) => {
    request
      .post(options.remoteLocation)
      .type('application/json')
      .set('accept', 'json')
      .send(req)
      .end((err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      });
  });
}

/**
 * Executes a RPC and returns a Promise resolving to the returned value or
 * rejecting on a client or remote exception.
 * @param  {String} moduleName  Full module path to resolve on remote
 * @param  {String} methodName  Method name to invoke on remote
 * @param  {Array} argsArr      Array of arguments to invoke the remote
 *                              method with
 * @return {Promise}            Promise resolving to the return value of the
 *                                      remote function or rejecting due to
 *                                      a client or remote exception
 */
function remoteRequest(moduleName, methodName, argsArr) {
  // TODO: Handle moduleName properly
  // TODO: Better ID generation
  const id = Math.floor(Math.random() * 10000000);
  const serializedRequest = serializer.request(id, methodName, argsArr);

  return sendRequest(serializedRequest).then((res) => {
    const response = serializer.deserialize(res.text);
    if (response.type === 'success') {
      return response.payload.result;
    } else if (response.type === 'error') {
      throw response.payload.error;
    } else {
      // TODO: Better error handling
      throw response;
    }
  });
}

module.exports = function rrequire(moduleName) {
  const handler = {
    /**
     * Generates the stub function that will resolve the actual RPC
     * @param  {Object} target Target object we're hooking into (not used)
     * @param  {String} name   Name of the function we are pretending to be
     * @return {Function}      Function that will pretend to be the remote
     *                                  function.
     */
    get(target, name) {
      /**
       * Stub function that mocks a remote function
       * @return {Promise} Resolves with the value of the remote function
       */
      return function remoteStub(...args) {
        return remoteRequest(moduleName, name, args);
      };
    },
  };

  // The mocked remote module
  // NOTE: Proxy is not available across all browsers (mainly IE)
  return new Proxy({}, handler);
};

module.exports.config = config;
