// @flow
import React, { Component } from 'react';
import type { Children } from 'react';
import { connect } from 'react-redux';

import styles from './App.css';

class App extends Component {
  props: {
    children: Children,
    loading: boolean,
    loadingMessage: string
  };

  render() {
    let loading = null;

    if (this.props.loading) {
      loading = (
        <div className={styles.overlay}>
          <div className={styles.loading}>
            {this.props.loadingMessage}
          </div>
        </div>
      );
    }

    return (
      <div className={styles.container}>
        {loading}
        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const ui = state.get('ui');

  return {
    loading: ui.get('loading').size > 0,
    loadingMessage: ui.get('message')
  };
};

export default connect(mapStateToProps)(App);
