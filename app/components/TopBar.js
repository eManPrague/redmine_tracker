// @flow
import React, { Component } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';

// Actions
import { userLogOut } from '../actions/user';
import resetData from '../actions/data';

// Styles
import styles from './TopBar.css';

type Props = {
  logoutUser: () => void,
  refreshData: () => void,
  currentEntry: Immutable.Map<string, mixed>,
  user: Immutable.Map<string, mixed>
};

class TopBar extends Component<Props> {
  props: Props;

  handleLogout = () => {
    this.props.logoutUser();
  }

  handleRefresh = () => {
    this.props.refreshData();
  }

  currentNotCounting = (): boolean => {
    const entry = this.props.currentEntry;
    return entry.get('startTime') === 0;
  }

  render() {
    const user = this.props.user;

    if (!user) {
      return null;
    }

    const userName = `${user.get('firstname')} ${user.get('lastname')}`;

    return (
      <div className={styles.header}>
        <div className={styles.login_info}>
          {userName}
        </div>
        <div className={styles.action_buttons}>
          <button type="button" onClick={this.handleRefresh} disabled={!this.currentNotCounting()} className={styles.reload_button} />
          <button type="button" onClick={this.handleLogout} className={styles.logout_button} />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  logoutUser: () => {
    dispatch(userLogOut());
  },
  refreshData: () => {
    dispatch(resetData());
  }
});

const mapStateToProps = (state) => ({
  currentEntry: state.get('entries').get('current')
});

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
