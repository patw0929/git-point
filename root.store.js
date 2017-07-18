import { createStore, applyMiddleware } from 'redux';
import { autoRehydrate } from 'redux-persist';
import { composeWithDevTools } from 'remote-redux-devtools'; // eslint-disable-line import/no-extraneous-dependencies
import ApiClient from 'api/ApiClient';
import createMiddleware from 'middleware/clientMiddleware';
import { rootReducer } from './root.reducer';

const client = new ApiClient();
const middlewares = [createMiddleware(client)];

let enhancer;

if (__DEV__) {
  const composeEnhancers = composeWithDevTools({
    name: 'debugger',
    hostname: 'localhost',
    port: 5678,
    suppressConnectErrors: false,
  });

  enhancer = composeEnhancers(applyMiddleware(...middlewares));
} else {
  enhancer = applyMiddleware(...middlewares);
}

const getEnhancers = () => {
  const enhancers = [enhancer];

  enhancers.push(autoRehydrate());

  return enhancers;
};

export const configureStore = createStore(rootReducer, {}, ...getEnhancers());
