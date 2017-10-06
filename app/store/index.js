import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import createLogger from 'redux-logger';
import {
  forwardToMain,
  forwardToRenderer,
  replayActionMain,
  replayActionRenderer
} from 'electron-redux';

import rootReducer from '../reducers';

export default function configureStore(initialState, scope = 'main', history = null) {
  // Redux configuration
  let middleware = [];
  const enhancers = [];

  // Thunk
  middleware.push(thunk);

  // Promise
  middleware.push(promise);

  // Logging
  const logger = createLogger({
    level: scope === 'main' ? undefined : 'info',
    collapsed: true,
  });
  middleware.push(logger);

  if (scope === 'renderer') {
    const browserMiddleware = routerMiddleware(history);
    middleware.push(browserMiddleware);

    middleware = [
      forwardToMain,
      ...middleware,
    ];
  }

  if (scope === 'main') {
    middleware = [
      ...middleware,
      forwardToRenderer,
    ];
  }

  let enhancer = [];

  // Apply Middleware & Compose Enhancers
  enhancers.push(applyMiddleware(...middleware));

  if (scope === 'renderer') {
    // If Redux DevTools Extension is installed use it, otherwise use Redux compose
    /* eslint-disable no-underscore-dangle */
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    /* eslint-enable no-underscore-dangle */

    enhancer = composeEnhancers(...enhancers);
  } else {
    enhancer = compose(...enhancers);
  }

  // Create Store
  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers')) // eslint-disable-line global-require
    );
  }

  if (scope === 'main') {
    replayActionMain(store);
  } else {
    replayActionRenderer(store);
  }

  return store;
}
