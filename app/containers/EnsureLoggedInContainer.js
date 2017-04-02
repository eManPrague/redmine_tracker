// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

// Actions
import { userLogIn } from '../actions/user';

// Components
import TopBar from '../components/TopBar';

class EnsureLoggedInContainer extends Component {
  props: {
    isLoggedIn: boolean,
    onNavigateTo: () => void,
    loadUser: () => void,
    user: any,
    server: string,
    token: string,
    children: React$Element<*>
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
          {this.props.children}
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
  loadUser: (server: string, token: string) => {
    dispatch(userLogIn(server, token));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EnsureLoggedInContainer);
