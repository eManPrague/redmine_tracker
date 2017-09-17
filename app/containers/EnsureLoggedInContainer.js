// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Route } from 'react-router';

// Actions
import { userLogIn } from '../actions/user';

// Components
import TopBar from '../components/TopBar';
import HomePage from './HomePage';

class EnsureLoggedInContainer extends Component {
  props: {
    isLoggedIn: boolean,
    onNavigateTo: (dest: string) => any,
    loadUser: (server: string, token: string) => void,
    user: any,
    server: ?string,
    token: ?string
  }

  componentDidMount() {
    const {
      onNavigateTo,
      isLoggedIn,
      user,
      server,
      token,
      loadUser
    } = this.props;

    if (!isLoggedIn) {
      // set the current url/path for future redirection (we use a Redux action) then
      // redirect (we use a React Router method)
      onNavigateTo('/login');
    } else if (!user && server.length > 0 && token.length > 0) {
      // ensure user is valid when reopen application
      loadUser(server, token);
    }
  }

  render() {
    // User is logged out or we want to wait until auto login success
    if (!this.props.isLoggedIn || !this.props.user) {
      return null;
    }

    return (
      <div>
        <TopBar user={this.props.user} />
        <div>
          <Route exact path="/" component={HomePage} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const user = state.get('user');

  return {
    isLoggedIn: user.get('isLoggedIn'),
    server: user.get('server'),
    token: user.get('token'),
    user: user.get('user')
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onNavigateTo: (dest: string) => {
    dispatch(push(dest));
  },
  loadUser: (server: string, token: string): void => {
    dispatch(userLogIn(server, token));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EnsureLoggedInContainer);
