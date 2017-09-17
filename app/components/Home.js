// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

// Actions + components
import { removeUser } from '../actions/user';
import TrackDialog from './TrackDialog';
import TrackHistory from './TrackHistory';

// Styles
import styles from './Home.css';

class Home extends Component {
  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <TrackDialog />
          <TrackHistory title="Last entries" items={[]} />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  logoutUser: () => {
    dispatch(removeUser());
  }
});

export default connect(undefined, mapDispatchToProps)(Home);
