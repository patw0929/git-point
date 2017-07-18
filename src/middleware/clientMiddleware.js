function parseLinkHeader(header) {
  if (header.length === 0) {
    throw new Error('input must not be of zero length');
  }

  // Split parts by comma
  const parts = header.split(',');
  const links = {};

  // Parse each part into a named link
  for (let i = 0; i < parts.length; i += 1) {
    const section = parts[i].split(';');

    if (section.length !== 2) {
      throw new Error('section could not be split on ";"');
    }

    const url = section[0].replace(/<(.*)>/, '$1').trim();
    const name = section[1].replace(/rel="(.*)"/, '$1').trim();

    links[name] = url;
  }

  return links;
}

export default function clientMiddleware(client) {
  return ({ dispatch, getState }) => {
    return next => action => {
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }

      const state = getState();
      const token = state.auth.accessToken;
      const ctx = {};

      if (token) {
        ctx.token = token;
      }

      const { promise, types, ...rest } = action;

      // console.log(promise, rest, action, token);

      if (!promise) {
        return next(action);
      }

      const [REQUEST, SUCCESS, FAILURE] = types;

      if (REQUEST) {
        next({ ...rest, type: REQUEST });
      }

      const actionPromise = promise(client, ctx);

      actionPromise
        .then(
          result => {
            let meta = {};
            const requestUrl =
              result && result.request && result.request.responseURL;
            const link =
              (result.headers.link && parseLinkHeader(result.headers.link)) ||
              undefined;

            if (link) {
              let currentPage = 1;

              if (link.next) {
                currentPage = +link.next.split('page=')[1] - 1;
              } else if (link.prev) {
                currentPage = +link.prev.split('page=')[1] + 1;
              }

              meta = {
                nextPageUrl: link.next || null,
                prevPageUrl: link.prev || null,
                currentPage,
              };
            }

            return next({
              ...rest,
              requestUrl,
              meta,
              result: result && result.data,
              type: SUCCESS,
            });
          },
          error => {
            return next({
              ...rest,
              error: (error && error.response && error.response.body) || error,
              type: FAILURE,
            });
          }
        )
        .catch(error => {
          // console.error('MIDDLEWARE ERROR:', error);
          next({ ...rest, error, type: FAILURE });
        });

      return actionPromise;
    };
  };
}
