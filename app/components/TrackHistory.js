// @flow
import React, { Component } from 'react';

// Styles
import styles from './TrackHistory.css';

export default class TrackHistory extends Component {
  props: {
    items: Array<any>,
    title: string
  };

  render() {
    const itemCount = this.props.items.length;

    return (
      <div>
        <div className={styles.small_caption}>
          {this.props.title} ({itemCount})
        </div>
      </div>
    );
  }
}
