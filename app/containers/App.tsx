import React from 'react';

import styles from './App.css';

interface AppProps {
  children: React.ReactNode;
  loading: boolean;
  loadingMessage: string;
};

export default class App extends React.Component<AppProps> {
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
        <TopBar user={this.props.user} />
        {loading}
        {this.props.children}
      </div>
    );
  }
}
