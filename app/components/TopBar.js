// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

// Actions
import { userLogOut } from '../actions/user';

// Styles
import styles from './TopBar.css';

class TopBar extends Component {
  props: {
    logoutUser: () => void,
    user: any
  };

  handleLogout = () => {
    this.props.logoutUser();
  }

  handleRefresh = () => {
    // TODO
  }

  render() {
    const user = this.props.user;
    const userName = `${user.get('firstname')} ${user.get('lastname')}`;

    return (
      <div className={styles.header}>
        <div className={styles.login_info}>
          {userName}
        </div>
        <div className={styles.action_buttons}>
          <button type="button" onClick={this.handleRefresh} className={styles.reload_button} />
          <button type="button" onClick={this.handleLogout} className={styles.logout_button} />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  logoutUser: () => {
    dispatch(userLogOut());
  }
});

export default connect(undefined, mapDispatchToProps)(TopBar);
