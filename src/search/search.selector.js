import {
  createSelector,
  createSelectorCreator,
  defaultMemoize,
} from 'reselect';
import shallowEqual from 'fbjs/lib/shallowEqual';
import idx from 'idx';

const EMPTY_ARRAY = [];

export const searchUIKeywordRawSelector = state =>
  idx(state, _ => _.search.ui.keyword);
export const searchUITypeRawSelector = state =>
  idx(state, _ => _.search.ui.type);
const searchRepoByIdRawSelector = state => idx(state, _ => _.search.repos.byId);
const searchUserByIdRawSelector = state => idx(state, _ => _.search.users.byId);
const searchReposListRawSelector = state =>
  idx(state, _ => _.search.repos.list);
const searchUsersListRawSelector = state =>
  idx(state, _ => _.search.users.list);

export const createShallowEqualSelector = createSelectorCreator(
  defaultMemoize,
  shallowEqual
);

/**
 * search repo row
 */

export const makeSearchRepoIsFetchingSelector = repoId =>
  createSelector(searchRepoByIdRawSelector, repoById => {
    return (repoById[repoId] && repoById[repoId].isFetching) || false;
  });

export const makeSearchRepoSelector = repoId =>
  createSelector(searchRepoByIdRawSelector, repoById => {
    return repoById[repoId] && repoById[repoId].items;
  });

/**
 * search user row
 */

export const makeSearchUserIsFetchingSelector = userId =>
  createSelector(searchUserByIdRawSelector, userById => {
    return (userById[userId] && userById[userId].isFetching) || false;
  });

export const makeSearchUserSelector = userId =>
  createSelector(searchUserByIdRawSelector, userById => {
    return userById[userId] && userById[userId].items;
  });

/**
 * search list
 */

export const makeSearchReposIdsByQuerySelector = query =>
  createSelector(searchReposListRawSelector, list => {
    return (list[query] && list[query].items) || EMPTY_ARRAY;
  });

export const makeSearchUsersIdsByQuerySelector = query =>
  createSelector(searchUsersListRawSelector, list => {
    return (list[query] && list[query].items) || EMPTY_ARRAY;
  });

export const makeSearchReposHasMoreByQuerySelector = query =>
  createSelector(searchReposListRawSelector, list => {
    return !!(list[query] && idx(list[query], _ => _.meta.nextPageUrl));
  });

export const makeSearchUsersHasMoreByQuerySelector = query =>
  createSelector(searchUsersListRawSelector, list => {
    return !!(list[query] && idx(list[query], _ => _.meta.nextPageUrl));
  });

export const makeSearchReposIsFetchingByQuerySelector = query =>
  createSelector(searchReposListRawSelector, list => {
    return !!(list[query] && idx(list[query], _ => _.isFetching));
  });

export const makeSearchUsersIsFetchingByQuerySelector = query =>
  createSelector(searchUsersListRawSelector, list => {
    return !!(list[query] && idx(list[query], _ => _.isFetching));
  });

export const makeSearchReposIsRefreshingByQuerySelector = query =>
  createSelector(searchReposListRawSelector, list => {
    return !!(list[query] && idx(list[query], _ => _.isRefreshing));
  });

export const makeSearchUsersIsRefreshingByQuerySelector = query =>
  createSelector(searchUsersListRawSelector, list => {
    return !!(list[query] && idx(list[query], _ => _.isRefreshing));
  });
