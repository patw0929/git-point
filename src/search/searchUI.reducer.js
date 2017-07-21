import { SEARCH_REPOS, SEARCH_USERS } from './search.type';

const initialState = {
  keyword: '',
  type: 0,
};

export function searchUIReducer(state = initialState, action = {}) {
  switch (action.type) {
    case SEARCH_REPOS.PENDING:
    case SEARCH_REPOS.ERROR:
    case SEARCH_REPOS.SUCCESS: {
      return {
        keyword: action.query,
        type: 0,
      };
    }
    case SEARCH_USERS.PENDING:
    case SEARCH_USERS.ERROR:
    case SEARCH_USERS.SUCCESS: {
      return {
        keyword: action.query,
        type: 1,
      };
    }
    default:
      return state;
  }
}
