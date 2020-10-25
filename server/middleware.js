// ends the request with an error code
function error(res, code, headers) {
  res.writeHead(code, headers || {});
  res.end();
}

function isMethod(request, method) {
  const upperMethod = (method || '').toUpperCase();
  return (request.method || '') === upperMethod;
}

function isContentType(request, type) {
  const requestWithHeaders = request || { headers: {} };
  const contentType = requestWithHeaders.headers['content-type'] || '';
  return RegExp(type, 'i').test(contentType);
}

/**
 * Creates a Connect/Express compatible middleware bound to a Server
 * @class ServerMiddleware
 * @param {Server} server Server instance
 * @param {Object} [outerOptions] Specific options for the middleware
 * @return {Function}
 */
module.exports = (server, outerOptions) => function jaysonMiddleware(req, res, next) {
  const options = { ...server.options, ...(outerOptions || {}) };

  // default options.end to true
  if (typeof options.end !== 'boolean') {
    options.end = true;
  }

  //  405 method not allowed if not POST
  if (!isMethod(req, 'POST')) {
    return error(res, 405, { Allow: 'POST' });
  }

  // 415 unsupported media type if Content-Type is not correct
  if (!isContentType(req, 'application/json')) {
    return error(res, 415);
  }

  // body does not appear to be parsed, 500 server error
  if (!req.body || typeof req.body !== 'object') {
    return next(new Error('Request body must be parsed'));
  }

  server.call(req.body, { req }, (callErr, success) => {
    const response = callErr || success;

    const body = JSON.stringify(response);

    // empty response?
    if (body) {
      const headers = {
        'content-length': Buffer.byteLength(body, options.encoding),
        'content-type': 'application/json; charset=utf-8',
      };

      res.writeHead(200, headers);
      res.write(body);
    } else {
      res.writeHead(204);
    }

    // if end is false, next request instead of ending it
    if (options.end) {
      res.end();
    } else {
      next();
    }


    // utils.JSON.stringify(response, options, function(err, body) {
    //   if(err) {
    //     return next(err);
    //   }


    // });
  });

  return null;
};

