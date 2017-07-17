import { compose, createStore, applyMiddleware } from 'redux';
import { autoRehydrate } from 'redux-persist';
import createLogger from 'redux-logger';
import ApiClient from 'api/ApiClient';
import createMiddleware from 'middleware/clientMiddleware';
import { rootReducer } from './root.reducer';

const client = new ApiClient();

const getMiddleware = () => {
  const middlewares = [createMiddleware(client)];

  if (__DEV__) {
    if (process.env.LOGGER_ENABLED) {
      middlewares.push(createLogger());
    }
  }

  return applyMiddleware(...middlewares);
};

const getEnhancers = () => {
  const enhancers = [];

  enhancers.push(autoRehydrate());

  return enhancers;
};

export const configureStore = createStore(
  rootReducer,
  compose(getMiddleware(), ...getEnhancers())
);
