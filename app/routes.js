// @flow
import React from 'react';
import { Route, IndexRoute } from 'react-router';

// Import containers
import App from './containers/App';
import EnsureLoggedInContainer from './containers/EnsureLoggedInContainer';
import HomePage from './containers/HomePage';
import LoginPage from './containers/LoginPage';

export default (
  <Route path="/" component={App}>
    <Route path="/login" component={LoginPage} />
    <Route component={EnsureLoggedInContainer}>
      <IndexRoute component={HomePage} />
    </Route>
  </Route>
);
