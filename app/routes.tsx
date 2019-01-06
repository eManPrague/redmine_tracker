// @flow
import React, { Component } from 'react';
import { Route, Switch } from 'react-router';

// Import containers
import App from './containers/App';
import EnsureLoggedInContainer from './containers/EnsureLoggedInContainer';
import LoginPage from './containers/LoginPage';

export default class Routes extends Component<{}> {
  render() {
    return (
      <App>
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route component={EnsureLoggedInContainer} />
        </Switch>
      </App>
    );
  }
}
