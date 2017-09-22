// @flow
import * as React from 'react';
import { Route, Switch } from 'react-router';

// Import containers
import App from './containers/App';
import EnsureLoggedInContainer from './containers/EnsureLoggedInContainer';
import LoginPage from './containers/LoginPage';

export default () => (
  <App>
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route component={EnsureLoggedInContainer} />
    </Switch>
  </App>
);
