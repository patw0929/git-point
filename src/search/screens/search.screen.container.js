import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import idx from 'idx';
import {
  makeSearchReposIdsByQuerySelector,
  makeSearchUsersIdsByQuerySelector,
  makeSearchReposIsFetchingByQuerySelector,
  makeSearchUsersIsFetchingByQuerySelector,
  makeSearchReposHasMoreByQuerySelector,
  makeSearchUsersHasMoreByQuerySelector,
  makeSearchReposIsRefreshingByQuerySelector,
  makeSearchUsersIsRefreshingByQuerySelector,
  searchRepos,
  searchUsers,
  searchReposIfNeeded,
  searchReposMoreIfNeeded,
  searchUsersIfNeeded,
  searchUsersMoreIfNeeded,
} from '../index';
import Search from './search.screen';

const makeSelector = (initialState, ownProps) => {
  let query = idx(ownProps, _ => _.navigation.state.params.query);
  const type = idx(ownProps, _ => _.navigation.state.params.type);

  if (query) {
    query = query.toLowerCase();
  } else {
    return state => state;
  }

  const selector = createStructuredSelector({
    keyword: () => query,
    type: () => type,
    reposIdsList: makeSearchReposIdsByQuerySelector(query),
    usersIdsList: makeSearchUsersIdsByQuerySelector(query),
    reposIsFetching: makeSearchReposIsFetchingByQuerySelector(query),
    usersIsFetching: makeSearchUsersIsFetchingByQuerySelector(query),
    reposIsRefreshing: makeSearchReposIsRefreshingByQuerySelector(query),
    usersIsRefreshing: makeSearchUsersIsRefreshingByQuerySelector(query),
    reposHasMore: makeSearchReposHasMoreByQuerySelector(query),
    usersHasMore: makeSearchUsersHasMoreByQuerySelector(query),
  });

  return state => selector(state);
};

const mapDispatchToProps = dispatch => ({
  searchReposIfNeeded: query => dispatch(searchReposIfNeeded(query)),
  searchReposMore: query => dispatch(searchReposMoreIfNeeded(query)),
  searchReposReload: query =>
    dispatch(searchRepos(query, { isRefreshing: true })),
  searchUsersIfNeeded: query => dispatch(searchUsersIfNeeded(query)),
  searchUsersMore: query => dispatch(searchUsersMoreIfNeeded(query)),
  searchUsersReload: query =>
    dispatch(searchUsers(query, { isRefreshing: true })),
});

export const SearchScreen = connect(makeSelector, mapDispatchToProps)(Search);
