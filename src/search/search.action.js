import { SEARCH_REPOS, SEARCH_USERS } from './search.type';

const END = 'end';
const SEARCH_API = 'https://api.github.com/search/';

function shouldFetch(state, type, query, isMore = false) {
  const currentResult = state.search[type][query];

  if (!currentResult || !currentResult.items) {
    return true;
  }

  if (currentResult.isFetching) {
    return false;
  }

  if (isMore) {
    return currentResult.meta && currentResult.meta.nextPageUrl !== END;
  }

  return currentResult.didInvalidate;
}

export function searchRepos(query, { isMore = false, nextUrl } = {}) {
  const SEARCH_REPOS_API = `${SEARCH_API}repositories?q=${query}`;
  let api = nextUrl;

  if (!api) {
    if (isMore) {
      isMore = false; // eslint-disable-line no-param-reassign
    }

    api = SEARCH_REPOS_API;
  }

  return {
    query: query.toLowerCase(),
    isMore,
    types: [SEARCH_REPOS.PENDING, SEARCH_REPOS.SUCCESS, SEARCH_REPOS.ERROR],
    promise: (client, ctx) => client.get(api, { ...ctx }),
  };
}

export function searchReposIfNeeded(query) {
  return (dispatch, getState) => {
    const accessToken = getState().auth.accessToken;

    if (shouldFetch(getState(), query, false)) {
      return dispatch(searchRepos(query, accessToken));
    }

    return Promise.resolve();
  };
}

export function searchReposMoreIfNeeded(query) {
  return (dispatch, getState) => {
    const state = getState();
    const accessToken = state.auth.accessToken;

    if (shouldFetch(state, query, true)) {
      const searchReposState = state.search.repos.byId[query];
      const nextUrl =
        searchReposState &&
        searchReposState.meta &&
        searchReposState.meta.nextPageUrl;

      return dispatch(
        searchRepos(query, accessToken, { isMore: true, nextUrl })
      );
    }

    return Promise.resolve();
  };
}

export function searchUsers(query, { isMore = false, nextUrl } = {}) {
  const SEARCH_USERS_API = `${SEARCH_API}users?q=${query}`;
  let api = nextUrl;

  if (!api) {
    if (isMore) {
      isMore = false; // eslint-disable-line no-param-reassign
    }

    api = SEARCH_USERS_API;
  }

  return {
    query: query.toLowerCase(),
    isMore,
    types: [SEARCH_USERS.PENDING, SEARCH_USERS.SUCCESS, SEARCH_USERS.ERROR],
    promise: (client, ctx) => client.get(api, { ...ctx }),
  };
}

export function searchUsersIfNeeded(query) {
  return (dispatch, getState) => {
    const accessToken = getState().auth.accessToken;

    if (shouldFetch(getState(), query, false)) {
      return dispatch(searchUsers(query, accessToken));
    }

    return Promise.resolve();
  };
}

export function searchUsersMoreIfNeeded(query) {
  return (dispatch, getState) => {
    const state = getState();
    const accessToken = state.auth.accessToken;

    if (shouldFetch(state, query, true)) {
      const searchUsersState = state.search.users.byId[query];
      const nextUrl =
        searchUsersState &&
        searchUsersState.meta &&
        searchUsersState.meta.nextPageUrl;

      return dispatch(
        searchUsers(query, accessToken, { isMore: true, nextUrl })
      );
    }

    return Promise.resolve();
  };
}
