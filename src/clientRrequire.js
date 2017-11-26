import request from 'superagent';
import serializer from 'jsonrpc-serializer';

function sendRequest(req) {
  return new Promise((resolve, reject) => {
    request
      .post('http://localhost:3000/')
      .type('application/json')
      .set('accept', 'json')
      .send(req)
      .end((err, res) => {
        console.log('sendRequest', err, res);
        if (err) {
          return reject(err);
        }
        return resolve(res);
      });
  });
}

function remoteRequest(method, args) {
  const id = Math.floor(Math.random() * 10000000);
  const request = serializer.request(id, method, args);

  console.log('sending request', id, method, args, 'string', request)

  return sendRequest(request).then(res => {
    let response = serializer.deserialize(res.text);
    if (response.type === 'success') {
      return response.payload.result;
    } else {
      // TODO: Handle errors better here
      throw response;
    }
  });
}

// TODO: Actually care about moduleName
export default function(moduleName) {
  var handler = {
    /**
     * Generates the stub function that will resolve the actual RPC
     * @param  {Object} target Target object we're hooking into (not used)
     * @param  {String} name   Name of the function we are pretending to be
     * @return {Function}      Function that will pretend to be the remote
     *                                  function.
     */
    get: function(target, name) {
      /**
       * Stub function that mocks a remote function
       * @return {Promise} Resolves with the value of the remote function
       */
      return function() {
        let args = arguments;
        console.log('name', name, args);
        return remoteRequest(name, args);
      }
    }
  };

  // The mocked remote module
  return new Proxy({}, handler);
};
