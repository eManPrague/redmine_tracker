// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import styles from './App.css';

type Props = {
  children: typeof React.Node,
  loading: boolean,
  loadingMessage: string
};

class App extends React.Component<Props> {
  props: Props;

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

    /* eslint-disable flowtype-errors/show-errors */
    return (
      <div className={styles.container}>
        {loading}
        {this.props.children}
      </div>
    );
    /* eslint-enable flowtype-errors/show-errors */
  }
}

const mapStateToProps = (state) => {
  const ui = state.get('ui');

  return {
    loading: ui.get('loading').size > 0,
    loadingMessage: ui.get('message')
  };
};

export default withRouter(connect(mapStateToProps)(App));
