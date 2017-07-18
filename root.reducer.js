import { combineReducers } from 'redux';
import { authReducer } from 'auth';
import { userReducer } from 'user';
import { repositoryReducer } from 'repository';
import { organizationReducer } from 'organization';
import { issueReducer } from 'issue';
import { searchReposReducer, searchUsersReducer } from 'search';
import { notificationsReducer } from 'notifications';

export const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  repository: repositoryReducer,
  organization: organizationReducer,
  issue: issueReducer,
  search: combineReducers({
    repos: searchReposReducer,
    users: searchUsersReducer,
  }),
  notifications: notificationsReducer,
});
